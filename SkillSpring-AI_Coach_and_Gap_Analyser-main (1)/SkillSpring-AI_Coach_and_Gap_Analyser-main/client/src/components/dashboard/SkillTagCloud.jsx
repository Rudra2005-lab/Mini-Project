import Badge from '../ui/Badge';

function getTone(proficiency) {
  if (proficiency >= 85) return 'teal';
  if (proficiency >= 70) return 'indigo';
  if (proficiency >= 50) return 'violet';
  return 'amber';
}

function getLevel(proficiency) {
  if (proficiency >= 85) return 'Expert';
  if (proficiency >= 70) return 'Advanced';
  if (proficiency >= 50) return 'Intermediate';
  return 'Beginner';
}

export default function SkillTagCloud({ skills }) {
  if (!skills.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-brand-muted">
        No skills added yet. Use the add-skill flow or import from a resume/GitHub profile.
      </div>
    );
  }

  return (
    <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="group min-w-fit rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 transition duration-300 hover:-translate-y-1 hover:border-brand-indigo/30 hover:shadow-[0_16px_28px_rgba(148,163,184,0.14)]"
        >
          <div className="flex items-center gap-3">
            <Badge tone={getTone(skill.proficiency)}>{getLevel(skill.proficiency)}</Badge>
            <div>
              <p className="text-sm font-semibold text-brand-text">{skill.name}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-brand-muted">
                {skill.proficiency}% • {skill.source}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
