export default function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="text-2xl font-bold text-primary-700">{title}</div>
      {subtitle && <div className="text-sm text-primary-700/70">{subtitle}</div>}
    </div>
  )
}
