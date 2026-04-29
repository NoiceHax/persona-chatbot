export default function MessageBubble({ message, persona }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
          text-xs font-bold mt-1
          ${isUser
            ? 'bg-dark-600 text-dark-300'
            : `bg-gradient-to-br ${persona.color} text-white`
          }
        `}
      >
        {isUser ? 'You' : persona.avatar}
      </div>

      {/* Message content */}
      <div
        className={`
          max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl
          text-sm leading-relaxed message-content
          ${isUser
            ? 'bg-dark-700 text-dark-100 rounded-tr-md'
            : `bg-dark-800/80 text-dark-200 rounded-tl-md border ${persona.borderColor}`
          }
        `}
      >
        {message.content}
      </div>
    </div>
  );
}
