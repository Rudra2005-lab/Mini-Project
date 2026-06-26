import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const footerLinks = [
  {
    title: 'Product',
    links: ['Skill Mapping', 'Gap Analysis', 'AI Coach', 'Roadmaps'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API Reference', 'Changelog', 'Community'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Contact'],
  },
];

const socialLinks = [
  { icon: '𝕏', label: 'Twitter' },
  { icon: 'in', label: 'LinkedIn' },
  { icon: '▶', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="section-shell relative border-t border-white/10 pb-10 pt-16">
      {/* Gradient top border */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent" />

      {/* Subtle radial glow at top */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-teal/5 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          {...useScrollAnimation('fadeUp')}
          className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]"
        >
          {/* Branding */}
          <div>
            <div className="flex items-center gap-3">
              <motion.div
                className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-teal via-cyan-200 to-brand-indigo shadow-teal"
                whileHover={{ rotate: 8, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              />
              <div>
                <p className="font-display text-lg text-brand-text">SkillSpring</p>
                <p className="text-xs uppercase tracking-[0.28em] text-brand-muted">
                  AI Growth Tracker
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-300">
              AI-powered skill mapping and career growth for students who want to get hired, not
              just graduate.
            </p>

            {/* System status indicator */}
            <motion.div
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-brand-muted"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-brand-teal"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
              All systems operational
            </motion.div>

            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ icon, label }) => (
                <motion.span
                  key={icon}
                  aria-label={label}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-brand-muted transition-colors hover:border-brand-teal/30 hover:text-brand-teal"
                  whileHover={{ scale: 1.12, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  {icon}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((column, colIdx) => (
            <div key={column.title}>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-brand-text">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link, linkIdx) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * linkIdx + 0.1 * colIdx }}
                  >
                    <span className="group flex cursor-pointer items-center gap-1.5 text-sm text-slate-300 transition hover:text-brand-teal">
                      <motion.span
                        className="h-px w-0 rounded-full bg-brand-teal group-hover:w-4 transition-all duration-200"
                      />
                      {link}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Divider with gradient */}
        <div className="relative mt-14">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <motion.div
          {...useScrollAnimation('fadeUp')}
          className="mt-6 flex flex-col items-center justify-between gap-4 text-xs text-brand-muted md:flex-row"
        >
          <p>© {new Date().getFullYear()} SkillSpring. Built for career momentum.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <motion.span
                key={item}
                className="cursor-pointer transition hover:text-brand-teal"
                whileHover={{ y: -1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
