import { create } from 'zustand';
// Removing direct api dependency for pure logic functions where possible
import { api } from '../services/api';

const axisCatalog = [
  { key: 'technical', label: 'Technical', categories: ['technical'] },
  { key: 'communication', label: 'Communication', categories: ['communication'] },
  { key: 'leadership', label: 'Leadership', categories: ['leadership'] },
  { key: 'problem-solving', label: 'Problem Solving', categories: ['problem-solving'] },
  { key: 'domain', label: 'Domain Knowledge', categories: ['domain'] },
  { key: 'soft-skills', label: 'Soft Skills', categories: ['soft-skills'] },
];

const badgeCatalog = [
  {
    id: 'first-step',
    icon: '🌱',
    title: 'First Step',
    description: 'Add your first skill to activate the tracker.',
  },
  {
    id: 'on-fire',
    icon: '🔥',
    title: 'On Fire',
    description: 'Keep a seven-day learning streak alive.',
  },
  {
    id: 'sharpshooter',
    icon: '🎯',
    title: 'Sharpshooter',
    description: 'Close your first high-priority skill gap.',
  },
  {
    id: 'pathfinder',
    icon: '🗺️',
    title: 'Pathfinder',
    description: 'Generate your first AI roadmap.',
  },
  {
    id: 'coached',
    icon: '💬',
    title: 'Coached',
    description: 'Ask the AI coach your first focused question.',
  },
  {
    id: 'gap-crusher',
    icon: '🏆',
    title: 'Gap Crusher',
    description: 'Improve overall readiness by 20 points or more.',
  },
];

const defaultSuggestions = [
  'What should I learn first?',
  'Rate my progress',
  'Quiz me on React',
];

const starterAssistantMessage = {
  id: 'assistant-welcome',
  role: 'assistant',
  content:
    'I can help you prioritize the next skill, turn gaps into projects, or quiz you on what you are learning. Ask anything from strategy to practice.',
};

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

function normalizeSkill(skill) {
  return {
    ...skill,
    id: skill.id ?? skill._id,
  };
}

function computeGapMatrix(skills, requirements) {
  const skillMap = new Map(skills.map((skill) => [skill.name.toLowerCase(), skill]));

  return requirements.map((requirement) => {
    const current = skillMap.get(requirement.name.toLowerCase())?.proficiency ?? 0;
    const gap = Math.max(requirement.target - current, 0);
    const readiness = requirement.target
      ? Math.min(100, Math.round((current / requirement.target) * 100))
      : 100;

    return {
      ...requirement,
      current,
      gap,
      readiness,
      status: current === 0 ? 'missing' : current < requirement.target ? 'partial' : 'aligned',
    };
  });
}

function computeReadiness(gapMatrix) {
  if (!gapMatrix.length) return 0;

  const weights = { critical: 1.5, high: 1.25, medium: 1 };
  
  let totalWeightedReadiness = 0;
  let totalWeight = 0;

  gapMatrix.forEach(item => {
    const w = weights[item.importance] || 1;
    totalWeightedReadiness += (item.readiness * w);
    totalWeight += w;
  });

  return Math.round(totalWeightedReadiness / totalWeight);
}

function computeRadarData(skills, requirements) {
  return axisCatalog.map((axis) => {
    const relatedSkills = skills.filter((skill) => axis.categories.includes(skill.category));
    const relatedRequirements = requirements.filter((requirement) =>
      axis.categories.includes(requirement.category)
    );
    const currentAverage = relatedSkills.length
      ? Math.round(
          relatedSkills.reduce((sum, skill) => sum + skill.proficiency, 0) / relatedSkills.length
        )
      : 0;
    const targetAverage = relatedRequirements.length
      ? Math.round(
          relatedRequirements.reduce((sum, requirement) => sum + requirement.target, 0) /
            relatedRequirements.length
        )
      : 70;

    return {
      axis: axis.label,
      categoryKey: axis.key,
      current: currentAverage,
      target: targetAverage,
    };
  });
}

