import type { Intent } from "./suiTxBuilder";
import {SUPPORTED_ASSETS} from './suiTxBuilder';
import type {Asset} from './suiTxBuilder';

export function parseIntent(text: string): Intent {
   const input = text.trim();

  // 🔹 Transfer pattern: "send 10 SUI to Alice"
  const transferRegex = new RegExp(
    `send\\s+(\\d+)\\s*(${SUPPORTED_ASSETS.join("|")})?\\s+to\\s+([0-9a-zA-Z]+)`,
    "i"
  );

  // 🔹 Swap pattern: "swap 10 SUI for USDC"
  const swapRegex = new RegExp(
    `swap\\s+(\\d+)\\s*(${SUPPORTED_ASSETS.join("|")})\\s+for\\s+(${SUPPORTED_ASSETS.join("|")})`,
    "i"
  );

  const transferMatch = input.match(transferRegex);
  if (transferMatch) {
    const amount = Number(transferMatch[1]);
    const asset = (transferMatch[2]?.toUpperCase() as Asset) || "SUI"; 
    const recipient = transferMatch[3];

    return {
      action: "transfer",
      asset,
      amount,
      recipient,
    };
  }

  // ✅ Match swap
  const swapMatch = input.match(swapRegex);
  if (swapMatch) {
    const amount = Number(swapMatch[1]);
    const asset = swapMatch[2].toUpperCase() as Asset;
    const target = swapMatch[3].toUpperCase() as Asset;

    return {
      action: "swap",
      asset,
      amount,
      target,
    };
  }

  throw new Error(
    `Could not parse intent. Examples:\n` +
      `- "Send 10 SUI to Maria"\n` +
      `- "Swap 5 SUI for USDC"`
  );
}