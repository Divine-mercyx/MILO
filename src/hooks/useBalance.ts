import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useCallback } from "react";

export function useBalance() {
    const currentAccount = useCurrentAccount();
    const suiClient = useSuiClient();

    const getBalance = useCallback(async () => {
        if (!currentAccount?.address) {
            throw new Error("No wallet connected");
        }
        const balance = await suiClient.getBalance({
            owner: currentAccount.address,
        });
        return Number(balance.totalBalance) / 1_000_000_000;
    }, [suiClient, currentAccount?.address]);

    return { getBalance };
}
