import CampaignLayout from '@/components/campaigns/campaign-layout';

export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CampaignLayout>{children}</CampaignLayout>;
}
