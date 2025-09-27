import React, {useEffect} from "react";
import { ReplaceAll, Gem, Mic, Send, ArrowRightLeftIcon, Square, ChevronDown, Globe, Volume2, XCircle, CheckCircle, Clock, ExternalLink, Loader } from "lucide-react";
import { useState, useRef } from "react";
import ChatHeader from "../chat/Header.tsx";
import Swap from "../chat/swap/Swap.tsx";
import {useContacts} from "../../hooks/useContacts.ts";
import {useSignTransaction, useSuiClient} from "@mysten/dapp-kit";
import {buildTransaction} from "../../lib/suiTxBuilder.ts";
import Mint from "../chat/mint/Mint.tsx";

type Message = {
    sender: "user" | "bot";
    text: string;
    type?: 'text' | 'transaction' | 'error';
    transactionData?: {
        digest?: string;
        status?: 'pending' | 'success' | 'failed';
        gasUsed?: string;
        eventsCount?: number;
        timestamp?: Date;
    };
};

const ChatHome: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [greet, setGreet] = useState("1");
    const [steps, setSteps] = useState("send");
    const [isListening, setIsListening] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);

    const [supportedLanguages] = useState([
        // Nigerian Languages
        { code: 'ig', name: 'Igbo', flag: '🇳🇬', nativeName: 'Ásụ̀sụ́ Ìgbò', apiCode: 'ig' },
        { code: 'yo', name: 'Yoruba', flag: '🇳🇬', nativeName: 'Èdè Yorùbá', apiCode: 'yo' },
        { code: 'ha', name: 'Hausa', flag: '🇳🇬', nativeName: 'Harshen Hausa', apiCode: 'ha' },
        // International Languages
        { code: 'en-US', name: 'English', flag: '🇺🇸', nativeName: 'English', apiCode: 'en' },
        { code: 'es-ES', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español', apiCode: 'es' },
        { code: 'fr-FR', name: 'French', flag: '🇫🇷', nativeName: 'Français', apiCode: 'fr' },
        { code: 'de-DE', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch', apiCode: 'de' },
        { code: 'it-IT', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano', apiCode: 'it' },
        { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português', apiCode: 'pt' },
        { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語', apiCode: 'ja' },
        { code: 'ko-KR', name: 'Korean', flag: '🇰🇷', nativeName: '한국어', apiCode: 'ko' },
        { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳', nativeName: '中文', apiCode: 'zh' },
    ]);

    const [currentLanguage, setCurrentLanguage] = useState('en-US');

    const chatEndRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const {addContact, contacts} = useContacts();
    const { mutate: signTransaction } = useSignTransaction();
    const client = useSuiClient();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
                setIsLanguageDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    const getLanguageApiCode = (langCode: string): string => {
        const lang = supportedLanguages.find(l => l.code === langCode);
        return lang?.name || 'English';
    };

    const transcribeAudio = async (audioBlob: Blob, language: string): Promise<string> => {
        try {
            setIsTranscribing(true);

            // Convert blob to base64
            const audioBase64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    // Remove data URL prefix
                    const base64 = reader.result as string;
                    resolve(base64.split(',')[1]);
                };
            });

            const response = await fetch('https://milobrain.onrender.com/api/v1/ai/transcribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    audio: audioBase64,
                    mimeType: 'audio/wav',
                    language: getLanguageApiCode(language)
                }),
            });

            if (!response.ok) {
                throw new Error(`Transcription failed: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.transcription) {
                return data.transcription;
            } else {
                throw new Error('No transcription text returned');
            }
        } catch (error) {
            console.error('Transcription error:', error);
            throw error;
        } finally {
            setIsTranscribing(false);
        }
    };

    // Start recording audio
    const startRecording = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Audio recording not supported in this browser');
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            audioChunksRef.current = [];
            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());

                if (audioChunksRef.current.length > 0) {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

                    try {
                        const transcribedText = await transcribeAudio(audioBlob, currentLanguage);
                        setInput(transcribedText);
                    } catch (error) {
                        console.error('Transcription failed:', error);
                        setMessages(prev => [...prev, {
                            sender: "bot",
                            text: "❌ Voice transcription failed. Please try again or type your message."
                        }]);
                    }
                }
            };

            mediaRecorderRef.current.start();
            setIsListening(true);

        } catch (error) {
            console.error('Error starting recording:', error);
            setMessages(prev => [...prev, {
                sender: "bot",
                text: "❌ Microphone access is required for voice input. Please allow microphone permissions."
            }]);
        }
    };

    // Stop recording audio
    const stopRecording = () => {
        if (mediaRecorderRef.current && isListening) {
            mediaRecorderRef.current.stop();
            setIsListening(false);
        }
    };

    // Toggle voice recording
    const toggleListening = () => {
        if (isTranscribing) return; // Prevent multiple clicks during transcription

        if (isListening) {
            stopRecording();
        } else {
            setInput(""); // Clear previous input
            startRecording();
        }
    };

    // Text-to-speech function
    const speakText = (text: string) => {
        if (synthRef.current) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = currentLanguage;
            utterance.rate = 0.8;
            utterance.pitch = 1;
            synthRef.current.speak(utterance);
        }
    };

    const changeLanguage = (langCode: string) => {
        const newLanguage = supportedLanguages.find(lang => lang.code === langCode);
        setCurrentLanguage(langCode);
        setIsLanguageDropdownOpen(false);

        const languageTips: { [key: string]: string } = {
            'yo': "💡 Pro tip: Say 'S-U-I' slowly or 'Sui coin' for best recognition",
            'ig': "💡 Pro tip: Spell 'S-U-I' clearly for cryptocurrency terms",
            'ha': "💡 Pro tip: Pronounce 'S-U-I' distinctly for crypto words",
            'en-US': "💡 Speak clearly and use natural commands like 'send 10 SUI to John'"
        };

        setMessages(prev => [...prev, {
            sender: "bot",
            text: `🌍 Language changed to ${newLanguage?.name || langCode} ${newLanguage?.flag || ''}\n${languageTips[langCode] || ''}`
        }]);
    };

    const getCurrentLanguage = () => {
        return supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];
    };

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(input);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const submitTransaction = async (bytes: string, signature: string) => {
        try {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "⏳ Transaction submitted to network...",
                    type: 'transaction',
                    transactionData: {
                        status: 'pending',
                        timestamp: new Date()
                    }
                },
            ]);

            const response = await client.executeTransactionBlock({
                transactionBlock: bytes,
                signature: signature,
                options: {
                    showEffects: true,
                    showEvents: true,
                },
            });

            const { digest, effects, events } = response;
            setMessages((prev) => {
                const newMessages = prev.filter(msg =>
                    !(msg.type === 'transaction' && msg.transactionData?.status === 'pending')
                );

                return [
                    ...newMessages,
                    {
                        sender: "bot",
                        text: `Transaction Successful!`,
                        type: 'transaction',
                        transactionData: {
                            digest: digest,
                            status: 'success',
                            gasUsed: effects?.gasUsed?.computationCost?.toString() || 'N/A',
                            eventsCount: events?.length || 0,
                            timestamp: new Date()
                        }
                    },
                ];
            });

        } catch (error) {
            setMessages((prev) => {
                const newMessages = prev.filter(msg =>
                    !(msg.type === 'transaction' && msg.transactionData?.status === 'pending')
                );

                return [
                    ...newMessages,
                    {
                        sender: "bot",
                        text: `❌ Transaction Failed`,
                        type: 'error',
                        transactionData: {
                            status: 'failed',
                            timestamp: new Date()
                        }
                    },
                ];
            });
        }
    };

    const TransactionMessage = ({ message }: { message: Message }) => {
        if (!message.transactionData) return null;

        const { digest, status, gasUsed, eventsCount, timestamp } = message.transactionData;
        const explorerUrl = `https://testnet.suivision.xyz/txblock/${digest}`;

        return (
            <div className={`max-w-[80%] px-4 py-3 rounded-xl text-sm border-l-4 ${
                status === 'success'
                    ? 'bg-[#6C55F5]/10 border-[#6C55F5] text-[#6C55F5]'
                    : status === 'failed'
                        ? 'bg-red-50 border-red-400 text-red-800'
                        : 'bg-blue-50 border-blue-400 text-blue-800'
            }`}>
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                        {status === 'success' ? (
                            <CheckCircle size={20} className="text-[#6C55F5]" />
                        ) : status === 'failed' ? (
                            <XCircle size={20} className="text-red-500" />
                        ) : (
                            <Clock size={20} className="text-blue-500" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{message.text}</span>
                        </div>

                        {digest && (
                            <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Digest:</span>
                                    <code className="bg-black/10 px-1.5 py-0.5 rounded text-xs font-mono">
                                        {digest.slice(0, 12)}...{digest.slice(-8)}
                                    </code>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    {gasUsed && gasUsed !== 'N/A' && (
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">Gas:</span>
                                            <span>{gasUsed}</span>
                                        </div>
                                    )}

                                    {eventsCount !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">Events:</span>
                                            <span>{eventsCount}</span>
                                        </div>
                                    )}

                                    {timestamp && (
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">Time:</span>
                                            <span>{timestamp.toLocaleTimeString()}</span>
                                        </div>
                                    )}
                                </div>

                                {digest && (
                                    <div className="mt-2 pt-2 border-t border-current/20">
                                        <a
                                            href={explorerUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-current hover:underline font-medium"
                                        >
                                            <ExternalLink size={12} />
                                            View on Explorer
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const RegularMessage = ({ message }: { message: Message }) => {
        return (
            <div className={`max-w-[80%] px-4 py-2 rounded-xl text-sm relative ${
                message.sender === "user"
                    ? "bg-[#6C55F5] text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
            }`}>
                <p style={{ whiteSpace: "pre-wrap" }}>{message.text}</p>
                {message.sender === "bot" && (
                    <button
                        onClick={() => speakText(message.text)}
                        className="absolute top-1 right-1 p-1 hover:bg-gray-200 rounded opacity-50 hover:opacity-100 transition-opacity"
                        title="Read aloud"
                    >
                        <Volume2 size={12} />
                    </button>
                )}
            </div>
        );
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
        setIsTyping(true);

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
            setIsTyping(false);
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
            { steps === "mint" && <Mint /> }
            { steps !== "swap" && steps !== "mint" ?<><br /><br /><br /><br /><br /></> : ""}

            {loading && <div className="text-sm text-gray-400 mb-2">Milo is thinking...</div>}

            {/* Voice Recognition Tips */}
            <div className="text-xs text-blue-600 mb-2 text-center max-w-md">
                💡 Speak clearly in your preferred language. Gemini AI will transcribe your voice.
            </div>

            { steps !== "swap" && (
                <>
                    <div className="w-full max-w-[700px] px-4 mb-4 space-y-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.type === 'transaction' || msg.type === 'error' ? (
                                    <TransactionMessage message={msg} />
                                ) : (
                                    <RegularMessage message={msg} />
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 rounded-xl rounded-bl-none px-4 py-2 max-w-[80%]">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                        <span className="text-sm">Milo is typing...</span>
                                    </div>
                                </div>
                            </div>
                        )}

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
                                        <span className="text-sm">Recording... Speak now</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isTranscribing && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 rounded-xl rounded-bl-none px-4 py-2 max-w-[80%]">
                                    <div className="flex items-center space-x-2">
                                        <Loader size={16} className="animate-spin text-blue-500" />
                                        <span className="text-sm">Transcribing your voice...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div ref={chatEndRef} />
                </>
            )}

            <div className={`hidden lg:flex flex-col items-center ${ messages.length == 0 ? "justify-center" : "justify-end"} flex-1 px-4 md:px-0`}>
                {/* ... (keep your existing greeting logic) */}
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
                    ))
                }

                <div className="bg-[#ffffff] gap-3 mb-4 rounded-2xl px-4 py-3 w-[90%] md:w-[700px] shadow-lg">
                    <div className="flex items-center gap-3">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={
                                isTranscribing ? "Transcribing..." :
                                    isListening ? "Recording... Speak now" :
                                        "Make any transaction or speak your command..."
                            }
                            className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder-gray-400 resize-none"
                            rows={2}
                            disabled={isListening || isTranscribing}
                        />
                        <button
                            onClick={() => handleSendMessage(input)}
                            className="flex items-center gap-1 bg-[#6C55F5] px-2 py-1 rounded-lg text-xs hover:bg-[#50515F] transition"
                            disabled={isListening || isTranscribing || !input.trim()}
                        >
                            <Send size={14} className={"text-white"} />
                        </button>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="mt-2 flex flex-wrap gap-2">
                        <button
                            onClick={() => setInput('send 5 SUI to John')}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            disabled={isListening || isTranscribing}
                        >
                            send 5 SUI to John
                        </button>
                        <button
                            onClick={() => setInput('swap 10 SUI to USDC')}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            disabled={isListening || isTranscribing}
                        >
                            swap 10 SUI to USDC
                        </button>
                        <button
                            onClick={() => setInput('check my balance')}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            disabled={isListening || isTranscribing}
                        >
                            check my balance
                        </button>
                    </div>

                    <div className="flex justify-between mt-4 items-center gap-2">
                        <div className="flex items-center gap-2 text-xs">
                            {/* ... (keep your existing buttons) */}
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
                                disabled={isTranscribing}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition ${
                                    isTranscribing
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : isListening
                                            ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                                            : "bg-white border border-gray-300 text-gray-600 hover:bg-[#6C55F5] hover:text-white"
                                }`}
                            >
                                {isTranscribing ? (
                                    <Loader size={14} className="animate-spin" />
                                ) : isListening ? (
                                    <Square size={14} />
                                ) : (
                                    <Mic size={14} />
                                )}
                                {isTranscribing ? "Processing" : isListening ? "Stop" : "Voice"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile version */}
            <div className="lg:hidden flex flex-col justify-end flex-1">
                {/* Mobile content with similar updates */}
            </div>
        </div>
    );
};

export default ChatHome;
