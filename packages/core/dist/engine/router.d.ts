import { QuoteRequest, QuoteResponse, Route } from '../types';
export declare class Router {
    private pathFinder;
    private adapters;
    constructor();
    private initializeAdapters;
    getQuote(request: QuoteRequest): Promise<QuoteResponse>;
    findBestRoute(tokenIn: string, tokenOut: string, amountIn: string): Promise<Route | null>;
}
//# sourceMappingURL=router.d.ts.map