import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Image,
  Search,
  AlertTriangle,
  X
} from 'lucide-react';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';
import type { FuneralPackage } from '@/shared/types';

export default function PackageList() {
  const {
    funeralPackages,
    serviceItems,
    deleteFuneralPackage,
    calculatePackagePrice
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<FuneralPackage | null>(null);

  const filteredPackages = funeralPackages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getServiceItemName = (serviceItemId: string) => {
    return serviceItems.find((s) => s.id === serviceItemId)?.name ?? '未知服务';
  };

  const getIncludedServices = (pkg: FuneralPackage) => {
    return pkg.serviceItems.filter((s) => s.included);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteFuneralPackage(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    if (deleteTarget) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [deleteTarget]);

  return (
    <div className="relative">
      <PageHeader
        title="丧葬套餐管理"
        description="管理宠物丧葬服务套餐，自定义服务项和价格"
        actions={
          <Link to="/packages/new" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            新增套餐
          </Link>
        }
      />

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
          <input
            type="text"
            placeholder="搜索套餐名称或描述..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {filteredPackages.length === 0 ? (
        <div className="card text-center py-16">
          <Package className="w-16 h-16 mx-auto text-primary-300 mb-4" />
          <p className="text-neutral-muted text-lg">
            {searchQuery ? '未找到匹配的套餐' : '暂无丧葬套餐'}
          </p>
          {!searchQuery && (
            <Link to="/packages/new" className="btn-primary mt-6">
              <Plus className="w-4 h-4 mr-2" />
              创建第一个套餐
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const includedCount = getIncludedServices(pkg).length;
            const totalPrice = calculatePackagePrice(pkg);

            return (
              <div
                key={pkg.id}
                className="card overflow-hidden group hover:shadow-lg transition-all duration-200"
              >
                <div className="relative h-40 bg-primary-100 -mx-6 -mt-6 mb-4">
                  {pkg.coverImage ? (
                    <img
                      src={pkg.coverImage}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-12 h-12 text-primary-300" />
                    </div>
                  )}
                  {pkg.isRecommended && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      推荐
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-xl font-semibold text-primary-900">
                      {pkg.name}
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-muted line-clamp-2 mb-3">
                    {pkg.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-amber-600">
                      ¥{totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-muted">起</span>
                  </div>
                </div>

                <div className="border-t border-primary-100 -mx-6 px-6 py-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-neutral-text">
                      包含服务
                    </span>
                    <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                      {includedCount} 项
                    </span>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {pkg.serviceItems.slice(0, 5).map((psi) => {
                      const serviceItem = serviceItems.find(
                        (s) => s.id === psi.serviceItemId
                      );
                      return (
                        <div
                          key={psi.serviceItemId}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            {psi.included ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-neutral-300" />
                            )}
                            <span
                              className={
                                psi.included
                                  ? 'text-neutral-text'
                                  : 'text-neutral-muted line-through'
                              }
                            >
                              {getServiceItemName(psi.serviceItemId)}
                            </span>
                          </div>
                          {psi.included && serviceItem && (
                            <span className="text-xs text-neutral-muted">
                              ¥{psi.customPrice ?? serviceItem.price}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {pkg.serviceItems.length > 5 && (
                      <p className="text-xs text-neutral-muted text-center">
                        还有 {pkg.serviceItems.length - 5} 项服务...
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 -mx-2">
                  <Link
                    to={`/packages/${pkg.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    编辑
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(pkg)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    删除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-primary-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-neutral-text">
                  确认删除
                </h3>
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                className="p-2 text-neutral-muted hover:text-neutral-text hover:bg-primary-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-neutral-text mb-4">
                您确定要删除以下套餐吗？此操作无法撤销。
              </p>
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 overflow-hidden flex-shrink-0">
                    {deleteTarget.coverImage ? (
                      <img
                        src={deleteTarget.coverImage}
                        alt={deleteTarget.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-text">
                      {deleteTarget.name}
                    </p>
                    <p className="text-sm text-neutral-muted line-clamp-2">
                      {deleteTarget.description}
                    </p>
                    <p className="text-sm text-amber-600 font-medium mt-1">
                      ¥{calculatePackagePrice(deleteTarget).toLocaleString()} 起
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-5 border-t border-primary-100 bg-primary-50/50">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-neutral-text bg-white border border-primary-200 hover:bg-primary-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
