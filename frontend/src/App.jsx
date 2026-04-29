import { useState, useCallback } from 'react';
import PersonaSwitcher from './components/PersonaSwitcher';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import { personas } from './data/personas';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [activePersonaId, setActivePersonaId] = useState('anshuman');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const activePersona = personas.find((p) => p.id === activePersonaId);

  const handlePersonaSwitch = useCallback((personaId) => {
    setActivePersonaId(personaId);
    setMessages([]);
    setIsLoading(false);
  }, []);

  const sendMessage = useCallback(async (text) => {
    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          persona: activePersonaId,
          history,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Something went wrong. Try again.');
      }

      const data = await res.json();
      const aiMessage = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = {
        role: 'assistant',
        content: err.message || 'Something went wrong. Try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [activePersonaId, messages]);

  return (
    <div className="h-screen bg-dark-950 text-dark-100 font-sans flex flex-col overflow-hidden">
      {/* Background gradient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col h-full max-w-3xl mx-auto w-full">
        {/* Header */}
        <header className="flex-shrink-0 px-4 pt-4 pb-3 space-y-3">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52a1.595 1.595 0 0 1 1.348 1.578v7.284c0 .754-.517 1.404-1.248 1.565a49.39 49.39 0 0 1-3.486.57c-1.17.156-1.898 1.342-1.616 2.493.18.733.37 1.462.564 2.184a.678.678 0 0 1-.654.857h-2.12a.678.678 0 0 1-.654-.857c.194-.722.384-1.45.564-2.184.282-1.15-.446-2.337-1.616-2.493a49.39 49.39 0 0 1-3.486-.57 1.595 1.595 0 0 1-1.248-1.565V4.348c0-.754.517-1.404 1.248-1.565A49.144 49.144 0 0 1 4.848 2.771Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-base font-semibold text-dark-200">
              Scaler Mentors
            </h1>
          </div>

          {/* Persona Tabs */}
          <PersonaSwitcher
            activePersona={activePersonaId}
            onSwitch={handlePersonaSwitch}
          />
        </header>

        {/* Chat Area */}
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          persona={activePersona}
          onChipSelect={sendMessage}
        />

        {/* Input */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          <ChatInput
            onSend={sendMessage}
            isLoading={isLoading}
            persona={activePersona}
          />
          <p className="text-center text-[11px] text-dark-600 mt-2">
            Powered by Gemini AI · Responses are AI-generated
          </p>
        </div>
      </div>
    </div>
  );
}
