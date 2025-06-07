import * as fs from 'fs/promises';
import * as path from 'path';
import { Token, DEX } from '../types';

export class ConfigLoader {
  private configPath: string;

  constructor() {
    this.configPath = path.join(__dirname, '../../../config');
  }

  async getTokens(): Promise<Token[]> {
    try {
      const tokensFile = await fs.readFile(path.join(this.configPath, 'tokens.json'), 'utf-8');
      return JSON.parse(tokensFile);
    } catch (error) {
      console.warn('Failed to load tokens config, using empty array');
      return [];
    }
  }

  async getDEXs(): Promise<DEX[]> {
    try {
      const dexFile = await fs.readFile(path.join(this.configPath, 'dex-config.json'), 'utf-8');
      return JSON.parse(dexFile);
    } catch (error) {
      console.warn('Failed to load DEX config, using empty array');
      return [];
    }
  }

  async getNetworks(): Promise<any> {
    try {
      const networksFile = await fs.readFile(path.join(this.configPath, 'networks.json'), 'utf-8');
      return JSON.parse(networksFile);
    } catch (error) {
      console.warn('Failed to load networks config, using empty object');
      return {};
    }
  }
}