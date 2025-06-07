export function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}
export function normalizeAddress(address) {
    return address.toLowerCase();
}
export function shortenAddress(address, chars = 4) {
    if (!isValidAddress(address))
        return address;
    return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
}
//# sourceMappingURL=address.js.map