import { useEffect, useRef, useState } from "react";

// Wraps the browser's SpeechRecognition API. Returns null-safe helpers so
// the UI can hide the mic button entirely on unsupported browsers.
const useVoiceInput = (onTranscript) => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");
      onTranscript(transcript);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    if (!recognitionRef.current || listening) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // Already started or blocked; ignore.
    }
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { listening, supported, start, stop };
};

export default useVoiceInput;
