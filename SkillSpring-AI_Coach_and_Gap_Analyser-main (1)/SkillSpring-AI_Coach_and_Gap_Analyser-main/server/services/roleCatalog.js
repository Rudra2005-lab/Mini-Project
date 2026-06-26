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

function getRoleRequirements(role) {
  return roleCatalog[role] ?? roleCatalog['Frontend Developer'];
}

function getRoleOptions() {
  return Object.keys(roleCatalog);
}

module.exports = {
  roleCatalog,
  getRoleRequirements,
  getRoleOptions,
};

