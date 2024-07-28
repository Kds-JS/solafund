import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

export async function getProgramDerivedCampaign(
  programId: PublicKey,
  signerKey: PublicKey,
  campaignTitle: string,
): Promise<{
  campaign: anchor.web3.PublicKey;
  bump: number;
}> {
  let seeds_campaign = [Buffer.from(campaignTitle), signerKey.toBytes()];
  const [campaign, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    seeds_campaign,
    programId,
  );

  return { campaign, bump };
}

export async function getProgramDerivedContribution(
  programId: PublicKey,
  signerKey: PublicKey,
  campaign: PublicKey,
): Promise<{
  contribution: anchor.web3.PublicKey;
  bump: number;
}> {
  let seeds_contribution = [campaign.toBytes(), signerKey.toBytes()];
  const [contribution, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    seeds_contribution,
    programId,
  );

  return { contribution, bump };
}
