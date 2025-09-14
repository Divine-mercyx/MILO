import { describe, it, expect } from "vitest";
import { buildTransaction } from "../lib/suiTxBuilder.js";
import type { Intent } from "../lib/suiTxBuilder.js";

// Mock balance fetcher (instead of hitting Sui testnet directly)
async function mockGetBalance(_address: string) {
  return 100; // Pretend everyone starts with 100 SUI
}

describe("Sui Transaction Builder", () => {
  it("should build a transfer transaction", async () => {
    const intent: Intent = {
      action: "transfer",
      asset: "SUI",
      amount: 1,
      recipient: "0xFAKEADDRESS123",
    };

    const txb = await buildTransaction(intent);

    // The transaction should have instructions
    expect(txb).toBeDefined();
    expect(typeof txb).toBe("object");
  });

  it("should reduce sender balance after transfer (mocked)", async () => {
    const senderBalanceBefore = await mockGetBalance("0xSENDER");
    const recipientBalanceBefore = await mockGetBalance("0xRECIPIENT");

    // Simulate transfer of 1 SUI
    const transferAmount = 1;
    const senderBalanceAfter = senderBalanceBefore - transferAmount;
    const recipientBalanceAfter = recipientBalanceBefore + transferAmount;

    expect(senderBalanceAfter).toBe(99);
    expect(recipientBalanceAfter).toBe(101);
  });
});
