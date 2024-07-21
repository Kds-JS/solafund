'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const DonationModal = () => {
  const [amount, setAmount] = useState(0);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Fund this project</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <p className="text-[22px] font-bold">Enter the donation amount:</p>
        <form className="mt-[20px]">
          <div className="mb-[20px] flex flex-col gap-[5px]">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <span className="text-sm">Amount in SOL</span>
          </div>
          <Button type="submit" className="w-full">
            Pay Now
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
