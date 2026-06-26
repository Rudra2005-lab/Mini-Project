const badgeDefinitions = {
  'first-step': { id: 'first-step', title: 'First Step', description: 'Added the first tracked skill.' },
  'on-fire': { id: 'on-fire', title: 'On Fire', description: 'Completed a consistent stretch of roadmap work.' },
  sharpshooter: { id: 'sharpshooter', title: 'Sharpshooter', description: 'Closed the first meaningful gap milestone.' },
  pathfinder: { id: 'pathfinder', title: 'Pathfinder', description: 'Generated the first AI roadmap.' },
  coached: { id: 'coached', title: 'Coached', description: 'Started the first AI coach conversation.' },
  'gap-crusher': { id: 'gap-crusher', title: 'Gap Crusher', description: 'Improved readiness in a major way.' },
};

function buildBadge(id) {
  return {
    ...badgeDefinitions[id],
    earnedAt: new Date().toISOString(),
  };
}

function evaluateSkillBadges({ previousSkillCount, nextSkillCount }) {
  const unlocked = [];

  if (previousSkillCount === 0 && nextSkillCount > 0) {
    unlocked.push(buildBadge('first-step'));
  }

  return unlocked;
}

function evaluateRoadmapBadges({ hadRoadmap }) {
  return hadRoadmap ? [] : [buildBadge('pathfinder')];
}

function evaluateTaskBadges({ completedTaskCount, readinessDelta }) {
  const unlocked = [];

  if (completedTaskCount >= 1) {
    unlocked.push(buildBadge('sharpshooter'));
  }

  if (completedTaskCount >= 3) {
    unlocked.push(buildBadge('on-fire'));
  }

  if (readinessDelta >= 20) {
    unlocked.push(buildBadge('gap-crusher'));
  }

  return unlocked;
}

function evaluateCoachBadges({ chatCount }) {
  return chatCount === 1 ? [buildBadge('coached')] : [];
}

module.exports = {
  evaluateSkillBadges,
  evaluateRoadmapBadges,
  evaluateTaskBadges,
  evaluateCoachBadges,
};

