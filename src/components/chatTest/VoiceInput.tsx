// components/VoiceInput.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface LanguageOption {
    code: string;
    name: string;
    emoji: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
    { code: 'en-US', name: 'English', emoji: '🇺🇸' },
    { code: 'fr-FR', name: 'French', emoji: '🇫🇷' },
    { code: 'es-ES', name: 'Spanish', emoji: '🇪🇸' },
    { code: 'yo-NG', name: 'Yoruba', emoji: '🇳🇬' },
    { code: 'ig-NG', name: 'Igbo', emoji: '🇳🇬' },
    { code: 'pt-BR', name: 'Portuguese', emoji: '🇧🇷' },
    { code: 'de-DE', name: 'German', emoji: '🇩🇪' },
    { code: 'ar-SA', name: 'Arabic', emoji: '🇸🇦' },
    { code: 'zh-CN', name: 'Chinese', emoji: '🇨🇳' },
    { code: 'hi-IN', name: 'Hindi', emoji: '🇮🇳' },
];

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    onRecordingStateChange?: (isRecording: boolean, language: string) => void;
    disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
                                                          onTranscript,
                                                          onRecordingStateChange,
                                                          disabled = false,
                                                      }) => {
    const [isListening, setIsListening] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const transcriptContainerRef = useRef<HTMLDivElement>(null);

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let final = '';
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += transcript + ' ';
                } else {
                    interim += transcript;
                }
            }

            if (final) {
                const completeTranscript = final.trim();
                setFinalTranscript(prev => prev + ' ' + completeTranscript);
                setInterimTranscript('');
                onTranscript(completeTranscript);

                // Auto-scroll to show latest text
                setTimeout(() => {
                    if (transcriptContainerRef.current) {
                        transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
                    }
                }, 100);
            }

            if (interim) {
                setInterimTranscript(interim);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            stopListening();
        };

        recognition.onend = () => {
            if (isListening) {
                try {
                    recognition.start();
                } catch (error) {
                    console.error('Failed to restart recognition:', error);
                    setIsListening(false);
                }
            }
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [selectedLanguage, onTranscript, isListening]);

    // Close language dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLanguageOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const startListening = useCallback(() => {
        if (disabled || !recognitionRef.current || isListening) return;

        try {
            setFinalTranscript('');
            setInterimTranscript('');
            recognitionRef.current.lang = selectedLanguage;
            recognitionRef.current.start();
            setIsListening(true);
            onRecordingStateChange?.(true, selectedLanguage);
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
        }
    }, [disabled, isListening, selectedLanguage, onRecordingStateChange]);

    const stopListening = useCallback(() => {
        if (!recognitionRef.current || !isListening) return;

        try {
            recognitionRef.current.stop();
            setIsListening(false);
            onRecordingStateChange?.(false, selectedLanguage);

            // Clear interim transcript when stopping
            setInterimTranscript('');
        } catch (error) {
            console.error('Failed to stop speech recognition:', error);
        }
    }, [isListening, onRecordingStateChange]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    const handleLanguageSelect = useCallback((languageCode: string) => {
        setSelectedLanguage(languageCode);
        setIsLanguageOpen(false);
        if (isListening) {
            stopListening();
            setTimeout(startListening, 100);
        }
    }, [isListening, startListening, stopListening]);

    const clearTranscript = useCallback(() => {
        setFinalTranscript('');
        setInterimTranscript('');
    }, []);

    return (
        <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Language and Controls Row */}
            <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                        disabled={disabled}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Select language"
                    >
            <span className="text-lg">
              {SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.emoji}
            </span>
                        <span className="w-6">
              {selectedLanguage.split('-')[0]}
            </span>
                    </button>

                    {isLanguageOpen && (
                        <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                            {SUPPORTED_LANGUAGES.map((language) => (
                                <button
                                    key={language.code}
                                    type="button"
                                    onClick={() => handleLanguageSelect(language.code)}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                                >
                                    <span className="text-lg">{language.emoji}</span>
                                    <span className="flex-1">{language.name}</span>
                                    <span className="text-xs text-gray-500">{language.code}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Microphone Button */}
                <button
                    type="button"
                    onClick={toggleListening}
                    disabled={disabled}
                    className={`p-3 rounded-full transition-all duration-200 ${
                        isListening
                            ? 'bg-red-500 animate-pulse ring-2 ring-red-300'
                            : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300'
                    } text-white disabled:text-gray-400`}
                    aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {/* Clear Button */}
                {(finalTranscript || interimTranscript) && (
                    <button
                        type="button"
                        onClick={clearTranscript}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Clear transcript"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {/* Transcript Display */}
            {(finalTranscript || interimTranscript) && (
                <div
                    ref={transcriptContainerRef}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto"
                >
                    {/* Final Transcript */}
                    {finalTranscript && (
                        <p className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">
                            {finalTranscript}
                        </p>
                    )}

                    {/* Interim Transcript (what you're currently speaking) */}
                    {interimTranscript && (
                        <div className="border-t border-gray-200 pt-2">
                            <p className="text-xs text-gray-500 font-medium mb-1">Listening...</p>
                            <p className="text-sm text-blue-600 italic whitespace-pre-wrap">
                                {interimTranscript}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Status Indicator */}
            {isListening && !finalTranscript && !interimTranscript && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Listening... Start speaking</span>
                </div>
            )}
        </div>
    );
};
