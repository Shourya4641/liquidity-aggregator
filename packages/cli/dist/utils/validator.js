import { isValidAddress } from '@liquidity-aggregator/core';
export class TokenValidator {
    validateToken(input) {
        if (!input || input.trim().length === 0) {
            return 'Token address or symbol is required';
        }
        const trimmed = input.trim();
        // Check if it's an address
        if (trimmed.startsWith('0x')) {
            if (!isValidAddress(trimmed)) {
                return 'Invalid Ethereum address format';
            }
        }
        else {
            // Check if it's a valid symbol (2-10 characters, alphanumeric)
            if (!/^[A-Za-z0-9]{2,10}$/.test(trimmed)) {
                return 'Token symbol must be 2-10 alphanumeric characters';
            }
        }
        return true;
    }
    validateAmount(input) {
        if (!input || input.trim().length === 0) {
            return 'Amount is required';
        }
        const amount = parseFloat(input.trim());
        if (isNaN(amount)) {
            return 'Amount must be a valid number';
        }
        if (amount <= 0) {
            return 'Amount must be greater than 0';
        }
        if (amount > 1e18) {
            return 'Amount is too large';
        }
        return true;
    }
    validateSlippage(input) {
        if (!input || input.trim().length === 0) {
            return 'Slippage is required';
        }
        const slippage = parseFloat(input.trim());
        if (isNaN(slippage)) {
            return 'Slippage must be a valid number';
        }
        if (slippage < 0 || slippage > 50) {
            return 'Slippage must be between 0 and 50%';
        }
        return true;
    }
}
//# sourceMappingURL=validator.js.map