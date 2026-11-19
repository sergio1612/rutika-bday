export function Ornament({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 16"
      className={`mx-auto mt-5 h-4 w-32 text-gold ${className}`}
      aria-hidden="true"
    >
      <path d="M8 8h46M86 8h46" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="70" cy="8" r="2.1" fill="currentColor" />
      <path
        d="M60 8c2.2-4.2 6.2-4.2 8.4 0 2.2 4.2 6.2 4.2 8.4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      />
    </svg>
  )
}
