import { BaseAdapter } from './base-adapter';
import { Token, Pool } from '../types';
export declare class PancakeSwapV3Adapter extends BaseAdapter {
    constructor();
    getAmountOut(amountIn: string, tokenIn: Token, tokenOut: Token): Promise<string>;
    getPools(tokenA: Token, tokenB: Token): Promise<Pool[]>;
    simulateSwap(amountIn: string, tokenIn: Token, tokenOut: Token): Promise<{
        amountOut: string;
        gasEstimate: number;
        priceImpact: number;
    }>;
}
//# sourceMappingURL=pancakeswap-v3.d.ts.map