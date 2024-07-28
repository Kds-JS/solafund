import {
  CrowdfundingProgram,
  getProgramDerivedCampaign,
} from '@/programs/crowdfunding';
import { getDateTimestamp } from '@/utils';
import { Program, BN } from '@coral-xyz/anchor';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export async function createCampaign(
  program: Program<CrowdfundingProgram>,
  signer: PublicKey,
  data: {
    title: string;
    description: string;
    org_name: string;
    project_link: string;
    project_image: string;
    goal: number;
    startAt: Date;
    endAt: Date;
  },
): Promise<string> {
  const goal = new BN(data.goal * LAMPORTS_PER_SOL);
  const startAt = new BN(getDateTimestamp(data.startAt));
  const endAt = new BN(getDateTimestamp(data.endAt));

  const { campaign } = await getProgramDerivedCampaign(
    program.programId,
    signer,
    data.title,
  );

  const tx = await program.methods
    .createCampaign(
      data.title,
      data.description,
      data.org_name,
      data.project_link,
      data.project_image,
      goal,
      startAt,
      endAt,
    )
    .accounts({ campaign })
    .rpc();
  return tx;
}
