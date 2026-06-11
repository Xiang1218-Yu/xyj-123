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
  AlertTriangle,
  Users,
  Trash2,
  RefreshCw,
  Sparkles,
  ArrowRightLeft,
  Sun,
  Sunset,
  Moon,
  Coffee
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import type { LeaveRequest, ShiftSchedule, ShiftType } from '@/shared/types';

type TabFilter = 'all' | 'pending' | 'approved' | 'rejected';
type ConflictAction = 'replace' | 'smart' | 'clear' | null;
type ConflictMode = 'create' | 'approve';

const SHIFT_CONFIG: Record<ShiftType, { label: string; color: string; icon: typeof Sun }> = {
  morning: { label: '早班', color: 'text-blue-700 bg-blue-100', icon: Sun },
  afternoon: { label: '晚班', color: 'text-orange-700 bg-orange-100', icon: Sunset },
  night: { label: '夜班', color: 'text-purple-700 bg-purple-100', icon: Moon },
  rest: { label: '休息', color: 'text-gray-600 bg-gray-100', icon: Coffee },
};

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

interface ConflictResolutionState {
  request: LeaveRequest;
  mode: ConflictMode;
  createFormData?: NewLeaveForm;
  conflictingShifts: ShiftSchedule[];
  action: ConflictAction;
  replacementMap: Record<string, string>;
  smartAssignments: Array<{ shiftId: string; employeeId: string; employeeName: string }>;
  processing: boolean;
  success: boolean;
  error: string | null;
}

const initialForm: NewLeaveForm = {
  employeeId: '',
  type: 'annual',
  startDate: '',
  endDate: '',
  reason: ''
};

