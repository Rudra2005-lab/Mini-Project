import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView } from 'framer-motion';
import Card from '../ui/Card';

function AnimatedValue({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(value);

  // Detect whether the value is purely numeric or contains text like "5d", "84%"
  const numericMatch = String(value).match(/^(\d+)/);
  const numericPart = numericMatch ? Number(numericMatch[1]) : null;
  const suffix = numericMatch ? String(value).slice(numericMatch[0].length) : '';

  useEffect(() => {
    if (!inView || numericPart === null) {
      setDisplay(value);
      return undefined;
    }

    const controls = animate(0, numericPart, {
      duration: 1.1,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(`${Math.round(latest)}${suffix}`),
    });

    return () => controls.stop();
  }, [inView, numericPart, suffix, value]);

  return <span ref={ref}>{display}</span>;
}

export default function ProgressCard({ label, value, helper, tone = 'teal' }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const toneMap = {
    teal: 'from-brand-teal/15 text-brand-teal',
    violet: 'from-brand-violet/15 text-brand-violet',
    indigo: 'from-brand-indigo/15 text-brand-indigo',
  };

  const accentMap = {
    teal: 'bg-brand-teal',
    violet: 'bg-brand-violet',
    indigo: 'bg-brand-indigo',
  };

  const colorMap = {
    teal: '#0f766e',
    violet: '#7c3aed',
    indigo: '#2563eb',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 240, damping: 22, mass: 0.7 }}
    >
      <Card 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="glass-card-hover group relative overflow-hidden p-6"
      >
        {/* Mouse follow shimmer */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${colorMap[tone]}15, transparent 80%)`
          }}
        />
        
        <div className={`absolute inset-0 bg-gradient-to-br ${toneMap[tone]} to-transparent opacity-40`} />
        
        <motion.div
          className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${accentMap[tone]} opacity-[0.08]`}
          animate={{ 
            scale: [1, 1.35, 1],
            x: [0, 10, 0],
            y: [0, -10, 0],
            opacity: [0.08, 0.14, 0.08],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">{label}</p>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="font-display text-5xl font-bold tracking-tight text-brand-text">
              <AnimatedValue value={value} />
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 font-medium">{helper}</p>
        </div>
      </Card>
    </motion.div>
  );
}
