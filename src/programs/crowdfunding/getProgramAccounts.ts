'use server';

import { crowdfundingProgramInstance } from '@/programs/crowdfunding';
import { CampaignData, IPFS_BASE_URL, NetworkName } from '@/types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function fetchCampaignList(
  network: NetworkName,
): Promise<CampaignData[]> {
  const program = await crowdfundingProgramInstance(network);

  const allCampaigns = await program.account.campaign.all();

  const campaigns: CampaignData[] = allCampaigns.map(
    ({ account: campaignAccount, publicKey: campaignPublicKey }) => ({
      orgName: campaignAccount.orgName,
      projectTitle: campaignAccount.title,
      description: campaignAccount.description,
      raised: campaignAccount.totalDonated.toNumber() / LAMPORTS_PER_SOL,
      goal: campaignAccount.goal.toNumber() / LAMPORTS_PER_SOL,
      imageLink: `${IPFS_BASE_URL}/${campaignAccount.projectImage}`,
      projectLink: campaignAccount.projectLink,
      pdaAddress: campaignPublicKey.toString(),
      startTimestamp: campaignAccount.startAt.toNumber() * 1000,
      endTimestamp: campaignAccount.endAt.toNumber() * 1000,
      donationCompleted: campaignAccount.donationCompleted,
      isClaimed: campaignAccount.claimed,
    }),
  );

  return campaigns;
}

export async function fetchCampaign(
  network: NetworkName,
  pda: string,
): Promise<CampaignData> {
  const program = await crowdfundingProgramInstance(network);
  const campaignData = await program.account.campaign.fetch(pda);

  const campaign = {
    orgName: campaignData.orgName,
    projectTitle: campaignData.title,
    description: campaignData.description,
    raised: campaignData.totalDonated.toNumber() / LAMPORTS_PER_SOL,
    goal: campaignData.goal.toNumber() / LAMPORTS_PER_SOL,
    imageLink: `${IPFS_BASE_URL}/${campaignData.projectImage}`,
    projectLink: campaignData.projectLink,
    pdaAddress: pda,
    startTimestamp: campaignData.startAt.toNumber() * 1000,
    endTimestamp: campaignData.endAt.toNumber() * 1000,
    donationCompleted: campaignData.donationCompleted,
    isClaimed: campaignData.claimed,
  };
  return campaign;
}
