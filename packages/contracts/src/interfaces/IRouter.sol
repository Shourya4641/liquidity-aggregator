// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

interface IRouter {
    struct RouteStep {
        address dex;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOut;
        bytes swapData;
    }

    struct RouteData {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOut;
        RouteStep[] steps;
        uint256 gasEstimate;
    }

    struct SwapSimulation {
        bool success;
        uint256 amountOut;
        uint256 gasUsed;
        uint256 priceImpact; // in basis points
    }

    function findBestRoute(address tokenIn, address tokenOut, uint256 amountIn)
        external
        view
        returns (RouteData memory);

    function simulateSwap(address tokenIn, address tokenOut, uint256 amountIn, bytes calldata routeData)
        external
        view
        returns (SwapSimulation memory);

    function executeSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        bytes calldata routeData
    ) external returns (uint256 amountOut);
}
