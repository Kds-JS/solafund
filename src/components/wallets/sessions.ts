'use client';

import { NetworkName, SolanaNetworkDictionary } from '@/types';
import React, { useState, useEffect } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import { IDL, CrowdfundingProgram, getProgamId } from '@/programs/crowdfunding';
import { clusterApiUrl } from '@solana/web3.js';

export const SessionContext = React.createContext<{
  selectedNetwork: NetworkName;
  program: Program<CrowdfundingProgram> | null;
  setSelectedNetwork: any;
}>({
  selectedNetwork: NetworkName.Devnet,
  program: null,
  setSelectedNetwork: () => {},
});

export function useSession() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkName>(
    NetworkName.Devnet,
  );
  const [program, setProgram] = useState<Program<CrowdfundingProgram> | null>(
    null,
  );
  const wallet = useAnchorWallet();

  useEffect(() => {
    if (wallet) {
      const connection = new anchor.web3.Connection(
        clusterApiUrl(SolanaNetworkDictionary[selectedNetwork]),
      );
      let provider: anchor.Provider = new anchor.AnchorProvider(
        connection,
        wallet,
        {
          commitment: 'confirmed',
        },
      );
      anchor.setProvider(provider);

      const programId = getProgamId(selectedNetwork);

      const program = new anchor.Program(IDL, programId, provider);
      setProgram(program);
    }
  }, [selectedNetwork, wallet]);

  return {
    selectedNetwork,
    program,
    setSelectedNetwork,
  };
}
