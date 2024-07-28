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
  selectedNetwork: NetworkName.Mainnet,
  program: null,
  setSelectedNetwork: () => {},
});

export function useSession() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkName>(
    NetworkName.Mainnet,
  );
  const [program, setProgram] = useState<Program<CrowdfundingProgram> | null>(
    null,
  );
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useEffect(() => {
    let provider: anchor.Provider;

    const programId = getProgamId(selectedNetwork);

    try {
      provider = anchor.getProvider();
    } catch {
      provider = new anchor.AnchorProvider(connection, wallet!, {
        commitment: 'confirmed',
      });
      anchor.setProvider(provider);
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
