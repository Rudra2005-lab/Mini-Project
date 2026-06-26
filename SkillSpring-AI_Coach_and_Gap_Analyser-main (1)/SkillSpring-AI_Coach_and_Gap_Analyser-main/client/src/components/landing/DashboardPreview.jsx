import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const previewStats = [
  { label: 'Skills Tracked', value: 24, trend: '+3 this week', up: true },
  { label: 'Gaps Identified', value: 6, trend: '−2 closed', up: true },
  { label: 'Paths Generated', value: 3, trend: 'Active now', up: null },
];

const sparkData = [8, 12, 10, 18, 14, 20, 24];

function MiniSparkline({ data, color = '#2DD4BF', inView }) {
  const w = 80;
  const h = 28;
  const pad = 2;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const pts = data
    .map((v, i) => {
      const px = pad + (i / (data.length - 1)) * (w - pad * 2);
      const py = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${px},${py}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} className="overflow-visible opacity-80" aria-hidden="true">
      <motion.polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </svg>
  );
}

function AnimatedStat({ label, value, trend, up }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;

    const controls = animate(0, value, {
      duration: 1.1,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="group relative rounded-[28px] border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-brand-teal/20 hover:bg-white/8">
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse at center, rgba(45,212,191,0.05), transparent 70%)' }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-display text-4xl text-white">{display}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.24em] text-brand-muted">{label}</p>
        </div>
        <MiniSparkline data={sparkData} inView={inView} />
      </div>
      {trend && (
        <motion.div
          className="mt-3 flex items-center gap-1.5 text-xs"
          initial={{ opacity: 0, y: 4 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
        >
          {up !== null && (
            <span className={up ? 'text-brand-teal' : 'text-rose-400'}>
              {up ? '↑' : '↓'}
            </span>
          )}
          <span className="text-brand-muted">{trend}</span>
        </motion.div>
      )}
    </div>
  );
}

export default function DashboardPreview() {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 20%'],
  });
  const previewY = useSpring(useTransform(scrollYProgress, [0, 1], [90, 0]), {
    stiffness: 90,
    damping: 24,
    mass: 0.38,
  });
  const previewScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const previewRotate = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const previewOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);

  return (
    <section ref={sectionRef} className="section-shell py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div {...useScrollAnimation('fadeUp')} className="max-w-2xl">
          <div className="flex items-center gap-3">
            <p className="text-sm uppercase tracking-[0.32em] text-brand-teal">Dashboard Preview</p>
            {/* Live badge */}
            <motion.div
              className="flex items-center gap-1.5 rounded-full border border-brand-teal/20 bg-brand-teal/5 px-2 py-0.5 text-xs text-brand-teal"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-brand-teal"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              Live
            </motion.div>
          </div>
          <h2 className="mt-4 font-display text-4xl text-brand-text md:text-5xl">
            A command center that feels alive the moment you open it.
          </h2>
        </motion.div>

        <motion.div
          {...useScrollAnimation('blurReveal')}
          className="surface-panel relative mt-14 overflow-hidden rounded-[40px] border border-white/10 p-6 shadow-glow md:p-8"
          style={{
            y: previewY,
            opacity: previewOpacity,
            scale: previewScale,
            rotateX: previewRotate,
            transformPerspective: 1400,
          }}
        >
          <div className="absolute -right-14 top-10 h-32 w-32 rounded-full bg-brand-violet/20 blur-3xl" />
          <div className="absolute bottom-8 left-0 h-44 w-44 rounded-full bg-brand-teal/15 blur-3xl" />

          <div className="grid gap-6 lg:grid-cols-[0.65fr_0.35fr]">
            <div className="space-y-6">
              {/* Header row */}
              <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-black/20 px-5 py-4">
                <div>
                  <p className="text-sm text-brand-muted">Readiness snapshot</p>
                  <h3 className="mt-1 font-display text-3xl text-brand-text">Frontend Developer</h3>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge tone="teal">84% ready</Badge>
                  <motion.span
                    className="text-xs text-brand-muted"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Updated just now
                  </motion.span>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[0.56fr_0.44fr]">
                <Card className="p-6">
                  <p className="text-sm text-brand-muted">Skill radar</p>
                  <div className="relative mt-6 flex h-72 items-center justify-center">
                    {[230, 180, 130].map((size) => (
                      <div
                        key={size}
                        className="radial-outline"
                        style={{ width: size, height: size }}
                      />
                    ))}
                    <svg viewBox="0 0 280 280" className="h-[240px] w-[240px]">
                      {/* Pulse ring */}
                      <motion.circle
                        cx="140" cy="140" r="80"
                        fill="none"
                        stroke="rgba(45,212,191,0.1)"
                        strokeWidth="60"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                      />
                      <polygon
                        points="140,28 222,82 232,180 140,240 48,180 58,82"
                        fill="rgba(45,212,191,0.12)"
                        stroke="rgba(45,212,191,0.9)"
                        strokeWidth="2"
                      />
                      {/* Vertex dots */}
                      {[[140,28],[222,82],[232,180],[140,240],[48,180],[58,82]].map(([cx,cy], i) => (
                        <motion.circle
                          key={i}
                          cx={cx} cy={cy} r="4"
                          fill="#2DD4BF"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        />
                      ))}
                    </svg>
                  </div>
                </Card>

                <Card className="p-6">
                  <p className="text-sm text-brand-muted">This week&apos;s roadmap</p>
                  <div className="mt-5 space-y-3">
                    {['Refactor a dashboard widget', 'Add tests for async state', 'Review HTML semantics'].map(
                      (item, index) => (
                        <motion.div
                          key={item}
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-700"
                          initial={{ opacity: 0, x: 12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 4 }}
                        >
                          <span className="h-2 w-2 shrink-0 rounded-full bg-brand-teal/60" />
                          Week {index + 1}: {item}
                        </motion.div>
                      )
                    )}
                  </div>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {previewStats.map((stat) => (
                  <AnimatedStat key={stat.label} {...stat} />
                ))}
              </div>

              <Card className="relative p-6">
                <p className="text-sm text-brand-muted">AI Coach</p>
                <motion.div
                  className="mt-5 rounded-3xl bg-brand-indigo/10 p-4 text-sm leading-7 text-indigo-700"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  Your quickest path to improvement is closing testing and architecture gaps with one
                  focused project.
                </motion.div>

                {/* Typing indicator */}
                <motion.div
                  className="mt-3 flex items-center gap-1.5 px-1"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  {[0, 0.15, 0.3].map((delay) => (
                    <motion.span
                      key={delay}
                      className="h-1.5 w-1.5 rounded-full bg-brand-muted"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, delay, repeat: Infinity }}
                    />
                  ))}
                </motion.div>

                <motion.div
                  className="absolute -left-3 top-8 rounded-full border border-brand-teal/40 bg-white px-3 py-1 text-xs text-brand-teal"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: 0.8 }}
                >
                  Gap priority
                </motion.div>
                <motion.div
                  className="absolute -right-3 bottom-12 rounded-full border border-brand-violet/40 bg-white px-3 py-1 text-xs text-violet-700"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: 1 }}
                >
                  Next milestone
                </motion.div>
              </Card>

              <Button className="w-full" onClick={() => navigate('/dashboard')}>
                Launch Dashboard
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
