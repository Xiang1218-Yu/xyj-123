import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Images,
  PawPrint,
  User,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';
import type { Album } from '@/shared/types';

interface FormData {
  title: string;
  description: string;
  petId: string;
  ownerId: string;
  coverPhotoUrl: string;
}

const initialFormData: FormData = {
  title: '',
  description: '',
  petId: '',
  ownerId: '',
  coverPhotoUrl: '',
};

export default function AlbumForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const {
    pets,
    owners,
    addAlbum,
    updateAlbum,
    getAlbumById,
    getPetById,
  } = useAppStore();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (isEdit && id) {
      const album = getAlbumById(id);
      if (album) {
        setFormData({
          title: album.title,
          description: album.description ?? '',
          petId: album.petId,
          ownerId: album.ownerId,
          coverPhotoUrl: album.coverPhotoUrl ?? '',
        });
      }
    }
  }, [isEdit, id, getAlbumById]);

  useEffect(() => {
    if (formData.petId && !formData.ownerId) {
      const pet = getPetById(formData.petId);
      if (pet) {
        setFormData((prev) => ({ ...prev, ownerId: pet.ownerId }));
      }
    }
  }, [formData.petId, formData.ownerId, getPetById]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = '请输入相册名称';
    if (!formData.petId) newErrors.petId = '请选择关联的宠物';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const albumData: Omit<Album, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      petId: formData.petId,
      ownerId: formData.ownerId || getPetById(formData.petId)?.ownerId || '',
      coverPhotoUrl: formData.coverPhotoUrl.trim() || undefined,
    };

    if (isEdit && id) {
      updateAlbum(id, albumData);
    } else {
      addAlbum(albumData);
    }

    navigate('/albums');
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? '编辑相册' : '新建相册'}
        description={isEdit ? '更新相册信息' : '创建新的宠物纪念相册'}
        actions={
          <Link to="/albums" className="btn-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="card">
          <h3 className="font-serif text-lg font-semibold text-primary-900 mb-6 flex items-center">
            <Images className="w-5 h-5 mr-2 text-primary-600" />
            相册信息
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label-text">相册名称 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="请输入相册名称，例如：豆豆的美好回忆"
                className={`input-field ${errors.title ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="label-text flex items-center">
                <PawPrint className="w-4 h-4 mr-1.5 text-primary-400" />
                关联宠物 *
              </label>
              <select
                value={formData.petId}
                onChange={(e) => handleChange('petId', e.target.value)}
                className={`input-field ${errors.petId ? 'border-red-400 focus:ring-red-300' : ''}`}
              >
                <option value="">请选择宠物</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.breed})
                  </option>
                ))}
              </select>
              {errors.petId && <p className="mt-1 text-sm text-red-500">{errors.petId}</p>}
            </div>

            <div>
              <label className="label-text flex items-center">
                <User className="w-4 h-4 mr-1.5 text-primary-400" />
                相册主人
              </label>
              <select
                value={formData.ownerId}
                onChange={(e) => handleChange('ownerId', e.target.value)}
                className="input-field"
              >
                <option value="">自动匹配（根据宠物）</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label-text flex items-center">
                <ImageIcon className="w-4 h-4 mr-1.5 text-primary-400" />
                封面照片 URL
              </label>
              <input
                type="text"
                value={formData.coverPhotoUrl}
                onChange={(e) => handleChange('coverPhotoUrl', e.target.value)}
                placeholder="请输入封面照片的URL（选填，将使用宠物照片作为封面）"
                className="input-field"
              />
              {formData.coverPhotoUrl && (
                <div className="mt-3">
                  <img
                    src={formData.coverPhotoUrl}
                    alt="封面预览"
                    className="w-40 h-28 rounded-lg object-cover border-2 border-primary-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="label-text flex items-center">
                <FileText className="w-4 h-4 mr-1.5 text-primary-400" />
                相册描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="请输入相册的描述信息（选填）"
                rows={4}
                className="input-field resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link to="/albums" className="btn-secondary">
            取消
          </Link>
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? '保存修改' : '创建相册'}
          </button>
        </div>
      </form>
    </div>
  );
}
