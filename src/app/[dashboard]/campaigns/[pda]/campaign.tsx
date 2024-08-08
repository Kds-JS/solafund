'use client';

import React, { useContext, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CampaignDetail } from '@/components';
import { CampaignData, IPFS_BASE_URL } from '@/types';
import { SessionContext } from '@/components/wallets/sessions';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'react-toastify';

interface CampaignProps {
  pda: string;
}

export const Campaign = ({ pda }: CampaignProps) => {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const { program } = useContext(SessionContext);
  const { publicKey } = useWallet();

  async function getCampaignList() {
    if (program && publicKey) {
      try {
        const campaignData = await program.account.campaign.fetch(pda);

        const newCampaign: CampaignData = {
          orgName: campaignData.orgName,
          projectTitle: campaignData.title,
          description: campaignData.description,
          raised: campaignData.totalDonated.toNumber(),
          goal: campaignData.goal.toNumber() / LAMPORTS_PER_SOL,
          imageLink: `${IPFS_BASE_URL}/${campaignData.projectImage}`,
          projectLink: campaignData.projectLink,
          pdaAddress: pda,
          startTimestamp: campaignData.startAt.toNumber() * 1000,
          endTimestamp: campaignData.endAt.toNumber() * 1000,
        };

        setCampaign(newCampaign);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  }

  useEffect(() => {
    getCampaignList();
  }, [program, publicKey]);

  return (
    <Card className="mt-6 min-h-[calc(100vh_-_220px)] rounded-lg border-none">
      <CardContent className="p-6">
        {campaign && (
          <CampaignDetail
            isDashboard={true}
            projectTitle={campaign.projectTitle}
            orgName={campaign.orgName}
            description={campaign.description}
            raised={campaign.raised}
            goal={campaign.goal}
            imageLink={campaign.imageLink}
            projectLink={campaign.projectLink}
            pdaAddress={campaign.pdaAddress}
            startTimestamp={campaign.startTimestamp}
            endTimestamp={campaign.endTimestamp}
          />
        )}
      </CardContent>
    </Card>
  );
};
