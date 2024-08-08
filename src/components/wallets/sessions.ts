'use client';
import { NetworkName } from '@/types';
import React, { useState, useEffect } from 'react';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import { IDL, CrowdfundingProgram, getProgamId } from '@/programs/crowdfunding';

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
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useEffect(() => {
    let provider: anchor.Provider;

    const setAnchorProvider = () => {
      provider = new anchor.AnchorProvider(connection, wallet!, {
        commitment: 'confirmed',
      });
      anchor.setProvider(provider);
    };

    const programId = getProgamId(selectedNetwork);

    try {
      provider = anchor.getProvider();
      if (!provider.publicKey) {
        setAnchorProvider();
      }
    } catch {
      setAnchorProvider();
    }

    const program = new anchor.Program(IDL, programId);
    setProgram(program);
  }, [selectedNetwork, wallet]);

  return {
    selectedNetwork,
    program,
    setSelectedNetwork,
  };
}
