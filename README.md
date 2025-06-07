# Liquidity Aggregator - Phase 1 Scaffold

A terminal-based liquidity aggregator for Ethereum DEXs built as a monorepo.

## 🏗️ Project Structure

```
liquidity-aggregator/
├── packages/
│   ├── contracts/          # Foundry smart contracts
│   │   ├── src/
│   │   │   ├── Router.sol
│   │   │   ├── interfaces/
│   │   │   ├── libraries/
│   │   │   └── adapters/
│   │   └── foundry.toml
│   ├── core/              # TypeScript routing logic
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── engine/
│   │   │   ├── adapters/
│   │   │   ├── fetchers/
│   │   │   └── utils/
│   │   └── package.json
│   └── cli/               # Interactive command-line interface
│       ├── src/
│       │   ├── commands/
│       │   ├── formatters/
│       │   └── utils/
│       └── package.json
├── config/                # Shared configuration
│   ├── networks.json
│   ├── tokens.json
│   └── dex-config.json
├── tsconfig.json         # Shared TypeScript config
└── package.json          # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Foundry (for contracts)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build all packages:**
   ```bash
   npm run build
   ```

3. **Run the CLI:**
   ```bash
   npm run cli
   ```

### Development Commands

```bash
# Build all packages
npm run build

# Run tests
npm run test

# Start CLI in development mode
npm run cli

# Clean all build artifacts
npm run clean
```

## 📦 Package Details

### Contracts (`packages/contracts`)
- **Router.sol**: Main aggregation contract with placeholder functions
- **Interfaces**: Contract interfaces for DEX integrations
- **Libraries**: Helper libraries for routing logic
- **Adapters**: DEX-specific adapter contracts

### Core (`packages/core`)
- **Types**: TypeScript type definitions for tokens, routes, swaps
- **Engine**: Core routing and pathfinding logic
- **Adapters**: DEX integration adapters (Uniswap V4, PancakeSwap V3)
- **Fetchers**: Data fetching for tokens, pools, and configuration
- **Utils**: Helper utilities for addresses, decimals, formatting

### CLI (`packages/cli`)
- **Commands**: Interactive commands for quotes and swaps
- **Formatters**: Output formatting for routes and tables
- **Utils**: Input validation and helper functions

## 🎯 Phase 1 Features

✅ **Implemented:**
- Complete monorepo structure with proper TypeScript configuration
- Smart contract scaffolding with placeholder functions
- Core TypeScript types and interfaces
- CLI with interactive commands for quotes and swaps
- Mock routing logic that simulates DEX interactions
- Formatted output with tables and colored terminal output
- Input validation for tokens, amounts, and slippage
- Configuration loading from JSON files

⏳ **Not Yet Implemented (Future Phases):**
- Real DEX contract integrations
- Actual on-chain transaction execution
- Advanced routing algorithms
- Real-time price data fetching
- Test suites
- Gas optimization

## 🔧 Usage Examples

### Get a Quote
```bash
npm run cli
# Choose 'quote' and follow prompts
```

### Interactive Mode
```bash
npm run cli interactive
```

The CLI will prompt you for:
- Token In (address or symbol like "WETH", "USDC")
- Token Out (address or symbol)
- Amount to swap
- Slippage tolerance (for swaps)

## 🧪 Testing

Tests will be added in future phases. The current scaffold includes:
- Vitest configuration for the core package
- Foundry setup for contract testing

## 📄 Configuration

Configuration files in `/config`:
- `networks.json`: Network configurations for different chains
- `tokens.json`: Common token definitions
- `dex-config.json`: DEX addresses and configurations

## 🔮 Next Steps (Phase 2+)

1. **Real DEX Integration**: Connect to actual Uniswap V4 and PancakeSwap V3 contracts
2. **Advanced Routing**: Implement sophisticated pathfinding algorithms
3. **Testing**: Add comprehensive test suites
4. **On-chain Execution**: Enable real swap transactions
5. **Gas Optimization**: Optimize for gas efficiency
6. **Real-time Data**: Integrate with price feeds and pool data

## 🤝 Contributing

This is a Phase 1 scaffold. Future phases will include:
- Contribution guidelines
- Code style standards
- Testing requirements
- Pull request templates