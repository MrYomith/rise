import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../services/api';
import GlassSurface from '../components/GlassSurface';
import MarkdownMessage from '../components/MarkdownMessage';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [threadId] = useState(() => `thread_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(20).fill(0));

  useEffect(() => {
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setInputValue((prev) => {
            const newValue = prev + (prev ? ' ' : '') + finalTranscript;
            console.log('Final transcript:', finalTranscript);
            console.log('New input value:', newValue);
            return newValue;
          });
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
      };
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const scrollToBottom = () => {
    // Scroll to make sure latest message is fully visible, previous messages scroll up
    const scroll = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    };

    // Immediate scroll
    scroll();
    // Delayed scroll to ensure DOM has updated
    setTimeout(scroll, 100);
    setTimeout(scroll, 300);
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Scroll immediately after user message
    requestAnimationFrame(() => scrollToBottom());

    try {
      // Call backend API
      const response = await sendChatMessage({
        thread_id: threadId,
        message: messageText,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      // Ensure scroll after bot message
      requestAnimationFrame(() => scrollToBottom());
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const stopAudioVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAudioLevels(new Array(20).fill(0));
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate levels for 20 bars with more detail
    const barCount = 20;
    const levels = [];
    const samplesPerBar = Math.floor(bufferLength / barCount);

    for (let i = 0; i < barCount; i++) {
      const start = i * samplesPerBar;
      const end = start + samplesPerBar;
      const barData = dataArray.slice(start, end);

      // Use RMS (root mean square) for more accurate representation
      const sumSquares = barData.reduce((sum, val) => sum + val * val, 0);
      const rms = Math.sqrt(sumSquares / barData.length);

      // Apply exponential scaling for better visual representation
      const normalized = rms / 255;
      const scaled = Math.pow(normalized, 0.7); // Make quieter sounds more visible

      levels.push(scaled);
    }

    setAudioLevels(levels);
    animationFrameRef.current = requestAnimationFrame(visualizeAudio);
  };

  const startAudioVisualization = async (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Higher FFT size for better frequency resolution
      analyserRef.current.fftSize = 2048;
      // Lower smoothing for more responsive visualization
      analyserRef.current.smoothingTimeConstant = 0.6;

      // Start visualization loop
      visualizeAudio();
    } catch (error) {
      console.error('Error setting up audio visualization:', error);
    }
  };

  const handleVoiceInput = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      stopAudioVisualization();
      setIsListening(false);
    } else {
      try {
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Start audio visualization
        await startAudioVisualization(stream);

        // Start speech recognition after permission is granted
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error: any) {
        console.error('Error starting speech recognition:', error);
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          alert('Microphone access was denied. Please allow microphone access to use voice input.');
        } else {
          alert('Could not access microphone. Please check your browser settings.');
        }
        setIsListening(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black flex flex-col overflow-hidden relative" style={{ overscrollBehavior: 'none' }}>
      {/* Full Screen Sound Wave Visualization Overlay */}
      {isListening && (
        <div className="fixed inset-0 w-screen h-screen bg-black/95 z-50 flex flex-col items-center justify-center">
          {/* Large circular background glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] bg-gray-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>

          {/* Sound Wave Bars */}
          <div className="flex items-end justify-center gap-1.5 mb-12 relative z-10 h-64">
            {audioLevels.map((level, i) => {
              // Create symmetric pattern from center
              const centerIndex = audioLevels.length / 2;
              const mirrorLevel = i < centerIndex ? audioLevels[audioLevels.length - 1 - i] : level;

              return (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-gray-500 via-gray-400 to-gray-300 rounded-full transition-all duration-50 shadow-sm shadow-gray-400/30"
                  style={{
                    height: `${Math.max(8, mirrorLevel * 250)}px`,
                  }}
                />
              );
            })}
          </div>

          {/* Listening Text */}
          <p className="text-white text-2xl font-light mb-8 animate-pulse">Listening...</p>

          {/* Stop Button */}
          <button
            onClick={handleVoiceInput}
            className="w-16 h-16 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors flex items-center justify-center shadow-lg shadow-gray-600/50"
            aria-label="Stop listening"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-8 h-8">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>
        </div>
      )}

      {/* White Glowing Effect - Right Side to Left - Extended Natural Atmospheric Fade */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Extended layered glow effects for smooth, natural fade reaching further left */}
        <div className="absolute top-[25%] -right-[20%] w-[70%] h-[50%] bg-white/25 blur-[300px] rounded-full"></div>
        <div className="absolute top-[20%] -right-[18%] w-[65%] h-[60%] bg-white/20 blur-[250px] rounded-full"></div>
        <div className="absolute top-[30%] -right-[15%] w-[60%] h-[40%] bg-white/30 blur-[220px] rounded-full"></div>
        <div className="absolute top-[35%] -right-[12%] w-[55%] h-[30%] bg-white/40 blur-[180px] rounded-full"></div>
        <div className="absolute top-[40%] -right-[8%] w-[50%] h-[20%] bg-white/50 blur-[150px] rounded-full"></div>
        <div className="absolute top-[42%] -right-[5%] w-[45%] h-[16%] bg-white/55 blur-[120px] rounded-full"></div>
        <div className="absolute top-[45%] right-[0%] w-[40%] h-[12%] bg-white/45 blur-[100px] rounded-full"></div>
      </div>

      {/* Header - Close Button Only */}
      <div className="bg-transparent px-4 sm:px-6 py-4 sm:py-6 md:py-8 flex items-center justify-end relative z-10">
        <button
          onClick={() => navigate('/')}
          className="w-8 h-8 sm:w-10 sm:h-10 z-10"
          aria-label="Close chat"
        >
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={9999}
            brightness={55}
            opacity={0.9}
            blur={12}
            displace={0}
            backgroundOpacity={0.05}
            saturation={1.2}
            distortionScale={-180}
            redOffset={0}
            greenOffset={10}
            blueOffset={20}
            className="!flex !items-center !justify-center !w-full !h-full hover:shadow-[0_8px_24px_0_rgba(255,255,255,0.3)] transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </GlassSurface>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-8 relative z-10 scroll-smooth">
        {messages.length === 0 ? (
          /* Empty state - center the input */
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 sm:px-6">
            {/* Rise AI Title - Glass Material Text */}
            <h1
              className="text-center text-7xl sm:text-8xl md:text-9xl lg:text-[8rem] xl:text-[9rem] font-bold mb-6 sm:mb-8"
              style={{
                letterSpacing: '0.05em',
                color: 'rgba(255, 255, 255, 0.15)',
                WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)',
              }}
            >
              Rise AI
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1">
                <GlassSurface
                  width="100%"
                  height="auto"
                  borderRadius={9999}
                  brightness={55}
                  opacity={0.9}
                  blur={12}
                  displace={0}
                  backgroundOpacity={0.05}
                  saturation={1.2}
                  distortionScale={-180}
                  redOffset={0}
                  greenOffset={10}
                  blueOffset={20}
                  className="!px-4 sm:!px-5 !py-2 sm:!py-2.5 focus-within:shadow-[0_4px_20px_0_rgba(255,255,255,0.2)] transition-all duration-300 !flex !items-center !gap-3"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 text-sm sm:text-base bg-transparent focus:outline-none text-white placeholder-white/50"
                  />
                  {inputValue.trim() === '' ? (
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      className={`flex-shrink-0 transition-colors ${isListening ? 'text-gray-500 animate-pulse' : 'text-black/70 hover:text-black'}`}
                      aria-label="Voice input"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={isLoading}
                      className="flex-shrink-0 text-black/70 hover:text-black transition-colors disabled:opacity-50"
                      aria-label="Send message"
                    >
                      {isLoading ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </GlassSurface>
              </div>
            </div>
            <p className="text-center text-white/50 text-xs mt-3">
              Rise AI can make mistakes. Check important info.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 relative z-10 w-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="max-w-[85%] sm:max-w-[70%]">
                  <GlassSurface
                    width="100%"
                    height="auto"
                    borderRadius={16}
                    brightness={message.sender === 'user' ? 58 : 52}
                    opacity={0.9}
                    blur={12}
                    displace={0}
                    backgroundOpacity={message.sender === 'user' ? 0.08 : 0.04}
                    saturation={1.2}
                    distortionScale={-180}
                    redOffset={0}
                    greenOffset={10}
                    blueOffset={20}
                    className="!px-4 sm:!px-6 !py-2 sm:!py-3"
                  >
                    {message.sender === 'bot' ? (
                      <div className="text-sm sm:text-base">
                        <MarkdownMessage content={message.text} />
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base text-white">{message.text}</p>
                    )}
                    <p className="text-xs mt-1 text-white/60">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </GlassSurface>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area - Only shown when there are messages */}
      {messages.length > 0 && (
        <div className="bg-transparent px-4 sm:px-6 py-4 sm:py-6 md:py-8 relative z-10">
          <div className="max-w-5xl mx-auto flex items-center gap-2 sm:gap-3 relative z-10">
          <div className="flex-1">
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={9999}
              brightness={55}
              opacity={0.9}
              blur={12}
              displace={0}
              backgroundOpacity={0.05}
              saturation={1.2}
              distortionScale={-180}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              className="!px-4 sm:!px-5 !py-2 sm:!py-2.5 focus-within:shadow-[0_4px_20px_0_rgba(255,255,255,0.2)] transition-all duration-300 !flex !items-center !gap-3"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 text-sm sm:text-base bg-transparent focus:outline-none text-white placeholder-white/50"
              />
              {inputValue.trim() === '' ? (
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`flex-shrink-0 transition-colors ${isListening ? 'text-gray-500 animate-pulse' : 'text-black/70 hover:text-black'}`}
                  aria-label="Voice input"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading}
                  className="flex-shrink-0 text-black/70 hover:text-black transition-colors disabled:opacity-50"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                      />
                    </svg>
                  )}
                </button>
              )}
            </GlassSurface>
          </div>
          <button
            onClick={handleSend}
            disabled={inputValue.trim() === '' || isLoading}
            className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 disabled:cursor-not-allowed disabled:opacity-30 transition-all duration-300"
            aria-label="Send message"
            style={{ display: 'none' }}
          >
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={9999}
              brightness={55}
              opacity={0.9}
              blur={12}
              displace={0}
              backgroundOpacity={0.05}
              saturation={1.2}
              distortionScale={-180}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              className="!flex !items-center !justify-center !w-full !h-full hover:shadow-[0_12px_32px_0_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              {isLoading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              )}
            </GlassSurface>
          </button>
        </div>
        <p className="text-center text-white/50 text-xs mt-3">
          Rise AI can make mistakes. Check important info.
        </p>
        </div>
      )}
    </div>
  );
}
