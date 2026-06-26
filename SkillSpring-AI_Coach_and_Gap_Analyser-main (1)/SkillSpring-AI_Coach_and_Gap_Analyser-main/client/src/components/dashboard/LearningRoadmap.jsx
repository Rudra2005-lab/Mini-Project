import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

function ResourceCard({ resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="group rounded-[24px] border border-white/10 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:border-brand-teal/40 hover:bg-white hover:shadow-[0_16px_28px_rgba(148,163,184,0.14)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-text">{resource.title}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-brand-muted">
            {resource.platform} • {resource.type} • {resource.durationMinutes} mins
          </p>
        </div>
        <ExternalLink className="h-4 w-4 text-brand-muted transition group-hover:text-brand-teal" />
      </div>
    </a>
  );
}

function GenerateRoadmapButton({ onGenerate, isGenerating }) {
  return (
    <Button onClick={onGenerate} className="min-w-[220px]" disabled={isGenerating}>
      <Sparkles className="h-5 w-5" />
      {isGenerating ? 'Generating roadmap...' : 'Generate roadmap'}
    </Button>
  );
}

function RoadmapTimeline({ roadmap, onToggleTask }) {
  if (!roadmap?.weeks?.length) {
    return (
      <Card className="p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 to-transparent" />
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-muted">No roadmap active</p>
          <h3 className="mt-5 font-display text-4xl text-brand-text">Turn your skill gaps into a master plan</h3>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-400 font-medium">
            Generate a precision weekly roadmap. We'll identify exactly what you need to study, 
            provide the resources, and track your progress in real-time.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {roadmap.weeks.map((week, weekIdx) => (
        <motion.div
          key={week.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: weekIdx * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="glass-card-hover relative overflow-hidden p-6 md:p-10">
            <div className="absolute left-6 top-8 hidden h-[calc(100%-80px)] w-0.5 bg-gradient-to-b from-brand-teal/40 via-brand-indigo/20 to-transparent md:block" />
            
            <div className="grid gap-10 md:grid-cols-[0.12fr_0.88fr]">
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-brand-teal/30 bg-brand-teal/5 font-display text-xl font-bold text-brand-teal shadow-inner">
                  {week.weekNumber}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">
                      Timeline Phase {week.weekNumber}
                    </p>
                    <h3 className="mt-3 font-display text-3xl text-brand-text tracking-tight">{week.goal}</h3>
                  </div>
                  <Badge tone="indigo" className="w-fit">{week.estimatedHours}h focused study</Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {week.tasks.map((task, taskIdx) => (
                    <motion.label
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + taskIdx * 0.05 }}
                      className={`group flex items-start gap-4 rounded-[24px] border border-white/10 p-5 transition-all duration-300 cursor-pointer ${
                        task.completed 
                          ? 'bg-brand-teal/5 border-brand-teal/20' 
                          : 'bg-white/5 hover:border-brand-teal/30 hover:bg-white/10'
                      }`}
                    >
                      <div className="mt-1 relative h-5 w-5 shrink-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(event) => onToggleTask(task.id, event.target.checked)}
                          className="peer h-full w-full opacity-0 cursor-pointer z-10 relative"
                        />
                        <div className="absolute inset-0 rounded-md border-2 border-brand-muted group-hover:border-brand-teal transition-colors peer-checked:bg-brand-teal peer-checked:border-brand-teal" />
                        <svg className="absolute inset-0 h-full w-full text-white opacity-0 peer-checked:opacity-100 transition-opacity p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold transition-all ${task.completed ? 'text-brand-teal opacity-70 line-through' : 'text-brand-text'}`}>
                          {task.title}
                        </p>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                          {task.completed ? 'Achieved' : 'Benchmark task'}
                        </p>
                      </div>
                    </motion.label>
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {week.resources.map((resource) => (
                    <ResourceCard key={`${week.id}-${resource.title}`} resource={resource} />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default function LearningRoadmap({
  roadmap,
  onGenerate,
  isGenerating,
  narration,
  onToggleTask,
  studyHours,
  roadmapWeeks,
  onStudyHoursChange,
  onWeeksChange,
}) {
  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">AI Roadmap</p>
            <h2 className="mt-4 font-display text-4xl text-brand-text">Generate the next six weeks</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Tune the weekly study time, choose how many weeks to plan, and stream a roadmap that
              turns your most important gaps into concrete learning milestones.
            </p>
          </div>

          <GenerateRoadmapButton onGenerate={onGenerate} isGenerating={isGenerating} />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-brand-text" htmlFor="study-hours">
                Hours per week
              </label>
              <span className="text-sm text-brand-teal">{studyHours}h</span>
            </div>
            <input
              id="study-hours"
              type="range"
              min="2"
              max="20"
              value={studyHours}
              onChange={(event) => onStudyHoursChange(Number(event.target.value))}
              className="mt-4 w-full accent-[#2DD4BF]"
            />
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-brand-text" htmlFor="roadmap-weeks">
                Timeline length
              </label>
              <span className="text-sm text-brand-violet">{roadmapWeeks} weeks</span>
            </div>
            <input
              id="roadmap-weeks"
              type="range"
              min="4"
              max="12"
              value={roadmapWeeks}
              onChange={(event) => onWeeksChange(Number(event.target.value))}
              className="mt-4 w-full accent-[#7C3AED]"
            />
          </div>
        </div>

        {narration ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 rounded-[32px] border border-brand-indigo/10 bg-brand-indigo/5 p-6 md:p-8 shadow-inner"
          >
            <div className="flex items-center gap-3 text-brand-indigo mb-4">
              <Sparkles className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">AI Strategic Summary</span>
            </div>
            <p className="text-sm leading-8 text-slate-500 font-medium whitespace-pre-line italic">
              "{narration}"
            </p>
          </motion.div>
        ) : null}
      </Card>

      <RoadmapTimeline roadmap={roadmap} onToggleTask={onToggleTask} />
    </div>
  );
}
