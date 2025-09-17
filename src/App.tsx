import './App.css'
import Website from "./pages/Website.tsx";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import ChatHome from "./components/newChat/Chat.tsx";
import {WalletConnection} from "./components/landing/WalletConnection.tsx";
import React from "react";
import {useState, useEffect} from "react";
import {ChevronDown} from "lucide-react";



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
            <Website />
        );
    } else {
        return (
            <>
                <div className="flex absolute right-3 top-0 p-4">
                    <div className="flex items-center gap-4">
                        <button className="border px-6 py-2 rounded-1xl bg-white hover:bg-gray-50 transition flex items-center justify-center min-w-[150px]">
                            {loading && "Loading..."}
                            {error && `Error: ${error}`}
                            {balance !== null && !loading && !error && (
                                <span className="font-medium flex items-center text-center text-gray-700">Bal: {balance.toFixed(2)} SUI <ChevronDown size={18} className={"ml-3"} /></span>
                            )}
                        </button>
                        <WalletConnection />
                    </div>
                </div>
                <ChatHome />
            </>
        );
    }
}

export default App
