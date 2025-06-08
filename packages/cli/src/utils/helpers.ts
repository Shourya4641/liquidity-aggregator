import chalk from 'chalk';

export function formatError(error: Error): string {
  return chalk.red(`❌ ${error.message}`);
}

export function formatSuccess(message: string): string {
  return chalk.green(`✅ ${message}`);
}

export function formatWarning(message: string): string {
  return chalk.yellow(`⚠️  ${message}`);
}

export function formatInfo(message: string): string {
  return chalk.blue(`ℹ️  ${message}`);
}

export function clearScreen(): void {
  process.stdout.write('\x1Bc');
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}