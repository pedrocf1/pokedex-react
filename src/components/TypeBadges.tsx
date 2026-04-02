import { TYPE_COLORS } from '../utils/typeColors'

interface SimpleType {
  name: string
}

interface NestedType {
  type: { name: string }
}

type TypeData = SimpleType | NestedType

interface TypeBadgesProps {
  types: TypeData[]
  size?: 'sm' | 'md' | 'lg'
  layout?: 'row' | 'column'
}

export function TypeBadges({ types, size = 'md', layout = 'row' }: TypeBadgesProps) {
  const sizeClasses = {
    sm: 'py-0.5 px-2 text-xs',
    md: 'py-1 px-2 text-sm',
    lg: 'py-2 px-4 text-base',
  }

  const layoutClass = layout === 'column' ? 'flex-col' : 'flex-wrap'

  const getTypeName = (item: TypeData): string => {
    return 'name' in item ? item.name : item.type.name
  }

  return (
    <div className={`flex gap-2 ${layoutClass} justify-center`}>
      {types.map((item) => {
        const name = getTypeName(item)
        return (
          <span
            key={name}
            className={`rounded-full font-medium text-white capitalize ${sizeClasses[size]}`}
            style={{
              ...(typeof TYPE_COLORS[name] === 'string'
                ? { backgroundColor: TYPE_COLORS[name] as string }
                : {}),
            }}
          >
            {name}
          </span>
        )
      })}
    </div>
  )
}
