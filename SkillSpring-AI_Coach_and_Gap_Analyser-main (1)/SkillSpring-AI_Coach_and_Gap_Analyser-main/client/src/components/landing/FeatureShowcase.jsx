import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Map, ChartColumnBig, Bot, Activity } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const features = [
  {
    icon: Map,
    title: 'Skill Mapper',
    description: 'Upload a resume or add skills manually to generate a visual radar snapshot.',
  },
  {
    icon: ChartColumnBig,
    title: 'Gap Analyzer',
    description: 'Compare your current profile with role requirements in real time.',
  },
  {
    icon: Bot,
    title: 'AI Coach',
    description: 'Ask focused questions and get role-aware advice grounded in your actual gaps.',
  },
  {
    icon: Activity,
    title: 'Progress Tracker',
    description: 'Monitor streaks, milestones, and steady growth week after week.',
  },
];

export default function FeatureShowcase() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateScrollRange = () => {
      if (containerRef.current && containerRef.current.parentElement) {
        const parentW = containerRef.current.parentElement.offsetWidth;
        const childW = containerRef.current.scrollWidth;
        setScrollRange(Math.max(0, childW - parentW + 48));
      }
    };
    updateScrollRange();
    window.addEventListener('resize', updateScrollRange);
    return () => window.removeEventListener('resize', updateScrollRange);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  const smoothX = useSpring(x, { stiffness: 100, damping: 24, mass: 0.32 });
  const washShift = useTransform(scrollYProgress, [0, 1], ['0% 0%', '100% 100%']);

  // Update active dot indicator based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setActiveIndex(Math.round(v * (features.length - 1)));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="section-shell h-[240vh] py-20">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            className="pointer-events-none absolute inset-x-6 top-20 h-[72vh] rounded-[44px] bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.1),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.1),transparent_28%)]"
            style={{ backgroundPosition: washShift }}
          />

          <motion.div {...useScrollAnimation('fadeUp')} className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.32em] text-brand-teal">Feature Showcase</p>
            <h2 className="mt-4 font-display text-4xl text-brand-text md:text-5xl">
              A scroll story that turns career ambiguity into visible action.
            </h2>
          </motion.div>

          {/* Scroll progress dots */}
          <div className="mb-6 flex items-center gap-2">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="rounded-full bg-white/20 transition-all duration-300"
                animate={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8,
                  backgroundColor: i === activeIndex ? 'rgba(45,212,191,0.9)' : 'rgba(255,255,255,0.2)',
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
            <span className="ml-2 text-xs text-brand-muted">
              {activeIndex + 1} / {features.length}
            </span>
          </div>

          <motion.div
            ref={containerRef}
            style={{ x: smoothX }}
            className="flex w-max gap-6 will-change-transform"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -12, rotateY: -5, rotateX: 4 }}
                  transition={{ type: 'spring', stiffness: 170, damping: 18 }}
                  style={{ transformPerspective: 1400 }}
                >
                  <Card
                    className="surface-panel relative min-h-[440px] min-w-[88vw] overflow-hidden p-8 md:min-w-[46vw] lg:min-w-[36vw]"
                    glow
                  >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-brand-violet/10" />

                    {/* Large watermark number */}
                    <div className="absolute -right-4 -top-6 select-none pointer-events-none font-display text-[160px] font-bold leading-none text-white/[0.03]">
                      {index + 1}
                    </div>

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-center justify-between">
                        <Badge tone={index % 2 === 0 ? 'teal' : 'violet'}>
                          {index + 1}. {feature.title}
                        </Badge>
                        {/* Animated status dot */}
                        <motion.div
                          className="flex items-center gap-1.5 text-xs text-brand-muted"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
                          Live
                        </motion.div>
                      </div>

                      <div className="mt-8 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/80 shadow-sm">
                        <Icon className="h-8 w-8 text-brand-teal" />
                      </div>
                      <h3 className="mt-10 font-display text-3xl text-brand-text">{feature.title}</h3>
                      <p className="mt-5 max-w-md text-lg leading-8 text-slate-300">
                        {feature.description}
                      </p>

                      <div className="mt-auto rounded-[28px] border border-white/10 bg-black/20 p-5">
                        {index === 0 && (
                          <div className="space-y-3">
                            <p className="text-xs uppercase tracking-[0.22em] text-brand-muted mb-4">Axis confidence</p>
                            <div className="grid gap-3 sm:grid-cols-3">
                              {[
                                { val: 92, label: 'Technical' },
                                { val: 74, label: 'Comms' },
                                { val: 65, label: 'Leadership' },
                              ].map(({ val, label }) => (
                                <div key={val} className="rounded-2xl bg-white/5 p-4">
                                  <p className="font-display text-2xl text-brand-text">{val}%</p>
                                  <p className="mt-1 text-xs text-brand-muted">{label}</p>
                                  <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                                    <motion.div
                                      className="h-full rounded-full bg-brand-teal"
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${val}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 0.8, delay: 0.2 }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {index === 1 && (
                          <div className="space-y-4">
                            {[
                              ['Problem solving', 'Strong', '#2DD4BF', 88],
                              ['Testing', 'Needs work', '#F59E0B', 52],
                              ['Architecture', 'Gap detected', '#EF4444', 34],
                            ].map(([label, state, color, pct]) => (
                              <div key={label}>
                                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                                  <span className="text-sm text-slate-200">{label}</span>
                                  <span className="text-xs" style={{ color }}>{state}</span>
                                </div>
                                <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: color }}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${pct}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: 0.1 }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {index === 2 && (
                          <div className="space-y-3">
                            <div className="rounded-2xl bg-brand-indigo/10 p-4 text-sm text-indigo-700">
                              What should I learn first for frontend interviews?
                            </div>
                            <motion.div
                              className="rounded-2xl bg-white/5 p-4 text-sm text-slate-700"
                              animate={{ opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              Start with testing strategy, component architecture, and browser
                              rendering fundamentals.
                            </motion.div>
                            <div className="flex items-center gap-1.5 text-xs text-brand-teal">
                              <motion.span
                                className="h-1.5 w-1.5 rounded-full bg-brand-teal"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                              AI is thinking...
                            </div>
                          </div>
                        )}
                        {index === 3 && (
                          <div>
                            <div className="mb-3 flex items-center justify-between text-xs text-brand-muted">
                              <span>Activity — last 4 weeks</span>
                              <span className="text-brand-teal">↑ 24% streak</span>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-7">
                              {Array.from({ length: 28 }).map((_, gridIndex) => (
                                <motion.div
                                  key={gridIndex}
                                  className={`h-8 rounded-md ${
                                    gridIndex % 5 === 0
                                      ? 'bg-brand-teal/80'
                                      : gridIndex % 3 === 0
                                        ? 'bg-brand-indigo/60'
                                        : 'bg-white/5'
                                  }`}
                                  initial={{ scaleY: 0, opacity: 0 }}
                                  whileInView={{ scaleY: 1, opacity: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.3, delay: gridIndex * 0.02 }}
                                  style={{ transformOrigin: 'bottom' }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
