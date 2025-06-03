Top 3 DEXs on Ethereum:

1. Pancakeswap - infinity
2. Uniswap - v4
3. Curve

Concepts:

Concentrated liquidity

Ticks:
 - p(i) = 1.0001^i, where i is the tick index.

- Use the QuoterV2 contract to fetch the Swap Quote - 0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997

Notes:

- When fetching a quote for a swap, the underlying logic needs to consider the current tick, the tickSpacing, and the liquidity distribution across various ticks within the potential swap path to calculate the output amount accurately. 
- Aggregators need to understand ticks to determine the available liquidity at different price points within a pool.
- When calculating a swap quote, the sqrtPriceX96 and tick values from slot0 are the starting points. 
- Monitoring slot0 allows applications to track price movements and the current tick. 
- For a liquidity aggregator, reading slot0 is often the first step in assessing the current state and price of a V3 pool before determining the best swap path.
- P = price(token1) / price(token0). The sqrtPriceX96 value is sqrt(P) * 2^96.
- sqrtPriceX96 is the definitive representation of the instantaneous price in a PancakeSwap V3 pool. 
- When fetching a quote, an aggregator or interface must read the current sqrtPriceX96 from slot0 and use it (along with liquidity data) to simulate the swap outcome.
-  

Things to do:

- When we are fetching the quote of for a token from the quoteExactInput() then, if the path provided is for a single swap then will it work as expected?? -- I think it will work.
- And for getting the quote from the quoteExactInput() function, how do we decide the path?? It should be done dynamically right!!
- In the quoteExactInput(), the return amountIn is the required amountOut.