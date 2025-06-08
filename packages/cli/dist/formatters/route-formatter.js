import chalk from 'chalk';
import Table from 'cli-table3';
export class RouteFormatter {
    formatRoute(route) {
        const header = chalk.blue.bold('📊 Best Route Found');
        const separator = chalk.gray('─'.repeat(50));
        const steps = route.steps.map((step, index) => {
            const arrow = index < route.steps.length - 1 ? ' → ' : '';
            return chalk.white(`${step.tokenIn.symbol}`) +
                chalk.gray(` (${step.dex.name})`) +
                chalk.white(arrow);
        }).join('');
        const finalToken = route.steps[route.steps.length - 1]?.tokenOut.symbol || '';
        const routePath = steps + chalk.white(finalToken);
        const details = [
            `${chalk.cyan('Input Amount:')} ${this.formatAmount(route.totalAmountIn)}`,
            `${chalk.green('Output Amount:')} ${this.formatAmount(route.totalAmountOut)}`,
            `${chalk.yellow('Gas Estimate:')} ${route.gasEstimate.toLocaleString()}`,
            `${chalk.red('Price Impact:')} ${route.priceImpact}%`
        ].join('\n');
        return [header, separator, routePath, separator, details].join('\n');
    }
    formatTable(route) {
        const table = new Table({
            head: ['Step', 'DEX', 'From', 'To', 'Amount In', 'Amount Out', 'Fee'],
            colWidths: [6, 12, 8, 8, 15, 15, 8]
        });
        route.steps.forEach((step, index) => {
            table.push([
                (index + 1).toString(),
                step.dex.name,
                step.tokenIn.symbol,
                step.tokenOut.symbol,
                this.formatAmount(step.amountIn),
                this.formatAmount(step.amountOut),
                `${step.fee / 10000}%`
            ]);
        });
        return table.toString();
    }
    formatAmount(amount) {
        const num = parseFloat(amount);
        if (num >= 1e9)
            return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6)
            return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3)
            return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(6);
    }
}
//# sourceMappingURL=route-formatter.js.map