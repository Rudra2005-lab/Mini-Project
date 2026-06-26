import { startTransition, useCallback, useEffect, useDeferredValue, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Compass,
  LayoutDashboard,
  Palette,
  Settings,
  Sparkles,
  Target,
  Trophy,
  Upload,
  ArrowRight,
} from 'lucide-react';
import { shallow } from 'zustand/shallow';
import { useUser } from '../context/UserContext';
import { useSkillData } from '../hooks/useSkillData';
import { useSkillStore } from '../store/skillStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressCard from '../components/dashboard/ProgressCard';
import SkillRadarChart from '../components/dashboard/SkillRadarChart';
import SkillTagCloud from '../components/dashboard/SkillTagCloud';
import AddSkillModal from '../components/dashboard/AddSkillModal';
import GapAnalysisPanel from '../components/dashboard/GapAnalysisPanel';
import LearningRoadmap from '../components/dashboard/LearningRoadmap';
import TaskTracker from '../components/dashboard/TaskTracker';
import AICoachChat from '../components/dashboard/AICoachChat';
import WeeklyProgressChart from '../components/dashboard/WeeklyProgressChart';
import StreakTracker from '../components/dashboard/StreakTracker';
import BadgeShowcase from '../components/dashboard/BadgeShowcase';
import MilestoneList from '../components/dashboard/MilestoneList';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'gap', label: 'Gap Analysis', icon: Target },
  { id: 'roadmap', label: 'Roadmap', icon: Compass },
  { id: 'coach', label: 'AI Coach', icon: Bot },
  { id: 'progress', label: 'Progress', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const themeStyles = {
  atelier:
    'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_6%,rgba(15,118,110,0.14),transparent_22%),radial-gradient(circle_at_84%_10%,rgba(124,58,237,0.12),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.12),transparent_34%)]',
  coastal:
    'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_8%,rgba(14,165,233,0.12),transparent_24%),radial-gradient(circle_at_82%_12%,rgba(15,118,110,0.12),transparent_22%),radial-gradient(circle_at_56%_100%,rgba(245,158,11,0.1),transparent_34%)]',
};

// Stagger animation variants for card grids
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

function Sidebar({ activePanel, isOpen, onSelect, onToggle }) {
  return (
    <motion.aside
      layout
      className={`fixed inset-y-0 left-0 z-30 hidden border-r border-white/10 bg-brand-surface/90 backdrop-blur-2xl md:flex md:flex-col ${isOpen ? 'w-72' : 'w-24'
        } transition-all duration-500 ease-[0.22,1,0.36,1]`}
    >
      <div className="flex items-center justify-between px-6 py-6">
        <div className={`transition-all duration-500 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <p className="font-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-violet">SkillSpring</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-muted font-bold opacity-70">Growth cockpit</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full border border-white/10 p-2 text-brand-muted transition hover:bg-white/5 hover:text-white"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      <nav className="mt-8 flex-1 space-y-1.5 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all duration-300 ${isActive
                  ? 'bg-brand-teal/10 text-brand-teal'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 h-6 w-1 rounded-r-full bg-brand-teal"
                />
              )}
              <Icon className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className={`font-medium transition-all duration-500 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 md:hidden -translate-x-4'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 pb-8">
        <div className="rounded-[24px] border border-white/8 bg-white/5 p-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <p className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Identity</p>
          <p className="relative z-10 mt-3 text-sm leading-relaxed text-slate-500 font-medium">
            Ronit Mexson
          </p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <div className="h-1.5 w-1.5 rounded-full bg-brand-teal animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-teal/80">Active Session</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

function NotificationTray({ notifications, onDismiss }) {
  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (!notifications.length) return undefined;

    const timers = notifications.map((notification) => {
      const duration = notification.tone === 'error' ? 8000 : 5000;
      return setTimeout(() => onDismiss(notification.id), duration);
    });

    return () => timers.forEach(clearTimeout);
  }, [notifications, onDismiss]);

  if (!notifications.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-50 space-y-3">
      <AnimatePresence>
        {notifications.map((notification, index) => {
          const isError = notification.tone === 'error';
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className={`pointer-events-auto w-full max-w-sm rounded-[24px] border p-4 shadow-xl backdrop-blur-xl ${
                isError
                  ? 'border-red-500/30 bg-red-950/80'
                  : 'border-white/10 bg-brand-surface/95'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-sm font-semibold ${isError ? 'text-red-300' : 'text-white'}`}>
                    {notification.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{notification.body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onDismiss(notification.id)}
                  className="text-xs uppercase tracking-[0.24em] text-brand-muted transition hover:text-white"
                >
                  Dismiss
                </button>
              </div>
              {/* Auto-dismiss progress bar */}
              <motion.div
                className={`mt-3 h-0.5 rounded-full ${isError ? 'bg-red-500/50' : 'bg-brand-teal/40'}`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: isError ? 8 : 5, ease: 'linear' }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function SettingsPanel({ studyHours, roadmapWeeks, onStudyHoursChange, onWeeksChange, targetRole }) {
  return (
    <motion.div
      className="grid gap-6 xl:grid-cols-2"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerItem}>
        <Card className="p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Planner Settings</p>
          <h3 className="mt-3 font-display text-3xl text-white">Roadmap preferences</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Current target role: {targetRole}. These controls shape how aggressively the roadmap
            should plan your weeks in local development.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4 text-brand-teal" />
                  <span className="text-sm text-slate-200">Hours per week</span>
                </div>
                <span className="text-sm font-bold text-brand-teal">{studyHours} hours</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                value={studyHours}
                onChange={(event) => onStudyHoursChange(Number(event.target.value))}
                className="mt-4 w-full accent-[#2DD4BF] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-brand-violet" />
                  <span className="text-sm text-slate-200">Weeks per roadmap</span>
                </div>
                <span className="text-sm font-bold text-brand-violet">{roadmapWeeks} weeks</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                value={roadmapWeeks}
                onChange={(event) => onWeeksChange(Number(event.target.value))}
                className="mt-4 w-full accent-[#7C3AED] cursor-pointer"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card className="p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Workflow Notes</p>
          <div className="mt-4 space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
              Resume parsing and GitHub import are wired for the backend, but the client also falls
              back to local mock data so the UI remains usable even before the server is running.
            </div>
            <div className="rounded-[24px] border border-brand-indigo/20 bg-brand-indigo/10 p-4 text-sm leading-7 text-indigo-100">
              Roadmap and AI coach streaming are designed around server-sent events. In local dev, the
              store gracefully degrades to simulated streaming if the API is unavailable.
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Skill row with debounced proficiency slider and color-coded bar
function SkillRow({ skill, onUpdate, onDelete }) {
  const [localProficiency, setLocalProficiency] = useState(skill.proficiency);
  const commitRef = useRef(null);

  // Sync local state if skill updates from external source
  useEffect(() => {
    setLocalProficiency(skill.proficiency);
  }, [skill.proficiency]);

  const commitUpdate = useCallback(() => {
    if (localProficiency !== skill.proficiency) {
      onUpdate(skill.id, { proficiency: localProficiency });
    }
  }, [localProficiency, skill.proficiency, skill.id, onUpdate]);

  // Color-code the proficiency level
  const profColor =
    localProficiency >= 85
      ? 'text-brand-teal'
      : localProficiency >= 60
        ? 'text-brand-indigo'
        : localProficiency >= 35
          ? 'text-brand-violet'
          : 'text-amber-600';

  const barColor =
    localProficiency >= 85
      ? 'from-brand-teal to-cyan-400'
      : localProficiency >= 60
        ? 'from-brand-indigo to-blue-400'
        : localProficiency >= 35
          ? 'from-brand-violet to-purple-400'
          : 'from-amber-500 to-amber-300';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group rounded-[24px] border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-brand-teal/20 hover:shadow-[0_12px_24px_rgba(148,163,184,0.1)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-white">{skill.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-brand-muted">
            {skill.category} • {skill.source}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-display text-lg font-semibold ${profColor}`}>
            {localProficiency}%
          </span>
          <Button variant="secondary" size="sm" onClick={() => onDelete(skill.id)}>
            Remove
          </Button>
        </div>
      </div>

      {/* Proficiency bar */}
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${localProficiency}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Range slider — only commits on pointer up */}
      <input
        type="range"
        min="0"
        max="100"
        value={localProficiency}
        onChange={(event) => setLocalProficiency(Number(event.target.value))}
        onPointerUp={commitUpdate}
        onKeyUp={commitUpdate}
        className="mt-2 w-full accent-[#2DD4BF] opacity-60 transition-opacity hover:opacity-100 focus:opacity-100 md:opacity-0 md:group-hover:opacity-100"
        aria-label={`${skill.name} proficiency`}
      />
    </motion.div>
  );
}

export default function Dashboard() {
  useSkillData();

  const { user } = useUser();
  const [themeMode, setThemeMode] = useState('atelier');
  const [showAllSkills, setShowAllSkills] = useState(false);

  const {
    activePanel,
    isSidebarOpen,
    isBooting,
    isAddSkillOpen,
    isGeneratingRoadmap,
    isChatting,
    isImporting,
    targetRole,
    roleOptions,
    skills,
    gapMatrix,
    readinessScore,
    radarData,
    roadmap,
    urgentTasks,
    weeklyTrend,
    activityData,
    badges,
    milestones,
    summary,
    notifications,
    chatMessages,
    suggestedQuestions,
    roadmapNarration,
    studyHours,
    roadmapWeeks,
    setActivePanel,
    toggleSidebar,
    openAddSkill,
    closeAddSkill,
    addSkill,
    updateSkill,
    deleteSkill,
    adjustCategoryScore,
    importResume,
    importGithubProfile,
    setTargetRole,
    generateRoadmap,
    toggleRoadmapTask,
    setStudyHours,
    setRoadmapWeeks,
    sendCoachMessage,
    dismissNotification,
  } = useSkillStore(
    (state) => ({
      activePanel: state.activePanel,
      isSidebarOpen: state.isSidebarOpen,
      isBooting: state.isBooting,
      isAddSkillOpen: state.isAddSkillOpen,
      isGeneratingRoadmap: state.isGeneratingRoadmap,
      isChatting: state.isChatting,
      isImporting: state.isImporting,
      targetRole: state.targetRole,
      roleOptions: state.roleOptions,
      skills: state.skills,
      gapMatrix: state.gapMatrix,
      readinessScore: state.readinessScore,
      radarData: state.radarData,
      roadmap: state.roadmap,
      urgentTasks: state.urgentTasks,
      weeklyTrend: state.weeklyTrend,
      activityData: state.activityData,
      badges: state.badges,
      milestones: state.milestones,
      summary: state.summary,
      notifications: state.notifications,
      chatMessages: state.chatMessages,
      suggestedQuestions: state.suggestedQuestions,
      roadmapNarration: state.roadmapNarration,
      studyHours: state.studyHours,
      roadmapWeeks: state.roadmapWeeks,
      setActivePanel: state.setActivePanel,
      toggleSidebar: state.toggleSidebar,
      openAddSkill: state.openAddSkill,
      closeAddSkill: state.closeAddSkill,
      addSkill: state.addSkill,
      updateSkill: state.updateSkill,
      deleteSkill: state.deleteSkill,
      adjustCategoryScore: state.adjustCategoryScore,
      importResume: state.importResume,
      importGithubProfile: state.importGithubProfile,
      setTargetRole: state.setTargetRole,
      generateRoadmap: state.generateRoadmap,
      toggleRoadmapTask: state.toggleRoadmapTask,
      setStudyHours: state.setStudyHours,
      setRoadmapWeeks: state.setRoadmapWeeks,
      sendCoachMessage: state.sendCoachMessage,
      dismissNotification: state.dismissNotification,
    }),
    shallow
  );

  const deferredPanel = useDeferredValue(activePanel);

  const activePanelTitle = useMemo(
    () => navItems.find((item) => item.id === deferredPanel)?.label ?? 'Overview',
    [deferredPanel]
  );

  // How many skills to display in the skills panel
  const visibleSkills = showAllSkills ? skills : skills.slice(0, 6);

  if (isBooting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg px-6">
        <div className="glass-card w-full max-w-xl rounded-[32px] p-8 text-center">
          <motion.div
            className="mx-auto h-14 w-14 rounded-full bg-gradient-to-r from-brand-teal to-brand-violet"
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <p className="mt-5 text-sm uppercase tracking-[0.3em] text-brand-muted">
            Loading dashboard
          </p>
          <h1 className="mt-4 font-display text-4xl text-white">Preparing your growth cockpit.</h1>
        </div>
      </div>
    );
  }

  const renderPanel = () => {
    if (deferredPanel === 'overview') {
      return (
        <div className="space-y-6">
          <motion.div
            className="grid gap-4 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <ProgressCard
                label="Skills tracked"
                value={summary.skillsTracked}
                helper="Across technical, soft, and domain dimensions."
                tone="teal"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <ProgressCard
                label="Gaps identified"
                value={summary.gapsIdentified}
                helper="Priority gaps between your current map and the selected role."
                tone="violet"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <ProgressCard
                label="Study streak"
                value={`${summary.streakDays}d`}
                helper="Consistency score derived from roadmap task activity."
                tone="indigo"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="grid gap-6 xl:grid-cols-[0.62fr_0.38fr]"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <SkillRadarChart data={radarData} onAdjustAxis={adjustCategoryScore} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <TaskTracker
                tasks={urgentTasks}
                onToggleTask={toggleRoadmapTask}
                onNavigateRoadmap={() => startTransition(() => setActivePanel('roadmap'))}
              />
            </motion.div>
          </motion.div>

          <motion.div variants={staggerItem} initial="hidden" animate="visible">
            <Card className="p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Skill Cloud</p>
                  <h3 className="mt-3 font-display text-3xl text-white">Visible strengths and gaps</h3>
                </div>
                <Button onClick={openAddSkill}>Add skill</Button>
              </div>
              <div className="mt-6">
                <SkillTagCloud skills={skills} />
              </div>
            </Card>
          </motion.div>

          {/* Compact readiness summary instead of full GapAnalysis duplication */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="group p-6 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Gap Readiness</p>
                  <h3 className="mt-3 font-display text-3xl text-white">
                    {readinessScore}% aligned with {targetRole}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                    {gapMatrix.filter((item) => item.gap > 0).length} skills need attention.
                    {' '}Top priority:{' '}
                    {gapMatrix
                      .filter((item) => item.gap > 0)
                      .sort((a, b) => b.gap - a.gap)
                      .slice(0, 3)
                      .map((item) => item.name)
                      .join(', ') || 'None'}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => startTransition(() => setActivePanel('gap'))}
                >
                  View full analysis <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Mini readiness bar */}
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-teal"
                  initial={{ width: 0 }}
                  animate={{ width: `${readinessScore}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </Card>
          </motion.div>
        </div>
      );
    }

    if (deferredPanel === 'skills') {
      return (
        <div className="space-y-6">
          <motion.div
            className="grid gap-6 xl:grid-cols-[0.68fr_0.32fr]"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <SkillRadarChart data={radarData} onAdjustAxis={adjustCategoryScore} />
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card className="p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Input Methods</p>
                <h3 className="mt-3 font-display text-3xl text-white">Keep your map current</h3>
                <div className="mt-6 space-y-4">
                  <Button onClick={openAddSkill} className="w-full justify-center">
                    Add Skill Manually
                  </Button>
                  <label className="block">
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(event) => {
                        const [file] = event.target.files ?? [];
                        if (file) {
                          importResume(file);
                        }
                      }}
                    />
                    <span className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-brand-violet/60 hover:bg-white/10">
                      <Upload className="h-4 w-4" />
                      {isImporting ? 'Importing resume...' : 'Import Resume PDF'}
                    </span>
                  </label>
                  <Button
                    variant="secondary"
                    className="w-full justify-center"
                    onClick={() => importGithubProfile('ronit-mexson')}
                  >
                    Import GitHub Profile
                  </Button>
                </div>
                <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                  Imported skills are tagged by source so you can distinguish manual confidence from
                  inferred evidence.
                </div>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={staggerItem} initial="hidden" animate="visible">
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Tagged Skills</p>
                  <h3 className="mt-3 font-display text-3xl text-white">All tracked capabilities</h3>
                </div>
                <Badge tone="slate">{skills.length} tracked</Badge>
              </div>
              <div className="mt-6">
                <SkillTagCloud skills={skills} />
              </div>
              <div className="mt-6 grid gap-4">
                <AnimatePresence mode="popLayout">
                  {visibleSkills.map((skill) => (
                    <SkillRow
                      key={skill.id}
                      skill={skill}
                      onUpdate={updateSkill}
                      onDelete={deleteSkill}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Show All / Show Less toggle */}
              {skills.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAllSkills((prev) => !prev)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3 text-sm font-semibold text-brand-teal transition hover:border-brand-teal/30 hover:bg-brand-teal/10"
                >
                  {showAllSkills ? (
                    <>Show less <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>Show all {skills.length} skills <ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              )}
            </Card>
          </motion.div>
        </div>
      );
    }

    if (deferredPanel === 'gap') {
      return (
        <GapAnalysisPanel
          targetRole={targetRole}
          roleOptions={roleOptions}
          onSelectRole={setTargetRole}
          gapMatrix={gapMatrix}
          readinessScore={readinessScore}
        />
      );
    }

    if (deferredPanel === 'roadmap') {
      return (
        <div className="space-y-6">
          <LearningRoadmap
            roadmap={roadmap}
            onGenerate={generateRoadmap}
            isGenerating={isGeneratingRoadmap}
            narration={roadmapNarration}
            onToggleTask={toggleRoadmapTask}
            studyHours={studyHours}
            roadmapWeeks={roadmapWeeks}
            onStudyHoursChange={setStudyHours}
            onWeeksChange={setRoadmapWeeks}
          />
        </div>
      );
    }

    if (deferredPanel === 'coach') {
      return (
        <AICoachChat
          messages={chatMessages}
          onSend={sendCoachMessage}
          isChatting={isChatting}
          suggestedQuestions={suggestedQuestions}
          targetRole={targetRole}
        />
      );
    }

    if (deferredPanel === 'progress') {
      return (
        <div className="space-y-6">
          <motion.div
            className="grid gap-4 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <ProgressCard
                label="Tasks completed"
                value={`${summary.tasksCompleted}/${summary.tasksTotal || 1}`}
                helper="Roadmap actions closed so far."
                tone="teal"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <ProgressCard
                label="Weekly minutes"
                value={summary.weeklyStudyMinutes}
                helper="Approximate study time currently planned."
                tone="violet"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <ProgressCard
                label="Readiness"
                value={`${summary.readinessScore}%`}
                helper="Weighted score across the active target role."
                tone="indigo"
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <WeeklyProgressChart data={weeklyTrend} />
            </motion.div>
          </motion.div>

          <motion.div
            className="grid gap-6 xl:grid-cols-[0.5fr_0.5fr]"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <StreakTracker data={activityData} />
            </motion.div>
            <motion.div variants={staggerItem} className="relative w-full h-full min-h-[300px]">
              <div className="absolute inset-0">
                <MilestoneList milestones={milestones} />
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={staggerItem} initial="hidden" animate="visible">
            <BadgeShowcase badges={badges} />
          </motion.div>
        </div>
      );
    }

    return (
      <SettingsPanel
        studyHours={studyHours}
        roadmapWeeks={roadmapWeeks}
        onStudyHoursChange={setStudyHours}
        onWeeksChange={setRoadmapWeeks}
        targetRole={targetRole}
      />
    );
  };

  return (
    <div className={`relative min-h-screen overflow-x-hidden bg-brand-bg ${themeStyles[themeMode]}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={themeMode}
          initial={{ x: '100%', opacity: 1 }}
          animate={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed inset-0 z-[100] bg-brand-teal"
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 opacity-90" />
      <NotificationTray notifications={notifications} onDismiss={dismissNotification} />

      <Sidebar
        activePanel={activePanel}
        isOpen={isSidebarOpen}
        onSelect={(panelId) => startTransition(() => setActivePanel(panelId))}
        onToggle={toggleSidebar}
      />

      <div className={`${isSidebarOpen ? 'md:pl-72' : 'md:pl-24'} relative z-10 min-h-screen transition-all`}>
        <header className="sticky top-0 z-20 border-b border-white/8 bg-brand-bg/60 px-4 py-6 backdrop-blur-2xl md:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-teal/80"
              >
                {activePanelTitle}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 font-display text-4xl text-white md:text-5xl tracking-tight"
              >
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-brand-indigo">{user.name.split(' ')[0]}</span>
              </motion.h1>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-2xl border-white/10 bg-white/5"
                onClick={() => setThemeMode((mode) => (mode === 'atelier' ? 'coastal' : 'atelier'))}
              >
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">{themeMode === 'atelier' ? 'Coastal accent' : 'Studio accent'}</span>
              </Button>
              <div className="relative cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-3.5 text-slate-400 transition hover:bg-white/10 hover:text-white">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-violet text-[10px] font-bold !text-white shadow-lg shadow-brand-violet/20"
                  >
                    {notifications.length}
                  </motion.span>
                )}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-teal/20 bg-brand-teal/5 text-sm font-bold text-brand-teal shadow-inner">
                {user.name.split(' ').map((part) => part[0]).join('')}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-8 md:px-8 md:py-10">
          <div className="relative mb-6 md:hidden">
            {/* Fade edges to hint at horizontal scrollability */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-brand-bg/80 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-brand-bg/80 to-transparent" />
            <div className="scrollbar-thin flex gap-3 overflow-x-auto px-1 pb-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => startTransition(() => setActivePanel(item.id))}
                    className={`inline-flex min-w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${activePanel === item.id
                        ? 'border-brand-teal/40 bg-brand-teal/10 text-brand-teal'
                        : 'border-white/10 bg-white/5 text-slate-200'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            className="mb-8 grid gap-4 xl:grid-cols-[0.68fr_0.32fr]"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <Card className="surface-panel p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Target Alignment</p>
                    <h2 className="mt-3 font-display text-4xl text-white">{targetRole}</h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                      Your dashboard is tracking current strengths, visible gaps, and roadmap progress
                      toward the role you want next.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Badge tone="teal">{summary.readinessScore}% ready</Badge>
                    <Badge tone="slate">{summary.gapsIdentified} gaps active</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card className="surface-panel p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">Quick actions</p>
                <div className="mt-4 grid gap-3">
                  <Button onClick={openAddSkill}>Add a skill</Button>
                  <Button variant="secondary" onClick={() => startTransition(() => setActivePanel('roadmap'))}>
                    Generate roadmap
                  </Button>
                  <Button variant="secondary" onClick={() => startTransition(() => setActivePanel('coach'))}>
                    Ask AI coach
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={deferredPanel}
              initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderPanel()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AddSkillModal
        open={isAddSkillOpen}
        onClose={closeAddSkill}
        onSubmit={addSkill}
        existingSkills={skills}
      />
    </div>
  );
}
