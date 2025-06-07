import { ConfigLoader } from './config-loader';
export class TokenFetcher {
    configLoader;
    constructor() {
        this.configLoader = new ConfigLoader();
    }
    async getToken(address, chainId) {
        const tokens = await this.configLoader.getTokens();
        return tokens.find(token => token.address.toLowerCase() === address.toLowerCase() &&
            token.chainId === chainId) || null;
    }
    async getTokenBySymbol(symbol, chainId) {
        const tokens = await this.configLoader.getTokens();
        return tokens.find(token => token.symbol.toLowerCase() === symbol.toLowerCase() &&
            token.chainId === chainId) || null;
    }
    async getCommonTokens(chainId) {
        const tokens = await this.configLoader.getTokens();
        return tokens.filter(token => token.chainId === chainId);
    }
}
//# sourceMappingURL=token-fetcher.js.map