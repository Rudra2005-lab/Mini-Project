const toneMap = {
  teal: 'border-brand-teal/30 bg-brand-teal/10 text-brand-teal',
  violet: 'border-brand-violet/20 bg-brand-violet/10 text-violet-700',
  indigo: 'border-brand-indigo/20 bg-brand-indigo/10 text-blue-700',
  slate: 'border-slate-300/70 bg-white/80 text-slate-600',
  rose: 'border-rose-400/30 bg-rose-400/10 text-rose-700',
  amber: 'border-amber-400/30 bg-amber-300/20 text-amber-800',
};

export default function Badge({ children, tone = 'slate', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${toneMap[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
