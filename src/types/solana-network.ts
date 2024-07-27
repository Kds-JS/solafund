import { Cluster } from '@solana/web3.js';

export enum NetworkName {
  Mainnet = 'Mainnet',
  Devnet = 'Devnet',
}

export type NetworkDictionary<T = string> = {
  [K in keyof typeof NetworkName]: T;
};

export const SolanaNetworkDictionary: NetworkDictionary<Cluster> = {
  [NetworkName.Mainnet]: 'mainnet-beta',
  [NetworkName.Devnet]: 'devnet',
};

/**
 * Associates a solana network to its name.
 */
export const TestChainToMainnetName: Record<Cluster, NetworkName> = {
  'mainnet-beta': NetworkName.Mainnet,
  devnet: NetworkName.Devnet,
  testnet: NetworkName.Devnet,
};
