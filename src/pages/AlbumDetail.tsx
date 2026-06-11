import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Upload,
  Image as ImageIcon,
  Calendar,
  Edit3,
  Trash2,
  Save,
  X,
  PawPrint,
  User,
  Images,
} from 'lucide-react';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';
import { compressImage } from '@/lib/imageUtils';
import type { Photo } from '@/shared/types';

export default function AlbumDetail() {
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    pets,
    owners,
    albums,
    photos: allPhotos,
    addPhoto,
    updatePhoto,
    deletePhoto,
  } = useAppStore();

  const album = id ? albums.find((a) => a.id === id) : undefined;
  const photos = id
    ? allPhotos
        .filter((p) => p.albumId === id)
        .sort((a, b) => {
          const dateA = a.takenAt ?? a.uploadedAt;
          const dateB = b.takenAt ?? b.uploadedAt;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
    : [];
  const pet = album ? pets.find((p) => p.id === album.petId) : undefined;
  const owner = album ? owners.find((o) => o.id === album.ownerId) : undefined;

  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [editTakenAt, setEditTakenAt] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoNote, setNewPhotoNote] = useState('');
  const [newPhotoTakenAt, setNewPhotoTakenAt] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressed = await compressImage(file, 1920, 1080, 0.8);
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
    if (!id || !newPhotoUrl.trim()) return;

    const photoData: Omit<Photo, 'id' | 'uploadedAt'> = {
      albumId: id,
      url: newPhotoUrl.trim(),
      note: newPhotoNote.trim() || undefined,
      takenAt: newPhotoTakenAt || undefined,
    };

    addPhoto(photoData);
    setIsAddingPhoto(false);
    setNewPhotoUrl('');
    setNewPhotoNote('');
    setNewPhotoTakenAt('');
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!album) {
    return (
      <div>
        <PageHeader
          title="相册不存在"
          actions={
            <Link to="/albums" className="btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回相册列表
            </Link>
          }
        />
        <div className="card text-center py-16">
          <Images className="w-16 h-16 mx-auto text-primary-300 mb-4" />
          <p className="text-neutral-muted text-lg">该相册不存在或已被删除</p>
        </div>
      </div>
    );
  }

  const defaultCover = pet?.photoUrl;

  return (
    <div>
      <PageHeader
        title={album.title}
        description={album.description}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/albums" className="btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回列表
            </Link>
            <Link to={`/albums/${album.id}/edit`} className="btn-secondary">
              <Edit3 className="w-4 h-4 mr-2" />
              编辑相册
            </Link>
            <label className="btn-primary cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              上传照片
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
        }
      />

      <div className="card mb-8 p-0 overflow-hidden">
        <div className="relative h-56 md:h-72">
          <img
            src={album.coverPhotoUrl || defaultCover}
            alt={album.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
              {album.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              {pet && (
                <span className="flex items-center gap-1.5">
                  <PawPrint className="w-4 h-4" />
                  {pet.name} · {pet.breed}
                </span>
              )}
              {owner && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {owner.name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Images className="w-4 h-4" />
                {photos.length} 张照片
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                创建于 {formatDate(album.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="card mb-8 text-center py-10">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-text font-medium">正在处理图片...</p>
        </div>
      )}

      {isAddingPhoto && (
        <div className="card mb-8 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold text-primary-900 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-primary-600" />
              添加新照片
            </h3>
            <button
              onClick={() => {
                setIsAddingPhoto(false);
                setNewPhotoUrl('');
                setNewPhotoNote('');
                setNewPhotoTakenAt('');
              }}
              className="p-1.5 text-neutral-muted hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-text flex items-center">
                <ImageIcon className="w-4 h-4 mr-1.5 text-primary-400" />
                照片预览
              </label>
              <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-primary-50 border border-primary-100">
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
              <div className="mt-3">
                <label className="btn-secondary cursor-pointer inline-flex">
                  <Upload className="w-4 h-4 mr-2" />
                  选择或拍摄照片
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                <span className="ml-3 text-sm text-neutral-muted">或</span>
                <input
                  type="text"
                  placeholder="输入图片URL"
                  value={newPhotoUrl.startsWith('data:') ? '' : newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="input-field mt-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label-text flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-primary-400" />
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
                  rows={4}
                  className="input-field resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsAddingPhoto(false);
                    setNewPhotoUrl('');
                    setNewPhotoNote('');
                    setNewPhotoTakenAt('');
                  }}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleAddPhoto}
                  disabled={!newPhotoUrl.trim()}
                  className="btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  添加照片
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {photos.length === 0 ? (
        <div className="card text-center py-16">
          <ImageIcon className="w-16 h-16 mx-auto text-primary-300 mb-4" />
          <p className="text-neutral-muted text-lg mb-2">相册中还没有照片</p>
          <p className="text-sm text-neutral-muted mb-6">上传第一张照片，开始记录美好回忆</p>
          <label className="btn-primary cursor-pointer inline-flex">
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
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 transform md:-translate-x-1/2" />

          <div className="space-y-8">
            {photos.map((photo, index) => {
              const isLeft = index % 2 === 0;
              const displayDate = photo.takenAt ?? photo.uploadedAt;
              const isEditing = editingPhotoId === photo.id;
              const isDeleting = deleteConfirmId === photo.id;

              return (
                <div
                  key={photo.id}
                  className={`relative flex items-start ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } animate-fade-in`}
                >
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent border-2 border-white transform -translate-x-1/2 mt-6 z-10 shadow-sm" />

                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="card overflow-hidden">
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
                                <div className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-lg px-2 py-1">
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="text-sm text-neutral-muted hover:text-neutral-text px-2 py-1"
                                  >
                                    取消
                                  </button>
                                  <button
                                    onClick={() => handleDeletePhoto(photo.id)}
                                    className="text-sm text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                                  >
                                    确认
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditPhoto(photo)}
                                    className="p-2 bg-white/90 backdrop-blur rounded-lg text-neutral-muted hover:text-primary-800 transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(photo.id)}
                                    className="p-2 bg-white/90 backdrop-blur rounded-lg text-neutral-muted hover:text-red-600 transition-colors"
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
                        <div className="flex items-center text-sm text-neutral-muted mb-3">
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
                                rows={3}
                                className="input-field text-sm py-2 resize-none"
                              />
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingPhotoId(null)}
                                className="px-3 py-1.5 text-sm text-neutral-muted hover:text-neutral-text transition-colors"
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
                          photo.note && (
                            <p className="text-neutral-text leading-relaxed">
                              {photo.note}
                            </p>
                          )
                        )}

                        {!isEditing && !photo.note && (
                          <button
                            onClick={() => startEditPhoto(photo)}
                            className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
                          >
                            + 添加备注
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
