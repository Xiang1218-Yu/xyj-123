import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  ExternalLink,
  PawPrint,
  User,
  Phone,
  Clock,
  ChevronRight,
  ChevronDown,
  Flame,
  Heart,
  Sparkles,
  Mail,
  Package,
  CheckCircle2,
  XCircle,
  X,
  Image,
  DollarSign,
  Lock,
  Plus,
  Trash2,
  History,
  AlertTriangle
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import type { Ceremony, FuneralPackage, AppointmentChangeLog } from '@/shared/types';
import { AppointmentChangeActionLabel } from '@/shared/types';

export default function Appointments() {
  const {
    ceremonies,
    pets,
    owners,
    cremations,
    funeralPackages,
    serviceItems,
    calculatePackagePrice,
    timeSlotLocks,
    addTimeSlotLock,
    removeTimeSlotLock,
    getChangeLogsByCeremonyId,
    checkAppointmentConflict
  } = useAppStore();

  const [expandedCeremonyId, setExpandedCeremonyId] = useState<string | null>(null);
  const [detailPackage, setDetailPackage] = useState<FuneralPackage | null>(null);
  const [showLockPanel, setShowLockPanel] = useState(false);
  const [lockDate, setLockDate] = useState('');
  const [lockTimeSlot, setLockTimeSlot] = useState('');
  const [lockReason, setLockReason] = useState('');
  const [showChangeLog, setShowChangeLog] = useState<string | null>(null);
  const [changeLogs, setChangeLogs] = useState<AppointmentChangeLog[]>([]);

  const timeSlotOptions = [
    '09:00 - 10:30',
    '10:30 - 12:00',
    '14:00 - 15:30',
    '15:30 - 17:00',
    '17:00 - 18:30'
  ];

  const getPetById = (id: string) => pets.find(p => p.id === id);
  const getOwnerById = (id: string) => owners.find(o => o.id === id);
  const getPackageById = (id: string) => funeralPackages.find(p => p.id === id);

  const getServiceType = (ceremony: Ceremony): { label: string; icon: React.ComponentType<{ className?: string }>; color: string } => {
    if (ceremony.packageId) {
      const pkg = getPackageById(ceremony.packageId);
      if (pkg) {
        return {
          label: pkg.name,
          icon: Package,
          color: 'bg-gradient-to-r from-amber-100 to-rose-100 text-amber-800 border border-amber-200'
        };
      }
    }
    const petCremations = cremations.filter(c => c.petId === ceremony.petId);
    const hasCremationSameTime = petCremations.some(c => {
      const cTime = new Date(c.cremationTime).getTime();
      const cerTime = new Date(ceremony.ceremonyTime).getTime();
      return Math.abs(cTime - cerTime) < 60 * 60 * 1000;
    });

    if (ceremony.location.includes('全套')) {
      return { label: '全套服务', icon: Sparkles, color: 'bg-purple-100 text-purple-700' };
    }
    if (hasCremationSameTime && ceremony.location.includes('火化服务')) {
      return { label: '火化服务', icon: Flame, color: 'bg-orange-100 text-orange-700' };
    }
    if (hasCremationSameTime) {
      return { label: '全套服务', icon: Sparkles, color: 'bg-purple-100 text-purple-700' };
    }
    return { label: '告别仪式', icon: Heart, color: 'bg-rose-100 text-rose-700' };
  };

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

  const toggleExpand = (id: string) => {
    setExpandedCeremonyId(prev => prev === id ? null : id);
  };

  const handleAddLock = () => {
    if (!lockDate || !lockTimeSlot || !lockReason.trim()) return;
    const conflict = checkAppointmentConflict(lockDate, lockTimeSlot);
    if (conflict) {
      alert('该时间段已有预约，无法锁定。请先调整预约时间。');
      return;
    }
    addTimeSlotLock({
      date: lockDate,
      timeSlot: lockTimeSlot,
      reason: lockReason.trim(),
      lockedBy: '管理员'
    });
    setLockDate('');
    setLockTimeSlot('');
    setLockReason('');
  };

  const handleViewChangeLog = (ceremonyId: string) => {
    if (showChangeLog === ceremonyId) {
      setShowChangeLog(null);
      setChangeLogs([]);
    } else {
      const logs = getChangeLogsByCeremonyId(ceremonyId);
      setChangeLogs(logs);
      setShowChangeLog(ceremonyId);
    }
  };

  useEffect(() => {
    if (detailPackage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [detailPackage]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="主人预约"
        description="查看和管理所有主人的预约申请"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLockPanel(!showLockPanel)}
              className={`btn-secondary flex items-center gap-2 ${showLockPanel ? 'ring-2 ring-primary-400' : ''}`}
            >
              <Lock className="w-4 h-4" />
              时间锁定管理
            </button>
            <a
              href="/booking"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              打开预约页面
            </a>
          </div>
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

      {showLockPanel && (
        <div className="card border-2 border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold text-primary-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary-600" />
              时间锁定管理
            </h3>
            <button onClick={() => setShowLockPanel(false)} className="text-neutral-muted hover:text-neutral-text">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-neutral-muted mb-4">
            锁定特定日期的时间段，防止主人在该时段提交预约。适用于设备检修、员工培训等场景。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
            <div>
              <label className="label-text">锁定日期 *</label>
              <input
                type="date"
                className="input-field"
                value={lockDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setLockDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label-text">时间段 *</label>
              <select
                className="input-field"
                value={lockTimeSlot}
                onChange={(e) => setLockTimeSlot(e.target.value)}
              >
                <option value="">请选择</option>
                {timeSlotOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text">锁定原因 *</label>
              <input
                type="text"
                className="input-field"
                placeholder="例如：设备检修"
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddLock}
                disabled={!lockDate || !lockTimeSlot || !lockReason.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加锁定
              </button>
            </div>
          </div>

          {timeSlotLocks.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-primary-200">
              <table className="w-full">
                <thead className="bg-primary-50 border-b border-primary-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-primary-800">日期</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-primary-800">时间段</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-primary-800">原因</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-primary-800">锁定人</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-primary-800">锁定时间</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-primary-800">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100">
                  {[...timeSlotLocks].sort((a, b) => {
                    if (a.date !== b.date) return a.date.localeCompare(b.date);
                    return a.timeSlot.localeCompare(b.timeSlot);
                  }).map((lock) => (
                    <tr key={lock.id} className="hover:bg-primary-50/50">
                      <td className="px-4 py-3 text-sm text-neutral-text">{lock.date}</td>
                      <td className="px-4 py-3 text-sm text-neutral-text">{lock.timeSlot}</td>
                      <td className="px-4 py-3 text-sm text-neutral-text">{lock.reason}</td>
                      <td className="px-4 py-3 text-sm text-neutral-muted">{lock.lockedBy}</td>
                      <td className="px-4 py-3 text-sm text-neutral-muted">{formatDateTime(lock.lockedAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => removeTimeSlotLock(lock.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="解除锁定"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-primary-50 rounded-xl">
              <Lock className="w-8 h-8 mx-auto text-primary-300 mb-2" />
              <p className="text-neutral-muted text-sm">暂无时间锁定记录</p>
            </div>
          )}
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-primary-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800 w-10"></th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">宠物信息</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">主人信息</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">套餐/服务</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">预约时间</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">状态</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {sortedCeremonies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
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
                  const serviceInfo = getServiceType(ceremony);
                  const ServiceIcon = serviceInfo.icon;
                  const pkg = ceremony.packageId ? getPackageById(ceremony.packageId) : null;
                  const isExpanded = expandedCeremonyId === ceremony.id;

                  return (
                    <>
                      <tr
                        key={ceremony.id}
                        className="hover:bg-primary-50/50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          {pkg && (
                            <button
                              onClick={() => toggleExpand(ceremony.id)}
                              className="p-1.5 rounded-lg text-neutral-muted hover:text-neutral-text hover:bg-primary-100 transition-colors"
                              title="展开/收起套餐详情"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                          )}
                        </td>
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
                            {owner?.email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3.5 h-3.5 text-primary-500" />
                                <span className="text-neutral-muted">{owner.email}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${serviceInfo.color}`}
                            >
                              <ServiceIcon className="w-3.5 h-3.5" />
                              {serviceInfo.label}
                            </span>
                            {pkg && (
                              <button
                                onClick={() => setDetailPackage(pkg)}
                                className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
                              >
                                <Package className="w-3 h-3" />
                                查看套餐详情
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-neutral-text">{formatDateTime(ceremony.ceremonyTime)}</p>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(ceremony.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleViewChangeLog(ceremony.id)}
                              className={`inline-flex items-center text-sm font-medium transition-colors ${
                                showChangeLog === ceremony.id
                                  ? 'text-primary-900'
                                  : 'text-primary-700 hover:text-primary-900'
                              }`}
                              title="查看变更记录"
                            >
                              <History className="w-4 h-4 mr-1" />
                              变更记录
                            </button>
                            {pet && (
                              <Link
                                to={`/pets/${pet.id}`}
                                className="inline-flex items-center text-sm text-primary-700 hover:text-primary-900 font-medium"
                              >
                                查看详情
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && pkg && (
                        <tr key={`${ceremony.id}-expanded`} className="bg-gradient-to-r from-amber-50/60 to-rose-50/60">
                          <td colSpan={7} className="px-6 py-5">
                            <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm">
                              <div className="flex gap-5">
                                <div className="flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden border-2 border-primary-100 bg-primary-50">
                                  {pkg.coverImage ? (
                                    <img
                                      src={pkg.coverImage}
                                      alt={pkg.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Image className="w-10 h-10 text-primary-300" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-serif text-xl font-bold text-neutral-text flex items-center gap-2">
                                      {pkg.name}
                                      {pkg.isRecommended && (
                                        <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                          <Sparkles className="w-3 h-3" />
                                          推荐
                                        </span>
                                      )}
                                    </h4>
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="w-5 h-5 text-amber-500" />
                                      <span className="text-2xl font-bold text-amber-600">
                                        ¥{calculatePackagePrice(pkg).toLocaleString()}
                                      </span>
                                      <span className="text-xs text-neutral-muted">起</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-neutral-muted mb-4">{pkg.description}</p>
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                    {pkg.serviceItems.map((psi) => {
                                      const item = serviceItems.find((s) => s.id === psi.serviceItemId);
                                      const included = psi.included;
                                      return (
                                        <div
                                          key={psi.serviceItemId}
                                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                                            included
                                              ? 'bg-green-50 border border-green-100'
                                              : 'bg-neutral-50 border border-neutral-100 opacity-60'
                                          }`}
                                        >
                                          {included ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                          ) : (
                                            <XCircle className="w-4 h-4 text-neutral-300 flex-shrink-0" />
                                          )}
                                          <div className="min-w-0">
                                            <p className={`truncate ${included ? 'text-neutral-text font-medium' : 'text-neutral-muted line-through'}`}>
                                              {item?.name || '未知服务'}
                                            </p>
                                            {included && (
                                              <p className="text-xs text-amber-600">
                                                ¥{psi.customPrice ?? item?.price ?? 0}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {showChangeLog === ceremony.id && (
                        <tr key={`${ceremony.id}-changelog`} className="bg-blue-50/40">
                          <td colSpan={7} className="px-6 py-5">
                            <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
                              <h4 className="font-semibold text-primary-900 flex items-center gap-2 mb-4">
                                <History className="w-5 h-5 text-primary-600" />
                                预约变更记录
                              </h4>
                              {changeLogs.length > 0 ? (
                                <div className="space-y-3">
                                  {changeLogs.map((log) => {
                                    const actionColor: Record<string, string> = {
                                      created: 'bg-green-100 text-green-700',
                                      time_changed: 'bg-blue-100 text-blue-700',
                                      status_changed: 'bg-amber-100 text-amber-700',
                                      package_changed: 'bg-purple-100 text-purple-700',
                                      notes_changed: 'bg-cyan-100 text-cyan-700',
                                      cancelled: 'bg-red-100 text-red-700',
                                      other: 'bg-gray-100 text-gray-700',
                                    };
                                    return (
                                      <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-400 mt-2" />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${actionColor[log.action] ?? 'bg-gray-100 text-gray-700'}`}>
                                              {AppointmentChangeActionLabel[log.action] ?? log.action}
                                            </span>
                                            <span className="text-xs text-neutral-muted">{formatDateTime(log.timestamp)}</span>
                                            <span className="text-xs text-neutral-muted">操作人：{log.operator}</span>
                                          </div>
                                          <p className="text-sm text-neutral-text">{log.description}</p>
                                          {log.oldValue && log.newValue && (
                                            <div className="mt-1 flex items-center gap-2 text-xs">
                                              <span className="text-red-500 line-through">{log.oldValue}</span>
                                              <span className="text-neutral-muted">→</span>
                                              <span className="text-green-600">{log.newValue}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <AlertTriangle className="w-6 h-6 mx-auto text-neutral-300 mb-2" />
                                  <p className="text-sm text-neutral-muted">暂无变更记录</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detailPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setDetailPackage(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[85vh] overflow-hidden animate-scale-in flex flex-col">
            <div className="relative h-48 bg-primary-100 flex-shrink-0">
              {detailPackage.coverImage ? (
                <img
                  src={detailPackage.coverImage}
                  alt={detailPackage.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-16 h-16 text-primary-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {detailPackage.isRecommended && (
                      <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        推荐套餐
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    {detailPackage.name}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/80 mb-1">套餐价格</p>
                  <p className="text-3xl font-bold text-white">
                    ¥{calculatePackagePrice(detailPackage).toLocaleString()}
                    <span className="text-sm font-normal text-white/80 ml-1">起</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailPackage(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-neutral-muted mb-6 leading-relaxed">
                {detailPackage.description}
              </p>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-primary-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary-600" />
                    服务项明细
                  </h4>
                  <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                    共包含 {detailPackage.serviceItems.filter((s) => s.included).length} 项服务
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {detailPackage.serviceItems.map((psi) => {
                    const item = serviceItems.find((s) => s.id === psi.serviceItemId);
                    const included = psi.included;
                    return (
                      <div
                        key={psi.serviceItemId}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          included
                            ? 'border-green-200 bg-green-50'
                            : 'border-neutral-100 bg-neutral-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {included ? (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                              <XCircle className="w-5 h-5 text-neutral-300" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className={`font-medium truncate ${included ? 'text-neutral-text' : 'text-neutral-muted line-through'}`}>
                              {item?.name || '未知服务'}
                            </p>
                            {item?.description && included && (
                              <p className="text-xs text-neutral-muted truncate mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                        {included && (
                          <div className="ml-3 flex-shrink-0">
                            <span className="text-amber-600 font-semibold">
                              ¥{psi.customPrice ?? item?.price ?? 0}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 p-6 border-t border-primary-100 bg-primary-50/50 flex items-center justify-end">
              <button
                onClick={() => setDetailPackage(null)}
                className="btn-primary"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