const initialResolution: ConflictResolutionState = {
  request: null as unknown as LeaveRequest,
  mode: 'approve',
  conflictingShifts: [],
  action: null,
  replacementMap: {},
  smartAssignments: [],
  processing: false,
  success: false,
  error: null
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

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function LeaveApproval() {
  const {
    employees,
    leaveRequests,
    shiftSchedules,
    addLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    updateShiftSchedule,
    deleteShiftSchedule,
    hasLeaveConflict
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewLeaveForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [resolution, setResolution] = useState<ConflictResolutionState>(initialResolution);

  const pendingCount = leaveRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = leaveRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = leaveRequests.filter((r) => r.status === 'rejected').length;

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.status === 'active'),
    [employees]
  );

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

  const getConflictingShifts = (request: LeaveRequest): ShiftSchedule[] => {
    const dates = getDateRange(request.startDate, request.endDate);
    return shiftSchedules.filter((s) => {
      if (s.employeeId !== request.employeeId) return false;
      if (s.shiftType === 'rest') return false;
      return dates.includes(s.date);
    });
  };

  const getAvailableReplacements = (shift: ShiftSchedule): Array<{ id: string; name: string }> => {
    return activeEmployees
      .filter((emp) => {
        if (emp.id === shift.employeeId) return false;
        const hasConflict = shiftSchedules.some(
          (s) => s.employeeId === emp.id && s.date === shift.date && s.shiftType !== 'rest'
        );
        const hasLeave = hasLeaveConflict(emp.id, shift.date);
        return !hasConflict && !hasLeave;
      })
      .map((emp) => ({ id: emp.id, name: emp.name }));
  };

  const getSmartRecommendation = (shifts: ShiftSchedule[]): Map<string, string[]> => {
    const recommendations = new Map<string, string[]>();
    const employeeWorkload = new Map<string, number>();

    for (const emp of activeEmployees) {
      const count = shiftSchedules.filter(
        (s) => s.employeeId === emp.id && s.shiftType !== 'rest'
      ).length;
      employeeWorkload.set(emp.id, count);
    }

    for (const shift of shifts) {
      const available = getAvailableReplacements(shift);
      const sorted = available.sort((a, b) => {
        const workloadA = employeeWorkload.get(a.id) || 0;
        const workloadB = employeeWorkload.get(b.id) || 0;
        return workloadA - workloadB;
      });
      recommendations.set(shift.id, sorted.map((e) => e.id));
    }

    return recommendations;
  };

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

  const openConflictModal = (request: LeaveRequest, mode: ConflictMode = 'approve', createFormData?: NewLeaveForm) => {
    const conflictingShifts = getConflictingShifts(request);
    const replacementMap: Record<string, string> = {};

    for (const shift of conflictingShifts) {
      const available = getAvailableReplacements(shift);
      if (available.length > 0) {
        replacementMap[shift.id] = available[0].id;
      }
    }

    setResolution({
      request,
      mode,
      createFormData,
      conflictingShifts,
      action: null,
      replacementMap,
      smartAssignments: [],
      processing: false,
      success: false,
      error: null
    });
    setShowConflictModal(true);
  };

  const handleApprove = (id: string) => {
    setError(null);
    const request = leaveRequests.find((r) => r.id === id);
    if (!request) return;

    const conflictingShifts = getConflictingShifts(request);
    if (conflictingShifts.length > 0) {
      openConflictModal(request);
      return;
    }

    approveLeaveRequest(id, 'emp-006');
  };

  const handleReject = (id: string) => {
    rejectLeaveRequest(id, 'emp-006');
  };

  const applySmartAssignments = () => {
    const recommendations = getSmartRecommendation(resolution.conflictingShifts);
    const assignments: ConflictResolutionState['smartAssignments'] = [];
    let valid = true;

    for (const shift of resolution.conflictingShifts) {
      const recs = recommendations.get(shift.id) || [];
      if (recs.length === 0) {
        valid = false;
        continue;
      }
      const selectedId = recs[0];
      assignments.push({
        shiftId: shift.id,
        employeeId: selectedId,
        employeeName: getEmployeeName(selectedId)
      });
    }

    if (!valid) {
      setResolution((prev) => ({
        ...prev,
        error: '部分班次无可用替换人选，请使用手动替换或清除排班'
      }));
      return;
    }

    setResolution((prev) => ({
      ...prev,
      action: 'smart',
      smartAssignments: assignments,
      error: null
    }));
  };

  const executeResolution = async () => {
    if (!resolution.action) return;

    setResolution((prev) => ({ ...prev, processing: true, error: null }));

    try {
      if (resolution.action === 'clear') {
        for (const shift of resolution.conflictingShifts) {
          deleteShiftSchedule(shift.id);
        }
      } else if (resolution.action === 'replace') {
        for (const shift of resolution.conflictingShifts) {
          const replacementId = resolution.replacementMap[shift.id];
          if (!replacementId) {
            throw new Error(`请为 ${formatDisplayDate(shift.date)} ${SHIFT_CONFIG[shift.shiftType].label} 选择替换人`);
          }
          updateShiftSchedule(shift.id, { employeeId: replacementId });
        }
      } else if (resolution.action === 'smart') {
        for (const assignment of resolution.smartAssignments) {
          updateShiftSchedule(assignment.shiftId, { employeeId: assignment.employeeId });
        }
      }

      if (resolution.mode === 'approve') {
        approveLeaveRequest(resolution.request.id, 'emp-006');
      } else if (resolution.mode === 'create' && resolution.createFormData) {
        addLeaveRequest({
          employeeId: resolution.createFormData.employeeId,
          type: resolution.createFormData.type,
          startDate: resolution.createFormData.startDate,
          endDate: resolution.createFormData.endDate,
          reason: resolution.createFormData.reason.trim(),
          status: 'pending'
        });
      }

      setResolution((prev) => ({ ...prev, success: true }));
      setTimeout(() => {
        setShowConflictModal(false);
        setShowModal(false);
        setForm(initialForm);
        setResolution(initialResolution);
      }, 1200);
    } catch (e) {
      setResolution((prev) => ({
        ...prev,
        processing: false,
        error: e instanceof Error ? e.message : '操作失败，请重试'
      }));
    }
  };

  const closeConflictModal = () => {
    if (resolution.processing) return;
    setShowConflictModal(false);
    setResolution(initialResolution);
  };

  const handleSubmit = () => {
    setError(null);
    if (!form.employeeId || !form.startDate || !form.endDate || !form.reason.trim()) return;
    if (form.startDate > form.endDate) {
      setError('结束日期不能早于开始日期');
      return;
    }

    if (conflictInfo?.hasConflict) {
      const tempRequest: LeaveRequest = {
        id: 'temp-create',
        employeeId: form.employeeId,
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason.trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      openConflictModal(tempRequest, 'create', { ...form });
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
        description="管理员工请假申请与审批，自动检测与排班的冲突，支持一键换班"
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
                <div className="flex items-start justify-between gap-3 px-3 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-amber-700 font-medium">检测到排班冲突</p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        {conflictInfo.messages.join('、')} 已有排班
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const tempRequest: LeaveRequest = {
                        id: 'temp-create',
                        employeeId: form.employeeId,
                        type: form.type,
                        startDate: form.startDate,
                        endDate: form.endDate,
                        reason: form.reason.trim(),
                        status: 'pending',
                        createdAt: new Date().toISOString()
                      };
                      openConflictModal(tempRequest, 'create', { ...form });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors flex-shrink-0"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    处理冲突
                  </button>
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
                  {activeEmployees.map((emp) => (
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
                disabled={!form.employeeId || !form.startDate || !form.endDate || !form.reason.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {conflictInfo?.hasConflict ? '处理冲突并提交' : '确认提交'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConflictModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl animate-fade-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-primary-100 flex-shrink-0">
              <h2 className="font-serif text-xl font-bold text-neutral-text flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                {resolution.mode === 'create' ? '创建请假 - 排班冲突处理' : '排班冲突处理'}
              </h2>
              <button
                onClick={closeConflictModal}
                disabled={resolution.processing}
                className="p-1.5 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {resolution.error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>{resolution.error}</span>
                </div>
              )}
              {resolution.success && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">
                    {resolution.mode === 'create' ? '处理成功！已提交请假申请' : '处理成功！已批准请假申请'}
                  </span>
                </div>
              )}

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-amber-800 font-medium">
                      {getEmployeeName(resolution.request.employeeId)} 在请假期间
                      （{formatDate(resolution.request.startDate)} 至 {formatDate(resolution.request.endDate)}）
                      有 {resolution.conflictingShifts.length} 个班次需要处理
                    </p>
                    <p className="text-sm text-amber-600 mt-1">
                      请选择以下方式之一处理排班冲突
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="label-text mb-3 block">冲突班次列表</label>
                <div className="border border-primary-100 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-primary-50 border-b border-primary-100">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-primary-700">日期</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-primary-700">班次</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-primary-700">当前员工</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-primary-700">
                          {resolution.action === 'replace' ? '替换为 *' : '替换人选'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-50">
                      {resolution.conflictingShifts.map((shift) => {
                        const config = SHIFT_CONFIG[shift.shiftType];
                        const Icon = config.icon;
                        const available = getAvailableReplacements(shift);
                        const selectedId = resolution.action === 'smart'
                          ? resolution.smartAssignments.find((a) => a.shiftId === shift.id)?.employeeId
                          : resolution.replacementMap[shift.id];

                        return (
                          <tr key={shift.id}>
                            <td className="px-4 py-3 text-sm text-neutral-text">
                              {formatDisplayDate(shift.date)}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                                <Icon className="w-3 h-3" />
                                {config.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-neutral-text">
                              {getEmployeeName(shift.employeeId)}
                            </td>
                            <td className="px-4 py-3">
                              {resolution.action === 'clear' ? (
                                <span className="text-sm text-rose-600 font-medium">将被清除</span>
                              ) : resolution.action === 'smart' ? (
                                <span className="text-sm text-green-700 font-medium">
                                  {selectedId ? getEmployeeName(selectedId) : '-'}
                                </span>
                              ) : (
                                <select
                                  className="input-field text-sm py-1.5 h-auto min-h-[36px]"
                                  value={selectedId || ''}
                                  onChange={(e) =>
                                    setResolution((prev) => ({
                                      ...prev,
                                      action: 'replace',
                                      replacementMap: {
                                        ...prev.replacementMap,
                                        [shift.id]: e.target.value
                                      },
                                      error: null
                                    }))
                                  }
                                  disabled={resolution.processing}
                                >
                                  <option value="">请选择替换人</option>
                                  {available.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                      {emp.name}
                                    </option>
                                  ))}
                                  {available.length === 0 && (
                                    <option value="" disabled>无可用替换人</option>
                                  )}
                                </select>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="label-text mb-3 block">选择处理方式</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() =>
                      setResolution((prev) => ({
                        ...prev,
                        action: 'replace',
                        error: null,
                        smartAssignments: []
                      }))
                    }
                    disabled={resolution.processing}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      resolution.action === 'replace'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-primary-100 bg-white hover:border-primary-300 hover:bg-primary-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowRightLeft className={`w-5 h-5 ${
                        resolution.action === 'replace' ? 'text-primary-600' : 'text-primary-400'
                      }`} />
                      <span className={`font-semibold ${
                        resolution.action === 'replace' ? 'text-primary-800' : 'text-neutral-text'
                      }`}>手动替换</span>
                    </div>
                    <p className="text-xs text-neutral-muted">逐个选择替换人，需确保新员工当天无排班且无请假</p>
                  </button>

                  <button
                    onClick={applySmartAssignments}
                    disabled={resolution.processing}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      resolution.action === 'smart'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-primary-100 bg-white hover:border-primary-300 hover:bg-primary-50/50'
                    } disabled:opacity-60`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className={`w-5 h-5 ${
                        resolution.action === 'smart' ? 'text-primary-600' : 'text-primary-400'
                      }`} />
                      <span className={`font-semibold ${
                        resolution.action === 'smart' ? 'text-primary-800' : 'text-neutral-text'
                      }`}>智能排班</span>
                    </div>
                    <p className="text-xs text-neutral-muted">系统自动推荐排班最少的员工作为替换人</p>
                  </button>

                  <button
                    onClick={() =>
                      setResolution((prev) => ({
                        ...prev,
                        action: 'clear',
                        error: null,
                        smartAssignments: []
                      }))
                    }
                    disabled={resolution.processing}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      resolution.action === 'clear'
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-primary-100 bg-white hover:border-rose-300 hover:bg-rose-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Trash2 className={`w-5 h-5 ${
                        resolution.action === 'clear' ? 'text-rose-600' : 'text-rose-400'
                      }`} />
                      <span className={`font-semibold ${
                        resolution.action === 'clear' ? 'text-rose-700' : 'text-neutral-text'
                      }`}>清除排班</span>
                    </div>
                    <p className="text-xs text-neutral-muted">直接删除该员工的所有冲突排班，不安排替换</p>
                  </button>
                </div>
              </div>

              {resolution.action === 'smart' && resolution.smartAssignments.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">智能推荐结果</span>
                  </div>
                  <div className="space-y-1.5">
                    {resolution.smartAssignments.map((a) => {
                      const shift = resolution.conflictingShifts.find((s) => s.id === a.shiftId);
                      if (!shift) return null;
                      const config = SHIFT_CONFIG[shift.shiftType];
                      return (
                        <div key={a.shiftId} className="flex items-center gap-2 text-sm text-green-700">
                          <span>{formatDisplayDate(shift.date)}</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-green-500">→</span>
                          <span className="font-medium">{a.employeeName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center p-6 border-t border-primary-100 bg-primary-50/50 flex-shrink-0">
              <div className="flex items-center gap-2 text-sm text-neutral-muted">
                <Users className="w-4 h-4" />
                <span>当前共 {activeEmployees.length} 名在岗员工</span>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeConflictModal}
                  className="btn-secondary"
                  disabled={resolution.processing || resolution.success}
                >
                  取消
                </button>
                <button
                  onClick={executeResolution}
                  disabled={
                    !resolution.action ||
                    resolution.processing ||
                    resolution.success ||
                    (resolution.action === 'replace' &&
                      resolution.conflictingShifts.some((s) => !resolution.replacementMap[s.id]))
                  }
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resolution.processing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                      处理中...
                    </>
                  ) : resolution.success ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      成功
                    </>
                  ) : resolution.mode === 'create' ? (
                    <>确认处理并提交</>
                  ) : (
                    <>确认处理并批准</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
