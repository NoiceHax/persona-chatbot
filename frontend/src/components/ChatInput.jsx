import { useState } from 'react';

export default function ChatInput({ onSend, isLoading, persona }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 p-3 bg-dark-800/80 backdrop-blur-sm border border-dark-700/50 rounded-2xl"
    >
      <textarea
        id="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        placeholder={`Ask ${persona.name.split(' ')[0]} something...`}
        rows={1}
        className="
          flex-1 bg-transparent text-dark-100 placeholder-dark-500
          text-sm resize-none outline-none px-2 py-1.5
          max-h-32 min-h-[36px]
        "
        style={{ height: 'auto' }}
        onInput={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
        }}
      />

      <button
        id="send-button"
        type="submit"
        disabled={!input.trim() || isLoading}
        className={`
          flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
          transition-all duration-200
          ${input.trim() && !isLoading
            ? `bg-gradient-to-r ${persona.color} text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95`
            : 'bg-dark-700 text-dark-500 cursor-not-allowed'
          }
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
        </svg>
      </button>
    </form>
  );
}
