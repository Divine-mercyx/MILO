import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import {useEffect, useState} from "react";
import { Wallet, ChevronDown, Copy, ExternalLink } from "lucide-react";
import {useSuiClient} from "@mysten/dapp-kit";

export const WalletConnection = () => {
    const currentAccount = useCurrentAccount();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [copied, setCopied] = useState(false);
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

    const copyAddress = () => {
        if (currentAccount?.address) {
            navigator.clipboard.writeText(currentAccount.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (currentAccount) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-600 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative flex items-center gap-3">
                        <div className="flex flex-col items-start">
                            <span className="text-sm text-white/90 font-medium font-mono">
                                {formatAddress(currentAccount.address)}
                            </span>
                        </div>
                        
                        <ChevronDown
                            className={`w-4 h-4 text-white/90 transition-transform duration-200 ${
                                isDropdownOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </div>
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full mt-2 right-0 w-80 bg-white backdrop-blur-2xl border border-gray-200 rounded-2xl shadow-2xl p-4 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                                    <Wallet className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium mb-2 text-gray-900">Wallet Connected</p>
                                    <p className="text-xs text-gray-600 break-all">
                                        <span className="text-2xl font-bold min-w-[150px]">
                                            {loading && "Loading..."}
                                            {error && `Error: ${error}`}
                                            {balance !== null && !loading && !error && (
                                                <span className="font-medium flex">{balance.toFixed(2)} SUI</span>
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={copyAddress}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-all duration-200 hover:scale-105"
                                >
                                    <Copy className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">
                                        {copied ? 'Copied!' : 'Copy'}
                                    </span>
                                </button>

                                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-all duration-200 hover:scale-105">
                                    <ExternalLink className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">Explorer</span>
                                </button>
                            </div>

                            <ConnectButton
                                connectText="Disconnect"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all duration-200 text-red-600 hover:text-red-700"
                            />
                        </div>
                    </div>
                )}

                {isDropdownOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                    />
                )}
            </div>
        );
    }

    return (
        <ConnectButton
            connectText="Connect Wallet"
            style={{ color: "white" }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium shadow-lg"
        />
    );
};