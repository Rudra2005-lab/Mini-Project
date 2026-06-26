import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

const roleCatalog = {
  'Frontend Developer': [
    { name: 'React', category: 'technical', target: 88, importance: 'critical' },
    { name: 'JavaScript', category: 'technical', target: 90, importance: 'critical' },
    { name: 'TypeScript', category: 'technical', target: 82, importance: 'high' },
    { name: 'Accessibility', category: 'domain', target: 78, importance: 'high' },
    { name: 'Testing', category: 'problem-solving', target: 76, importance: 'high' },
    { name: 'Communication', category: 'communication', target: 72, importance: 'high' },
    { name: 'System Design', category: 'leadership', target: 62, importance: 'medium' },
    { name: 'Product Thinking', category: 'soft-skills', target: 68, importance: 'medium' },
  ],
  'Backend Developer': [
    { name: 'Node.js', category: 'technical', target: 88, importance: 'critical' },
    { name: 'APIs', category: 'technical', target: 84, importance: 'critical' },
    { name: 'Databases', category: 'domain', target: 82, importance: 'critical' },
    { name: 'Security', category: 'problem-solving', target: 78, importance: 'high' },
    { name: 'Testing', category: 'problem-solving', target: 74, importance: 'high' },
    { name: 'Communication', category: 'communication', target: 68, importance: 'medium' },
    { name: 'Architecture', category: 'leadership', target: 72, importance: 'high' },
  ],
  'Full Stack Developer': [
    { name: 'React', category: 'technical', target: 84, importance: 'critical' },
    { name: 'Node.js', category: 'technical', target: 84, importance: 'critical' },
    { name: 'Databases', category: 'domain', target: 80, importance: 'high' },
    { name: 'System Design', category: 'leadership', target: 72, importance: 'high' },
    { name: 'Testing', category: 'problem-solving', target: 74, importance: 'high' },
    { name: 'Communication', category: 'communication', target: 72, importance: 'medium' },
  ],
  'Data Scientist': [
    { name: 'Python', category: 'technical', target: 90, importance: 'critical' },
    { name: 'Machine Learning', category: 'technical', target: 86, importance: 'critical' },
    { name: 'Statistics', category: 'problem-solving', target: 88, importance: 'critical' },
    { name: 'SQL', category: 'technical', target: 78, importance: 'high' },
    { name: 'Storytelling', category: 'communication', target: 72, importance: 'high' },
    { name: 'Domain Research', category: 'domain', target: 70, importance: 'medium' },
  ],
  'Data Analyst': [
    { name: 'SQL', category: 'technical', target: 86, importance: 'critical' },
    { name: 'Excel', category: 'technical', target: 78, importance: 'high' },
    { name: 'Visualization', category: 'technical', target: 80, importance: 'high' },
    { name: 'Statistics', category: 'problem-solving', target: 76, importance: 'high' },
    { name: 'Communication', category: 'communication', target: 74, importance: 'high' },
  ],
  'Product Manager': [
    { name: 'Product Strategy', category: 'leadership', target: 84, importance: 'critical' },
    { name: 'Communication', category: 'communication', target: 88, importance: 'critical' },
    { name: 'Roadmapping', category: 'leadership', target: 80, importance: 'high' },
    { name: 'Analytics', category: 'problem-solving', target: 74, importance: 'high' },
    { name: 'User Research', category: 'domain', target: 76, importance: 'high' },
  ],
  'UI/UX Designer': [
    { name: 'Design Systems', category: 'technical', target: 84, importance: 'critical' },
    { name: 'Figma', category: 'technical', target: 86, importance: 'critical' },
    { name: 'Research', category: 'domain', target: 78, importance: 'high' },
    { name: 'Accessibility', category: 'domain', target: 74, importance: 'high' },
    { name: 'Storytelling', category: 'communication', target: 72, importance: 'medium' },
  ],
  'DevOps Engineer': [
    { name: 'CI/CD', category: 'technical', target: 86, importance: 'critical' },
    { name: 'Cloud', category: 'domain', target: 84, importance: 'critical' },
    { name: 'Containers', category: 'technical', target: 80, importance: 'high' },
    { name: 'Monitoring', category: 'problem-solving', target: 76, importance: 'high' },
    { name: 'Incident Response', category: 'leadership', target: 70, importance: 'medium' },
  ],
  'QA Engineer': [
    { name: 'Testing', category: 'problem-solving', target: 90, importance: 'critical' },
    { name: 'Automation', category: 'technical', target: 82, importance: 'critical' },
    { name: 'Bug Triage', category: 'leadership', target: 72, importance: 'high' },
    { name: 'Communication', category: 'communication', target: 74, importance: 'high' },
  ],
  'Mobile Developer': [
    { name: 'React Native', category: 'technical', target: 84, importance: 'critical' },
    { name: 'Performance', category: 'problem-solving', target: 80, importance: 'high' },
    { name: 'State Management', category: 'technical', target: 76, importance: 'high' },
    { name: 'Accessibility', category: 'domain', target: 70, importance: 'medium' },
  ],
  'Machine Learning Engineer': [
    { name: 'Python', category: 'technical', target: 90, importance: 'critical' },
    { name: 'MLOps', category: 'technical', target: 82, importance: 'high' },
    { name: 'Model Serving', category: 'domain', target: 78, importance: 'high' },
    { name: 'Statistics', category: 'problem-solving', target: 82, importance: 'high' },
  ],
  'Cybersecurity Analyst': [
    { name: 'Threat Detection', category: 'problem-solving', target: 84, importance: 'critical' },
    { name: 'Security', category: 'domain', target: 86, importance: 'critical' },
    { name: 'Networking', category: 'technical', target: 74, importance: 'high' },
    { name: 'Communication', category: 'communication', target: 68, importance: 'medium' },
  ],
  'Cloud Engineer': [
    { name: 'Cloud', category: 'domain', target: 88, importance: 'critical' },
    { name: 'Infrastructure as Code', category: 'technical', target: 82, importance: 'high' },
    { name: 'Security', category: 'problem-solving', target: 74, importance: 'high' },
    { name: 'Automation', category: 'technical', target: 78, importance: 'high' },
  ],
  'AI Engineer': [
    { name: 'Python', category: 'technical', target: 88, importance: 'critical' },
    { name: 'LLM Apps', category: 'technical', target: 84, importance: 'critical' },
    { name: 'Prompt Design', category: 'communication', target: 76, importance: 'high' },
    { name: 'Evaluation', category: 'problem-solving', target: 78, importance: 'high' },
  ],
  'Business Analyst': [
    { name: 'Requirements Gathering', category: 'communication', target: 86, importance: 'critical' },
    { name: 'Process Mapping', category: 'leadership', target: 78, importance: 'high' },
    { name: 'Analytics', category: 'problem-solving', target: 72, importance: 'high' },
    { name: 'Documentation', category: 'communication', target: 80, importance: 'high' },
  ],
  'Product Designer': [
    { name: 'User Research', category: 'domain', target: 80, importance: 'critical' },
    { name: 'Design Systems', category: 'technical', target: 82, importance: 'high' },
    { name: 'Prototyping', category: 'technical', target: 84, importance: 'high' },
    { name: 'Communication', category: 'communication', target: 74, importance: 'medium' },
  ],
  'Technical Writer': [
    { name: 'Documentation', category: 'communication', target: 90, importance: 'critical' },
    { name: 'Developer Tooling', category: 'technical', target: 68, importance: 'medium' },
    { name: 'Research', category: 'domain', target: 74, importance: 'high' },
    { name: 'Information Design', category: 'soft-skills', target: 76, importance: 'high' },
  ],
  'Solutions Engineer': [
    { name: 'Technical Communication', category: 'communication', target: 88, importance: 'critical' },
    { name: 'APIs', category: 'technical', target: 78, importance: 'high' },
    { name: 'Discovery', category: 'soft-skills', target: 74, importance: 'high' },
    { name: 'Architecture', category: 'leadership', target: 70, importance: 'medium' },
  ],
  'Engineering Manager': [
    { name: 'Leadership', category: 'leadership', target: 90, importance: 'critical' },
    { name: 'Coaching', category: 'communication', target: 84, importance: 'high' },
    { name: 'Architecture', category: 'technical', target: 68, importance: 'high' },
    { name: 'Planning', category: 'soft-skills', target: 82, importance: 'high' },
  ],
  'Site Reliability Engineer': [
    { name: 'Observability', category: 'technical', target: 84, importance: 'critical' },
    { name: 'Incident Response', category: 'leadership', target: 78, importance: 'high' },
    { name: 'Automation', category: 'technical', target: 80, importance: 'high' },
    { name: 'Cloud', category: 'domain', target: 78, importance: 'high' },
  ],
};

