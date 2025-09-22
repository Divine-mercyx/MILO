import React, { useEffect, useState } from "react";
import { buildTransaction, type Asset, type Intent } from "../../../lib/suiTxBuilder";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { suiClient } from "../../../config/suiClient";
import { SuiClient } from "@mysten/sui/client";
import Detail from "../../../assets/icons/detail.png"; 

interface SendInterfaceProps {
  onClose: () => void;
  onSuccess?: (message: string) => void;
  amount: number;
  setAmount: (value: number) => void;
  recipient: string;
  setRecipient: (value: string) => void;
  selectedToken: Asset;
  setSelectedToken: (value: Asset) => void;
  error: string | null;
  setError: (value: string | null) => void;
  balanceLoading: boolean;
  refresh: () => Promise<void>;
  currentAccount?: ReturnType<typeof useCurrentAccount>;
  handlePercentage: (percent: number) => void;
  formattedBalance?: string;
  aiSuggested?: boolean;
  suiClient: SuiClient;
}

const SendInterface: React.FC<SendInterfaceProps> = ({
  onClose,
  onSuccess,
  amount,
  setAmount,
  recipient,
  setRecipient,
  selectedToken,
  setSelectedToken,
  error,
  setError,
  balanceLoading,
  refresh,
  currentAccount,
  handlePercentage,
  formattedBalance,
  aiSuggested = false,
}) => {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);

  const sendAssets = ["USDC", "SUI", "CETUS", "BTC", "ETH", "USDT"] as const;
  const [currentPrice, setCurrentPrice] = useState(0.0); 

  useEffect(() => {
    if (aiSuggested && amount > 0 && recipient) {
      setError(null);
    }
  }, [aiSuggested, amount, recipient, setError]);

  const handleTokenSelect = (token: Asset) => {
    setSelectedToken(token);
    setShowTokenDropdown(false);
  };

  const handleSendTransaction = async () => {
    if (!amount || !recipient || !currentAccount?.address) {
      setError("Please enter amount, recipient, and ensure wallet is connected");
      return;
    }
    setError(null);

    try {
      const intent: Intent = { action: "transfer", amount, recipient, asset: selectedToken };
      const txb = await buildTransaction(intent);

      const result = await signAndExecuteTransaction({
        transaction: txb as any,
      });

      if (onSuccess) onSuccess(`✅ Sent ${amount} ${selectedToken} to ${recipient}`);
      console.log("Digest:", result.digest);

      await refresh();
      onClose();
      setAmount(0);
      setRecipient("");
    } catch (err: any) {
      setError(`Transaction failed: ${err.message}`);
    }
  };

  return (
    <section className="relative container mx-auto px-6 py-10 sm:py-32 lg:py-10 lg:text-center">
      <div className="relative z-10">
        <h1 
          style={{ fontFamily: "poppins" }} 
          className="text-3xl hidden lg:block md:block md:text-[66.55px] font-semibold text-milo-dark-purpl bg-gradient-to-r from-[#7062FF] to-[#362F7B] bg-clip-text text-transparent leading-tight lg:leading-[66px]"
        >
          Send tokens or cash with MILO
        </h1>

        <div className="border border-[#362F7B] rounded-2xl p-6 lg:mt-10 max-w-4xl space-y-5 mx-auto">
          <div className="space-y-5">
            <div className="border bg-[#7062FF]/10 border-[#7062FF] pb-6 w-full rounded-2xl">
              <p className="text-[#7062FF] flex items-center text-[17.7px] font-medium pl-6 pr-6 pt-6 pb-2 text-start">
                You'll Send {' '}
                <img
                  src={Detail}
                  alt="Detail Icon"
                  className="ml-2 w-4 h-4" 
                />
              </p>

              <div className="flex justify-between items-center px-6">
                <div style={{ fontFamily: "poppins" }}>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        className="text-[35.78px] text-start font-semibold text-[#7062FF]/80 bg-transparent focus:outline-none w-full"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                    />
                    <p className="text-[15.96px] mt-4 text-start text-[#7062FF]">
                        ${amount.toFixed(2)}
                    </p>
                </div>

                <div style={{ fontFamily: "poppins" }} className="relative">
                  <button
                    onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                    className="border border-[#7062FF] bg-white text-[#7062FF] rounded-full lg:px-[60px] px-[40px] py-4 text-[16.38px] font-semibold transition flex items-center"
                  >
                    {selectedToken}
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  {showTokenDropdown && (
                    <div className="absolute right-0 mt-2 w-full bg-white border border-[#7062FF] rounded-lg shadow-lg z-10">
                      {sendAssets.map((asset) => (
                        <div
                          key={asset}
                          className="px-4 py-2 hover:bg-[#7062FF]/10 cursor-pointer"
                          onClick={() => handleTokenSelect(asset)}
                        >
                          {asset}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[15.96px] text-end mt-3 text-[#7062FF]">
                    {selectedToken} on Sui
                  </p>
                </div>
              </div>

              <div className="flex justify-center space-x-2 mt-6">
                <button
                  onClick={() => handlePercentage(25)}
                  className="px-4 py-2 bg-[#7062FF] text-white rounded-full text-sm font-medium hover:bg-[#362F7B] transition-colors"
                >
                  25%
                </button>
                <button
                  onClick={() => handlePercentage(50)}
                  className="px-4 py-2 bg-[#7062FF] text-white rounded-full text-sm font-medium hover:bg-[#362F7B] transition-colors"
                >
                  50%
                </button>
                <button
                  onClick={() => handlePercentage(100)}
                  className="px-4 py-2 bg-[#7062FF] text-white rounded-full text-sm font-medium hover:bg-[#362F7B] transition-colors"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="border bg-[#7062FF]/10 border-[#7062FF] pb-6 w-full rounded-2xl">
              <p className="text-[#7062FF] flex items-center text-[17.7px] font-medium pl-6 pr-6 pt-6 pb-2 text-start">
                To 
                <img
                  src={Detail}
                  alt="Detail Icon"
                  className="ml-2 w-4 h-4" 
                />
              </p>

              <div className="px-6">
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter recipient address"
                  className="w-full p-4 border border-[#7062FF]/50 rounded-2xl text-[16px] font-medium text-[#7062FF]/80 bg-transparent focus:outline-none focus:border-[#7062FF]"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSendTransaction}
                disabled={balanceLoading || !amount || !recipient}
                className="px-8 py-4 bg-[#7062FF] text-white rounded-full text-lg font-semibold hover:bg-[#362F7B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {balanceLoading ? "Sending..." : "Send"}
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-8 py-4 border border-[#7062FF] text-[#7062FF] rounded-full text-lg font-semibold hover:bg-[#7062FF]/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SendInterface;