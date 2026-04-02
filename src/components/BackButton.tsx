import { Link } from 'react-router-dom'

export function BackButton() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-6 no-underline">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to List
    </Link>
  )
}
