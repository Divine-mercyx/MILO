import { TransactionBlock } from "@mysten/sui.js/transactions";
import {useCurrentAccount, useSuiClient} from "@mysten/dapp-kit";
export const SUPPORTED_ASSETS = ["SUI", "CETUS", "USDC", "BTC", "ETH"] as const;
export type Asset = typeof SUPPORTED_ASSETS[number];

export interface Intent {
  action: "transfer" | "mint" | "stake" | "swap" | "query-balance";
  asset?: Asset;
  amount?: number;
  recipient?: string; // or validator / target
  gasBudget?: number,
  metadata?: string; // for NFT mint
  target?: string;   // for swap target
}

export async function buildTransaction(intent: Intent): Promise<TransactionBlock> {
  const txb = new TransactionBlock();

  if (intent.gasBudget) {
    txb.setGasBudget(intent.gasBudget);
  }

  switch (intent.action) {
    case "query-balance":
      getBalance();
      break;

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

    default:
      throw new Error(`Unknown action: ${intent.action}`);
  }

  return txb;
}

/** --- ACTION HANDLERS --- **/

// query-balance is handled outside (no tx needed)
const getBalance = () => {
    const currentAccount = useCurrentAccount();
    const suiClient = useSuiClient();
    if (!currentAccount || !suiClient) {
        throw new Error("No current account or Sui client");
    }
    return suiClient.getBalance({ owner: currentAccount.address, coinType: "0x2::sui::SUI" });
}

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
  { metadata = "My NFT" }: Intent
) {
  txb.moveCall({
    target: "0xNFT_PACKAGE_ID::nft_module::mint",
    arguments: [
      txb.pure(metadata),
      txb.pure("https://example.com/nft.png"),
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
