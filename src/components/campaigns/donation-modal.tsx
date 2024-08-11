'use client';

import React, { useContext, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PublicKey } from '@solana/web3.js';
import { toast } from 'react-toastify';
import { donate } from '@/services/programs';
import { useWallet } from '@solana/wallet-adapter-react';
import { SessionContext } from '../wallets/sessions';

interface DonationModalProps {
  pdaAddress: string;
  startTimestamp: number;
  endTimestamp: number;
  handleUpdateCampaign: () => void;
}

export const DonationModal = ({
  pdaAddress,
  startTimestamp,
  endTimestamp,
  handleUpdateCampaign,
}: DonationModalProps) => {
  const [amount, setAmount] = useState(0);
  const currentTime = new Date().getTime();
  const ref = React.useRef();

  const { program } = useContext(SessionContext);
  const { publicKey } = useWallet();

  async function handleSubmit() {
    if (amount <= 0) {
      toast.error('amount must be greater than 0');
      return;
    }

    if (program && publicKey) {
      try {
        const campaign = new PublicKey(pdaAddress);
        await donate(program, campaign, publicKey, amount);
        toast.success('donation successfull');
        handleUpdateCampaign();
        (ref as any).current?.click();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild ref={ref as any}>
        <Button
          disabled={startTimestamp > currentTime || endTimestamp < currentTime}
        >
          Fund this project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <p className="text-[22px] font-bold">Enter the donation amount:</p>
        <div className="mt-[20px]">
          <div className="mb-[20px] flex flex-col gap-[5px]">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <span className="text-sm">Amount in SOL</span>
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Pay Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
