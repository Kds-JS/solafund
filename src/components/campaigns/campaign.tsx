'use client';

import { getTimeRemaining } from '@/utils';
import { CalendarIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/ui/button';
import { DonationModal } from './donation-modal';

export interface CampaignDetailProps {
  orgName: string;
  projectTitle: string;
  description: string;
  raised: number;
  goal: number;
  imageLink: string;
  projectLink: string;
  pdaAddress: string;
  endTimestamp: number;
  isDashboard?: boolean;
}

export const CampaignDetail = ({
  projectTitle,
  orgName,
  description,
  raised,
  goal,
  imageLink,
  projectLink,
  endTimestamp,
  isDashboard = false,
}: CampaignDetailProps) => {
  const raisedPercent = Math.floor((raised / goal) * 100);
  const { days, hours, minutes, seconds, end } = getTimeRemaining(endTimestamp);

  return (
    <div className="grid grid-cols-1 gap-[25px] md:grid-cols-3">
      <div className="relative hidden overflow-hidden rounded-md md:block">
        <Image
          objectFit="cover"
          layout="fill"
          src={imageLink}
          alt="campaign image"
          className="transition-all delay-100 hover:scale-125"
        />
      </div>

      <div className="md:col-span-2">
        <p className="text-[22px] font-bold">{projectTitle}</p>

        <a
          href={projectLink}
          target="_blank"
          className="my-[20px] flex items-center gap-[5px] font-bold"
        >
          {orgName}
          <ExternalLinkIcon height={22} width={22} />
        </a>

        <div className="grid grid-cols-1 gap-[15px] border-y-[2px] border-primary py-[15px] md:grid-cols-2 md:gap-0 md:py-0">
          <div className="border-primary md:border-r-[2px] md:py-[20px] md:pr-[15px]">
            <span className="text-[14px] font-bold">About Project</span>
            <p>{description}</p>
          </div>

          <div className="flex flex-col justify-between gap-[10px] md:py-[20px] md:pl-[15px]">
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[5px] font-semibold">
                  <span className="text-[12px]">Raised</span>
                  <span className="text-[14px]">{raised} SOL</span>
                </div>

                <div className="flex min-w-[70px] flex-col gap-[5px] rounded-sm bg-green-500 p-1 font-semibold">
                  <span className="text-[12px]">Goal</span>
                  <span className="text-[14px]">{goal} SOL</span>
                </div>
              </div>

              <Progress value={raisedPercent} />
            </div>

            <div className="flex items-center gap-[5px] text-[12px] font-bold">
              <span>
                <CalendarIcon height={20} width={20} />
              </span>

              {end ? (
                <p>Campaign End</p>
              ) : (
                <p>
                  {days > 0 && (
                    <span>
                      {days} {days > 1 ? 'days' : 'day'}
                    </span>
                  )}
                  {days <= 0 && hours > 0 && <span>{hours} hours</span>}
                  {days <= 0 && hours <= 0 && minutes > 0 && (
                    <span>{minutes} minutes</span>
                  )}
                  {days <= 0 && hours <= 0 && minutes <= 0 && seconds >= 0 && (
                    <span>{seconds} seconds</span>
                  )}
                  {' left'}
                </p>
              )}
            </div>
          </div>
        </div>

        {isDashboard && (
          <div className="mt-[20px] flex items-center justify-between">
            <Button disabled={!end || (end && raisedPercent < 100)}>
              Withdraw donation
            </Button>
          </div>
        )}

        {!isDashboard && (
          <div className="mt-[20px] flex items-center justify-between">
            <DonationModal />

            <Button
              variant={'outline'}
              disabled={!end || (end && raisedPercent >= 100)}
            >
              Cancel donation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
