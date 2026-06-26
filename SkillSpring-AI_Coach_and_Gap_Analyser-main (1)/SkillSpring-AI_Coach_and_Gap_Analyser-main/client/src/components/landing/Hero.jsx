import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useInView, animate } from 'framer-motion';
import { ArrowRight, PlayCircle, ChevronDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const headline = 'Your skills, mapped to your future.'.split(' ');

const floatingSkills = [
  { label: 'React', delay: 0.2, x: '8%', y: '22%', driftX: 12, driftY: -8 },
  { label: 'TypeScript', delay: 0.6, x: '76%', y: '18%', driftX: -10, driftY: 10 },
  { label: 'System Design', delay: 1.0, x: '84%', y: '62%', driftX: -14, driftY: -6 },
  { label: 'Testing', delay: 0.4, x: '4%', y: '68%', driftX: 8, driftY: 12 },
  { label: 'Node.js', delay: 0.8, x: '38%', y: '90%', driftX: 6, driftY: -10 },
  { label: 'CSS / UI', delay: 1.3, x: '58%', y: '6%', driftX: -8, driftY: 8 },
];

function FloatingSkillTag({ label, delay, x, y, driftX, driftY, shouldReduceMotion }) {
  return (
    <motion.div
      className="absolute hidden xl:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-400 backdrop-blur-sm select-none pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={
        shouldReduceMotion
          ? { opacity: 0.55, scale: 1 }
          : {
              opacity: [0, 0.55, 0.4, 0.55],
              scale: 1,
              x: [0, driftX, driftX * 0.4, 0],
              y: [0, driftY, driftY * 0.6, 0],
            }
      }
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        x: { duration: 9, delay: delay + 0.8, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: 9, delay: delay + 0.8, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-brand-teal"
        animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
        transition={{ duration: 2.5, delay: delay + 1, repeat: Infinity }}
      />
      {label}
    </motion.div>
  );
}

function GridOverlay() {
  return (
    <div
      className="absolute inset-0 z-0 opacity-[0.035]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }}
      aria-hidden="true"
    />
  );
}

function HeroStat({ value, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, value, {
      duration: 1.5,
      delay: 0.3,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="surface-panel group relative overflow-hidden rounded-3xl p-4 transition-all duration-300 hover:border-brand-teal/20">
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse at center, rgba(45,212,191,0.05), transparent 70%)' }}
      />
      <p className="font-display text-3xl text-brand-text">{display}</p>
      <p className="mt-1 text-sm uppercase tracking-[0.24em] text-brand-muted">{label}</p>
    </div>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const particles = [];
    const count = 65;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: Math.random() * 1.8 + 0.4,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let frameId = 0;
    let tick = 0;

    const draw = () => {
      tick += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, sourceIndex) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const alpha = 0.35 + 0.3 * Math.sin(tick + particle.phase);
        ctx.beginPath();
        ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`;
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        particles.slice(sourceIndex + 1).forEach((target) => {
          const dx = particle.x - target.x;
          const dy = particle.y - target.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.09 - distance / 1600})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });

      frameId = window.requestAnimationFrame(draw);
    };

    frameId = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [shouldReduceMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60" aria-hidden="true" />;
}

export default function Hero() {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 140]), {
    stiffness: 90,
    damping: 22,
    mass: 0.35,
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.18]);
  const previewY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -40]), {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });
  const previewRotate = useTransform(scrollYProgress, [0, 1], [0, -7]);
  const previewScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const { user } = useUser();
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      ref={sectionRef}
      className="section-shell hero-shell relative flex min-h-[100svh] items-center justify-center pb-12 pt-8"
    >
      <ParticleCanvas />
      <GridOverlay />
      <div className="noise-overlay opacity-30" />

      {/* Floating skill chips */}
      {floatingSkills.map((skill) => (
        <FloatingSkillTag key={skill.label} {...skill} shouldReduceMotion={shouldReduceMotion} />
      ))}

      {/* Ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-5%,rgba(45,212,191,0.07),transparent)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(124,58,237,0.06),transparent)]" />

      <motion.div
        className="hero-blob left-[4%] top-[10%] h-48 w-48 sm:h-64 sm:w-64 bg-brand-teal/35"
        animate={shouldReduceMotion ? undefined : { x: [0, 35, -10, 0], y: [0, -20, 25, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-blob right-[8%] top-[12%] h-56 w-56 sm:h-72 sm:w-72 bg-brand-violet/35"
        animate={shouldReduceMotion ? undefined : { x: [0, -25, 18, 0], y: [0, 24, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-blob bottom-[8%] left-1/2 h-64 w-64 sm:h-80 sm:w-80 -translate-x-1/2 bg-brand-indigo/25"
        animate={shouldReduceMotion ? undefined : { scale: [1, 1.08, 0.95, 1], y: [0, -18, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col">
        {/* Nav bar */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-teal via-cyan-200 to-brand-indigo shadow-teal"
              animate={shouldReduceMotion ? undefined : { rotate: [0, 6, -4, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div>
              <p className="font-display text-lg text-brand-text">SkillSpring</p>
              <p className="text-xs uppercase tracking-[0.28em] text-brand-muted">AI Growth Tracker</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live learners count */}
            <motion.div
              className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-brand-muted backdrop-blur-sm"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-brand-teal"
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              2,847 learning today
            </motion.div>
            <Badge tone="violet">{user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Local dev mode active'}</Badge>
          </div>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div className="max-w-3xl" style={{ y: contentY, opacity: contentOpacity }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.09 } },
              }}
              className="mb-6 flex flex-wrap gap-2"
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
              >
                <Badge tone="teal">
                  <Sparkles className="mr-1 inline h-3 w-3" />
                  AI-powered skill mapping
                </Badge>
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
              >
                <Badge tone="indigo">Gap analysis + live roadmap</Badge>
              </motion.div>
            </motion.div>

            <h1 className="font-display text-5xl leading-[0.98] text-brand-text sm:text-6xl lg:text-7xl">
              {headline.map((word, index) => (
                <motion.span
                  key={word}
                  className="mr-4 inline-block bg-gradient-to-r from-brand-text via-slate-700 to-slate-500 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.12 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Animated accent underline */}
            <motion.div
              className="mt-3 h-[2px] rounded-full bg-gradient-to-r from-brand-teal via-brand-violet to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '55%', opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.p
              className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              AI-powered gap analysis and personalized roadmaps for students who want to get
              hired, not just graduate.
            </motion.p>

            <motion.div
              className="mt-12 flex flex-col gap-5 sm:flex-row"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <button
                onClick={() => navigate(user ? '/dashboard' : '/signup')}
                className="button-shimmer relative min-w-[240px] rounded-2xl bg-brand-teal px-8 py-4 font-bold text-white shadow-xl shadow-brand-teal/20 transition-all hover:scale-[1.03] active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 !text-slate-900">
                  {user ? 'Go to Dashboard' : 'Join SkillSpring'} <ArrowRight className="h-5 w-5" />
                </span>
              </button>
              <button
                onClick={scrollToHowItWorks}
                className="group min-w-[240px] rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-brand-text transition-all hover:bg-white/10 hover:border-white/20"
              >
                <span className="flex items-center justify-center gap-3">
                  <PlayCircle className="h-5 w-5 transition-transform group-hover:scale-110" /> Watch Demo
                </span>
              </button>
            </motion.div>

            <motion.div
              className="mt-10 grid gap-4 sm:grid-cols-3"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95 }}
            >
              {[
                [24, 'skills tracked'],
                [6, 'gaps surfaced'],
                [3, 'learning paths ready'],
              ].map(([value, label]) => (
                <HeroStat key={label} value={value} label={label} />
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              y: previewY,
              rotateZ: previewRotate,
              scale: previewScale,
              transformPerspective: 1400,
            }}
          >
            <div className="absolute inset-6 rounded-[36px] bg-gradient-to-br from-brand-violet/25 via-transparent to-brand-teal/20 blur-3xl" />

            {/* Animated ambient glow ring */}
            <motion.div
              className="absolute -inset-px rounded-[38px]"
              style={{
                background: 'linear-gradient(135deg, rgba(45,212,191,0.25), rgba(124,58,237,0.25), rgba(45,212,191,0.1))',
                backgroundSize: '200% 200%',
              }}
              animate={shouldReduceMotion ? undefined : {
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="surface-panel dashboard-grid relative overflow-hidden rounded-[36px] border border-white/10 p-6 shadow-glow">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-gradient-to-bl from-brand-violet/10 to-transparent" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs uppercase tracking-[0.28em] text-brand-muted">
                      Readiness Engine
                    </p>
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-brand-teal"
                      animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  </div>
                  <h2 className="mt-2 font-display text-2xl text-brand-text">Frontend Developer</h2>
                </div>
                <Badge tone="teal">84% aligned</Badge>
              </div>

              <div className="grid gap-4 pt-5">
                <div className="surface-panel rounded-3xl p-5 border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Top skill delta</p>
                      <p className="mt-2 font-display text-lg text-brand-text">Testing + Architecture</p>
                    </div>
                    <div className="rounded-full border border-brand-violet/20 bg-brand-violet/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-violet">
                      Priority
                    </div>
                  </div>
                  <div className="mt-6 h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-teal proficiency-shimmer"
                      initial={{ width: 0 }}
                      animate={{ width: '74%' }}
                      transition={{ duration: 1.4, delay: 1.2, ease: 'circOut' }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-brand-muted">
                    <span>0%</span>
                    <motion.span
                      className="text-brand-teal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.7 }}
                    >
                      74%
                    </motion.span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="surface-panel rounded-3xl p-4">
                    <p className="text-sm text-brand-muted">Weekly roadmap</p>
                    <div className="mt-4 space-y-3">
                      {['Ship one React metrics widget', 'Practice component testing', 'Review accessibility gaps'].map(
                        (item, index) => (
                          <motion.div
                            key={item}
                            className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-3 py-2"
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 + index * 0.12 }}
                          >
                            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-teal" />
                            <span className="text-sm text-slate-700">{item}</span>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="surface-panel rounded-3xl p-4">
                    <p className="text-sm text-brand-muted">AI coach pulse</p>
                    <div className="mt-4 space-y-4">
                      <motion.div
                        className="rounded-2xl bg-brand-indigo/10 p-3 text-sm text-indigo-700"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 }}
                      >
                        You are strongest in React and UI polish. Let&apos;s close testing and state
                        management next.
                      </motion.div>
                      <motion.div
                        className="rounded-2xl bg-white/5 p-3 text-sm text-slate-200"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 }}
                      >
                        Suggested first step: build one feature with Vitest and document tradeoffs.
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.button
          type="button"
          onClick={scrollToHowItWorks}
          className="mx-auto mt-10 flex flex-col items-center gap-2 text-brand-muted"
          animate={shouldReduceMotion ? undefined : { y: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          style={{ opacity: scrollHintOpacity }}
          aria-label="Scroll to how it works"
        >
          <span className="text-xs uppercase tracking-[0.35em]">Scroll</span>
          <ChevronDown className="h-6 w-6" />
        </motion.button>
      </div>
    </section>
  );
}
