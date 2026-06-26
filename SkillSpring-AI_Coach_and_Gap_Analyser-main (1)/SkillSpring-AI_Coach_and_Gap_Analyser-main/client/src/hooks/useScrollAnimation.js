import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  blurReveal,
  fadeUp,
  floatIn,
  popIn,
  rollUp,
  scaleIn,
  slideLeft,
  slideRight,
  splitReveal,
  staggerContainer,
} from '../animations/variants';

const variantMap = {
  fadeUp,
  scaleIn,
  slideLeft,
  slideRight,
  blurReveal,
  staggerContainer,
  popIn,
  floatIn,
  splitReveal,
  rollUp,
};

export function useScrollAnimation(variant = 'fadeUp') {
  const shouldReduceMotion = useReducedMotion();

  return useMemo(() => {
    const selected = variantMap[variant] ?? fadeUp;

    if (shouldReduceMotion) {
      return {
        initial: false,
        animate: { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)', clipPath: 'inset(0 0% 0 0)' },
      };
    }

    return {
      initial: 'hidden',
      whileInView: 'visible',
      viewport: { once: true, margin: '-72px' },
      variants: selected,
    };
  }, [shouldReduceMotion, variant]);
}
