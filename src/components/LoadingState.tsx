interface LoadingStateProps {
  message?: string
  variant?: 'skeleton' | 'spinner' | 'text'
}

export function LoadingState({ message = 'Loading...', variant = 'text' }: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className="relative flex flex-col items-center rounded border border-slate-600 bg-slate-800 p-4 shadow-lg animate-pulse">
        <div className="w-32 h-32 rounded-full mb-3 bg-slate-700" />
        <div className="h-4 w-24 mb-2 bg-slate-700 rounded" />
        <div className="h-3 w-16 bg-slate-700 rounded" />
      </div>
    )
  }

  if (variant === 'spinner') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-xl font-semibold">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <p className="text-white text-lg animate-pulse">{message}</p>
    </div>
  )
}
