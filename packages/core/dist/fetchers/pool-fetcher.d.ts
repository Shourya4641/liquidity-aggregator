import { Pool, Token } from '../types';
export declare class PoolFetcher {
    private configLoader;
    constructor();
    getPoolsForPair(tokenA: Token, tokenB: Token): Promise<Pool[]>;
    getAllPools(chainId: number): Promise<Pool[]>;
    getPoolById(poolId: string): Promise<Pool | null>;
}
//# sourceMappingURL=pool-fetcher.d.ts.map