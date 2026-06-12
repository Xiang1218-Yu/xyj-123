import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Edit, Trash2, Plus, Eye, LayoutTemplate, HeartHandshake } from 'lucide-react';
import { CeremonyTemplateTypeLabel } from '@/shared/types';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import type { Ceremony } from '@/shared/types';
import { StatusBadge, DataTable, Tabs, ActionButtons, ConfirmDialog } from '@/components/ui';
import type { DataTableColumn } from '@/components/ui/DataTable';

type CeremonyStatus = Ceremony['status'] | 'all';

const statusVariantMap: Record<Ceremony['status'], 'info' | 'warning' | 'success' | 'neutral'> = {
  pending: 'info',
  'in-progress': 'warning',
  completed: 'success',
  cancelled: 'neutral',
};

const statusLabelMap: Record<Ceremony['status'], string> = {
  pending: '待开始',
  'in-progress': '进行中',
  completed: '已完成',
  cancelled: '已取消',
};

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待开始' },
  { key: 'in-progress', label: '进行中' },
  { key: 'completed', label: '已完成' },
] as const;

export default function CeremonyList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CeremonyStatus>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const ceremonies = useAppStore(state => state.ceremonies);
  const pets = useAppStore(state => state.pets);
  const deleteCeremony = useAppStore(state => state.deleteCeremony);

  const filteredCeremonies = useMemo(() => {
    return activeTab === 'all'
      ? ceremonies
      : ceremonies.filter(c => c.status === activeTab);
  }, [ceremonies, activeTab]);

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
    deleteCeremony(id);
    setDeleteConfirmId(null);
  };

  const columns: DataTableColumn<Ceremony>[] = [
    {
      key: 'ceremonyTime',
      title: '仪式时间',
      render: (record) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-neutral-text">
            {formatDateTime(record.ceremonyTime)}
          </span>
        </div>
      ),
    },
    {
      key: 'petName',
      title: '宠物名称',
      render: (record) => (
        <button
          className="text-sm font-medium text-primary-800 hover:text-primary-600 transition-colors"
          onClick={() => navigate(`/pets/${record.petId}`)}
        >
          <HeartHandshake className="w-4 h-4 inline mr-1 text-accent" />
          {getPetName(record.petId)}
        </button>
      ),
    },
    {
      key: 'templateType',
      title: '仪式类型',
      render: (record) => (
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-neutral-text">
            {record.templateType
              ? CeremonyTemplateTypeLabel[record.templateType]
              : '自定义'
            }
          </span>
        </div>
      ),
    },
    {
      key: 'location',
      title: '地点',
      render: (record) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-neutral-text">{record.location}</span>
        </div>
      ),
    },
    {
      key: 'status',
      title: '状态',
      render: (record) => (
        <StatusBadge variant={statusVariantMap[record.status]}>
          {statusLabelMap[record.status]}
        </StatusBadge>
      ),
    },
    {
      key: 'participants',
      title: '参与人员',
      render: (record) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-neutral-text">{record.participants}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      title: '操作',
      align: 'right',
      render: (record) => (
        <ActionButtons
          actions={[
            {
              key: 'view',
              icon: Eye,
              title: '查看详情',
              onClick: () => navigate(`/pets/${record.petId}`),
            },
            {
              key: 'edit',
              icon: Edit,
              title: '编辑',
              onClick: () => navigate(`/ceremonies/${record.id}/edit`),
            },
            {
              key: 'delete',
              icon: Trash2,
              title: '删除',
              variant: 'danger',
              onClick: () => setDeleteConfirmId(record.id),
            },
          ]}
        />
      ),
    },
  ];

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
        <div className="mb-6">
          <Tabs
            items={tabs as unknown as { key: string; label: React.ReactNode }[]}
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as CeremonyStatus)}
            variant="default"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredCeremonies}
          rowKey="id"
          emptyText="暂无仪式记录"
          emptyIcon={HeartHandshake}
          footer={`共 ${filteredCeremonies.length} 条记录`}
        />
      </div>

      <ConfirmDialog
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        title="确认删除"
        description="确定要删除这条仪式记录吗？此操作不可撤销。"
        type="danger"
        confirmText="确认删除"
      />
    </div>
  );
}
