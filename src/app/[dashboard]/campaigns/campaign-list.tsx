'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  CardCampaign,
  CardCampaignProps,
} from '@/components/campaigns/card-campaign';

export const CampaignList = () => {
  const campaigns: CardCampaignProps[] = [
    {
      imageLink: 'https://i.ibb.co/rfzzN4C/peaq-101.webp',
      title: 'Peak Network Launch',
      raised: 743,
      goal: 3000,
      pdaAddress: 'C1oamQ8t8eGq3D7XEbQWTxCtzcpsbumvJw4mj6cnNZxB',
    },
    {
      imageLink:
        'https://ipfs.io/ipfs/QmfZSnb5cVTGKzGfntiU5hHfPNrrBKssiXDjdJCFePaSVp',
      title: 'Build Jumper LIFI',
      raised: 50,
      goal: 100,
      pdaAddress: 'C2oamQ8t8eGq3D7XEbQWTxCtzcpsbumvJw4mj6cnNZxB',
    },
    {
      imageLink: 'https://i.ibb.co/rpBzkrx/sol.webp',
      title: 'Intelligent weather app development on Solana',
      raised: 400,
      goal: 7000,
      pdaAddress: 'C3oamQ8t8eGq3D7XEbQWTxCtzcpsbumvJw4mj6cnNZxB',
    },
    {
      imageLink: 'https://i.ibb.co/vLDxRPG/jupiter.webp',
      title: 'Build a Jupiter Dex with us!',
      raised: 2104.25,
      goal: 2506.9,
      pdaAddress: 'C4oamQ8t8eGq3D7XEbQWTxCtzcpsbumvJw4mj6cnNZxB',
    },
  ];

  return (
    <Card className="mt-6 min-h-[calc(100vh_-_220px)] rounded-lg border-none">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign, index) => (
            <CardCampaign
              key={index}
              imageLink={campaign.imageLink}
              title={campaign.title}
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
