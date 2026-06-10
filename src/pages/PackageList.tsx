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
  X,
  ChevronDown,
  ChevronUp,
  CalendarCheck,
  User,
  PawPrint,
  ExternalLink
} from 'lucide-react';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';
import type { FuneralPackage, Ceremony } from '@/shared/types';

export default function PackageList() {
  const {
    funeralPackages,
    serviceItems,
    deleteFuneralPackage,
    calculatePackagePrice,
    ceremonies,
    pets,
    owners
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<FuneralPackage | null>(null);
  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});
  const [cannotDelete, setCannotDelete] = useState<{
    pkg: FuneralPackage;
    referencingCeremonies: (Ceremony & { petName?: string; ownerName?: string })[];
  } | null>(null);

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

  const togglePackageExpand = (packageId: string) => {
    setExpandedPackages((prev) => ({
      ...prev,
      [packageId]: !prev[packageId]
    }));
  };

  const getReferencingCeremonies = (packageId: string) => {
    return ceremonies
      .filter((c) => c.packageId === packageId)
      .map((c) => {
        const pet = pets.find((p) => p.id === c.petId);
        const owner = pet ? owners.find((o) => o.id === pet.ownerId) : undefined;
        return {
          ...c,
          petName: pet?.name,
          ownerName: owner?.name
        };
      });
  };

  const handleDeleteClick = (pkg: FuneralPackage) => {
    const refs = getReferencingCeremonies(pkg.id);
    if (refs.length > 0) {
      setCannotDelete({ pkg, referencingCeremonies: refs });
    } else {
      setDeleteTarget(pkg);
    }
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteFuneralPackage(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    const anyModalOpen = deleteTarget !== null || cannotDelete !== null;
    if (anyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [deleteTarget, cannotDelete]);

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            const isExpanded = expandedPackages[pkg.id] ?? false;
            const serviceCount = pkg.serviceItems.length;
            const shouldCollapse = serviceCount > 5;
            const displayServices = shouldCollapse && !isExpanded
              ? pkg.serviceItems.slice(0, 5)
              : pkg.serviceItems;
            const hiddenCount = serviceCount - 5;

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
                      {includedCount} / {serviceCount} 项
                    </span>
                  </div>
                  <div className="space-y-2">
                    {displayServices.map((psi) => {
                      const serviceItem = serviceItems.find(
                        (s) => s.id === psi.serviceItemId
                      );
                      return (
                        <div
                          key={psi.serviceItemId}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {psi.included ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-neutral-300 flex-shrink-0" />
                            )}
                            <span
                              className={`truncate ${
                                psi.included
                                  ? 'text-neutral-text'
                                  : 'text-neutral-muted line-through'
                              }`}
                            >
                              {getServiceItemName(psi.serviceItemId)}
                            </span>
                          </div>
                          {psi.included && serviceItem && (
                            <span className="text-xs text-neutral-muted flex-shrink-0 ml-2">
                              ¥{psi.customPrice ?? serviceItem.price}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {shouldCollapse && (
                    <button
                      onClick={() => togglePackageExpand(pkg.id)}
                      className="mt-3 w-full flex items-center justify-center gap-1 py-2 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          收起服务列表
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          展开全部 {serviceCount} 项服务（隐藏 {hiddenCount} 项）
                        </>
                      )}
                    </button>
                  )}
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
                    onClick={() => handleDeleteClick(pkg)}
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

      {cannotDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setCannotDelete(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-primary-100 bg-amber-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-neutral-text">
                    无法删除套餐
                  </h3>
                  <p className="text-xs text-amber-700">
                    该套餐存在预约引用，无法直接删除
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCannotDelete(null)}
                className="p-2 text-neutral-muted hover:text-neutral-text hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 overflow-hidden flex-shrink-0">
                    {cannotDelete.pkg.coverImage ? (
                      <img
                        src={cannotDelete.pkg.coverImage}
                        alt={cannotDelete.pkg.name}
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
                      {cannotDelete.pkg.name}
                    </p>
                    <p className="text-sm text-neutral-muted line-clamp-2">
                      {cannotDelete.pkg.description}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-muted mb-3">
                以下 <span className="font-semibold text-amber-700">{cannotDelete.referencingCeremonies.length}</span> 个预约使用了此套餐：
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {cannotDelete.referencingCeremonies.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary-50 border border-primary-100"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-full bg-white border border-primary-100 flex items-center justify-center flex-shrink-0">
                        <PawPrint className="w-4 h-4 text-primary-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-text truncate">
                            {c.petName || '未知宠物'}
                          </span>
                          {c.ownerName && (
                            <>
                              <span className="text-neutral-muted">·</span>
                              <div className="flex items-center gap-1 text-xs text-neutral-muted min-w-0">
                                <User className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{c.ownerName}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-neutral-muted mt-0.5">
                          <CalendarCheck className="w-3 h-3 flex-shrink-0" />
                          {formatDateTime(c.ceremonyTime)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  请先前往
                  <a href="/appointments" className="font-semibold underline mx-0.5 hover:text-blue-900">
                    主人预约
                  </a>
                  页面处理上述引用的预约后，再尝试删除此套餐。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end p-5 border-t border-primary-100 bg-primary-50/50">
              <button
                onClick={() => setCannotDelete(null)}
                className="btn-primary"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
