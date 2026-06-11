# Forward Stroke – Cricket Fan Platform

Full-stack cricket fan platform: browse international & IPL merchandise, manage wishlist/cart, personalized recommendations, and admin panel.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + React Router v6 + Context API + Axios + react-helmet-async
- **Backend**: Node.js + Express + MongoDB + Mongoose + JWT + bcryptjs

## Quick Start

```bash
# Backend
cd backend
cp .env.example .env      # Edit MONGODB_URI, JWT_SECRET, PORT=5000
npm install
node scripts/seed.js      # Populate ~100 products
npm run dev               # http://localhost:5000

# Frontend
cd frontend
npm install
npm run dev               # http://localhost:5173 (proxies /api to :5000)
```

Admin users: create via DB (`role: 'admin'`) or via `/api/admin/users/:id/role` by existing admin.

## Project Structure

```
backend/
  config/         db.js
  controllers/    authController, productController, wishlistController,
                  cartController, communityController, adminController
  middleware/     authMiddleware (protect), adminMiddleware (requireAdmin), errorMiddleware
  models/         User, Product, Wishlist, Cart, Post
  routes/         auth, products, wishlist, cart, community, admin
  services/       recommendationService (trending, related, personalized, fansAlsoLiked)
  utils/          jwt.js
  scripts/        seed.js, test-phase*.js

frontend/
  src/
    components/   Navbar, ProductCard, WishlistButton, CartButton, ProductFilters,
                  SEO, AdminRoute, TrendingProducts, RelatedProducts, FansAlsoLiked,
                  RecommendedProducts, TeamLogo, CountryFlag, CategoryCard
    context/      AuthContext, WishlistContext, CartContext
    hooks/        useAuth
    layouts/      AdminLayout
    pages/        Home, Login, Register, Profile, Products, ProductDetails,
                  Wishlist, Cart, International, CountryDetails, CountryJerseyYears,
                  IPL, IPLTeamDetails, IPLTeamCategory, Trending, AccessDenied,
                  admin/AdminDashboard, AdminProducts, AdminUsers, AdminAnalytics
    data/         countries, iplTeams
    routes/       AppRoutes (lazy-loaded)
    services/     authService, productService, wishlistService, cartService,
                  recommendationService, adminService
```

## API Endpoints

| Endpoint | Auth | Description |
|---|---|---|
| `POST /api/auth/register` | - | Register user |
| `POST /api/auth/login` | - | Login |
| `GET /api/auth/profile` | JWT | Get profile |
| `POST /api/auth/logout` | JWT | Logout |
| `GET /api/products` | - | Search/filter/sort/paginate |
| `GET /api/products/:id` | - | Product details |
| `POST /api/products/:id/rating` | JWT | Rate product |
| `GET /api/wishlist` | JWT | Get wishlist |
| `POST /api/wishlist` | JWT | Add to wishlist |
| `DELETE /api/wishlist/:productId` | JWT | Remove from wishlist |
| `GET /api/cart` | JWT | Get cart |
| `POST /api/cart` | JWT | Add to cart |
| `PUT /api/cart/:itemId` | JWT | Update quantity |
| `DELETE /api/cart/:itemId` | JWT | Remove item |
| `DELETE /api/cart` | JWT | Clear cart |
| `GET /api/recommendations/trending` | - | Trending products |
| `GET /api/recommendations/related/:productId` | - | Related products |
| `GET /api/recommendations/personalized` | JWT | Personalized recs |
| `GET /api/recommendations/fans-also-liked` | - | Fans also liked |
| `GET /api/admin/dashboard` | Admin | Stats |
| `GET /api/admin/products` | Admin | List products |
| `POST /api/admin/products` | Admin | Create product |
| `PUT /api/admin/products/:id` | Admin | Update product |
| `DELETE /api/admin/products/:id` | Admin | Delete product |
| `PATCH /api/admin/products/:id/featured` | Admin | Toggle featured |
| `GET /api/admin/users` | Admin | List users |
| `GET /api/admin/users/:id` | Admin | User detail |
| `PATCH /api/admin/users/:id/role` | Admin | Change role |
| `GET /api/admin/analytics` | Admin | Analytics |

## Testing

```bash
cd backend
node scripts/test-phase2.js   # Auth (17)
node scripts/test-phase4.js   # Products/wishlist/cart (50)
node scripts/test-phase6.js   # Recommendations (29)
node scripts/test-phase7.js   # Admin/analytics (40)
```

## Frontend Build

```bash
cd frontend
npm run build    # 153 modules, code-split chunks
```

## Key Decisions

- Dark theme via `darkMode: 'class'`, mobile-first responsive
- Wishlist & Cart persist to MongoDB (JWT required)
- Product search uses regex (no Atlas text index needed)
- Recommendation scoring: (Wishlist×3) + (Cart×5) + (Rating×10)
- All routes lazy-loaded for code splitting
- SEO via react-helmet-async
- Checkout button disabled (out of scope)
- **No descriptions/player data**: E-commerce only — all country/team descriptions, topPlayers, and Hall of Fame removed
- **Year-based jersey structure**: International jerseys are year-specific (5 Test, 5 ODI WC, 5 T20 WC, 3 CT per country); `/international/:country/:category` page groups by year
- **International Accessories**: 5th category with hardcoded sample products (caps, gloves, bags, wrist bands)
- **IPL 5 categories**: Match Jersey, Training Jersey, Fan Jersey, Retro Jersey, Accessories — each with 3 hardcoded sample products at `/ipl/:team/:category`
- **Community removed**: All community pages, components, services, and admin routes eliminated
