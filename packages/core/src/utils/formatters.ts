import { Route, Token } from '../types';
import { formatUnits } from './decimals';

export function formatRoute(route: Route): string {
  const steps = route.steps.map(step => 
    `${step.tokenIn.symbol} → ${step.tokenOut.symbol} (${step.dex.name})`
  ).join(' → ');
  
  return `Route: ${steps}\nTotal Amount Out: ${route.totalAmountOut}\nGas Estimate: ${route.gasEstimate}`;
}

export function formatToken(token: Token): string {
  return `${token.symbol} (${token.name}) - ${token.address}`;
}

export function formatAmount(amount: string, decimals: number = 18): string {
  const formatted = formatUnits(BigInt(amount), decimals);
  return parseFloat(formatted).toLocaleString();
}