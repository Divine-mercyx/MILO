import React, {useEffect} from "react";
import { ReplaceAll, Gem, Mic, Send, ArrowRightLeftIcon } from "lucide-react";
import { useState } from "react";
import ChatHeader from "../chat/Header.tsx";
import Swap from "../chat/swap/Swap.tsx";

const ChatHome: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [greet, setGreet] = useState("1");
    const [steps, setSteps] = useState("send");

    const handleSendMessage = (message: string) => {
        if (message.trim() === "") return;
        setMessages([...messages, message]);
        setInput("");
    }

    useEffect(() => {
        setTimeout(() => {
            setGreet("2");
        }, 4000)
    }, []);

    return (
        <div className={`flex w-full flex-col items-center min-h-screen bg-[#ffffff] text-gray-600`}>
            <div className="bg-white w-full font-sans text-milo-text relative">
                <ChatHeader />
            </div>

            { steps === "swap" && (
                <Swap />
            )}

            <div className={`hidden lg:flex flex-col items-center ${ messages.length == 0 ? "justify-center" : "justify-end"} flex-1 px-4 md:px-0`}>
                { steps === "send" && (
                    messages.length == 0 && (
                        greet === "1" ? (
                            <h1 className="lg:text-3xl md:text-4xl text-2xl md:text-4xl font-semibold mb-10">Hey there, i'm <b className="font-semibold text-[#6C55F5]">Milo</b></h1>
                        ): (
                            <h1 className="lg:text-3xl md:text-4xl text-2xl font-semibold mb-10">want to make a <b className="font-semibold text-[#6C55F5]">transaction ?</b></h1>
                        )
                    ))}

                { steps === "mint" && (
                    messages.length == 0 && (
                        <h1 className="lg:text-3xl md:text-4xl text-2xl md:text-4xl font-semibold mb-10">Hey there, Want to mint an <b className="font-semibold text-[#6C55F5]">NFT?</b></h1>
                    ))}

                <div className="bg-[#ffffff] gap-3 mb-4 rounded-2xl px-4 py-3 w-[90%] md:w-[700px] shadow-lg">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Make any transaction"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder-gray-400"
                        />
                        <button onClick={() => handleSendMessage(input)} className="flex items-center gap-1 bg-[#6C55F5] px-2 py-1 rounded-lg text-xs hover:bg-[#50515F] transition">
                            <Send size={14} className={"text-white"} />
                        </button>
                    </div>

                    <div className="flex justify-between mt-8 items-center gap-2">
                        <div className="flex items-center gap-2 text-xs">
                            <button onClick={() => setSteps("send")} className={`flex hover:text-white items-center border gap-1 px-2 py-1 rounded-lg text-xs ${steps === "send" ? "bg-[#6C55F5] text-white" : "bg-[#fffff]"} hover:bg-[#6C55F5] transition`}>
                                <ArrowRightLeftIcon size={14} />
                                Send
                            </button>
                            <button onClick={() => setSteps("swap")} className={`flex items-center border gap-1 px-2 py-1 rounded-lg text-xs ${ steps === "swap" ? "bg-[#6C55F5] text-white" : "bg-[#ffffff]" } hover:text-[#ffffff] hover:bg-[#6C55F5] transition`}>
                                <ReplaceAll size={14} />
                                Swap
                            </button>
                            <button onClick={() => setSteps("mint")} className={`flex items-center border gap-1 px-2 py-1 rounded-lg text-xs ${ steps === "mint" ? "bg-[#6C55F5] text-white" : "bg-[#ffffff]" } hover:text-[#ffffff] hover:bg-[#6C55F5] transition`}>
                                <Gem size={14} />
                                Mint
                            </button>
                        </div>
                        <button className="flex items-center hover:text-[#ffffff] border gap-1 bg-[#ffffff] px-2 py-1 rounded-lg text-xs hover:bg-[#6C55F5] transition">
                            <Mic size={14} />
                            Voice
                        </button>
                    </div>
                </div>
            </div>


            <div className="lg:hidden flex flex-col justify-end flex-1">
                { steps === "send" && (
                    messages.length == 0 && (
                        greet === "1" ? (
                            <h1 className="lg:text-3xl md:text-4xl text-2xl md:text-4xl font-semibold mb-10">Hey there, i'm <b className="font-semibold text-[#6C55F5]">Milo</b></h1>
                        ): (
                            <h1 className="lg:text-3xl md:text-4xl text-2xl font-semibold mb-10">want to make a <b className="font-semibold text-[#6C55F5]">transaction ?</b></h1>
                        )
                    ))}

                { steps === "mint" && (
                    messages.length == 0 && (
                        <h1 className="lg:text-3xl md:text-4xl text-2xl md:text-4xl font-semibold mb-10">Hey there, Want to mint an <b className="font-semibold text-[#6C55F5]">NFT?</b></h1>
                    ))}

                <div className="bg-[#ffffff] gap-3 mb-4 rounded-2xl px-4 py-3 w-[100%] md:w-[500px] shadow-lg">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Make any transaction"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder-gray-400"
                        />
                        <button onClick={() => handleSendMessage(input)} className="flex items-center gap-1 bg-[#6C55F5] px-2 py-1 rounded-lg text-xs hover:bg-[#50515F] transition">
                            <Send size={14} className={"text-white"} />
                        </button>
                    </div>

                    <div className="flex justify-between mt-8 items-center gap-2">
                        <div className="flex items-center gap-2 text-xs">
                            <button className="flex hover:text-white items-center border gap-1 bg-[#ffffff] px-2 py-1 rounded-lg text-xs hover:bg-[#6C55F5] transition">
                                <ArrowRightLeftIcon size={14} />
                                Transfer
                            </button>
                            <button className="flex items-center border gap-1 bg-[#ffffff] px-2 py-1 rounded-lg text-xs hover:text-[#ffffff] hover:bg-[#6C55F5] transition">
                                <ReplaceAll size={14} />
                                Swap
                            </button>
                            <button className="flex items-center border gap-1 bg-[#ffffff] px-2 py-1 rounded-lg text-xs hover:text-[#ffffff] hover:bg-[#6C55F5] transition">
                                <Gem size={14} />
                                Mint
                            </button>
                        </div>
                        <button className="flex items-center hover:text-[#ffffff] border gap-1 bg-[#ffffff] px-2 py-1 rounded-lg text-xs hover:bg-[#6C55F5] transition">
                            <Mic size={14} />
                            Voice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHome;
