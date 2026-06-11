import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function start() {
  console.log('Starting in-memory MongoDB...');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(`MongoDB URI: ${uri}`);

  const serverPath = resolve(__dirname, '..', 'server.js');
  const child = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: { ...process.env, MONGODB_URI: uri },
  });

  process.on('SIGINT', () => {
    child.kill();
    mongod.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    child.kill();
    mongod.stop();
    process.exit(0);
  });

  child.on('exit', (code) => {
    mongod.stop();
    process.exit(code);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
