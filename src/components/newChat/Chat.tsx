import React, {useEffect} from "react";
import { ReplaceAll, Gem, Mic, Send, ArrowRightLeftIcon, Square, ChevronDown, Globe, Volume2, XCircle, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { useState, useRef } from "react";
import ChatHeader from "../chat/Header.tsx";
import Swap from "../chat/swap/Swap.tsx";
import {useContacts} from "../../hooks/useContacts.ts";
import {useSignTransaction, useSuiClient} from "@mysten/dapp-kit";
import {buildTransaction} from "../../lib/suiTxBuilder.ts";

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
    const [isTyping, setIsTyping] = useState(false);

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
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const {addContact, contacts} = useContacts();
    const { mutate: signTransaction } = useSignTransaction();
    const client = useSuiClient();

    // Enhanced custom vocabulary for better recognition
    // const customVocabulary = {
    //     'sui': ['sui', 'SUI', 'Sui', 'sweet', 'suite', 'switch', 'sweat', 'swi'],
    //     'usdc': ['usdc', 'USDC', 'you es dee see'],
    //     'bitcoin': ['bitcoin', 'Bitcoin', 'bit coin'],
    //     'eth': ['eth', 'ETH', 'ethereum'],
    //     'send': ['send', 'Send', 'fún', 'ziga', 'aika'],
    //     'transfer': ['transfer', 'Transfer', 'tránsá', 'nyefee', 'canja']
    // };

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

    // Initialize Speech Recognition with enhanced configuration
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

            // Enhanced configuration for better accuracy
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy
            recognition.lang = currentLanguage;

            recognition.onstart = () => {
                console.log('Speech recognition started');
                setIsListening(true);
            };

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;

                    if (event.results[i].isFinal) {
                        finalTranscript = transcript;
                    } else {
                        interimTranscript = transcript;
                    }
                }

                if (finalTranscript) {
                    // Apply enhanced corrections
                    let correctedTranscript = finalTranscript.toLowerCase();

                    // Enhanced corrections for common misrecognitions
                    const corrections = {
                        'sweet': 'sui',
                        'suite': 'sui',
                        'switch': 'sui',
                        'sweat': 'sui',
                        'swi': 'sui',
                        'sri': 'sui',
                        'see': 'sui',
                        'sway': 'sui',
                        'sue': 'sui',
                        'you es dee see': 'USDC',
                        'bit coin': 'Bitcoin',
                        'b m i': 'bmi',
                        'b. m. i.': 'bmi',
                        'be am i': 'bmi',
                        'beam i': 'bmi',
                    };

                    Object.entries(corrections).forEach(([wrong, correct]) => {
                        const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
                        correctedTranscript = correctedTranscript.replace(regex, correct);
                    });

                    // Language-specific enhancements
                    if (currentLanguage === 'yo-NG') {
                        // Yoruba-specific corrections
                        const yorubaCorrections = {
                            'fún': 'send',
                            'rán': 'send',
                            'sùí': 'sui'
                        };
                        Object.entries(yorubaCorrections).forEach(([wrong, correct]) => {
                            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
                            correctedTranscript = correctedTranscript.replace(regex, correct);
                        });
                    }

                    if (currentLanguage === 'ig-NG') {
                        // Igbo-specific corrections
                        const igboCorrections = {
                            'ziga': 'send',
                            'sùì': 'sui'
                        };
                        Object.entries(igboCorrections).forEach(([wrong, correct]) => {
                            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
                            correctedTranscript = correctedTranscript.replace(regex, correct);
                        });
                    }

                    if (currentLanguage === 'ha-NG') {
                        // Hausa-specific corrections
                        const hausaCorrections = {
                            'aika': 'send',
                            'tuma': 'send',
                            'swi': 'sui'
                        };
                        Object.entries(hausaCorrections).forEach(([wrong, correct]) => {
                            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
                            correctedTranscript = correctedTranscript.replace(regex, correct);
                        });
                    }

                    console.log('Corrected transcript:', correctedTranscript);
                    setInput(correctedTranscript);
                } else if (interimTranscript) {
                    // Show interim results for better UX
                    setInput(interimTranscript);
                }
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
                    case 'no-speech':
                        errorMessage += 'No speech detected. Please try again.';
                        break;
                    default:
                        errorMessage += `${errorEvent.error}. Please try again.`;
                }

                setMessages(prev => [...prev, {
                    sender: "bot",
                    text: `❌ ${errorMessage}`
                }]);
            };
        };

        // Initialize speech synthesis for text-to-speech
        if ('speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
        }

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
            // Enhanced microphone permission handling
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                })
                    .then((stream) => {
                        // Stop all tracks to release microphone immediately
                        stream.getTracks().forEach(track => track.stop());
                        setInput(""); // Clear previous input
                        recognitionRef.current?.start();
                    })
                    .catch(err => {
                        console.error('Microphone permission denied:', err);
                        setMessages(prev => [...prev, {
                            sender: "bot",
                            text: "❌ Microphone access is required for voice input. Please allow microphone permissions in your browser settings."
                        }]);
                    });
            } else {
                recognitionRef.current.start();
            }
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

        if (recognitionRef.current) {
            recognitionRef.current.lang = langCode;
        }

        const languageTips: { [key: string]: string } = {
            'yo-NG': "💡 Pro tip: Say 'S-U-I' slowly or 'Sui coin' for best recognition",
            'ig-NG': "💡 Pro tip: Spell 'S-U-I' clearly for cryptocurrency terms",
            'ha-NG': "💡 Pro tip: Pronounce 'S-U-I' distinctly for crypto words",
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

            { steps !== "swap" && <><br /><br /><br /><br /><br /></> }

            {loading && <div className="text-sm text-gray-400 mb-2">Milo is thinking...</div>}

            {/* Voice Recognition Tips */}
            <div className="text-xs text-blue-600 mb-2 text-center max-w-md">
                💡 Tips: Speak clearly, use "sui" for SUI token. The system learns from corrections.
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
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isListening ? "Listening... Speak now" : "Make any transaction or speak your command..."}
                            className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder-gray-400 resize-none"
                            rows={2}
                            disabled={isListening}
                        />
                        <button
                            onClick={() => handleSendMessage(input)}
                            className="flex items-center gap-1 bg-[#6C55F5] px-2 py-1 rounded-lg text-xs hover:bg-[#50515F] transition"
                            disabled={isListening || !input.trim()}
                        >
                            <Send size={14} className={"text-white"} />
                        </button>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="mt-2 flex flex-wrap gap-2">
                        <button
                            onClick={() => setInput('send 5 SUI to John')}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                            send 5 SUI to John
                        </button>
                        <button
                            onClick={() => setInput('swap 10 SUI to USDC')}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                            swap 10 SUI to USDC
                        </button>
                        <button
                            onClick={() => setInput('check my balance')}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                            check my balance
                        </button>
                    </div>

                    <div className="flex justify-between mt-4 items-center gap-2">
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
                                        ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
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
                {/* Mobile content with similar updates */}
            </div>
        </div>
    );
};

export default ChatHome;
