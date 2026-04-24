# MySQL Local Setup on macOS (JobLink)

This guide shows how to install MySQL on a MacBook, create the JobLink database, connect the backend, and run Prisma.

## 1) Install MySQL with Homebrew

```bash
brew update
brew install mysql
```

If you see a Homebrew lock error, wait for the other `brew` process to finish, then retry.

## 2) Start MySQL service

```bash
brew services start mysql
```

Check status:

```bash
brew services list
```

## 3) Secure root access (first-time setup)

Run the secure installer:

```bash
mysql_secure_installation
```

Recommended answers:
- Set root password: `Yes`
- Remove anonymous users: `Yes`
- Disallow remote root login: `Yes`
- Remove test database: `Yes`
- Reload privilege tables: `Yes`

## 4) Create JobLink database

Login:

```bash
mysql -u root -p
```

Inside MySQL:

```sql
CREATE DATABASE joblink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'joblink_user'@'localhost' IDENTIFIED BY 'joblink_password';
GRANT ALL PRIVILEGES ON joblink.* TO 'joblink_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 5) Configure backend environment

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:4200

JWT_SECRET=joblink-dev-secret
JWT_EXPIRES_IN=1d

DATABASE_URL=mysql://joblink_user:joblink_password@localhost:3306/joblink

DB_ENABLED=true
DB_HOST=localhost
DB_PORT=3306
DB_USER=joblink_user
DB_PASSWORD=joblink_password
DB_NAME=joblink
```

## 6) Initialize Prisma schema in MySQL

From `backend/`:

```bash
npm install
npm run prisma:generate
npm run prisma:push
```

## 7) Run backend and verify DB mode

```bash
npm run start
```

Health checks:

```bash
curl http://localhost:5000/api/v1/health
curl http://localhost:5000/api/v1/ready
```

Expected: readiness should report database healthy.

## 8) Quick API smoke test

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"candidate@example.com","password":"secret123","role":"candidate"}'
```

If this works and data remains after server restart, DB persistence is active.

## Troubleshooting

- `mysql: command not found`
  - Run `brew install mysql`.
- `Access denied for user root`
  - Re-run `mysql_secure_installation` or reset root password.
- `Prisma P1001/P1000`
  - Verify `DATABASE_URL`, MySQL service status, and DB credentials.
- Homebrew lock error
  - Another brew install is running; wait for it to finish or stop it before retrying.
