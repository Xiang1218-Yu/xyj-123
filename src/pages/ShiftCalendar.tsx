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
  onClose: () => void;
}

function CellPopup({ schedule, employeeId, date, onClose }: CellPopupProps) {
  const { addShiftSchedule, updateShiftSchedule, deleteShiftSchedule } = useAppStore();
  const ref = useRef<HTMLDivElement>(null);

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
  };

  return (
    <div
      ref={ref}
      className="absolute z-30 top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-xl shadow-card-hover border border-neutral-border p-1.5 min-w-[120px]"
    >
      {SHIFT_ORDER.map((type) => {
        const config = SHIFT_CONFIG[type];
        const Icon = config.icon;
        const isActive = schedule?.shiftType === type;
        return (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
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

export default function ShiftCalendar() {
  const { employees, shiftSchedules } = useAppStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeCell, setActiveCell] = useState<{ employeeId: string; date: string } | null>(null);
  const [filterEmployeeIds, setFilterEmployeeIds] = useState<Set<string>>(new Set());
  const [showFilter, setShowFilter] = useState(false);

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="排班日历配置"
        description="管理员工每周排班，点击单元格修改班次"
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

                          return (
                            <td key={dateStr} className="px-2 py-3 text-center">
                              <div className="relative inline-block">
                                <button
                                  onClick={() =>
                                    setActiveCell(isActive ? null : { employeeId: emp.id, date: dateStr })
                                  }
                                  className={`inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all min-w-[70px] border ${
                                    config
                                      ? `${config.bg} ${config.color}`
                                      : today
                                        ? 'bg-accent/5 border-accent/20 text-neutral-muted hover:bg-accent/10'
                                        : 'bg-gray-50 border-gray-100 text-neutral-muted hover:bg-primary-50 hover:border-primary-200'
                                  }`}
                                >
                                  {Icon && <Icon className="w-3 h-3" />}
                                  {config?.label || '未排'}
                                </button>
                                {isActive && (
                                  <CellPopup
                                    schedule={schedule}
                                    employeeId={emp.id}
                                    date={dateStr}
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
    </div>
  );
}
