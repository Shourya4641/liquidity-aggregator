import chalk from 'chalk';
export function formatError(error) {
    return chalk.red(`❌ ${error.message}`);
}
export function formatSuccess(message) {
    return chalk.green(`✅ ${message}`);
}
export function formatWarning(message) {
    return chalk.yellow(`⚠️  ${message}`);
}
export function formatInfo(message) {
    return chalk.blue(`ℹ️  ${message}`);
}
export function clearScreen() {
    process.stdout.write('\x1Bc');
}
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=helpers.js.map