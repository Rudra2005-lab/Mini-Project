const {
  listSkills,
  incrementChatCount,
  addEarnedBadges,
} = require('../services/dataStore');
const { getRoleRequirements } = require('../services/roleCatalog');
const { computeGapMatrix, calculateReadinessScore } = require('../services/gapAnalysis');
const { generateCoachReply } = require('../services/openaiService');
const { evaluateCoachBadges } = require('../services/badgeService');

function sendSseEvent(res, event, payload) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

async function streamChat(req, res, next) {
  try {
    res.writeHead(200, {
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });

    const skills = req.body.skills ?? (await listSkills(req.user.id));
    const roleRequirements = getRoleRequirements(req.body.targetRole ?? req.user.targetRole);
    const gapMatrix = computeGapMatrix(skills, roleRequirements)
      .filter((item) => item.gap > 0)
      .sort((left, right) => right.gap - left.gap)
      .slice(0, 5);

    const content = await generateCoachReply({
      message: req.body.message,
      targetRole: req.body.targetRole ?? req.user.targetRole,
      skills,
      gaps: gapMatrix,
    });

    content.split(' ').forEach((token) => sendSseEvent(res, 'token', { token: `${token} ` }));

    const chatCount = await incrementChatCount(req.user.id);
    const badgesUnlocked = evaluateCoachBadges({ chatCount });

    if (badgesUnlocked.length) {
      await addEarnedBadges(req.user.id, badgesUnlocked);
      sendSseEvent(res, 'badges', { badges: badgesUnlocked });
    }

    sendSseEvent(res, 'message', { content, badgesUnlocked });
    sendSseEvent(res, 'done', { ok: true });
    res.end();
  } catch (error) {
    console.error('Chat stream error:', error.message);
    sendSseEvent(res, 'error', { message: error.message });
    res.end();
  }
}

async function analyzeGaps(req, res, next) {
  try {
    const skills = req.body.skills ?? (await listSkills(req.user.id));
    const requirements = getRoleRequirements(req.body.targetRole ?? req.user.targetRole);
    const matrix = computeGapMatrix(skills, requirements);

    res.json({
      targetRole: req.body.targetRole ?? req.user.targetRole,
      readinessScore: calculateReadinessScore(matrix),
      priorities: matrix.filter((item) => item.gap > 0).sort((left, right) => right.gap - left.gap),
      matrix,
    });
  } catch (error) {
    next(error);
  }
}

async function getRoleRequirementsByRole(req, res, next) {
  try {
    const role = decodeURIComponent(req.params.role);
    const requirements = getRoleRequirements(role);

    res.json({
      role,
      requirements,
      frameworks: ['SFIA', 'O*NET'],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  streamChat,
  analyzeGaps,
  getRoleRequirementsByRole,
};

