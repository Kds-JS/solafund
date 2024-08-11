'use client';

import React, { useContext, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CampaignDetail } from '@/components';
import { CampaignData } from '@/types';
import { SessionContext } from '@/components/wallets/sessions';
import { fetchCampaign } from '@/programs/crowdfunding';

interface CampaignProps {
  pda: string;
}

export const Campaign = ({ pda }: CampaignProps) => {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const { selectedNetwork } = useContext(SessionContext);

  async function getCampaign() {
    try {
      const newCampaign = await fetchCampaign(selectedNetwork, pda);
      setCampaign(newCampaign);
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
      </CardContent>
    </Card>
  );
};
