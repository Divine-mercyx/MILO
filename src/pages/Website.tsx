import * as React from "react";
import Header from "../components/layout/Header.tsx";
import { useState } from "react";
import { Send, Sparkles, Zap, Shield, Link } from "lucide-react";
import { AIProcessor } from "../AI/index";

const API_KEY = import.meta.env.VITE_AI_API_KEY;
let aiProcessor: AIProcessor | null = null;

const Website: React.FC = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        const initAI = async () => {
            try {
                aiProcessor = new AIProcessor(API_KEY);
                await aiProcessor.initialize();
                console.log("AI Processor initialized successfully!");
            } catch (error) {
                console.error("Failed to initialize AI processor:", error);
            }
        };
        
        initAI();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !aiProcessor) return;

        const userMessage = { sender: "user", text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const data = await aiProcessor.processInput(input);
            
            let botText = "";
            if ('action' in data) {
                botText = data.message || data.reply || "Sorry, something went wrong.";
            } else {
                botText = data.message || "Sorry, something went wrong.";
            }
            
            setMessages(prev => [...prev, { sender: "bot", text: botText }]);
        } catch (error) {
            console.error("AI processing error:", error);
            setMessages(prev => [...prev, { sender: "bot", text: "Sorry, I encountered an error processing your request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 overflow-hidden">
            {/* Microsoft-style subtle background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#0078d4_0%,_transparent_70%)] opacity-5"></div>
            
            <div className="relative z-10">
                <Header />
                
                <main className="container mx-auto px-4 py-6 max-w-6xl">
                    {/* Hero Section - Microsoft Copilot Style */}
                    <div className="text-center mb-10 mt-8">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Powered by Advanced AI</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            Ask AI Anything
                            <span className="text-blue-600 ml-2">•</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
                            Get intelligent answers powered by advanced AI. Connect your wallet for seamless blockchain interactions.
                        </p>
                    </div>

                    {/* Main Chat Container - Microsoft Design */}
                    <div className="flex flex-col lg:flex-row gap-6 mb-8">
                        {/* Chat Messages Section */}
                        <div className="flex-1">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                {messages.length > 0 ? (
                                    <div className="h-[500px] overflow-y-auto p-6 space-y-6">
                                        {messages.map((message, index) => (
                                            <div 
                                                key={index} 
                                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div 
                                                    className={`max-w-[80%] px-5 py-4 rounded-2xl ${
                                                        message.sender === 'user' 
                                                            ? 'bg-blue-600 text-white rounded-br-none shadow-sm' 
                                                            : 'bg-gray-50 text-gray-900 rounded-bl-none border border-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className={`w-2 h-2 rounded-full ${message.sender === 'user' ? 'bg-blue-200' : 'bg-blue-500'}`}></div>
                                                        <span className="text-xs font-medium opacity-75">
                                                            {message.sender === 'user' ? 'You' : 'AI Assistant'}
                                                        </span>
                                                    </div>
                                                    <p className="text-base leading-relaxed">{message.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-[500px] flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                            <Sparkles className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">How can I help you today?</h3>
                                        <p className="text-gray-500 mb-6">Ask anything about blockchain, crypto, or technology...</p>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            <button 
                                                onClick={() => setInput("Explain blockchain technology")}
                                                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors"
                                            >
                                                Explain blockchain technology
                                            </button>
                                            <button 
                                                onClick={() => setInput("How does cryptocurrency work?")}
                                                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors"
                                            >
                                                How does cryptocurrency work?
                                            </button>
                                            <button 
                                                onClick={() => setInput("Connect to Sui blockchain")}
                                                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors"
                                            >
                                                Connect to Sui blockchain
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Input Form - Microsoft Style */}
                                <div className="border-t border-gray-100 p-4 bg-white">
                                    <form onSubmit={handleSubmit} className="relative">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder="Ask anything..."
                                                className="w-full px-5 py-4 text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 pr-24"
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="submit"
                                                disabled={isLoading || !input.trim()}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm"
                                            >
                                                {isLoading ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Send className="w-4 h-4" />
                                                )}
                                                <span className="text-sm">Ask</span>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 px-2">
                                            <span className="text-xs text-gray-400">
                                                Press Enter to send • Shift + Enter for new line
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                <span className="text-xs text-gray-500">AI is ready</span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Side Panel - Microsoft Style Features */}
                        <div className="lg:w-80 space-y-4">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-blue-600" />
                                    Capabilities
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Blockchain Analysis</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Smart Contract Help</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Crypto Insights</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Technical Support</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-green-600" />
                                    Security Status
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Data Encryption</span>
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Privacy Mode</span>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">On</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-5 text-white">
                                <Link className="w-6 h-6 mb-3" />
                                <h3 className="font-semibold mb-2">Blockchain Ready</h3>
                                <p className="text-sm opacity-90 mb-4">Connect your wallet to interact directly with the Sui blockchain network.</p>
                                <button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-medium py-2.5 rounded-lg text-sm transition-colors">
                                    Connect Wallet
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid - Microsoft Style */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="group bg-white hover:shadow-lg rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-blue-200">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                <Zap className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-3">Fast Responses</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Get instant, intelligent answers powered by advanced AI technology.</p>
                        </div>
                        <div className="group bg-white hover:shadow-lg rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-green-200">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                                <Shield className="h-5 w-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-3">Enterprise Security</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Your conversations are encrypted and protected with enterprise-grade security.</p>
                        </div>
                        <div className="group bg-white hover:shadow-lg rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-purple-200">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                                <Sparkles className="h-5 w-5 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-3">Smart Interactions</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Advanced understanding of blockchain concepts and smart contract operations.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Website;