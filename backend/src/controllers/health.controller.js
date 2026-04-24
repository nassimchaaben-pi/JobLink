const { checkDbHealth } = require('../config/db');

async function health(req, res) {
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}

async function ready(req, res) {
  const db = await checkDbHealth();
  const status = db.ok ? 200 : 503;

  return res.status(status).json({
    status: db.ok ? 'ready' : 'not_ready',
    checks: {
      database: db
    },
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  health,
  ready
};
