const app = require('./app');
const env = require('./config/env');

app.listen(env.port, () => {
  console.log(`JobLink backend listening on http://localhost:${env.port}`);
});
