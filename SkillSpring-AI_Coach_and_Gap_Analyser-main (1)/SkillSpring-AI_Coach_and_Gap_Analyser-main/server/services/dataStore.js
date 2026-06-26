const { isDbReady } = require('../config/db');
const User = require('../models/User');
const Skill = require('../models/Skill');
const LearningPath = require('../models/LearningPath');
const Progress = require('../models/Progress');

const clone = (value) => JSON.parse(JSON.stringify(value));

const memory = {
  users: new Map(),
  skills: [
    {
      id: 'skill-react',
      userId: 'local-dev',
      name: 'React',
      category: 'technical',
      proficiency: 84,
      source: 'manual',
      verified: true,
      addedAt: new Date('2026-03-10T10:00:00.000Z'),
      updatedAt: new Date('2026-04-05T10:00:00.000Z'),
    },
    {
      id: 'skill-javascript',
      userId: 'local-dev',
      name: 'JavaScript',
      category: 'technical',
      proficiency: 88,
      source: 'github',
      verified: true,
      addedAt: new Date('2026-03-08T10:00:00.000Z'),
      updatedAt: new Date('2026-04-02T10:00:00.000Z'),
    },
    {
      id: 'skill-typescript',
      userId: 'local-dev',
      name: 'TypeScript',
      category: 'technical',
      proficiency: 66,
      source: 'manual',
      verified: false,
      addedAt: new Date('2026-03-18T10:00:00.000Z'),
      updatedAt: new Date('2026-04-02T10:00:00.000Z'),
    },
  ],
  roadmap: {
    id: 'roadmap-local-dev',
    userId: 'local-dev',
    targetRole: 'Frontend Developer',
    generatedAt: new Date('2026-04-06T09:00:00.000Z'),
    gapScore: 78,
    weeks: [
      {
        id: 'week-1',
        weekNumber: 1,
        goal: 'Solidify testing habits in component-driven UIs.',
        estimatedHours: 7,
        tasks: [
          { id: 'task-1', title: 'Add RTL tests for one dashboard widget', completed: true, completedAt: new Date('2026-04-07T15:00:00.000Z') },
          { id: 'task-2', title: 'Write a checklist for accessibility regressions', completed: false, completedAt: null },
        ],
        resources: [
          {
            title: 'React Testing Library Crash Course',
            url: 'https://testing-library.com/docs/react-testing-library/intro/',
            type: 'article',
            platform: 'Testing Library',
            durationMinutes: 35,
          },
        ],
      },
    ],
  },
  progress: {
    userId: 'local-dev',
    date: new Date(),
    skillsAdded: 3,
    tasksCompleted: 1,
    studyMinutes: 180,
    streakDays: 5,
    badges: [],
  },
};

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeSkill(skill) {
  return {
    ...skill,
    id: skill.id ?? skill._id?.toString() ?? createId('skill'),
  };
}

