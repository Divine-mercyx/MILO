// import React, { useState } from "react";
// import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
//
// const subscriptionKey = "YOUR_AZURE_SPEECH_KEY";
// const serviceRegion = "YOUR_REGION"; // e.g., "westus"
//
// const AzureVoiceToText = () => {
//     const [transcript, setTranscript] = useState("");
//     const [listening, setListening] = useState(false);
//     let recognizer: SpeechSDK.SpeechRecognizer;
//
//     const startRecognition = () => {
//         const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
//         speechConfig.speechRecognitionLanguage = "en-US";
//
//         const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
//         recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
//
//         recognizer.recognized = (s, e) => {
//             if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
//                 setTranscript(prev => prev + " " + e.result.text);
//             }
//         };
//
//         recognizer.canceled = (s, e) => {
//             console.error(`Canceled: ${e.errorDetails}`);
//             setListening(false);
//             recognizer.close();
//         };
//
//         recognizer.sessionStopped = () => {
//             setListening(false);
//             recognizer.close();
//         };
//
//         recognizer.startContinuousRecognitionAsync(() => setListening(true), (err) => {
//             console.error(err);
//             setListening(false);
//         });
//     };
//
//     const stopRecognition = () => {
//         recognizer.stopContinuousRecognitionAsync(() => setListening(false));
//     };
//
//     return (
//         <div>
//             <button onClick={listening ? stopRecognition : startRecognition}>
//                 {listening ? "Stop Listening" : "Start Listening"}
//             </button>
//             <p>{transcript}</p>
//         </div>
//     );
// };
//
// export default AzureVoiceToText;
