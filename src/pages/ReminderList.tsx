import { useState } from 'react';
import {
  CalendarCheck,
  Bell,
  Mail,
  MessageSquare,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Plus,
  X,
  PawPrint,
  AlertCircle
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import type { Reminder } from '@/shared/types';

interface NewReminderForm {
  title: string;
  petId: string;
  remindDate: string;
  remindType: 'email' | 'sms' | 'both';
  frequency: 'once' | 'yearly';
}

const initialForm: NewReminderForm = {
  title: '',
  petId: '',
  remindDate: '',
  remindType: 'email',
  frequency: 'yearly'
};

export default function ReminderList() {
  const { reminders, pets, owners, addReminder, updateReminder } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewReminderForm>(initialForm);

  const isUpcoming = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getPetById = (petId: string) => pets.find((p) => p.id === petId);
  const getOwnerById = (ownerId: string) => owners.find((o) => o.id === ownerId);

  const getRemindTypeLabel = (type: string) => {
    switch (type) {
      case 'email':
        return { label: '邮件', icon: Mail, color: 'text-blue-600 bg-blue-50' };
      case 'sms':
        return { label: '短信', icon: MessageSquare, color: 'text-green-600 bg-green-50' };
      case 'both':
        return { label: '邮件+短信', icon: Bell, color: 'text-purple-600 bg-purple-50' };
      default:
        return { label: type, icon: Bell, color: 'text-gray-600 bg-gray-50' };
    }
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.petId || !form.remindDate) return;

    const pet = getPetById(form.petId);
    addReminder({
      petId: form.petId,
      ownerId: pet?.ownerId || '',
      title: form.title,
      remindDate: form.remindDate,
      remindType: form.remindType,
      frequency: form.frequency,
      enabled: true
    });

    setForm(initialForm);
    setShowModal(false);
  };

  const toggleReminder = (reminder: Reminder) => {
    updateReminder(reminder.id, { enabled: !reminder.enabled });
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    const daysA = getDaysUntil(a.remindDate);
    const daysB = getDaysUntil(b.remindDate);
    return daysA - daysB;
  });

  return (
    <div>
      <PageHeader
        title="纪念日提醒"
        description="管理重要日期的提醒设置"
        actions={
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5 mr-1.5" />
            新增提醒
          </button>
        }
      />

      {sortedReminders.length === 0 ? (
        <div className="card text-center py-16">
          <Bell className="w-16 h-16 text-primary-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-text mb-2">暂无提醒设置</h3>
          <p className="text-neutral-muted mb-6">点击右上角按钮添加第一个提醒</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5 mr-1.5" />
            新增提醒
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReminders.map((reminder) => {
            const pet = getPetById(reminder.petId);
            const owner = pet ? getOwnerById(pet.ownerId) : undefined;
            const upcoming = isUpcoming(reminder.remindDate);
            const daysUntil = getDaysUntil(reminder.remindDate);
            const typeInfo = getRemindTypeLabel(reminder.remindType);
            const TypeIcon = typeInfo.icon;

            return (
              <div
                key={reminder.id}
                className={`card relative overflow-hidden transition-all duration-200 ${
                  upcoming && reminder.enabled
                    ? 'border-amber-400 ring-2 ring-amber-200'
                    : ''
                } ${!reminder.enabled ? 'opacity-60' : ''}`}
              >
                {upcoming && reminder.enabled && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white text-xs font-semibold px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {daysUntil === 0 ? '今天' : `${daysUntil}天后`}
                  </div>
                )}

                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        reminder.enabled
                          ? 'bg-gradient-to-br from-amber-100 to-rose-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      <CalendarCheck
                        className={`w-6 h-6 ${
                          reminder.enabled ? 'text-amber-600' : 'text-gray-400'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-neutral-text">
                          {reminder.title}
                        </h3>
                        {!reminder.enabled && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            已禁用
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-muted mb-3">
                        {pet && (
                          <span className="flex items-center gap-1">
                            <PawPrint className="w-4 h-4" />
                            {pet.name}
                          </span>
                        )}
                        {owner && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {owner.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <CalendarCheck className="w-4 h-4" />
                          {reminder.remindDate}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}
                        >
                          <TypeIcon className="w-3.5 h-3.5" />
                          {typeInfo.label}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                          <RefreshCw className="w-3.5 h-3.5" />
                          {reminder.frequency === 'yearly' ? '每年重复' : '一次性'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleReminder(reminder)}
                    className="flex-shrink-0 p-1 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    {reminder.enabled ? (
                      <ToggleRight className="w-10 h-10 text-amber-500" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-primary-100">
              <h2 className="font-serif text-xl font-bold text-neutral-text flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                新增提醒
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
                <label className="label-text">提醒标题 *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="例如：豆豆的周年忌日"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="label-text">关联宠物 *</label>
                <select
                  className="input-field"
                  value={form.petId}
                  onChange={(e) => setForm({ ...form, petId: e.target.value })}
                >
                  <option value="">请选择宠物</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}（{pet.breed}）
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-text flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" />
                  提醒日期 *
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={form.remindDate}
                  onChange={(e) => setForm({ ...form, remindDate: e.target.value })}
                />
              </div>

              <div>
                <label className="label-text mb-3 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  提醒方式
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'email', label: '邮件', icon: Mail },
                    { value: 'sms', label: '短信', icon: MessageSquare },
                    { value: 'both', label: '两者', icon: Bell }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() =>
                        setForm({ ...form, remindType: value as 'email' | 'sms' | 'both' })
                      }
                      className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 flex flex-col items-center gap-1 ${
                        form.remindType === value
                          ? 'bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-md'
                          : 'bg-primary-50 text-neutral-text border border-primary-200 hover:bg-primary-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-text mb-3 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  频率
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'once', label: '一次性' },
                    { value: 'yearly', label: '每年重复' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() =>
                        setForm({ ...form, frequency: value as 'once' | 'yearly' })
                      }
                      className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        form.frequency === value
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                          : 'bg-primary-50 text-neutral-text border border-primary-200 hover:bg-primary-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
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
                disabled={!form.title.trim() || !form.petId || !form.remindDate}
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
