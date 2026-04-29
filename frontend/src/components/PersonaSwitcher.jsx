import { personas } from '../data/personas';

export default function PersonaSwitcher({ activePersona, onSwitch }) {
  return (
    <div className="flex gap-2 p-1 bg-dark-800/60 rounded-2xl backdrop-blur-sm border border-dark-700/50">
      {personas.map((persona) => {
        const isActive = activePersona === persona.id;
        return (
          <button
            key={persona.id}
            id={`persona-tab-${persona.id}`}
            onClick={() => onSwitch(persona.id)}
            className={`
              relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl
              transition-all duration-300 ease-out flex-1 min-w-0
              ${isActive
                ? `bg-gradient-to-r ${persona.color} text-white shadow-lg ${persona.bgGlow}`
                : 'text-dark-300 hover:text-dark-100 hover:bg-dark-700/50'
              }
            `}
          >
            {/* Avatar */}
            <div
              className={`
                flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                text-xs font-bold transition-all duration-300
                ${isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-dark-700 text-dark-400'
                }
              `}
            >
              {persona.avatar}
            </div>

            {/* Name + Role */}
            <div className="hidden sm:block text-left min-w-0">
              <div className={`text-sm font-semibold truncate ${isActive ? 'text-white' : ''}`}>
                {persona.name}
              </div>
              <div className={`text-[11px] truncate ${isActive ? 'text-white/70' : 'text-dark-500'}`}>
                {persona.role}
              </div>
            </div>

            {/* Mobile: just show name */}
            <span className="sm:hidden text-xs font-medium truncate">
              {persona.name.split(' ')[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
