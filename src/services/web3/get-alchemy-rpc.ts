'use server';

import { NetworkName } from '@/types';
const ALCHEMY_SOLANA_MAINNET = process.env.ALCHEMY_SOLANA_MAINNET as string;
const ALCHEMY_SOLANA_DEVNET = process.env.ALCHEMY_SOLANA_DEVNET as string;

export async function getAlchemyRpcUrl(network: NetworkName): Promise<string> {
  const alchemySolanaMainnet = ALCHEMY_SOLANA_MAINNET;
  const alchemySolanaDevnet = ALCHEMY_SOLANA_DEVNET;

  return network === NetworkName.Mainnet
    ? alchemySolanaMainnet
    : alchemySolanaDevnet;
}
