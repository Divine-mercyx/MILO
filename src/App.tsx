import React, { useEffect, useState } from "react";
import './App.css'
import Website from "./pages/Website.tsx";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import ChatHome from "./components/newChat/Chat.tsx";
import {Toaster} from "react-hot-toast";

function App() {
    const currentAccount = useCurrentAccount();
    const suiClient = useSuiClient();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchBalance = async () => {
            if (!currentAccount?.address) {
                setBalance(null);
                return;
            }
            try {
                setLoading(true);
                const balance = await suiClient.getBalance({
                    owner: currentAccount.address,
                    coinType: "0x2::sui::SUI",
                });
                setBalance(Number(balance.totalBalance) / 1_000_000_000);
            } catch (err: any) {
                setError(err.message || "Failed to fetch balance");
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, [suiClient, currentAccount?.address]);


    if (!currentAccount) {
        return (
            <>
                <Website />
                <Toaster position="top-right" reverseOrder={false} />
            </>
            
        );
    } else {
        return (
            <>
                <ChatHome />
                <Toaster position="top-right" reverseOrder={false} />
            </>
        );
    }
    
}

export default App
