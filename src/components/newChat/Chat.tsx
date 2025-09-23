import React, {useEffect} from "react";
import { ReplaceAll, Gem, Mic, Send, ArrowRightLeftIcon, Square, ChevronDown, Globe } from "lucide-react";
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

// Simplified and correct TypeScript interfaces
interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
    readonly resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: ((event: Event) => void) | null;
    onstart: (() => void) | null;
}

// Global declaration without conflicting types
declare global {
    interface Window {
        SpeechRecognition: {
            new (): SpeechRecognition;
        };
        webkitSpeechRecognition: {
            new (): SpeechRecognition;
        };
    }
}

const ChatHome: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [greet, setGreet] = useState("1");
    const [steps, setSteps] = useState("send");
    const [isListening, setIsListening] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

    const [supportedLanguages] = useState([
        // Nigerian Languages
        { code: 'ig-NG', name: 'Igbo', flag: '🇳🇬', nativeName: 'Ásụ̀sụ́ Ìgbò' },
        { code: 'yo-NG', name: 'Yoruba', flag: '🇳🇬', nativeName: 'Èdè Yorùbá' },
        { code: 'ha-NG', name: 'Hausa', flag: '🇳🇬', nativeName: 'Harshen Hausa' },

        // International Languages
        { code: 'en-US', name: 'English', flag: '🇺🇸', nativeName: 'English' },
        { code: 'es-ES', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
        { code: 'fr-FR', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
        { code: 'de-DE', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
        { code: 'it-IT', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
        { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
        { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
        { code: 'ko-KR', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
        { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
    ]);

    const [currentLanguage, setCurrentLanguage] = useState('en-US');

    const chatEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const {addContact, contacts} = useContacts();
    const { mutate: signTransaction } = useSignTransaction();
    const client = useSuiClient();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
                setIsLanguageDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initialize Speech Recognition
    useEffect(() => {
        const initSpeechRecognition = () => {
            // Check if browser supports speech recognition
            const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (!SpeechRecognitionClass) {
                console.warn('Speech Recognition not supported in this browser');
                setMessages(prev => [...prev, {
                    sender: "bot",
                    text: "❌ Voice input is not supported in your browser. Please use Chrome, Edge, or Safari."
                }]);
                return;
            }

            const recognition = new SpeechRecognitionClass();
            recognitionRef.current = recognition;

            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = currentLanguage;

            recognition.onstart = () => {
                console.log('Speech recognition started');
                setIsListening(true);
            };

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');

                console.log('Original transcript:', transcript);

                let cleanedTranscript = transcript.trim();

                const cryptoCorrections: { [key: string]: { [key: string]: string } } = {
                    'yo-NG': {
                        'sweet': 'SUI',
                        'swee': 'SUI',
                        'swit': 'SUI',
                        'soy': 'SUI',
                        's u i': 'SUI',
                        'usdc': 'USDC',
                        'bitcoin': 'Bitcoin',
                        'eth': 'ETH'
                    },
                    'ig-NG': {
                        'sweet': 'SUI',
                        'sui': 'SUI',
                        'usdc': 'USDC'
                    },
                    'ha-NG': {
                        'sweet': 'SUI',
                        'sui': 'SUI',
                        'swi': 'SUI'
                    }
                };

                if (cryptoCorrections[currentLanguage]) {
                    Object.entries(cryptoCorrections[currentLanguage]).forEach(([wrong, correct]) => {
                        const regex = new RegExp(wrong, 'gi');
                        cleanedTranscript = cleanedTranscript.replace(regex, correct);
                    });
                }

                cleanedTranscript = cleanedTranscript
                    .replace(/\bs u i\b/gi, 'SUI')
                    .replace(/\bs u y\b/gi, 'SUI')
                    .replace(/\byou es dee see\b/gi, 'USDC')
                    .replace(/\bbit coin\b/gi, 'Bitcoin');

                console.log('Corrected transcript:', cleanedTranscript);
                setInput(cleanedTranscript);
            };

            recognition.onend = () => {
                console.log('Speech recognition ended');
                setIsListening(false);
            };

            recognition.onerror = (event: Event) => {
                const errorEvent = event as any;
                console.error('Speech recognition error:', errorEvent.error);
                setIsListening(false);

                let errorMessage = 'Voice input error: ';
                switch (errorEvent.error) {
                    case 'not-allowed':
                        errorMessage += 'Microphone access denied. Please allow microphone permissions.';
                        break;
                    case 'audio-capture':
                        errorMessage += 'No microphone found. Please check your audio devices.';
                        break;
                    case 'network':
                        errorMessage += 'Network error occurred. Please check your connection.';
                        break;
                    default:
                        errorMessage += `${errorEvent.error}. Please try again.`;
                }

                setMessages(prev => [...prev, {
                    sender: "bot",
                    text: `❌ ${errorMessage}`
                }]);
            };

            recognition.onstart = () => {
                console.log('Speech recognition started');
                setIsListening(true);
            };
        };

        initSpeechRecognition();

        // Cleanup function
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [currentLanguage]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            setMessages(prev => [...prev, {
                sender: "bot",
                text: "❌ Speech recognition not available. Please refresh the page."
            }]);
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            // Request microphone permission
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(() => {
                        setInput(""); // Clear previous input
                        recognitionRef.current?.start();
                    })
                    .catch(err => {
                        console.error('Microphone permission denied:', err);
                        setMessages(prev => [...prev, {
                            sender: "bot",
                            text: "❌ Microphone access is required for voice input. Please allow microphone permissions."
                        }]);
                    });
            } else {
                recognitionRef.current.start();
            }
        }
    };

    const changeLanguage = (langCode: string) => {
        const newLanguage = supportedLanguages.find(lang => lang.code === langCode);
        setCurrentLanguage(langCode);
        setIsLanguageDropdownOpen(false);

        if (recognitionRef.current) {
            recognitionRef.current.lang = langCode;
        }

        const languageTips: { [key: string]: string } = {
            'yo-NG': "💡 Pro tip: Say 'S-U-I' slowly or 'Sui coin' for best recognition",
            'ig-NG': "💡 Pro tip: Spell 'S-U-I' clearly for cryptocurrency terms",
            'ha-NG': "💡 Pro tip: Pronounce 'S-U-I' distinctly for crypto words"
        };

        setMessages(prev => [...prev, {
            sender: "bot",
            text: `🌍 Language changed to ${newLanguage?.name || langCode} ${newLanguage?.flag || ''}\n${languageTips[langCode] || ''}`
        }]);
    };

    const getCurrentLanguage = () => {
        return supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];
    };

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

            { steps === "swap" && <Swap /> }

            { steps !== "swap" && <><br /><br /><br /><br /><br /></> }

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
                        {isListening && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 rounded-xl rounded-bl-none px-4 py-2 max-w-[80%]">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className="w-1 bg-green-500 rounded-full animate-pulse"
                                                    style={{
                                                        height: `${Math.random() * 12 + 4}px`,
                                                        animationDelay: `${i * 0.2}s`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm">Listening... Speak now</span>
                                    </div>
                                </div>
                            </div>
                        )}
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
                            placeholder={isListening ? "Listening... Speak now" : "Make any transaction"}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder-gray-400"
                            disabled={isListening}
                        />
                        <button
                            onClick={() => handleSendMessage(input)}
                            className="flex items-center gap-1 bg-[#6C55F5] px-2 py-1 rounded-lg text-xs hover:bg-[#50515F] transition"
                            disabled={isListening}
                        >
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
                        <div className="flex items-center gap-2">
                            {/* Language Dropdown Selector */}
                            <div className="relative" ref={languageDropdownRef}>
                                <button
                                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                                >
                                    <Globe size={16} className="text-gray-600" />
                                    <span className="text-sm font-medium">
                                        {getCurrentLanguage().flag} {getCurrentLanguage().name}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`text-gray-600 transition-transform ${
                                            isLanguageDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isLanguageDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                                        <div className="p-2">
                                            {/* Nigerian Languages Section */}
                                            <div className="mb-2">
                                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                                    Nigerian Languages 🇳🇬
                                                </div>
                                                {supportedLanguages
                                                    .filter(lang => lang.code.includes('NG'))
                                                    .map((lang) => (
                                                        <button
                                                            key={lang.code}
                                                            onClick={() => changeLanguage(lang.code)}
                                                            className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded-md text-sm transition-colors ${
                                                                currentLanguage === lang.code
                                                                    ? 'bg-[#6C55F5] text-white'
                                                                    : 'hover:bg-gray-100 text-gray-700'
                                                            }`}
                                                        >
                                                            <span className="text-base">{lang.flag}</span>
                                                            <div className="flex-1">
                                                                <div className="font-medium">{lang.name}</div>
                                                                <div className="text-xs opacity-80">{lang.nativeName}</div>
                                                            </div>
                                                            {currentLanguage === lang.code && (
                                                                <div className="w-2 h-2 bg-white rounded-full" />
                                                            )}
                                                        </button>
                                                    ))
                                                }
                                            </div>

                                            {/* International Languages Section */}
                                            <div>
                                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                                    International Languages
                                                </div>
                                                {supportedLanguages
                                                    .filter(lang => !lang.code.includes('NG'))
                                                    .map((lang) => (
                                                        <button
                                                            key={lang.code}
                                                            onClick={() => changeLanguage(lang.code)}
                                                            className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded-md text-sm transition-colors ${
                                                                currentLanguage === lang.code
                                                                    ? 'bg-[#6C55F5] text-white'
                                                                    : 'hover:bg-gray-100 text-gray-700'
                                                            }`}
                                                        >
                                                            <span className="text-base">{lang.flag}</span>
                                                            <div className="flex-1">
                                                                <div className="font-medium">{lang.name}</div>
                                                                <div className="text-xs opacity-80">{lang.nativeName}</div>
                                                            </div>
                                                            {currentLanguage === lang.code && (
                                                                <div className="w-2 h-2 bg-white rounded-full" />
                                                            )}
                                                        </button>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={toggleListening}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition ${
                                    isListening
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-white border border-gray-300 text-gray-600 hover:bg-[#6C55F5] hover:text-white"
                                }`}
                            >
                                {isListening ? <Square size={14} /> : <Mic size={14} />}
                                {isListening ? "Stop" : "Voice"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile version */}
            <div className="lg:hidden flex flex-col justify-end flex-1">
                {/* Mobile content remains the same */}
            </div>
        </div>
    );
};

export default ChatHome;
