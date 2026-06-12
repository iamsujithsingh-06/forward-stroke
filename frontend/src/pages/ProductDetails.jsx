import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { productService } from '../services/productService';
import SEO from '../components/SEO';
import WishlistButton from '../components/WishlistButton';
import CartButton from '../components/CartButton';
import RelatedProducts from '../components/RelatedProducts';
import Loading from '../components/Loading';
import Error from '../components/Error';

const FALLBACK_IMG = 'https://placehold.co/600x700/1e293b/475569?text=Product';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setNotFound(false);
    productService
      .getBySlug(slug)
      .then(({ data }) => {
        setProduct(data.product);
      })
      .catch((err) => {
        if (err.message?.includes('404') || err.message?.toLowerCase().includes('not found')) {
          setNotFound(true);
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFound) return <Navigate to="/products" replace />;
  if (loading) return <Loading fullPage text="Loading product..." />;
  if (error) return <Error message={error} />;
  if (!product) return <Error message="Product not found." />;

  const imgSrc = imgError ? FALLBACK_IMG : (product.images?.[0] || FALLBACK_IMG);
  const inStock = true;

  const productName = product?.name || 'Product';
  const productDesc = product?.description || '';
  const productImage = product?.images?.[0] || '';

  return (
    <>
      <SEO title={productName} description={productDesc} ogImage={productImage} ogType="product" />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-900">
          <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">
            {product.category?.replace(/-/g, ' ')}
            {product.team && <span className="ml-2 text-surface-400">| {product.team}</span>}
            {product.country && <span className="ml-2 text-surface-400">| {product.country}</span>}
          </p>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900 dark:text-white uppercase tracking-wide">
            {product.name}
          </h1>

          <div className="flex items-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-surface-300 dark:text-surface-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-surface-400 ml-1">{product.rating} / 5</span>
          </div>

          <p className="mt-4 text-surface-600 dark:text-surface-400 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-surface-900 dark:text-white">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.comparePrice > product.price && (
              <>
                <span className="text-lg text-surface-400 line-through">
                  ₹{product.comparePrice?.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {Math.round((1 - product.price / product.comparePrice) * 100)}% off
                </span>
              </>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm ${inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {inStock ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <CartButton productId={product._id} disabled={!inStock} className="flex-1 py-3 text-base" />
            <WishlistButton productId={product._id} className="p-3" />
          </div>

          {product.tags?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/products?search=${tag}`}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <RelatedProducts productId={product._id} />
    </section>
    </>
  );
}