async function ensureUser(user) {
  if (isDbReady()) {
    await User.findOneAndUpdate({ id: user.id }, user, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    return;
  }

  const existing = memory.users.get(user.id) ?? {};
  memory.users.set(user.id, { ...existing, ...clone(user) });
}

async function getUser(userId) {
  if (isDbReady()) {
    return User.findOne({ id: userId }).lean();
  }

  return memory.users.get(userId) ?? {
    id: userId,
    earnedBadges: [],
    chatCount: 0,
    targetRole: 'Frontend Developer',
  };
}

async function listSkills(userId) {
  if (isDbReady()) {
    const skills = await Skill.find({ userId }).sort({ updatedAt: -1 }).lean();
    return skills.map(normalizeSkill);
  }

  return clone(memory.skills.filter((skill) => skill.userId === userId)).map(normalizeSkill);
}

async function createSkill(userId, payload) {
  if (isDbReady()) {
    const skill = await Skill.create({
      ...payload,
      userId,
      addedAt: new Date(),
      updatedAt: new Date(),
    });
    return normalizeSkill(skill.toObject());
  }

  const skill = normalizeSkill({
    ...payload,
    id: createId('skill'),
    userId,
    addedAt: new Date(),
    updatedAt: new Date(),
  });

  memory.skills.unshift(skill);
  return clone(skill);
}

async function bulkUpsertSkills(userId, skills) {
  const existing = await listSkills(userId);
  const existingByName = new Map(existing.map((skill) => [skill.name.toLowerCase(), skill]));
  const results = [];

  for (const candidate of skills) {
    const previous = existingByName.get(candidate.name.toLowerCase());

    if (previous) {
      const updated = await updateSkill(userId, previous.id, {
        proficiency: Math.max(previous.proficiency, candidate.proficiency ?? previous.proficiency),
        source: candidate.source ?? previous.source,
        verified: candidate.verified ?? previous.verified,
        category: candidate.category ?? previous.category,
      });
      results.push(updated);
    } else {
      results.push(await createSkill(userId, candidate));
    }
  }

  return results;
}

async function updateSkill(userId, skillId, payload) {
  if (isDbReady()) {
    const skill = await Skill.findOneAndUpdate(
      {
        userId,
        $or: [{ _id: skillId }, { id: skillId }],
      },
      { ...payload, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!skill) {
      return null;
    }

    return normalizeSkill(skill);
  }

  const index = memory.skills.findIndex((skill) => skill.userId === userId && skill.id === skillId);

  if (index < 0) {
    return null;
  }

  memory.skills[index] = {
    ...memory.skills[index],
    ...payload,
    updatedAt: new Date(),
  };

  return clone(memory.skills[index]);
}

async function deleteSkill(userId, skillId) {
  if (isDbReady()) {
    const deleted = await Skill.findOneAndDelete({
      userId,
      $or: [{ _id: skillId }, { id: skillId }],
    }).lean();
    return deleted ? normalizeSkill(deleted) : null;
  }

  const index = memory.skills.findIndex((skill) => skill.userId === userId && skill.id === skillId);

  if (index < 0) {
    return null;
  }

  const [deleted] = memory.skills.splice(index, 1);
  return clone(deleted);
}

async function getRoadmap(userId) {
  if (isDbReady()) {
    const roadmap = await LearningPath.findOne({ userId }).sort({ generatedAt: -1 }).lean();
    return roadmap
      ? {
          ...roadmap,
          id: roadmap._id.toString(),
        }
      : null;
  }

  return memory.roadmap?.userId === userId ? clone(memory.roadmap) : null;
}

async function saveRoadmap(userId, roadmap) {
  if (isDbReady()) {
    const saved = await LearningPath.findOneAndUpdate(
      { userId },
      { ...roadmap, userId, generatedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return {
      ...saved,
      id: saved._id.toString(),
    };
  }

  memory.roadmap = {
    ...roadmap,
    id: roadmap.id ?? createId('roadmap'),
    userId,
    generatedAt: new Date(),
  };
  return clone(memory.roadmap);
}

async function updateRoadmapTask(userId, taskId, completed) {
  if (isDbReady()) {
    const roadmap = await LearningPath.findOne({ userId });

    if (!roadmap) {
      return null;
    }

    roadmap.weeks = roadmap.weeks.map((week) => ({
      ...week.toObject(),
      tasks: week.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task.toObject(),
              completed,
              completedAt: completed ? new Date() : null,
            }
          : task.toObject()
      ),
    }));

    await roadmap.save();
    return getRoadmap(userId);
  }

  if (!memory.roadmap || memory.roadmap.userId !== userId) {
    return null;
  }

  memory.roadmap.weeks = memory.roadmap.weeks.map((week) => ({
    ...week,
    tasks: week.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed,
            completedAt: completed ? new Date() : null,
          }
        : task
    ),
  }));

  return clone(memory.roadmap);
}

async function getProgress(userId) {
  if (isDbReady()) {
    const progress = await Progress.findOne({ userId }).sort({ date: -1 }).lean();
    return progress ?? null;
  }

  return memory.progress.userId === userId ? clone(memory.progress) : null;
}

async function updateProgress(userId, payload) {
  if (isDbReady()) {
    const progress = await Progress.findOneAndUpdate(
      { userId },
      { ...payload, userId, date: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    return progress;
  }

  memory.progress = {
    ...memory.progress,
    ...payload,
    userId,
    date: new Date(),
  };
  return clone(memory.progress);
}

async function addEarnedBadges(userId, badges) {
  const badgeIds = badges.map((badge) => badge.id);

  if (isDbReady()) {
    const user = await User.findOneAndUpdate(
      { id: userId },
      { $addToSet: { earnedBadges: { $each: badgeIds } } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return user.earnedBadges ?? [];
  }

  const user = (await getUser(userId)) ?? { id: userId, earnedBadges: [], chatCount: 0 };
  const earnedBadges = [...new Set([...(user.earnedBadges ?? []), ...badgeIds])];
  memory.users.set(userId, { ...user, earnedBadges });
  return earnedBadges;
}

async function incrementChatCount(userId) {
  if (isDbReady()) {
    const user = await User.findOneAndUpdate(
      { id: userId },
      { $inc: { chatCount: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return user.chatCount ?? 1;
  }

  const user = (await getUser(userId)) ?? { id: userId, earnedBadges: [], chatCount: 0 };
  const nextChatCount = (user.chatCount ?? 0) + 1;
  memory.users.set(userId, { ...user, chatCount: nextChatCount });
  return nextChatCount;
}

module.exports = {
  ensureUser,
  getUser,
  listSkills,
  createSkill,
  bulkUpsertSkills,
  updateSkill,
  deleteSkill,
  getRoadmap,
  saveRoadmap,
  updateRoadmapTask,
  getProgress,
  updateProgress,
  addEarnedBadges,
  incrementChatCount,
};

