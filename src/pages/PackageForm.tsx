import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Package,
  Image,
  FileText,
  DollarSign,
  Sparkles,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Settings,
  Tag
} from 'lucide-react';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';
import type { PackageServiceItem, ServiceItem } from '@/shared/types';

interface FormData {
  name: string;
  description: string;
  coverImage: string;
  basePrice: number;
  isRecommended: boolean;
  serviceItems: PackageServiceItem[];
}

const categoryLabels: Record<ServiceItem['category'], string> = {
  transport: '接送服务',
  ceremony: '仪式服务',
  cremation: '火化服务',
  memorial: '纪念服务',
  other: '其他服务'
};

export default function PackageForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const {
    serviceItems,
    addFuneralPackage,
    updateFuneralPackage,
    getFuneralPackageById,
    addServiceItem,
    deleteServiceItem,
    calculatePackagePrice
  } = useAppStore();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    coverImage: '',
    basePrice: 0,
    isRecommended: false,
    serviceItems: []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [newServiceOpen, setNewServiceOpen] = useState(false);
  const [newService, setNewService] = useState<{
    name: string;
    description: string;
    price: number;
    category: ServiceItem['category'];
  }>({
    name: '',
    description: '',
    price: 0,
    category: 'other'
  });
  const [newServiceErrors, setNewServiceErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const pkg = getFuneralPackageById(id);
      if (pkg) {
        setFormData({
          name: pkg.name,
          description: pkg.description,
          coverImage: pkg.coverImage ?? '',
          basePrice: pkg.basePrice,
          isRecommended: pkg.isRecommended ?? false,
          serviceItems: pkg.serviceItems
        });
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        serviceItems: serviceItems.map((s) => ({
          serviceItemId: s.id,
          included: false
        }))
      }));
    }
  }, [isEdit, id, getFuneralPackageById, serviceItems]);

  const handleChange = (field: keyof FormData, value: string | number | boolean | PackageServiceItem[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleServiceItem = (serviceItemId: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceItems: prev.serviceItems.map((psi) =>
        psi.serviceItemId === serviceItemId
          ? { ...psi, included: !psi.included }
          : psi
      )
    }));
  };

  const updateCustomPrice = (serviceItemId: string, price: number) => {
    setFormData((prev) => ({
      ...prev,
      serviceItems: prev.serviceItems.map((psi) =>
        psi.serviceItemId === serviceItemId
          ? { ...psi, customPrice: price }
          : psi
      )
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = '请输入套餐名称';
    if (!formData.description.trim()) newErrors.description = '请输入套餐描述';
    if (formData.basePrice < 0) newErrors.basePrice = '基础价格不能为负数';

    const includedCount = formData.serviceItems.filter((s) => s.included).length;
    if (includedCount === 0) {
      newErrors.serviceItems = '请至少选择一项服务';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const pkgData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      coverImage: formData.coverImage.trim() || undefined,
      basePrice: formData.basePrice,
      isRecommended: formData.isRecommended,
      serviceItems: formData.serviceItems
    };

    if (isEdit && id) {
      updateFuneralPackage(id, pkgData);
    } else {
      addFuneralPackage(pkgData);
    }

    navigate('/packages');
  };

  const handleAddServiceItem = () => {
    const newErrors: Record<string, string> = {};
    if (!newService.name.trim()) newErrors.name = '请输入服务名称';
    if (newService.price < 0) newErrors.price = '价格不能为负数';

    if (Object.keys(newErrors).length > 0) {
      setNewServiceErrors(newErrors);
      return;
    }

    const added = addServiceItem({
      name: newService.name.trim(),
      description: newService.description.trim(),
      price: newService.price,
      category: newService.category
    });

    setFormData((prev) => ({
      ...prev,
      serviceItems: [
        ...prev.serviceItems,
        { serviceItemId: added.id, included: true }
      ]
    }));

    setNewService({ name: '', description: '', price: 0, category: 'other' });
    setNewServiceErrors({});
    setNewServiceOpen(false);
  };

  const handleDeleteServiceItem = (serviceItemId: string) => {
    deleteServiceItem(serviceItemId);
    setFormData((prev) => ({
      ...prev,
      serviceItems: prev.serviceItems.filter((s) => s.serviceItemId !== serviceItemId)
    }));
  };

  const groupedServiceItems = serviceItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<ServiceItem['category'], ServiceItem[]>
  );

  const currentPackageForPrice = isEdit && id
    ? getFuneralPackageById(id)
    : null;

  const totalPrice = currentPackageForPrice
    ? calculatePackagePrice({ ...currentPackageForPrice, serviceItems: formData.serviceItems })
    : calculatePackagePrice({
        id: 'temp',
        name: formData.name,
        description: formData.description,
        basePrice: formData.basePrice,
        serviceItems: formData.serviceItems,
        createdAt: '',
        updatedAt: ''
      });

  return (
    <div>
      <PageHeader
        title={isEdit ? '编辑套餐' : '新增套餐'}
        description={isEdit ? '更新丧葬套餐的服务和价格' : '创建新的丧葬服务套餐'}
        actions={
          <Link to="/packages" className="btn-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h3 className="font-serif text-lg font-semibold text-primary-900 mb-6 flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary-600" />
            套餐基本信息
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-text flex items-center">
                <Tag className="w-4 h-4 mr-1.5 text-primary-400" />
                套餐名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="例如：温馨基础套餐"
                className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="label-text flex items-center">
                <DollarSign className="w-4 h-4 mr-1.5 text-primary-400" />
                基础价格 (元) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.basePrice}
                onChange={(e) => handleChange('basePrice', Number(e.target.value))}
                placeholder="0"
                className={`input-field ${errors.basePrice ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.basePrice && <p className="mt-1 text-sm text-red-500">{errors.basePrice}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="label-text flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-primary-400" />
                套餐描述 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="请描述套餐的特点和适用场景..."
                rows={3}
                className={`input-field resize-none ${errors.description ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="label-text flex items-center">
                <Image className="w-4 h-4 mr-1.5 text-primary-400" />
                封面图片URL
              </label>
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => handleChange('coverImage', e.target.value)}
                placeholder="请输入封面图片的URL（选填）"
                className="input-field"
              />
              {formData.coverImage && (
                <div className="mt-3">
                  <img
                    src={formData.coverImage}
                    alt="预览"
                    className="w-40 h-24 rounded-lg object-cover border-2 border-primary-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isRecommended}
                  onChange={(e) => handleChange('isRecommended', e.target.checked)}
                  className="w-5 h-5 text-primary-800 rounded focus:ring-primary-500"
                />
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium text-neutral-text">设为推荐套餐</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg font-semibold text-primary-900 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-primary-600" />
              服务项配置
            </h3>
            <button
              type="button"
              onClick={() => setNewServiceOpen(!newServiceOpen)}
              className="btn-secondary text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              新增服务项
            </button>
          </div>

          {errors.serviceItems && (
            <p className="mb-4 text-sm text-red-500">{errors.serviceItems}</p>
          )}

          {newServiceOpen && (
            <div className="mb-6 p-5 bg-primary-50 rounded-xl border border-primary-100">
              <h4 className="font-medium text-primary-900 mb-4">新增服务项</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label-text">服务名称 *</label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    placeholder="例如：接送服务"
                    className={`input-field ${newServiceErrors.name ? 'border-red-400' : ''}`}
                  />
                  {newServiceErrors.name && (
                    <p className="mt-1 text-xs text-red-500">{newServiceErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="label-text">价格 (元)</label>
                  <input
                    type="number"
                    min="0"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                    className={`input-field ${newServiceErrors.price ? 'border-red-400' : ''}`}
                  />
                  {newServiceErrors.price && (
                    <p className="mt-1 text-xs text-red-500">{newServiceErrors.price}</p>
                  )}
                </div>
                <div>
                  <label className="label-text">服务分类</label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value as ServiceItem['category'] })}
                    className="input-field"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="label-text">服务描述</label>
                  <input
                    type="text"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="简要描述该服务内容"
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddServiceItem}
                  className="btn-primary text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  添加服务
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewServiceOpen(false);
                    setNewService({ name: '', description: '', price: 0, category: 'other' });
                    setNewServiceErrors({});
                  }}
                  className="btn-secondary text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {Object.entries(groupedServiceItems).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-3">
                  {categoryLabels[category as ServiceItem['category']]}
                </h4>
                <div className="space-y-2">
                  {items.map((item) => {
                    const psi = formData.serviceItems.find(
                      (s) => s.serviceItemId === item.id
                    );
                    const isIncluded = psi?.included ?? false;
                    const customPrice = psi?.customPrice;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          isIncluded
                            ? 'border-amber-300 bg-amber-50'
                            : 'border-primary-100 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className="flex-1 flex items-start gap-3 cursor-pointer"
                            onClick={() => toggleServiceItem(item.id)}
                          >
                            <div className={`mt-0.5 flex-shrink-0 ${isIncluded ? '' : 'opacity-40'}`}>
                              {isIncluded ? (
                                <CheckCircle2 className="w-6 h-6 text-amber-500" />
                              ) : (
                                <XCircle className="w-6 h-6 text-neutral-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-neutral-text">
                                  {item.name}
                                </span>
                                <span className="text-xs text-neutral-muted bg-neutral-100 px-2 py-0.5 rounded-full">
                                  ¥{item.price}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-sm text-neutral-muted">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {isIncluded && (
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-neutral-muted">自定义价格</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={customPrice ?? ''}
                                  placeholder={`${item.price}`}
                                  onChange={(e) =>
                                    updateCustomPrice(
                                      item.id,
                                      e.target.value ? Number(e.target.value) : item.price
                                    )
                                  }
                                  className="w-24 input-field text-sm py-1.5"
                                />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteServiceItem(item.id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="删除服务项"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-gradient-to-r from-amber-50 to-rose-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">套餐预估总价</p>
              <p className="text-4xl font-bold text-amber-600">
                ¥{totalPrice.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-muted mt-1">
                基础价格 ¥{formData.basePrice.toLocaleString()} + 已选 {formData.serviceItems.filter((s) => s.included).length} 项服务
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link to="/packages" className="btn-secondary">
            取消
          </Link>
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? '保存修改' : '创建套餐'}
          </button>
        </div>
      </form>
    </div>
  );
}
