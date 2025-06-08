# Terminal-Based Liquidity Aggregator - Complete Roadmap

## 📋 Table of Contents
1. [High-Level Architecture](#high-level-architecture)
2. [Data Fetching Strategy Comparison](#data-fetching-strategy-comparison)
3. [Project Structure](#project-structure)
4. [Development Phases](#development-phases)
5. [Routing Algorithm Design](#routing-algorithm-design)
6. [Quote Validation & Revalidation](#quote-validation--revalidation)
7. [Gas Estimation Strategy](#gas-estimation-strategy)
8. [Modular Adapter System](#modular-adapter-system)
9. [Implementation Steps](#implementation-steps)
10. [Recommended Libraries & Tools](#recommended-libraries--tools)
11. [Testing Strategy](#testing-strategy)

## 1. High-Level Architecture

### Off-Chain Components (TypeScript + viem)
- **CLI Interface**: Input parsing and result display
- **Route Engine**: Core routing logic and optimization
- **DEX Adapters**: Modular interfaces for different DEXs
- **Quote Fetchers**: Subgraph and RPC-based data sources
- **Gas Estimator**: Transaction cost calculation
- **Validator**: Quote revalidation before execution

### On-Chain Components (Foundry)
- **Router Contract**: Execute multi-DEX swaps
- **DEX Interface Contracts**: Standardized interfaces for each DEX
- **Quote Helpers**: View functions for live price quotes
- **Gas Optimization**: Batch calls and efficient routing

### Data Flow
```
User Input → Route Engine → Quote Fetchers → Route Optimization → Validation → Output
```

## 2. Data Fetching Strategy Comparison

### Subgraph Approach (The Graph)
**Pros:**
- Fast queries with complex filtering
- Historical data access
- Lower RPC usage (cost-effective)
- Better for discovery (finding all pools)

**Cons:**
- 5-15 minute data lag
- Dependency on indexer uptime
- Less accurate for high-frequency trading
- Complex GraphQL queries

**Best for:** Pool discovery, historical analysis, cost optimization

### Live RPC Approach
**Pros:**
- Real-time data (no lag)
- Most accurate quotes
- Direct blockchain interaction
- No third-party dependencies

**Cons:**
- Higher RPC costs
- Slower for large datasets
- Rate limiting concerns
- More complex batching needed

**Best for:** Final quote validation, real-time accuracy

### Hybrid Strategy (Recommended)
1. **Discovery Phase**: Use subgraphs to find relevant pools
2. **Quote Phase**: Use RPC for real-time quotes on discovered pools
3. **Validation Phase**: Final RPC validation before execution

## 3. Project Structure

```
liquidity-aggregator/
├── packages/
│   ├── contracts/          # Foundry contracts
│   │   ├── src/
│   │   │   ├── Router.sol
│   │   │   ├── interfaces/
│   │   │   ├── adapters/
│   │   │   └── libraries/
│   │   └── test/
│   ├── core/              # TypeScript core logic
│   │   ├── src/
│   │   │   ├── engine/    # Routing engine
│   │   │   ├── adapters/  # DEX adapters
│   │   │   ├── fetchers/  # Data fetchers
│   │   │   ├── types/     # TypeScript types
│   │   │   └── utils/     # Utilities
│   │   └── test/
│   └── cli/               # CLI application
│       ├── src/
│       │   ├── commands/
│       │   ├── formatters/
│       │   └── index.ts
│       └── package.json
├── config/
│   ├── networks.json
│   ├── tokens.json
│   └── dex-config.json
└── docs/
```

## 4. Development Phases

### Phase 1: Foundation (Week 1-2)
- Set up project structure with Foundry and TypeScript
- Implement basic CLI interface
- Create core types and interfaces
- Set up testing framework

### Phase 2: Data Layer (Week 2-3)
- Implement subgraph queries for Uniswap V4 and PancakeSwap V3
- Create RPC-based quote fetchers
- Build token list management system
- Implement basic pool discovery

### Phase 3: Routing Engine (Week 3-4)
- Design and implement path-finding algorithm
- Create route optimization logic
- Implement incremental split testing
- Add gas estimation integration

### Phase 4: Validation & Execution (Week 4-5)
- Build quote revalidation system
- Implement slippage protection
- Create route execution simulator
- Add comprehensive error handling

### Phase 5: Optimization & Testing (Week 5-6)
- Performance optimization
- Comprehensive testing suite
- Documentation and examples
- Prepare for contract development

## 5. Routing Algorithm Design

### Core Algorithm: Multi-Path Optimization

```typescript
interface RouteOption {
  dex: string;
  path: Token[];
  pools: Pool[];
  allocation: number; // Percentage of total input
  estimatedOutput: bigint;
  gasEstimate: bigint;
  impact: number; // Price impact percentage
}

interface OptimalRoute {
  routes: RouteOption[];
  totalOutput: bigint;
  totalGas: bigint;
  efficiency: number; // Output per gas ratio
}
```

### Step-by-Step Process:

1. **Path Discovery**
   - Find all possible paths (up to 5 hops) for each DEX
   - Filter by liquidity thresholds
   - Rank by expected efficiency

2. **Single-DEX Optimization**
   - For each viable path, calculate optimal input amount
   - Consider price impact and slippage
   - Generate base route options

3. **Cross-DEX Split Testing**
   - Test allocation splits: 0/100, 10/90, 20/80, ..., 100/0
   - For each split, optimize within each DEX
   - Calculate combined output and gas costs

4. **Route Scoring**
   ```typescript
   score = (estimatedOutput - gasCostInTokenOut) / totalGasUsed
   ```

5. **Final Selection**
   - Choose route with highest efficiency score
   - Apply minimum output thresholds
   - Validate against slippage limits

### Incremental Split Logic:

```typescript
async function findOptimalSplit(
  tokenIn: Token,
  tokenOut: Token,
  amountIn: bigint,
  dexAdapters: DexAdapter[]
): Promise<OptimalRoute> {
  const bestRoute: OptimalRoute = { routes: [], totalOutput: 0n, totalGas: 0n, efficiency: 0 };
  
  // Test different allocation combinations
  for (let allocation = 0; allocation <= 100; allocation += 10) {
    const split = await testAllocation(tokenIn, tokenOut, amountIn, allocation, dexAdapters);
    if (split.efficiency > bestRoute.efficiency) {
      bestRoute = split;
    }
  }
  
  // Fine-tune around best allocation (±5% in 1% increments)
  const refinedRoute = await refineAllocation(bestRoute, tokenIn, tokenOut, amountIn, dexAdapters);
  return refinedRoute;
}
```

## 6. Quote Validation & Revalidation

### Validation Pipeline:

1. **Initial Validation** (During Route Discovery)
   - Check pool liquidity sufficiency
   - Verify token pair exists
   - Validate price impact thresholds

2. **Pre-Execution Validation**
   - Refresh quotes using RPC calls
   - Recalculate price impact
   - Verify slippage tolerance
   - Check for significant price changes

3. **Revalidation Triggers**
   - Time-based: Every 30 seconds for active quotes
   - Event-based: On significant market movements
   - User-triggered: Before final execution confirmation

### Implementation:

```typescript
interface QuoteValidator {
  validateInitial(route: RouteOption): Promise<ValidationResult>;
  revalidate(route: RouteOption): Promise<ValidationResult>;
  shouldRevalidate(route: RouteOption, lastValidation: Date): boolean;
}

interface ValidationResult {
  isValid: boolean;
  updatedQuote?: bigint;
  priceChange?: number;
  warnings: string[];
  errors: string[];
}
```

## 7. Gas Estimation Strategy

### Multi-Layer Gas Estimation:

1. **Static Analysis**
   - Base gas costs per DEX operation
   - Additional costs for multi-hop swaps
   - Cross-DEX transaction overhead

2. **Dynamic Estimation**
   - Use `eth_estimateGas` for accurate predictions
   - Factor in current network congestion
   - Include safety margins (10-20%)

3. **Gas Price Oracle**
   - Fetch current gas prices from multiple sources
   - Implement different speed tiers (slow/standard/fast)
   - Allow user-defined gas price preferences

### Gas Cost Integration:

```typescript
interface GasEstimator {
  estimateSwapGas(route: RouteOption): Promise<bigint>;
  getCurrentGasPrice(speed: 'slow' | 'standard' | 'fast'): Promise<bigint>;
  calculateGasCostInToken(gasUsed: bigint, gasPrice: bigint, token: Token): Promise<bigint>;
}

// Include gas cost in route scoring
function calculateRouteScore(route: RouteOption, gasCostInOutputToken: bigint): number {
  const netOutput = route.estimatedOutput - gasCostInOutputToken;
  return Number(netOutput) / Number(route.gasEstimate);
}
```

## 8. Modular Adapter System

### DEX Adapter Interface:

```typescript
interface DexAdapter {
  name: string;
  version: string;
  
  // Pool discovery
  findPools(tokenA: Token, tokenB: Token): Promise<Pool[]>;
  
  // Quote generation
  getQuote(pool: Pool, tokenIn: Token, amountIn: bigint): Promise<Quote>;
  
  // Path finding
  findPath(tokenIn: Token, tokenOut: Token, maxHops: number): Promise<Path[]>;
  
  // Gas estimation
  estimateGas(path: Path, amountIn: bigint): Promise<bigint>;
  
  // Validation
  validateQuote(quote: Quote): Promise<boolean>;
}
```

### Implementation Examples:

```typescript
class UniswapV4Adapter implements DexAdapter {
  constructor(
    private subgraphUrl: string,
    private rpcProvider: PublicClient,
    private contractAddresses: UniswapV4Addresses
  ) {}
  
  async findPools(tokenA: Token, tokenB: Token): Promise<Pool[]> {
    // Implement Uniswap V4 specific pool discovery
  }
  
  async getQuote(pool: Pool, tokenIn: Token, amountIn: bigint): Promise<Quote> {
    // Implement Uniswap V4 specific quoting logic
  }
}

class PancakeSwapV3Adapter implements DexAdapter {
  // Similar implementation for PancakeSwap V3
}
```

### Adapter Registry:

```typescript
class AdapterRegistry {
  private adapters: Map<string, DexAdapter> = new Map();
  
  register(adapter: DexAdapter): void {
    this.adapters.set(adapter.name, adapter);
  }
  
  getAdapter(name: string): DexAdapter | undefined {
    return this.adapters.get(name);
  }
  
  getAllAdapters(): DexAdapter[] {
    return Array.from(this.adapters.values());
  }
}
```

## 9. Implementation Steps

### Step 1: Project Setup
```bash
# Initialize the project
mkdir liquidity-aggregator && cd liquidity-aggregator
forge init packages/contracts
npm init -y
npm install -w packages/core viem @types/node typescript ts-node
npm install -w packages/cli commander chalk
```

### Step 2: Core Types Definition
Create comprehensive TypeScript types for tokens, pools, routes, and quotes.

### Step 3: Basic CLI Structure
```typescript
// packages/cli/src/index.ts
import { Command } from 'commander';

const program = new Command();

program
  .name('liquidity-aggregator')
  .description('Terminal-based DEX liquidity aggregator')
  .version('1.0.0');

program
  .command('quote')
  .description('Get best route quote')
  .requiredOption('--token-in <address>', 'Input token address')
  .requiredOption('--token-out <address>', 'Output token address')
  .requiredOption('--amount <amount>', 'Input amount')
  .option('--max-hops <number>', 'Maximum hops (default: 3)', '3')
  .action(async (options) => {
    // Implement quote logic
  });
```

### Step 4: Subgraph Integration
```typescript
// Example GraphQL query for Uniswap V4
const POOLS_QUERY = `
  query GetPools($token0: String!, $token1: String!) {
    pools(
      where: {
        or: [
          { token0: $token0, token1: $token1 },
          { token0: $token1, token1: $token0 }
        ]
      }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      first: 10
    ) {
      id
      token0 { id symbol decimals }
      token1 { id symbol decimals }
      fee
      liquidity
      totalValueLockedUSD
    }
  }
`;
```

### Step 5: RPC Integration
```typescript
// Live quote fetching with viem
async function getLiveQuote(
  pool: Pool,
  tokenIn: Token,
  amountIn: bigint,
  client: PublicClient
): Promise<bigint> {
  const result = await client.readContract({
    address: pool.address,
    abi: poolAbi,
    functionName: 'getAmountOut',
    args: [amountIn, tokenIn.address]
  });
  
  return result;
}
```

### Step 6: Route Engine Implementation
Build the core routing algorithm with path finding and optimization logic.

### Step 7: Gas Estimation Integration
Implement comprehensive gas estimation for route comparison.

### Step 8: Validation System
Create quote validation and revalidation mechanisms.

### Step 9: Output Formatting
Design clean JSON output format for route results.

### Step 10: Testing & Optimization
Comprehensive testing with real mainnet data.

## 10. Recommended Libraries & Tools

### TypeScript/Node.js
- **viem**: Ethereum client library
- **commander**: CLI framework
- **chalk**: Terminal styling
- **axios**: HTTP requests for subgraphs
- **decimal.js**: Precise decimal arithmetic
- **jest**: Testing framework
- **graphql-request**: GraphQL client

### Foundry/Solidity
- **forge-std**: Testing utilities
- **openzeppelin-contracts**: Standard implementations
- **solmate**: Gas-optimized contracts

### Development Tools
- **hardhat-deploy**: Contract deployment
- **typechain**: TypeScript bindings for contracts
- **eslint/prettier**: Code formatting
- **husky**: Git hooks

### Monitoring & Analytics
- **tenderly**: Transaction simulation
- **etherscan**: Contract verification
- **dune**: Analytics queries

## 11. Testing Strategy

### Unit Tests
- Test each adapter independently
- Validate quote calculations
- Test route optimization algorithms
- Mock external dependencies

### Integration Tests
- Test end-to-end routing scenarios
- Validate against mainnet fork
- Test error handling and edge cases
- Performance benchmarking

### Test Data
```typescript
// Example test scenarios
const testCases = [
  {
    name: 'USDC to WETH - Direct swap',
    tokenIn: USDC_ADDRESS,
    tokenOut: WETH_ADDRESS,
    amountIn: parseUnits('1000', 6),
    expectedDexes: ['uniswap-v4', 'pancakeswap-v3']
  },
  {
    name: 'Obscure token swap - Multi-hop required',
    tokenIn: OBSCURE_TOKEN_ADDRESS,
    tokenOut: USDC_ADDRESS,
    amountIn: parseUnits('100', 18),
    maxHops: 3
  }
];
```

### Performance Benchmarks
- Quote fetching speed (target: <2 seconds)
- Route optimization time (target: <5 seconds)
- Gas estimation accuracy (target: ±10%)
- Memory usage optimization

---

## 🚀 Getting Started Checklist

1. ✅ Set up project structure with Foundry and TypeScript
2. ✅ Implement basic CLI interface with commander
3. ✅ Create core TypeScript types and interfaces
4. ✅ Set up testing framework (Jest)
5. ✅ Implement token list management
6. ✅ Create first DEX adapter (Uniswap V4)
7. ✅ Add subgraph integration
8. ✅ Implement basic routing algorithm
9. ✅ Add gas estimation
10. ✅ Create quote validation system
11. ✅ Add second DEX adapter (PancakeSwap V3)
12. ✅ Implement route optimization
13. ✅ Add comprehensive testing
14. ✅ Optimize performance
15. ✅ Document and prepare for contract phase

This roadmap provides a solid foundation for building your liquidity aggregator. Start with the basic structure and gradually add complexity. The modular design will make it easy to extend with additional DEXes later!
