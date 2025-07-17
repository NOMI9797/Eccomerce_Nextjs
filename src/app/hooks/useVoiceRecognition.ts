import { useEffect, useState, useCallback, useRef } from 'react';

interface VoiceRecognitionProps {
  onResult: (text: string) => void;
  onError?: () => void;
}

interface SpeechRecognitionEvent {
  results: Array<{
    [key: number]: {
      transcript: string;
    };
  }>;
}

interface SpeechRecognitionInterface {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  start: () => void;
  stop: () => void;
}

export function useVoiceRecognition({ onResult, onError }: VoiceRecognitionProps) {
  const [hasSupport, setHasSupport] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const text = event.results[0][0].transcript;
          onResult(text);
        };

        recognition.onerror = () => {
          onError?.();
        };

        recognitionRef.current = recognition;
        setHasSupport(true);
      }
    }
  }, [onResult, onError]); // Include the callbacks in dependencies

  const startListening = useCallback(() => {
    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      onError?.();
    }
  }, [onError]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  }, []);

  return {
    startListening,
    stopListening,
    hasSupport,
  };
} 