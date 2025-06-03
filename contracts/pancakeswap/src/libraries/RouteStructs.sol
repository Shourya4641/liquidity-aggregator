// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

library RouteStructs {
    struct RouteResult {
        uint256 amountOut;
        address[] path;
        address[] pools;
        uint24[] fees;
        uint256 gasEstimate;
    }

    struct PoolInfo {
        address pool;
        address token0;
        address token1;
        uint24 fee;
        uint128 liquidity;
    }

    struct RouteCandidate {
        address[] path;
        uint24[] fees;
        uint256 expectedAmountOut;
        uint256 gasEstimate;
    }
}
