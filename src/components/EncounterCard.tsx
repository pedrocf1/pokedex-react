interface EncounterDetail {
  method: { name: string }
  chance: number
}

interface VersionDetail {
  version: { name: string }
  encounter_details: EncounterDetail[]
}

interface EncounterCardProps {
  locationName: string
  versionDetails: VersionDetail[]
}

function formatLocationName(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function EncounterCard({ locationName, versionDetails }: EncounterCardProps) {
  const firstVersion = versionDetails[0]
  const firstDetail = firstVersion?.encounter_details[0]
  const versions = versionDetails.map((v) => v.version.name).join(', ')
  const otherDetails = firstVersion?.encounter_details.slice(1) ?? []

  return (
    <div className="bg-slate-600/50 rounded-lg p-4 border border-slate-600 hover:border-blue-500 transition-colors">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <p className="text-blue-400 font-semibold capitalize">
            {formatLocationName(locationName)}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <p className="text-slate-300 text-sm">
            <span className="text-blue-400 font-semibold">Method: </span>
            <span style={{ textTransform: 'capitalize' }}>{firstDetail?.method.name ?? 'Unknown'}</span>
          </p>
          <p className="text-slate-300 text-sm">
            <span className="text-blue-400 font-semibold">Chance: </span>
            {firstDetail?.chance ?? 'N/A'}%
          </p>
        </div>
        <div className="col-span-1">
          <p className="text-slate-300 text-sm">
            <span className="text-blue-400 font-semibold">Version(s): </span>
            <span style={{ textTransform: 'capitalize' }}>{versions}</span>
          </p>
        </div>
        {otherDetails.length > 0 && (
          <div className="col-span-1">
            <p className="text-blue-400 text-sm font-semibold mb-1">Other conditions:</p>
            <div style={{ marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {otherDetails.map((detail, i) => (
                <p key={i} className="text-gray-500 text-xs">
                  <span style={{ textTransform: 'capitalize' }}>{detail.method.name}</span> — Chance: {detail.chance}%
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
