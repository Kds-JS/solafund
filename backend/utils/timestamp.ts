import { Connection } from "@solana/web3.js";

export async function getUnixTimestamp() {
  const connection = new Connection(
    "https://api.testnet.solana.com",
    "processed"
  );
  const slot = await connection.getSlot();
  const timestamp = await connection.getBlockTime(slot);
  return timestamp;
}

export async function getTimestamp(): Promise<number> {
  const now = new Date();

  const timestamp = now.getTime();
  const timestampInSeconds = Math.floor(timestamp / 1000);
  return timestampInSeconds;
}

export async function incrementCurrentTimestamp(
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0
): Promise<number> {
  const now = new Date();

  now.setDate(now.getDate() + days);
  now.setHours(now.getHours() + hours);
  now.setMinutes(now.getMinutes() + minutes);
  now.setSeconds(now.getSeconds() + seconds);

  const timestamp = now.getTime();
  const timestampInSeconds = Math.floor(timestamp / 1000);
  return timestampInSeconds;
}
