import { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Sun,
  Sunset,
  Moon,
  Coffee,
  Users,
  Filter,
  Layers,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Plus,
  X
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import type { ShiftType, ShiftSchedule } from '@/shared/types';

const SHIFT_CONFIG: Record<ShiftType, { label: string; color: string; bg: string; icon: typeof Sun }> = {
  morning: { label: '早班', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-200', icon: Sun },
  afternoon: { label: '晚班', color: 'text-orange-700', bg: 'bg-orange-100 border-orange-200', icon: Sunset },
  night: { label: '夜班', color: 'text-purple-700', bg: 'bg-purple-100 border-purple-200', icon: Moon },
  rest: { label: '休息', color: 'text-gray-600', bg: 'bg-gray-100 border-gray-200', icon: Coffee },
};

const SHIFT_ORDER: ShiftType[] = ['morning', 'afternoon', 'night', 'rest'];

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

interface CellPopupProps {
  schedule: ShiftSchedule | undefined;
  employeeId: string;
  date: string;
  hasConflict: boolean;
  onClose: () => void;
}

function CellPopup({ schedule, employeeId, date, hasConflict, onClose }: CellPopupProps) {
  const { addShiftSchedule, updateShiftSchedule, deleteShiftSchedule } = useAppStore();
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const handleSelect = (shiftType: ShiftType) => {
    setError(null);
    try {
      if (schedule) {
        if (schedule.shiftType === shiftType) {
          deleteShiftSchedule(schedule.id);
        } else {
          updateShiftSchedule(schedule.id, { shiftType });
        }
      } else {
        addShiftSchedule({ employeeId, date, shiftType });
      }
      onClose();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  return (
    <div
      ref={ref}
      className="absolute z-30 top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-xl shadow-card-hover border border-neutral-border p-1.5 min-w-[140px]"
    >
      {hasConflict && (
        <div className="px-3 py-2 mb-1.5 bg-rose-50 border border-rose-200 rounded-lg">
          <div className="flex items-center gap-1.5 text-rose-700 text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            该日期已有请假审批
          </div>
          <p className="text-xs text-rose-600 mt-0.5">仅可设置为休息班次</p>
        </div>
      )}
      {error && (
        <div className="px-3 py-2 mb-1.5 bg-rose-50 border border-rose-200 rounded-lg">
          <p className="text-xs text-rose-700">{error}</p>
        </div>
      )}
      {SHIFT_ORDER.map((type) => {
        const config = SHIFT_CONFIG[type];
        const Icon = config.icon;
        const isActive = schedule?.shiftType === type;
        const isDisabled = hasConflict && type !== 'rest';
        return (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            disabled={isDisabled}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDisabled
                ? 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400'
                : isActive
                  ? `${config.bg} ${config.color}`
                  : 'text-neutral-text hover:bg-primary-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}

interface BatchModalProps {
  weekDays: Date[];
  filteredEmployees: Array<{ id: string; name: string }>;
  onClose: () => void;
}

function BatchModal({ weekDays, filteredEmployees, onClose }: BatchModalProps) {
  const { batchSetShifts, hasLeaveConflict } = useAppStore();
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set());
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set([0, 1, 2, 3, 4]));
  const [shiftType, setShiftType] = useState<ShiftType>('morning');
  const [applyMode, setApplyMode] = useState<'rest' | 'shift'>('shift');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggleEmployee = (id: string) => {
    setSelectedEmployeeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleDay = (index: number) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const selectAllEmployees = () => {
    if (selectedEmployeeIds.size === filteredEmployees.length) {
      setSelectedEmployeeIds(new Set());
    } else {
      setSelectedEmployeeIds(new Set(filteredEmployees.map((e) => e.id)));
    }
  };

  const handleApply = () => {
    setError(null);
    setSuccess(false);
    if (selectedEmployeeIds.size === 0) {
      setError('请至少选择一名员工');
      return;
    }
    if (selectedDays.size === 0) {
      setError('请至少选择一天');
      return;
    }

    try {
      const schedules: Array<{ employeeId: string; date: string; shiftType: ShiftType }> = [];
      for (const empId of selectedEmployeeIds) {
        for (const dayIdx of selectedDays) {
          const date = formatDate(weekDays[dayIdx]);
          const targetShift = applyMode === 'rest' ? 'rest' : shiftType;
          if (targetShift !== 'rest' && hasLeaveConflict(empId, date)) {
            const emp = filteredEmployees.find((e) => e.id === empId);
            throw new Error(`${emp?.name || '员工'} 在 ${date} 已有请假审批，无法安排非休息班次`);
          }
          schedules.push({ employeeId: empId, date, shiftType: targetShift });
        }
      }

      batchSetShifts(schedules);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl animate-fade-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-primary-100 flex-shrink-0">
          <h2 className="font-serif text-xl font-bold text-neutral-text flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            批量排班设置
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary-50 transition-colors">
            <X className="w-5 h-5 text-neutral-muted" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {success && (
            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">批量排班成功！</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label-text mb-0">选择员工</label>
              <button
                onClick={selectAllEmployees}
                className="text-xs text-primary-600 hover:text-primary-800 font-medium"
              >
                {selectedEmployeeIds.size === filteredEmployees.length ? '取消全选' : '全选'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-1">
              {filteredEmployees.map((emp) => (
                <label
                  key={emp.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    selectedEmployeeIds.has(emp.id)
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-primary-50 text-neutral-text hover:bg-primary-100/70'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedEmployeeIds.has(emp.id)}
                    onChange={() => toggleEmployee(emp.id)}
                    className="w-4 h-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium">{emp.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">选择日期</label>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, i) => (
                <button
                  key={i}
                  onClick={() => toggleDay(i)}
                  className={`flex flex-col items-center py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedDays.has(i)
                      ? 'bg-primary-700 text-white'
                      : 'bg-primary-50 text-neutral-text hover:bg-primary-100'
                  }`}
                >
                  <span className="text-xs opacity-75">{WEEKDAYS[i]}</span>
                  <span className="text-sm mt-0.5">{formatDisplayDate(day)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">应用模式</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setApplyMode('shift')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    applyMode === 'shift'
                      ? 'bg-primary-700 text-white'
                      : 'bg-primary-50 text-neutral-text hover:bg-primary-100'
                  }`}
                >
                  设置班次
                </button>
                <button
                  onClick={() => setApplyMode('rest')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    applyMode === 'rest'
                      ? 'bg-gray-600 text-white'
                      : 'bg-primary-50 text-neutral-text hover:bg-primary-100'
                  }`}
                >
                  设置休息
                </button>
              </div>
            </div>
            {applyMode === 'shift' && (
              <div>
                <label className="label-text">班次类型</label>
                <select
                  className="input-field"
                  value={shiftType}
                  onChange={(e) => setShiftType(e.target.value as ShiftType)}
                >
                  <option value="morning">早班</option>
                  <option value="afternoon">晚班</option>
                  <option value="night">夜班</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-primary-100 bg-primary-50/50 flex-shrink-0">
          <button onClick={onClose} className="btn-secondary">
            取消
          </button>
          <button
            onClick={handleApply}
            disabled={success}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            确认应用
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShiftCalendar() {
  const {
    employees,
    shiftSchedules,
    hasLeaveConflict,
    syncAttendanceFromShifts,
    attendanceRecords
  } = useAppStore();

  const [weekOffset, setWeekOffset] = useState(0);
  const [activeCell, setActiveCell] = useState<{ employeeId: string; date: string } | null>(null);
  const [filterEmployeeIds, setFilterEmployeeIds] = useState<Set<string>>(new Set());
  const [showFilter, setShowFilter] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.status === 'active'),
    [employees]
  );

  const monday = useMemo(() => {
    const today = new Date();
    const base = getMonday(today);
    base.setDate(base.getDate() + weekOffset * 7);
    return base;
  }, [weekOffset]);

  const weekDays = useMemo(() => getWeekDays(monday), [monday]);
  const weekEndDate = weekDays[6];

  const scheduleMap = useMemo(() => {
    const map = new Map<string, ShiftSchedule>();
    for (const s of shiftSchedules) {
      map.set(`${s.employeeId}_${s.date}`, s);
    }
    return map;
  }, [shiftSchedules]);

  const filteredEmployees = useMemo(() => {
    if (filterEmployeeIds.size === 0) return activeEmployees;
    return activeEmployees.filter((e) => filterEmployeeIds.has(e.id));
  }, [activeEmployees, filterEmployeeIds]);

  const toggleFilter = (id: string) => {
    setFilterEmployeeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const shiftCountByType = useMemo(() => {
    const counts: Record<ShiftType, number> = { morning: 0, afternoon: 0, night: 0, rest: 0 };
    for (const day of weekDays) {
      const dateStr = formatDate(day);
      for (const emp of filteredEmployees) {
        const s = scheduleMap.get(`${emp.id}_${dateStr}`);
        if (s) counts[s.shiftType]++;
      }
    }
    return counts;
  }, [weekDays, filteredEmployees, scheduleMap]);

  const unscheduledCount = useMemo(() => {
    let count = 0;
    for (const day of weekDays) {
      const dateStr = formatDate(day);
      for (const emp of filteredEmployees) {
        const s = scheduleMap.get(`${emp.id}_${dateStr}`);
        if (!s) count++;
      }
    }
    return count;
  }, [weekDays, filteredEmployees, scheduleMap]);

  const handleSync = () => {
    const beforeCount = attendanceRecords.length;
    syncAttendanceFromShifts();
    const afterCount = attendanceRecords.length;
    const added = afterCount - beforeCount;
    if (added > 0) {
      setSyncMessage({ type: 'success', text: `已成功生成 ${added} 条待签到记录` });
    } else {
      setSyncMessage({ type: 'info', text: '所有排班均已生成出勤记录，无需更新' });
    }
    setTimeout(() => setSyncMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="排班日历配置"
        description="管理员工每周排班，点击单元格修改班次，自动生成出勤待签到记录"
        actions={
          <div className="flex items-center gap-3">
            {syncMessage && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                syncMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-primary-50 text-primary-700 border border-primary-200'
              }`}>
                {syncMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                {syncMessage.text}
              </div>
            )}
            <button onClick={handleSync} className="btn-accent">
              <RefreshCw className="w-4 h-4 mr-1.5" />
              生成待签到
            </button>
            <button onClick={() => setShowBatchModal(true)} className="btn-primary">
              <Layers className="w-4 h-4 mr-1.5" />
              批量排班
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setWeekOffset((p) => p - 1)}
                  className="p-2 rounded-lg hover:bg-primary-100 text-primary-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-primary-600" />
                  <span className="font-serif text-lg font-bold text-primary-900">
                    {formatDisplayDate(monday)} - {formatDisplayDate(weekEndDate)}
                  </span>
                </div>
                <button
                  onClick={() => setWeekOffset((p) => p + 1)}
                  className="p-2 rounded-lg hover:bg-primary-100 text-primary-700 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setWeekOffset(0)}
                  className="btn-secondary text-sm py-1.5 px-3"
                >
                  本周
                </button>
              </div>
              <div className="flex items-center gap-2">
                {unscheduledCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertTriangle className="w-3 h-3" />
                    {unscheduledCount} 个未排
                  </span>
                )}
                {SHIFT_ORDER.map((type) => {
                  const config = SHIFT_CONFIG[type];
                  const Icon = config.icon;
                  return (
                    <span
                      key={type}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}
                    >
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="overflow-x-auto -mx-6">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-primary-100">
                    <th className="text-left px-6 py-3 text-sm font-semibold text-primary-800 w-32 sticky left-0 bg-white z-10">
                      员工
                    </th>
                    {weekDays.map((day, i) => (
                      <th
                        key={formatDate(day)}
                        className={`text-center px-2 py-3 text-sm font-semibold min-w-[90px] ${
                          isToday(day)
                            ? 'text-accent-dark bg-accent/10'
                            : 'text-primary-800'
                        }`}
                      >
                        <div>{WEEKDAYS[i]}</div>
                        <div className={`text-xs font-normal ${isToday(day) ? 'text-accent-dark' : 'text-neutral-muted'}`}>
                          {formatDisplayDate(day)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-50">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 mb-3">
                          <Users className="w-7 h-7 text-primary-400" />
                        </div>
                        <p className="text-neutral-muted">暂无员工数据</p>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-primary-50/30 transition-colors">
                        <td className="px-6 py-3 sticky left-0 bg-white z-10">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-medium text-primary-700 flex-shrink-0">
                              {emp.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-neutral-text truncate">{emp.name}</p>
                              <p className="text-xs text-neutral-muted truncate">{emp.role}</p>
                            </div>
                          </div>
                        </td>
                        {weekDays.map((day) => {
                          const dateStr = formatDate(day);
                          const key = `${emp.id}_${dateStr}`;
                          const schedule = scheduleMap.get(key);
                          const shiftType = schedule?.shiftType;
                          const config = shiftType ? SHIFT_CONFIG[shiftType] : null;
                          const Icon = config?.icon;
                          const isActive = activeCell?.employeeId === emp.id && activeCell?.date === dateStr;
                          const today = isToday(day);
                          const conflict = hasLeaveConflict(emp.id, dateStr);

                          return (
                            <td key={dateStr} className="px-2 py-3 text-center">
                              <div className="relative inline-block">
                                {conflict && !schedule && (
                                  <div className="absolute -top-1 -right-1 z-10">
                                    <div className="w-3 h-3 rounded-full bg-rose-500 flex items-center justify-center border-2 border-white">
                                      <AlertTriangle className="w-1.5 h-1.5 text-white" />
                                    </div>
                                  </div>
                                )}
                                <button
                                  onClick={() =>
                                    setActiveCell(isActive ? null : { employeeId: emp.id, date: dateStr })
                                  }
                                  className={`inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all min-w-[70px] border ${
                                    config
                                      ? `${config.bg} ${config.color}`
                                      : conflict
                                        ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                                        : today
                                          ? 'bg-accent/5 border-accent/20 text-neutral-muted hover:bg-accent/10'
                                          : 'bg-gray-50 border-gray-100 text-neutral-muted hover:bg-primary-50 hover:border-primary-200'
                                  }`}
                                >
                                  {conflict && !config && <AlertTriangle className="w-3 h-3" />}
                                  {Icon && <Icon className="w-3 h-3" />}
                                  {config?.label || (conflict ? '请假' : '未排')}
                                </button>
                                {isActive && (
                                  <CellPopup
                                    schedule={schedule}
                                    employeeId={emp.id}
                                    date={dateStr}
                                    hasConflict={conflict}
                                    onClose={() => setActiveCell(null)}
                                  />
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-primary-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-600" />
                员工筛选
              </h3>
              <button
                onClick={() => setShowFilter((p) => !p)}
                className="text-xs text-primary-600 hover:text-primary-800 font-medium"
              >
                {showFilter ? '收起' : '展开'}
              </button>
            </div>

            {showFilter && (
              <div className="space-y-1.5 mb-4">
                <button
                  onClick={() => setFilterEmployeeIds(new Set())}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filterEmployeeIds.size === 0
                      ? 'bg-primary-100 text-primary-800 font-medium'
                      : 'text-neutral-text hover:bg-primary-50'
                  }`}
                >
                  全部员工
                </button>
                {activeEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => toggleFilter(emp.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      filterEmployeeIds.has(emp.id)
                        ? 'bg-primary-100 text-primary-800 font-medium'
                        : 'text-neutral-text hover:bg-primary-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-medium text-primary-700 flex-shrink-0">
                      {emp.name.charAt(0)}
                    </div>
                    {emp.name}
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-primary-100 pt-4">
              <h4 className="text-sm font-semibold text-primary-800 mb-3">本周班次统计</h4>
              <div className="space-y-2.5">
                {SHIFT_ORDER.map((type) => {
                  const config = SHIFT_CONFIG[type];
                  const Icon = config.icon;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 text-sm ${config.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                      <span className="text-sm font-semibold text-neutral-text">
                        {shiftCountByType[type]}
                      </span>
                    </div>
                  );
                })}
                {unscheduledCount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-sm text-amber-700">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      未排
                    </span>
                    <span className="text-sm font-semibold text-amber-600">{unscheduledCount}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-primary-100 pt-4 mt-4">
              <h4 className="text-sm font-semibold text-primary-800 mb-3">排班图例</h4>
              <div className="grid grid-cols-2 gap-2">
                {SHIFT_ORDER.map((type) => {
                  const config = SHIFT_CONFIG[type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={type}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${config.bg} ${config.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {config.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-serif text-lg font-bold text-primary-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-600" />
              员工概况
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-muted">在岗员工</span>
                <span className="font-semibold text-neutral-text">{activeEmployees.length} 人</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-muted">已排班次</span>
                <span className="font-semibold text-neutral-text">
                  {Object.values(shiftCountByType).reduce((a, b) => a + b, 0) - shiftCountByType.rest} 班
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-muted">休息安排</span>
                <span className="font-semibold text-neutral-text">{shiftCountByType.rest} 人次</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBatchModal && (
        <BatchModal
          weekDays={weekDays}
          filteredEmployees={filteredEmployees.map((e) => ({ id: e.id, name: e.name }))}
          onClose={() => setShowBatchModal(false)}
        />
      )}
    </div>
  );
}
