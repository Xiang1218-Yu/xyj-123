import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  CreditCard,
  Truck,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Camera,
  FileText,
} from 'lucide-react';
import { useAppStore } from '@/store';
import {
  OrderStatusLabel,
  AddressTypeLabel,
  MemorialProductCategoryLabel,
} from '@/shared/types';
import type { Order, OrderStatus } from '@/shared/types';
import { cn } from '@/lib/utils';

const statusSteps: OrderStatus[] = [
  'pending-payment',
  'paid',
  'processing',
  'placed',
  'completed',
];

const statusIconMap: Record<OrderStatus, React.ReactNode> = {
  'pending-payment': <Clock className="w-5 h-5" />,
  paid: <CreditCard className="w-5 h-5" />,
  processing: <Truck className="w-5 h-5" />,
  placed: <CheckCircle2 className="w-5 h-5" />,
  completed: <CheckCircle2 className="w-5 h-5" />,
};

const statusColorMap: Record<OrderStatus, string> = {
  'pending-payment': 'text-amber-500',
  paid: 'text-blue-500',
  processing: 'text-purple-500',
  placed: 'text-green-500',
  completed: 'text-green-600',
};

const statusBgMap: Record<OrderStatus, string> = {
  'pending-payment': 'bg-amber-100',
  paid: 'bg-blue-100',
  processing: 'bg-purple-100',
  placed: 'bg-green-100',
  completed: 'bg-green-100',
};

