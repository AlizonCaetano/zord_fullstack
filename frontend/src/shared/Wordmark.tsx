export function Wordmark(): React.JSX.Element {
  return (
    <div className="flex items-baseline gap-2 select-none" aria-label="Magazord agenda">
      <span className="font-serif text-2xl font-semibold tracking-tight text-brand-red">
        Magazord
      </span>
      <span className="font-serif text-lg italic text-brand-gold">agenda</span>
    </div>
  )
}