'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  CardCampaign,
  CardCampaignProps,
} from '@/components/campaigns/card-campaign';
import { useWallet } from '@solana/wallet-adapter-react';
import { SessionContext } from '@/components/wallets/sessions';
import { CampaignData, IPFS_BASE_URL } from '@/types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const CampaignList = () => {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const { program } = useContext(SessionContext);
  const { publicKey } = useWallet();

  async function getCampaignList() {
    if (program && publicKey) {
      const allCampaigns = await program.account.campaign.all();

      const newCampaigns: CampaignData[] = allCampaigns.map(
        ({ account: campaignAccount, publicKey: campaignPublicKey }) => ({
          orgName: campaignAccount.orgName,
          projectTitle: campaignAccount.title,
          description: campaignAccount.description,
          raised: campaignAccount.totalDonated.toNumber(),
          goal: campaignAccount.goal.toNumber() / LAMPORTS_PER_SOL,
          imageLink: `${IPFS_BASE_URL}/${campaignAccount.projectImage}`,
          projectLink: campaignAccount.projectLink,
          pdaAddress: campaignPublicKey.toString(),
          endTimestamp: campaignAccount.endAt.toNumber() * 1000,
        }),
      );

      setCampaigns(newCampaigns);
    }
  }

  useEffect(() => {
    getCampaignList();
  }, [program, publicKey]);

  return (
    <Card className="mt-6 min-h-[calc(100vh_-_220px)] rounded-lg border-none">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign, index) => (
            <CardCampaign
              key={index}
              imageLink={campaign.imageLink}
              title={campaign.projectTitle}
              raised={campaign.raised}
              goal={campaign.goal}
              pdaAddress={campaign.pdaAddress}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
