import 'dotenv/config';
import http from 'http';

const PORT = 5127;
const BASE = `http://localhost:${PORT}`;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      method, hostname: url.hostname, port: url.port, path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(data) }); } catch { resolve({ status: res.statusCode, body: data }); } });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function waitForServer(maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try { await request('GET', '/api/health'); return true; } catch { await new Promise((r) => setTimeout(r, 1000)); }
  }
  throw new Error('Server did not start');
}

async function runTests() {
  const results = { passed: 0, failed: 0, errors: [] };
  function assert(name, condition, detail = '') {
    if (condition) { results.passed++; console.log(`  ✅ ${name}`); }
    else { results.failed++; const msg = `  ❌ ${name}${detail ? ': ' + detail : ''}`; console.log(msg); results.errors.push(msg); }
  }

  // Register admin user
  console.log('\n[SETUP]');
  const reg = await request('POST', '/api/auth/register', { name: 'Admin User', email: 'admin@test.com', password: 'admin123456' });
  const token = reg.body.token;
  assert('User registered', reg.status === 201);

  // Manually promote to admin
  const { default: User } = await import('../models/User.js');
  const adminUser = await User.findOne({ email: 'admin@test.com' });
  adminUser.role = 'admin';
  await adminUser.save();

  const reg2 = await request('POST', '/api/auth/register', { name: 'Regular User', email: 'user@test.com', password: 'user123456' });
  const userToken = reg2.body.token;
  assert('Regular user registered', reg2.status === 201);

  // Create test product
  const product = await request('POST', '/api/admin/products', { name: 'Admin Test Jersey', price: 1999, category: 'international-jersey', country: 'India' }, token);
  assert('Admin can create product', product.status === 201);
  const pid = product.body.product._id;

  // Create community post
  const post = await request('POST', '/api/community/posts', { content: 'Test post for admin' }, token);
  assert('Admin creates post', post.status === 201);
  const postId = post.body.post._id;

  // ========== DASHBOARD ==========
  console.log('\n[DASHBOARD]');
  const dashboard = await request('GET', '/api/admin/dashboard', null, token);
  assert('Dashboard returns 200', dashboard.status === 200);
  assert('Has totalUsers', 'totalUsers' in dashboard.body.stats);
  assert('Has totalProducts', 'totalProducts' in dashboard.body.stats);
  assert('Has totalPosts', 'totalPosts' in dashboard.body.stats);
  assert('Has totalWishlists', 'totalWishlists' in dashboard.body.stats);
  assert('Has totalCarts', 'totalCarts' in dashboard.body.stats);

  const dashNoAuth = await request('GET', '/api/admin/dashboard');
  assert('Dashboard without auth returns 401', dashNoAuth.status === 401);

  const dashNotAdmin = await request('GET', '/api/admin/dashboard', null, userToken);
  assert('Dashboard non-admin returns 403', dashNotAdmin.status === 403);

  // ========== PRODUCT MANAGEMENT ==========
  console.log('\n[PRODUCT MANAGEMENT]');
  const products = await request('GET', '/api/admin/products', null, token);
  assert('List products returns 200', products.status === 200);
  assert('Products array returned', Array.isArray(products.body.products));

  const updated = await request('PUT', `/api/admin/products/${pid}`, { price: 2499, name: 'Updated Jersey' }, token);
  assert('Update product returns 200', updated.status === 200);
  assert('Price updated', updated.body.product.price === 2499);

  const toggled = await request('PATCH', `/api/admin/products/${pid}/featured`, null, token);
  assert('Toggle featured returns 200', toggled.status === 200);
  assert('Featured toggled to true', toggled.body.product.featured === true);

  const toggled2 = await request('PATCH', `/api/admin/products/${pid}/featured`, null, token);
  assert('Toggle featured back to false', toggled2.body.product.featured === false);

  const badUpdate = await request('PUT', '/api/admin/products/000000000000000000000000', { price: 100 }, token);
  assert('Update non-existent returns 404', badUpdate.status === 404);

  const deleted = await request('DELETE', `/api/admin/products/${pid}/featured`, null, token);
  // wrong endpoint should 404
  // correct delete
  const delCorrect = await request('DELETE', `/api/admin/products/${pid}`, null, token);
  assert('Delete product returns 200', delCorrect.status === 200);

  // ========== USER MANAGEMENT ==========
  console.log('\n[USER MANAGEMENT]');
  const users = await request('GET', '/api/admin/users', null, token);
  assert('List users returns 200', users.status === 200);
  assert('Users array returned', Array.isArray(users.body.users));
  assert('At least 2 users', users.body.users.length >= 2);

  const uid = reg2.body.user.id;
  const userDetail = await request('GET', `/api/admin/users/${uid}`, null, token);
  assert('User detail returns 200', userDetail.status === 200);
  assert('User email matches', userDetail.body.user.email === 'user@test.com');

  const roleChange = await request('PATCH', `/api/admin/users/${uid}/role`, { role: 'admin' }, token);
  assert('Change role returns 200', roleChange.status === 200);
  assert('Role changed to admin', roleChange.body.user.role === 'admin');

  const invalidRole = await request('PATCH', `/api/admin/users/${uid}/role`, { role: 'superadmin' }, token);
  assert('Invalid role returns 400', invalidRole.status === 400);

  const selfRole = await request('PATCH', `/api/admin/users/${adminUser._id}/role`, { role: 'user' }, token);
  assert('Cannot change own role', selfRole.status === 400);

  const badUser = await request('GET', '/api/admin/users/000000000000000000000000', null, token);
  assert('Non-existent user returns 404', badUser.status === 404);

  // ========== COMMUNITY MODERATION ==========
  console.log('\n[COMMUNITY MODERATION]');
  const posts = await request('GET', '/api/admin/posts', null, token);
  assert('List posts returns 200', posts.status === 200);
  assert('Posts array returned', Array.isArray(posts.body.posts));

  const delPost = await request('DELETE', `/api/admin/posts/${postId}`, null, token);
  assert('Delete post returns 200', delPost.status === 200);

  const badDelPost = await request('DELETE', `/api/admin/posts/000000000000000000000000`, null, token);
  assert('Delete non-existent post returns 404', badDelPost.status === 404);

  // ========== ANALYTICS ==========
  console.log('\n[ANALYTICS]');
  const analytics = await request('GET', '/api/admin/analytics', null, token);
  assert('Analytics returns 200', analytics.status === 200);
  assert('Has mostWishlisted', Array.isArray(analytics.body.analytics.mostWishlisted));
  assert('Has mostCarted', Array.isArray(analytics.body.analytics.mostCarted));
  assert('Has mostLikedPosts', Array.isArray(analytics.body.analytics.mostLikedPosts));
  assert('Has trendingTeams', Array.isArray(analytics.body.analytics.trendingTeams));

  // ========== SUMMARY ==========
  console.log('\n========== PHASE 7 RESULTS ==========');
  console.log(`  Passed: ${results.passed}`);
  console.log(`  Failed: ${results.failed}`);
  if (results.errors.length > 0) { console.log('\n  Errors:'); results.errors.forEach((e) => console.log(`    ${e}`)); }
  console.log('=====================================\n');
  process.exit(results.failed > 0 ? 1 : 0);
}

async function main() {
  console.log('Starting in-memory MongoDB...');
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  process.env.PORT = String(PORT);
  process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing';

  await import('../server.js');
  await waitForServer();
  console.log('Server is running.');
  await runTests();
  await mongod.stop();
  process.exit(0);
}

main().catch((err) => { console.error('FATAL:', err); process.exit(1); });
