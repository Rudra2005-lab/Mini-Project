import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import Card from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-brand-surface/90 px-4 py-3 shadow-xl backdrop-blur-xl">
        <p className="text-sm font-bold text-brand-text">{payload[0].payload.axis}</p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs text-brand-muted uppercase tracking-widest">Current</span>
            <span className="text-sm font-bold text-brand-teal">{payload[0].value}%</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs text-brand-muted uppercase tracking-widest">Target</span>
            <span className="text-sm font-bold text-brand-violet">{payload[1].value}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function SkillRadarChart({ data, onAdjustAxis }) {
  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Skill Overview</p>
          <h3 className="mt-3 font-display text-3xl text-brand-text">Readiness radar</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Compare your current skill shape against the target-role benchmark. Adjust the axis
            sliders to reflect your honest self-assessment in local dev mode.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-brand-muted">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-brand-teal" />
            Current
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-brand-violet" />
            Target
          </span>
        </div>
      </div>

      {!data || data.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-pulse rounded-full bg-brand-teal/10 blur-2xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-brand-teal">
              <Radar className="h-10 w-10 opacity-40 shrink-0" />
            </div>
          </div>
          <p className="text-sm uppercase tracking-[0.28em] text-brand-muted">Radar Inactive</p>
          <h3 className="mt-4 font-display text-2xl text-white">No skills tracked yet</h3>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400 font-medium">
            Add your first skill or import your profile to see your readiness radar in action.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 xl:grid-cols-[0.56fr_0.44fr]">
          <div className="h-[300px] sm:h-[340px] w-full relative group">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="rgba(148,163,184,0.18)" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: '#64748b', fontSize: window.innerWidth < 640 ? 9 : 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#7C3AED"
                  fill="url(#targetGradient)"
                  fillOpacity={0.15}
                  strokeWidth={3}
                  animationBegin={400}
                  animationDuration={1200}
                />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#2DD4BF"
                  fill="url(#currentGradient)"
                  fillOpacity={0.25}
                  strokeWidth={3}
                  animationBegin={0}
                  animationDuration={1200}
                />
                <defs>
                  <radialGradient id="currentGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#2DD4BF" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#2DD4BF" stopOpacity={0.1} />
                  </radialGradient>
                  <radialGradient id="targetGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.05} />
                  </radialGradient>
                </defs>
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {data.map((item, index) => (
                <motion.div 
                  key={item.categoryKey}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="group rounded-[24px] border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-brand-text tracking-tight">{item.axis}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-muted">
                        {item.current}% <span className="mx-1 opacity-30">/</span> {item.target}%
                      </p>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${item.current >= item.target ? 'bg-brand-teal shadow-[0_0_8px_rgba(45,212,191,0.5)]' : 'bg-amber-400 opacity-50'}`} />
                  </div>

                  <div className="mt-5 relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={item.current}
                      onChange={(event) => onAdjustAxis(item.categoryKey, Number(event.target.value))}
                      className="w-full accent-[#2DD4BF]"
                      aria-label={`${item.axis} score`}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </Card>
  );
}
