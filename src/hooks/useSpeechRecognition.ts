// useSpeechRecognition.ts
import { useRef, useState } from "react";

export const useSpeechRecognition = (onResult: (text: string) => void) => {
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [listening, setListening] = useState(false);

    const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const startListening = () => {
        if (!SpeechRecognition) {
            alert("Your browser doesn't support speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "auto";
        recognition.continuous = true; // continuous listening
        recognition.interimResults = false;

        recognition.onstart = () => setListening(true);
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
        };
        recognition.onerror = () => setListening(false);
        recognition.onend = () => setListening(false);

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setListening(false);
    };

    return { startListening, stopListening, listening };
};