const STORAGE_KEY = 'skillspring_mock_state';

const defaultMockState = {
  skills: [
    {
      id: 'skill-react',
      userId: 'local-dev',
      name: 'React',
      category: 'technical',
      proficiency: 84,
      source: 'manual',
      verified: true,
      addedAt: '2026-03-10T10:00:00.000Z',
      updatedAt: '2026-04-05T10:00:00.000Z',
    },
    {
      id: 'skill-javascript',
      userId: 'local-dev',
      name: 'JavaScript',
      category: 'technical',
      proficiency: 88,
      source: 'github',
      verified: true,
      addedAt: '2026-03-08T10:00:00.000Z',
      updatedAt: '2026-04-02T10:00:00.000Z',
    },
    {
      id: 'skill-typescript',
      userId: 'local-dev',
      name: 'TypeScript',
      category: 'technical',
      proficiency: 66,
      source: 'manual',
      verified: false,
      addedAt: '2026-03-18T10:00:00.000Z',
      updatedAt: '2026-04-02T10:00:00.000Z',
    },
    {
      id: 'skill-communication',
      userId: 'local-dev',
      name: 'Communication',
      category: 'communication',
      proficiency: 71,
      source: 'manual',
      verified: true,
      addedAt: '2026-03-06T10:00:00.000Z',
      updatedAt: '2026-04-02T10:00:00.000Z',
    },
    {
      id: 'skill-problem-solving',
      userId: 'local-dev',
      name: 'Problem Solving',
      category: 'problem-solving',
      proficiency: 79,
      source: 'manual',
      verified: true,
      addedAt: '2026-03-09T10:00:00.000Z',
      updatedAt: '2026-04-03T10:00:00.000Z',
    },
    {
      id: 'skill-leadership',
      userId: 'local-dev',
      name: 'Leadership',
      category: 'leadership',
      proficiency: 48,
      source: 'manual',
      verified: false,
      addedAt: '2026-03-20T10:00:00.000Z',
      updatedAt: '2026-04-03T10:00:00.000Z',
    },
    {
      id: 'skill-domain',
      userId: 'local-dev',
      name: 'Accessibility',
      category: 'domain',
      proficiency: 58,
      source: 'manual',
      verified: false,
      addedAt: '2026-03-23T10:00:00.000Z',
      updatedAt: '2026-04-03T10:00:00.000Z',
    },
    {
      id: 'skill-soft',
      userId: 'local-dev',
      name: 'Product Thinking',
      category: 'soft-skills',
      proficiency: 63,
      source: 'manual',
      verified: false,
      addedAt: '2026-03-24T10:00:00.000Z',
      updatedAt: '2026-04-03T10:00:00.000Z',
    },
  ],
  roadmap: {
    id: 'roadmap-local-dev',
    userId: 'local-dev',
    targetRole: 'Frontend Developer',
    generatedAt: '2026-04-06T09:00:00.000Z',
    gapScore: 78,
    weeks: [
      {
        id: 'week-1',
        weekNumber: 1,
        goal: 'Solidify testing habits in component-driven UIs.',
        estimatedHours: 7,
        tasks: [
          { id: 'task-1', title: 'Add RTL tests for one dashboard widget', completed: true, completedAt: '2026-04-07T15:00:00.000Z' },
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
      {
        id: 'week-2',
        weekNumber: 2,
        goal: 'Improve TypeScript confidence in app-level state and APIs.',
        estimatedHours: 8,
        tasks: [
          { id: 'task-3', title: 'Model a Zustand store with typed actions', completed: false, completedAt: null },
          { id: 'task-4', title: 'Refactor one API service to typed request helpers', completed: false, completedAt: null },
        ],
        resources: [
          {
            title: 'TypeScript with React Patterns',
            url: 'https://www.typescriptlang.org/docs/handbook/react.html',
            type: 'article',
            platform: 'TypeScript',
            durationMinutes: 42,
          },
        ],
      },
      {
        id: 'week-3',
        weekNumber: 3,
        goal: 'Practice architecture choices and tradeoff communication.',
        estimatedHours: 6,
        tasks: [
          { id: 'task-5', title: 'Diagram one feature flow end-to-end', completed: false, completedAt: null },
          { id: 'task-6', title: 'Write a short ADR for state management', completed: false, completedAt: null },
        ],
        resources: [
          {
            title: 'Frontend Architecture Decision Guide',
            url: 'https://web.dev/learn/design',
            type: 'article',
            platform: 'web.dev',
            durationMinutes: 30,
          },
        ],
      },
    ],
  },
};

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultMockState;
  } catch (e) {
    return defaultMockState;
  }
};

