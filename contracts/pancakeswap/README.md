Top 3 DEXs on Ethereum:

1. Pancakeswap - infinity
2. Uniswap - v4
3. Curve

Understanding the contract flow of PancakeSwap:

1. implements a 3-tiered modular architecture - that consists of the Vault(Accounting Layer), Pool Managers(AMM Layer), and Hooks(Optional Hook Layer). 

Concepts:

Concentrated liquidity

Ticks:
 - p(i) = 1.0001^i, where i is the tick index.

Notes:

- When fetching a quote for a swap, the underlying logic needs to consider the current tick, the tickSpacing, and the liquidity distribution across various ticks within the potential swap path to calculate the output amount accurately. 
- Aggregators need to understand ticks to determine the available liquidity at different price points within a pool.
- When calculating a swap quote, the sqrtPriceX96 and tick values from slot0 are the starting points. 
- Monitoring slot0 allows applications to track price movements and the current tick. 
-  For a liquidity aggregator, reading slot0 is often the first step in assessing the current state and price of a V3 pool before determining the best swap path.
-  P = price(token1) / price(token0). The sqrtPriceX96 value is sqrt(P) * 2^96.
-  sqrtPriceX96 is the definitive representation of the instantaneous price in a PancakeSwap V3 pool. 
-  When fetching a quote, an aggregator or interface must read the current sqrtPriceX96 from slot0 and use it (along with liquidity data) to simulate the swap outcome.