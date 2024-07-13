import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { truncateAddress } from '@/utils';

interface CampaignProps {
  pda: string;
}

export const Campaign = ({ pda }: CampaignProps) => {
  return (
    <Card className="mt-6 min-h-[calc(100vh_-_220px)] rounded-lg border-none">
      <CardContent className="p-6">
        <p>Campaign pda: {truncateAddress(pda)}</p>
      </CardContent>
    </Card>
  );
};
