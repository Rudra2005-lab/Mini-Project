import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const floatingParticles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: `${8 + (i * 7) % 85}%`,
  y: `${10 + (i * 13) % 80}%`,
  size: 2 + (i % 3),
  delay: i * 0.22,
  duration: 4 + (i % 4),
}));

export default function CTASection() {
  const ref = useRef(null);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [-20, 30]);

  return (
    <section ref={ref} className="section-shell pb-24 pt-8 md:pb-32">
      <motion.div
        {...useScrollAnimation('blurReveal')}
        className="surface-panel relative mx-auto max-w-6xl overflow-hidden rounded-[40px] border border-white/10 px-6 py-16 text-center shadow-glow md:px-10"
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-brand-teal/12 via-brand-violet/12 to-brand-indigo/12"
          animate={shouldReduceMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ backgroundSize: '200% 200%', y: backgroundY }}
        />

        {/* Animated glow border */}
        <motion.div
          className="absolute inset-0 rounded-[40px]"
          style={{
            background: 'linear-gradient(135deg, rgba(45,212,191,0.15), transparent 40%, rgba(124,58,237,0.15) 80%, transparent)',
            backgroundSize: '300% 300%',
          }}
          animate={shouldReduceMotion ? undefined : {
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] rounded-[40px]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />

        {/* Floating ambient orbs */}
        <motion.div
          className="absolute left-[10%] top-[15%] h-28 w-28 rounded-full bg-brand-teal/10 blur-2xl"
          animate={shouldReduceMotion ? undefined : { x: [0, 16, -8, 0], y: [0, -12, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[10%] h-36 w-36 rounded-full bg-brand-violet/10 blur-2xl"
          animate={shouldReduceMotion ? undefined : { x: [0, -18, 10, 0], y: [0, 14, -8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating particles */}
        {!shouldReduceMotion && floatingParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/20 pointer-events-none"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
            animate={{
              y: [0, -16, 8, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        <div className="relative z-10 mx-auto max-w-3xl">
          {/* Top label */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-brand-teal/20 bg-brand-teal/5 px-4 py-1.5 text-sm uppercase tracking-[0.34em] text-brand-teal"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ready To Start
          </motion.div>

          <motion.h2
            className="mt-5 font-display text-4xl text-brand-text md:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Start mapping your future, today.
          </motion.h2>

          {/* Animated accent line */}
          <motion.div
            className="mx-auto mt-4 h-px rounded-full bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent"
            initial={{ width: '0%', opacity: 0 }}
            whileInView={{ width: '60%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Start your journey today. Just skills, gaps, and a roadmap that makes your next move obvious.
          </motion.p>

          {/* Social proof micro-stat */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-6 text-sm text-brand-muted"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {[
              ['2,847', 'learners active'],
              ['94%', 'report clearer goals'],
              ['Free', 'to get started'],
            ].map(([val, label]) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span className="font-display text-lg text-brand-text">{val}</span>
                <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Button className="mt-10" size="lg" onClick={() => navigate('/signup')}>
              Sign Up Now <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
