export default function Tooltip({ label, children }) {
  return (
    <span className="group relative inline-flex items-center">
      {children}
      <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-brand-surface px-3 py-1 text-xs text-brand-text shadow-lg group-hover:block group-focus-within:block">
        {label}
      </span>
    </span>
  );
}

