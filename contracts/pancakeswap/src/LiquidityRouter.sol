// SPDX-License-Identifier: MIT

// Layout of Contract:
// version
// imports
// interfaces, libraries, contracts
// errors
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions

pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {RouteStructs} from "./libraries/RouteStructs.sol";
import {IPancakeV3Factory} from "./interfaces/IPancakeV3Factory.sol";
import {IQuoterV2} from "./interfaces/IQuoterV2.sol";
import {IPancakeV3Pool} from "./interfaces/IPancakeV3Pool.sol";

contract LiquidityRouter is ReentrancyGuard {
    /////////////////////////////////////
    ///////////  ERRORS  ////////////////
    /////////////////////////////////////

    error LiquidityRouter__TokenInAndTokenOutAreTheSame();
    error LiquidityRouter__TokenAmountInIsZero();
    error LiquidityRouter__NoRouteFound();

    ////////////////////////////////////////////////
    ///////////  TYPE DECLARATIONS  ////////////////
    ////////////////////////////////////////////////

    using RouteStructs for *;

    //////////////////////////////////////////////
    ///////////  STATE VARIABLES  ////////////////
    //////////////////////////////////////////////

    // PancakeSwap V3 addresses on ETH MAINNET Chain
    address private constant FACTORY = 0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865;
    address private constant QUOTER_V2 = 0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997;

    uint24[] private s_feeTiers = [100, 500, 2500, 10000];

    IPancakeV3Factory private immutable i_factory;
    IQuoterV2 private immutable i_quoterV2;

    /////////////////////////////////////
    ///////////  EVENTS  ////////////////
    /////////////////////////////////////

    event RouteFound(
        address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut, address[] path
    );

    //////////////////////////////////////////
    ///////////  CONSTRUCTOR  ////////////////
    //////////////////////////////////////////

    constructor() {
        i_factory = IPancakeV3Factory(FACTORY);
        i_quoterV2 = IQuoterV2(QUOTER_V2);
    }

    /////////////////////////////////////////////////
    ///////////  EXTERNAL FUNCTIONS  ////////////////
    /////////////////////////////////////////////////

    /**
     * @notice Get the best route for swapping tokens
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param amountIn Amount of input token
     * @return result contain the optimal path and expected output
     */
    function getBestRoute(address tokenIn, address tokenOut, uint256 amountIn)
        external
        returns (RouteStructs.RouteResult memory result)
    {
        if (tokenIn == tokenOut) {
            revert LiquidityRouter__TokenInAndTokenOutAreTheSame();
        }

        if (amountIn <= 0) {
            revert LiquidityRouter__TokenAmountInIsZero();
        }

        RouteStructs.RouteCandidate[] memory routes = _findRoutes(tokenIn, tokenOut, amountIn);

        if (routes.length == 0) {
            revert LiquidityRouter__NoRouteFound();
        }

        // select the best route
        uint256 bestRouteIndex = _selectBestRoute(routes);
        RouteStructs.RouteCandidate memory bestRoute = routes[bestRouteIndex];

        // build the pool array
        address[] memory pools = new address[](bestRoute.path.length - 1);

        for (uint256 i = 0; i < pools.length; i++) {
            pools[i] = i_factory.getPool(bestRoute.path[i], bestRoute.path[i + 1], bestRoute.fees[i]);
        }

        result = RouteStructs.RouteResult({
            amountOut: bestRoute.expectedAmountOut,
            path: bestRoute.path,
            pools: pools,
            fees: bestRoute.fees,
            gasEstimate: bestRoute.gasEstimate
        });

        emit RouteFound(tokenIn, tokenOut, amountIn, bestRoute.expectedAmountOut, bestRoute.path);
    }

    function _quoteDirectSwap(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn)
        external
        returns (uint256 amountOut, uint256 gasEstimate)
    {
        (amountOut,,, gasEstimate) = i_quoterV2.quoteExactInputSingle(
            IQuoterV2.QuoteExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                amountIn: amountIn,
                sqrtPriceLimitX96: 0
            })
        );
    }

    function _quoteMultiHopSwap(
        address tokenIn,
        address intermediateToken,
        address tokenOut,
        uint24 fee1,
        uint24 fee2,
        uint256 amountIn
    ) external returns (uint256 amountOut, uint256 gasEstimate) {
        bytes memory path = abi.encodePacked(tokenIn, fee1, intermediateToken, fee2, tokenOut);

        (amountOut,,, gasEstimate) =
            i_quoterV2.quoteExactInput(IQuoterV2.QuoteExactInputParams({path: path, amountIn: amountIn}));
    }

    /**
     * @notice Get all the tokens connected to the given token
     * @param token address of the token to discover connections for
     * @return connectedTokens array of connected token addresses
     */
    function discoverConnectedTokens(address token) external view returns (address[] memory connectedTokens) {
        address[] memory tempTokens = new address[](1000);
        uint256 count = 0;

        // get the total number of pools
        uint256 totalPools = i_factory.allPoolsLength();

        for (uint256 i = 0; i < totalPools && count < 1000; i++) {
            address pool = i_factory.allPools(i);

            if (pool == address(0)) {
                continue;
            }

            try IPancakeV3Pool(pool).token0() returns (address token0) {
                try IPancakeV3Pool(pool).token1() returns (address token1) {
                    address connectedToken = token0 == token ? token1 : token0;

                    if (connectedToken != address(0) && !_arrayContains(tempTokens, count, connectedToken)) {
                        tempTokens[count] = connectedToken;
                        count++;
                    }
                } catch {}
            } catch {}
        }

        connectedTokens = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            connectedTokens[i] = tempTokens[i];
        }
    }

    /////////////////////////////////////////////////
    ///////////  INTERNAL FUNCTIONS  ////////////////
    /////////////////////////////////////////////////

    /**
     * @param tokenIn address of input token
     * @param tokenOut address of output token
     * @param amountIn amount of input token
     * @return routes contain the optimal path and expected output
     */
    function _findRoutes(address tokenIn, address tokenOut, uint256 amountIn)
        internal
        returns (RouteStructs.RouteCandidate[] memory routes)
    {
        RouteStructs.RouteCandidate[] memory intermediateRoutes = new RouteStructs.RouteCandidate[](500);
        uint256 routesCount = 0;

        // single hop route
        for (uint256 i = 0; i < s_feeTiers.length; i++) {
            address pool = i_factory.getPool(tokenIn, tokenOut, s_feeTiers[i]);
            if (pool != address(0)) {
                try this._quoteDirectSwap(tokenIn, tokenOut, s_feeTiers[i], amountIn) returns (
                    uint256 amountOut, uint256 gasEstimate
                ) {
                    if (amountOut > 0) {
                        address[] memory path = new address[](2);
                        path[0] = tokenIn;
                        path[1] = tokenOut;

                        uint24[] memory fees = new uint24[](1);
                        fees[0] = s_feeTiers[i];

                        intermediateRoutes[routesCount] = RouteStructs.RouteCandidate({
                            path: path,
                            fees: fees,
                            expectedAmountOut: amountOut,
                            gasEstimate: gasEstimate
                        });
                        routesCount++;
                    }
                } catch {}
            }
        }

        // multi hop route
        address[] memory intermediateTokens = this.discoverConnectedTokens(tokenIn);

        for (uint256 i = 0; i < intermediateTokens.length && routesCount < 450; i++) {
            address intermediateToken = intermediateTokens[i];

            if (intermediateToken == tokenOut) {
                continue;
            }

            // check intermediateToken -> tokenOut exists
            bool hasSecondHop = false;
            for (uint256 j = 0; j < s_feeTiers.length; j++) {
                if (i_factory.getPool(intermediateToken, tokenOut, s_feeTiers[j]) != address(0)) {
                    hasSecondHop = true;
                    break;
                }
            }

            if (!hasSecondHop) {
                continue;
            }

            // try all combination of fee tiers
            for (uint256 fee1 = 0; fee1 < s_feeTiers.length; fee1++) {
                address pool1 = i_factory.getPool(tokenIn, intermediateToken, s_feeTiers[fee1]);
                if (pool1 == address(0)) {
                    continue;
                }

                for (uint256 fee2 = 0; fee2 < s_feeTiers.length; fee2++) {
                    address pool2 = i_factory.getPool(intermediateToken, tokenOut, s_feeTiers[fee2]);
                    if (pool2 == address(0)) {
                        continue;
                    }

                    try this._quoteMultiHopSwap(
                        tokenIn, intermediateToken, tokenOut, s_feeTiers[fee1], s_feeTiers[fee2], amountIn
                    ) returns (uint256 amountOut, uint256 gasEstimate) {
                        if (amountOut > 0) {
                            address[] memory path = new address[](3);
                            path[0] = tokenIn;
                            path[1] = intermediateToken;
                            path[2] = tokenOut;

                            uint24[] memory fees = new uint24[](2);
                            fees[0] = s_feeTiers[fee1];
                            fees[1] = s_feeTiers[fee2];

                            intermediateRoutes[routesCount] = RouteStructs.RouteCandidate({
                                path: path,
                                fees: fees,
                                expectedAmountOut: amountOut,
                                gasEstimate: gasEstimate
                            });

                            routesCount++;
                        }
                    } catch {}
                }

                if (routesCount >= 450) {
                    break;
                }
            }
        }
        routes = new RouteStructs.RouteCandidate[](routesCount);
        for (uint256 i = 0; i < routesCount; i++) {
            routes[i] = intermediateRoutes[i];
        }
    }

    /////////////////////////////////////////////////
    ///////////  VIEW & PURE FUNCTIONS  /////////////
    /////////////////////////////////////////////////

    function _arrayContains(address[] memory array, uint256 length, address target) internal pure returns (bool) {
        for (uint256 i = 0; i < length; i++) {
            if (array[i] == target) {
                return true;
            }
        }
        return false;
    }

    function _selectBestRoute(RouteStructs.RouteCandidate[] memory routes)
        internal
        pure
        returns (uint256 bestRouteIndex)
    {
        uint256 bestAmountOut = 0;

        for (uint256 i = 0; i < routes.length; i++) {
            // prefer the route with the highest amount out and gas fee as tie breaker
            if (
                routes[i].expectedAmountOut > bestAmountOut
                    || (
                        routes[i].expectedAmountOut == bestAmountOut
                            && routes[i].gasEstimate < routes[bestRouteIndex].gasEstimate
                    )
            ) {
                bestRouteIndex = i;
                bestAmountOut = routes[i].expectedAmountOut;
            }
        }
    }

    function getPoolsForPair(address token0, address token1)
        external
        view
        returns (RouteStructs.PoolInfo[] memory pools)
    {
        pools = new RouteStructs.PoolInfo[](s_feeTiers.length);
        uint256 validPoolsCount = 0;

        for (uint256 i = 0; i < s_feeTiers.length; i++) {
            address pool = i_factory.getPool(token0, token1, s_feeTiers[i]);
            if (pool != address(0)) {
                try IPancakeV3Pool(pool).liquidity() returns (uint128 liquidity) {
                    if (liquidity > 0) {
                        pools[validPoolsCount] = RouteStructs.PoolInfo({
                            pool: pool,
                            token0: IPancakeV3Pool(pool).token0(),
                            token1: IPancakeV3Pool(pool).token1(),
                            fee: s_feeTiers[i],
                            liquidity: liquidity
                        });
                        validPoolsCount++;
                    }
                } catch {}
            }
        }

        assembly {
            mstore(pools, validPoolsCount)
        }
    }
}
