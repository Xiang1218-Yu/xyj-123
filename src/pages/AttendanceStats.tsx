import { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  XCircle,
  Plus,
  X,
  Calendar,
  Users,
  BarChart3,
  Filter
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import type { AttendanceRecord, ShiftType } from '@/shared/types';

const shiftTypeMap: Record<ShiftType, string> = {
  morning: '早班',
  afternoon: '晚班',
  night: '夜班',
  rest: '休息'
};

const statusMap: Record<AttendanceRecord['status'], { label: string; color: string }> = {
  normal: { label: '正常', color: 'bg-green-100 text-green-700' },
  late: { label: '迟到', color: 'bg-amber-100 text-amber-700' },
  'early-leave': { label: '早退', color: 'bg-orange-100 text-orange-700' },
  absent: { label: '缺勤', color: 'bg-red-100 text-red-700' }
};

interface NewRecordForm {
  employeeId: string;
  date: string;
  shiftType: ShiftType;
  checkInTime: string;
  checkOutTime: string;
  status: AttendanceRecord['status'];
}

const initialForm: NewRecordForm = {
  employeeId: '',
  date: '',
  shiftType: 'morning',
  checkInTime: '',
  checkOutTime: '',
  status: 'normal'
};

export default function AttendanceStats() {
  const {
    employees,
    attendanceRecords,
    addAttendanceRecord
  } = useAppStore();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewRecordForm>(initialForm);

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((r) => {
      if (startDate && r.date < startDate) return false;
      if (endDate && r.date > endDate) return false;
      return true;
    });
  }, [attendanceRecords, startDate, endDate]);

  const stats = useMemo(() => {
    const total = filteredRecords.length;
    const normal = filteredRecords.filter((r) => r.status === 'normal').length;
    const late = filteredRecords.filter((r) => r.status === 'late').length;
    const earlyLeave = filteredRecords.filter((r) => r.status === 'early-leave').length;
    const absent = filteredRecords.filter((r) => r.status === 'absent').length;
    const rate = total > 0 ? ((normal / total) * 100).toFixed(1) : '0.0';
    return { total, normal, late, earlyLeave, absent, rate };
  }, [filteredRecords]);

  const employeeSummary = useMemo(() => {
    const activeEmployees = employees.filter((e) => e.status === 'active');
    return activeEmployees.map((emp) => {
      const records = filteredRecords.filter((r) => r.employeeId === emp.id);
      const totalShifts = records.length;
      const normal = records.filter((r) => r.status === 'normal').length;
      const late = records.filter((r) => r.status === 'late').length;
      const earlyLeave = records.filter((r) => r.status === 'early-leave').length;
      const absent = records.filter((r) => r.status === 'absent').length;
      const rate = totalShifts > 0 ? ((normal / totalShifts) * 100).toFixed(1) : '0.0';
      return { employeeId: emp.id, name: emp.name, totalShifts, normal, late, earlyLeave, absent, rate };
    });
  }, [employees, filteredRecords]);

  const getEmployeeName = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    return emp?.name || '未知员工';
  };

  const handleSubmit = () => {
    if (!form.employeeId || !form.date) return;
    addAttendanceRecord({
      employeeId: form.employeeId,
      date: form.date,
      shiftType: form.shiftType,
      checkInTime: form.checkInTime || undefined,
      checkOutTime: form.checkOutTime || undefined,
      status: form.status
    });
    setForm(initialForm);
    setShowModal(false);
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="出勤统计"
        description="查看员工出勤记录与统计汇总"
        actions={
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5 mr-1.5" />
            添加记录
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">总记录</p>
              <p className="text-3xl font-bold text-primary-800 font-serif">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">正常</p>
              <p className="text-3xl font-bold text-green-600 font-serif">{stats.normal}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">迟到</p>
              <p className="text-3xl font-bold text-amber-600 font-serif">{stats.late}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">早退</p>
              <p className="text-3xl font-bold text-orange-600 font-serif">{stats.earlyLeave}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <LogOut className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">缺勤</p>
              <p className="text-3xl font-bold text-red-600 font-serif">{stats.absent}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-4">
          <BarChart3 className="w-6 h-6 text-primary-600" />
          <span className="text-neutral-muted">整体出勤率</span>
          <span className="text-3xl font-bold text-primary-800 font-serif">{stats.rate}%</span>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-primary-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            员工出勤汇总
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-primary-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">员工姓名</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">总班次</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">正常</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">迟到</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">早退</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">缺勤</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">出勤率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {employeeSummary.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Users className="w-12 h-12 text-primary-300 mx-auto mb-3" />
                    <p className="text-neutral-muted">暂无员工数据</p>
                  </td>
                </tr>
              ) : (
                employeeSummary.map((row) => (
                  <tr key={row.employeeId} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-text">{row.name}</td>
                    <td className="px-6 py-4 text-neutral-text">{row.totalShifts}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">{row.normal}</td>
                    <td className="px-6 py-4 text-amber-600 font-medium">{row.late}</td>
                    <td className="px-6 py-4 text-orange-600 font-medium">{row.earlyLeave}</td>
                    <td className="px-6 py-4 text-red-600 font-medium">{row.absent}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${
                        parseFloat(row.rate) >= 90 ? 'text-green-600' :
                        parseFloat(row.rate) >= 70 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {row.rate}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-primary-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary-600" />
            出勤记录明细
          </h2>
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-neutral-muted" />
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="input-field w-auto"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-neutral-muted">至</span>
              <input
                type="date"
                className="input-field w-auto"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {(startDate || endDate) && (
              <button onClick={resetFilters} className="btn-secondary text-sm py-1.5 px-3">
                清除筛选
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-primary-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">员工姓名</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">日期</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">班次</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">签到时间</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">签退时间</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary-800">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Calendar className="w-12 h-12 text-primary-300 mx-auto mb-3" />
                    <p className="text-neutral-muted">
                      {startDate || endDate ? '所选日期范围内无记录' : '暂无出勤记录'}
                    </p>
                  </td>
                </tr>
              ) : (
                [...filteredRecords]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((record) => (
                    <tr key={record.id} className="hover:bg-primary-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-neutral-text">
                        {getEmployeeName(record.employeeId)}
                      </td>
                      <td className="px-6 py-4 text-neutral-text">{record.date}</td>
                      <td className="px-6 py-4 text-neutral-text">
                        {shiftTypeMap[record.shiftType]}
                      </td>
                      <td className="px-6 py-4 text-neutral-muted">
                        {record.checkInTime || '-'}
                      </td>
                      <td className="px-6 py-4 text-neutral-muted">
                        {record.checkOutTime || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-badge ${statusMap[record.status].color}`}>
                          {statusMap[record.status].label}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-primary-100">
              <h2 className="font-serif text-xl font-bold text-neutral-text flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                添加出勤记录
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setForm(initialForm);
                }}
                className="p-1.5 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            <div className="p-6 space-y-5">
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
                <label className="label-text flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  日期 *
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div>
                <label className="label-text">班次类型</label>
                <select
                  className="input-field"
                  value={form.shiftType}
                  onChange={(e) => setForm({ ...form, shiftType: e.target.value as ShiftType })}
                >
                  <option value="morning">早班</option>
                  <option value="afternoon">晚班</option>
                  <option value="night">夜班</option>
                  <option value="rest">休息</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">签到时间</label>
                  <input
                    type="time"
                    className="input-field"
                    value={form.checkInTime}
                    onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-text">签退时间</label>
                  <input
                    type="time"
                    className="input-field"
                    value={form.checkOutTime}
                    onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label-text">状态</label>
                <select
                  className="input-field"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as AttendanceRecord['status'] })}
                >
                  <option value="normal">正常</option>
                  <option value="late">迟到</option>
                  <option value="early-leave">早退</option>
                  <option value="absent">缺勤</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-primary-100">
              <button
                onClick={() => {
                  setShowModal(false);
                  setForm(initialForm);
                }}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.employeeId || !form.date}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
