export interface CampaignData {
  orgName: string;
  projectTitle: string;
  description: string;
  raised: number;
  goal: number;
  imageLink: string;
  projectLink: string;
  pdaAddress: string;
  startTimestamp: number;
  endTimestamp: number;
  donationCompleted: boolean;
  isClaimed: boolean;
}

export interface ContributionData {
  pdaAddress: string;
  contributor: string;
  amount: number;
}
