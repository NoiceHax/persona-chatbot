export default function TypingIndicator({ persona }) {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
          text-xs font-bold bg-gradient-to-br ${persona.color} text-white
        `}
      >
        {persona.avatar}
      </div>
      <div className={`px-4 py-3 rounded-2xl rounded-tl-md bg-dark-800/80 border ${persona.borderColor}`}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-current text-dark-400 animate-pulse-dot" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-current text-dark-400 animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-current text-dark-400 animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
