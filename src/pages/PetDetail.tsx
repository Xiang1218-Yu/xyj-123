import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  PawPrint,
  Calendar,
  Flame,
  Box,
  Bell,
  Info
} from 'lucide-react';
import { useAppStore } from '@/store';

type TabType = 'basic' | 'ceremony' | 'cremation' | 'urn' | 'reminder';

export default function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPetById, getOwnerById, ceremonies, cremations, urns, reminders, deletePet } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('basic');

  const pet = id ? getPetById(id) : undefined;
  const owner = pet ? getOwnerById(pet.ownerId) : undefined;

  const petCeremonies = pet ? ceremonies.filter((c) => c.petId === pet.id) : [];
  const petCremations = pet ? cremations.filter((c) => c.petId === pet.id) : [];
  const petUrns = pet ? urns.filter((u) => u.petId === pet.id) : [];
  const petReminders = pet ? reminders.filter((r) => r.petId === pet.id) : [];

  const tabs: { key: TabType; label: string; icon: typeof Info }[] = [
    { key: 'basic', label: '基本信息', icon: Info },
    { key: 'ceremony', label: '仪式记录', icon: Calendar },
    { key: 'cremation', label: '火化记录', icon: Flame },
    { key: 'urn', label: '骨灰存放', icon: Box },
    { key: 'reminder', label: '纪念日提醒', icon: Bell }
  ];

  const handleDelete = () => {
    if (pet && window.confirm(`确定要删除宠物"${pet.name}"的档案吗？此操作不可撤销。`)) {
      deletePet(pet.id);
      navigate('/pets');
    }
  };

  if (!pet) {
    return (
      <div className="card text-center py-16">
        <PawPrint className="w-16 h-16 mx-auto text-primary-300 mb-4" />
        <p className="text-neutral-muted text-lg mb-4">未找到该宠物档案</p>
        <Link to="/pets" className="btn-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-serif text-lg font-semibold text-primary-900 mb-4 flex items-center">
                  <PawPrint className="w-5 h-5 mr-2 text-primary-600" />
                  宠物信息
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-primary-100">
                    <span className="text-neutral-muted">姓名</span>
                    <span className="font-medium text-neutral-text">{pet.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-100">
                    <span className="text-neutral-muted">品种</span>
                    <span className="font-medium text-neutral-text">{pet.breed}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-100">
                    <span className="text-neutral-muted">年龄</span>
                    <span className="font-medium text-neutral-text">{pet.age}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-100">
                    <span className="text-neutral-muted">性别</span>
                    <span className="font-medium text-neutral-text">
                      {pet.gender === 'male' ? '公' : '母'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-muted">建档时间</span>
                    <span className="font-medium text-neutral-text">{formatDateTime(pet.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="font-serif text-lg font-semibold text-primary-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  主人信息
                </h3>
                {owner ? (
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-primary-100">
                      <span className="text-neutral-muted">姓名</span>
                      <span className="font-medium text-neutral-text">{owner.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-primary-100">
                      <span className="text-neutral-muted flex items-center">
                        <Phone className="w-4 h-4 mr-1.5" />电话
                      </span>
                      <span className="font-medium text-neutral-text">{owner.phone}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-primary-100">
                      <span className="text-neutral-muted flex items-center">
                        <Mail className="w-4 h-4 mr-1.5" />邮箱
                      </span>
                      <span className="font-medium text-neutral-text">{owner.email}</span>
                    </div>
                    {owner.address && (
                      <div className="flex justify-between py-2">
                        <span className="text-neutral-muted">地址</span>
                        <span className="font-medium text-neutral-text">{owner.address}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-neutral-muted">暂无主人信息</p>
                )}
              </div>
            </div>

            {pet.notes && (
              <div className="card">
                <h3 className="font-serif text-lg font-semibold text-primary-900 mb-4">备注</h3>
                <p className="text-neutral-text leading-relaxed">{pet.notes}</p>
              </div>
            )}
          </div>
        );

      case 'ceremony':
        return (
          <div className="space-y-4">
            {petCeremonies.length === 0 ? (
              <div className="card text-center py-12">
                <Calendar className="w-12 h-12 mx-auto text-primary-300 mb-3" />
                <p className="text-neutral-muted">暂无仪式记录</p>
              </div>
            ) : (
              petCeremonies.map((ceremony) => (
                <div key={ceremony.id} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-primary-900">{ceremony.location}</h4>
                    <span className="status-badge bg-primary-100 text-primary-800">
                      {ceremony.status === 'pending' && '待举行'}
                      {ceremony.status === 'in-progress' && '进行中'}
                      {ceremony.status === 'completed' && '已完成'}
                      {ceremony.status === 'cancelled' && '已取消'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-muted">仪式时间：</span>
                      <span className="text-neutral-text">{formatDateTime(ceremony.ceremonyTime)}</span>
                    </div>
                    <div>
                      <span className="text-neutral-muted">参与人员：</span>
                      <span className="text-neutral-text">{ceremony.participants}</span>
                    </div>
                  </div>
                  {ceremony.notes && (
                    <p className="mt-3 text-sm text-neutral-muted pt-3 border-t border-primary-100">
                      {ceremony.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        );

      case 'cremation':
        return (
          <div className="space-y-4">
            {petCremations.length === 0 ? (
              <div className="card text-center py-12">
                <Flame className="w-12 h-12 mx-auto text-primary-300 mb-3" />
                <p className="text-neutral-muted">暂无火化记录</p>
              </div>
            ) : (
              petCremations.map((cremation) => (
                <div key={cremation.id} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-primary-900">火化炉 {cremation.furnaceId}</h4>
                    <span className="status-badge bg-primary-100 text-primary-800">
                      {cremation.status === 'pending' && '待火化'}
                      {cremation.status === 'in-progress' && '火化中'}
                      {cremation.status === 'completed' && '已完成'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-muted">火化时间：</span>
                      <span className="text-neutral-text">{formatDateTime(cremation.cremationTime)}</span>
                    </div>
                    {cremation.operator && (
                      <div>
                        <span className="text-neutral-muted">操作员：</span>
                        <span className="text-neutral-text">{cremation.operator}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'urn':
        return (
          <div className="space-y-4">
            {petUrns.length === 0 ? (
              <div className="card text-center py-12">
                <Box className="w-12 h-12 mx-auto text-primary-300 mb-3" />
                <p className="text-neutral-muted">暂无骨灰存放记录</p>
              </div>
            ) : (
              petUrns.map((urn) => (
                <div key={urn.id} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-primary-900">
                      {urn.area} · {urn.shelf} · {urn.position}
                    </h4>
                    <span className="status-badge bg-primary-100 text-primary-800">
                      {urn.status === 'stored' ? '存放中' : '已取出'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-muted">存放日期：</span>
                      <span className="text-neutral-text">{formatDate(urn.storedDate)}</span>
                    </div>
                    {urn.expiryDate && (
                      <div>
                        <span className="text-neutral-muted">到期日期：</span>
                        <span className="text-neutral-text">{formatDate(urn.expiryDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'reminder':
        return (
          <div className="space-y-4">
            {petReminders.length === 0 ? (
              <div className="card text-center py-12">
                <Bell className="w-12 h-12 mx-auto text-primary-300 mb-3" />
                <p className="text-neutral-muted">暂无纪念日提醒</p>
              </div>
            ) : (
              petReminders.map((reminder) => (
                <div key={reminder.id} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-primary-900">{reminder.title}</h4>
                    <span className={`status-badge ${reminder.enabled ? 'bg-accent text-primary-900' : 'bg-neutral-200 text-neutral-muted'}`}>
                      {reminder.enabled ? '已启用' : '已停用'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-muted">提醒日期：</span>
                      <span className="text-neutral-text">{formatDate(reminder.remindDate)}</span>
                    </div>
                    <div>
                      <span className="text-neutral-muted">重复方式：</span>
                      <span className="text-neutral-text">
                        {reminder.frequency === 'once' ? '仅一次' : '每年'}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-muted">提醒方式：</span>
                      <span className="text-neutral-text">
                        {reminder.remindType === 'email' && '邮件'}
                        {reminder.remindType === 'sms' && '短信'}
                        {reminder.remindType === 'both' && '邮件+短信'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link to="/pets" className="btn-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Link>
        <div className="flex items-center gap-3">
          <Link to={`/pets/${pet.id}/edit`} className="btn-secondary">
            <Edit className="w-4 h-4 mr-2" />
            编辑
          </Link>
          <button onClick={handleDelete} className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 font-medium transition-all duration-200 hover:bg-red-100 active:scale-95">
            <Trash2 className="w-4 h-4 mr-2" />
            删除
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-primary-100 to-accent-light p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
            <div className="text-center md:text-left">
              <h1 className="font-serif text-3xl font-bold text-primary-900 mb-2">
                {pet.name}
              </h1>
              <p className="text-lg text-primary-700 mb-2">{pet.breed}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-neutral-text">
                <span>{pet.age}</span>
                <span className="w-1 h-1 bg-primary-300 rounded-full"></span>
                <span>{pet.gender === 'male' ? '公' : '母'}</span>
                {owner && (
                  <>
                    <span className="w-1 h-1 bg-primary-300 rounded-full"></span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {owner.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-primary-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-primary-800 text-primary-900'
                  : 'border-transparent text-neutral-muted hover:text-primary-700 hover:border-primary-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {renderContent()}
    </div>
  );
}
