import { Link } from 'react-router-dom';
import { CalendarCheck, ExternalLink, PawPrint, User, Phone, Clock, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';

export default function Appointments() {
  const { ceremonies, pets, owners } = useAppStore();

  const getPetById = (id: string) => pets.find(p => p.id === id);
  const getOwnerById = (id: string) => owners.find(o => o.id === id);

  const sortedCeremonies = [...ceremonies].sort(
    (a, b) => new Date(a.ceremonyTime).getTime() - new Date(b.ceremonyTime).getTime()
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge bg-blue-100 text-blue-700">待开始</span>;
      case 'in-progress':
        return <span className="status-badge bg-amber-100 text-amber-700">进行中</span>;
      case 'completed':
        return <span className="status-badge bg-green-100 text-green-700">已完成</span>;
      case 'cancelled':
        return <span className="status-badge bg-gray-100 text-gray-600">已取消</span>;
      default:
        return null;
    }
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="主人预约"
        description="查看和管理所有主人的预约申请"
        actions={
          <a
            href="/booking"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            打开预约页面
          </a>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">总预约数</p>
              <p className="text-3xl font-bold text-primary-800 font-serif">{ceremonies.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">待开始</p>
              <p className="text-3xl font-bold text-blue-600 font-serif">
                {ceremonies.filter(c => c.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">进行中</p>
              <p className="text-3xl font-bold text-amber-600 font-serif">
                {ceremonies.filter(c => c.status === 'in-progress').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">已完成</p>
              <p className="text-3xl font-bold text-green-600 font-serif">
                {ceremonies.filter(c => c.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-primary-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">宠物信息</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">主人信息</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">预约时间</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">地点</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">状态</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {sortedCeremonies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
                      <CalendarCheck className="w-8 h-8 text-primary-400" />
                    </div>
                    <p className="text-neutral-muted text-lg mb-2">暂无预约记录</p>
                    <p className="text-sm text-primary-400">主人可通过 /booking 页面提交预约申请</p>
                  </td>
                </tr>
              ) : (
                sortedCeremonies.map((ceremony) => {
                  const pet = getPetById(ceremony.petId);
                  const owner = pet ? getOwnerById(pet.ownerId) : undefined;
                  return (
                    <tr key={ceremony.id} className="hover:bg-primary-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {pet?.photoUrl ? (
                            <img
                              src={pet.photoUrl}
                              alt={pet.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-primary-100"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <PawPrint className="w-5 h-5 text-primary-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-neutral-text">{pet?.name || '未知宠物'}</p>
                            <p className="text-sm text-neutral-muted">{pet?.breed || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-3.5 h-3.5 text-primary-500" />
                            <span className="text-neutral-text">{owner?.name || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3.5 h-3.5 text-primary-500" />
                            <span className="text-neutral-muted">{owner?.phone || '-'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-neutral-text">{formatDateTime(ceremony.ceremonyTime)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-neutral-text">{ceremony.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(ceremony.status)}
                      </td>
                      <td className="px-6 py-4">
                        {pet && (
                          <Link
                            to={`/pets/${pet.id}`}
                            className="inline-flex items-center text-sm text-primary-700 hover:text-primary-900 font-medium"
                          >
                            查看详情
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
