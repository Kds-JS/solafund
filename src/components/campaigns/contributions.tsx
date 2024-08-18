'use client';

import { ContributionData, NetworkName } from '@/types';
import Link from 'next/link';
import { useContext } from 'react';
import { SessionContext } from '@/components/wallets';
import { truncateAddress } from '@/utils';

export interface ContributionsProps {
  contributions: ContributionData[];
  className?: string;
}

export const Contributions = ({
  contributions,
  className,
}: ContributionsProps) => {
  const { selectedNetwork } = useContext(SessionContext);
  return (
    <div className={`${className}`}>
      {contributions.length > 0 && (
        <p className="text-[18px] font-semibold">Contributions</p>
      )}
      <div className="h-[300px] overflow-auto">
        <div className="mt-[10px] grid grid-cols-1 gap-[5px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {contributions.map((item) => (
            <Link
              target="_blank"
              href={`https://explorer.solana.com/address/${item.contributor}${
                selectedNetwork === NetworkName.Devnet ? '?cluster=devnet' : ''
              }`}
              key={item.contributor}
              className="hover:underline"
            >
              <span>{truncateAddress(item.contributor)}</span>
              <span className="font-bold">{` ${item.amount}`} SOL</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
