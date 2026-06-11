import { useState, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Plus,
  X,
  User,
  CalendarDays,
  FileText,
  Filter,
  AlertTriangle
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import type { LeaveRequest } from '@/shared/types';

type TabFilter = 'all' | 'pending' | 'approved' | 'rejected';

const leaveTypeMap: Record<LeaveRequest['type'], string> = {
  annual: '年假',
  sick: '病假',
  personal: '事假',
  bereavement: '丧假'
};

const statusMap: Record<LeaveRequest['status'], { label: string; color: string }> = {
  pending: { label: '待审批', color: 'bg-amber-100 text-amber-700' },
  approved: { label: '已批准', color: 'bg-green-100 text-green-700' },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700' }
};

const tabs: { key: TabFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待审批' },
  { key: 'approved', label: '已批准' },
  { key: 'rejected', label: '已拒绝' }
];

interface NewLeaveForm {
  employeeId: string;
  type: LeaveRequest['type'];
  startDate: string;
  endDate: string;
  reason: string;
}

const initialForm: NewLeaveForm = {
  employeeId: '',
  type: 'annual',
  startDate: '',
  endDate: '',
  reason: ''
};

function getDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  const current = new Date(startDate);
  while (current <= endDate) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function LeaveApproval() {
  const {
    employees,
    leaveRequests,
    shiftSchedules,
    addLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewLeaveForm>(initialForm);
  const [error, setError] = useState<string | null>(null);

  const pendingCount = leaveRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = leaveRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = leaveRequests.filter((r) => r.status === 'rejected').length;

  const filteredRequests = leaveRequests
    .filter((r) => activeTab === 'all' || r.status === activeTab)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const conflictInfo = useMemo(() => {
    if (!form.employeeId || !form.startDate || !form.endDate) return null;
    if (form.startDate > form.endDate) return { hasConflict: false, messages: [] };

    const dates = getDateRange(form.startDate, form.endDate);
    const conflictDates: string[] = [];

    for (const date of dates) {
      const hasWorkShift = shiftSchedules.some(
        (s) => s.employeeId === form.employeeId && s.date === date && s.shiftType !== 'rest'
      );
      if (hasWorkShift) {
        conflictDates.push(date);
      }
    }

    return {
      hasConflict: conflictDates.length > 0,
      messages: conflictDates
    };
  }, [form.employeeId, form.startDate, form.endDate, shiftSchedules]);

  const getEmployeeName = (id: string) =>
    employees.find((e) => e.id === id)?.name || '未知员工';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
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

  const handleApprove = (id: string) => {
    const request = leaveRequests.find((r) => r.id === id);
    if (!request) return;

    const dates = getDateRange(request.startDate, request.endDate);
    for (const date of dates) {
      const hasWorkShift = shiftSchedules.some(
        (s) => s.employeeId === request.employeeId && s.date === date && s.shiftType !== 'rest'
      );
      if (hasWorkShift) {
        setError('该请假时段内已有排班，请先处理排班冲突后再审批');
        setTimeout(() => setError(null), 5000);
        return;
      }
    }

    approveLeaveRequest(id, 'emp-006');
  };

  const handleReject = (id: string) => {
    rejectLeaveRequest(id, 'emp-006');
  };

  const handleSubmit = () => {
    setError(null);
    if (!form.employeeId || !form.startDate || !form.endDate || !form.reason.trim()) return;
    if (form.startDate > form.endDate) {
      setError('结束日期不能早于开始日期');
      return;
    }

    if (conflictInfo?.hasConflict) {
      setError(`请先处理排班冲突：${conflictInfo.messages.join('、')} 已有排班`);
      return;
    }

    addLeaveRequest({
      employeeId: form.employeeId,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason.trim(),
      status: 'pending'
    });

    setForm(initialForm);
    setShowModal(false);
  };

  const closeModal = () => {
    setForm(initialForm);
    setShowModal(false);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="请假审批"
        description="管理员工请假申请与审批，自动检测与排班的冲突"
        actions={
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5 mr-1.5" />
            新增请假
          </button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">待审批</p>
              <p className="text-3xl font-bold text-amber-600 font-serif">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">已批准</p>
              <p className="text-3xl font-bold text-green-600 font-serif">{approvedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">已拒绝</p>
              <p className="text-3xl font-bold text-red-600 font-serif">{rejectedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">总计</p>
              <p className="text-3xl font-bold text-primary-800 font-serif">{leaveRequests.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-1 px-6 pt-5 pb-3 border-b border-primary-100">
          <Filter className="w-4 h-4 text-neutral-muted mr-2" />
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-primary-800 text-white shadow-sm'
                  : 'text-neutral-muted hover:bg-primary-50 hover:text-primary-800'
              }`}
            >
              {tab.label}
              {tab.key === 'pending' && pendingCount > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                }`}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-primary-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">员工姓名</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">请假类型</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">日期范围</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">请假原因</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">状态</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">提交时间</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
                      <ClipboardList className="w-8 h-8 text-primary-400" />
                    </div>
                    <p className="text-neutral-muted text-lg mb-2">暂无请假记录</p>
                    <p className="text-sm text-primary-400">
                      {activeTab === 'all' ? '点击右上角按钮新增请假申请' : `暂无${statusMap[activeTab as keyof typeof statusMap]?.label || ''}记录`}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => {
                  const statusInfo = statusMap[request.status];
                  return (
                    <tr key={request.id} className="hover:bg-primary-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-primary-600" />
                          </div>
                          <span className="font-medium text-neutral-text">
                            {getEmployeeName(request.employeeId)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                          {leaveTypeMap[request.type]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-neutral-text">
                          <CalendarDays className="w-4 h-4 text-primary-400" />
                          <span>{formatDate(request.startDate)}</span>
                          <span className="text-neutral-muted">至</span>
                          <span>{formatDate(request.endDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-1.5 max-w-xs">
                          <FileText className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-neutral-text line-clamp-2">{request.reason}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-badge ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-muted">
                          {formatDateTime(request.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {request.status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors border border-green-200"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              批准
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              拒绝
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-muted">—</span>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-primary-100 flex-shrink-0">
              <h2 className="font-serif text-xl font-bold text-neutral-text flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                新增请假申请
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              {conflictInfo?.hasConflict && (
                <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-700 font-medium">检测到排班冲突</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      {conflictInfo.messages.join('、')} 已有排班，请先处理排班冲突
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="label-text">员工 *</label>
                <select
                  className="input-field"
                  value={form.employeeId}
                  onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                >
                  <option value="">请选择员工</option>
                  {employees
                    .filter((e) => e.status === 'active')
                    .map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="label-text">请假类型 *</label>
                <select
                  className="input-field"
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as LeaveRequest['type'] })
                  }
                >
                  <option value="annual">年假</option>
                  <option value="sick">病假</option>
                  <option value="personal">事假</option>
                  <option value="bereavement">丧假</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">开始日期 *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-text">结束日期 *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label-text">请假原因 *</label>
                <textarea
                  className="input-field min-h-[80px] resize-none"
                  placeholder="请输入请假原因"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-primary-100 flex-shrink-0">
              <button onClick={closeModal} className="btn-secondary">
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.employeeId || !form.startDate || !form.endDate || !form.reason.trim() || conflictInfo?.hasConflict}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
