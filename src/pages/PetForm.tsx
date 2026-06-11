import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  PawPrint,
  User,
  Phone,
  Mail,
  Image,
  FileText
} from 'lucide-react';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';
import type { Pet, Owner } from '@/shared/types';

interface FormData {
  name: string;
  breed: string;
  age: string;
  gender: 'male' | 'female';
  photoUrl: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  notes: string;
}

const initialFormData: FormData = {
  name: '',
  breed: '',
  age: '',
  gender: 'male',
  photoUrl: '',
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  notes: ''
};

export default function PetForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const {
    owners,
    addPet,
    updatePet,
    addOwner,
    updateOwner,
    getPetById,
    getOwnerById
  } = useAppStore();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (isEdit && id) {
      const pet = getPetById(id);
      if (pet) {
        const owner = getOwnerById(pet.ownerId);
        setFormData({
          name: pet.name,
          breed: pet.breed,
          age: pet.age,
          gender: pet.gender,
          photoUrl: pet.photoUrl,
          ownerName: owner?.name ?? '',
          ownerPhone: owner?.phone ?? '',
          ownerEmail: owner?.email ?? '',
          notes: pet.notes ?? ''
        });
      }
    }
  }, [isEdit, id, getPetById, getOwnerById]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = '请输入宠物名称';
    if (!formData.breed.trim()) newErrors.breed = '请输入品种';
    if (!formData.age.trim()) newErrors.age = '请输入年龄';
    if (!formData.ownerName.trim()) newErrors.ownerName = '请输入主人姓名';
    if (!formData.ownerPhone.trim()) {
      newErrors.ownerPhone = '请输入主人电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.ownerPhone)) {
      newErrors.ownerPhone = '请输入有效的手机号码';
    }
    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = '请输入主人邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = '请输入有效的邮箱地址';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const findOrCreateOwner = (): string => {
    if (isEdit && id) {
      const pet = getPetById(id);
      if (pet) {
        const existingOwner = getOwnerById(pet.ownerId);
        if (existingOwner) {
          updateOwner(existingOwner.id, {
            name: formData.ownerName,
            phone: formData.ownerPhone,
            email: formData.ownerEmail
          });
          return existingOwner.id;
        }
      }
    }

    const existingOwner = owners.find(
      (o) => o.phone === formData.ownerPhone || o.email === formData.ownerEmail
    );

    if (existingOwner) {
      updateOwner(existingOwner.id, {
        name: formData.ownerName,
        phone: formData.ownerPhone,
        email: formData.ownerEmail
      });
      return existingOwner.id;
    }

    let newOwnerId = '';
    const tempId = 'temp-' + Date.now();
    const ownerToAdd: Omit<Owner, 'id'> = {
      name: formData.ownerName,
      phone: formData.ownerPhone,
      email: formData.ownerEmail
    };

    const unsubscribe = useAppStore.subscribe((state) => {
      const found = state.owners.find(
        (o) => o.phone === formData.ownerPhone && o.email === formData.ownerEmail
      );
      if (found && found.id !== tempId) {
        newOwnerId = found.id;
        unsubscribe();
      }
    });

    addOwner(ownerToAdd);
    unsubscribe();

    const latestOwner = useAppStore
      .getState()
      .owners.find(
        (o) => o.phone === formData.ownerPhone && o.email === formData.ownerEmail
      );

    return latestOwner?.id ?? newOwnerId;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const ownerId = findOrCreateOwner();

    const defaultPhotoUrl =
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20cute%20pet%20portrait%20with%20warm%20lighting%2C%20professional%20pet%20photography&image_size=square_hd';

    const petData: Omit<Pet, 'id'> = {
      name: formData.name.trim(),
      breed: formData.breed.trim(),
      age: formData.age.trim(),
      gender: formData.gender,
      photoUrl: formData.photoUrl.trim() || defaultPhotoUrl,
      ownerId,
      createdAt: isEdit && id ? getPetById(id)?.createdAt ?? new Date().toISOString() : new Date().toISOString(),
      notes: formData.notes.trim() || undefined
    };

    if (isEdit && id) {
      updatePet(id, petData);
    } else {
      addPet(petData);
    }

    navigate('/pets');
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? '编辑宠物档案' : '新增宠物档案'}
        description={isEdit ? '更新宠物的基本信息' : '录入新的宠物档案信息'}
        actions={
          <Link to="/pets" className="btn-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h3 className="font-serif text-lg font-semibold text-primary-900 mb-6 flex items-center">
            <PawPrint className="w-5 h-5 mr-2 text-primary-600" />
            宠物信息
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-text">宠物名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="请输入宠物名称"
                className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="label-text">品种 *</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => handleChange('breed', e.target.value)}
                placeholder="例如：金毛寻回犬"
                className={`input-field ${errors.breed ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.breed && <p className="mt-1 text-sm text-red-500">{errors.breed}</p>}
            </div>

            <div>
              <label className="label-text">年龄 *</label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="例如：5岁"
                className={`input-field ${errors.age ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
            </div>

            <div>
              <label className="label-text">性别 *</label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => handleChange('gender', e.target.value as 'male' | 'female')}
                    className="w-4 h-4 text-primary-800 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-neutral-text">公</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => handleChange('gender', e.target.value as 'male' | 'female')}
                    className="w-4 h-4 text-primary-800 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-neutral-text">母</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="label-text flex items-center">
                <Image className="w-4 h-4 mr-1.5 text-primary-400" />
                照片URL
              </label>
              <input
                type="text"
                value={formData.photoUrl}
                onChange={(e) => handleChange('photoUrl', e.target.value)}
                placeholder="请输入宠物照片的URL（选填，将使用默认图片）"
                className="input-field"
              />
              {formData.photoUrl && (
                <div className="mt-3">
                  <img
                    src={formData.photoUrl}
                    alt="预览"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-primary-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-serif text-lg font-semibold text-primary-900 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-primary-600" />
            主人信息
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label-text flex items-center">
                <User className="w-4 h-4 mr-1.5 text-primary-400" />
                主人姓名 *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                placeholder="请输入主人姓名"
                className={`input-field ${errors.ownerName ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.ownerName && <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>}
            </div>

            <div>
              <label className="label-text flex items-center">
                <Phone className="w-4 h-4 mr-1.5 text-primary-400" />
                主人电话 *
              </label>
              <input
                type="tel"
                value={formData.ownerPhone}
                onChange={(e) => handleChange('ownerPhone', e.target.value)}
                placeholder="请输入手机号码"
                className={`input-field ${errors.ownerPhone ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.ownerPhone && <p className="mt-1 text-sm text-red-500">{errors.ownerPhone}</p>}
            </div>

            <div>
              <label className="label-text flex items-center">
                <Mail className="w-4 h-4 mr-1.5 text-primary-400" />
                主人邮箱 *
              </label>
              <input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => handleChange('ownerEmail', e.target.value)}
                placeholder="请输入邮箱地址"
                className={`input-field ${errors.ownerEmail ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.ownerEmail && <p className="mt-1 text-sm text-red-500">{errors.ownerEmail}</p>}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-serif text-lg font-semibold text-primary-900 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary-600" />
            备注信息
          </h3>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="请输入宠物的相关备注信息（选填）"
            rows={4}
            className="input-field resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link to="/pets" className="btn-secondary">
            取消
          </Link>
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? '保存修改' : '创建档案'}
          </button>
        </div>
      </form>
    </div>
  );
}
