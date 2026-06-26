import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const panels = [
  {
    title: 'Skill Mapping',
    body: 'Turn messy inputs into a visual skill fingerprint across technical depth, communication, leadership, and problem solving.',
    badge: 'Radar intelligence',
  },
  {
    title: 'Gap Analysis',
    body: 'Compare your profile against real role expectations and immediately see the missing pieces, confidence gaps, and readiness score.',
    badge: 'Real-time scoring',
  },
  {
    title: 'AI Roadmap',
    body: 'Get a structured week-by-week learning path tailored to your available time, target role, and existing strengths.',
    badge: 'Action-first planning',
  },
];

const radarPoints = [
  { label: 'React', cx: 150, cy: 30 },
  { label: 'Node.js', cx: 242, cy: 94 },
  { label: 'Testing', cx: 212, cy: 226 },
  { label: 'CSS/UI', cx: 88, cy: 226 },
  { label: 'Systems', cx: 58, cy: 94 },
];

function RadarVisual() {
  return (
    <div className="relative mx-auto flex h-72 w-full max-w-[320px] items-center justify-center">
      {[220, 170, 120].map((size) => (
        <motion.div
          key={size}
          className="radial-outline"
          style={{ height: size, width: size }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: size / 400 }}
        />
      ))}

      <svg viewBox="0 0 300 300" className="absolute h-[260px] w-[260px]">
        {/* Filled polygon */}
        <motion.polygon
          points="150,30 242,94 212,226 88,226 58,94"
          fill="rgba(45, 212, 191, 0.12)"
          stroke="rgba(45, 212, 191, 0.9)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Animated vertex dots */}
        {radarPoints.map((pt, i) => (
          <motion.circle
            key={pt.label}
            cx={pt.cx}
            cy={pt.cy}
            r="5"
            fill="rgba(45,212,191,1)"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: 1.3 + i * 0.1 }}
          />
        ))}

        {/* Pulsing rings on vertex dots */}
        {radarPoints.map((pt, i) => (
          <motion.circle
            key={`ring-${pt.label}`}
            cx={pt.cx}
            cy={pt.cy}
            r="5"
            fill="none"
            stroke="rgba(45,212,191,0.5)"
            strokeWidth="1.5"
            initial={{ scale: 1, opacity: 0 }}
            whileInView={{
              scale: [1, 2.2, 1],
              opacity: [0, 0.6, 0],
            }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              duration: 2,
              delay: 1.6 + i * 0.2,
              repeat: Infinity,
              repeatDelay: 1.5,
            }}
          />
        ))}

        {/* Axis labels */}
        {radarPoints.map((pt) => (
          <motion.text
            key={`lbl-${pt.label}`}
            x={pt.cx}
            y={pt.cy > 150 ? pt.cy + 18 : pt.cy - 10}
            textAnchor="middle"
            fill="rgba(148,163,184,0.8)"
            fontSize="10"
            fontFamily="inherit"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 1.8 }}
          >
            {pt.label}
          </motion.text>
        ))}
      </svg>

      {/* Center glow */}
      <div className="absolute h-4 w-4 rounded-full bg-brand-teal shadow-[0_0_24px_rgba(45,212,191,0.9)]" />
    </div>
  );
}

