const {
  getRoadmap,
  listSkills,
  saveRoadmap,
  updateRoadmapTask,
  addEarnedBadges,
} = require('../services/dataStore');
const { getRoleRequirements } = require('../services/roleCatalog');
const { computeGapMatrix, calculateReadinessScore } = require('../services/gapAnalysis');
const { evaluateRoadmapBadges, evaluateTaskBadges } = require('../services/badgeService');
const { generateRoadmap } = require('../services/openaiService');

function sendSseEvent(res, event, payload) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function mapWeeksToLearningPath(weeks, targetRole, gapScore, hoursPerWeek) {
  return {
    targetRole,
    gapScore,
    weeks: weeks.map((week, index) => ({
      id: `week-${week.week ?? index + 1}`,
      weekNumber: week.week ?? index + 1,
      goal: week.goal,
      estimatedHours: hoursPerWeek,
      tasks: (week.tasks ?? []).map((task, taskIndex) => ({
        id: `task-${index + 1}-${taskIndex + 1}-${Math.random().toString(36).slice(2, 6)}`,
        title: typeof task === 'string' ? task : task.title,
        completed: false,
        completedAt: null,
      })),
      resources: (week.resources ?? []).map((resource) => ({
        title: resource.title,
        url: resource.url,
        type: resource.type,
        platform: resource.platform ?? resource.type ?? 'Resource',
        durationMinutes: Number.parseInt(resource.duration, 10) || resource.durationMinutes || 30,
      })),
    })),
  };
}

async function fetchRoadmap(req, res, next) {
  try {
    const roadmap = await getRoadmap(req.user.id);
    res.json({ roadmap });
  } catch (error) {
    next(error);
  }
}

async function streamRoadmap(req, res, next) {
  try {
    res.writeHead(200, {
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });

    const skills = req.body.skills ?? (await listSkills(req.user.id));
    const hadRoadmap = Boolean(await getRoadmap(req.user.id));
    const requirements = getRoleRequirements(req.body.targetRole);
    const gapMatrix = computeGapMatrix(skills, requirements);
    const gapScore = calculateReadinessScore(gapMatrix);
    const prioritizedGaps = gapMatrix.filter((item) => item.gap > 0).slice(0, 5);

    const aiRoadmap = await generateRoadmap({
      gaps: prioritizedGaps,
      targetRole: req.body.targetRole,
      hoursPerWeek: req.body.hoursPerWeek,
      weeks: req.body.weeks,
    });

    const summary = `Generating a ${req.body.weeks}-week plan focused on ${prioritizedGaps
      .map((gap) => gap.name)
      .slice(0, 3)
      .join(', ') || 'career momentum'}.`;

    summary.split(' ').forEach((token) => sendSseEvent(res, 'token', { token: `${token} ` }));

    const roadmapPayload = mapWeeksToLearningPath(
      aiRoadmap.weeks ?? [],
      req.body.targetRole,
      gapScore,
      req.body.hoursPerWeek
    );

    const roadmap = await saveRoadmap(req.user.id, roadmapPayload);
    const badgesUnlocked = evaluateRoadmapBadges({ hadRoadmap });

    if (badgesUnlocked.length) {
      await addEarnedBadges(req.user.id, badgesUnlocked);
      sendSseEvent(res, 'badges', { badges: badgesUnlocked });
    }

    sendSseEvent(res, 'roadmap', { roadmap, badgesUnlocked });
    sendSseEvent(res, 'done', { ok: true });
    res.end();
  } catch (error) {
    console.error('Roadmap stream error:', error.message);
    sendSseEvent(res, 'error', { message: error.message });
    res.end();
  }
}

async function toggleTask(req, res, next) {
  try {
    const previousRoadmap = await getRoadmap(req.user.id);
    const previousCompletedCount =
      previousRoadmap?.weeks?.flatMap((week) => week.tasks).filter((task) => task.completed).length ?? 0;

    const roadmap = await updateRoadmapTask(req.user.id, req.params.id, req.body.completed);

    if (!roadmap) {
      res.status(404).json({ message: 'Roadmap task not found.' });
      return;
    }

    const nextCompletedCount =
      roadmap.weeks?.flatMap((week) => week.tasks).filter((task) => task.completed).length ?? 0;
    const badgesUnlocked = evaluateTaskBadges({
      completedTaskCount: nextCompletedCount,
      readinessDelta: (nextCompletedCount - previousCompletedCount) * 4,
    });

    if (badgesUnlocked.length) {
      await addEarnedBadges(req.user.id, badgesUnlocked);
    }

    res.json({ roadmap, badgesUnlocked });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  fetchRoadmap,
  streamRoadmap,
  toggleTask,
};

