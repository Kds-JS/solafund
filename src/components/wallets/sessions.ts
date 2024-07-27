'use client';
import { NetworkName } from '@/types';
import React, { useState } from 'react';

export const SessionContext = React.createContext<{
  setSelectedNetwork: () => void;
  selectedNetwork: NetworkName;
}>({
  setSelectedNetwork: () => {},
  selectedNetwork: NetworkName.Mainnet,
});

export function useSession() {
  let [selectedNetwork, setSelectedNetwork] = useState<NetworkName>(
    NetworkName.Mainnet,
  );

  return {
    selectedNetwork,
    setSelectedNetwork,
  };
}
