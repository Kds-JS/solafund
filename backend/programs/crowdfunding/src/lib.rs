use anchor_lang::prelude::*;

declare_id!("EAZShAZ2JVrBkQyvLe1eBzy26w2eoPBHgXWYkboQCyek");

#[program]
pub mod crowdfunding {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
