import * as fs from 'fs/promises';
import * as path from 'path';
export class ConfigLoader {
    configPath;
    constructor() {
        this.configPath = path.join(__dirname, '../../../config');
    }
    async getTokens() {
        try {
            const tokensFile = await fs.readFile(path.join(this.configPath, 'tokens.json'), 'utf-8');
            return JSON.parse(tokensFile);
        }
        catch (error) {
            console.warn('Failed to load tokens config, using empty array');
            return [];
        }
    }
    async getDEXs() {
        try {
            const dexFile = await fs.readFile(path.join(this.configPath, 'dex-config.json'), 'utf-8');
            return JSON.parse(dexFile);
        }
        catch (error) {
            console.warn('Failed to load DEX config, using empty array');
            return [];
        }
    }
    async getNetworks() {
        try {
            const networksFile = await fs.readFile(path.join(this.configPath, 'networks.json'), 'utf-8');
            return JSON.parse(networksFile);
        }
        catch (error) {
            console.warn('Failed to load networks config, using empty object');
            return {};
        }
    }
}
//# sourceMappingURL=config-loader.js.map