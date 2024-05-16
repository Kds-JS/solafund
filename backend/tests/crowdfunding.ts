import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { Crowdfunding } from "../target/types/crowdfunding";
import {
  airdropSol,
  delay,
  getProgramDerivedCampaign,
  getProgramDerivedContribution,
  incrementCurrentTimestamp,
} from "../utils";
import { expect } from "chai";

describe("crowdfunding", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Crowdfunding as Program<Crowdfunding>;

  const wallet1 = anchor.web3.Keypair.generate();
  const wallet2 = anchor.web3.Keypair.generate();
  const wallet3 = anchor.web3.Keypair.generate();
  const wallet4 = anchor.web3.Keypair.generate();
  const wallet5 = anchor.web3.Keypair.generate();

  // campaigns
  let campaign1: PublicKey;
  let campaign2: PublicKey;
  let campaign3: PublicKey;

  // campaign1 contributions
  let contribution11: PublicKey;
  let contribution12: PublicKey;
  let contribution13: PublicKey;

  before(async () => {
    await airdropSol(wallet1.publicKey, 100 * LAMPORTS_PER_SOL);
    await airdropSol(wallet2.publicKey, 100 * LAMPORTS_PER_SOL);
    await airdropSol(wallet3.publicKey, 100 * LAMPORTS_PER_SOL);
    await airdropSol(wallet4.publicKey, 100 * LAMPORTS_PER_SOL);
    await airdropSol(wallet5.publicKey, 100 * LAMPORTS_PER_SOL);
  });

  describe("Create campaign", async () => {
    it("should revert if invalid params", async () => {
      const startTimestamp = await incrementCurrentTimestamp(0, 0, 0, 1);
      const endTimestamp = await incrementCurrentTimestamp(2, 3);

      const campaignParams = {
        title: "Campaign 1",
        description: "This is a Campaign 1",
        goal: new BN(10 * LAMPORTS_PER_SOL),
        start_at: new BN(startTimestamp),
        end_at: new BN(endTimestamp),
      };

      const { campaign } = await getProgramDerivedCampaign(
        program.programId,
        wallet1.publicKey,
        campaignParams.title
      );

      async function createCampaign(
        title: string,
        description: string,
        goal: BN,
        start_at: BN,
        end_at: BN
      ) {
        return await program.methods
          .createCampaign(title, description, goal, start_at, end_at)
          .accounts({
            signer: wallet1.publicKey,
            campaign,
          })
          .signers([wallet1])
          .rpc();
      }

      try {
        await createCampaign(
          campaignParams.title,
          campaignParams.description,
          campaignParams.goal,
          new BN(startTimestamp - 1000),
          campaignParams.end_at
        );
      } catch (error) {
        console.log(error.error.errorMessage);
      }

      try {
        await createCampaign(
          campaignParams.title,
          campaignParams.description,
          campaignParams.goal,
          campaignParams.start_at,
          campaignParams.start_at
        );
      } catch (error) {
        console.log(error.error.errorMessage);
      }

      try {
        await createCampaign(
          campaignParams.title,
          campaignParams.description,
          new BN(0),
          campaignParams.start_at,
          campaignParams.end_at
        );
      } catch (error) {
        console.log(error.error.errorMessage);
      }
    });
    it("Should be able to crate campaign", async () => {
      const startTimestamp = await incrementCurrentTimestamp(0, 0, 0, 1);
      const endTimestamp = await incrementCurrentTimestamp(2, 3);

      const campaignParams = {
        title: "Campaign 1",
        description: "This is a Campaign 1",
        goal: new BN(10 * LAMPORTS_PER_SOL),
        startAt: new BN(startTimestamp),
        endAt: new BN(endTimestamp),
      };

      const { campaign } = await getProgramDerivedCampaign(
        program.programId,
        wallet1.publicKey,
        campaignParams.title
      );

      await program.methods
        .createCampaign(
          campaignParams.title,
          campaignParams.description,
          campaignParams.goal,
          campaignParams.startAt,
          campaignParams.endAt
        )
        .accounts({
          signer: wallet1.publicKey,
          campaign,
        })
        .signers([wallet1])
        .rpc();

      campaign1 = campaign;

      const campaignPda = await program.account.campaign.fetch(campaign);
      expect(campaignPda.title).to.equal(campaignParams.title);
      expect(campaignPda.description).to.equal(campaignParams.description);
      expect(campaignPda.authority.toString()).to.equal(
        wallet1.publicKey.toString()
      );
      expect(campaignPda.goal.toNumber()).to.equal(
        campaignParams.goal.toNumber()
      );
      expect(campaignPda.totalDonated.toNumber()).to.equal(0);
      expect(campaignPda.donationCompleted).to.equal(false);
      expect(campaignPda.claimed).to.equal(false);
      expect(campaignPda.startAt.toNumber()).to.equal(
        campaignParams.startAt.toNumber()
      );
      expect(campaignPda.endAt.toNumber()).to.equal(
        campaignParams.endAt.toNumber()
      );
    });
  });

  describe("Donate", async () => {
    it("should revert if invalid params", async () => {});
    it("Should be able to donate", async () => {
      const { contribution } = await getProgramDerivedContribution(
        program.programId,
        wallet2.publicKey,
        campaign1
      );

      const campaign1PdaBefore = await program.account.campaign.fetch(
        campaign1
      );

      await delay(2000);
      const contributionAmount = new BN(5.5 * LAMPORTS_PER_SOL);
      await program.methods
        .donate(contributionAmount)
        .accounts({
          signer: wallet2.publicKey,
          campaign: campaign1,
          contribution,
        })
        .signers([wallet2])
        .rpc();

      contribution11 = contribution;

      const contributionPda = await program.account.contribution.fetch(
        contribution
      );
      expect(contributionPda.amount.toNumber()).to.equal(
        contributionAmount.toNumber()
      );
      expect(contributionPda.authority.toString()).to.equal(
        wallet2.publicKey.toString()
      );

      const campaign1PdaAfter = await program.account.campaign.fetch(campaign1);
      expect(campaign1PdaBefore.totalDonated.toNumber()).to.equal(0);
      expect(campaign1PdaAfter.totalDonated.toNumber()).to.equal(
        contributionAmount.toNumber()
      );
    });
  });
});
