'use client';

import React, { useContext, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CampaignDetail, Contributions } from '@/components';
import { CampaignData, ContributionData } from '@/types';
import { SessionContext } from '@/components/wallets/sessions';
import { fetchCampaign, fetchContributionList } from '@/programs/crowdfunding';

interface CampaignProps {
  pda: string;
}

export const Campaign = ({ pda }: CampaignProps) => {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [contributions, setContributions] = useState<ContributionData[]>([]);
  const { selectedNetwork } = useContext(SessionContext);

  async function getCampaign() {
    try {
      const newCampaign = await fetchCampaign(selectedNetwork, pda);
      setCampaign(newCampaign);
      const newContributions = await fetchContributionList(
        selectedNetwork,
        pda,
      );
      setContributions(newContributions);
    } catch (error: any) {
      setCampaign(null);
      console.log(error);
    }
  }

  useEffect(() => {
    getCampaign();
  }, [selectedNetwork]);

  return (
    <Card className="mt-6 min-h-[calc(100vh_-_220px)] rounded-lg border-none">
      <CardContent className="p-6">
        {campaign && (
          <CampaignDetail
            campaign={campaign}
            handleUpdateCampaign={getCampaign}
          />
        )}
        <Contributions className="mt-[36px]" contributions={contributions} />
      </CardContent>
    </Card>
  );
};
