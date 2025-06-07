import { Token, Pool, DEX } from '../types';

export abstract class BaseAdapter {
  protected dex: DEX;

  constructor(dex: DEX) {
    this.dex = dex;
  }

  abstract getAmountOut(amountIn: string, tokenIn: Token, tokenOut: Token): Promise<string>;
  abstract getPools(tokenA: Token, tokenB: Token): Promise<Pool[]>;
  abstract simulateSwap(amountIn: string, tokenIn: Token, tokenOut: Token): Promise<{
    amountOut: string;
    gasEstimate: number;
    priceImpact: number;
  }>;
}