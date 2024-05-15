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
        tags: Vec<String>,
        goal: u64,
        start_at: i64,
        end_at: i64
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;

        let clock = Clock::get();
        let current_timestamp = clock.unwrap().unix_timestamp;

        require!(start_at >= current_timestamp, MyError::StartTimeEarly);
        require!(end_at > start_at, MyError::EndTimeSmall);
        require!(goal > 0, MyError::GoalZero);

        campaign.title = title.clone();
        campaign.description = description;
        campaign.tags = tags;
        campaign.admin = ctx.accounts.signer.key();
        campaign.goal = goal;
        campaign.total_donated = 0;
        campaign.donation_completed = false;
        campaign.claimed = false;
        campaign.start_at = start_at;
        campaign.end_at = end_at;

        msg!("campaign created, {}", title);
        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let contribution = &mut ctx.accounts.contribution;

        let clock = Clock::get();
        let current_timestamp = clock.unwrap().unix_timestamp;

        require!(current_timestamp >= campaign.start_at, MyError::CampaignNotStarted);
        require!(current_timestamp <= campaign.end_at, MyError::CampaignOver);
        require!(campaign.donation_completed == false, MyError::DonationCompleted);

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
        contribution.contribution_amount += amount;

        if campaign.total_donated >= campaign.goal {
            campaign.donation_completed = true;
        }

        msg!("new donation for campaign: {}, amount:{}", campaign.key(), amount);
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
        space = size_of::<Campaign>() + title.len() + 8,
        seeds = [title.as_bytes(), signer.key().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    pub system_program: Program<'info, System>,
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

#[account]
pub struct Campaign {
    pub title: String,
    pub description: String,
    pub tags: Vec<String>,
    pub admin: Pubkey,
    pub goal: u64,
    pub total_donated: u64,
    pub donation_completed: bool,
    pub claimed: bool,
    pub start_at: i64,
    pub end_at: i64,
}

#[account]
pub struct Contribution {
    pub contribution_amount: u64,
}

#[error_code]
pub enum MyError {
    #[msg("start time is too early")]
    StartTimeEarly,
    #[msg("end time is too small")]
    EndTimeSmall,
    #[msg("goal must be greater than zero")]
    GoalZero,
    #[msg("campaign not started")]
    CampaignNotStarted,
    #[msg("campaign over")]
    CampaignOver,
    #[msg("donation completed")]
    DonationCompleted,
}
