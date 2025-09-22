import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useCallback, useEffect, useState } from "react";

export function useBalance() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  const [balance, setBalance] = useState<number | null>(null);
  const [formattedBalance, setFormattedBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!currentAccount?.address) {
      setBalance(null);
      setFormattedBalance("0.00");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await suiClient.getBalance({
        owner: currentAccount.address,
        coinType: "0x2::sui::SUI", 
      });

      const raw = Number(res.totalBalance) / 1_000_000_000; 
      setBalance(raw);

      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(raw);

      setFormattedBalance(formatted);
    } catch (err: any) {
      setError(err.message || "Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  }, [suiClient, currentAccount?.address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,           
    formattedBalance,  
    loading,
    error,
    refresh: fetchBalance,
  };
}
