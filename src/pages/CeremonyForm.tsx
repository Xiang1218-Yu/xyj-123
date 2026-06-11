import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  HeartHandshake, Calendar, MapPin, Users, FileText, ArrowLeft, Check,
  LayoutTemplate, Clock, List, Plus, Trash2, ChevronDown, ChevronUp,
  Package, Sparkles
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import type { Ceremony, CeremonyFlowStep, CeremonyItem, CeremonyTemplate } from '@/shared/types';
import { CeremonyTemplateTypeLabel } from '@/shared/types';
import { cn } from '@/lib/utils';

const statusOptions: { value: Ceremony['status']; label: string }[] = [
  { value: 'pending', label: '待开始' },
  { value: 'in-progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
];

const itemCategoryLabels: Record<string, string> = {
  decoration: '装饰布置',
  supplies: '用品耗材',
  ritual: '仪式用品',
  other: '其他物品'
};

export default function CeremonyForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const pets = useAppStore(state => state.pets);
  const addCeremony = useAppStore(state => state.addCeremony);
  const updateCeremony = useAppStore(state => state.updateCeremony);
  const getCeremonyById = useAppStore(state => state.getCeremonyById);
  const getActiveCeremonyTemplates = useAppStore(state => state.getActiveCeremonyTemplates);
  const generateFlowStepsFromTemplate = useAppStore(state => state.generateFlowStepsFromTemplate);
  const generateItemsFromTemplate = useAppStore(state => state.generateItemsFromTemplate);
  const getCeremonyTemplateById = useAppStore(state => state.getCeremonyTemplateById);

  const templates = getActiveCeremonyTemplates();

  const [formData, setFormData] = useState<{
    petId: string;
    ceremonyTime: string;
    location: string;
    participants: string;
    status: Ceremony['status'];
    notes: string;
    templateId: string;
  }>({
    petId: '',
    ceremonyTime: '',
    location: '',
    participants: '',
    status: 'pending',
    notes: '',
    templateId: ''
  });

  const [flowSteps, setFlowSteps] = useState<CeremonyFlowStep[]>([]);
  const [items, setItems] = useState<CeremonyItem[]>([]);
  const [showFlowSteps, setShowFlowSteps] = useState(true);
  const [showItems, setShowItems] = useState(true);
  const [selectedTemplatePreview, setSelectedTemplatePreview] = useState<CeremonyTemplate | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      const ceremony = getCeremonyById(id);
      if (ceremony) {
        setFormData({
          petId: ceremony.petId,
          ceremonyTime: ceremony.ceremonyTime.slice(0, 16),
          location: ceremony.location,
          participants: ceremony.participants,
          status: ceremony.status,
          notes: ceremony.notes || '',
          templateId: ceremony.templateId || ''
        });
        setFlowSteps(ceremony.flowSteps || []);
        setItems(ceremony.items || []);
        if (ceremony.templateId) {
          const tpl = getCeremonyTemplateById(ceremony.templateId);
          if (tpl) setSelectedTemplatePreview(tpl);
        }
      }
    }
  }, [id, isEdit, getCeremonyById, getCeremonyTemplateById]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateChange = (templateId: string) => {
    handleChange('templateId', templateId);
    if (templateId) {
      const steps = generateFlowStepsFromTemplate(templateId);
      const generatedItems = generateItemsFromTemplate(templateId);
      setFlowSteps(steps);
      setItems(generatedItems);
      const tpl = getCeremonyTemplateById(templateId);
      setSelectedTemplatePreview(tpl || null);
    } else {
      setFlowSteps([]);
      setItems([]);
      setSelectedTemplatePreview(null);
    }
  };

  const addFlowStep = () => {
    const newStep: CeremonyFlowStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: '',
      description: '',
      duration: 10,
      sortOrder: flowSteps.length
    };
    setFlowSteps([...flowSteps, newStep]);
  };

  const updateFlowStep = (stepId: string, field: keyof CeremonyFlowStep, value: string | number) => {
    setFlowSteps(flowSteps.map(step =>
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };

  const removeFlowStep = (stepId: string) => {
    setFlowSteps(flowSteps.filter(step => step.id !== stepId)
      .map((step, index) => ({ ...step, sortOrder: index })));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...flowSteps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;

    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    newSteps.forEach((step, i) => step.sortOrder = i);
    setFlowSteps(newSteps);
  };

  const addItem = () => {
    const newItem: CeremonyItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      quantity: 1,
      unit: '',
      category: 'other',
      note: ''
    };
    setItems([...items, newItem]);
  };

  const updateItem = (itemId: string, field: keyof CeremonyItem, value: string | number) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const getGroupedItems = () => {
    const groups: Record<string, CeremonyItem[]> = {};
    items.forEach(item => {
      const cat = item.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.petId || !formData.ceremonyTime || !formData.location || !formData.participants) {
      alert('请填写完整填写所有必填项');
      return;
    }

    const templateType = selectedTemplatePreview?.type;

    const ceremonyData = {
      petId: formData.petId,
      ceremonyTime: formData.ceremonyTime + ':00',
      location: formData.location,
      participants: formData.participants,
      status: formData.status,
      notes: formData.notes,
      templateId: formData.templateId || undefined,
      templateType: templateType || undefined,
      flowSteps: flowSteps.length > 0 ? flowSteps : undefined,
      items: items.length > 0 ? items : undefined
    };

    if (isEdit && id) {
      updateCeremony(id, ceremonyData);
    } else {
      addCeremony(ceremonyData);
    }
    navigate('/ceremonies');
  };

  const totalDuration = flowSteps.reduce((sum, step) => sum + (step.duration || 0), 0);

  return (
    <div>
      <PageHeader
        title={isEdit ? '编辑告别仪式' : '新增告别仪式'}
        description={isEdit ? '修改仪式的时间和安排信息' : '为宠物安排一场庄重的告别仪式'}
        actions={
          <button
            className="btn-secondary"
            onClick={() => navigate('/ceremonies')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card max-w-4xl">
          <h3 className="text-lg font-semibold text-neutral-text mb-4 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-accent" />
            基本信息
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-text">
                选择宠物 *
              </label>
              <select
                className="input-field"
                value={formData.petId}
                onChange={(e) => handleChange('petId', e.target.value)}
                required
              >
                <option value="">请选择宠物</option>
                {pets.map(pet => (
                  <option key={pet.id} value={pet.id}>
                  {pet.name}（{pet.breed}）
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">
                <Calendar className="w-4 h-4 inline mr-1 text-accent" />
                仪式时间 *
              </label>
              <input
                type="datetime-local"
                className="input-field"
                value={formData.ceremonyTime}
                onChange={(e) => handleChange('ceremonyTime', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label-text">
                <MapPin className="w-4 h-4 inline mr-1 text-accent" />
                地点 *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="如：追思堂A厅"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label-text">
                <Users className="w-4 h-4 inline mr-1 text-accent" />
                参与人员 *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="如：主人及家人共5人"
                value={formData.participants}
                onChange={(e) => handleChange('participants', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label-text">
                <Check className="w-4 h-4 inline mr-1 text-accent" />
                状态
              </label>
              <select
                className="input-field"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as Ceremony['status'])}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card max-w-4xl">
          <h3 className="text-lg font-semibold text-neutral-text mb-4 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-accent" />
            选择仪式模板
          </h3>
          <p className="text-sm text-neutral-muted mb-4">
            选择一个预设模板，系统将自动生成仪式流程和所需物品清单，您也可以在此基础上进行修改。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div
              className={cn(
                'relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200',
                formData.templateId === ''
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              )}
              onClick={() => handleTemplateChange('')}
            >
              <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="font-medium text-neutral-text mb-1">自定义仪式</h4>
              <p className="text-xs text-neutral-muted">
                不使用模板，完全自定义仪式流程和物品
              </p>
              {formData.templateId === '' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {templates.map(template => (
              <div
                key={template.id}
                className={cn(
                  'relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200',
                  formData.templateId === template.id
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                )}
                onClick={() => handleTemplateChange(template.id)}
              >
                <div
                  className="h-24 rounded-lg mb-3 bg-cover bg-center"
                  style={{ backgroundImage: `url(${template.coverImage})` }}
                />
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-neutral-text">{template.name}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                    {CeremonyTemplateTypeLabel[template.type]}
                  </span>
                </div>
                <p className="text-xs text-neutral-muted line-clamp-2">
                  {template.description}
                </p>
                {template.estimatedDuration && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-neutral-muted">
                    <Clock className="w-3 h-3" />
                    <span>约 {template.estimatedDuration} 分钟</span>
                  </div>
                )}
                {formData.templateId === template.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card max-w-4xl">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowFlowSteps(!showFlowSteps)}
          >
            <h3 className="text-lg font-semibold text-neutral-text flex items-center gap-2">
              <List className="w-5 h-5 text-accent" />
              仪式流程
              {flowSteps.length > 0 && (
                <span className="text-sm font-normal text-neutral-muted">
                  ({flowSteps.length} 个步骤，约 {totalDuration} 分钟)
                </span>
              )}
            </h3>
            {showFlowSteps ? <ChevronUp className="w-5 h-5 text-neutral-muted" /> : <ChevronDown className="w-5 h-5 text-neutral-muted" />}
          </div>

          {showFlowSteps && (
            <div className="mt-4 space-y-3">
              {flowSteps.length === 0 ? (
                <div className="text-center py-8 text-neutral-muted">
                  <List className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>暂无流程步骤</p>
                  <p className="text-sm mt-1">选择模板自动生成，或手动添加</p>
                </div>
              ) : (
                flowSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex gap-3 items-start p-3 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        className="input-field !py-1.5 text-sm"
                        placeholder="步骤名称"
                        value={step.title}
                        onChange={(e) => updateFlowStep(step.id, 'title', e.target.value)}
                      />
                      <textarea
                        className="input-field !py-1.5 text-sm min-h-[60px] resize-y"
                        placeholder="步骤描述..."
                        value={step.description}
                        onChange={(e) => updateFlowStep(step.id, 'description', e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-muted" />
                        <input
                          type="number"
                          className="input-field !w-20 !py-1 text-sm"
                          min="0"
                          value={step.duration || ''}
                          onChange={(e) => updateFlowStep(step.id, 'duration', parseInt(e.target.value) || 0)}
                        />
                        <span className="text-sm text-neutral-muted">分钟</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-gray-200 text-neutral-muted hover:text-neutral-text transition-colors"
                        onClick={() => moveStep(index, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-gray-200 text-neutral-muted hover:text-neutral-text transition-colors"
                        onClick={() => moveStep(index, 'down')}
                        disabled={index === flowSteps.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-red-100 text-neutral-muted hover:text-red-500 transition-colors"
                        onClick={() => removeFlowStep(step.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              <button
                type="button"
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                onClick={addFlowStep}
              >
                <Plus className="w-4 h-4" />
                添加流程步骤
              </button>
            </div>
          )}
        </div>

        <div className="card max-w-4xl">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowItems(!showItems)}
          >
            <h3 className="text-lg font-semibold text-neutral-text flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              所需物品清单
              {items.length > 0 && (
                <span className="text-sm font-normal text-neutral-muted">
                  ({items.length} 项物品)
                </span>
              )}
            </h3>
            {showItems ? <ChevronUp className="w-5 h-5 text-neutral-muted" /> : <ChevronDown className="w-5 h-5 text-neutral-muted" />}
          </div>

          {showItems && (
            <div className="mt-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-8 text-neutral-muted">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>暂无物品清单</p>
                  <p className="text-sm mt-1">选择模板自动生成，或手动添加</p>
                </div>
              ) : (
                Object.entries(getGroupedItems()).map(([category, categoryItems]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-neutral-muted mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                      {itemCategoryLabels[category] || '其他物品'}
                    </h4>
                    <div className="space-y-2">
                      {categoryItems.map(item => (
                        <div
                          key={item.id}
                          className="flex gap-3 items-center p-3 rounded-lg bg-gray-50 border border-gray-100"
                        >
                          <div className="flex-1">
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                className="input-field !py-1.5 text-sm flex-1"
                                placeholder="物品名称"
                                value={item.name}
                                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                              />
                              <select
                                className="input-field !py-1.5 text-sm !w-24"
                                value={item.category || 'other'}
                                onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                              >
                                {Object.entries(itemCategoryLabels).map(([value, label]) => (
                                  <option key={value} value={value}>{label}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex gap-2 items-center mt-2">
                              <input
                                type="number"
                                className="input-field !w-16 !py-1 text-sm"
                                min="1"
                                placeholder="数量"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                              />
                              <input
                                type="text"
                                className="input-field !w-16 !py-1 text-sm"
                                placeholder="单位"
                                value={item.unit || ''}
                                onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                              />
                              <input
                                type="text"
                                className="input-field !py-1 text-sm flex-1"
                                placeholder="备注（选填）"
                                value={item.note || ''}
                                onChange={(e) => updateItem(item.id, 'note', e.target.value)}
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            className="p-1.5 rounded hover:bg-red-100 text-neutral-muted hover:text-red-500 transition-colors"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              <button
                type="button"
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                onClick={addItem}
              >
                <Plus className="w-4 h-4" />
                添加物品
              </button>
            </div>
          )}
        </div>

        <div className="card max-w-4xl">
          <h3 className="text-lg font-semibold text-neutral-text mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            备注
          </h3>
          <textarea
            className="input-field min-h-[120px] resize-y"
            placeholder="请输入备注信息..."
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </div>

        <div className="max-w-4xl flex items-center gap-4 pt-2 pb-8">
          <button type="submit" className="btn-primary">
            <Check className="w-4 h-4 mr-2" />
            {isEdit ? '保存修改' : '创建仪式'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/ceremonies')}
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
