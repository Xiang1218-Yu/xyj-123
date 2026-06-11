import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ShoppingCart,
  X,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { AddressTypeLabel, MemorialProductCategoryLabel } from '@/shared/types';
import type { AddressType, ShippingAddress } from '@/shared/types';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cartItems = useAppStore((s) => s.cartItems);
  const memorialProducts = useAppStore((s) => s.memorialProducts);
  const getCartTotal = useAppStore((s) => s.getCartTotal);
  const createOrder = useAppStore((s) => s.createOrder);
  const payOrder = useAppStore((s) => s.payOrder);

  const [address, setAddress] = useState<ShippingAddress>({
    name: '',
    phone: '',
    addressType: 'home',
    province: '',
    city: '',
    district: '',
    detail: '',
    notes: '',
  });

  const [showPayment, setShowPayment] = useState(false);
  const [payingOrder, setPayingOrder] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const cartTotal = getCartTotal();

  const handleAddressChange = (
    field: keyof ShippingAddress,
    value: string
  ) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const isAddressValid = () =>
    address.name.trim() !== '' &&
    address.phone.trim() !== '' &&
    address.province.trim() !== '' &&
    address.city.trim() !== '' &&
    address.detail.trim() !== '';

  const handleSubmitOrder = () => {
    if (!isAddressValid() || cartItems.length === 0) return;
    const order = createOrder(address);
    setPayingOrder(order.id);
    setShowPayment(true);
  };

  const handleMockPayment = () => {
    if (payingOrder) {
      payOrder(payingOrder);
      setPaymentComplete(true);
    }
  };

  if (cartItems.length === 0 && !paymentComplete) {
    return (
      <div className="text-center py-16">
        <ShoppingCart className="w-16 h-16 mx-auto text-primary-300 mb-4" />
        <p className="text-neutral-muted text-lg mb-4">购物车为空</p>
        <button onClick={() => navigate('/memorial-shop')} className="btn-primary">
          返回商城
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/memorial-shop')}
          className="p-2 rounded-lg hover:bg-primary-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary-700" />
        </button>
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary-900 mb-2">
            确认订单
          </h1>
          <p className="text-neutral-muted">填写收货地址并提交订单</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-800" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-primary-900">
                收货地址
              </h2>
            </div>

            <div className="mb-5">
              <label className="label-text">地址类型</label>
              <div className="flex gap-3">
                {(Object.keys(AddressTypeLabel) as AddressType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddressChange('addressType', type)}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                      address.addressType === type
                        ? 'bg-primary-800 text-white border-primary-800 shadow-md'
                        : 'bg-white text-primary-700 border-primary-200 hover:bg-primary-50'
                    }`}
                  >
                    {AddressTypeLabel[type]}
                  </button>
                ))}
              </div>
              {address.addressType !== 'home' && (
                <p className="mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  {address.addressType === 'urn-storage'
                    ? '选择骨灰存放处，商家将直接把祭祀用品放置到对应位置'
                    : '选择墓地/安放地，商家将直接前往安放地点布置祭祀用品'}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">收货人姓名 *</label>
                <input
                  type="text"
                  value={address.name}
                  onChange={(e) => handleAddressChange('name', e.target.value)}
                  className="input-field"
                  placeholder="请输入姓名"
                />
              </div>
              <div>
                <label className="label-text">联系电话 *</label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  className="input-field"
                  placeholder="请输入手机号"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="label-text">省/直辖市 *</label>
                <input
                  type="text"
                  value={address.province}
                  onChange={(e) => handleAddressChange('province', e.target.value)}
                  className="input-field"
                  placeholder="如：北京市"
                />
              </div>
              <div>
                <label className="label-text">城市 *</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="input-field"
                  placeholder="如：北京市"
                />
              </div>
              <div>
                <label className="label-text">区/县</label>
                <input
                  type="text"
                  value={address.district}
                  onChange={(e) => handleAddressChange('district', e.target.value)}
                  className="input-field"
                  placeholder="如：朝阳区"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="label-text">详细地址 *</label>
              <input
                type="text"
                value={address.detail}
                onChange={(e) => handleAddressChange('detail', e.target.value)}
                className="input-field"
                placeholder={
                  address.addressType === 'urn-storage'
                    ? '如：宠爱纪念园A区3排-001号位'
                    : address.addressType === 'cemetery'
                    ? '如：XX公墓3区8排12号'
                    : '街道、门牌号等'
                }
              />
            </div>

            <div className="mt-4">
              <label className="label-text">备注</label>
              <textarea
                value={address.notes}
                onChange={(e) => handleAddressChange('notes', e.target.value)}
                className="input-field min-h-[80px] resize-y"
                placeholder="如：请放置在骨灰存放处、周末勿打扰等"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="card sticky top-8">
            <h3 className="font-serif text-lg font-semibold text-primary-900 mb-4">
              订单摘要
            </h3>

            <div className="space-y-3 mb-4">
              {cartItems.map((item) => {
                const product = memorialProducts.find(
                  (p) => p.id === item.productId
                );
                if (!product) return null;
                return (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 p-2 rounded-lg bg-primary-50"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-neutral-muted">
                        {MemorialProductCategoryLabel[product.category]} ×{' '}
                        {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-amber-600 flex-shrink-0">
                      ¥{(product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-primary-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-neutral-muted">
                <span>商品总额</span>
                <span>¥{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-muted">
                <span>运费</span>
                <span className="text-green-600">免运费</span>
              </div>
              <div className="border-t border-primary-100 pt-2 flex justify-between">
                <span className="font-medium text-primary-900">应付金额</span>
                <span className="text-xl font-bold text-amber-600">
                  ¥{cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={!isAddressValid() || cartItems.length === 0}
              className="w-full btn-primary py-3 mt-4"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              提交订单
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => {
              if (paymentComplete) {
                setShowPayment(false);
                navigate('/memorial-orders');
              }
            }}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
            {paymentComplete ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary-900 mb-2">
                  支付成功
                </h3>
                <p className="text-neutral-muted mb-6">
                  您的订单已支付成功，商家将尽快安排{address.addressType !== 'home' ? '放置' : '发货'}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowPayment(false);
                      navigate('/memorial-orders');
                    }}
                    className="flex-1 btn-primary"
                  >
                    查看订单
                  </button>
                  <button
                    onClick={() => {
                      setShowPayment(false);
                      navigate('/memorial-shop');
                    }}
                    className="flex-1 btn-secondary"
                  >
                    继续选购
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 border-b border-primary-100">
                  <h3 className="font-serif text-lg font-semibold text-primary-900">
                    模拟支付
                  </h3>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="p-2 text-neutral-muted hover:text-neutral-text hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5">
                  <div className="text-center mb-6">
                    <p className="text-sm text-neutral-muted mb-1">支付金额</p>
                    <p className="text-3xl font-bold text-amber-600">
                      ¥{cartTotal.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-primary-800 bg-primary-50">
                      <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-900">
                          微信支付
                        </p>
                        <p className="text-xs text-neutral-muted">模拟支付</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleMockPayment}
                    className="w-full btn-primary py-3"
                  >
                    确认支付 ¥{cartTotal.toLocaleString()}
                  </button>
                  <p className="text-center text-xs text-neutral-muted mt-3">
                    这是模拟支付，不会产生实际扣款
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
