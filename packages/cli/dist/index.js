#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { SwapCommand } from './commands/swap';
import { QuoteCommand } from './commands/quote';
const program = new Command();
program
    .name('liquidity-aggregator')
    .description('Terminal-based liquidity aggregator for Ethereum DEXs')
    .version('1.0.0');
program
    .command('swap')
    .description('Execute a token swap')
    .action(async () => {
    const swapCommand = new SwapCommand();
    await swapCommand.execute();
});
program
    .command('quote')
    .description('Get a quote for token swap')
    .action(async () => {
    const quoteCommand = new QuoteCommand();
    await quoteCommand.execute();
});
program
    .command('interactive')
    .alias('i')
    .description('Start interactive mode')
    .action(async () => {
    console.log(chalk.blue.bold('🚀 Liquidity Aggregator - Interactive Mode'));
    console.log(chalk.gray('Choose from the available commands below:\n'));
    const quoteCommand = new QuoteCommand();
    await quoteCommand.execute();
});
// Default to interactive mode if no command provided
if (process.argv.length <= 2) {
    program.parseAsync(['', '', 'interactive']);
}
else {
    program.parse();
}
//# sourceMappingURL=index.js.map