import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromB64 } from "@mysten/bcs";
import * as dotenv from "dotenv";
import type { Intent } from "../lib/suiTxBuilder.js";
import { buildTransaction } from "../lib/suiTxBuilder.js";

dotenv.config();

const PRIVATE_KEY = process.env.SUI_PRIVATE_KEY;
const RECIPIENT = process.env.ADDRESS;

if (!PRIVATE_KEY) throw new Error("Missing SUI_PRIVATE_KEY in .env");
if (!RECIPIENT) throw new Error("Missing ADDRESS in .env");

const PRIVATE_KEY_STR: string = PRIVATE_KEY;
const RECIPIENT_STR: string = RECIPIENT;

// Initialize Sui client (testnet)
const client = new SuiClient({ url: getFullnodeUrl("testnet") });

async function getBalance(address: string) {
  const balance = await client.getBalance({ owner: address, coinType: "0x2::sui::SUI" });
  return Number(balance.totalBalance) / 1e9; // convert from MIST → SUI
}

async function main() {
  // Setup keypair
  const secretKey = fromB64(PRIVATE_KEY_STR).slice(1);
  const keypair = Ed25519Keypair.fromSecretKey(secretKey);
  const sender = keypair.getPublicKey().toSuiAddress();

  console.log("Sender:", sender);
  console.log("Recipient:", RECIPIENT);

  // Check balances before
  const senderBefore = await getBalance(sender);
  const recipientBefore = await getBalance(RECIPIENT_STR);
  console.log(`💰 Sender before: ${senderBefore} SUI`);
  console.log(`💰 Recipient before: ${recipientBefore} SUI`);

  if (senderBefore < 1.1) { 
    console.error("Not enough SUI (need >1.1 for transfer + gas)");
    return;
  }

  // Build intent
  const intent: Intent = {
    action: "transfer",
    asset: "SUI",
    amount: 1, 
    recipient: RECIPIENT_STR,
    gasBudget: 10000000, // 10M MIST
  };

  // Build transaction
  const txb = await buildTransaction(intent);

  // Sign + execute
  const result = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: { showEffects: true, showEvents: true },
  });

  console.log("✅ Transfer executed!");
  console.log("🔎 Digest:", result.digest);

  const senderAfter = await getBalance(sender);
  const recipientAfter = await getBalance(RECIPIENT_STR);
  console.log(`Sender after: ${senderAfter} SUI`);
  console.log(`Recipient after: ${recipientAfter} SUI`);
}

main().catch(console.error);
