const mysql = require('mysql2/promise');
const env = require('./env');
const prisma = require('./prisma');

let pool = null;

function getPool() {
  if (!env.db.enabled) {
    return null;
  }

  if (!pool) {
    pool = mysql.createPool({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  return pool;
}

async function checkDbHealth() {
  if (env.databaseUrl) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { ok: true, message: 'Prisma database connection is healthy.' };
    } catch (error) {
      if (!env.db.enabled) {
        return { ok: true, message: 'Prisma not configured yet; health check skipped in local mode.' };
      }
      return { ok: false, message: error.message };
    }
  }

  if (!env.db.enabled) {
    return { ok: true, message: 'Database disabled by configuration.' };
  }

  try {
    const currentPool = getPool();
    await currentPool.query('SELECT 1');
    return { ok: true, message: 'Database connection is healthy.' };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

module.exports = {
  getPool,
  checkDbHealth
};
