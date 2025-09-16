import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import { Wallet, ChevronDown, Copy, ExternalLink } from "lucide-react";

export const WalletConnection = () => {
    const currentAccount = useCurrentAccount();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [copied, setCopied] = useState(false);

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
                    className="group relative flex items-center gap-3 px-8 py-3 bg-[#6C55F5] backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:border-white/30"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                    <div className="relative flex items-center gap-3">
                        <div className="flex flex-col items-start">
                            <span style={{ fontFamily: "poppins" }} className="text-xs text-white/70 font-bold font-mono">
                                {formatAddress(currentAccount.address)}
                            </span>
                        </div>

                        <ChevronDown
                            className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                                isDropdownOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </div>
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full mt-2 right-0 w-80 bg-[#6C55F5] backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-4 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                                    <Wallet className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">Wallet Connected</p>
                                    <p className="text-xs text-white/60 font-mono break-all">
                                        {currentAccount.address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={copyAddress}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200 hover:scale-105"
                                >
                                    <Copy className="w-4 h-4 text-white/80" />
                                    <span className="text-sm text-white/80">
                                        {copied ? 'Copied!' : 'Copy'}
                                    </span>
                                </button>

                                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200 hover:scale-105">
                                    <ExternalLink className="w-4 h-4 text-white/80" />
                                    <span className="text-sm text-white/80">Explorer</span>
                                </button>
                            </div>

                            <ConnectButton
                                connectText="Disconnect"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl transition-all duration-200 text-red-200 hover:text-red-100"
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
            style={{
                background: "#6C55F5",
                color: "white",
                fontFamily: "poppins",
            }}
        />
    );
};
