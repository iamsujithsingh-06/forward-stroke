import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import Loading from '../components/Loading';

const Home = lazy(() => import('../pages/Home'));
const International = lazy(() => import('../pages/International'));
const CountryDetails = lazy(() => import('../pages/CountryDetails'));
const CountryJerseyYears = lazy(() => import('../pages/CountryJerseyYears'));
const IPL = lazy(() => import('../pages/IPL'));
const IPLTeamDetails = lazy(() => import('../pages/IPLTeamDetails'));
const IPLTeamCategory = lazy(() => import('../pages/IPLTeamCategory'));
const Products = lazy(() => import('../pages/Products'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Collections = lazy(() => import('../pages/Collections'));
const Trending = lazy(() => import('../pages/Trending'));
const NotFound = lazy(() => import('../pages/NotFound'));
const AccessDenied = lazy(() => import('../pages/AccessDenied'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Profile = lazy(() => import('../pages/Profile'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const Cart = lazy(() => import('../pages/Cart'));
const OrderSuccess = lazy(() => import('../pages/OrderSuccess'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('../pages/admin/AdminProducts'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));

const L = ({ children }) => <Suspense fallback={<Loading fullPage text="Loading..." />}>{children}</Suspense>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<L><Home /></L>} />
        <Route path="/international" element={<L><International /></L>} />
        <Route path="/international/:country" element={<L><CountryDetails /></L>} />
        <Route path="/international/:country/:category" element={<L><CountryJerseyYears /></L>} />
        <Route path="/ipl" element={<L><IPL /></L>} />
        <Route path="/ipl/:team" element={<L><IPLTeamDetails /></L>} />
        <Route path="/ipl/:team/:category" element={<L><IPLTeamCategory /></L>} />
        <Route path="/products" element={<L><Products /></L>} />
        <Route path="/products/:slug" element={<L><ProductDetails /></L>} />
        <Route path="/collections" element={<L><Collections /></L>} />
        <Route path="/trending" element={<L><Trending /></L>} />
        <Route path="/login" element={<L><Login /></L>} />
        <Route path="/register" element={<L><Register /></L>} />
        <Route path="/access-denied" element={<L><AccessDenied /></L>} />
        <Route path="/profile" element={<ProtectedRoute><L><Profile /></L></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><L><Wishlist /></L></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><L><Cart /></L></ProtectedRoute>} />
        <Route path="/order-success" element={<L><OrderSuccess /></L>} />
        <Route path="*" element={<L><NotFound /></L>} />
      </Route>

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<L><AdminDashboard /></L>} />
        <Route path="products" element={<L><AdminProducts /></L>} />
        <Route path="users" element={<L><AdminUsers /></L>} />
        <Route path="analytics" element={<L><AdminAnalytics /></L>} />
      </Route>
    </Routes>
  );
}
