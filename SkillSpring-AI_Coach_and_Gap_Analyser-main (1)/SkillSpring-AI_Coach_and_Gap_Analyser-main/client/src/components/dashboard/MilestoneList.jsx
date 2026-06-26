import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';

export default function MilestoneList({ milestones }) {
  const [expandedWeeks, setExpandedWeeks] = useState({});

  // Group milestones by weekNumber with normalization
  const groupedMilestones = milestones.reduce((acc, milestone) => {
    const rawWeek = milestone.weekNumber;
    const week = (typeof rawWeek === 'number' && !isNaN(rawWeek)) ? rawWeek : 1;
    if (!acc[week]) acc[week] = [];
    acc[week].push(milestone);
    return acc;
  }, {});

  // Sort weeks numerically and provide a default empty state
  const sortedWeeks = Object.keys(groupedMilestones)
    .map(Number)
    .sort((a, b) => a - b);

  const toggleWeek = (week) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [week]: prev[week] === undefined ? false : !prev[week], // Default to expanded initially
    }));
  };

  return (
    <Card className="relative flex h-full flex-col overflow-hidden p-0">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b border-white/5 bg-transparent px-6 pb-4 pt-6 backdrop-blur-2xl">
        <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Milestones</p>
        <h3 className="mt-3 font-display text-3xl text-brand-text">Completed vs pending tasks</h3>
      </div>

      {/* Scrollable Timeline Container */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 pt-4">
        {sortedWeeks.length === 0 && (
          <p className="text-sm text-brand-muted">No milestones tracked yet.</p>
        )}

        <div className="space-y-6">
          {sortedWeeks.map((week) => {
            const tasks = groupedMilestones[week];
            // Treat undefined as true (expanded by default)
            const isExpanded = expandedWeeks[week] !== false;

            return (
              <div key={week} className="space-y-3">
                {/* Group Toggle */}
                <button
                  type="button"
                  onClick={() => toggleWeek(week)}
                  className="flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
                >
                  <span className="font-semibold text-white">Week {week}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-brand-muted">
                      {tasks.filter((t) => t.completed).length}/{tasks.length} Done
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-brand-muted" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-brand-muted" />
                    )}
                  </div>
                </button>

                {/* Tasks List */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pl-2 pt-1">
                        {tasks.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex flex-col gap-2 rounded-[20px] border border-white/10 bg-white/[0.02] px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
                          >
                            <div className="pr-2">
                              <p className="text-sm font-medium text-brand-text">{milestone.title}</p>
                              <p className="mt-1 text-xs leading-5 text-brand-muted">
                                {milestone.goal}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 self-start rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] ${
                                milestone.completed
                                  ? 'bg-brand-teal/10 text-brand-teal'
                                  : 'bg-brand-violet/10 text-violet-700'
                              }`}
                            >
                              {milestone.completed ? 'Done' : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
