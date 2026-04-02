interface PhysicalRowProps {
  label: string
  value: string
}

export function PhysicalRow({ label, value }: PhysicalRowProps) {
  return (
    <div className="bg-slate-600/50 rounded-lg p-4">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-white font-semibold">{value}</span>
      </div>
    </div>
  )
}
