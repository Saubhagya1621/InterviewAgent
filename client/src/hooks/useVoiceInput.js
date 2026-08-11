import { useEffect, useRef, useState } from "react";

// Wraps the browser's SpeechRecognition API. Returns null-safe helpers so
// the UI can hide the mic button entirely on unsupported browsers.
const useVoiceInput = (onTranscript) => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("[useVoiceInput] SpeechRecognition not supported in this browser.");
      setSupported(false);
      return;
    }
    setSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("[useVoiceInput] Recognition started.");
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");
      console.log("[useVoiceInput] Transcript:", transcript);
      onTranscript(transcript);
    };

    recognition.onend = () => {
      console.log("[useVoiceInput] Recognition ended.");
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("[useVoiceInput] Recognition error:", event.error);
      setVoiceError(event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    if (!recognitionRef.current || listening) return;
    setVoiceError(null);
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (err) {
      console.error("[useVoiceInput] start() threw:", err);
      setVoiceError(err.message || "start_failed");
    }
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { listening, supported, start, stop, voiceError };
};

export default useVoiceInput;