import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Archive,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  XCircle,
  Download
} from 'lucide-react';
import { useAppStore } from '@/store';
import { ContractTypeLabel, ContractStatusLabel, type Contract, type ContractStatus, type ContractType } from '@/shared/types';
import PageHeader from '@/components/PageHeader';
import { cn } from '@/lib/utils';

const statusIcons: Record<ContractStatus, typeof Circle> = {
  draft: Circle,
  pending: Clock,
  signed: CheckCircle2,
  archived: Archive,
  cancelled: XCircle
};

const statusColors: Record<ContractStatus, string> = {
  draft: 'bg-neutral-100 text-neutral-text border-neutral-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  signed: 'bg-green-50 text-green-700 border-green-200',
  archived: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200'
};

export default function ContractList() {
  const navigate = useNavigate();
  const { contracts, owners, pets, deleteContract } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ContractStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<ContractType | 'all'>('all');

  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const owner = owners.find((o) => o.id === c.ownerId);
      const pet = pets.find((p) => p.id === c.petId);
      const searchStr = `${c.contractNo} ${c.title} ${owner?.name || ''} ${pet?.name || ''}`.toLowerCase();
      const matchesSearch = searchTerm === '' || searchStr.includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      const matchesType = filterType === 'all' || c.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [contracts, owners, pets, searchTerm, filterStatus, filterType]);

  const stats = useMemo(() => ({
    total: contracts.length,
    draft: contracts.filter((c) => c.status === 'draft').length,
    pending: contracts.filter((c) => c.status === 'pending').length,
    signed: contracts.filter((c) => c.status === 'signed').length,
    archived: contracts.filter((c) => c.status === 'archived').length
  }), [contracts]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const handleDelete = (contract: Contract) => {
    if (confirm(`确定要删除合同「${contract.title}」吗？此操作不可恢复。`)) {
      deleteContract(contract.id);
    }
  };

  const handleDownload = (contract: Contract) => {
    const content = `合同编号：${contract.contractNo}\n合同标题：${contract.title}\n合同类型：${ContractTypeLabel[contract.type]}\n合同状态：${ContractStatusLabel[contract.status]}\n总金额：¥${contract.totalAmount}\n创建时间：${formatDate(contract.createdAt)}\n\n（合同内容预览，完整内容请查看合同详情）`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contract.contractNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="电子合同管理"
        description="管理宠物殡葬服务合同，支持在线签署与自动归档"
        icon={FileText}
        actions={
          <button
            onClick={() => navigate('/contracts/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-800 text-white rounded-xl hover:bg-primary-900 transition-colors shadow-md font-medium"
          >
            <Plus className="w-5 h-5" />
            新建合同
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: '合同总数', value: stats.total, icon: FileText, color: 'from-primary-500 to-primary-700' },
          { label: '草稿', value: stats.draft, icon: Circle, color: 'from-neutral-400 to-neutral-600' },
          { label: '待签署', value: stats.pending, icon: Clock, color: 'from-amber-400 to-amber-600' },
          { label: '已签署', value: stats.signed, icon: CheckCircle2, color: 'from-green-500 to-green-700' },
          { label: '已归档', value: stats.archived, icon: Archive, color: 'from-blue-500 to-blue-700' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-card border border-primary-100 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-muted">{stat.label}</p>
                <p className="text-2xl font-bold text-primary-900 mt-2">{stat.value}</p>
              </div>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br', stat.color)}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-primary-100 overflow-hidden">
        <div className="p-5 border-b border-primary-100 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-muted" />
            <input
              type="text"
              placeholder="搜索合同编号、标题、客户或宠物..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ContractStatus | 'all')}
                className="pl-10 pr-8 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="draft">草稿</option>
                <option value="pending">待签署</option>
                <option value="signed">已签署</option>
                <option value="archived">已归档</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as ContractType | 'all')}
                className="pl-10 pr-8 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">全部类型</option>
                <option value="cremation">火化服务</option>
                <option value="ceremony">告别仪式</option>
                <option value="comprehensive">综合服务</option>
                <option value="urn-storage">骨灰存放</option>
                <option value="transport">接送服务</option>
                <option value="other">其他</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-900 whitespace-nowrap">合同信息</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-900 whitespace-nowrap">客户/宠物</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-900 whitespace-nowrap">类型</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-900 whitespace-nowrap">金额</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-900 whitespace-nowrap">状态</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-900 whitespace-nowrap">创建时间</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-primary-900 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-50">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="w-12 h-12 text-neutral-muted" />
                      <p className="text-neutral-muted">暂无符合条件的合同</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => {
                  const owner = owners.find((o) => o.id === contract.ownerId);
                  const pet = pets.find((p) => p.id === contract.petId);
                  const StatusIcon = statusIcons[contract.status];
                  return (
                    <tr key={contract.id} className="hover:bg-primary-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary-700" />
                          </div>
                          <div>
                            <p className="font-semibold text-primary-900">{contract.title}</p>
                            <p className="text-xs text-neutral-muted mt-0.5">{contract.contractNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-neutral-text">{owner?.name || '-'}</p>
                          <p className="text-xs text-neutral-muted mt-0.5">
                            <span className="inline-flex items-center gap-1">
                              宠物：{pet?.name || '-'}
                            </span>
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-medium border border-primary-100">
                          {ContractTypeLabel[contract.type]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-primary-900">¥{contract.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border',
                          statusColors[contract.status]
                        )}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {ContractStatusLabel[contract.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-muted whitespace-nowrap">
                        {formatDate(contract.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/contracts/${contract.id}`)}
                            className="p-2 rounded-lg hover:bg-primary-100 text-primary-700 transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {contract.status === 'draft' && (
                            <button
                              onClick={() => navigate(`/contracts/${contract.id}/edit`)}
                              className="p-2 rounded-lg hover:bg-primary-100 text-primary-700 transition-colors"
                              title="编辑"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDownload(contract)}
                            className="p-2 rounded-lg hover:bg-primary-100 text-primary-700 transition-colors"
                            title="下载"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {contract.status === 'draft' && (
                            <button
                              onClick={() => handleDelete(contract)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-primary-100 bg-primary-50/30 text-sm text-neutral-muted">
          共 {filteredContracts.length} 条合同记录
        </div>
      </div>
    </div>
  );
}
