use std::mem::size_of;

use anchor_lang::prelude::*;

declare_id!("EAZShAZ2JVrBkQyvLe1eBzy26w2eoPBHgXWYkboQCyek");

#[program]
pub mod crowdfunding {
    use anchor_lang::system_program;

    use super::*;

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        title: String,
        description: String,
        goal: u64,
        start_at: i64,
        end_at: i64
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;

        let clock = Clock::get();
        let current_timestamp = clock.unwrap().unix_timestamp;

        require!(start_at >= current_timestamp, Errors::StartTimeEarly);
        require!(end_at > start_at, Errors::EndTimeSmall);
        require!(goal > 0, Errors::GoalZero);

        campaign.title = title.clone();
        campaign.description = description;
        campaign.authority = ctx.accounts.signer.key();
        campaign.goal = goal;
        campaign.total_donated = 0;
        campaign.donation_completed = false;
        campaign.claimed = false;
        campaign.start_at = start_at;
        campaign.end_at = end_at;

        msg!("campaign created, {}", title);

        Ok(())
    }

    pub fn cancel_campaign(ctx: Context<CancelCampaign>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;

        let clock = Clock::get();
        let current_timestamp = clock.unwrap().unix_timestamp;

        require!(current_timestamp < campaign.start_at, Errors::CampaignStarted);

        msg!("campaign cancelled: {}", campaign.key().to_string());

        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let contribution = &mut ctx.accounts.contribution;

        let clock = Clock::get();
        let current_timestamp = clock.unwrap().unix_timestamp;

        require!(current_timestamp >= campaign.start_at, Errors::CampaignNotStarted);
        require!(current_timestamp <= campaign.end_at, Errors::CampaignOver);
        require!(campaign.donation_completed == false, Errors::DonationCompleted);
        require!(amount > 0, Errors::AmountZero);

        let remaining_amounts = campaign.goal - campaign.total_donated;

        let amount = if amount > remaining_amounts { remaining_amounts } else { amount };

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.signer.to_account_info().clone(),
                to: campaign.to_account_info().clone(),
            }
        );

        system_program::transfer(cpi_context, amount)?;

        campaign.total_donated += amount;
        contribution.authority = ctx.accounts.signer.key();
        contribution.amount += amount;

        if campaign.total_donated >= campaign.goal {
            campaign.donation_completed = true;
        }

        msg!("new donation for campaign: {}, amount:{}", campaign.key().to_string(), amount);

        Ok(())
    }

    pub fn cancel_donation(ctx: Context<CancelDonation>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let contribution = &mut ctx.accounts.contribution;

        let clock = Clock::get();
        let current_timestamp = clock.unwrap().unix_timestamp;

        require!(current_timestamp > campaign.end_at, Errors::CampaignNotOver);
        require!(campaign.donation_completed == false, Errors::DonationCompleted);

        let amount = contribution.amount;

        campaign.sub_lamports(amount)?;
        ctx.accounts.authority.add_lamports(amount)?;

        msg!("donation cancelled for campaign:  {}", campaign.key().to_string());

        Ok(())
    }

    pub fn claim_donations(ctx: Context<ClaimDonations>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;

        let clock = Clock::get();
        let current_timestamp = clock.unwrap().unix_timestamp;

        require!(current_timestamp > campaign.end_at, Errors::CampaignNotOver);
        require!(campaign.donation_completed == true, Errors::DonationNotCompleted);
        require!(campaign.claimed == false, Errors::DonationsClaimed);

        campaign.sub_lamports(campaign.total_donated)?;
        ctx.accounts.authority.add_lamports(campaign.total_donated)?;

        campaign.claimed = true;

        msg!("donations claimed for campaign:  {}", campaign.key().to_string());

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title:String, description:String)]
pub struct CreateCampaign<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + 32 + 8 + 8 + 1 + 1 + 8 + 8 + 4 + title.len() + 4 + description.len(),
        seeds = [title.as_bytes(), signer.key().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelCampaign<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut, close = authority, has_one = authority @ Errors::SignerIsNotAuthority)]
    pub campaign: Account<'info, Campaign>,
}

#[derive(Accounts)]
pub struct ClaimDonations<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut, has_one = authority @ Errors::SignerIsNotAuthority)]
    pub campaign: Account<'info, Campaign>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub campaign: Account<'info, Campaign>,

    #[account(
        init_if_needed,
        payer = signer,
        space = size_of::<Contribution>() + 8,
        seeds = [campaign.key().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub contribution: Account<'info, Contribution>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelDonation<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub campaign: Account<'info, Campaign>,

    #[account(mut, close = authority, has_one = authority @ Errors::SignerIsNotAuthority)]
    pub contribution: Account<'info, Contribution>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Campaign {
    pub title: String,
    pub description: String,
    pub authority: Pubkey,
    pub goal: u64,
    pub total_donated: u64,
    pub donation_completed: bool,
    pub claimed: bool,
    pub start_at: i64,
    pub end_at: i64,
}

#[account]
pub struct Contribution {
    pub amount: u64,
    pub authority: Pubkey,
}

#[error_code]
pub enum Errors {
    #[msg("start time is too early")]
    StartTimeEarly,
    #[msg("end time is too small")]
    EndTimeSmall,
    #[msg("goal must be greater than zero")]
    GoalZero,
    #[msg("amount must be greater than zero")]
    AmountZero,
    #[msg("campaign is not started")]
    CampaignNotStarted,
    #[msg("campaign has already started")]
    CampaignStarted,
    #[msg("campaign is not over")]
    CampaignNotOver,
    #[msg("campaign over")]
    CampaignOver,
    #[msg("donation completed")]
    DonationCompleted,
    #[msg("donations is not completed")]
    DonationNotCompleted,
    #[msg("donations has already claimed")]
    DonationsClaimed,
    #[msg("signer is not authority")]
    SignerIsNotAuthority,
}
