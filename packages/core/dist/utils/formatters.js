import { formatUnits } from './decimals';
export function formatRoute(route) {
    const steps = route.steps.map(step => `${step.tokenIn.symbol} → ${step.tokenOut.symbol} (${step.dex.name})`).join(' → ');
    return `Route: ${steps}\nTotal Amount Out: ${route.totalAmountOut}\nGas Estimate: ${route.gasEstimate}`;
}
export function formatToken(token) {
    return `${token.symbol} (${token.name}) - ${token.address}`;
}
export function formatAmount(amount, decimals = 18) {
    const formatted = formatUnits(BigInt(amount), decimals);
    return parseFloat(formatted).toLocaleString();
}
//# sourceMappingURL=formatters.js.map