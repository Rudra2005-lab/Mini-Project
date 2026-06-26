import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Upload, Cpu, Map, BarChart2 } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import Card from '../ui/Card';

const steps = [
  {
    title: 'Input Your Skills',
    description: 'Manual input, resume PDF upload, or GitHub profile link.',
    icon: Upload,
    color: '#2DD4BF',
  },
  {
    title: 'AI Analyzes',
    description: 'GPT-4o maps skills to industry frameworks like SFIA and O*NET.',
    icon: Cpu,
    color: '#7C3AED',
  },
  {
    title: 'Get Your Roadmap',
    description: 'Receive a personalized week-by-week learning path with concrete resources.',
    icon: Map,
    color: '#6366F1',
  },
  {
    title: 'Track & Improve',
    description: 'Use the dashboard to monitor progress, milestones, and next best actions.',
    icon: BarChart2,
    color: '#2DD4BF',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" ref={ref} className="section-shell py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div {...useScrollAnimation('fadeUp')} className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.32em] text-brand-teal">How It Works</p>
          <h2 className="mt-4 font-display text-4xl text-brand-text md:text-5xl">
            Four steps from uncertainty to a focused growth plan.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Every stage is designed to reduce ambiguity and replace generic learning advice with a
            visible system you can act on immediately.
          </p>
        </motion.div>

        <div className="relative mt-16">
          {/* Animated timeline spine */}
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full -translate-x-1/2 md:block">
            <svg width="120" height="100%" viewBox="0 0 120 1000" className="h-full opacity-40">
              <path
                d="M60 0 L60 1000"
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="2"
                fill="none"
              />
              <motion.path
                d="M60 0 L60 1000"
                stroke="url(#timeline-gradient)"
                strokeWidth="4"
                fill="none"
                style={{ pathLength }}
              />
              <defs>
                <linearGradient id="timeline-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#2DD4BF" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="space-y-10">
            {steps.map((step, index) => (
              <TimelineStep key={step.title} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineStep({ step, index }) {
  const isLeft = index % 2 !== 0;
  const Icon = step.icon;

  return (
    <motion.div
      {...useScrollAnimation(isLeft ? 'slideRight' : 'slideLeft')}
      className="relative grid gap-6 md:grid-cols-2"
    >
      {/* Central dot with pulse */}
      <div className="absolute left-1/2 top-10 z-20 hidden -translate-x-1/2 md:flex">
        <motion.div
          className="h-4 w-4 rounded-full border-2 border-brand-teal/60 bg-brand-bg"
          whileInView={{
            boxShadow: [
              '0 0 0 0 rgba(45,212,191,0)',
              '0 0 0 8px rgba(45,212,191,0.15)',
              '0 0 0 0 rgba(45,212,191,0)',
            ],
          }}
          viewport={{ once: false }}
          transition={{ duration: 2, delay: index * 0.3, repeat: Infinity, repeatDelay: 1.5 }}
        />
      </div>

      {/* Spacer column */}
      <div className={`hidden md:block ${isLeft ? 'order-2' : ''}`} />

      {/* Content card */}
      <motion.div
        className={isLeft ? 'order-1' : ''}
        whileHover={{ y: -8, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 190, damping: 18 }}
      >
        <Card className="group relative overflow-hidden p-6 md:p-8" glow>
          {/* Ambient corner glow */}
          <div
            className="absolute right-0 top-0 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 opacity-60 group-hover:opacity-100"
            style={{ background: `radial-gradient(circle at top right, ${step.color}18, transparent)` }}
          />

          <div className="relative z-10">
            {/* Step header row */}
            <div className="mb-6 flex items-center gap-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-display text-xl font-bold"
                style={{
                  borderColor: `${step.color}30`,
                  backgroundColor: `${step.color}10`,
                  color: step.color,
                }}
              >
                0{index + 1}
              </div>
              <div className="h-[2px] w-8 bg-gradient-to-r from-brand-teal/40 to-transparent" />
              {/* Icon badge */}
              <motion.div
                className="ml-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Icon className="h-5 w-5" style={{ color: step.color }} />
              </motion.div>
            </div>

            <h3 className="font-display text-3xl text-brand-text">{step.title}</h3>
            <p className="mt-4 text-lg leading-8 text-slate-300">{step.description}</p>

            {/* Animated progress hint bar */}
            <div className="mt-6 h-px overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }}
                initial={{ width: '0%' }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          {/* Large watermark number */}
          <div className="absolute -bottom-8 -right-4 select-none pointer-events-none text-[120px] md:text-[180px] font-display font-bold leading-none text-slate-200/[0.04]">
            {index + 1}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
