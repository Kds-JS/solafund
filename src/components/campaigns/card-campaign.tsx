'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import Link from 'next/link';

export interface CardCampaignProps {
  imageLink: string;
  title: string;
  raised: number;
  goal: number;
  pdaAddress: string;
}

export const CardCampaign = ({
  imageLink,
  title,
  goal,
  raised,
  pdaAddress,
}: CardCampaignProps) => {
  const raisedPercent = Math.floor((raised / goal) * 100);

  return (
    <Link
      href={`/dashboard/campaigns/${pdaAddress}`}
      className="flex flex-col gap-[15px] rounded-md border p-[10px] shadow dark:shadow-gray-800"
    >
      <div className="relative h-[200px] w-full overflow-hidden">
        <Image
          objectFit="cover"
          layout="fill"
          src={imageLink}
          alt="campaign image"
          className="transition-all delay-100 hover:scale-125"
        />
      </div>

      <p className="font-semibold">{title}</p>

      <div className="flex flex-col gap-[10px]">
        <Progress value={raisedPercent} />

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[5px] font-semibold">
            <span className="text-[12px]">Raised</span>
            <span className="text-[14px]">{raised} SOL</span>
          </div>

          <div className="flex flex-col gap-[5px] font-semibold">
            <span className="text-[12px]">Goal</span>
            <span className="text-[14px]">{goal} SOL</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
