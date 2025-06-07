import { Token, Pool, Route } from '../types';
export declare class PathFinder {
    findPaths(tokenIn: Token, tokenOut: Token, pools: Pool[]): Promise<Route[]>;
    findDirectPath(tokenIn: Token, tokenOut: Token, pools: Pool[]): Promise<Route | null>;
    findMultiHopPaths(tokenIn: Token, tokenOut: Token, pools: Pool[], maxHops?: number): Promise<Route[]>;
}
//# sourceMappingURL=pathfinder.d.ts.map