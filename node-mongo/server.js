const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
const mongoose = require('mongoose');
const app = require('./app');

async function start() {
  await mongoose.connect(process.env.DATABASE || 'mongodb://127.0.0.1:27017/book-list', { serverSelectionTimeoutMS: 5000 });
  console.log('Mongoose connection open!');
  const port = Number(process.env.PORT || 8081);
  const server = app.listen(port, '127.0.0.1', () => console.log(`App listening at http://localhost:${port}`));
  server.on('error', async error => { console.error(error.message); await mongoose.disconnect(); process.exitCode = 1; });
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close(async () => { await mongoose.disconnect(); process.exit(0); }));
}
start().catch(error => { console.error('Connection error:', error.message); process.exitCode = 1; });
