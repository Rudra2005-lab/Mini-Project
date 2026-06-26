import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Hero from '../components/landing/Hero';
import ProblemSection from '../components/landing/ProblemSection';
import SolutionSection from '../components/landing/SolutionSection';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import HowItWorks from '../components/landing/HowItWorks';
import DashboardPreview from '../components/landing/DashboardPreview';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.25 });
  const auraY = useSpring(useTransform(scrollYProgress, [0, 1], [-40, 220]), {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
  });
  const auraScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  // Parallax background icon positions
  const iconY1 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const iconY2 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const iconY3 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const iconY4 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const secondaryY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -180]), {
    stiffness: 70,
    damping: 24,
    mass: 0.45,
  });

  return (
    <main className="relative overflow-x-clip bg-brand-bg">
      <motion.div className="page-progress" style={{ scaleX: progress }} />
      <motion.div className="landing-aura" style={{ y: auraY, scale: auraScale }} />
      <motion.div
        className="landing-aura landing-aura-secondary"
        style={{ y: secondaryY, scale: auraScale }}
      />

      {/* Parallax Background Icons */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div style={{ y: iconY1 }} className="absolute left-[10%] top-[40%] text-brand-teal/10 rotate-12">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20M2 12h20" />
          </svg>
        </motion.div>
        <motion.div style={{ y: iconY3 }} className="absolute right-[12%] top-[60%] text-brand-violet/10 -rotate-12">
          <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </motion.div>
        <motion.div style={{ y: iconY2 }} className="absolute left-[8%] top-[85%] text-brand-indigo/10 rotate-45">
          <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="m18 8-4-4-4 4M2 12h12" />
            <path d="m14 16 4-4-4-4" />
          </svg>
        </motion.div>
        <motion.div style={{ y: iconY4 }} className="absolute right-[5%] top-[110%] text-brand-teal/8 rotate-[30deg]">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </motion.div>
      </div>

      <div className="relative z-10">
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <FeatureShowcase />
        <HowItWorks />
        <DashboardPreview />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
