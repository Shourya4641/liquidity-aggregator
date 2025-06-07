import { Token } from '../types';
import { ConfigLoader } from './config-loader';

export class TokenFetcher {
  private configLoader: ConfigLoader;

  constructor() {
    this.configLoader = new ConfigLoader();
  }

  async getToken(address: string, chainId: number): Promise<Token | null> {
    const tokens = await this.configLoader.getTokens();
    return tokens.find(token => 
      token.address.toLowerCase() === address.toLowerCase() && 
      token.chainId === chainId
    ) || null;
  }

  async getTokenBySymbol(symbol: string, chainId: number): Promise<Token | null> {
    const tokens = await this.configLoader.getTokens();
    return tokens.find(token => 
      token.symbol.toLowerCase() === symbol.toLowerCase() && 
      token.chainId === chainId
    ) || null;
  }

  async getCommonTokens(chainId: number): Promise<Token[]> {
    const tokens = await this.configLoader.getTokens();
    return tokens.filter(token => token.chainId === chainId);
  }
}