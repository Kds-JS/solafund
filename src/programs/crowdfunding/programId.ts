import { NetworkName } from '@/types';
import { PublicKey } from '@solana/web3.js';

const MAINNET_PROGRAM_ID = process.env.NEXT_PUBLIC_MAINNET_PROGRAM_ID as string;
const DEVNET_PROGRAM_ID = process.env.NEXT_PUBLIC_DEVNET_PROGRAM_ID as string;

export function getProgamId(network: NetworkName): PublicKey {
  const programId = new PublicKey(
    network === NetworkName.Mainnet ? MAINNET_PROGRAM_ID : DEVNET_PROGRAM_ID,
  );

  return programId;
}
