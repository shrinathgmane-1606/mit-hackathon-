import { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../types';

export type SpeechState = 
  | 'IDLE' 
  | 'REQUESTING_PERMISSION' 
  | 'LISTENING' 
  | 'PROCESSING' 
  | 'SUCCESS' 
  | 'ERROR' 
  | 'PERMISSION_DENIED' 
  | 'UNSUPPORTED';

interface UseSpeechRecognitionOptions {
  language: Language;
  onResult?: (finalText: string) => void;
  onError?: (errorMsg: string) => void;
}

export function useSpeechRecognition({
  language,
  onResult,
  onError
}: UseSpeechRecognitionOptions) {
  const [speechState, setSpeechState] = useState<SpeechState>('IDLE');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100 for live animation

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const getLanguageCode = useCallback((lang: Language): string => {
    switch (lang) {
      case 'mr':
        return 'mr-IN';
      case 'hi':
        return 'hi-IN';
      case 'en':
      default:
        return 'en-IN';
    }
  }, []);

  // Cleanup audio analyzer
  const stopAudioAnalyser = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // Start audio volume visualizer
  const startAudioAnalyser = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!isListeningRef.current) {
          stopAudioAnalyser();
          return;
        }
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);

        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn('Could not initialize audio visualizer stream:', err);
    }
  }, [stopAudioAnalyser]);

  // Initialize and start recognition
  const startListening = useCallback(async () => {
    if (!isSupported) {
      setSpeechState('UNSUPPORTED');
      setErrorMessage('Speech recognition is not natively supported in this browser. Please use Chrome, Edge, or Safari, or click demo voice chips below.');
      onError?.('Speech recognition unsupported');
      return;
    }

    // Stop any existing instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    setSpeechState('REQUESTING_PERMISSION');
    setErrorMessage('');
    setInterimTranscript('');
    setFinalTranscript('');

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = getLanguageCode(language);

    recognition.onstart = () => {
      isListeningRef.current = true;
      setSpeechState('LISTENING');
      startAudioAnalyser();
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript + ' ';
        } else {
          interim += item[0].transcript;
        }
      }

      if (interim) {
        setInterimTranscript(interim);
      }
      if (final) {
        const fullFinal = (finalTranscript + final).trim();
        setFinalTranscript(fullFinal);
        setInterimTranscript('');
        setSpeechState('SUCCESS');
        onResult?.(fullFinal);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech Recognition Error:', event.error);
      isListeningRef.current = false;
      stopAudioAnalyser();

      if (event.error === 'not-allowed') {
        setSpeechState('PERMISSION_DENIED');
        setErrorMessage('Microphone access was denied. Please allow microphone permission in your browser URL bar.');
        onError?.('Microphone permission denied');
      } else if (event.error === 'no-speech') {
        // Soft timeout when user stops talking
        setSpeechState('IDLE');
        setErrorMessage('No speech detected. Please speak clearly into your microphone.');
      } else if (event.error === 'network') {
        setSpeechState('ERROR');
        setErrorMessage('Network error occurred while connecting to speech recognition service.');
        onError?.('Network error');
      } else {
        setSpeechState('ERROR');
        setErrorMessage(`Speech recognition error: ${event.error}`);
        onError?.(event.error);
      }
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      stopAudioAnalyser();
      if (speechState === 'LISTENING') {
        setSpeechState('IDLE');
      }
    };

    try {
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setSpeechState('ERROR');
      setErrorMessage(err.message || 'Failed to start microphone');
      stopAudioAnalyser();
    }
  }, [isSupported, language, getLanguageCode, onResult, onError, startAudioAnalyser, stopAudioAnalyser, finalTranscript, speechState]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    stopAudioAnalyser();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        try {
          recognitionRef.current.abort();
        } catch (err) {}
      }
    }
    setSpeechState('IDLE');
  }, [stopAudioAnalyser]);

  const resetTranscript = useCallback(() => {
    setInterimTranscript('');
    setFinalTranscript('');
    setErrorMessage('');
    setSpeechState('IDLE');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      stopAudioAnalyser();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [stopAudioAnalyser]);

  return {
    speechState,
    isListening: speechState === 'LISTENING',
    interimTranscript,
    finalTranscript,
    errorMessage,
    audioLevel,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setFinalTranscript
  };
}
