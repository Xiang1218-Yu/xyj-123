import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HeartHandshake, Calendar, MapPin, Users, FileText, ArrowLeft, Check } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { mockPets, mockCeremonies } from '@/data/mockData';
import type { Ceremony } from '@/shared/types';

const statusOptions: { value: Ceremony['status']; label: string }[] = [
  { value: 'pending', label: '待开始' },
  { value: 'in-progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
];

export default function CeremonyForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<{
    petId: string;
    ceremonyTime: string;
    location: string;
    participants: string;
    status: Ceremony['status'];
    notes: string;
  }>({
    petId: '',
    ceremonyTime: '',
    location: '',
    participants: '',
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    if (isEdit) {
      const ceremony = mockCeremonies.find(c => c.id === id);
      if (ceremony) {
        setFormData({
          petId: ceremony.petId,
          ceremonyTime: ceremony.ceremonyTime.slice(0, 16),
          location: ceremony.location,
          participants: ceremony.participants,
          status: ceremony.status,
          notes: ceremony.notes || ''
        });
      }
    }
  }, [id, isEdit]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/ceremony');
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? '编辑告别仪式' : '新增告别仪式'}
        description={isEdit ? '修改仪式的时间和安排信息' : '为宠物安排一场庄重的告别仪式'}
        actions={
          <button
            className="btn-secondary"
            onClick={() => navigate('/ceremony')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </button>
        }
      />

      <div className="card max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-text">
                <HeartHandshake className="w-4 h-4 inline mr-1 text-accent" />
                选择宠物
              </label>
              <select
                className="input-field"
                value={formData.petId}
                onChange={(e) => handleChange('petId', e.target.value)}
                required
              >
                <option value="">请选择宠物</option>
                {mockPets.map(pet => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}（{pet.breed}）
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">
                <Calendar className="w-4 h-4 inline mr-1 text-accent" />
                仪式时间
              </label>
              <input
                type="datetime-local"
                className="input-field"
                value={formData.ceremonyTime}
                onChange={(e) => handleChange('ceremonyTime', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label-text">
                <MapPin className="w-4 h-4 inline mr-1 text-accent" />
                地点
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="如：追思堂A厅"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label-text">
                <Users className="w-4 h-4 inline mr-1 text-accent" />
                参与人员
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="如：主人及家人共5人"
                value={formData.participants}
                onChange={(e) => handleChange('participants', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label-text">
                <Check className="w-4 h-4 inline mr-1 text-accent" />
                状态
              </label>
              <select
                className="input-field"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as Ceremony['status'])}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label-text">
              <FileText className="w-4 h-4 inline mr-1 text-accent" />
              备注
            </label>
            <textarea
              className="input-field min-h-[120px] resize-y"
              placeholder="请输入备注信息..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button type="submit" className="btn-primary">
              <Check className="w-4 h-4 mr-2" />
              {isEdit ? '保存修改' : '创建仪式'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/ceremony')}
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
