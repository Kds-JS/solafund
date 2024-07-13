export function truncateAddress(
  address: string,
  prefixLength = 4,
  suffixLength = 4,
) {
  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);

  return `${prefix}...${suffix}`;
}
