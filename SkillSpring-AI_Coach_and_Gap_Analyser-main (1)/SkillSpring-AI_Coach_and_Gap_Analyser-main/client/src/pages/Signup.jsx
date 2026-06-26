import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, User } from 'lucide-react';
import { useUser } from '../context/UserContext';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { user, loginUser } = useUser();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSignup = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-brand-bg px-6 py-12">
      <motion.div
        className="landing-aura orb-float"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="landing-aura landing-aura-secondary orb-float"
        style={{ animationDelay: '-6s', transform: 'translateY(100px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.2 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card relative z-10 w-full max-w-md rounded-3xl p-8"
      >
        <motion.div
          className="mb-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Link to="/" className="inline-block">
              <motion.h1
                className="font-display text-4xl text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-brand-teal"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                SkillSpring
              </motion.h1>
            </Link>
          </motion.div>
          <motion.p variants={itemVariants} className="mt-3 text-brand-muted">
            Start tracking your skills to the next level.
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSignup}
          className="space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="space-y-1">
            <label className="text-sm font-medium text-brand-text/80">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted transition-colors duration-200" />
              <input
                type="text"
                required
                className="w-full rounded-xl bg-white/5 border border-white/10 py-3 pl-10 pr-4 text-white focus:border-brand-violet focus:outline-none focus:ring-1 focus:ring-brand-violet transition-all duration-300"
                placeholder="tech_wizard"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="text-sm font-medium text-brand-text/80">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted transition-colors duration-200" />
              <input
                type="email"
                required
                className="w-full rounded-xl bg-white/5 border border-white/10 py-3 pl-10 pr-4 text-white focus:border-brand-violet focus:outline-none focus:ring-1 focus:ring-brand-violet transition-all duration-300"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="text-sm font-medium text-brand-text/80">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted transition-colors duration-200" />
              <input
                type="password"
                required
                minLength="6"
                className="w-full rounded-xl bg-white/5 border border-white/10 py-3 pl-10 pr-4 text-white focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all duration-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              className="group relative mt-2 w-full overflow-hidden rounded-xl bg-brand-teal py-3.5 font-medium text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
              whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(15,118,110,0.35)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 340, damping: 22 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-slate-900">
                <UserPlus className="h-4 w-4" /> Create Account
              </span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.p
          className="mt-6 text-center text-sm text-brand-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-violet hover:underline transition-colors">
            Sign In
          </Link>
        </motion.p>
      </motion.div>
    </main>
  );
}
