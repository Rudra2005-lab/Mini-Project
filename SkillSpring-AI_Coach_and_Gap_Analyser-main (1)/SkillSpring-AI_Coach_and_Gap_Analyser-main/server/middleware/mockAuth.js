module.exports = (req, res, next) => {
  req.user = {
    id: 'local-dev',
    name: 'Ronit Mexson',
    email: 'ronit@local.dev',
    role: 'student',
    targetRole: 'Frontend Developer',
  };

  next();
};

