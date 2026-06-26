export default function Card({ className = '', children, glow = false, ...props }) {
  return (
    <div
      className={`glass-card rounded-[28px] border border-brand-border/80 ${glow ? 'shadow-glow' : 'shadow-[0_10px_30px_rgba(148,163,184,0.12)]'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
