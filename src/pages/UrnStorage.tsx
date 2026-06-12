import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, Calendar, Check, Plus, Eye, X, Edit, Trash2, Search, Crown, Flame, MapPin, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import type { Urn, StorageType } from '@/shared/types';
import { StorageTypeLabel } from '@/shared/types';
import { cn } from '@/lib/utils';

const areas = ['A区', 'B区', 'C区'];
const shelves = ['第1排', '第2排', '第3排', '第4排'];
const positionsPerShelf = 10;

const statusMap: Record<Urn['status'], { label: string; className: string }> = {
  stored: { label: '已存放', className: 'bg-green-100 text-green-700' },
  retrieved: { label: '已取出', className: 'bg-gray-100 text-gray-600' }
};

const storageTypeOptions: { value: StorageType; label: string; description: string }[] = [
  { value: 'normal', label: '普通', description: '标准存放区域' },
  { value: 'vip', label: 'VIP', description: '尊贵独立存放区，含专属祭扫服务' }
];

interface SlotInfo {
  area: string;
  shelf: string;
  position: string;
  occupied: boolean;
  urn?: Urn;
}

export default function UrnStorage() {
  const navigate = useNavigate();
  const urns = useAppStore(state => state.urns);
  const pets = useAppStore(state => state.pets);
  const addUrn = useAppStore(state => state.addUrn);
  const updateUrn = useAppStore(state => state.updateUrn);
  const deleteUrn = useAppStore(state => state.deleteUrn);
  const searchUrnsByPetName = useAppStore(state => state.searchUrnsByPetName);

  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [highlightedUrnId, setHighlightedUrnId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    petId: '',
    storedDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    storageType: 'normal' as StorageType,
  });

  const searchResults = useMemo(() => {
    if (!searchKeyword.trim()) return [];
    return searchUrnsByPetName(searchKeyword.trim());
  }, [searchKeyword, searchUrnsByPetName]);

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet?.name || '未知';
  };

  const getPetPhoto = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet?.photoUrl;
  };

  const getUrnForSlot = (area: string, shelf: string, position: string) => {
    return urns.find(u => u.area === area && u.shelf === shelf && u.position === `${position}号` && u.status === 'stored');
  };

  const generateSlots = (area: string): SlotInfo[][] => {
    return shelves.map(shelf => {
      const shelfSlots: SlotInfo[] = [];
      for (let i = 1; i <= positionsPerShelf; i++) {
        const urn = getUrnForSlot(area, shelf, i.toString());
        shelfSlots.push({
          area,
          shelf,
          position: `${i}号`,
          occupied: !!urn,
          urn
        });
      }
      return shelfSlots;
    });
  };

  const handleSlotClick = (slot: SlotInfo) => {
    setSelectedSlot(slot);
    setShowAddForm(false);
  };

  const closeModal = () => {
    setSelectedSlot(null);
    setShowAddForm(false);
  };

  const handleAddUrn = () => {
    if (!formData.petId || !formData.storedDate) {
      alert('请填写完整信息');
      return;
    }
    if (selectedSlot) {
      addUrn({
        petId: formData.petId,
        area: selectedSlot.area,
        shelf: selectedSlot.shelf,
        position: selectedSlot.position,
        storedDate: formData.storedDate,
        expiryDate: formData.expiryDate || undefined,
        status: 'stored',
        storageType: formData.storageType
      });
      setFormData({
        petId: '',
        storedDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        storageType: 'normal',
      });
      setShowAddForm(false);
      closeModal();
    }
  };

  const handleRetrieve = (urnId: string) => {
    if (confirm('确定要将此骨灰盒取出吗？')) {
      updateUrn(urnId, { status: 'retrieved' });
      closeModal();
    }
  };

  const handleDelete = (urnId: string) => {
    if (confirm('确定要删除这条存放记录吗？')) {
      deleteUrn(urnId);
      closeModal();
    }
  };

  const handleSearchResultClick = (urn: Urn) => {
    setHighlightedUrnId(urn.id);
    setSearchKeyword('');
    const slot: SlotInfo = {
      area: urn.area,
      shelf: urn.shelf,
      position: urn.position,
      occupied: true,
      urn
    };
    setSelectedSlot(slot);
    setTimeout(() => setHighlightedUrnId(null), 3000);
  };

  const storedUrns = urns.filter(u => u.status === 'stored');

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return dateStr;
  };

  const isSlotHighlighted = (slot: SlotInfo) => {
    return highlightedUrnId && slot.urn?.id === highlightedUrnId;
  };

  return (
    <div>
      <PageHeader
        title="骨灰盒存放"
        description="骨灰盒位置管理与存取记录"
      />

      <div className="mb-6">
        <div className="card p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 w-full">
              <label className="label-text mb-2 block">
                <Search className="w-4 h-4 inline mr-2" />
                搜索宠物骨灰存放位置
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="输入宠物名字进行搜索..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
              </div>
            </div>
            {searchResults.length > 0 && (
              <div className="w-full md:w-auto md:min-w-[300px]">
                <label className="label-text mb-2 block">搜索结果</label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {searchResults.map(urn => {
                    const pet = pets.find(p => p.id === urn.petId);
                    return (
                      <button
                        key={urn.id}
                        className="w-full p-3 rounded-lg border border-primary-100 hover:border-accent hover:bg-accent/5 transition-all flex items-center gap-3 text-left"
                        onClick={() => handleSearchResultClick(urn)}
                      >
                        {pet?.photoUrl && (
                          <img src={pet.photoUrl} alt={pet.name} className="w-10 h-10 rounded-full object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-primary-800">{pet?.name}</span>
                            {urn.storageType === 'vip' && (
                              <Crown className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-neutral-muted">
                            <MapPin className="w-3 h-3" />
                            {urn.area} {urn.shelf} {urn.position}
                          </div>
                        </div>
                        <Eye className="w-4 h-4 text-accent" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {searchKeyword.trim() && searchResults.length === 0 && (
              <div className="w-full md:w-auto md:min-w-[300px]">
                <label className="label-text mb-2 block">搜索结果</label>
                <div className="p-4 rounded-lg border border-primary-100 text-center">
                  <AlertCircle className="w-8 h-8 text-primary-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-muted">未找到匹配的宠物</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-serif text-xl font-semibold text-primary-800 mb-4">
          <Archive className="w-5 h-5 inline mr-2 text-accent" />
          存放区域视图
        </h2>
        <div className="space-y-8">
          {areas.map(area => (
            <div key={area} className="card">
              <h3 className="font-semibold text-lg text-primary-800 mb-4">{area}</h3>
              <div className="space-y-3">
                {generateSlots(area).map((shelfSlots, shelfIndex) => (
                  <div key={shelves[shelfIndex]} className="flex items-center gap-3">
                    <span className="w-16 text-sm text-neutral-muted font-medium">
                      {shelves[shelfIndex]}
                    </span>
                    <div className="flex-1 grid grid-cols-10 gap-2">
                      {shelfSlots.map((slot, posIndex) => (
                        <button
                          key={posIndex}
                          onClick={() => handleSlotClick(slot)}
                          className={cn(
                            'aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all duration-200 relative',
                            slot.occupied
                              ? slot.urn?.storageType === 'vip'
                                ? 'bg-amber-100/50 border-amber-400 text-primary-800 hover:bg-amber-100 hover:shadow-md'
                                : 'bg-accent/20 border-accent text-primary-800 hover:bg-accent/30 hover:shadow-md'
                              : 'bg-white border-primary-200 text-neutral-muted hover:border-primary-400 hover:bg-primary-50',
                            isSlotHighlighted(slot) && 'ring-4 ring-accent ring-opacity-75 animate-pulse'
                          )}
                          title={slot.occupied ? `已占用: ${getPetName(slot.urn!.petId)} (${StorageTypeLabel[slot.urn!.storageType]})` : `空闲: ${slot.position}`}
                        >
                          {slot.occupied ? (
                            <>
                              <Archive className="w-5 h-5 text-accent" />
                              {slot.urn?.storageType === 'vip' && (
                                <Crown className="w-3 h-3 text-amber-500 absolute top-1 right-1" />
                              )}
                            </>
                          ) : (
                            <span>{posIndex + 1}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-primary-100 flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accent/20 border-2 border-accent" />
                  <span className="text-neutral-muted">普通-已占用</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-100/50 border-2 border-amber-400" />
                  <span className="text-neutral-muted">VIP-已占用</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white border-2 border-primary-200" />
                  <span className="text-neutral-muted">空闲</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold text-primary-800 mb-4">
          <Check className="w-5 h-5 inline mr-2 text-accent" />
          已存放骨灰盒
        </h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-100">
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    宠物名
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    类型
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    位置
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    存放日期
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    到期日期
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    状态
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-neutral-muted">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {storedUrns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 mb-3">
                        <Archive className="w-7 h-7 text-primary-400" />
                      </div>
                      <p className="text-neutral-muted">暂无存放记录</p>
                    </td>
                  </tr>
                ) : (
                  storedUrns.map(urn => (
                    <tr
                      key={urn.id}
                      className={cn(
                        'border-b border-primary-50 hover:bg-primary-50/30 transition-colors',
                        highlightedUrnId === urn.id && 'bg-accent/10'
                      )}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            {getPetPhoto(urn.petId) && (
                              <img src={getPetPhoto(urn.petId)!} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <Archive className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-primary-800">
                            {getPetName(urn.petId)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                          urn.storageType === 'vip'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-primary-100 text-primary-700'
                        )}>
                          {urn.storageType === 'vip' && <Crown className="w-3 h-3" />}
                          {StorageTypeLabel[urn.storageType]}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-neutral-text">
                          {urn.area} - {urn.shelf} - {urn.position}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-400" />
                          <span className="text-sm text-neutral-text">{urn.storedDate}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-400" />
                          <span className="text-sm text-neutral-text">{urn.expiryDate || '-'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('status-badge', statusMap[urn.status].className)}>
                          {statusMap[urn.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors"
                            onClick={() => navigate(`/pets/${urn.petId}`)}
                            title="查看宠物详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors"
                            onClick={() => navigate(`/memorial/${urn.id}`)}
                            title="在线祭扫"
                          >
                            <Flame className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                            onClick={() => handleRetrieve(urn.id)}
                            title="取出"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            onClick={() => handleDelete(urn.id)}
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
      </div>

      {selectedSlot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-semibold text-primary-800">
                {selectedSlot.area} - {selectedSlot.shelf} - {selectedSlot.position}
              </h3>
              <button
                className="p-2 rounded-lg text-neutral-muted hover:bg-primary-100 transition-colors"
                onClick={closeModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {selectedSlot.occupied && selectedSlot.urn ? (
              <div className="space-y-4">
                <div className="p-4 bg-primary-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    {getPetPhoto(selectedSlot.urn.petId) && (
                      <img
                        src={getPetPhoto(selectedSlot.urn.petId)!}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Archive className="w-5 h-5 text-accent" />
                        <span className="font-medium text-primary-800">
                          {getPetName(selectedSlot.urn.petId)}
                        </span>
                        {selectedSlot.urn.storageType === 'vip' && (
                          <Crown className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                        selectedSlot.urn.storageType === 'vip'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-primary-100 text-primary-700'
                      )}>
                        {StorageTypeLabel[selectedSlot.urn.storageType]}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-neutral-muted space-y-1">
                    <p>存放日期：{formatDate(selectedSlot.urn.storedDate)}</p>
                    <p>到期日期：{formatDate(selectedSlot.urn.expiryDate || '')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="btn-primary flex-1"
                    onClick={() => navigate(`/pets/${selectedSlot.urn!.petId}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    查看详情
                  </button>
                  <button
                    className="btn-accent"
                    onClick={() => navigate(`/memorial/${selectedSlot.urn!.id}`)}
                  >
                    <Flame className="w-4 h-4 mr-2" />
                    祭扫
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => handleRetrieve(selectedSlot.urn!.id)}
                  >
                    取出
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {!showAddForm ? (
                  <>
                    <p className="text-neutral-muted">该位置当前空闲</p>
                    <button
                      className="btn-primary w-full"
                      onClick={() => setShowAddForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      登记存放
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="label-text">选择宠物 *</label>
                      <select
                        className="input-field"
                        value={formData.petId}
                        onChange={(e) => setFormData(prev => ({ ...prev, petId: e.target.value }))}
                      >
                        <option value="">请选择宠物</option>
                        {pets.map(pet => (
                          <option key={pet.id} value={pet.id}>
                            {pet.name}（{pet.breed}）
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label-text mb-3 block">存放类型 *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {storageTypeOptions.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            className={cn(
                              'p-3 rounded-lg border-2 transition-all text-left',
                              formData.storageType === option.value
                                ? option.value === 'vip'
                                  ? 'border-amber-400 bg-amber-50'
                                  : 'border-accent bg-accent/5'
                                : 'border-primary-100 hover:border-primary-300'
                            )}
                            onClick={() => setFormData(prev => ({ ...prev, storageType: option.value }))}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {option.value === 'vip' && <Crown className={cn('w-4 h-4', formData.storageType === option.value ? 'text-amber-500' : 'text-primary-400')} />}
                              <span className={cn(
                                'font-medium',
                                formData.storageType === option.value
                                  ? option.value === 'vip' ? 'text-amber-700' : 'text-accent'
                                  : 'text-primary-800'
                              )}>
                                {option.label}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-muted">{option.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="label-text">存放日期 *</label>
                      <input
                        type="date"
                        className="input-field"
                        value={formData.storedDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, storedDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="label-text">到期日期</label>
                      <input
                        type="date"
                        className="input-field"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        className="btn-primary flex-1"
                        onClick={handleAddUrn}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        确认登记
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => setShowAddForm(false)}
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
