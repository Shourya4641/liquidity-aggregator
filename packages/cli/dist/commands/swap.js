import inquirer from 'inquirer';
import { BaseCommand } from './base-command';
import { Router } from '@liquidity-aggregator/core';
import { RouteFormatter } from '../formatters/route-formatter';
import { TokenValidator } from '../utils/validator';
export class SwapCommand extends BaseCommand {
    router;
    formatter;
    validator;
    constructor() {
        super();
        this.router = new Router();
        this.formatter = new RouteFormatter();
        this.validator = new TokenValidator();
    }
    async execute() {
        try {
            this.log('🔄 Execute Token Swap', 'info');
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'tokenIn',
                    message: 'Token In (address or symbol):',
                    validate: (input) => this.validator.validateToken(input)
                },
                {
                    type: 'input',
                    name: 'tokenOut',
                    message: 'Token Out (address or symbol):',
                    validate: (input) => this.validator.validateToken(input)
                },
                {
                    type: 'input',
                    name: 'amount',
                    message: 'Amount to swap:',
                    validate: (input) => this.validator.validateAmount(input)
                },
                {
                    type: 'input',
                    name: 'slippage',
                    message: 'Slippage tolerance (%):',
                    default: '0.5',
                    validate: (input) => this.validator.validateSlippage(input)
                }
            ]);
            this.startSpinner('Finding best route...');
            const route = await this.router.findBestRoute(answers.tokenIn, answers.tokenOut, answers.amount);
            if (!route) {
                this.stopSpinner(false, 'No route found');
                return;
            }
            this.stopSpinner(true, 'Route found!');
            console.log('\n' + this.formatter.formatRoute(route));
            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Execute this swap?',
                    default: false
                }
            ]);
            if (!confirm) {
                this.log('Swap cancelled', 'warn');
                return;
            }
            // Placeholder for actual swap execution
            this.log('⚠️  Swap execution not yet implemented (Phase 1)', 'warn');
            this.log('This will be added in future phases', 'info');
        }
        catch (error) {
            this.stopSpinner(false, 'Failed to execute swap');
            this.log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    }
}
//# sourceMappingURL=swap.js.map