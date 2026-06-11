import 'dotenv/config';
import http from 'http';

const PORT = 5123;
const BASE = `http://localhost:${PORT}`;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function waitForServer(maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await request('GET', '/api/health');
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error('Server did not start');
}

async function runTests() {
  const results = { passed: 0, failed: 0, errors: [] };

  function assert(name, condition, detail = '') {
    if (condition) {
      results.passed++;
      console.log(`  ✅ ${name}`);
    } else {
      results.failed++;
      const msg = `  ❌ ${name}${detail ? ': ' + detail : ''}`;
      console.log(msg);
      results.errors.push(msg);
    }
  }

  console.log('\n========== AUTH INTEGRATION TESTS ==========\n');

  // 1. Register
  console.log('1. Register new user');
  const registerRes = await request('POST', '/api/auth/register', {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
  assert('Register returns 201', registerRes.status === 201, `Got ${registerRes.status}`);
  assert('Register returns token', !!registerRes.body.token, 'No token in response');
  assert('Register returns user data', registerRes.body.user?.name === 'Test User', `Got ${registerRes.body.user?.name}`);
  const token = registerRes.body.token;

  // 2. Duplicate registration
  console.log('\n2. Duplicate email registration');
  const dupRes = await request('POST', '/api/auth/register', {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
  assert('Duplicate returns 409', dupRes.status === 409, `Got ${dupRes.status}`);

  // 3. Login
  console.log('\n3. Login with valid credentials');
  const loginRes = await request('POST', '/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  });
  assert('Login returns 200', loginRes.status === 200, `Got ${loginRes.status}`);
  assert('Login returns token', !!loginRes.body.token, 'No token in response');
  assert('Login returns user name', loginRes.body.user?.name === 'Test User', `Got ${loginRes.body.user?.name}`);
  const loginToken = loginRes.body.token;

  // 4. Login with wrong password
  console.log('\n4. Login with wrong password');
  const badLoginRes = await request('POST', '/api/auth/login', {
    email: 'test@example.com',
    password: 'wrongpassword',
  });
  assert('Bad login returns 401', badLoginRes.status === 401, `Got ${badLoginRes.status}`);

  // 5. Login with non-existent email
  console.log('\n5. Login with non-existent email');
  const noUserRes = await request('POST', '/api/auth/login', {
    email: 'nonexistent@example.com',
    password: 'password123',
  });
  assert('Non-existent returns 401', noUserRes.status === 401, `Got ${noUserRes.status}`);

  // 6. Profile with valid token
  console.log('\n6. Access profile with valid token');
  const profileRes = await request('GET', '/api/auth/profile', null, loginToken);
  assert('Profile returns 200', profileRes.status === 200, `Got ${profileRes.status}`);
  assert('Profile returns user email', profileRes.body.user?.email === 'test@example.com', `Got ${profileRes.body.user?.email}`);

  // 7. Profile without token
  console.log('\n7. Access profile without token');
  const noTokenRes = await request('GET', '/api/auth/profile');
  assert('No token returns 401', noTokenRes.status === 401, `Got ${noTokenRes.status}`);

  // 8. Profile with invalid token
  console.log('\n8. Access profile with invalid token');
  const badTokenRes = await request('GET', '/api/auth/profile', null, 'invalid.jwt.token');
  assert('Invalid token returns 401', badTokenRes.status === 401, `Got ${badTokenRes.status}`);

  // 9. Logout
  console.log('\n9. Logout');
  const logoutRes = await request('POST', '/api/auth/logout');
  assert('Logout returns 200', logoutRes.status === 200, `Got ${logoutRes.status}`);

  // 10. Validation tests
  console.log('\n10. Input validation');
  const noNameRes = await request('POST', '/api/auth/register', {
    email: 'test2@example.com',
    password: 'password123',
  });
  assert('Register without name returns 400', noNameRes.status === 400, `Got ${noNameRes.status}`);

  const shortPassRes = await request('POST', '/api/auth/register', {
    name: 'Test',
    email: 'test3@example.com',
    password: '123',
  });
  assert('Short password returns 400', shortPassRes.status === 400, `Got ${shortPassRes.status}`);

  const badEmailRes = await request('POST', '/api/auth/register', {
    name: 'Test',
    email: 'not-an-email',
    password: 'password123',
  });
  assert('Bad email returns 400', badEmailRes.status === 400, `Got ${badEmailRes.status}`);

  // Summary
  console.log('\n========== RESULTS ==========');
  console.log(`  Passed: ${results.passed}`);
  console.log(`  Failed: ${results.failed}`);
  if (results.errors.length > 0) {
    console.log('\n  Errors:');
    results.errors.forEach((e) => console.log(`    ${e}`));
  }
  console.log('==============================\n');

  process.exit(results.failed > 0 ? 1 : 0);
}

async function main() {
  console.log('Starting in-memory MongoDB...');
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  process.env.PORT = String(PORT);
  process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing';

  console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
  console.log(`Server port: ${PORT}`);

  await import('../server.js');

  await waitForServer();
  console.log('Server is running.');

  await runTests();

  await mongod.stop();
  process.exit(0);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
