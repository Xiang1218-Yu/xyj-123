import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  UserCheck,
  UserX,
  Phone,
  Briefcase,
  Calendar,
  FileText,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import type { Employee } from '@/shared/types';
import { cn } from '@/lib/utils';

const roleMap: Record<Employee['role'], string> = {
  'ceremony-host': '仪式主持',
  'cremation-operator': '火化师',
  receptionist: '前台接待',
  'storage-manager': '存放管理',
  driver: '司机',
  manager: '经理',
};

const statusMap: Record<Employee['status'], { label: string; className: string }> = {
  active: { label: '在职', className: 'bg-green-100 text-green-700' },
  inactive: { label: '离职', className: 'bg-gray-100 text-gray-600' },
};

const roleOptions: { value: Employee['role']; label: string }[] = [
  { value: 'ceremony-host', label: '仪式主持' },
  { value: 'cremation-operator', label: '火化师' },
  { value: 'receptionist', label: '前台接待' },
  { value: 'storage-manager', label: '存放管理' },
  { value: 'driver', label: '司机' },
  { value: 'manager', label: '经理' },
];

const statusOptions: { value: Employee['status']; label: string }[] = [
  { value: 'active', label: '在职' },
  { value: 'inactive', label: '离职' },
];

interface FormData {
  name: string;
  phone: string;
  role: Employee['role'];
  status: Employee['status'];
  hireDate: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  role?: string;
  hireDate?: string;
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  role: 'receptionist',
  status: 'active',
  hireDate: new Date().toISOString().split('T')[0],
  notes: '',
};

export default function EmployeeList() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const activeCount = employees.filter((e) => e.status === 'active').length;
  const inactiveCount = employees.filter((e) => e.status === 'inactive').length;

  const filteredEmployees = employees.filter((emp) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(query) ||
      emp.phone.includes(query) ||
      roleMap[emp.role].includes(query)
    );
  });

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingId(emp.id);
    setFormData({
      name: emp.name,
      phone: emp.phone,
      role: emp.role,
      status: emp.status,
      hireDate: emp.hireDate,
      notes: emp.notes ?? '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormErrors({});
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FormErrors];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = '请输入员工姓名';
    if (!formData.phone.trim()) {
      errors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone.trim())) {
      errors.phone = '请输入有效的手机号';
    }
    if (!formData.role) errors.role = '请选择职位';
    if (!formData.hireDate) errors.hireDate = '请选择入职日期';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      status: formData.status,
      hireDate: formData.hireDate,
      notes: formData.notes.trim() || undefined,
    };

    if (editingId) {
      updateEmployee(editingId, data);
    } else {
      addEmployee(data);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    deleteEmployee(id);
    setDeleteConfirmId(null);
  };

  return (
    <div>
      <PageHeader
        title="员工信息维护"
        description="管理所有员工的基本信息"
        actions={
          <button className="btn-primary" onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-2" />
            新增员工
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">员工总数</p>
              <p className="text-3xl font-bold text-primary-800 font-serif">{employees.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">在职人数</p>
              <p className="text-3xl font-bold text-green-700 font-serif">{activeCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-muted mb-1">离职人数</p>
              <p className="text-3xl font-bold text-gray-500 font-serif">{inactiveCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <UserX className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
          <input
            type="text"
            placeholder="搜索姓名、手机号或职位..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-100">
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">姓名</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">手机号</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">职位</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">状态</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">入职日期</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">备注</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-neutral-muted">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 mb-3">
                      <Users className="w-7 h-7 text-primary-400" />
                    </div>
                    <p className="text-neutral-muted">暂无员工记录</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-primary-50 hover:bg-primary-50/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-primary-900">{emp.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-neutral-text">{emp.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-neutral-text">{roleMap[emp.role]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn('status-badge', statusMap[emp.status].className)}>
                        {statusMap[emp.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-neutral-text">{emp.hireDate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-neutral-muted max-w-[200px] truncate block">
                        {emp.notes || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors"
                          onClick={() => openEditModal(emp)}
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          onClick={() => setDeleteConfirmId(emp.id)}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary-100">
              <h3 className="font-serif text-lg font-semibold text-primary-900">
                {editingId ? '编辑员工' : '新增员工'}
              </h3>
              <button
                className="p-1.5 rounded-lg text-neutral-muted hover:bg-primary-50 transition-colors"
                onClick={closeModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="label-text">姓名 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="请输入员工姓名"
                    className={cn(
                      'input-field',
                      formErrors.name && 'border-red-400 focus:ring-red-300'
                    )}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="label-text">手机号 *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="请输入手机号"
                    className={cn(
                      'input-field',
                      formErrors.phone && 'border-red-400 focus:ring-red-300'
                    )}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="label-text">职位 *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className={cn(
                      'input-field',
                      formErrors.role && 'border-red-400 focus:ring-red-300'
                    )}
                  >
                    {roleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.role && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.role}</p>
                  )}
                </div>
                <div>
                  <label className="label-text">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="input-field"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-text">入职日期 *</label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => handleChange('hireDate', e.target.value)}
                    className={cn(
                      'input-field',
                      formErrors.hireDate && 'border-red-400 focus:ring-red-300'
                    )}
                  />
                  {formErrors.hireDate && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.hireDate}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="label-text flex items-center">
                    <FileText className="w-4 h-4 mr-1.5 text-primary-400" />
                    备注
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="选填备注信息..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </form>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-primary-100">
              <button className="btn-secondary" onClick={closeModal}>
                取消
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                {editingId ? '保存修改' : '添加员工'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 animate-scale-in">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-primary-900 mb-2">
                确认删除
              </h3>
              <p className="text-neutral-muted text-sm mb-6">
                确定要删除该员工吗？此操作不可撤销，相关排班、请假和考勤记录也将被删除。
              </p>
              <div className="flex items-center justify-center gap-3">
                <button className="btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                  取消
                </button>
                <button
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-red-500 text-white font-medium transition-all duration-200 hover:bg-red-600 active:scale-95"
                  onClick={() => handleDelete(deleteConfirmId)}
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
