// import { useState } from 'react';
import SpeechToTextComponent from "./SpeechToTextComponent.tsx";

export function ChatInterface() {
    // const [inputText, setInputText] = useState('');
    // const [isProcessing, setIsProcessing] = useState(false);
    // const [voiceTranscripts, setVoiceTranscripts] = useState<string[]>([]);

    // const handleVoiceTranscript = (text: string) => {
    //     setInputText(text);
    //     // Add to transcript history
    //     setVoiceTranscripts(prev => [...prev, text]);
    //
    //     // Optional: Auto-submit after a brief pause
    //     setTimeout(() => {
    //         if (!isProcessing) {
    //             handleSendMessage(text);
    //         }
    //     }, 800);
    // };
    //
    // const handleRecordingStateChange = (isRecording: boolean, language: string) => {
    //     console.log(`Recording ${isRecording ? 'started' : 'stopped'} in ${language}`);
    // };

    // const handleSendMessage = async (text: string) => {
    //     const message = text.trim();
    //     if (!message || isProcessing) return;
    //
    //     setIsProcessing(true);
    //     try {
    //         // Send to your AI backend
    //         const response = await fetch('/api/parse-command', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ prompt: message }),
    //         });
    //
    //         const data = await response.json();
    //         // Handle AI response...
    //         console.log('AI Response:', data);
    //
    //     } catch (error) {
    //         console.error('Error sending message:', error);
    //     } finally {
    //         setIsProcessing(false);
    //         setInputText('');
    //     }
    // };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto p-4 space-y-4">
            {/* Message History */}
            <div className="flex-1 overflow-y-auto space-y-2">
                <SpeechToTextComponent />
            </div>
        </div>
    );
}
