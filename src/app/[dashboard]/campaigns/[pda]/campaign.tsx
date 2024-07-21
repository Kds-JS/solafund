import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CampaignDetail } from '@/components';

interface CampaignProps {
  pda: string;
}

export const Campaign = ({ pda }: CampaignProps) => {
  const campaignData = {
    orgName: 'Peak Network',
    projectTitle: 'Help us release a cookbook for parents and kids',
    description:
      'We want to create beautiful and helpful cooking book for parents and kids to have fun in kitchen. Kid cooking organization specializes in detary content publishing and popularization of a healthy diet.',
    raised: 743,
    goal: 3000,
    imageLink: 'https://i.ibb.co/rfzzN4C/peaq-101.webp',
    projectLink: 'https://www.peaq.network/',
    pdaAddress: 'C1oamQ8t8eGq3D7XEbQWTxCtzcpsbumvJw4mj6cnNZxB',
    endTimestamp: 1724390683000,
  };

  return (
    <Card className="mt-6 min-h-[calc(100vh_-_220px)] rounded-lg border-none">
      <CardContent className="p-6">
        <CampaignDetail
          isDashboard={true}
          projectTitle={campaignData.projectTitle}
          orgName={campaignData.orgName}
          description={campaignData.description}
          raised={campaignData.raised}
          goal={campaignData.goal}
          imageLink={campaignData.imageLink}
          projectLink={campaignData.projectLink}
          pdaAddress={campaignData.pdaAddress}
          endTimestamp={campaignData.endTimestamp}
        />
      </CardContent>
    </Card>
  );
};