function GapBars() {
  const bars = [
    ['React patterns', 88, '#2DD4BF'],
    ['Testing depth', 54, '#7C3AED'],
    ['System design', 41, '#6366F1'],
    ['Accessibility', 72, '#2DD4BF'],
  ];

  return (
    <div className="space-y-5">
      {bars.map(([label, width, color], index) => (
        <div key={label}>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span>{label}</span>
            <motion.span
              className="font-mono text-xs"
              style={{ color }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.4 + index * 0.12 }}
            >
              {width}%
            </motion.span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}90, ${color})` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${width}%` }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ left: '-10%' }}
              whileInView={{ left: '110%' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.9 + index * 0.12 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function NodeGraph() {
  const roadmapSteps = [
    { id: 1, text: 'Advanced React Patterns', state: 'done' },
    { id: 2, text: 'System Architecture', state: 'current' },
    { id: 3, text: 'Performance Audits', state: 'upcoming' },
    { id: 4, text: 'Mock Interviews', state: 'upcoming' },
  ];

  return (
    <div className="relative flex h-auto min-h-[288px] flex-col justify-center overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 sm:p-8">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-brand-violet/10 blur-3xl lg:h-48 lg:w-48" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-brand-teal/10 blur-3xl lg:h-48 lg:w-48" />

      <div className="relative z-10 space-y-4 sm:space-y-6">
        {roadmapSteps.map((step, idx) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="flex items-start gap-4 sm:items-center"
          >
            <div className="relative flex flex-col items-center justify-center">
              {idx !== roadmapSteps.length - 1 && (
                <motion.div
                  className={`absolute top-8 h-8 w-[2px] sm:h-10 ${
                    step.state === 'done' ? 'bg-brand-teal' : 'bg-white/10'
                  }`}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.15, duration: 0.4 }}
                  style={{ transformOrigin: 'top' }}
                />
              )}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                  step.state === 'done'
                    ? 'border-brand-teal bg-brand-teal'
                    : step.state === 'current'
                      ? 'border-brand-teal bg-brand-bg shadow-[0_0_16px_rgba(45,212,191,0.5)]'
                      : 'border-white/20 bg-brand-bg'
                }`}
              >
                {step.state === 'done' && (
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {step.state === 'current' && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1.2, opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-2.5 w-2.5 rounded-full bg-brand-teal"
                  />
                )}
              </div>
            </div>

            <div
              className={`flex-1 rounded-2xl px-4 py-3 sm:px-5 transition-all duration-300 ${
                step.state === 'done'
                  ? 'border border-white/10 bg-white/5'
                  : step.state === 'current'
                    ? 'border border-brand-teal/20 bg-brand-teal/10'
                    : 'border border-transparent bg-transparent'
              }`}
            >
              <p
                className={`text-sm font-semibold sm:text-base ${
                  step.state === 'current'
                    ? 'text-brand-teal'
                    : step.state === 'done'
                      ? 'text-slate-200'
                      : 'text-slate-400'
                }`}
              >
                {step.text}
              </p>
              {step.state === 'current' && (
                <motion.div
                  className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    className="h-full rounded-full bg-brand-teal"
                    initial={{ width: '0%' }}
                    whileInView={{ width: '42%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PanelVisual({ index, progress }) {
  const translateY = useTransform(progress, [0, 1], ['-40px', '40px']);
  const rotateZ = useTransform(progress, [0, 1], [index === 1 ? -2 : 2, index === 1 ? 2 : -2]);

  return (
    <motion.div style={{ y: translateY, rotateZ }}>
      <Card className="p-6 md:p-8" glow>
        {index === 0 && <RadarVisual />}
        {index === 1 && <GapBars />}
        {index === 2 && <NodeGraph />}
      </Card>
    </motion.div>
  );
}

function SolutionPanel({ index, panel }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const reverse = index % 2 === 1;

  return (
    <div ref={ref} className="grid items-center gap-8 lg:grid-cols-2">
      <motion.div
        className={reverse ? 'order-2 lg:order-1' : ''}
        {...useScrollAnimation(reverse ? 'slideRight' : 'slideLeft')}
      >
        <Badge tone={index === 1 ? 'violet' : index === 2 ? 'indigo' : 'teal'}>
          {panel.badge}
        </Badge>
        <h3 className="mt-5 font-display text-3xl text-white md:text-4xl">{panel.title}</h3>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">{panel.body}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {['Role-aware', 'Editable', 'Exportable', 'Live-updating']
            .slice(index, index + 2)
            .map((item) => (
              <motion.div
                key={item}
                className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition-all duration-200 hover:border-brand-teal/30 hover:bg-brand-teal/5"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-teal opacity-60 group-hover:opacity-100 transition-opacity" />
                {item}
              </motion.div>
            ))}
        </div>
      </motion.div>

      <div className={reverse ? 'order-1 lg:order-2' : ''}>
        <PanelVisual index={index} progress={scrollYProgress} />
      </div>
    </div>
  );
}

export default function SolutionSection() {
  return (
    <section className="section-shell py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div {...useScrollAnimation('fadeUp')} className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.32em] text-brand-teal">The Solution</p>
          <motion.h2
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="mt-4 font-display text-4xl text-white md:text-5xl"
          >
            A skill operating system built for career momentum.
          </motion.h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            SkillSpring blends visual mapping, role-aware diagnostics, and an AI coach that knows
            what to prioritize next.
          </p>
        </motion.div>

        <div className="mt-16 space-y-12">
          {panels.map((panel, index) => (
            <SolutionPanel key={panel.title} index={index} panel={panel} />
          ))}
        </div>
      </div>
    </section>
  );
}
