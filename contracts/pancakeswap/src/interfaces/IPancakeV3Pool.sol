// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IPancakeV3Pool {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function fee() external view returns (uint24);
    function liquidity() external view returns (uint128);
}
