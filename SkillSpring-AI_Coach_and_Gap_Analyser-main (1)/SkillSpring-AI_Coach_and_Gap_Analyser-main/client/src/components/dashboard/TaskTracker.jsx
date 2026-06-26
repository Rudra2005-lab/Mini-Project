import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function TaskTracker({ tasks, onToggleTask, onNavigateRoadmap }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Task Tracker</p>
          <h3 className="mt-3 font-display text-3xl text-brand-text">Closest milestones</h3>
        </div>
        {tasks.length > 0 && <Badge tone="slate">{tasks.length} tasks in focus</Badge>}
      </div>

      {tasks.length === 0 ? (
        <motion.div
          className="mt-8 flex flex-col items-center rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Compass className="h-10 w-10 text-brand-muted" />
          </motion.div>
          <p className="mt-4 text-sm font-semibold text-brand-text">No tasks yet</p>
          <p className="mt-2 max-w-xs text-sm leading-7 text-slate-300">
            Generate a learning roadmap to get personalized weekly tasks aligned with your target role.
          </p>
          {onNavigateRoadmap && (
            <button
              type="button"
              onClick={onNavigateRoadmap}
              className="mt-5 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-5 py-2 text-sm font-semibold text-brand-teal transition hover:bg-brand-teal/20"
            >
              Generate Roadmap →
            </button>
          )}
        </motion.div>
      ) : (
        <div className="mt-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {tasks.map((task, index) => (
              <motion.label
                key={task.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16, scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="group flex cursor-pointer items-start gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-brand-teal/25 hover:shadow-[0_14px_24px_rgba(148,163,184,0.14)]"
              >
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(event) => onToggleTask(task.id, event.target.checked)}
                    className="peer h-5 w-5 rounded border-white/20 bg-transparent accent-[#2DD4BF] opacity-0 absolute"
                  />
                  <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                    task.completed
                      ? 'border-brand-teal bg-brand-teal/20'
                      : 'border-white/20 group-hover:border-brand-teal/40'
                  }`}>
                    {task.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-teal" />
                      </motion.div>
                    )}
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-medium transition-all duration-300 ${
                    task.completed ? 'text-brand-muted line-through' : 'text-brand-text'
                  }`}>{task.title}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-brand-muted">
                    Week {task.weekNumber} • {task.completed ? 'Completed' : 'Up next'}
                  </p>
                </div>
              </motion.label>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
}
