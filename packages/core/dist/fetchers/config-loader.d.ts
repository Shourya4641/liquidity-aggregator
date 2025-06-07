import { Token, DEX } from '../types';
export declare class ConfigLoader {
    private configPath;
    constructor();
    getTokens(): Promise<Token[]>;
    getDEXs(): Promise<DEX[]>;
    getNetworks(): Promise<any>;
}
//# sourceMappingURL=config-loader.d.ts.map