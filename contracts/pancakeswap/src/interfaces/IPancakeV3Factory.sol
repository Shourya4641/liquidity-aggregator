// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IPancakeV3Factory {
    function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool);
    function allPools(uint256) external view returns (address pool);
    function allPoolsLength() external view returns (uint256);
}
