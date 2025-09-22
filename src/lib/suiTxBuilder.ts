import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Transaction } from "@mysten/sui/transactions"

export const SUPPORTED_ASSETS = ["SUI", "CETUS", "USDC", "BTC", "ETH", "USDT"] as const;
export type Asset = typeof SUPPORTED_ASSETS[number];

export interface Intent {
  action: "transfer" | "mint" | "stake" | "swap" | "query-balance";
  asset?: Asset;
  amount?: number;
  recipient?: string; 
  gasBudget?: number,
  metadata?: string; 
  target?: string;   
  assetUrl?: string;
}

export async function buildTransaction(intent: Intent): Promise<Transaction> {
  const tx = new Transaction();

  if (intent.gasBudget) {
    tx.setGasBudget(intent.gasBudget);
  }

  switch (intent.action) {
    case "transfer":
      buildTransferTx(tx, intent);
      break;
    case "mint":
      buildMintTx(tx, intent);
      break;
    case "stake":
      buildStakeTx(tx, intent);
      break;
    case "swap":
      buildSwapTx(tx, intent);
      break;
    case "query-balance":
      throw new Error("query-balance is not a transaction. Use queryBalance() instead.");

    default:
      throw new Error(`Unknown action: ${intent.action}`);
  }

  return tx;
}

/** --- ACTION HANDLERS --- **/
// 🔹 Transfer SUI
function buildTransferTx(
    tx: Transaction, // ← Changed from TransactionBlock to Transaction
    { amount = 0, recipient }: Intent
) {
  if (!recipient) throw new Error("Recipient is required for transfer");
  if (amount <= 0) throw new Error("Transfer amount must be greater than 0");

  const mistAmount = BigInt(amount * 1e9);

  // NEW API: Much simpler!
  const [coin] = tx.splitCoins(tx.gas, [mistAmount]);
  tx.transferObjects([coin], recipient);
}

// 🔹 Mint NFT (UPDATED)
function buildMintTx(
  txb: TransactionBlock,
  { metadata = "My NFT", assetUrl }: Intent

) {
  tx.moveCall({
    target: "0xNFT_PACKAGE_ID::nft_module::mint",
    arguments: [
      txb.pure(metadata),
      txb.pure(assetUrl, "https://example.com/nft.png"),
    ],
  });
}

// 🔹 Stake SUI (UPDATED)
function buildStakeTx(
    tx: Transaction,
    { amount = 0, recipient: validator }: Intent
) {
  if (!validator) throw new Error("Validator address required for stake");
  const mistAmount = BigInt(amount * 1e9);

  const [stakeCoin] = tx.splitCoins(tx.gas, [mistAmount]);
  tx.moveCall({
    target: "0x3::sui_system::request_add_stake", // ← Note: 0x3 instead of 0x2
    arguments: [
      tx.object("0x5"),
      stakeCoin,
      tx.pure.address(validator) // ← .address() for addresses
    ],
  });
}

// 🔹 Swap (UPDATED)
function buildSwapTx(
    tx: Transaction,
    { amount = 0, asset, target }: Intent
) {
  if (!asset || !target) throw new Error("Swap requires asset + target");

  tx.moveCall({
    target: "0xDEX_PACKAGE::swap_module::swap_exact_input",
    arguments: [
      tx.pure.string(asset),
      tx.pure.string(target),
      tx.pure.u64(amount * 1e9), // ← .u64() for numbers
    ],
  });
}


/** --- QUERY HANDLER --- **/
export async function queryBalance(address: string, asset: Asset = "SUI") {
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });

  let coinType = "0x2::sui::SUI";
  if (asset !== "SUI") {
    // TODO: Map other assets like USDC, CETUS with their CoinType
    throw new Error(`Balance query for ${asset} not implemented yet`);
  }

  const res = await client.getBalance({ owner: address, coinType });
  return Number(res.totalBalance) / 1e9;
}