const STAT_MAX = 255

const STAT_COLORS: Record<string, string> = {
  hp: 'linear-gradient(to right, #22c55e, #4ade80)',
  attack: 'linear-gradient(to right, #ef4444, #fb7185)',
  defense: 'linear-gradient(to right, #3b82f6, #60a5fa)',
  'special-attack': 'linear-gradient(to right, #a855f7, #c084fc)',
  'special-defense': 'linear-gradient(to right, #06b6d4, #22d3ee)',
  speed: 'linear-gradient(to right, #eab308, #fbbf24)',
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

interface StatBarProps {
  statName: string
  baseStat: number
}

export function StatBar({ statName, baseStat }: StatBarProps) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-300">{STAT_LABELS[statName] ?? statName}</span>
        <span className="text-white font-semibold">{baseStat}</span>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
        <div
          style={{
            width: `${(baseStat / STAT_MAX) * 100}%`,
            background: STAT_COLORS[statName] ?? 'linear-gradient(to right, #3b82f6, #60a5fa)',
            transition: 'width 0.7s ease',
          }}
          className="h-full rounded-full"
        ></div>
      </div>
    </div>
  )
}
