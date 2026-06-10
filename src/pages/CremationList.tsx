import { useState } from 'react';
import { Flame, Calendar, User, Clock, Check, ArrowRight, Plus, Edit, Trash2, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import type { Cremation } from '@/shared/types';
import { cn } from '@/lib/utils';

const statusMap: Record<Cremation['status'], { label: string; className: string }> = {
  pending: { label: '待开始', className: 'bg-blue-100 text-blue-700' },
  'in-progress': { label: '进行中', className: 'bg-amber-100 text-amber-700' },
  completed: { label: '已完成', className: 'bg-green-100 text-green-700' }
};

const nextStatusMap: Record<Cremation['status'], Cremation['status'] | null> = {
  pending: 'in-progress',
  'in-progress': 'completed',
  completed: null
};

const furnaceList = [
  { id: 'F-001', name: '1号火化炉' },
  { id: 'F-002', name: '2号火化炉' },
  { id: 'F-003', name: '3号火化炉' }
];

export default function CremationList() {
  const cremations = useAppStore(state => state.cremations);
  const pets = useAppStore(state => state.pets);
  const addCremation = useAppStore(state => state.addCremation);
  const updateCremation = useAppStore(state => state.updateCremation);
  const deleteCremation = useAppStore(state => state.deleteCremation);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    petId: '',
    cremationTime: '',
    furnaceId: 'F-001',
    status: 'pending' as Cremation['status'],
    operator: ''
  });

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet?.name || '未知';
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFurnaceName = (furnaceId: string) => {
    const furnace = furnaceList.find(f => f.id === furnaceId);
    return furnace ? `${furnace.name}（${furnace.id}）` : '待分配';
  };

  const handleStatusChange = (id: string) => {
    const cremation = cremations.find(c => c.id === id);
    if (cremation) {
      const nextStatus = nextStatusMap[cremation.status];
      if (nextStatus) {
        updateCremation(id, { status: nextStatus });
      }
    }
  };

  const getStatusButtonLabel = (status: Cremation['status']) => {
    switch (status) {
      case 'pending':
        return '开始火化';
      case 'in-progress':
        return '标记完成';
      default:
        return null;
    }
  };

  const getFurnaceSchedule = (furnaceId: string) => {
    return cremations.filter(c => c.furnaceId === furnaceId);
  };

  const getUnassignedSchedule = () => {
    return cremations.filter(c => !furnaceList.some(f => f.id === c.furnaceId));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      petId: '',
      cremationTime: '',
      furnaceId: 'F-001',
      status: 'pending',
      operator: ''
    });
    setShowModal(true);
  };

  const openEditModal = (cremation: Cremation) => {
    setEditingId(cremation.id);
    setFormData({
      petId: cremation.petId,
      cremationTime: cremation.cremationTime.slice(0, 16),
      furnaceId: cremation.furnaceId,
      status: cremation.status,
      operator: cremation.operator || ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.petId || !formData.cremationTime) {
      alert('请填写完整填写必填项');
      return;
    }
    const data = {
      petId: formData.petId,
      cremationTime: formData.cremationTime + ':00',
      furnaceId: formData.furnaceId,
      status: formData.status,
      operator: formData.operator
    };
    if (editingId) {
      updateCremation(editingId, data);
    } else {
      addCremation(data);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条火化记录吗？')) {
      deleteCremation(id);
    }
  };

  return (
    <div>
      <PageHeader
        title="火化时间管理"
        description="火化炉排期与状态跟踪"
        actions={
          <button className="btn-primary" onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-2" />
            新增火化
          </button>
        }
      />

      <div className="mb-8">
        <h2 className="font-serif text-xl font-semibold text-primary-800 mb-4">
          <Flame className="w-5 h-5 inline mr-2 text-accent" />
          火化炉排期视图
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 待分配区域 */}
          <div className="card border-dashed border-2 border-amber-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-primary-800">待分配</h3>
              <div className={cn(
                'w-3 h-3 rounded-full',
                getUnassignedSchedule().length > 0
                  ? 'bg-orange-500 animate-pulse'
                  : 'bg-gray-300'
              )} />
            </div>
            <div className="space-y-3">
              {getUnassignedSchedule().length === 0 ? (
                <p className="text-sm text-neutral-muted text-center py-4">全部已分配</p>
              ) : (
                getUnassignedSchedule().map(item => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-dashed border-orange-200 bg-orange-50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-primary-800">
                        {getPetName(item.petId)}
                      </span>
                      <span className={cn('status-badge text-xs', statusMap[item.status].className)}>
                        {statusMap[item.status].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-muted">
                      <Clock className="w-3 h-3" />
                      {formatTime(item.cremationTime)}
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="w-full text-xs py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors font-medium"
                      >
                        分配火化炉
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 火化炉列表 */}
          {furnaceList.map(furnace => {
            const schedule = getFurnaceSchedule(furnace.id);
            const inProgress = schedule.find(s => s.status === 'in-progress');
            const pendingCount = schedule.filter(s => s.status === 'pending').length;
            const completedCount = schedule.filter(s => s.status === 'completed').length;

            let statusColor = 'bg-green-500';
            let statusText = '空闲';
            if (inProgress) {
              statusColor = 'bg-amber-500 animate-pulse';
              statusText = '火化中';
            } else if (pendingCount > 0) {
              statusColor = 'bg-blue-500';
              statusText = `${pendingCount}个待开始`;
            } else if (completedCount > 0 && pendingCount === 0 && !inProgress) {
              statusColor = 'bg-green-500';
              statusText = '全部完成';
            }

            return (
              <div key={furnace.id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-primary-800">{furnace.name}</h3>
                    <span className="text-xs text-neutral-muted">{statusText}</span>
                  </div>
                  <div className={cn('w-3 h-3 rounded-full', statusColor)} />
                </div>
                <div className="space-y-3">
                  {schedule.length === 0 ? (
                    <p className="text-sm text-neutral-muted text-center py-4">暂无排期</p>
                  ) : (
                    schedule.map(item => (
                      <div
                        key={item.id}
                        className={cn(
                          'p-3 rounded-lg border transition-all',
                          item.status === 'in-progress'
                            ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-200'
                            : item.status === 'completed'
                              ? 'bg-green-50 border-green-200'
                              : 'bg-blue-50 border-blue-200'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-primary-800">
                            {getPetName(item.petId)}
                          </span>
                          <span className={cn('status-badge text-xs', statusMap[item.status].className)}>
                            {statusMap[item.status].label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-neutral-muted">
                          <Clock className="w-3 h-3" />
                          {formatTime(item.cremationTime)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold text-primary-800 mb-4">
          <Calendar className="w-5 h-5 inline mr-2 text-accent" />
          火化记录列表
        </h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-100">
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    时间
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    宠物名
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    火化炉编号
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    状态
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    操作员
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-neutral-muted">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {cremations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 mb-3">
                        <Flame className="w-7 h-7 text-primary-400" />
                      </div>
                      <p className="text-neutral-muted">暂无火化记录</p>
                    </td>
                  </tr>
                ) : (
                  cremations.map(cremation => (
                    <tr
                      key={cremation.id}
                      className="border-b border-primary-50 hover:bg-primary-50/30 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-400" />
                          <span className="text-sm text-neutral-text">
                            {formatDateTime(cremation.cremationTime)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-primary-800">
                            {getPetName(cremation.petId)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          'text-sm',
                          furnaceList.some(f => f.id === cremation.furnaceId)
                            ? 'text-neutral-text'
                            : 'text-orange-600 font-medium'
                        )}>
                          {getFurnaceName(cremation.furnaceId)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('status-badge', statusMap[cremation.status].className)}>
                          {statusMap[cremation.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary-400" />
                          <span className="text-sm text-neutral-text">{cremation.operator || '待分配'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {getStatusButtonLabel(cremation.status) && (
                            <button
                              className={cn(
                                'inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                                cremation.status === 'pending'
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              )}
                              onClick={() => handleStatusChange(cremation.id)}
                            >
                              {cremation.status === 'pending' ? (
                                <Flame className="w-3.5 h-3.5 mr-1.5" />
                              ) : (
                                <Check className="w-3.5 h-3.5 mr-1.5" />
                              )}
                              {getStatusButtonLabel(cremation.status)}
                              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </button>
                          )}
                          <button
                            className="p-2 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors"
                            onClick={() => openEditModal(cremation)}
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            onClick={() => handleDelete(cremation.id)}
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-semibold text-primary-800">
                {editingId ? '编辑火化记录' : '新增火化记录'}
              </h3>
              <button
                className="p-2 rounded-lg text-neutral-muted hover:bg-primary-100 transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-text">选择宠物 *</label>
                <select
                  className="input-field"
                  value={formData.petId}
                  onChange={(e) => setFormData(prev => ({ ...prev, petId: e.target.value }))}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">火化时间 *</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={formData.cremationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, cremationTime: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="label-text">火化炉</label>
                  <select
                    className="input-field"
                    value={formData.furnaceId}
                    onChange={(e) => setFormData(prev => ({ ...prev, furnaceId: e.target.value }))}
                  >
                    {furnaceList.map(furnace => (
                      <option key={furnace.id} value={furnace.id}>
                        {furnace.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">状态</label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Cremation['status'] }))}
                  >
                    {Object.entries(statusMap).map(([value, info]) => (
                      <option key={value} value={value}>
                        {info.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-text">操作员</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="操作员姓名"
                    value={formData.operator}
                    onChange={(e) => setFormData(prev => ({ ...prev, operator: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  {editingId ? '保存修改' : '添加记录'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
