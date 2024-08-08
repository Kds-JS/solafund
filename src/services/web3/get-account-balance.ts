'use server';

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { NetworkName } from '@/types';
import { getAlchemyRpcUrl } from '@/services/web3';

export async function getAccountBalance(
  walletAddress: string,
  network: NetworkName,
): Promise<number> {
  const wallet = new PublicKey(walletAddress);
  const rpcUrl = await getAlchemyRpcUrl(network);
  const connection = new Connection(rpcUrl, 'confirmed');
  let balance = 0;
  try {
    balance = (await connection.getBalance(wallet)) / LAMPORTS_PER_SOL;
  } catch (error) {
    balance = 0;
  }
  return balance;
}
