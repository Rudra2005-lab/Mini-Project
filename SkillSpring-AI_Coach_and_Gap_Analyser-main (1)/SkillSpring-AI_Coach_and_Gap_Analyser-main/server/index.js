require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDb } = require('./config/db');
const { initSqliteDb } = require('./config/sqliteDb');
const mockAuth = require('./middleware/mockAuth');
const authRoutes = require('./routes/auth');
const skillsRoutes = require('./routes/skills');
const roadmapRoutes = require('./routes/roadmap');
const aiRoutes = require('./routes/ai');
const { getRoleOptions } = require('./services/roleCatalog');

const port = process.env.PORT || 5000;

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', async (req, res) => {
    const dbConnected = await connectDb();
    res.json({
      ok: true,
      dbConnected,
      roles: getRoleOptions().length,
    });
  });

  // Auth Endpoints
  app.use('/api/auth', authRoutes);

  // Still use mockAuth for remaining skills/roadmap endpoints right now to not break them, 
  // until full frontend is shifted. 
  app.use('/api', mockAuth);

  app.use('/api/skills', skillsRoutes);
  app.use('/api/roadmap', roadmapRoutes);
  app.use('/api/ai', aiRoutes);

  app.use((error, req, res, next) => {
    console.error(error);

    if (res.headersSent) {
      next(error);
      return;
    }

    res.status(500).json({
      message: error.message || 'Something went wrong.',
    });
  });

  return app;
}

async function startServer() {
  await connectDb();
  await initSqliteDb();
  const app = createApp();

  return app.listen(port, () => {
    console.log(`Skill tracker API listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  createApp,
  startServer,
};
