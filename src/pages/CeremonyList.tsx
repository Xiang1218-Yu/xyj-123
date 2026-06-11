import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake, Calendar, MapPin, Users, Edit, Trash2, Plus, Eye, LayoutTemplate } from 'lucide-react';
import { CeremonyTemplateTypeLabel } from '@/shared/types';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import type { Ceremony } from '@/shared/types';
import { cn } from '@/lib/utils';

type CeremonyStatus = Ceremony['status'] | 'all';

const statusMap: Record<Ceremony['status'], { label: string; className: string }> = {
  pending: { label: '待开始', className: 'bg-blue-100 text-blue-700' },
  'in-progress': { label: '进行中', className: 'bg-amber-100 text-amber-700' },
  completed: { label: '已完成', className: 'bg-green-100 text-green-700' },
  cancelled: { label: '已取消', className: 'bg-gray-100 text-gray-600' }
};

const tabs: { key: CeremonyStatus; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待开始' },
  { key: 'in-progress', label: '进行中' },
  { key: 'completed', label: '已完成' }
];

export default function CeremonyList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CeremonyStatus>('all');
  const ceremonies = useAppStore(state => state.ceremonies);
  const pets = useAppStore(state => state.pets);
  const deleteCeremony = useAppStore(state => state.deleteCeremony);

  const filteredCeremonies = activeTab === 'all'
    ? ceremonies
    : ceremonies.filter(c => c.status === activeTab);

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

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条仪式记录吗？')) {
      deleteCeremony(id);
    }
  };

  return (
    <div>
      <PageHeader
        title="告别仪式安排"
        description="管理所有告别仪式的时间和安排"
        actions={
          <button
            className="btn-primary"
            onClick={() => navigate('/ceremonies/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            新增仪式
          </button>
        }
      />

      <div className="mb-6">
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-5 py-2 rounded-lg font-medium transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-primary-800 text-white'
                  : 'bg-white text-neutral-text hover:bg-primary-50 border border-primary-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-100">
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                      仪式时间
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                      宠物名称
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                      仪式类型
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                      地点
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                      状态
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                      参与人员
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-neutral-muted">
                      操作
                    </th>
                  </tr>
              </thead>
              <tbody>
                {filteredCeremonies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 mb-3">
                        <HeartHandshake className="w-7 h-7 text-primary-400" />
                      </div>
                      <p className="text-neutral-muted">暂无仪式记录</p>
                    </td>
                  </tr>
                ) : (
                  filteredCeremonies.map(ceremony => (
                    <tr
                      key={ceremony.id}
                      className="border-b border-primary-50 hover:bg-primary-50/30 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-400" />
                          <span className="text-sm text-neutral-text">
                            {formatDateTime(ceremony.ceremonyTime)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          className="text-sm font-medium text-primary-800 hover:text-primary-600 transition-colors"
                          onClick={() => navigate(`/pets/${ceremony.petId}`)}
                        >
                          <HeartHandshake className="w-4 h-4 inline mr-1 text-accent" />
                          {getPetName(ceremony.petId)}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <LayoutTemplate className="w-4 h-4 text-primary-400" />
                          <span className="text-sm text-neutral-text">
                            {ceremony.templateType
                              ? CeremonyTemplateTypeLabel[ceremony.templateType]
                              : '自定义'
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary-400" />
                          <span className="text-sm text-neutral-text">{ceremony.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('status-badge', statusMap[ceremony.status].className)}>
                          {statusMap[ceremony.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary-400" />
                          <span className="text-sm text-neutral-text">{ceremony.participants}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors"
                            onClick={() => navigate(`/pets/${ceremony.petId}`)}
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors"
                            onClick={() => navigate(`/ceremonies/${ceremony.id}/edit`)}
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            onClick={() => handleDelete(ceremony.id)}
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
    </div>
  );
}
