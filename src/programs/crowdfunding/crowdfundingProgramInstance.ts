'use server';

import { Program } from '@coral-xyz/anchor';
import { IDL, CrowdfundingProgram } from './crowdfunding.interface';
import { NetworkName } from '@/types';
import { Connection } from '@solana/web3.js';
import { getAlchemyRpcUrl } from '@/services/web3';
import { getProgamId } from './programId';

export async function crowdfundingProgramInstance(
  network: NetworkName,
): Promise<Program<CrowdfundingProgram>> {
  const rpcUrl = await getAlchemyRpcUrl(network);
  const connection = new Connection(rpcUrl, 'confirmed');
  const programId = getProgamId(network);
  const program = new Program<CrowdfundingProgram>(IDL, programId, {
    connection,
  });
  return program;
}
