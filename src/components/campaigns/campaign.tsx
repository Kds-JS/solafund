'use client';

import { getTimeRemaining } from '@/utils';
import { CalendarIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import React, { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { DonationModal } from './donation-modal';
import { SessionContext } from '../wallets/sessions';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import {
  cancelCampaign,
  cancelDonation,
  claimDonations,
} from '@/services/programs';
import { PublicKey } from '@solana/web3.js';
import { CampaignData } from '@/types';
import { delay } from '@/utils/delay';
import { usePathname } from 'next/navigation';

export interface CampaignDetailProps {
  campaign: CampaignData;
  handleUpdateCampaign?: () => void;
}

export const CampaignDetail = ({
  campaign: {
    projectTitle,
    orgName,
    description,
    raised,
    goal,
    imageLink,
    projectLink,
    pdaAddress,
    startTimestamp,
    endTimestamp,
    donationCompleted,
    isClaimed,
  },
  handleUpdateCampaign,
}: CampaignDetailProps) => {
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboard');

  const raisedPercent = Math.floor((raised / goal) * 100);
  const {
    days: startDays,
    hours: startHours,
    minutes: startMinutes,
    seconds: startSeconds,
    end: started,
  } = getTimeRemaining(startTimestamp);
  const { days, hours, minutes, seconds, end } = getTimeRemaining(endTimestamp);
  const currentTime = new Date().getTime();

  const { program } = useContext(SessionContext);
  const { publicKey } = useWallet();

  async function updateCampaignData() {
    if (handleUpdateCampaign) {
      await delay(3000);
      handleUpdateCampaign();
    }
  }

  async function handleClaimDonations() {
    if (program && publicKey) {
      try {
        const campaign = new PublicKey(pdaAddress);
        await claimDonations(program, campaign);
        toast.success('donations claimed');
        updateCampaignData();
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.error('connect your wallet');
    }
  }

  async function handleCancelDonation() {
    if (program && publicKey) {
      try {
        const campaign = new PublicKey(pdaAddress);
        await cancelDonation(program, campaign, publicKey);
        toast.success('donation cancelled');
        updateCampaignData();
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.error('connect your wallet');
    }
  }

  async function handleCancelCampaign() {
    if (program && publicKey) {
      try {
        const campaign = new PublicKey(pdaAddress);
        await cancelCampaign(program, campaign);
        toast.success('campaign cancelled');
        updateCampaignData();
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.error('connect your wallet');
    }
  }

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

                <div
                  className={`flex min-w-[70px] flex-col gap-[5px] rounded-sm ${donationCompleted ? 'bg-green-500' : 'bg-blue-500'} p-1 font-semibold`}
                >
                  <span className="text-[12px]">Goal</span>
                  <span className="text-[14px]">{goal} SOL</span>
                </div>
              </div>

              <Progress value={raisedPercent} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[5px] text-[12px] font-bold">
                <span>
                  <CalendarIcon height={20} width={20} />
                </span>

                {started ? (
                  <p>Campaign Started</p>
                ) : (
                  <p>
                    {'start in '}
                    {startDays > 0 && (
                      <span>
                        {startDays} {startDays > 1 ? 'days' : 'day'}
                      </span>
                    )}
                    {startDays <= 0 && startHours > 0 && (
                      <span>{startHours} hours</span>
                    )}
                    {startDays <= 0 && startHours <= 0 && startMinutes > 0 && (
                      <span>{startMinutes} minutes</span>
                    )}
                    {startDays <= 0 &&
                      startHours <= 0 &&
                      startMinutes <= 0 &&
                      startSeconds >= 0 && <span>{startSeconds} seconds</span>}
                  </p>
                )}
              </div>

              {started && (
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
                      {days <= 0 &&
                        hours <= 0 &&
                        minutes <= 0 &&
                        seconds >= 0 && <span>{seconds} seconds</span>}
                      {' left'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isDashboard && (
          <div className="mt-[20px] flex items-center justify-between">
            <Button
              disabled={!end || (end && raisedPercent < 100) || isClaimed}
              onClick={handleClaimDonations}
            >
              {isClaimed ? 'Donation claimed' : 'Withdraw donation'}
            </Button>

            <Button
              variant={'outline'}
              onClick={handleCancelCampaign}
              disabled={startTimestamp < currentTime}
            >
              Cancel campaign
            </Button>
          </div>
        )}

        {!isDashboard && (
          <div className="mt-[20px] flex items-center justify-between">
            <DonationModal
              pdaAddress={pdaAddress}
              startTimestamp={startTimestamp}
              endTimestamp={endTimestamp}
              raisedPercent={raisedPercent}
              handleUpdateCampaign={updateCampaignData}
            />

            <Button
              variant={'outline'}
              disabled={!end || (end && raisedPercent >= 100)}
              onClick={handleCancelDonation}
            >
              Cancel donation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
