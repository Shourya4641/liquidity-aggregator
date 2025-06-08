import chalk from 'chalk';
import ora from 'ora';

export abstract class BaseCommand {
  protected spinner = ora();

  protected log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      error: chalk.red,
      warn: chalk.yellow
    };

    console.log(colors[type](message));
  }

  protected startSpinner(text: string) {
    this.spinner.start(text);
  }

  protected stopSpinner(success: boolean = true, text?: string) {
    if (success) {
      this.spinner.succeed(text);
    } else {
      this.spinner.fail(text);
    }
  }

  abstract execute(): Promise<void>;
}