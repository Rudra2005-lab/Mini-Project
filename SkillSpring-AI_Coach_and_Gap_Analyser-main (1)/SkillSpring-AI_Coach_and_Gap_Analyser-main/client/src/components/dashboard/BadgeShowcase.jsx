import Card from '../ui/Card';

export default function BadgeShowcase({ badges }) {
  return (
    <Card className="p-6">
      <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Badge Showcase</p>
      <h3 className="mt-3 font-display text-3xl text-brand-text">Gamified progress layer</h3>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-[24px] border p-4 ${
              badge.unlocked
                ? 'border-brand-teal/30 bg-brand-teal/10'
                : 'border-white/10 bg-white/5 opacity-70'
            }`}
          >
            <div className="text-3xl">{badge.icon}</div>
            <h4 className="mt-4 text-lg font-semibold text-brand-text">{badge.title}</h4>
            <p className="mt-3 text-sm leading-7 text-slate-300">{badge.description}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-brand-muted">
              {badge.unlocked ? 'Unlocked' : 'Locked'}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