function getStepIndex(status: OrderStatus) {
  return statusSteps.indexOf(status);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderList() {
  const navigate = useNavigate();
  const memorialOrders = useAppStore((s) => s.memorialOrders);
  const memorialProducts = useAppStore((s) => s.memorialProducts);
  const payOrder = useAppStore((s) => s.payOrder);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const filteredOrders =
    filterStatus === 'all'
      ? [...memorialOrders].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      : [...memorialOrders]
          .filter((o) => o.status === filterStatus)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

  const getProduct = (productId: string) =>
    memorialProducts.find((p) => p.id === productId);

  const handlePay = (orderId: string) => {
    setPayingOrderId(orderId);
    setShowPayment(true);
  };

  const confirmPay = () => {
    if (payingOrderId) {
      payOrder(payingOrderId);
      setShowPayment(false);
      setPayingOrderId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary-900 mb-2">
            我的订单
          </h1>
          <p className="text-neutral-muted">查看订单状态、放置进度与实景照片</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            filterStatus === 'all'
              ? 'bg-primary-800 text-white shadow-md'
              : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
          )}
        >
          全部
        </button>
        {statusSteps.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              filterStatus === status
                ? 'bg-primary-800 text-white shadow-md'
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            )}
          >
            {OrderStatusLabel[status]}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="card text-center py-16">
          <Package className="w-16 h-16 mx-auto text-primary-300 mb-4" />
          <p className="text-neutral-muted text-lg">暂无订单</p>
          <button
            onClick={() => navigate('/memorial-shop')}
            className="btn-primary mt-4"
          >
            去选购
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const currentStep = getStepIndex(order.status);
            return (
              <div
                key={order.id}
                className="card cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-neutral-muted">
                      {order.orderNo}
                    </span>
                    <span className="text-xs text-neutral-muted">|</span>
                    <span className="text-xs text-neutral-muted">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'status-badge',
                      statusBgMap[order.status],
                      statusColorMap[order.status]
                    )}
                  >
                    {order.status === 'pending-payment' && (
                      <Clock className="w-3.5 h-3.5 mr-1" />
                    )}
                    {order.status === 'paid' && (
                      <CreditCard className="w-3.5 h-3.5 mr-1" />
                    )}
                    {order.status === 'processing' && (
                      <Truck className="w-3.5 h-3.5 mr-1" />
                    )}
                    {(order.status === 'placed' || order.status === 'completed') && (
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    )}
                    {OrderStatusLabel[order.status]}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">
                  {order.items.map((item) => {
                    const product = getProduct(item.productId);
                    if (!product) return null;
                    return (
                      <div
                        key={item.productId}
                        className="flex items-center gap-2 p-2 rounded-lg bg-primary-50 flex-shrink-0"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-primary-900 truncate max-w-[120px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-neutral-muted">×{item.quantity}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-primary-100 pt-3">
                  <div className="flex items-center gap-2 text-sm text-neutral-muted">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {AddressTypeLabel[order.address.addressType]} ·{' '}
                      {order.address.province}
                      {order.address.city}
                      {order.address.district}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-amber-600">
                      ¥{order.totalAmount.toLocaleString()}
                    </span>
                    {order.status === 'pending-payment' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePay(order.id);
                        }}
                        className="btn-primary py-1.5 px-4 text-sm"
                      >
                        立即支付
                      </button>
                    )}
                  </div>
                </div>

                {order.placementPhotos.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-primary-100">
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium mb-2">
                      <Camera className="w-4 h-4" />
                      已有 {order.placementPhotos.length} 张放置照片
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {order.placementPhotos.slice(0, 3).map((photo) => (
                        <div
                          key={photo.id}
                          className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-green-200"
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.placementPhotos.length > 3 && (
                        <div className="w-16 h-16 rounded-lg flex-shrink-0 bg-primary-50 border-2 border-primary-200 flex items-center justify-center text-xs text-primary-600 font-medium">
                          +{order.placementPhotos.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-primary-100">
                  <div className="flex items-center justify-between">
                    {statusSteps.map((step, idx) => (
                      <div
                        key={step}
                        className="flex items-center"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-xs',
                              idx <= currentStep
                                ? cn(statusBgMap[step], statusColorMap[step])
                                : 'bg-primary-50 text-primary-300'
                            )}
                          >
                            {statusIconMap[step]}
                          </div>
                          <span
                            className={cn(
                              'text-[10px] mt-1 whitespace-nowrap',
                              idx <= currentStep
                                ? 'text-primary-700 font-medium'
                                : 'text-primary-300'
                            )}
                          >
                            {OrderStatusLabel[step]}
                          </span>
                        </div>
                        {idx < statusSteps.length - 1 && (
                          <div
                            className={cn(
                              'w-8 lg:w-16 h-0.5 mx-1 mb-5',
                              idx < currentStep
                                ? 'bg-primary-800'
                                : 'bg-primary-100'
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          products={memorialProducts}
          onClose={() => setSelectedOrder(null)}
          onPay={handlePay}
        />
      )}

      {showPayment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPayment(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-scale-in">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary-900 mb-2">
                确认支付
              </h3>
              <p className="text-2xl font-bold text-amber-600 mb-4">
                ¥
                {memorialOrders
                  .find((o) => o.id === payingOrderId)
                  ?.totalAmount.toLocaleString() ?? '0'}
              </p>
              <p className="text-xs text-neutral-muted mb-6">
                模拟支付，不会产生实际扣款
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button onClick={confirmPay} className="flex-1 btn-primary">
                  确认支付
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderDetailModal({
  order,
  products,
  onClose,
  onPay,
}: {
  order: Order;
  products: ReturnType<typeof useAppStore.getState>['memorialProducts'];
  onClose: () => void;
  onPay: (orderId: string) => void;
}) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const currentStep = getStepIndex(order.status);

  const getProduct = (productId: string) =>
    products.find((p) => p.id === productId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-primary-100 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-800" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-primary-900">
                订单详情
              </h3>
              <p className="text-xs font-mono text-neutral-muted">
                {order.orderNo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-muted hover:text-neutral-text hover:bg-primary-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-neutral-muted mb-3">
              订单进度
            </h4>
            <div className="flex items-center justify-between">
              {statusSteps.map((step, idx) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        idx <= currentStep
                          ? cn(statusBgMap[step], statusColorMap[step])
                          : 'bg-primary-50 text-primary-300'
                      )}
                    >
                      {statusIconMap[step]}
                    </div>
                    <span
                      className={cn(
                        'text-xs mt-1.5 whitespace-nowrap',
                        idx <= currentStep
                          ? 'text-primary-700 font-medium'
                          : 'text-primary-300'
                      )}
                    >
                      {OrderStatusLabel[step]}
                    </span>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div
                      className={cn(
                        'w-12 h-0.5 mx-2 mb-5',
                        idx < currentStep ? 'bg-primary-800' : 'bg-primary-100'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-primary-100 pt-4">
            <h4 className="text-sm font-medium text-neutral-muted mb-3">
              商品信息
            </h4>
            <div className="space-y-3">
              {order.items.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                return (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 p-3 rounded-xl bg-primary-50"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-neutral-muted">
                        {MemorialProductCategoryLabel[product.category]} ×{' '}
                        {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-amber-600 flex-shrink-0">
                      ¥{(product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-primary-100 pt-4">
            <h4 className="text-sm font-medium text-neutral-muted mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              收货信息
            </h4>
            <div className="bg-primary-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="status-badge bg-white text-primary-800 text-xs">
                  {AddressTypeLabel[order.address.addressType]}
                </span>
                <span className="text-sm font-medium text-primary-900">
                  {order.address.name}
                </span>
                <span className="text-sm text-neutral-muted">
                  {order.address.phone}
                </span>
              </div>
              <p className="text-sm text-neutral-text">
                {order.address.province}
                {order.address.city}
                {order.address.district}
                {order.address.detail}
              </p>
              {order.address.notes && (
                <p className="text-xs text-neutral-muted">
                  备注：{order.address.notes}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-primary-100 pt-4">
            <h4 className="text-sm font-medium text-neutral-muted mb-3">
              订单信息
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-muted">下单时间</span>
                <span className="text-primary-900">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-muted">支付时间</span>
                  <span className="text-primary-900">
                    {formatDate(order.paidAt)}
                  </span>
                </div>
              )}
              {order.placedAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-muted">放置时间</span>
                  <span className="text-primary-900">
                    {formatDate(order.placedAt)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-primary-50">
                <span className="font-medium text-primary-900">订单金额</span>
                <span className="text-lg font-bold text-amber-600">
                  ¥{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {order.placementPhotos.length > 0 && (
            <div className="border-t border-primary-100 pt-4">
              <h4 className="text-sm font-medium text-neutral-muted mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                放置实景照片
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {order.placementPhotos.length} 张
                </span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {(showAllPhotos
                  ? order.placementPhotos
                  : order.placementPhotos.slice(0, 4)
                ).map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-xl overflow-hidden border-2 border-green-200"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {photo.caption && (
                      <div className="p-2 bg-green-50">
                        <p className="text-xs text-green-700">{photo.caption}</p>
                        <p className="text-[10px] text-neutral-muted mt-0.5">
                          {formatDate(photo.takenAt)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {order.placementPhotos.length > 4 && (
                <button
                  onClick={() => setShowAllPhotos(!showAllPhotos)}
                  className="mt-3 w-full flex items-center justify-center gap-1 py-2 text-sm text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  {showAllPhotos ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      收起照片
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      查看全部 {order.placementPhotos.length} 张照片
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {order.placementNote && (
            <div className="border-t border-primary-100 pt-4">
              <h4 className="text-sm font-medium text-neutral-muted mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                放置备注
              </h4>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-sm text-amber-800">{order.placementNote}</p>
              </div>
            </div>
          )}

          {order.status === 'pending-payment' && (
            <div className="border-t border-primary-100 pt-4">
              <button
                onClick={() => onPay(order.id)}
                className="w-full btn-primary py-3"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                立即支付 ¥{order.totalAmount.toLocaleString()}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
