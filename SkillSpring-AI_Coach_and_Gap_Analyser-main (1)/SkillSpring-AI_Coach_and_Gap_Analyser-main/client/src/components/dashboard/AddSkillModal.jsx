import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '../ui/Button';

const categories = [
  { value: 'technical', label: 'Technical' },
  { value: 'communication', label: 'Communication' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'problem-solving', label: 'Problem Solving' },
  { value: 'domain', label: 'Domain Knowledge' },
  { value: 'soft-skills', label: 'Soft Skills' },
];

const suggestions = [
  'React',
  'JavaScript',
  'TypeScript',
  'Testing',
  'Accessibility',
  'Communication',
  'System Design',
  'Product Thinking',
];

const initialState = {
  name: '',
  category: 'technical',
  proficiency: 60,
  source: 'manual',
};

export default function AddSkillModal({ open, onClose, onSubmit, existingSkills = [] }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);
  const [isUpdatingExisting, setIsUpdatingExisting] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setError(null);
      setIsUpdatingExisting(false);
    }
  }, [open]);

  const handleNameChange = (value) => {
    setError(null);
    const trimmed = value.trim();
    const duplicate = existingSkills.find(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    setIsUpdatingExisting(Boolean(duplicate && trimmed));
    setForm((state) => ({ ...state, name: value, category: duplicate?.category ?? state.category }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    const trimmedName = form.name.trim();

    if (!trimmedName) {
      setError('Please provide a skill name.');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Skill name is too long (max 50 chars).');
      return;
    }

    onSubmit({
      ...form,
      name: trimmedName,
      proficiency: Number(form.proficiency),
    });
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-[rgba(248,244,238,0.78)] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close add skill panel"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-xl flex-col border-l border-white/10 bg-brand-surface/95 px-6 py-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,118,110,0.08),rgba(124,58,237,0.05),rgba(255,255,255,0.6))] p-6">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-brand-violet/10 blur-3xl" />
              <div className="absolute left-0 top-10 h-24 w-24 rounded-full bg-brand-teal/10 blur-3xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Add Skill</p>
                  <h2 className="mt-3 font-display text-3xl text-brand-text">Extend the map</h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                    Add a skill manually and place it into the dashboard immediately. Use the score to
                    reflect your current confidence honestly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/10 bg-white/70 p-2 text-brand-muted transition hover:border-brand-indigo/30 hover:text-brand-text"
                  aria-label="Close panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form className="mt-8 flex flex-1 flex-col" onSubmit={handleSubmit}>
              <label className="text-sm font-medium text-brand-text" htmlFor="skill-name">
                Skill name
              </label>
              <input
                id="skill-name"
                name="name"
                value={form.name}
                onChange={(event) => handleNameChange(event.target.value)}
                className="mt-3 rounded-2xl border border-white/10 bg-white px-5 py-4 text-brand-text outline-none ring-brand-teal/40 transition focus:ring-2"
                placeholder="e.g. React, SQL, Figma"
                list="skill-suggestions"
              />
              <AnimatePresence>
                {isUpdatingExisting && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm font-semibold text-brand-teal"
                  >
                    ✓ Already tracked — submitting will update the proficiency score.
                  </motion.p>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm font-bold text-rose-500"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
              <datalist id="skill-suggestions">
                {suggestions.map((skill) => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-brand-text" htmlFor="skill-category">
                    Category
                  </label>
                  <select
                    id="skill-category"
                    value={form.category}
                    onChange={(event) =>
                      setForm((state) => ({ ...state, category: event.target.value }))
                    }
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-brand-text outline-none ring-brand-teal/40 transition focus:ring-2"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-brand-text" htmlFor="skill-source">
                    Source
                  </label>
                  <select
                    id="skill-source"
                    value={form.source}
                    onChange={(event) =>
                      setForm((state) => ({ ...state, source: event.target.value }))
                    }
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-white px-5 py-4 text-brand-text outline-none ring-brand-teal/40 transition focus:ring-2"
                  >
                    <option value="manual">Manual</option>
                    <option value="resume">Resume</option>
                    <option value="github">GitHub</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-brand-text" htmlFor="skill-proficiency">
                    Proficiency
                  </label>
                  <span className="text-sm text-brand-teal">{form.proficiency}%</span>
                </div>
                <input
                  id="skill-proficiency"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={form.proficiency}
                  onChange={(event) =>
                    setForm((state) => ({ ...state, proficiency: Number(event.target.value) }))
                  }
                  className="mt-4 w-full accent-[#2DD4BF]"
                />
                <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.24em] text-brand-muted">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-brand-muted">Quick picks</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {suggestions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        setError(null);
                        setForm((state) => ({ ...state, name: skill }));
                      }}
                      className="rounded-full border border-white/15 bg-white px-4 py-2 text-sm text-brand-text font-semibold transition hover:border-brand-violet/40 hover:bg-white hover:text-brand-violet"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:justify-end">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isUpdatingExisting ? 'Update Score' : 'Add Skill'}
                </Button>
              </div>
            </form>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
