import { useState, useEffect } from "react";
import type { ChatHistoryItem } from "../types/types";

const CHAT_HISTORY_STORAGE_KEY = "milo-chat-history";

export function useChatHistory() {
    const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

    // Load chat history from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Convert timestamp strings back to Date objects
                const historyWithDates = parsed.map((item: any) => ({
                    ...item,
                    timestamp: new Date(item.timestamp),
                    messages: item.messages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }))
                }));
                setChatHistory(historyWithDates);
            } catch (e) {
                console.error("Failed to parse chat history", e);
                setChatHistory([]);
            }
        }
    }, []);

    // Save chat history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(chatHistory));
    }, [chatHistory]);

    const addChat = (title: string, messages: any[]): ChatHistoryItem => {
        const newChat: ChatHistoryItem = {
            id: Date.now().toString(),
            title,
            messages: messages.map(msg => ({
                ...msg,
                timestamp: new Date()
            })),
            timestamp: new Date()
        };
        
        setChatHistory(prev => [newChat, ...prev]);
        return newChat;
    };

    const updateChat = (id: string, messages: any[]) => {
        setChatHistory(prev => 
            prev.map(chat => 
                chat.id === id 
                    ? { 
                        ...chat, 
                        messages: messages.map(msg => ({
                            ...msg,
                            timestamp: new Date()
                        })),
                        timestamp: new Date()
                    } 
                    : chat
            )
        );
    };

    const deleteChat = (id: string) => {
        setChatHistory(prev => prev.filter(chat => chat.id !== id));
    };

    const clearHistory = () => {
        setChatHistory([]);
    };

    const getChat = (id: string): ChatHistoryItem | undefined => {
        return chatHistory.find(chat => chat.id === id);
    };

    return {
        chatHistory,
        addChat,
        updateChat,
        deleteChat,
        clearHistory,
        getChat
    };
}