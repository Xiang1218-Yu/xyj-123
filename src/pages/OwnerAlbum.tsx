import { useState, useRef } from 'react';
import {
  PawPrint,
  User,
  Phone,
  Upload,
  Image as ImageIcon,
  Calendar,
  Save,
  X,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Images,
  ArrowRight,
  Plus,
  Trash2,
  Edit3,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { compressImage } from '@/lib/imageUtils';
import type { Photo } from '@/shared/types';

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export default function OwnerAlbum() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    owners,
    pets,
    albums,
    photos,
    addOwner,
    addPet,
    addAlbum,
    addPhoto,
    updatePhoto,
    deletePhoto,
  } = useAppStore();

  const [step, setStep] = useState<'auth' | 'albums' | 'detail'>('auth');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [currentOwnerId, setCurrentOwnerId] = useState<string | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumPetId, setNewAlbumPetId] = useState('');
  const [newAlbumPetName, setNewAlbumPetName] = useState('');
  const [newAlbumPetBreed, setNewAlbumPetBreed] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');

  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoNote, setNewPhotoNote] = useState('');
  const [newPhotoTakenAt, setNewPhotoTakenAt] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [editTakenAt, setEditTakenAt] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleVerifyPhone = () => {
    if (!phone.trim()) {
      setPhoneError('请输入手机号');
      return;
    }
    if (!validatePhone(phone)) {
      setPhoneError('请输入正确的11位手机号码');
      return;
    }
    setPhoneError('');

    let owner = owners.find((o) => o.phone === phone);
    if (!owner) {
      if (!ownerName.trim()) {
        setPhoneError('该手机号未注册，请输入您的姓名完成注册');
        return;
      }
      owner = addOwner({
        name: ownerName.trim(),
        phone: phone.trim(),
        email: '',
      });
    }
    setCurrentOwnerId(owner.id);
    setStep('albums');
  };

  const handleCreateAlbum = () => {
    if (!currentOwnerId || !newAlbumTitle.trim()) return;

    let petId = newAlbumPetId;
    if (!petId && newAlbumPetName.trim()) {
      const newPet = addPet({
        name: newAlbumPetName.trim(),
        breed: newAlbumPetBreed.trim() || '未知品种',
        age: '',
        gender: 'male',
        photoUrl: '',
        ownerId: currentOwnerId,
        createdAt: new Date().toISOString(),
      });
      petId = newPet.id;
    }

    if (petId) {
      addAlbum({
        title: newAlbumTitle.trim(),
        description: newAlbumDescription.trim() || undefined,
        petId,
        ownerId: currentOwnerId,
      });
    }

    setIsCreatingAlbum(false);
    setNewAlbumTitle('');
    setNewAlbumPetId('');
    setNewAlbumPetName('');
    setNewAlbumPetBreed('');
    setNewAlbumDescription('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressed = await compressImage(file, 1280, 720, 0.75);
      setNewPhotoUrl(compressed);
      setIsAddingPhoto(true);
    } catch (error) {
      console.error('图片处理失败:', error);
      alert('图片处理失败，请重试');
    } finally {
      setIsUploading(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddPhoto = () => {
    if (!selectedAlbumId || !newPhotoUrl.trim()) return;

    addPhoto({
      albumId: selectedAlbumId,
      url: newPhotoUrl.trim(),
      note: newPhotoNote.trim() || undefined,
      takenAt: newPhotoTakenAt || undefined,
    });

    setIsAddingPhoto(false);
    setNewPhotoUrl('');
    setNewPhotoNote('');
    setNewPhotoTakenAt('');
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const startEditPhoto = (photo: Photo) => {
    setEditingPhotoId(photo.id);
    setEditNote(photo.note ?? '');
    setEditTakenAt(photo.takenAt ?? '');
  };

  const saveEditPhoto = (photoId: string) => {
    updatePhoto(photoId, {
      note: editNote.trim() || undefined,
      takenAt: editTakenAt || undefined,
    });
    setEditingPhotoId(null);
  };

  const handleDeletePhoto = (photoId: string) => {
    deletePhoto(photoId);
    setDeleteConfirmId(null);
  };

  const ownerAlbums = currentOwnerId ? albums.filter((a) => a.ownerId === currentOwnerId) : [];
  const ownerPets = currentOwnerId ? pets.filter((p) => p.ownerId === currentOwnerId) : [];
  const currentAlbum = selectedAlbumId ? albums.find((a) => a.id === selectedAlbumId) : null;
  const currentPhotos = selectedAlbumId
    ? photos
        .filter((p) => p.albumId === selectedAlbumId)
        .sort((a, b) => {
          const dateA = a.takenAt ?? a.uploadedAt;
          const dateB = b.takenAt ?? b.uploadedAt;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
    : [];
  const currentAlbumPet = currentAlbum ? pets.find((p) => p.id === currentAlbum.petId) : null;

  if (step === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-rose-400 rounded-3xl mb-5 shadow-lg">
              <Images className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-neutral-text mb-2">
              宠物纪念相册
            </h1>
            <p className="text-neutral-muted">
              上传照片，珍藏与爱宠的美好回忆
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-7">
            <h2 className="font-serif text-xl font-bold text-neutral-text mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-600" />
              手机号验证
            </h2>

            <div className="space-y-4">
              <div>
                <label className="label-text flex items-center gap-1">
                  <Phone className="w-4 h-4 text-primary-400" />
                  手机号码
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError('');
                  }}
                  placeholder="请输入您的手机号"
                  className={`input-field ${phoneError ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
                {phoneError && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {phoneError}
                  </p>
                )}
              </div>

              {!owners.find((o) => o.phone === phone) && (
                <div>
                  <label className="label-text flex items-center gap-1">
                    <User className="w-4 h-4 text-primary-400" />
                    您的姓名
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="首次使用请输入您的姓名"
                    className="input-field"
                  />
                </div>
              )}

              <button
                onClick={handleVerifyPhone}
                className="w-full btn-primary py-3 text-base"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                进入我的相册
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'albums') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 pb-8">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <button
              onClick={() => {
                setStep('auth');
                setCurrentOwnerId(null);
              }}
              className="p-2 -ml-2 text-neutral-muted hover:text-neutral-text transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-serif text-xl font-bold text-neutral-text">
                我的纪念相册
              </h1>
              <p className="text-xs text-neutral-muted">
                共 {ownerAlbums.length} 个相册
              </p>
            </div>
            <button
              onClick={() => setIsCreatingAlbum(true)}
              className="btn-primary text-sm py-2 px-3"
            >
              <Plus className="w-4 h-4 mr-1" />
              新建相册
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 pt-5">
          {isCreatingAlbum && (
            <div className="bg-white rounded-2xl shadow-lg p-5 mb-5 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-neutral-text">
                  新建纪念相册
                </h3>
                <button
                  onClick={() => setIsCreatingAlbum(false)}
                  className="p-1.5 text-neutral-muted hover:text-neutral-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label-text">相册名称 *</label>
                  <input
                    type="text"
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                    placeholder="例如：豆豆的美好回忆"
                    className="input-field"
                  />
                </div>

                {ownerPets.length > 0 ? (
                  <div>
                    <label className="label-text flex items-center gap-1">
                      <PawPrint className="w-4 h-4 text-primary-400" />
                      选择宠物
                    </label>
                    <select
                      value={newAlbumPetId}
                      onChange={(e) => setNewAlbumPetId(e.target.value)}
                      className="input-field"
                    >
                      <option value="">-- 选择已有宠物 --</option>
                      {ownerPets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name} ({pet.breed})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {!newAlbumPetId && (
                  <>
                    <div>
                      <label className="label-text flex items-center gap-1">
                        <PawPrint className="w-4 h-4 text-primary-400" />
                        或添加新宠物 - 名字
                      </label>
                      <input
                        type="text"
                        value={newAlbumPetName}
                        onChange={(e) => setNewAlbumPetName(e.target.value)}
                        placeholder="宠物名字"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label-text">品种</label>
                      <input
                        type="text"
                        value={newAlbumPetBreed}
                        onChange={(e) => setNewAlbumPetBreed(e.target.value)}
                        placeholder="例如：金毛寻回犬"
                        className="input-field"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="label-text">相册描述</label>
                  <textarea
                    value={newAlbumDescription}
                    onChange={(e) => setNewAlbumDescription(e.target.value)}
                    placeholder="记录这段回忆..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <button
                  onClick={handleCreateAlbum}
                  disabled={!newAlbumTitle.trim()}
                  className="w-full btn-primary py-3 disabled:opacity-50"
                >
                  <Save className="w-5 h-5 mr-2" />
                  创建相册
                </button>
              </div>
            </div>
          )}

          {ownerAlbums.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center">
              <Images className="w-14 h-14 mx-auto text-primary-300 mb-4" />
              <p className="text-neutral-text mb-2">还没有相册</p>
              <p className="text-sm text-neutral-muted mb-5">
                创建第一个相册，开始珍藏美好回忆
              </p>
              <button
                onClick={() => setIsCreatingAlbum(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                创建相册
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {ownerAlbums.map((album) => {
                const albumPet = pets.find((p) => p.id === album.petId);
                const photoCount = photos.filter((p) => p.albumId === album.id).length;
                return (
                  <button
                    key={album.id}
                    onClick={() => {
                      setSelectedAlbumId(album.id);
                      setStep('detail');
                    }}
                    className="w-full bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-all active:scale-[0.98] text-left"
                  >
                    <div className="relative h-40">
                      <img
                        src={album.coverPhotoUrl || albumPet?.photoUrl}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="font-serif text-lg font-bold text-white mb-1">
                          {album.title}
                        </h3>
                        <div className="flex items-center gap-3 text-white/80 text-sm">
                          {albumPet && (
                            <span className="flex items-center gap-1">
                              <PawPrint className="w-3.5 h-3.5" />
                              {albumPet.name}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5" />
                            {photoCount} 张
                          </span>
                        </div>
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 pb-8">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => {
              setStep('albums');
              setSelectedAlbumId(null);
            }}
            className="p-2 -ml-2 text-neutral-muted hover:text-neutral-text transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-lg font-bold text-neutral-text truncate">
              {currentAlbum?.title}
            </h1>
            <p className="text-xs text-neutral-muted truncate">
              {currentAlbumPet ? `${currentAlbumPet.name} · ` : ''}
              {currentPhotos.length} 张照片
            </p>
          </div>
          <label className="btn-primary text-sm py-2 px-3 cursor-pointer">
            <Upload className="w-4 h-4 mr-1" />
            上传
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5">
        {isUploading && (
          <div className="bg-white rounded-2xl p-6 mb-5 text-center">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-neutral-text">正在处理图片...</p>
          </div>
        )}

        {isAddingPhoto && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-5 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-neutral-text">
                添加新照片
              </h3>
              <button
                onClick={() => {
                  setIsAddingPhoto(false);
                  setNewPhotoUrl('');
                  setNewPhotoNote('');
                  setNewPhotoTakenAt('');
                }}
                className="p-1.5 text-neutral-muted hover:text-neutral-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="aspect-video rounded-xl overflow-hidden bg-primary-50 border border-primary-100 mb-3">
                  {newPhotoUrl ? (
                    <img
                      src={newPhotoUrl}
                      alt="预览"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-400">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <label className="btn-secondary w-full cursor-pointer justify-center">
                  <Upload className="w-4 h-4 mr-2" />
                  重新选择或拍摄
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              <div>
                <label className="label-text flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary-400" />
                  拍摄日期
                </label>
                <input
                  type="date"
                  value={newPhotoTakenAt}
                  onChange={(e) => setNewPhotoTakenAt(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">照片备注</label>
                <textarea
                  value={newPhotoNote}
                  onChange={(e) => setNewPhotoNote(e.target.value)}
                  placeholder="记录这张照片的故事..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsAddingPhoto(false);
                    setNewPhotoUrl('');
                    setNewPhotoNote('');
                    setNewPhotoTakenAt('');
                  }}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleAddPhoto}
                  disabled={!newPhotoUrl.trim()}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {currentPhotos.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center">
            <ImageIcon className="w-14 h-14 mx-auto text-primary-300 mb-4" />
            <p className="text-neutral-text mb-2">相册是空的</p>
            <p className="text-sm text-neutral-muted mb-5">
              上传第一张照片，开始记录
            </p>
            <label className="btn-primary cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              上传照片
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-5">
            {currentPhotos.map((photo) => {
              const displayDate = photo.takenAt ?? photo.uploadedAt;
              const isEditing = editingPhotoId === photo.id;
              const isDeleting = deleteConfirmId === photo.id;

              return (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-card animate-fade-in"
                >
                  <div className="relative">
                    <img
                      src={photo.url}
                      alt={photo.note || '照片'}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {!isEditing && (
                        <>
                          {isDeleting ? (
                            <div className="flex items-center gap-1 bg-white/90 backdrop-blur rounded-lg px-2 py-1">
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-sm text-neutral-muted hover:text-neutral-text px-2 py-0.5"
                              >
                                取消
                              </button>
                              <button
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="text-sm text-red-600 hover:bg-red-50 px-2 py-0.5 rounded"
                              >
                                删除
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditPhoto(photo)}
                                className="p-2 bg-white/90 backdrop-blur rounded-lg text-neutral-muted hover:text-primary-800"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(photo.id)}
                                className="p-2 bg-white/90 backdrop-blur rounded-lg text-neutral-muted hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center text-sm text-neutral-muted mb-2">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {formatDate(displayDate)}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="label-text text-xs">拍摄日期</label>
                          <input
                            type="date"
                            value={editTakenAt}
                            onChange={(e) => setEditTakenAt(e.target.value)}
                            className="input-field text-sm py-2"
                          />
                        </div>
                        <div>
                          <label className="label-text text-xs">备注</label>
                          <textarea
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            placeholder="记录这张照片的故事..."
                            rows={2}
                            className="input-field text-sm py-2 resize-none"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingPhotoId(null)}
                            className="px-3 py-1.5 text-sm text-neutral-muted hover:text-neutral-text"
                          >
                            取消
                          </button>
                          <button
                            onClick={() => saveEditPhoto(photo.id)}
                            className="btn-primary text-sm py-1.5 px-4"
                          >
                            <Save className="w-3.5 h-3.5 mr-1.5" />
                            保存
                          </button>
                        </div>
                      </div>
                    ) : (
                      photo.note ? (
                        <p className="text-neutral-text leading-relaxed">
                          {photo.note}
                        </p>
                      ) : (
                        <button
                          onClick={() => startEditPhoto(photo)}
                          className="text-sm text-primary-600 hover:text-primary-800"
                        >
                          + 添加备注
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
