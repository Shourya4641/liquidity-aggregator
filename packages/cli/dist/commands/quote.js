import inquirer from 'inquirer';
import { BaseCommand } from './base-command';
import { Router } from '@liquidity-aggregator/core';
import { RouteFormatter } from '../formatters/route-formatter';
import { TokenValidator } from '../utils/validator';
export class QuoteCommand extends BaseCommand {
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
            this.log('💱 Get Token Swap Quote', 'info');
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
            console.log('\n' + this.formatter.formatTable(route));
        }
        catch (error) {
            this.stopSpinner(false, 'Failed to get quote');
            this.log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    }
}
//# sourceMappingURL=quote.js.map