const mockState = loadState();

const saveState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockState));
  } catch (e) {
    console.warn('Failed to save mock state to localStorage');
  }
};

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeSkill(skill) {
  return {
    ...skill,
    id: skill.id ?? skill._id ?? createId('skill'),
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

function calculateGapScore(skills, requirements) {
  const gapMatrix = computeGapMatrix(skills, requirements);

  if (!gapMatrix.length) {
    return 0;
  }

  const weightMap = {
    critical: 1.35,
    high: 1.15,
    medium: 1,
  };

  const totalWeight = gapMatrix.reduce((sum, item) => sum + (weightMap[item.importance] ?? 1), 0);
  const weightedScore = gapMatrix.reduce((sum, item) => {
    const weight = weightMap[item.importance] ?? 1;
    return sum + item.readiness * weight;
  }, 0);

  return Math.round(weightedScore / totalWeight);
}

function createRoadmapFromGaps({ targetRole, skills, gaps, hoursPerWeek = 8, weeks = 6 }) {
  const prioritizedGaps = gaps.length
    ? gaps
        .filter((item) => item.gap > 0)
        .sort((left, right) => right.gap - left.gap)
        .slice(0, Math.max(3, Math.min(weeks, 5)))
    : computeGapMatrix(skills, roleCatalog[targetRole] ?? roleCatalog['Frontend Developer']).slice(0, 4);

  return {
    id: createId('roadmap'),
    userId: 'local-dev',
    targetRole,
    generatedAt: new Date().toISOString(),
    gapScore: calculateGapScore(skills, roleCatalog[targetRole] ?? []),
    weeks: Array.from({ length: weeks }, (_, index) => {
      const focus = prioritizedGaps[index % prioritizedGaps.length];
      const weekNumber = index + 1;
      const focusName = focus?.name ?? 'Career momentum';

      return {
        id: `week-${weekNumber}`,
        weekNumber,
        goal: `Move ${focusName} from visible gap to interview-ready signal.`,
        estimatedHours: hoursPerWeek,
        tasks: [
          {
            id: createId('task'),
            title: `Study one practical concept in ${focusName}`,
            completed: false,
            completedAt: null,
          },
          {
            id: createId('task'),
            title: `Ship a portfolio artifact that proves ${focusName}`,
            completed: false,
            completedAt: null,
          },
          {
            id: createId('task'),
            title: `Reflect on tradeoffs and capture learnings in notes`,
            completed: false,
            completedAt: null,
          },
        ],
        resources: [
          {
            title: `${focusName} handbook`,
            url: 'https://roadmap.sh',
            type: 'article',
            platform: 'roadmap.sh',
            durationMinutes: 25,
          },
          {
            title: `${targetRole} practice walkthrough`,
            url: 'https://www.youtube.com/',
            type: 'video',
            platform: 'YouTube',
            durationMinutes: 36,
          },
          {
            title: `${focusName} guided project`,
            url: 'https://www.freecodecamp.org/',
            type: 'course',
            platform: 'freeCodeCamp',
            durationMinutes: 55,
          },
        ],
      };
    }),
  };
}

async function parseSseResponse(response, handlers = {}) {
  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error('Readable stream unavailable.');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const packets = buffer.split('\n\n');
    buffer = packets.pop() ?? '';

    packets.forEach((packet) => {
      const lines = packet.split('\n').filter(Boolean);
      let event = 'message';
      const data = [];

      lines.forEach((line) => {
        if (line.startsWith('event:')) {
          event = line.replace('event:', '').trim();
        }

        if (line.startsWith('data:')) {
          data.push(line.replace('data:', '').trim());
        }
      });

      if (!data.length) {
        return;
      }

      const payload = JSON.parse(data.join('\n'));
      handlers.onEvent?.(event, payload);
    });
  }
}

async function streamRequest(path, payload, handlers, fallback) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'text/event-stream',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Streaming request failed with status ${response.status}`);
    }

    let finalPayload = null;

    await parseSseResponse(response, {
      onEvent: (event, eventPayload) => {
        if (event === 'token') {
          handlers?.onChunk?.(eventPayload.token ?? '');
        }

        if (event === 'roadmap' || event === 'message') {
          finalPayload = eventPayload;
        }

        if (event === 'badges') {
          handlers?.onBadges?.(eventPayload.badges ?? []);
        }

        if (event === 'error') {
          throw new Error(eventPayload.message ?? 'Unknown streaming error');
        }
      },
    });

    return finalPayload;
  } catch (error) {
    return fallback(error);
  }
}

async function withFallback(request, fallback) {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    return fallback(error);
  }
}

function awardBadges(ids) {
  return ids.map((id) => ({ id, earnedAt: new Date().toISOString() }));
}

export const api = {
  getRoleOptions() {
    return Object.keys(roleCatalog);
  },

  async getSkills() {
    return withFallback(
      () => http.get('/api/skills'),
      async () => {
        await delay(220);
        return { skills: clone(mockState.skills), source: 'mock' };
      }
    );
  },

  async addSkill(payload) {
    return withFallback(
      () => http.post('/api/skills', payload),
      async () => {
        await delay(180);
        
        const trimmedName = payload.name.trim();
        const existingIndex = mockState.skills.findIndex(
          (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (existingIndex >= 0) {
          // Soft update if skill already exists
          mockState.skills[existingIndex] = {
            ...mockState.skills[existingIndex],
            proficiency: payload.proficiency,
            updatedAt: new Date().toISOString(),
          };
          saveState();
          return { skill: clone(mockState.skills[existingIndex]) };
        }

        const skill = normalizeSkill({
          ...payload,
          name: trimmedName,
          id: createId('skill'),
          userId: 'local-dev',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          verified: payload.verified ?? false,
        });

        mockState.skills.unshift(skill);
        saveState();

        return {
          skill,
          badgesUnlocked: mockState.skills.length === 1 ? awardBadges(['first-step']) : [],
        };
      }
    );
  },

  async updateSkill(id, payload) {
    return withFallback(
      () => http.put(`/api/skills/${id}`, payload),
      async () => {
        await delay(160);
        const index = mockState.skills.findIndex((skill) => skill.id === id);

        if (index < 0) {
          throw new Error('Skill not found.');
        }

        mockState.skills[index] = {
          ...mockState.skills[index],
          ...payload,
          updatedAt: new Date().toISOString(),
        };
        saveState();

        return { skill: clone(mockState.skills[index]) };
      }
    );
  },

  async deleteSkill(id) {
    return withFallback(
      () => http.delete(`/api/skills/${id}`),
      async () => {
        await delay(160);
        mockState.skills = mockState.skills.filter((skill) => skill.id !== id);
        saveState();
        return { id };
      }
    );
  },

  async parseResume(file) {
    const formData = new FormData();
    formData.append('resume', file);

    return withFallback(
      () =>
        http.post('/api/skills/parse-resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
      async () => {
        await delay(800);
        const inferredSkills = [
          { name: 'Node.js', category: 'technical', proficiency: 68 },
          { name: 'APIs', category: 'technical', proficiency: 73 },
          { name: 'Testing', category: 'problem-solving', proficiency: 61 },
        ].map((skill) =>
          normalizeSkill({
            ...skill,
            source: 'resume',
            verified: true,
            userId: 'local-dev',
            id: createId('skill'),
            addedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        );

        mockState.skills = [...inferredSkills, ...mockState.skills];
        return { skills: inferredSkills };
      }
    );
  },

  async importGithub(username) {
    return withFallback(
      () => http.post('/api/skills/import-github', { username }),
      async () => {
        await delay(720);
        const inferredSkills = [
          { name: 'GitHub Actions', category: 'technical', proficiency: 64 },
          { name: 'REST APIs', category: 'technical', proficiency: 72 },
          { name: 'Documentation', category: 'communication', proficiency: 69 },
        ].map((skill) =>
          normalizeSkill({
            ...skill,
            source: 'github',
            verified: true,
            userId: 'local-dev',
            id: createId('skill'),
            addedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        );

        mockState.skills = [...inferredSkills, ...mockState.skills];
        return { skills: inferredSkills, reposAnalyzed: 4, username };
      }
    );
  },

  async getRoleRequirements(role) {
    return withFallback(
      () => http.get(`/api/ai/role-requirements/${encodeURIComponent(role)}`),
      async () => {
        await delay(140);
        return {
          role,
          requirements: clone(roleCatalog[role] ?? roleCatalog['Frontend Developer']),
          frameworks: ['SFIA', 'O*NET'],
        };
      }
    );
  },

  async analyzeGaps({ skills, targetRole }) {
    return withFallback(
      () => http.post('/api/ai/analyze-gaps', { skills, targetRole }),
      async () => {
        await delay(220);
        const requirements = roleCatalog[targetRole] ?? [];
        const matrix = computeGapMatrix(skills, requirements);

        return {
          targetRole,
          readinessScore: calculateGapScore(skills, requirements),
          priorities: matrix.filter((item) => item.gap > 0).sort((left, right) => right.gap - left.gap),
          matrix,
        };
      }
    );
  },

  async getRoadmap() {
    return withFallback(
      () => http.get('/api/roadmap'),
      async () => {
        await delay(220);
        return { roadmap: clone(mockState.roadmap) };
      }
    );
  },

  async updateRoadmapTask(id, payload) {
    return withFallback(
      () => http.put(`/api/roadmap/task/${id}`, payload),
      async () => {
        await delay(160);
        mockState.roadmap?.weeks.forEach((week) => {
          week.tasks = week.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: payload.completed,
                  completedAt: payload.completed ? new Date().toISOString() : null,
                }
              : task
          );
        });
        saveState();

        return {
          roadmap: clone(mockState.roadmap),
          badgesUnlocked: payload.completed ? awardBadges(['on-fire']) : [],
        };
      }
    );
  },

  async generateRoadmapStream(payload, handlers = {}) {
    return streamRequest(
      '/api/roadmap/generate',
      payload,
      handlers,
      async () => {
        const requirements = roleCatalog[payload.targetRole] ?? roleCatalog['Frontend Developer'];
        const gaps = computeGapMatrix(payload.skills ?? mockState.skills, requirements);
        const roadmap = createRoadmapFromGaps({
          targetRole: payload.targetRole,
          skills: payload.skills ?? mockState.skills,
          gaps,
          hoursPerWeek: payload.hoursPerWeek,
          weeks: payload.weeks,
        });

        const teaser = `Building a ${payload.weeks}-week plan focused on ${gaps
          .slice(0, 3)
          .map((item) => item.name)
          .join(', ')}.`;

        for (const token of teaser.split(' ')) {
          handlers.onChunk?.(`${token} `);
          await delay(60);
        }

        mockState.roadmap = roadmap;
        saveState();

        const result = {
          roadmap,
          badgesUnlocked: awardBadges(['pathfinder']),
        };

        handlers.onBadges?.(result.badgesUnlocked);

        return result;
      }
    );
  },

  async chatStream(payload, handlers = {}) {
    return streamRequest(
      '/api/ai/chat',
      payload,
      handlers,
      async () => {
        let answer = '';
        const q = payload.message.trim().toLowerCase();

        if (q === 'what should i learn first?') {
          answer = "Based on your current gap matrix, I highly recommend prioritizing **React Performance Optimization** and **System Design Fundamentals**. These represent the biggest delta between your current level and the role requirements. Start with a small side project to implement them hands-on.";
        } else if (q === 'rate my progress') {
          answer = "Your progress over the past two weeks is excellent! Your streak consistency is high, and your readiness score is ticking upwards. However, to stay on track for your target role, make sure not to neglect the backend architecture tasks sitting in your roadmap.";
        } else if (q === 'quiz me on react') {
          answer = "Alright, let's test your React skills! \n\n**Question 1:** What is the primary difference between `useMemo` and `useCallback`? \n\n**Question 2:** Explain the rules of hooks and why they must be called at the top level. \n\nTake your time and reply with your answers!";
        } else {
          const priorities = computeGapMatrix(
            payload.skills ?? mockState.skills,
            roleCatalog[payload.targetRole] ?? roleCatalog['Frontend Developer']
          )
            .filter((item) => item.gap > 0)
            .sort((left, right) => right.gap - left.gap)
            .slice(0, 3)
            .map((item) => item.name);

          answer = `Start with ${priorities[0] ?? 'your highest gap'}, then reinforce it with one project and one reflection loop. Your next best move is to practice ${priorities[1] ?? 'communication'} in public by writing short build notes.`;
        }

        for (const token of answer.split(' ')) {
          handlers.onChunk?.(`${token} `);
          await delay(40); // slightly faster streaming for predefined UX
        }

        const result = {
          content: answer,
          badgesUnlocked: awardBadges(['coached']),
        };

        handlers.onBadges?.(result.badgesUnlocked);

        return result;
      }
    );
  },
};

export function getRoleCatalog() {
  return roleCatalog;
}

export function getMockRoadmapPreview() {
  return clone(mockState.roadmap);
}

export function getMockSkillsPreview() {
  return clone(mockState.skills);
}

export function buildQuickRoadmap(payload) {
  const requirements = roleCatalog[payload.targetRole] ?? roleCatalog['Frontend Developer'];
  const gaps = computeGapMatrix(payload.skills ?? mockState.skills, requirements);
  return createRoadmapFromGaps({ ...payload, gaps });
}
