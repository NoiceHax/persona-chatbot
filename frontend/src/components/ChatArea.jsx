import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export default function ChatArea({ messages, isLoading, persona, onChipSelect }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      id="chat-area"
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          
        </div>
      ) : (
        <>
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} persona={persona} />
          ))}
          {isLoading && <TypingIndicator persona={persona} />}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
