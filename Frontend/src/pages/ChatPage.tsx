import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../services/api';
import GlassSurface from '../components/GlassSurface';

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
  const [threadId] = useState(() => `thread_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }, 100);
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
      setTimeout(() => scrollToBottom(), 150);
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

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black flex flex-col overflow-hidden relative" style={{ overscrollBehavior: 'none' }}>
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
                      className="flex-shrink-0 text-black/70 hover:text-black transition-colors"
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
                    <p className="text-sm sm:text-base text-white">{message.text}</p>
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
                  className="flex-shrink-0 text-black/70 hover:text-black transition-colors"
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