function buildWeeklyTrend(roadmap, skills) {
  if (!roadmap?.weeks?.length) {
    return [
      { label: 'W1', skills: Math.max(1, Math.round(skills.length / 2)), tasks: 1, hours: 5 },
      { label: 'W2', skills: Math.max(1, Math.round(skills.length / 2) + 1), tasks: 2, hours: 6 },
      { label: 'W3', skills: Math.max(1, Math.round(skills.length / 2) + 2), tasks: 2, hours: 7 },
    ];
  }

  return roadmap.weeks.map((week, index) => ({
    label: `W${week.weekNumber}`,
    skills: Math.min(skills.length, Math.max(1, index + 2)),
    tasks: week.tasks.filter((task) => task.completed).length,
    hours: week.estimatedHours,
  }));
}

function buildActivityData(roadmap, skills) {
  const end = new Date();
  const completedTasks = (roadmap?.weeks?.flatMap((week) => week.tasks) ?? []).filter(
    (task) => task.completed
  ).length;

  return Array.from({ length: 84 }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (83 - index));
    const signal = (index + skills.length + completedTasks) % 6;
    const count = signal >= 4 ? 3 : signal >= 2 ? 2 : signal === 1 ? 1 : 0;

    return {
      date: date.toISOString().slice(0, 10),
      count,
      level: count,
    };
  });
}

function buildMilestones(roadmap) {
  if (!roadmap?.weeks?.length) {
    return [];
  }

  return roadmap.weeks.flatMap((week) =>
    week.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      weekNumber: week.weekNumber,
      completed: task.completed,
      completedAt: task.completedAt,
      goal: week.goal,
    }))
  );
}

function buildSummary(skills, gapMatrix, readinessScore, roadmap) {
  const totalTasks = roadmap?.weeks?.flatMap((week) => week.tasks) ?? [];
  const completedTasks = totalTasks.filter((task) => task.completed).length;
  const streakDays = Math.min(
    14,
    Math.max(3, completedTasks * 2 + Math.min(5, Math.floor(skills.length / 2)))
  );

  return {
    skillsTracked: skills.length,
    gapsIdentified: gapMatrix.filter((item) => item.gap > 0).length,
    readinessScore,
    tasksCompleted: completedTasks,
    tasksTotal: totalTasks.length,
    streakDays,
    weeklyStudyMinutes:
      (roadmap?.weeks?.[0]?.estimatedHours ?? 6) * 60 +
      gapMatrix.filter((item) => item.gap > 0).length * 15,
  };
}

function buildBadges(skills, roadmap, chatMessages, readinessScore, summary, earnedBadgeIds) {
  const milestoneCount = roadmap?.weeks?.flatMap((week) => week.tasks).filter((task) => task.completed)
    .length;
  const chatCount = chatMessages.filter((message) => message.role === 'user').length;

  return badgeCatalog.map((badge) => {
    const computed =
      badge.id === 'first-step'
        ? skills.length > 0
        : badge.id === 'on-fire'
          ? summary.streakDays >= 7
          : badge.id === 'sharpshooter'
            ? milestoneCount >= 1
            : badge.id === 'pathfinder'
              ? Boolean(roadmap?.weeks?.length)
              : badge.id === 'coached'
                ? chatCount >= 1
                : readinessScore >= 80;

    return {
      ...badge,
      unlocked: computed || earnedBadgeIds.includes(badge.id),
    };
  });
}

function buildNotifications(badges) {
  return badges.map((badge) => ({
    id: `notif-${badge.id}-${Date.now()}`,
    tone: 'teal',
    title: `${badge.icon} ${badge.title} unlocked`,
    body: badge.description,
  }));
}

function applyAssistantChunk(messages, chunk) {
  if (!messages.length) {
    return messages;
  }

  const nextMessages = [...messages];
  const lastMessage = nextMessages[nextMessages.length - 1];

  if (lastMessage.role === 'assistant') {
    nextMessages[nextMessages.length - 1] = {
      ...lastMessage,
      content: `${lastMessage.content}${chunk}`,
      streaming: true,
    };
  }

  return nextMessages;
}

function finalizeAssistantMessage(messages) {
  return messages.map((message, index) =>
    index === messages.length - 1 && message.role === 'assistant'
      ? {
          ...message,
          content: message.content.trim(),
          streaming: false,
        }
      : message
  );
}

