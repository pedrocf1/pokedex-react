interface AbilityCardProps {
  name: string
  isHidden?: boolean
}

export function AbilityCard({ name, isHidden = false }: AbilityCardProps) {
  return (
    <div className="bg-slate-600/50 rounded-lg p-4 border-l-4 border-blue-500">
      <div className="capitalize text-white font-semibold">{name}</div>
      {isHidden && (
        <span className="text-xs bg-yellow-500/30 text-yellow-300 px-2 py-1 rounded mt-2 inline-block">
          Hidden Ability
        </span>
      )}
    </div>
  )
}
