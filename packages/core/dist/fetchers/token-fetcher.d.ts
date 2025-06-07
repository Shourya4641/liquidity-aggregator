import { Token } from '../types';
export declare class TokenFetcher {
    private configLoader;
    constructor();
    getToken(address: string, chainId: number): Promise<Token | null>;
    getTokenBySymbol(symbol: string, chainId: number): Promise<Token | null>;
    getCommonTokens(chainId: number): Promise<Token[]>;
}
//# sourceMappingURL=token-fetcher.d.ts.map