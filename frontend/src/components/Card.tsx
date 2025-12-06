import type { PropsWithChildren } from 'react'

export default function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`bg-white rounded-2xl shadow p-4 ${className}`}>{children}</div>
}
