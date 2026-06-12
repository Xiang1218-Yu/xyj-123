import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Flower2, MessageCircle, Send, Crown, MapPin, Calendar, User } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import { MemorialActionTypeLabel, StorageTypeLabel } from '@/shared/types';
import type { MemorialActionType } from '@/shared/types';
import { cn } from '@/lib/utils';

const flowerOptions = [
  { value: '白菊花', label: '白菊花', color: 'text-white', bg: 'bg-amber-50' },
  { value: '白玫瑰', label: '白玫瑰', color: 'text-white', bg: 'bg-pink-50' },
  { value: '百合花', label: '百合花', color: 'text-white', bg: 'bg-yellow-50' },
  { value: '满天星', label: '满天星', color: 'text-white', bg: 'bg-purple-50' },
];

export default function MemorialPage() {
  const { urnId } = useParams<{ urnId: string }>();
  const navigate = useNavigate();

  const urn = useAppStore(state => state.getUrnById(urnId || ''));
  const pet = useAppStore(state => state.getPetById(urn?.petId || ''));
  const memorialRecords = useAppStore(state => state.getMemorialRecordsByUrnId(urnId || ''));
  const addMemorialRecord = useAppStore(state => state.addMemorialRecord);

  const [activeTab, setActiveTab] = useState<'incense' | 'flower' | 'message'>('incense');
  const [showIncenseAnimation, setShowIncenseAnimation] = useState(false);
  const [showFlowerAnimation, setShowFlowerAnimation] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(flowerOptions[0].value);
  const [message, setMessage] = useState('');
  const [visitorName, setVisitorName] = useState('');

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

  const handleIncense = () => {
    if (!urn || !pet) return;
    setShowIncenseAnimation(true);
    addMemorialRecord({
      urnId: urn.id,
      petId: pet.id,
      actionType: 'incense',
      visitorName: visitorName || '匿名访客'
    });
    setTimeout(() => setShowIncenseAnimation(false), 3000);
  };

  const handleFlower = () => {
    if (!urn || !pet) return;
    setShowFlowerAnimation(true);
    addMemorialRecord({
      urnId: urn.id,
      petId: pet.id,
      actionType: 'flower',
      flowerType: selectedFlower,
      visitorName: visitorName || '匿名访客'
    });
    setTimeout(() => setShowFlowerAnimation(false), 3000);
  };

  const handleMessage = () => {
    if (!urn || !pet || !message.trim()) {
      alert('请输入留言内容');
      return;
    }
    addMemorialRecord({
      urnId: urn.id,
      petId: pet.id,
      actionType: 'message',
      content: message.trim(),
      visitorName: visitorName || '匿名访客'
    });
    setMessage('');
  };

  const getActionIcon = (type: MemorialActionType) => {
    switch (type) {
      case 'incense': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'flower': return <Flower2 className="w-4 h-4 text-pink-500" />;
      case 'message': return <MessageCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  if (!urn || !pet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-neutral-muted mb-4">未找到对应的骨灰盒信息</p>
        <button className="btn-primary" onClick={() => navigate('/urns')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回存放区
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          className="flex items-center gap-2 text-neutral-muted hover:text-primary-800 transition-colors mb-4"
          onClick={() => navigate('/urns')}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回存放区</span>
        </button>
        <PageHeader
          title={`${pet.name} 的纪念堂`}
          description="在线祭扫，寄托哀思"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="relative h-64 bg-gradient-to-b from-primary-800/10 to-primary-50 flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-[url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=soft%20gradient%20background%20with%20gentle%20light%20rays%2C%20serene%20and%20peaceful%20atmosphere%2C%20warm%20tones&image_size=landscape_16_9')] bg-cover bg-center" />
              </div>
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto mb-4">
                  <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-primary-800 flex items-center justify-center gap-2">
                  {pet.name}
                  {urn.storageType === 'vip' && (
                    <Crown className="w-5 h-5 text-amber-500" />
                  )}
                </h2>
                <p className="text-neutral-muted text-sm mt-1">{pet.breed} · {pet.age}</p>
                <div className="flex items-center justify-center gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1 text-neutral-muted">
                    <MapPin className="w-4 h-4" />
                    {urn.area} {urn.shelf} {urn.position}
                  </span>
                  <span className="flex items-center gap-1 text-neutral-muted">
                    <Calendar className="w-4 h-4" />
                    {urn.storedDate}
                  </span>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    urn.storageType === 'vip'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-primary-100 text-primary-700'
                  )}>
                    {StorageTypeLabel[urn.storageType]}
                  </span>
                </div>
              </div>

              {showIncenseAnimation && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="animate-bounce">
                    <Flame className="w-20 h-20 text-orange-500 animate-pulse" />
                    <p className="text-orange-600 font-medium mt-2">心香一炷，寄托哀思</p>
                  </div>
                </div>
              )}

              {showFlowerAnimation && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="animate-bounce">
                    <Flower2 className="w-20 h-20 text-pink-500 animate-pulse" />
                    <p className="text-pink-600 font-medium mt-2">献上 {selectedFlower}，表达思念</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-b border-primary-100">
              <div className="flex">
                <button
                  className={cn(
                    'flex-1 py-4 px-6 text-center font-medium transition-colors flex items-center justify-center gap-2',
                    activeTab === 'incense'
                      ? 'text-accent border-b-2 border-accent bg-accent/5'
                      : 'text-neutral-muted hover:text-primary-800'
                  )}
                  onClick={() => setActiveTab('incense')}
                >
                  <Flame className="w-5 h-5" />
                  上香
                </button>
                <button
                  className={cn(
                    'flex-1 py-4 px-6 text-center font-medium transition-colors flex items-center justify-center gap-2',
                    activeTab === 'flower'
                      ? 'text-accent border-b-2 border-accent bg-accent/5'
                      : 'text-neutral-muted hover:text-primary-800'
                  )}
                  onClick={() => setActiveTab('flower')}
                >
                  <Flower2 className="w-5 h-5" />
                  献花
                </button>
                <button
                  className={cn(
                    'flex-1 py-4 px-6 text-center font-medium transition-colors flex items-center justify-center gap-2',
                    activeTab === 'message'
                      ? 'text-accent border-b-2 border-accent bg-accent/5'
                      : 'text-neutral-muted hover:text-primary-800'
                  )}
                  onClick={() => setActiveTab('message')}
                >
                  <MessageCircle className="w-5 h-5" />
                  留言
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="label-text">您的称呼</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="请输入您的称呼（选填）"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                />
              </div>

              {activeTab === 'incense' && (
                <div className="text-center py-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-orange-50 flex items-center justify-center">
                    <Flame className="w-16 h-16 text-orange-500" />
                  </div>
                  <p className="text-neutral-muted mb-6">
                    点击下方按钮，为 {pet.name} 上一炷心香
                  </p>
                  <button
                    className="btn-primary px-8 py-3 text-lg"
                    onClick={handleIncense}
                  >
                    <Flame className="w-5 h-5 mr-2" />
                    敬香
                  </button>
                </div>
              )}

              {activeTab === 'flower' && (
                <div className="space-y-6">
                  <div>
                    <label className="label-text mb-3 block">选择花束</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {flowerOptions.map(flower => (
                        <button
                          key={flower.value}
                          className={cn(
                            'p-4 rounded-lg border-2 transition-all text-center',
                            selectedFlower === flower.value
                              ? 'border-accent bg-accent/5'
                              : 'border-primary-100 hover:border-primary-300'
                          )}
                          onClick={() => setSelectedFlower(flower.value)}
                        >
                          <Flower2 className={cn(
                            'w-8 h-8 mx-auto mb-2',
                            selectedFlower === flower.value ? 'text-accent' : 'text-pink-400'
                          )} />
                          <span className={cn(
                            'text-sm font-medium',
                            selectedFlower === flower.value ? 'text-accent' : 'text-primary-800'
                          )}>
                            {flower.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-center pt-4">
                    <button
                      className="btn-primary px-8 py-3 text-lg"
                      onClick={handleFlower}
                    >
                      <Flower2 className="w-5 h-5 mr-2" />
                      献花
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'message' && (
                <div className="space-y-4">
                  <div>
                    <label className="label-text mb-3 block">写下您想说的话</label>
                    <textarea
                      className="input-field min-h-[120px] resize-none"
                      placeholder={`对 ${pet.name} 说些什么...`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="btn-primary"
                      onClick={handleMessage}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      发送留言
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-serif text-lg font-semibold text-primary-800 mb-4">
              祭扫记录
            </h3>
            {memorialRecords.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-primary-200 mx-auto mb-3" />
                <p className="text-neutral-muted text-sm">暂无祭扫记录</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {memorialRecords.map(record => (
                  <div
                    key={record.id}
                    className="p-3 bg-primary-50/50 rounded-lg border border-primary-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getActionIcon(record.actionType)}
                        <span className="text-sm font-medium text-primary-800">
                          {MemorialActionTypeLabel[record.actionType]}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-muted">
                        {formatDateTime(record.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-muted mb-1">
                      <User className="w-3 h-3" />
                      {record.visitorName}
                    </div>
                    {record.flowerType && (
                      <div className="flex items-center gap-1 text-sm text-pink-600">
                        <Flower2 className="w-3 h-3" />
                        献上 {record.flowerType}
                      </div>
                    )}
                    {record.content && (
                      <p className="text-sm text-primary-700 mt-2 bg-white p-2 rounded">
                        {record.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card bg-gradient-to-br from-primary-800 to-primary-900 text-white">
            <h3 className="font-serif text-lg font-semibold mb-3">宠物信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">名字</span>
                <span className="font-medium">{pet.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">品种</span>
                <span className="font-medium">{pet.breed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">年龄</span>
                <span className="font-medium">{pet.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">性别</span>
                <span className="font-medium">{pet.gender === 'male' ? '公' : '母'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">存放位置</span>
                <span className="font-medium">{urn.area} {urn.shelf} {urn.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">存放类型</span>
                <span className="font-medium flex items-center gap-1">
                  {urn.storageType === 'vip' && <Crown className="w-3 h-3" />}
                  {StorageTypeLabel[urn.storageType]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
