import React, { useState } from "react";
import BankAccountExample from "./BankAccountExample.tsx";
import {Detail, SwapIcon2} from "../../../assets/icons/icons.tsx";

const Swap: React.FC = () => {
    // State for price and dropdowns
    const [price, setPrice] = useState(0.00);
    const [sendAsset, setSendAsset] = useState("USDC");
    const [receiveAsset, setReceiveAsset] = useState("NGN");
    const [showSendDropdown, setShowSendDropdown] = useState(false);
    const [showReceiveDropdown, setShowReceiveDropdown] = useState(false);

    // Available assets for dropdown
    const sendAssets = ["USDC", "USDT", "SUI"];
    const receiveAssets = ["NGN", "USD", "EUR"];

    const handleSendAssetSelect = (asset: string) => {
        setSendAsset(asset);
        setShowSendDropdown(false);
    };

    const handleReceiveAssetSelect = (asset: string) => {
        setReceiveAsset(asset);
        setShowReceiveDropdown(false);
    };

    return (
        <>
            <section className="relative container mx-auto px-6 py-10 sm:py-32 lg:py-10 lg:text-center">
                <div className="relative z-10">
                    <h1 style={{ fontFamily: "poppins" }} className="text-3xl hidden lg:block md:block md:text-[66.55px] font-semibold text-milo-dark-purpl bg-gradient-to-r from-[#7062FF] to-[#362F7B] bg-clip-text text-transparent leading-tight lg:leading-[66px]">
                        Talk to MILO while you <br /> move your money
                    </h1>

                    <div className="border border-[#362F7B] rounded-2xl p-6 lg:mt-10 max-w-4xl  space-y-5 mx-auto">
                        <div className="space-y-5">
                            <div className="border bg-[#7062FF]/10 border-[#7062FF] pb-6 w-full rounded-2xl">
                                <p className="text-[#7062FF] flex items-center text-[17.7px] font-medium pl-6 pr-6 pt-6 pb-2 text-start">
                                    You'll Send <Detail className="ml-2" />
                                </p>

                                <div className="flex justify-between items-center px-6">
                                    <div style={{ fontFamily: "poppins" }}>
                                        <p className="text-[35.78px] text-start font-semibold text-[#7062FF]/80">{price.toFixed(2)}</p>
                                        <p className="text-[15.96px] mt-4 text-start text-[#7062FF]">${price.toFixed(2)}</p>
                                    </div>
                                    <div style={{ fontFamily: "poppins" }} className="relative">
                                        <button
                                            onClick={() => setShowSendDropdown(!showSendDropdown)}
                                            className="border border-[#7062FF] bg-white text-[#7062FF] rounded-full lg:px-[60px] px-[40px] py-4 text-[16.38px] font-semibold transition flex items-center"
                                        >
                                            {sendAsset}
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
                                        {showSendDropdown && (
                                            <div className="absolute right-0 mt-2 w-full bg-white border border-[#7062FF] rounded-lg shadow-lg z-10">
                                                {sendAssets.map((asset) => (
                                                    <div
                                                        key={asset}
                                                        className="px-4 py-2 hover:bg-[#7062FF]/10 cursor-pointer"
                                                        onClick={() => handleSendAssetSelect(asset)}
                                                    >
                                                        {asset}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-[15.96px] text-end mt-3 text-[#7062FF]">{sendAsset} on Base</p>
                                    </div>
                                </div>

                                <div className="border border-l-0 border-r-0 border-[#7062FF] h-[70px] w-[70px] bg-white flex justify-center items-center rounded-full absolute top-[350px] left-[710px]">
                                    <SwapIcon2 />
                                </div>
                            </div>

                            <div className="border bg-[#7062FF]/10 border-[#7062FF] pb-6 w-full rounded-2xl">
                                <p className="text-[#7062FF] flex items-center text-[17.7px] font-medium pl-6 pr-6 pt-6 pb-2 text-start">
                                    You'll Receive <Detail className="ml-2" />
                                </p>

                                <div className="flex justify-between items-center px-6">
                                    <div style={{ fontFamily: "poppins" }}>
                                        <p className="text-[35.78px] text-start font-semibold text-[#7062FF]/80">0.00</p>
                                        <p className="text-[15.96px] mt-4 text-start flex items-center text-[#7062FF]">Min. 0.00 {receiveAsset} <Detail className="ml-2 mb-1" /></p>
                                    </div>
                                    <div style={{ fontFamily: "poppins" }} className="relative">
                                        <button
                                            onClick={() => setShowReceiveDropdown(!showReceiveDropdown)}
                                            className="border border-[#7062FF] bg-white text-[#7062FF] rounded-full px-[40px] py-4 text-[16.38px] font-semibold transition flex items-center"
                                        >
                                            {receiveAsset}
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
                                        {showReceiveDropdown && (
                                            <div className="absolute right-0 mt-2 w-full bg-white border border-[#7062FF] rounded-lg shadow-lg z-10">
                                                {receiveAssets.map((asset) => (
                                                    <div
                                                        key={asset}
                                                        className="px-4 py-2 hover:bg-[#7062FF]/10 cursor-pointer"
                                                        onClick={() => handleReceiveAssetSelect(asset)}
                                                    >
                                                        {asset}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-[15.96px] text-end mt-3 text-[#7062FF]">
                                            {receiveAsset === "NGN" ? "Nigerian Naira" :
                                                receiveAsset === "USD" ? "US Dollar" : "Euro"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <BankAccountExample />
                    </div>
                </div>
            </section>
        </>
    )
}
export default Swap;
