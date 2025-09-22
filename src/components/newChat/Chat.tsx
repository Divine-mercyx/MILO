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