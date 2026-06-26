// The expo ease — feels buttery and premium
const expo = [0.16, 1, 0.3, 1];
// Spring-like ease for snappy but controlled motion
const snappy = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: expo },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.88, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: snappy },
  },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -56 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: expo },
  },
};

export const slideRight = {
  hidden: { opacity: 0, x: 56 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: expo },
  },
};

export const blurReveal = {
  hidden: { opacity: 0, filter: 'blur(18px)', y: 20 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.85, ease: snappy },
  },
};

// Spring bounce in — used for cards and action elements
export const popIn = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 22,
      mass: 0.6,
    },
  },
};

// Subtle upward float with a slight blur — great for hero text blocks
export const floatIn = {
  hidden: { opacity: 0, y: 48, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: expo },
  },
};

// Clip-path reveal — text and panel headings
export const splitReveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: { duration: 0.9, ease: expo },
  },
};

// Roll up — list items and milestone rows
export const rollUp = {
  hidden: { opacity: 0, y: 18, rotateX: -12 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5, ease: snappy },
  },
};
