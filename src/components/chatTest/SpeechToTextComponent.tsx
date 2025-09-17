import { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SimpleSpeechToText = () => {
    const [language, setLanguage] = useState('en-US');
    const [error, setError] = useState('');
    const [manualText, setManualText] = useState('');


    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const startListening = () => {
        setError('');
        try {
            // Add custom vocabulary for better recognition
            const grammar = '#JSGF V1.0; grammar customWords; public <customWords> = sui | SUI | send sui | transfer sui;';

            console.log('Grammar', grammar);
            SpeechRecognition.startListening({
                continuous: true,
                language: language
            });
        } catch (err) {
            setError('Language not supported in your browser');
        }
    };

    // Function to correct common misrecognitions
    const correctTranscript = (text: string) => {
        const corrections: any = {
            'sweet': 'SUI',
            'sw eat': 'SUI',
            's we eat': 'SUI',
            'send sweet': 'send SUI',
            'transfer sweet': 'transfer SUI',
            '5 sweet': '5 SUI',
            // Add more corrections as needed
        };

        let correctedText = text;
        Object.keys(corrections).forEach(wrong => {
            const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
            correctedText = correctedText.replace(regex, corrections[wrong]);
        });

        return correctedText;
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition</span>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="language-select">Select Language: </label>
                <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{ padding: '5px', marginLeft: '10px' }}
                >
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Spanish (Spain)</option>
                    <option value="fr-FR">French (France)</option>
                    <option value="ig-NG">Igbo (Nigeria)</option>
                    <option value="yo-NG">Yoruba (Nigeria)</option>
                    <option value="ha-NG">Hausa (Nigeria)</option>
                    <option value="pt-BR">Portuguese (Brazil)</option>
                    <option value="ar-SA">Arabic (Saudi Arabia)</option>
                </select>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <p>Current Language: {language}</p>

            <button onClick={startListening} disabled={listening}>
                Start
            </button>
            <button onClick={SpeechRecognition.stopListening} disabled={!listening}>
                Stop
            </button>
            <button onClick={resetTranscript}>
                Reset
            </button>
            <div style={{ marginTop: '10px' }}>
                <input
                    type="text"
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Correct text manually"
                    style={{ padding: '5px', marginRight: '10px' }}
                />
                <button onClick={() => {
                    const corrected = correctTranscript(manualText);
                    setManualText(corrected);
                }}>
                    Auto-Correct
                </button>
            </div>

            <textarea
                value={correctTranscript(transcript)}
                onChange={() => {}}
                placeholder="Speech will appear here..."
                style={{
                    width: '100%',
                    minHeight: '100px',
                    marginTop: '10px',
                    padding: '10px',
                    fontSize: '16px'
                }}
            />

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                <p>💡 Try saying "S U I" slowly instead of "sui" as one word</p>
                <p>💡 Or say "send five S U I" letter by letter</p>
            </div>
        </div>
    );
};

export default SimpleSpeechToText;
