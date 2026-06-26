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

function calculateReadinessScore(gapMatrix) {
  if (!gapMatrix.length) {
    return 0;
  }

  const weights = {
    critical: 1.35,
    high: 1.15,
    medium: 1,
  };

  const totalWeight = gapMatrix.reduce((sum, item) => sum + (weights[item.importance] ?? 1), 0);
  const totalScore = gapMatrix.reduce((sum, item) => {
    const weight = weights[item.importance] ?? 1;
    return sum + item.readiness * weight;
  }, 0);

  return Math.round(totalScore / totalWeight);
}

module.exports = {
  computeGapMatrix,
  calculateReadinessScore,
};

