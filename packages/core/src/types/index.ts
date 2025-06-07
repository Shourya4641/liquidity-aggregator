export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
}

export interface Pool {
  id: string;
  tokenA: Token;
  tokenB: Token;
  fee: number;
  liquidity: string;
  sqrtPriceX96?: string;
  dex: DEX;
}

export interface DEX {
  name: string;
  version: string;
  chainId: number;
  factoryAddress: string;
  routerAddress: string;
}

export interface RouteStep {
  dex: DEX;
  pool: Pool;
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  amountOut: string;
  fee: number;
}

export interface Route {
  steps: RouteStep[];
  totalAmountIn: string;
  totalAmountOut: string;
  totalFee: number;
  gasEstimate: number;
  priceImpact: number;
}

export interface SwapResult {
  success: boolean;
  route: Route;
  actualAmountOut?: string;
  txHash?: string;
  gasUsed?: number;
  error?: string;
}

export interface QuoteRequest {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  chainId: number;
  slippage?: number;
}

export interface QuoteResponse {
  routes: Route[];
  bestRoute: Route;
  timestamp: number;
}