import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { MemorialProductCategoryLabel } from '@/shared/types';
import type { MemorialProductCategory } from '@/shared/types';
import { cn } from '@/lib/utils';

const allCategories: MemorialProductCategory[] = [
  'spirit-tablet',
  'memorial-ornament',
  'urn',
  'pet-tombstone',
  'incense-candle',
  'afterlife-blanket',
];

export default function MemorialShop() {
  const navigate = useNavigate();
  const memorialProducts = useAppStore((s) => s.memorialProducts);
  const cartItems = useAppStore((s) => s.cartItems);
  const addToCart = useAppStore((s) => s.addToCart);
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const updateCartItemQuantity = useAppStore((s) => s.updateCartItemQuantity);
  const getCartItemCount = useAppStore((s) => s.getCartItemCount);
  const getCartTotal = useAppStore((s) => s.getCartTotal);

  const [selectedCategory, setSelectedCategory] = useState<MemorialProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = memorialProducts.filter((p) => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const cartItemCount = getCartItemCount();
  const cartTotal = getCartTotal();

  const getQuantityInCart = (productId: string) =>
    cartItems.find((item) => item.productId === productId)?.quantity ?? 0;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary-900 mb-2">
            祭祀用品商城
          </h1>
          <p className="text-neutral-muted">为逝去的伙伴选购庄重而温馨的祭祀用品</p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative btn-primary"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          购物车
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="搜索祭祀用品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            selectedCategory === 'all'
              ? 'bg-primary-800 text-white shadow-md'
              : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
          )}
        >
          全部
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedCategory === cat
                ? 'bg-primary-800 text-white shadow-md'
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            )}
          >
            {MemorialProductCategoryLabel[cat]}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="card text-center py-16">
          <ShoppingBag className="w-16 h-16 mx-auto text-primary-300 mb-4" />
          <p className="text-neutral-muted text-lg">暂无匹配的祭祀用品</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const qty = getQuantityInCart(product.id);
            return (
              <div
                key={product.id}
                className="card overflow-hidden group hover:shadow-lg transition-all duration-200 p-0"
              >
                <div className="relative h-48 bg-primary-50 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="status-badge bg-white/90 text-primary-800 backdrop-blur-sm">
                      {MemorialProductCategoryLabel[product.category]}
                    </span>
                  </div>
                  {product.stock <= 10 && (
                    <div className="absolute top-3 right-3">
                      <span className="status-badge bg-red-500/90 text-white">
                        仅剩{product.stock}件
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-serif text-lg font-semibold text-primary-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-neutral-muted line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  {(product.material || product.specs) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {product.material && (
                        <span className="text-xs px-2 py-1 rounded bg-primary-50 text-primary-600">
                          {product.material}
                        </span>
                      )}
                      {product.specs && (
                        <span className="text-xs px-2 py-1 rounded bg-primary-50 text-primary-600">
                          {product.specs}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-amber-600">
                        ¥{product.price.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-muted">
                      已售{product.sales}
                    </span>
                  </div>

                  <div className="mt-3">
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(product.id)}
                        className="w-full btn-primary py-2 text-sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        加入购物车
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-primary-50 rounded-lg p-1">
                        <button
                          onClick={() =>
                            qty === 1
                              ? removeFromCart(product.id)
                              : updateCartItemQuantity(product.id, qty - 1)
                          }
                          className="w-8 h-8 rounded-lg bg-white border border-primary-200 flex items-center justify-center text-primary-700 hover:bg-primary-100 transition-colors"
                        >
                          {qty === 1 ? (
                            <Trash2 className="w-3.5 h-3.5" />
                          ) : (
                            <Minus className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="text-sm font-semibold text-primary-800 min-w-[2rem] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(product.id, qty + 1)}
                          className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center text-white hover:bg-primary-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowCart(false)}
          />
          <div className="relative w-full max-w-md bg-white shadow-2xl animate-scale-in flex flex-col h-full">
            <div className="flex items-center justify-between p-5 border-b border-primary-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary-800" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-primary-900">
                    购物车
                  </h3>
                  <p className="text-xs text-neutral-muted">
                    {cartItemCount} 件商品
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 text-neutral-muted hover:text-neutral-text hover:bg-primary-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-16 h-16 mx-auto text-primary-200 mb-4" />
                  <p className="text-neutral-muted">购物车为空</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="btn-primary mt-4 text-sm"
                  >
                    去选购
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const product = memorialProducts.find(
                    (p) => p.id === item.productId
                  );
                  if (!product) return null;
                  return (
                    <div
                      key={item.productId}
                      className="flex gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-primary-900 truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-neutral-muted mt-0.5">
                          {MemorialProductCategoryLabel[product.category]}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-amber-600">
                            ¥{product.price.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                item.quantity === 1
                                  ? removeFromCart(item.productId)
                                  : updateCartItemQuantity(
                                      item.productId,
                                      item.quantity - 1
                                    )
                              }
                              className="w-6 h-6 rounded border border-primary-200 bg-white flex items-center justify-center text-primary-600 hover:bg-primary-50"
                            >
                              {item.quantity === 1 ? (
                                <Trash2 className="w-3 h-3" />
                              ) : (
                                <Minus className="w-3 h-3" />
                              )}
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartItemQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className="w-6 h-6 rounded bg-primary-800 flex items-center justify-center text-white hover:bg-primary-700"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-5 border-t border-primary-100 bg-primary-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-muted">合计</span>
                  <span className="text-2xl font-bold text-amber-600">
                    ¥{cartTotal.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowCart(false);
                    navigate('/memorial-shop/checkout');
                  }}
                  className="w-full btn-primary py-3"
                >
                  去结算
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
