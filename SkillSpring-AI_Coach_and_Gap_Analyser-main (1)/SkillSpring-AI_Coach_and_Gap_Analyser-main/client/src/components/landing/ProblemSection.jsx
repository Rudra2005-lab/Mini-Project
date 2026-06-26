import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionValue, useScroll, useTransform, useSpring } from 'framer-motion';
import { Search, Compass, TrendingDown } from 'lucide-react';
import Card from '../ui/Card';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const cards = [
  {
    title: 'Blind Spots',
    description:
      "73% of students can't articulate which skills they're missing for their target role.",
    value: 73,
    suffix: '%',
    icon: Search,
    sparkData: [38, 48, 54, 59, 64, 69, 73],
    color: '#2DD4BF',
    trend: '+12% this year',
  },
  {
    title: 'No Direction',
    description:
      "Generic advice doesn't map to specific careers. Students waste months on the wrong things.",
    value: 5,
    suffix: ' mo',
    icon: Compass,
    sparkData: [1.5, 2.2, 2.8, 3.4, 3.9, 4.5, 5],
    color: '#7C3AED',
    trend: '↑ avg wasted',
  },
  {
    title: 'Missed Opportunities',
    description:
      'Employers reject candidates not for lack of talent, but for lack of visible, structured skills.',
    value: 61,
    suffix: '%',
    icon: TrendingDown,
    sparkData: [28, 35, 42, 49, 54, 58, 61],
    color: '#6366F1',
    trend: 'rejection rate',
  },
];

function MiniSparkline({ values, color, inView }) {
  const w = 110;
  const h = 36;
  const pad = 4;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const pts = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPts = `${pad},${h} ${pts} ${w - pad},${h}`;
  const gradId = `spark-${color.replace('#', '')}`;

  return (
    <svg width={w} height={h} className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        points={areaPts}
        fill={`url(#${gradId})`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />
      <motion.polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* End dot */}
      {inView && (
        <motion.circle
          cx={w - pad}
          cy={h - pad - ((values[values.length - 1] - min) / range) * (h - pad * 2)}
          r="3"
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        />
      )}
    </svg>
  );
}

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;

    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, motionValue, value]);

  return (
    <span ref={ref} className="font-display text-5xl text-white">
      {display}
      {suffix}
    </span>
  );
}

export default function ProblemSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const animation = useScrollAnimation('staggerContainer');

  return (
    <section ref={sectionRef} className="section-shell relative py-24 md:py-32 overflow-hidden">
      {/* Radial background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />
      {/* Background glow orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-brand-teal/5 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-brand-violet/5 blur-[100px]" />

      <motion.div className="mx-auto max-w-7xl" {...animation}>
        <motion.div {...useScrollAnimation('fadeUp')} className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.32em] text-brand-teal">The Problem</p>
          <h2 className="mt-4 font-display text-4xl text-white md:text-5xl">
            Students are talented, but the signal is scattered.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Most learners are building skills in the dark. They know they want the role, but not
            the exact gaps standing between them and a confident application.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {cards.map((card, index) => (
            <ProblemCard key={card.title} card={card} index={index} progress={scrollYProgress} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ProblemCard({ card, index, progress }) {
  const Icon = card.icon;
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: '-60px' });

  const rotateX = useSpring(useTransform(progress, [0, 0.5, 1], [index === 0 ? 10 : 0, 0, index === 2 ? -10 : 0]), {
    stiffness: 100, damping: 30,
  });
  const rotateY = useSpring(useTransform(progress, [0, 0.5, 1], [index === 0 ? -8 : 0, 0, index === 2 ? 8 : 0]), {
    stiffness: 100, damping: 30,
  });

  return (
    <motion.div
      ref={cardRef}
      {...useScrollAnimation('scaleIn')}
      whileHover={{ y: -10, scale: 1.02, rotateX: 5, rotateY: -4 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      style={{ transformPerspective: 1200, rotateX, rotateY }}
    >
      <Card
        className="group relative h-full overflow-hidden p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-violet/70"
        glow
      >
        {/* Animated corner glow */}
        <motion.div
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${card.color}20, transparent 70%)` }}
        />

        <div className="stat-glow" />
        <div className="relative z-10">
          <div className="mb-6 inline-flex rounded-2xl border border-white/10 bg-white/5 p-3">
            <Icon className="h-6 w-6 text-brand-teal" />
          </div>
          <Counter value={card.value} suffix={card.suffix} />

          {/* Sparkline + trend */}
          <div className="mt-4 flex items-end justify-between">
            <MiniSparkline values={card.sparkData} color={card.color} inView={inView} />
            <motion.span
              className="text-xs text-brand-muted"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.4 }}
            >
              {card.trend}
            </motion.span>
          </div>

          <h3 className="mt-4 text-2xl font-semibold text-brand-text">{card.title}</h3>
          <p className="mt-3 leading-7 text-slate-300">{card.description}</p>
        </div>

        {/* Bottom gradient bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${card.color}60, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        />
      </Card>
    </motion.div>
  );
}
