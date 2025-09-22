import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

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

export async function buildTransaction(intent: Intent): Promise<TransactionBlock> {
  const txb = new TransactionBlock();

  if (intent.gasBudget) {
    txb.setGasBudget(intent.gasBudget);
  }

  switch (intent.action) {

    case "transfer":
      buildTransferTx(txb, intent);
      break;

    case "mint":
      buildMintTx(txb, intent);
      break;

    case "stake":
      buildStakeTx(txb, intent);
      break;

    case "swap":
      buildSwapTx(txb, intent);
      break;

    case "query-balance":
      throw new Error("query-balance is not a transaction. Use queryBalance() instead.");

    default:
      throw new Error(`Unknown action: ${intent.action}`);
  }

  return txb;
}

/** --- ACTION HANDLERS --- **/
// 🔹 Transfer SUI
function buildTransferTx(
  txb: TransactionBlock,
  { amount = 0, recipient }: Intent
) {
  if (!recipient) throw new Error("Recipient is required for transfer");
  if (amount <= 0) throw new Error("Transfer amount must be greater than 0");
  const mistAmount = BigInt(amount * 1e9);

  const [coinToSend] = txb.splitCoins(txb.gas, [txb.pure(mistAmount)]);

  txb.transferObjects([coinToSend], txb.pure(recipient));
}

// 🔹 Mint NFT (stub – replace with your package/module)
function buildMintTx(
  txb: TransactionBlock,
  { metadata = "My NFT", assetUrl }: Intent
) {
  txb.moveCall({
    target: "0xNFT_PACKAGE_ID::nft_module::mint",
    arguments: [
      txb.pure(metadata),
      txb.pure(assetUrl, "https://example.com/nft.png"),
    ],
  });
}

// 🔹 Stake SUI (stub – requires validator address)
function buildStakeTx(
  txb: TransactionBlock,
  { amount = 0, recipient: validator }: Intent
) {
  if (!validator) throw new Error("Validator address required for stake");
  const mistAmount = BigInt(amount * 1e9);
  const [stakeCoin] = txb.splitCoins(txb.gas, [txb.pure(mistAmount)]);
  txb.moveCall({
    target: "0x2::sui_system::request_add_stake",
    arguments: [txb.object("0x5"), stakeCoin, txb.pure(validator)],
  });
}

// 🔹 Swap (stub – depends on DEX package on Sui)
function buildSwapTx(
  txb: TransactionBlock,
  { amount = 0, asset, target }: Intent
) {
  if (!asset || !target) throw new Error("Swap requires asset + target");
  txb.moveCall({
    target: "0xDEX_PACKAGE::swap_module::swap_exact_input",
    arguments: [
      txb.pure(asset),
      txb.pure(target),
      txb.pure(amount * 1e9),
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