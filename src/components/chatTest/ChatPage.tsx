import React from "react";
import { useState } from "react";
import type {Contact} from "../../types/types.ts";
import type {Message} from "../../types/types.ts";
import Sidebar from "./Sidebar.tsx";
import ChatArea from "./ChatArea.tsx";
import ContactModal from "./ContactModal.tsx";
import {MenuIcon} from "../../assets/icons/icons.tsx";

export const ChatPage: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([
        { name: 'Alice', address: '0x123...abc' },
        { name: 'Bob', address: '0x456...def' },
    ]);
    
    const [messages, setMessages] = useState<Message[]>([
        { 
            text: "Hello! I'm MILO. How can I help you with your finances today? You can ask me to send crypto, swap tokens, or check your NFT gallery.", 
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddContact = (contact: Contact) => {
        setContacts(prev => [...prev, contact]);
        setModalOpen(false);
    };

    const handleSend = async () => {
        if (!userInput.trim()) return;

        // Add user message
        const userMessage: Message = {
            text: userInput,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        // Simulate a response from the bot
        const botResponse: Message = {
            text: "Thank you for your message!",
            sender: 'bot',
            timestamp: new Date()
        };
        setTimeout(() => {
            setMessages(prev => [...prev, botResponse]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <>
            <div className="font-sans text-milo-text bg-milo-light-purple/30 w-full h-screen flex overflow-hidden">
                <Sidebar
                    contacts={contacts}
                    onAddContact={() => setModalOpen(true)}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
                <main className="flex-1 flex flex-col relative">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden absolute top-4 left-4 z-20 p-2 bg-white rounded-full shadow-md" aria-label="Open menu">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <ChatArea
                        messages={messages}
                        currentInput={userInput}
                        onInputChange={(e) => setUserInput(e.target.value)}
                        onSendMessage={handleSend}
                        isLoading={isLoading}
                    />
                </main>
                {modalOpen && (
                    <ContactModal
                        onClose={() => setModalOpen(false)}
                        onAddContact={handleAddContact}
                        contacts={contacts}
                    />
                )}
            </div>
        </>
    )
}