interface DamageGroupProps {
  title: string
  types: Array<{ name: string }>
  borderColor: string
  bgColor: string
  badgeColor: string
}

export function DamageGroup({
  title,
  types,
  borderColor,
  bgColor,
  badgeColor,
}: DamageGroupProps) {
  const badgeStyles = Object.fromEntries(
    badgeColor.split(';').filter(s => s.includes(':')).map(s => {
      const [key, value] = s.split(':')
      return [key?.trim() || '', value?.trim() || '']
    })
  )

  return (
    <div style={{ backgroundColor: bgColor, borderLeft: `4px solid ${borderColor}` }} className="rounded-lg p-4">
      <h4 className="text-white font-semibold mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <span 
            key={t.name} 
            style={{ ...{ background: 'transparent' }, ...badgeStyles }} 
            className="px-3 py-1 rounded-full text-sm capitalize"
          >
            {t.name}
          </span>
        ))}
      </div>
    </div>
  )
}