function deriveSnapshot(state) {
  const gapMatrix = computeGapMatrix(state.skills, state.roleRequirements);
  const readinessScore = computeReadiness(gapMatrix);
  const radarData = computeRadarData(state.skills, state.roleRequirements);
  const weeklyTrend = buildWeeklyTrend(state.roadmap, state.skills);
  const activityData = buildActivityData(state.roadmap, state.skills);
  const milestones = buildMilestones(state.roadmap);
  const summary = buildSummary(state.skills, gapMatrix, readinessScore, state.roadmap);
  const badges = buildBadges(
    state.skills,
    state.roadmap,
    state.chatMessages,
    readinessScore,
    summary,
    state.earnedBadgeIds
  );

  return {
    gapMatrix,
    readinessScore,
    radarData,
    weeklyTrend,
    activityData,
    milestones,
    summary,
    badges,
    urgentTasks: milestones.filter((task) => !task.completed).slice(0, 5),
  };
}

function decorateState(current, partial) {
  const next = { ...current, ...partial };
  return {
    ...partial,
    ...deriveSnapshot(next),
  };
}

export const useSkillStore = create((set, get) => ({
  activePanel: 'overview',
  dashboardReady: false,
  isBooting: false,
  isSidebarOpen: true,
  isAddSkillOpen: false,
  isGeneratingRoadmap: false,
  isChatting: false,
  isImporting: false,
  error: null,
  targetRole: 'Frontend Developer',
  roleOptions: api.getRoleOptions(),
  roleRequirements: [],
  skills: [],
  roadmap: null,
  gapMatrix: [],
  readinessScore: 0,
  radarData: [],
  weeklyTrend: [],
  activityData: [],
  milestones: [],
  urgentTasks: [],
  summary: {
    skillsTracked: 0,
    gapsIdentified: 0,
    readinessScore: 0,
    tasksCompleted: 0,
    tasksTotal: 0,
    streakDays: 0,
    weeklyStudyMinutes: 0,
  },
  badges: buildBadges([], null, [starterAssistantMessage], 0, { streakDays: 0 }, []),
  notifications: [],
  chatMessages: [starterAssistantMessage],
  roadmapNarration: '',
  studyHours: 8,
  roadmapWeeks: 6,
  earnedBadgeIds: [],

  hydrate: async () => {
    if (get().isBooting) {
      return;
    }

    set({ isBooting: true, error: null });

    try {
      const targetRole = get().targetRole;
      const [skillsResponse, roadmapResponse, roleResponse] = await Promise.all([
        api.getSkills(),
        api.getRoadmap(),
        api.getRoleRequirements(targetRole),
      ]);

      const skills = (skillsResponse.skills ?? []).map(normalizeSkill);
      const roadmap = roadmapResponse.roadmap ?? null;
      const roleRequirements = roleResponse.requirements ?? [];
      const snapshot = decorateState(get(), {
        skills,
        roadmap,
        roleRequirements,
        dashboardReady: true,
        isBooting: false,
      });

      set(snapshot);
    } catch (error) {
      set({ isBooting: false, error: error.message, dashboardReady: true });
    }
  },

  setActivePanel: (activePanel) => set({ activePanel }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  openAddSkill: () => set({ isAddSkillOpen: true }),

  closeAddSkill: () => set({ isAddSkillOpen: false }),

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),

  addSkill: async (payload) => {
    try {
      const response = await api.addSkill(payload);
      // If api returned an updated existing skill rather than a new one, replace it
      const existingIndex = get().skills.findIndex(
        (s) => s.id === response.skill.id || s.name.toLowerCase() === response.skill.name.toLowerCase()
      );
      const skills =
        existingIndex >= 0
          ? get().skills.map((s, i) => (i === existingIndex ? normalizeSkill(response.skill) : s))
          : [normalizeSkill(response.skill), ...get().skills];
      const earnedBadgeIds = [
        ...new Set([
          ...get().earnedBadgeIds,
          ...(response.badgesUnlocked ?? []).map((badge) => badge.id),
        ]),
      ];
      const unlockedBadges = badgeCatalog.filter((badge) =>
        (response.badgesUnlocked ?? []).some((item) => item.id === badge.id)
      );

      set(
        decorateState(get(), {
          skills,
          earnedBadgeIds,
          notifications: [...buildNotifications(unlockedBadges), ...get().notifications].slice(0, 4),
          isAddSkillOpen: false,
        })
      );
    } catch (error) {
      set((state) => ({
        error: error.message,
        notifications: [
          {
            id: `notif-error-${Date.now()}`,
            tone: 'error',
            title: '⚠️ Could not add skill',
            body: error.message,
          },
          ...state.notifications,
        ].slice(0, 4),
      }));
    }
  },

  updateSkill: async (id, payload) => {
    try {
      const response = await api.updateSkill(id, payload);
      const skills = get().skills.map((skill) =>
        skill.id === id ? normalizeSkill(response.skill) : skill
      );
      set(decorateState(get(), { skills }));
    } catch (error) {
      set((state) => ({
        error: error.message,
        notifications: [
          {
            id: `notif-error-${Date.now()}`,
            tone: 'error',
            title: '⚠️ Could not update skill',
            body: error.message,
          },
          ...state.notifications,
        ].slice(0, 4),
      }));
    }
  },

  deleteSkill: async (id) => {
    try {
      await api.deleteSkill(id);
      const skills = get().skills.filter((skill) => skill.id !== id);
      set(decorateState(get(), { skills }));
    } catch (error) {
      set((state) => ({
        error: error.message,
        notifications: [
          {
            id: `notif-error-${Date.now()}`,
            tone: 'error',
            title: '⚠️ Could not delete skill',
            body: error.message,
          },
          ...state.notifications,
        ].slice(0, 4),
      }));
    }
  },

  adjustCategoryScore: (categoryKey, value) => {
    const relatedSkills = get().skills.filter((skill) => skill.category === categoryKey);
    let nextSkills = [...get().skills];

    if (!relatedSkills.length) {
      nextSkills = [
        {
          id: `seed-${categoryKey}`,
          name: `${axisCatalog.find((axis) => axis.key === categoryKey)?.label ?? 'Skill'} Core`,
          category: categoryKey,
          proficiency: value,
          source: 'manual',
          verified: false,
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...nextSkills,
      ];
    } else {
      const currentAverage = Math.round(
        relatedSkills.reduce((sum, skill) => sum + skill.proficiency, 0) / relatedSkills.length
      );
      const delta = value - currentAverage;
      nextSkills = nextSkills.map((skill) =>
        skill.category === categoryKey
          ? { ...skill, proficiency: clamp(skill.proficiency + delta) }
          : skill
      );
    }

    set(decorateState(get(), { skills: nextSkills }));
  },

  importResume: async (file) => {
    set({ isImporting: true });

    try {
      const response = await api.parseResume(file);
      const existingNames = new Set(get().skills.map((skill) => skill.name.toLowerCase()));
      const importedSkills = (response.skills ?? [])
        .map(normalizeSkill)
        .filter((skill) => !existingNames.has(skill.name.toLowerCase()));

      set(
        decorateState(get(), {
          isImporting: false,
          skills: [...importedSkills, ...get().skills],
        })
      );
    } catch (error) {
      set({ isImporting: false, error: error.message });
    }
  },

  importGithubProfile: async (username) => {
    set({ isImporting: true });

    try {
      const response = await api.importGithub(username);
      const existingNames = new Set(get().skills.map((skill) => skill.name.toLowerCase()));
      const importedSkills = (response.skills ?? [])
        .map(normalizeSkill)
        .filter((skill) => !existingNames.has(skill.name.toLowerCase()));

      set(
        decorateState(get(), {
          isImporting: false,
          skills: [...importedSkills, ...get().skills],
          notifications: [
            {
              id: `notif-import-${Date.now()}`,
              tone: 'indigo',
              title: 'GitHub import completed',
              body: `Inferred ${importedSkills.length} skills from ${response.username ?? 'GitHub'}.`,
            },
            ...get().notifications,
          ].slice(0, 4),
        })
      );
    } catch (error) {
      set({ isImporting: false, error: error.message });
    }
  },

  setTargetRole: async (targetRole) => {
    set({ targetRole, error: null });

    try {
      const response = await api.getRoleRequirements(targetRole);
      set(decorateState(get(), { targetRole, roleRequirements: response.requirements ?? [] }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  generateRoadmap: async () => {
    set({ isGeneratingRoadmap: true, roadmapNarration: '' });

    try {
      const result = await api.generateRoadmapStream(
        {
          targetRole: get().targetRole,
          skills: get().skills,
          gaps: get().gapMatrix,
          hoursPerWeek: get().studyHours,
          weeks: get().roadmapWeeks,
        },
        {
          onChunk: (chunk) =>
            set((state) => ({
              roadmapNarration: `${state.roadmapNarration}${chunk}`,
            })),
          onBadges: (badgesUnlocked) => {
            const badgeIds = badgesUnlocked.map((badge) => badge.id);
            const badges = badgeCatalog.filter((badge) => badgeIds.includes(badge.id));

            set((state) =>
              decorateState(state, {
                earnedBadgeIds: [...new Set([...state.earnedBadgeIds, ...badgeIds])],
                notifications: [...buildNotifications(badges), ...state.notifications].slice(0, 4),
              })
            );
          },
        }
      );

      set(
        decorateState(get(), {
          roadmap: result?.roadmap ?? null,
          isGeneratingRoadmap: false,
          activePanel: 'roadmap',
        })
      );
    } catch (error) {
      set((state) => ({
        isGeneratingRoadmap: false,
        error: error.message,
        notifications: [
          {
            id: `notif-error-${Date.now()}`,
            tone: 'error',
            title: '⚠️ Roadmap generation failed',
            body: error.message,
          },
          ...state.notifications,
        ].slice(0, 4),
      }));
    }
  },

  toggleRoadmapTask: async (taskId, completed) => {
    try {
      const response = await api.updateRoadmapTask(taskId, { completed });
      const badgeIds = (response.badgesUnlocked ?? []).map((badge) => badge.id);
      const badges = badgeCatalog.filter((badge) => badgeIds.includes(badge.id));

      set(
        decorateState(get(), {
          roadmap: response.roadmap ?? get().roadmap,
          earnedBadgeIds: [...new Set([...get().earnedBadgeIds, ...badgeIds])],
          notifications: [...buildNotifications(badges), ...get().notifications].slice(0, 4),
        })
      );
    } catch (error) {
      set({ error: error.message });
    }
  },

  setStudyHours: (studyHours) => set({ studyHours }),

  setRoadmapWeeks: (roadmapWeeks) => set({ roadmapWeeks }),

  sendCoachMessage: async (question) => {
    const nextMessages = [
      ...get().chatMessages,
      { id: `user-${Date.now()}`, role: 'user', content: question.trim() },
      { id: `assistant-${Date.now()}`, role: 'assistant', content: '', streaming: true },
    ];

    set(
      decorateState(get(), {
        chatMessages: nextMessages,
        isChatting: true,
      })
    );

    try {
      const result = await api.chatStream(
        {
          message: question,
          targetRole: get().targetRole,
          skills: get().skills,
          gaps: get().gapMatrix,
        },
        {
          onChunk: (chunk) =>
            set((state) => ({
              chatMessages: applyAssistantChunk(state.chatMessages, chunk),
            })),
          onBadges: (badgesUnlocked) => {
            const badgeIds = badgesUnlocked.map((badge) => badge.id);
            const badges = badgeCatalog.filter((badge) => badgeIds.includes(badge.id));

            set((state) =>
              decorateState(state, {
                earnedBadgeIds: [...new Set([...state.earnedBadgeIds, ...badgeIds])],
                notifications: [...buildNotifications(badges), ...state.notifications].slice(0, 4),
              })
            );
          },
        }
      );

      set(
        decorateState(get(), {
          chatMessages: finalizeAssistantMessage(
            result?.content
              ? [
                  ...get().chatMessages.slice(0, -1),
                  {
                    ...get().chatMessages.at(-1),
                    content: result.content,
                    streaming: false,
                  },
                ]
              : get().chatMessages
          ),
          isChatting: false,
        })
      );
    } catch (error) {
      set((state) => ({
        isChatting: false,
        error: error.message,
        chatMessages: finalizeAssistantMessage(state.chatMessages),
        notifications: [
          {
            id: `notif-error-${Date.now()}`,
            tone: 'error',
            title: '⚠️ AI Coach unavailable',
            body: 'Could not reach the coach. Please try again.',
          },
          ...state.notifications,
        ].slice(0, 4),
      }));
    }
  },

  suggestedQuestions: defaultSuggestions,
}));
