import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
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

  // campaign2 contributions
  let contribution21: PublicKey;

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
    it("Should be able to create campaign", async () => {
      async function createCampaign(
        campaignPda: PublicKey,
        signer: PublicKey,
        signerKeypair: Keypair,
        title: string,
        description: string,
        goal: BN,
        startAt: BN,
        endAt: BN
      ) {
        return await program.methods
          .createCampaign(title, description, goal, startAt, endAt)
          .accounts({
            signer,
            campaign: campaignPda,
          })
          .signers([signerKeypair])
          .rpc();
      }

      const startTimestamp = await incrementCurrentTimestamp(0, 0, 0, 1);
      const endTimestamp = await incrementCurrentTimestamp(0, 0, 0, 5);

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

      await createCampaign(
        campaign,
        wallet1.publicKey,
        wallet1,
        campaignParams.title,
        campaignParams.description,
        campaignParams.goal,
        campaignParams.startAt,
        campaignParams.endAt
      );

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

      const { campaign: campaign_2 } = await getProgramDerivedCampaign(
        program.programId,
        wallet2.publicKey,
        "Campagn 2"
      );

      const startTimestamp2 = await incrementCurrentTimestamp(0, 0, 0, 1);
      const endTimestamp2 = await incrementCurrentTimestamp(0, 0, 0, 5);

      await createCampaign(
        campaign_2,
        wallet2.publicKey,
        wallet2,
        "Campagn 2",
        campaignParams.description,
        new BN(2.5 * LAMPORTS_PER_SOL),
        new BN(startTimestamp2),
        new BN(endTimestamp2)
      );

      campaign2 = campaign_2;

      const campaignPda2 = await program.account.campaign.fetch(campaign_2);
      expect(campaignPda2.goal.toNumber()).to.equal(
        new BN(2.5 * LAMPORTS_PER_SOL).toNumber()
      );
      expect(campaignPda2.totalDonated.toNumber()).to.equal(0);

      const { campaign: campaign_3 } = await getProgramDerivedCampaign(
        program.programId,
        wallet3.publicKey,
        "Campagn 3"
      );

      const startTimestamp3 = await incrementCurrentTimestamp(1, 0, 0, 0);
      const endTimestamp3 = await incrementCurrentTimestamp(2, 5, 0, 5);

      await createCampaign(
        campaign_3,
        wallet3.publicKey,
        wallet3,
        "Campagn 3",
        campaignParams.description,
        new BN(15 * LAMPORTS_PER_SOL),
        new BN(startTimestamp3),
        new BN(endTimestamp3)
      );

      campaign3 = campaign_3;

      const campaignPda3 = await program.account.campaign.fetch(campaign_3);
      expect(campaignPda3.goal.toNumber()).to.equal(
        new BN(15 * LAMPORTS_PER_SOL).toNumber()
      );
      expect(campaignPda3.totalDonated.toNumber()).to.equal(0);
    });
  });

  describe("Donate", async () => {
    it("Should be able to donate", async () => {
      async function donate(
        campaignPda: PublicKey,
        signer: PublicKey,
        signerKeypair: Keypair,
        contributionPda: PublicKey,
        amount: BN
      ) {
        return await program.methods
          .donate(amount)
          .accounts({
            signer,
            campaign: campaignPda,
            contribution: contributionPda,
          })
          .signers([signerKeypair])
          .rpc();
      }

      /**
       * Wallet 1 contribute to campagn 1
       */

      const { contribution } = await getProgramDerivedContribution(
        program.programId,
        wallet2.publicKey,
        campaign1
      );

      const campaign1PdaBefore = await program.account.campaign.fetch(
        campaign1
      );

      const campaign1BalanceBefore =
        (await anchor.getProvider().connection.getBalance(campaign1)) /
        LAMPORTS_PER_SOL;

      const wallet2BalanceBefore =
        (await anchor.getProvider().connection.getBalance(wallet2.publicKey)) /
        LAMPORTS_PER_SOL;

      await delay(2000);
      const contributionAmount = new BN(5.5 * LAMPORTS_PER_SOL);

      await donate(
        campaign1,
        wallet2.publicKey,
        wallet2,
        contribution,
        contributionAmount
      );

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

      const campaign1BalanceAfter =
        (await anchor.getProvider().connection.getBalance(campaign1)) /
        LAMPORTS_PER_SOL;
      expect(campaign1BalanceAfter - campaign1BalanceBefore).greaterThanOrEqual(
        5.5
      );

      const wallet2BalanceAfter =
        (await anchor.getProvider().connection.getBalance(wallet2.publicKey)) /
        LAMPORTS_PER_SOL;
      expect(wallet2BalanceBefore - wallet2BalanceAfter).greaterThanOrEqual(
        contributionAmount.toNumber() / LAMPORTS_PER_SOL
      );

      const campaign1PdaAfter = await program.account.campaign.fetch(campaign1);
      expect(campaign1PdaBefore.totalDonated.toNumber()).to.equal(0);
      expect(campaign1PdaAfter.totalDonated.toNumber()).to.equal(
        contributionAmount.toNumber()
      );
      expect(campaign1PdaAfter.donationCompleted).to.equal(false);

      /**
       * Wallet 3 contribute to campagn 1
       */
      const wallet3BalanceBefore =
        (await anchor.getProvider().connection.getBalance(wallet3.publicKey)) /
        LAMPORTS_PER_SOL;

      const { contribution: contribution2 } =
        await getProgramDerivedContribution(
          program.programId,
          wallet3.publicKey,
          campaign1
        );

      const contributionAmount2 = new BN(5 * LAMPORTS_PER_SOL);
      await donate(
        campaign1,
        wallet3.publicKey,
        wallet3,
        contribution2,
        contributionAmount2
      );

      contribution12 = contribution2;

      const contribution2Pda = await program.account.contribution.fetch(
        contribution2
      );
      expect(contribution2Pda.amount.toNumber() / LAMPORTS_PER_SOL).to.equal(
        4.5
      );
      expect(contribution2Pda.authority.toString()).to.equal(
        wallet3.publicKey.toString()
      );

      const wallet3BalanceAfter =
        (await anchor.getProvider().connection.getBalance(wallet3.publicKey)) /
        LAMPORTS_PER_SOL;
      expect(wallet3BalanceBefore - wallet3BalanceAfter).greaterThanOrEqual(
        4.5
      );

      const campaign1PdaAfter2 = await program.account.campaign.fetch(
        campaign1
      );
      expect(
        campaign1PdaAfter.totalDonated.toNumber() / LAMPORTS_PER_SOL
      ).to.equal(5.5);
      expect(
        campaign1PdaAfter2.totalDonated.toNumber() / LAMPORTS_PER_SOL
      ).to.equal(10);
      expect(campaign1PdaAfter2.donationCompleted).to.equal(true);

      /**
       * Wallet 4 contribute to campagn 2
       */
      const { contribution: contribution3 } =
        await getProgramDerivedContribution(
          program.programId,
          wallet4.publicKey,
          campaign2
        );

      const contributionAmount3 = new BN(1 * LAMPORTS_PER_SOL);
      await donate(
        campaign2,
        wallet4.publicKey,
        wallet4,
        contribution3,
        contributionAmount3
      );

      contribution21 = contribution3;

      const campaign2PdaAfter = await program.account.campaign.fetch(campaign2);
      expect(campaign2PdaAfter.totalDonated.toNumber()).to.equal(
        contributionAmount3.toNumber()
      );
      expect(campaign2PdaAfter.donationCompleted).to.equal(false);
    });

    it("should revert if donation completed", async () => {
      const { contribution } = await getProgramDerivedContribution(
        program.programId,
        wallet4.publicKey,
        campaign1
      );

      const contributionAmount = new BN(2 * LAMPORTS_PER_SOL);

      try {
        await program.methods
          .donate(contributionAmount)
          .accounts({
            signer: wallet4.publicKey,
            campaign: campaign1,
            contribution: contribution,
          })
          .signers([wallet4])
          .rpc();
      } catch (error) {
        console.log(error.error.errorMessage);
      }
    });
  });

  describe("Claim Donations", async () => {
    it("Should be able to claim donations", async () => {
      await delay(3000);

      const campaign1PdaBefore = await program.account.campaign.fetch(
        campaign1
      );

      const campaign1BalanceBefore =
        (await anchor.getProvider().connection.getBalance(campaign1)) /
        LAMPORTS_PER_SOL;

      const wallet1BalanceBefore =
        (await anchor.getProvider().connection.getBalance(wallet1.publicKey)) /
        LAMPORTS_PER_SOL;

      await program.methods
        .claimDonations()
        .accounts({ campaign: campaign1, authority: wallet1.publicKey })
        .signers([wallet1])
        .rpc();

      const campaign1PdaAfter = await program.account.campaign.fetch(campaign1);
      expect(campaign1PdaBefore.claimed).equal(false);
      expect(campaign1PdaAfter.claimed).equal(true);

      const campaign1BalanceAfter =
        (await anchor.getProvider().connection.getBalance(campaign1)) /
        LAMPORTS_PER_SOL;
      expect(campaign1BalanceBefore - campaign1BalanceAfter).greaterThanOrEqual(
        10
      );

      const wallet1BalanceAfter =
        (await anchor.getProvider().connection.getBalance(wallet1.publicKey)) /
        LAMPORTS_PER_SOL;
      expect(wallet1BalanceAfter - wallet1BalanceBefore).greaterThanOrEqual(
        9.99
      );
    });

    it("Should revert if signer is not authority", async () => {
      try {
        await program.methods
          .claimDonations()
          .accounts({ campaign: campaign1, authority: wallet2.publicKey })
          .signers([wallet2])
          .rpc();
      } catch (error) {
        console.log(error.error.errorMessage);
      }
    });

    it("Should revert if donations already claimed", async () => {
      try {
        await program.methods
          .claimDonations()
          .accounts({ campaign: campaign1, authority: wallet1.publicKey })
          .signers([wallet1])
          .rpc();
      } catch (error) {
        console.log(error.error.errorMessage);
      }
    });

    it("Should revert if donation not completed", async () => {
      try {
        await program.methods
          .claimDonations()
          .accounts({ campaign: campaign2, authority: wallet2.publicKey })
          .signers([wallet2])
          .rpc();
      } catch (error) {
        console.log(error.error.errorMessage);
      }
    });

    it("Should revert if campaign not over", async () => {
      try {
        await program.methods
          .claimDonations()
          .accounts({ campaign: campaign3, authority: wallet3.publicKey })
          .signers([wallet3])
          .rpc();
      } catch (error) {
        console.log(error.error.errorMessage);
      }
    });
  });

  describe("Cancel Donation", async () => {
    it("Should revert if signer is not authority", async () => {
      try {
        await program.methods
          .cancelDonation()
          .accounts({
            campaign: campaign2,
            contribution: contribution21,
            authority: wallet3.publicKey,
          })
          .signers([wallet3])
          .rpc();
      } catch (error) {
        console.log(error.error.errorMessage);
      }
    });

    it("Should revert if donation completed", async () => {
      try {
        await program.methods
          .cancelDonation()
          .accounts({
            campaign: campaign1,
            contribution: contribution11,
            authority: wallet2.publicKey,
          })
          .signers([wallet2])
          .rpc();
      } catch (error) {
        console.log(error.error.errorMessage);
      }
    });

    it("should be able to cancel donation", async () => {
      const campaign2BalanceBefore =
        (await anchor.getProvider().connection.getBalance(campaign2)) /
        LAMPORTS_PER_SOL;

      const wallet4BalanceBefore =
        (await anchor.getProvider().connection.getBalance(wallet4.publicKey)) /
        LAMPORTS_PER_SOL;

      await program.methods
        .cancelDonation()
        .accounts({
          campaign: campaign2,
          contribution: contribution21,
          authority: wallet4.publicKey,
        })
        .signers([wallet4])
        .rpc();

      const campaign2BalanceAfter =
        (await anchor.getProvider().connection.getBalance(campaign2)) /
        LAMPORTS_PER_SOL;
      expect(campaign2BalanceBefore - campaign2BalanceAfter).to.equal(1);

      const wallet4BalanceAfter =
        (await anchor.getProvider().connection.getBalance(wallet1.publicKey)) /
        LAMPORTS_PER_SOL;
      expect(wallet4BalanceAfter - wallet4BalanceBefore).greaterThanOrEqual(
        0.99
      );
    });
  });

  describe("Cancel campaign", async () => {
    it("Should revert if signer is not authority", async () => {
      try {
        await program.methods
          .cancelCampaign()
          .accounts({ campaign: campaign3, authority: wallet2.publicKey })
          .signers([wallet2])
          .rpc();
      } catch (error) {
        console.log(error.error.errorMessage);
      }
    });

    it("Should revert if campaign already started", async () => {
      try {
        await program.methods
          .cancelCampaign()
          .accounts({ campaign: campaign2, authority: wallet2.publicKey })
          .signers([wallet2])
          .rpc();
      } catch (error) {
        console.log(error.error.errorMessage);
      }
    });

    it("should be able to cancel campaign", async () => {
      const campaign3PdaBefore = await program.account.campaign.fetch(
        campaign3
      );
      const wallet3BalanceBefore =
        (await anchor.getProvider().connection.getBalance(wallet3.publicKey)) /
        LAMPORTS_PER_SOL;

      await program.methods
        .cancelCampaign()
        .accounts({ campaign: campaign3, authority: wallet3.publicKey })
        .signers([wallet3])
        .rpc();

      const wallet3BalanceAfter =
        (await anchor.getProvider().connection.getBalance(wallet3.publicKey)) /
        LAMPORTS_PER_SOL;
      expect(wallet3BalanceAfter).greaterThan(wallet3BalanceBefore);

      expect(campaign3PdaBefore.authority.toString()).to.equal(
        wallet3.publicKey.toString()
      );
      try {
        await program.account.campaign.fetch(campaign3);
      } catch (error) {
        console.log(error.message);
      }
    });
  });
});
