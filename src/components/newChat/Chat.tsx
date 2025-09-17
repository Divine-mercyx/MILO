import React, {useEffect} from "react";
import { ReplaceAll, Gem, Mic, Send, ArrowRightLeftIcon } from "lucide-react";
import { useState } from "react";

const ChatHome: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [greet, setGreet] = useState("1");

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
        <div className={`flex flex-col items-center ${ messages.length == 0 ? "justify-center" : "justify-end"} min-h-screen bg-[#ffffff] text-gray-600`}>
            {/* Title */}
            {messages.length == 0 && (
                greet === "1" ? (
                    <h1 className="lg:text-3xl md:text-4xl text-2xl md:text-4xl font-bold mb-10">Hey there, i'm <b className="text-[#6C55F5]">Milo</b></h1>
                ): (
                    <h1 className="lg:text-3xl md:text-4xl text-2xl font-bold mb-10">want to make a <b className="text-[#6C55F5]">transaction ?</b></h1>
                )
            )}

            {/* Input Box */}
            <div className="bg-[#ffffff] gap-3 mb-4 rounded-2xl px-4 py-3 w-[90%] md:w-[500px] shadow-lg">
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

                {/* Buttons */}
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
    );
};

export default ChatHome;
