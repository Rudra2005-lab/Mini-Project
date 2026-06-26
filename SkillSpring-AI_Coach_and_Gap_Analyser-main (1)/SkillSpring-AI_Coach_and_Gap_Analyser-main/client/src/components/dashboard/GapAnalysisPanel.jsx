import { useDeferredValue, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

function GapScoreMeter({ score }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 160 160" className="h-44 w-44">
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke="rgba(148,163,184,0.18)"
          strokeWidth="12"
          fill="none"
          animate={{ stroke: ['rgba(148,163,184,0.18)', 'rgba(148,163,184,0.32)', 'rgba(148,163,184,0.18)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke="url(#gap-score-gradient)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          transform="rotate(-90 80 80)"
        />
        <defs>
          <linearGradient id="gap-score-gradient" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <motion.text 
          x="50%" 
          y="50%" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#162033"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <tspan className="fill-brand-text font-display text-[32px]">{score}</tspan>
          <tspan className="fill-slate-400 text-sm">%</tspan>
        </motion.text>
      </svg>
    </div>
  );
}

function TargetRoleSelector({ targetRole, roles, onSelectRole }) {
  const [query, setQuery] = useState(targetRole);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(targetRole);
  }, [targetRole]);

  const filteredRoles = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    if (!normalized) {
      return roles.slice(0, 8);
    }

    return roles.filter((role) => role.toLowerCase().includes(normalized)).slice(0, 8);
  }, [deferredQuery, roles]);

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <label className="text-sm uppercase tracking-[0.24em] text-brand-muted" htmlFor="target-role">
        Target role
      </label>
      <input
        id="target-role"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="mt-4 w-full rounded-2xl border border-white/10 bg-brand-bg/60 px-4 py-3 text-brand-text outline-none ring-brand-teal/40 transition focus:ring-2"
        placeholder="Search a role"
      />
      <div className="mt-4 flex flex-wrap gap-3">
        {filteredRoles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => {
              setQuery(role);
              onSelectRole(role);
            }}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              role === targetRole
                ? 'border-brand-teal/40 bg-brand-teal/10 text-brand-teal'
                : 'border-white/10 bg-white/5 text-slate-600 hover:border-brand-violet/50 hover:text-brand-text'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}

function GapMatrix({ rows }) {
  if (!rows.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-brand-muted font-medium">
        Pick a target role to compare your current skill map against required skills.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop Header */}
      <div className="hidden md:grid grid-cols-[1.4fr_0.75fr_0.75fr_0.8fr] gap-4 rounded-t-[28px] border border-white/10 bg-white/5 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">
        <span>Required skill</span>
        <span>Your score</span>
        <span>Target</span>
        <span>Gap</span>
      </div>

      <div className="space-y-4 md:space-y-0 md:divide-y md:divide-white/10 md:rounded-b-[28px] md:border md:border-t-0 md:border-white/10 md:bg-white/5 md:overflow-hidden">
        {rows.map((row) => (
          <motion.div
            key={row.name}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', x: 4 }}
            className="rounded-[24px] border border-white/10 bg-white/5 p-5 md:grid md:grid-cols-[1.4fr_0.75fr_0.75fr_0.8fr] md:gap-4 md:rounded-none md:border-none md:bg-transparent md:px-6 md:py-5 text-sm transition-all"
          >
            {/* Mobile label shown only on small screens */}
            <div className="flex flex-col gap-1 md:block">
              <div className="flex items-center justify-between md:block">
                <p className="font-display text-lg font-semibold text-white md:text-base">{row.name}</p>
                <Badge tone="slate" className="md:hidden">{row.importance} Priority</Badge>
              </div>
              <p className="hidden md:block mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-muted">
                {row.importance} priority
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 md:mt-0 md:grid-cols-1 md:contents">
              <div className="flex flex-col md:block">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted md:hidden">Score</span>
                <span className="text-slate-200 font-medium md:font-normal">{row.current}%</span>
              </div>
              <div className="flex flex-col md:block">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted md:hidden">Target</span>
                <span className="text-slate-200 font-medium md:font-normal">{row.target}%</span>
              </div>
              <div className="flex flex-col md:block">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted md:hidden">Gap</span>
                <span
                  className={`font-semibold md:font-normal ${
                    row.status === 'aligned'
                      ? 'text-brand-teal'
                      : row.status === 'partial'
                        ? 'text-amber-500'
                        : 'text-rose-500'
                  }`}
                >
                  {row.gap} pts
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function GapAnalysisPanel({
  targetRole,
  roleOptions,
  onSelectRole,
  gapMatrix,
  readinessScore,
}) {
  const topPriorities = gapMatrix.filter((item) => item.gap > 0).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
        <Card className="p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Readiness Score</p>
          <h3 className="mt-4 font-display text-3xl text-brand-text">Gap score meter</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            This score blends skill coverage with weighted priority so critical gaps matter more
            than nice-to-have skills.
          </p>
          <div className="mt-8">
            <GapScoreMeter score={readinessScore} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge tone={readinessScore >= 80 ? 'teal' : readinessScore >= 65 ? 'indigo' : 'amber'}>
              {readinessScore >= 80 ? 'Interview-ready momentum' : 'Active growth zone'}
            </Badge>
            <Badge tone="slate">{targetRole}</Badge>
          </div>
        </Card>

        <TargetRoleSelector
          targetRole={targetRole}
          roles={roleOptions}
          onSelectRole={onSelectRole}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.68fr_0.32fr]">
        <GapMatrix rows={gapMatrix} />

        <Card className="p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-brand-muted">Top priorities</p>
          <div className="mt-5 space-y-4">
            {topPriorities.map((item, index) => (
              <div key={item.name} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-brand-muted">
                  Priority {index + 1}
                </p>
                <h4 className="mt-2 text-lg font-semibold text-brand-text">{item.name}</h4>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Close {item.gap} more points to reach the role benchmark in this area.
                </p>
              </div>
            ))}

            {!topPriorities.length ? (
              <div className="rounded-[24px] border border-brand-teal/30 bg-brand-teal/10 p-4 text-sm leading-7 text-brand-teal">
                You are aligned on the tracked requirements for this role. The next gain comes from
                projects, visibility, and interview practice.
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
