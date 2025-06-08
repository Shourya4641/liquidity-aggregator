import chalk from 'chalk';
import ora from 'ora';
export class BaseCommand {
    spinner = ora();
    log(message, type = 'info') {
        const colors = {
            info: chalk.blue,
            success: chalk.green,
            error: chalk.red,
            warn: chalk.yellow
        };
        console.log(colors[type](message));
    }
    startSpinner(text) {
        this.spinner.start(text);
    }
    stopSpinner(success = true, text) {
        if (success) {
            this.spinner.succeed(text);
        }
        else {
            this.spinner.fail(text);
        }
    }
}
//# sourceMappingURL=base-command.js.map