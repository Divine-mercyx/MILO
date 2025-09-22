import React, { useEffect, useState, useRef } from "react";
import {
  ReplaceAll,
  Gem,
  Mic,
  Send,
  ArrowRightLeftIcon,
} from "lucide-react";
import ChatHeader from "../chat/Header";
import Swap from "../chat/swap/Swap";
import { useContacts } from "../../hooks/useContacts";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { buildTransaction, type Intent, type Asset } from "../../lib/suiTxBuilder";
import { useBalance } from "../../hooks/useBalances";
import SendInterface from "../chat/send/send";
import Mint from "../chat/mint/mint";
import { suiClient } from "../../config/suiClient";

type Message = {
  sender: "user" | "bot";
  text: string;
};

const ChatHome: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [greet, setGreet] = useState("1");
  const [steps, setSteps] = useState<"send" | "swap" | "mint">("send");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { addContact, contacts } = useContacts();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const {
    balance,
    formattedBalance,
    loading: balanceLoading,
    refresh,
  } = useBalance();
  const [showSendInterface, setShowSendInterface] = useState(false);
  const [amount, setAmount] = useState(0.0);
  const [recipient, setRecipient] = useState("");
  const [selectedToken, setSelectedToken] = useState<Asset>("SUI");
  const [error, setError] = useState<string | null>(null);
  const [pendingIntent, setPendingIntent] = useState<Intent | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const executeTransfer = async (intent: Intent) => {
    try {
      const txb = await buildTransaction(intent);
      const result = await signAndExecuteTransaction({
        transaction: txb as any,
      });
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `✅ Transaction successful! Digest: ${result.digest}`,
        },
      ]);
      await refresh();
    } catch (error) {
      console.error("Transaction failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Transaction failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
      ]);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (message.trim() === "") return;

    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setInput("");

    if (awaitingConfirmation && pendingIntent) {
      const normalized = message.toLowerCase().trim();
      if (["yes", "y", "confirm"].includes(normalized)) {
        try {
          const txb = await buildTransaction(pendingIntent);
          const result = await signAndExecuteTransaction({
            transaction: txb as any,
          });
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: `✅ Sent ${pendingIntent.amount} ${pendingIntent.asset} to ${pendingIntent.recipient}. Digest: ${result.digest}`,
            },
          ]);
        } catch (err: any) {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: `Transaction failed: ${err.message}` },
          ]);
        }
      } else if (["no", "n", "cancel"].includes(normalized)) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Transaction cancelled." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Please reply 'yes' or 'no'." },
        ]);
        return; 
      }
      setPendingIntent(null);
      setAwaitingConfirmation(false);
    } else {
      try {
        setLoading(true);
        const res = await fetch(
          "https://milobrain.onrender.com/api/v1/ai/response",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: message, contacts }),
          }
        );
        const data = await res.json();
        if (data.action === "transfer") {
          const botText =
            data.message || "I can transfer for you. Should I proceed?";
          setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
          setPendingIntent({
            action: "transfer",
            amount: parseFloat(data.amount),
            recipient: data.recipient,
            asset: "SUI",
          });
          setAwaitingConfirmation(true);
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: data.message || "Done!" },
          ]);
        }
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `Server error: ${err.message}` },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendSuccess = (message: string) => {
    setMessages((prev) => [...prev, { sender: "bot", text: message }]);
    setShowSendInterface(false);
    setAmount(0);
    setRecipient("");
  };

  const handlePercentage = (percent: number) => {
    if (balance) setAmount((balance * percent) / 100);
  };

  useEffect(() => {
    const timer = setTimeout(() => setGreet("2"), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
  <div className="flex flex-col w-full items-center min-h-screen bg-[#ffffff] text-gray-600">
    {/* Header */}
    <div className="bg-white w-full font-sans text-milo-text relative">
      <ChatHeader addContact={addContact} contacts={contacts} />
    </div>

    {/* Conditional Screens */}
    {steps === "send" && (
      <>
        {showSendInterface && (
          <SendInterface
            onClose={() => setShowSendInterface(false)}
            onSuccess={handleSendSuccess}
            amount={amount}
            setAmount={setAmount}
            recipient={recipient}
            setRecipient={setRecipient}
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
            error={error}
            setError={setError}
            balanceLoading={balanceLoading}
            refresh={refresh}
            currentAccount={currentAccount}
            handlePercentage={handlePercentage}
            formattedBalance={formattedBalance}
            suiClient={suiClient}
          />
        )}

        {/* Send Chat */}
        <div className="w-full max-w-[700px] px-4 mb-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
                  msg.sender === "user"
                    ? "bg-[#6C55F5] text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
import React, {useEffect} from "react";
import { ReplaceAll, Gem, Mic, Send, ArrowRightLeftIcon } from "lucide-react";
import { useState, useRef } from "react";
import ChatHeader from "../chat/Header.tsx";
import Swap from "../chat/swap/Swap.tsx";
import {useContacts} from "../../hooks/useContacts.ts";
import {useSignTransaction, useSuiClient} from "@mysten/dapp-kit";
import {buildTransaction} from "../../lib/suiTxBuilder.ts";


type Message = {
    sender: "user" | "bot";
    text: string;
};


const ChatHome: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [greet, setGreet] = useState("1");
    const [steps, setSteps] = useState("send");
    const chatEndRef = useRef<HTMLDivElement>(null);
    const {addContact, contacts} = useContacts();
    const { mutate: signTransaction } = useSignTransaction();
    const client = useSuiClient();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const submitTransaction = async (bytes: string, signature: string) => {
        try {
            const response = await client.executeTransactionBlock({
                transactionBlock: bytes,
                signature: signature,
                options: {
                    showEffects: true,
                    showEvents: true,
                },
            });

            const digest = response.digest;
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: `✅ Transaction successful! View it on the testnet explorer: https://suiexplorer.com/tx/${digest}?network=testnet`,
                },
            ]);
        } catch (error) {
            console.error("Failed to submit transaction:", error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: `❌ Transaction submission failed: ${
                        error instanceof Error ? error.message : "Unknown error"
                    }`,
                },
            ]);
        }
    };


    const executeTransfer = async (intent: any) => {
        try {
            const transaction = await buildTransaction(intent);

            signTransaction(
                { transaction },
                {
                    onSuccess: async ({ bytes, signature }) => {
                        await submitTransaction(bytes, signature);
                    },
                    onError: (error: Error) => {
                        console.error("Transaction failed:", error);
                        setMessages(prev => [...prev, {
                            sender: "bot",
                            text: `❌ Transaction failed: ${error.message || "Unknown error"}`
                        }]);
                    }
                }
            );

        } catch (error) {
            console.error("Transaction building failed:", error);
            setMessages(prev => [...prev, {
                sender: "bot",
                text: `❌ Failed to create transaction: ${error instanceof Error ? error.message : "Unknown error"}`
            }]);
        }
    }


    const handleSendMessage = async (message: string) => {
        if (message.trim() === "") return;

        setMessages(prev => [...prev, { sender: "user", text: message }]);
        setInput("");

        console.log(contacts);

        try {
            setLoading(true);
            const res = await fetch("https://milobrain.onrender.com/api/v1/ai/response", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: message, contacts: contacts })
            });

            const data = await res.json();

            if (data.action === "transfer") {
                const botText = data.message || data.reply || data.error || "Sorry, something went wrong.";
                setMessages(prev => [...prev, { sender: "bot", text: botText }]);
                await executeTransfer(data);
            } else {
                const botText = data.message || data.reply || data.error || "Sorry, something went wrong.";
                setMessages(prev => [...prev, { sender: "bot", text: botText }]);
            }



        } catch (err) {
            const error = err as Error;
            setMessages(prev => [...prev, {
                sender: "bot",
                text: `Server error: ${error.message}. Please try again later.`
            }]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setTimeout(() => {
            setGreet("2");
        }, 4000)
    }, []);

    return (
        <div className={`flex w-full flex-col items-center min-h-screen bg-[#ffffff] text-gray-600`}>
            <div className="bg-white w-full font-sans text-milo-text relative">
                <ChatHeader addContact={addContact} contacts={contacts} />
            </div>

            { steps === "swap" && (
                <Swap />
            )}

            { steps !== "swap" && (
                <>
                    <br /><br /><br /><br /><br />
                </>
            )}
            {loading && <div className="text-sm text-gray-400 mb-2">Milo is thinking...</div>}
            { steps !== "swap" && (
                <>
                    <div className="w-full max-w-[700px] px-4 mb-4 space-y-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
                                        msg.sender === "user"
                                            ? "bg-[#6C55F5] text-white rounded-br-none"
                                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div ref={chatEndRef} />
                </>
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
          ))}
        </div>
        <div ref={chatEndRef} />
      </>
    )}

    {steps === "swap" && <Swap />}
    {steps === "mint" && <Mint />}

    {/* Bottom Input Bar - visible for all steps */}
    <div className="bg-[#ffffff] gap-3 mb-4 rounded-2xl px-4 py-3 w-[90%] md:w-[700px] shadow-lg">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Make any transaction"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage(input)}
          className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder-gray-400"
        />
        <button
          onClick={() => handleSendMessage(input)}
          className="flex items-center gap-1 bg-[#6C55F5] px-2 py-1 rounded-lg text-xs hover:bg-[#50515F] transition"
        >
          <Send size={14} className="text-white" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8 items-center gap-2">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setSteps("send")}
            className={`flex items-center border gap-1 px-2 py-1 rounded-lg text-xs ${
              steps === "send" ? "bg-[#6C55F5] text-white" : "bg-white"
            } hover:bg-[#6C55F5] transition`}
          >
            <ArrowRightLeftIcon size={14} /> Send
          </button>
          <button
            onClick={() => setSteps("swap")}
            className={`flex items-center border gap-1 px-2 py-1 rounded-lg text-xs ${
              steps === "swap" ? "bg-[#6C55F5] text-white" : "bg-white"
            } hover:bg-[#6C55F5] transition`}
          >
            <ReplaceAll size={14} /> Swap
          </button>
          <button
            onClick={() => setSteps("mint")}
            className={`flex items-center border gap-1 px-2 py-1 rounded-lg text-xs ${
              steps === "mint" ? "bg-[#6C55F5] text-white" : "bg-white"
            } hover:bg-[#6C55F5] transition`}
          >
            <Gem size={14} /> Mint
          </button>
        </div>
        <button className="flex items-center border gap-1 bg-white px-2 py-1 rounded-lg text-xs hover:text-white hover:bg-[#6C55F5] transition">
          <Mic size={14} /> Voice
        </button>
      </div>
    </div>
  </div>
);
};

export default ChatHome;