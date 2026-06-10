import { useState } from 'react';
import { Flame, Calendar, User, Clock, Check, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { mockCremations, mockPets } from '@/data/mockData';
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
  const [cremations, setCremations] = useState<Cremation[]>(mockCremations);

  const getPetName = (petId: string) => {
    const pet = mockPets.find(p => p.id === petId);
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

  const handleStatusChange = (id: string) => {
    setCremations(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextStatus = nextStatusMap[c.status];
          if (nextStatus) {
            return { ...c, status: nextStatus };
          }
        }
        return c;
      })
    );
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

  return (
    <div>
      <PageHeader
        title="火化时间管理"
        description="火化炉排期与状态跟踪"
      />

      <div className="mb-8">
        <h2 className="font-serif text-xl font-semibold text-primary-800 mb-4">
          <Flame className="w-5 h-5 inline mr-2 text-accent" />
          火化炉排期视图
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {furnaceList.map(furnace => {
            const schedule = getFurnaceSchedule(furnace.id);
            return (
              <div key={furnace.id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-primary-800">{furnace.name}</h3>
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    schedule.some(s => s.status === 'in-progress')
                      ? 'bg-amber-500 animate-pulse'
                      : schedule.some(s => s.status === 'pending')
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                  )} />
                </div>
                <div className="space-y-3">
                  {schedule.length === 0 ? (
                    <p className="text-sm text-neutral-muted text-center py-4">暂无排期</p>
                  ) : (
                    schedule.map(item => (
                      <div
                        key={item.id}
                        className={cn(
                          'p-3 rounded-lg border',
                          item.status === 'in-progress'
                            ? 'bg-amber-50 border-amber-200'
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
                {cremations.map(cremation => (
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
                      <span className="text-sm text-neutral-text">{cremation.furnaceId}</span>
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
                      <div className="flex items-center justify-end">
                        {getStatusButtonLabel(cremation.status) && (
                          <button
                            className={cn(
                              'inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
