export function Wordmark(): React.JSX.Element {
  return (
    <div
      className="flex items-baseline gap-1.5 select-none md:gap-2"
      aria-label="Magazord agenda"
    >
      <span className="font-serif text-xl font-semibold tracking-tight text-foreground md:text-2xl">
        Magazord
      </span>
      <span className="font-serif text-base italic text-muted-foreground md:text-lg">
        agenda
      </span>
    </div>
  );
}
