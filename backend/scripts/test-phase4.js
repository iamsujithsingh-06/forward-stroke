import 'dotenv/config';
import http from 'http';

const PORT = 5124;
const BASE = `http://localhost:${PORT}`;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
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

  // Register user for protected routes
  console.log('\n[AUTH] Register test user');
  const reg = await request('POST', '/api/auth/register', {
    name: 'Phase4 User', email: 'phase4@test.com', password: 'test123456',
  });
  const token = reg.body.token;
  assert('Test user registered', reg.status === 201);

  // ========== SEED PRODUCTS ==========
  console.log('\n[SEED] Creating test products');
  const products = [];
  const jerseyTypes = ['ODI Jersey', 'T20 Jersey', 'Test Jersey'];
  const countries = ['India', 'Australia', 'England'];

  for (const country of countries) {
    for (const jersey of jerseyTypes) {
      const name = `${country} ${jersey}`;
      const res = await request('POST', '/api/products', {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: `${country} ${jersey} description`,
        price: Math.floor(Math.random() * 3000) + 1500,
        category: 'international-jersey',
        country,
        stock: 50,
        rating: 4.5,
        featured: jersey === 'ODI Jersey',
      });
      if (res.status === 201) products.push(res.body.product);
    }
  }

  // IPL products
  const teams = [
    { name: 'Chennai Super Kings', slug: 'CSK' },
    { name: 'Mumbai Indians', slug: 'MI' },
  ];
  for (const team of teams) {
    const name = `${team.name} Match Jersey`;
    const res = await request('POST', '/api/products', {
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: `${team.name} match jersey`,
      price: 2499,
      category: 'ipl-jersey',
      team: team.name,
      stock: 30,
      rating: 4.7,
    });
    if (res.status === 201) products.push(res.body.product);
  }

  assert(`Seeded ${products.length} products`, products.length > 0, `Got ${products.length}`);

  // ========== PRODUCT LISTING TESTS ==========
  console.log('\n[PRODUCT LISTING]');

  const allProducts = await request('GET', '/api/products');
  assert('GET /api/products returns 200', allProducts.status === 200);
  assert('Pagination data present', !!allProducts.body.pagination, JSON.stringify(allProducts.body.pagination));
  assert('Products array returned', Array.isArray(allProducts.body.products));
  assert('Products array non-empty', allProducts.body.products.length > 0);

  // Search
  const searchResults = await request('GET', '/api/products?search=India');
  assert('Search by country works', searchResults.body.products.length > 0, `Got ${searchResults.body.products.length}`);

  const badSearch = await request('GET', '/api/products?search=zzzzzxyz');
  assert('Search with no results returns empty', badSearch.body.products.length === 0);

  // Filter by category
  const catFilter = await request('GET', '/api/products?category=international-jersey');
  assert('Filter by category works', catFilter.body.products.length > 0);

  // Filter by team
  const teamFilter = await request('GET', '/api/products?team=Mumbai%20Indians');
  assert('Filter by team works', teamFilter.body.products.length > 0);

  // Filter by country
  const countryFilter = await request('GET', '/api/products?country=India');
  assert('Filter by country works', countryFilter.body.products.length > 0);

  // Sort by price ascending
  const priceAsc = await request('GET', '/api/products?sort=price&order=asc&limit=2');
  assert('Sort by price asc works', priceAsc.status === 200);
  if (priceAsc.body.products.length >= 2) {
    assert('Price asc ordering correct', priceAsc.body.products[0].price <= priceAsc.body.products[1].price);
  }

  // Sort by price descending
  const priceDesc = await request('GET', '/api/products?sort=price&order=desc&limit=2');
  assert('Sort by price desc works', priceDesc.status === 200);
  if (priceDesc.body.products.length >= 2) {
    assert('Price desc ordering correct', priceDesc.body.products[0].price >= priceDesc.body.products[1].price);
  }

  // Pagination
  const page1 = await request('GET', '/api/products?page=1&limit=2');
  const page2 = await request('GET', '/api/products?page=2&limit=2');
  assert('Page 1 returns 2 products', page1.body.products.length === 2);
  assert('Page 2 returns products', page2.body.products.length > 0);
  assert('Pages have different products', page1.body.products[0]._id !== page2.body.products[0]._id);
  assert('Pagination has pages count', page1.body.pagination.pages > 1);

  // Featured
  const featured = await request('GET', '/api/products/featured');
  assert('Featured products endpoint works', featured.status === 200);
  assert('Featured returns products', featured.body.products.length > 0);

  // Filter options
  const filters = await request('GET', '/api/products/filters');
  assert('Filter options endpoint works', filters.status === 200);
  assert('Categories in filters', filters.body.filters.categories.length > 0);
  assert('Countries in filters', filters.body.filters.countries.length > 0);

  // ========== PRODUCT DETAILS TESTS ==========
  console.log('\n[PRODUCT DETAILS]');

  const firstSlug = products[0].slug;
  const detail = await request('GET', `/api/products/${firstSlug}`);
  assert('Product detail by slug returns 200', detail.status === 200);
  assert('Product name matches', detail.body.product.name === products[0].name);
  assert('Product has price', detail.body.product.price > 0);

  const badSlug = await request('GET', '/api/products/nonexistent-product');
  assert('Non-existent slug returns 404', badSlug.status === 404);

  // Related products
  const related = await request('GET', `/api/products/${firstSlug}/related`);
  assert('Related products endpoint works', related.status === 200);
  assert('Related products array returned', Array.isArray(related.body.products));

  // ========== WISHLIST TESTS ==========
  console.log('\n[WISHLIST]');

  const wishlist1 = await request('GET', '/api/wishlist', null, token);
  assert('Get empty wishlist returns 200', wishlist1.status === 200);
  assert('Empty wishlist has empty products', wishlist1.body.products.length === 0);

  const addWl = await request('POST', `/api/wishlist/${products[0]._id}`, null, token);
  assert('Add to wishlist returns 200', addWl.status === 200);
  assert('Wishlist has 1 product after add', addWl.body.products.length === 1);

  const removeWl = await request('DELETE', `/api/wishlist/${products[0]._id}`, null, token);
  assert('Remove from wishlist returns 200', removeWl.status === 200);
  assert('Wishlist empty after remove', removeWl.body.products.length === 0);

  const wishlistNoAuth = await request('GET', '/api/wishlist');
  assert('Wishlist without auth returns 401', wishlistNoAuth.status === 401);

  // ========== CART TESTS ==========
  console.log('\n[CART]');

  const cart1 = await request('GET', '/api/cart', null, token);
  assert('Get empty cart returns 200', cart1.status === 200);
  assert('Empty cart has no items', cart1.body.cart.items.length === 0);

  const addCart = await request('POST', '/api/cart', { productId: products[0]._id, quantity: 2 }, token);
  assert('Add to cart returns 200', addCart.status === 200);
  assert('Cart has 1 item after add', addCart.body.cart.items.length === 1);
  assert('Item quantity is 2', addCart.body.cart.items[0].quantity === 2);

  const itemId = addCart.body.cart.items[0]._id;

  const updateCart = await request('PATCH', `/api/cart/${itemId}`, { quantity: 5 }, token);
  assert('Update cart item returns 200', updateCart.status === 200);
  assert('Updated quantity is 5', updateCart.body.cart.items[0].quantity === 5);

  const addSecond = await request('POST', '/api/cart', { productId: products[1]._id, quantity: 1 }, token);
  assert('Add second item to cart', addSecond.body.cart.items.length === 2);

  const removeItem = await request('DELETE', `/api/cart/${itemId}`, null, token);
  assert('Remove cart item returns 200', removeItem.status === 200);
  assert('Cart has 1 item after remove', removeItem.body.cart.items.length === 1);

  const cartNoAuth = await request('GET', '/api/cart');
  assert('Cart without auth returns 401', cartNoAuth.status === 401);

  const clearCart = await request('DELETE', '/api/cart/clear', null, token);
  assert('Clear cart returns 200', clearCart.status === 200);
  assert('Cart empty after clear', clearCart.body.cart.items.length === 0);

  // ========== SUMMARY ==========
  console.log('\n========== PHASE 4 RESULTS ==========');
  console.log(`  Passed: ${results.passed}`);
  console.log(`  Failed: ${results.failed}`);
  if (results.errors.length > 0) {
    console.log('\n  Errors:');
    results.errors.forEach((e) => console.log(`    ${e}`));
  }
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

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
