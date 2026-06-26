const OpenAI = require('openai');

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function safeParseJson(content) {
  try {
    return JSON.parse(content);
  } catch (error) {
    const match = content.match(/\{[\s\S]*\}/);

    if (!match) {
      throw error;
    }

    return JSON.parse(match[0]);
  }
}

function buildMockRoadmap({ targetRole, gaps, hoursPerWeek, weeks }) {
  const focusAreas = gaps.length ? gaps : [{ name: 'Testing' }, { name: 'Communication' }, { name: 'Architecture' }];

  return {
    weeks: Array.from({ length: weeks }, (_, index) => {
      const focus = focusAreas[index % focusAreas.length];
      return {
        week: index + 1,
        goal: `Improve ${focus.name} for ${targetRole}.`,
        tasks: [
          `Review one concept in ${focus.name}.`,
          `Build one small artifact that proves ${focus.name}.`,
          'Write a short retrospective and plan the next step.',
        ],
        resources: [
          {
            title: `${focus.name} primer`,
            url: 'https://roadmap.sh',
            type: 'article',
            duration: `${Math.round(hoursPerWeek * 0.5)} mins`,
          },
        ],
      };
    }),
  };
}

async function generateRoadmap({ gaps, targetRole, hoursPerWeek, weeks }) {
  if (!client) {
    return buildMockRoadmap({ gaps, targetRole, hoursPerWeek, weeks });
  }

  const prompt = `You are a career coach AI. The student has these skill gaps: ${JSON.stringify(
    gaps
  )}. Their target role is: ${targetRole}. Their available study time is: ${hoursPerWeek} hours/week. Generate a structured ${weeks}-week learning roadmap with specific resources. Return JSON: { "weeks": [{ "week": 1, "goal": "", "tasks": [], "resources": [{ "title": "", "url": "", "type": "", "duration": "" }] }] }`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.6,
    messages: [
      {
        role: 'system',
        content:
          'You produce concise, realistic study plans for aspiring developers. Return valid JSON only.',
      },
      { role: 'user', content: prompt },
    ],
  });

  return safeParseJson(response.choices[0].message.content ?? '{}');
}

async function generateCoachReply({ message, targetRole, skills, gaps }) {
  if (!client) {
    const topGap = gaps[0]?.name ?? 'your next priority';
    return `For the ${targetRole} path, start with ${topGap}. Use one practical project, one feedback loop, and one public note so the skill becomes visible, not just learned. Your current skills in ${skills
      .slice(0, 3)
      .map((skill) => skill.name)
      .join(', ')} are strong anchors to build from.`;
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.7,
    messages: [
      {
        role: 'system',
        content:
          'You are an encouraging AI career coach. Ground every answer in the student context, be specific, and keep responses under 180 words.',
      },
      {
        role: 'user',
        content: `Target role: ${targetRole}\nCurrent skills: ${JSON.stringify(
          skills
        )}\nCurrent gaps: ${JSON.stringify(gaps)}\nQuestion: ${message}`,
      },
    ],
  });

  return response.choices[0].message.content?.trim() ?? '';
}

module.exports = {
  generateRoadmap,
  generateCoachReply,
};

