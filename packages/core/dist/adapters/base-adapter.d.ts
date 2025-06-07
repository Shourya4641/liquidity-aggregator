import { Token, Pool, DEX } from '../types';
export declare abstract class BaseAdapter {
    protected dex: DEX;
    constructor(dex: DEX);
    abstract getAmountOut(amountIn: string, tokenIn: Token, tokenOut: Token): Promise<string>;
    abstract getPools(tokenA: Token, tokenB: Token): Promise<Pool[]>;
    abstract simulateSwap(amountIn: string, tokenIn: Token, tokenOut: Token): Promise<{
        amountOut: string;
        gasEstimate: number;
        priceImpact: number;
    }>;
}
//# sourceMappingURL=base-adapter.d.ts.map