# Solafund

## Overview

Solafund is a decentralized crowdfunding platform built on the Solana blockchain. It enables users to create, manage, and contribute to crowdfunding campaigns in a trustless and transparent manner. The program is written in Rust using the Anchor framework, while the frontend is developed with Next.js and TypeScript.

## Program Features

### Create a Campaign

- The `create_campaign` function initializes a new campaign. It requires the title, description, organization name, project link, project image, goal amount, and start and end times.
- The campaign details are stored on the blockchain, and the campaign is associated with the creator's public key.

### Donate to a Campaign

- Users can donate to an active campaign using the `donate` function.
- Donations are transferred to the campaign account, and the total amount donated is updated.
- If the total donations reach the goal, the campaign is marked as complete.

### Claim Donations

- Once a campaign ends and the donation goal is reached, the creator can claim the funds using the `claim_donations` function.
- The funds are transferred to the campaign creator's account, and the campaign is marked as claimed.

### Cancel Campaign

- A campaign can be canceled by the creator before it starts using the `cancel_campaign` function.
- This action will close the campaign account and refund any associated resources.

### Cancel Donation

- Users can cancel their donations if the campaign has ended but did not meet its goal, using the `cancel_donation` function.
- The funds are refunded to the donor's account.


## Technologies Used

- **Blockchain**: [Solana](https://solana.com/)
- **Smart Contract**: [Anchor](https://www.anchor-lang.com/), [Rust](https://www.rust-lang.org/)
- **Frontend**: [Next.js](https://nextjs.org/docs), [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Directory Structure

```bash
.
├── /                  # Next.js frontend application
├── src/           # Next js src
│    └── app/     # App Router Next js
│    └── components/     # components
├── backend/             # Backend - Anchor
│     └── programs/     # Solana programs
│           └── crowdfunding/     # Crowdfunding program
└── README.md             # Project documentation
```

### Installation Frontend

1. **Install dependencies**:
   ```bash
    npm install
   ````

2. **Run the frontend**:
   ```bash
    npm run dev
   ````

### Installation Backend

1. **Change directory**:
   ```bash
   cd backend
   ````

2. **Install dependencies**:
   ```bash
    npm install
   ````

3. **Build the program**:
   ```bash
    anchor build
   ````

4. **Test the program**:
   ```bash
    anchor test
   ````

## Community
If you have questions or any issues, feel free to reach me on Twitter [@kds_JS](https://x.com/kds_JS).