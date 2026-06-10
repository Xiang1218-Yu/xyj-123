import { useState } from 'react';
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Heart,
  Flame,
  Sparkles,
  Clock,
  Phone,
  Mail,
  PawPrint,
  User
} from 'lucide-react';
import { useAppStore } from '@/store';

type ServiceType = 'ceremony' | 'cremation' | 'full';

interface FormData {
  petName: string;
  petBreed: string;
  petAge: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  serviceType: ServiceType | null;
  expectedDate: string;
  expectedTimeSlot: string;
  notes: string;
}

const initialFormData: FormData = {
  petName: '',
  petBreed: '',
  petAge: '',
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  serviceType: null,
  expectedDate: '',
  expectedTimeSlot: '',
  notes: ''
};

const serviceOptions = [
  {
    type: 'ceremony' as ServiceType,
    title: '告别仪式',
    description: '温馨庄重的告别仪式，在专属追思堂中与爱宠做最后的道别',
    icon: Heart,
    price: '¥1,999'
  },
  {
    type: 'cremation' as ServiceType,
    title: '火化服务',
    description: '独立火化炉，全程可观看，保证骨灰纯净完整',
    icon: Flame,
    price: '¥2,999'
  },
  {
    type: 'full' as ServiceType,
    title: '全套服务',
    description: '告别仪式 + 火化服务 + 骨灰存放，一站式贴心安排',
    icon: Sparkles,
    price: '¥4,999',
    recommended: true
  }
];

const timeSlots = [
  '09:00 - 10:30',
  '10:30 - 12:00',
  '14:00 - 15:30',
  '15:30 - 17:00',
  '17:00 - 18:30'
];

export default function AppointmentBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const { addPet, addOwner, addCeremony, addCremation } = useAppStore();

  const updateForm = (key: keyof FormData, value: string | ServiceType | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const ownerId = `owner-temp-${Date.now()}`;
    const petId = `pet-temp-${Date.now()}`;

    addOwner({
      name: formData.ownerName,
      phone: formData.ownerPhone,
      email: formData.ownerEmail
    });

    addPet({
      name: formData.petName,
      breed: formData.petBreed,
      age: formData.petAge,
      gender: 'male',
      photoUrl: '',
      ownerId,
      createdAt: new Date().toISOString(),
      notes: formData.notes
    });

    if (formData.serviceType === 'ceremony' || formData.serviceType === 'full') {
      addCeremony({
        petId,
        ceremonyTime: `${formData.expectedDate}T${formData.expectedTimeSlot.split(' ')[0]}:00`,
        location: '待分配',
        participants: '待确认',
        status: 'pending',
        notes: formData.notes
      });
    }

    if (formData.serviceType === 'cremation' || formData.serviceType === 'full') {
      addCremation({
        petId,
        cremationTime: `${formData.expectedDate}T${formData.expectedTimeSlot.split(' ')[0]}:00`,
        furnaceId: '待分配',
        status: 'pending'
      });
    }

    setSubmitted(true);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.petName.trim() &&
          formData.petBreed.trim() &&
          formData.petAge.trim() &&
          formData.ownerName.trim() &&
          formData.ownerPhone.trim() &&
          formData.ownerEmail.trim()
        );
      case 2:
        return formData.serviceType !== null;
      case 3:
        return formData.expectedDate && formData.expectedTimeSlot;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 3 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-neutral-text mb-4">
            预约已提交
          </h1>
          <p className="text-lg text-neutral-muted mb-2">
            我们的工作人员将尽快与您联系
          </p>
          <p className="text-sm text-neutral-muted mb-8">
            感谢您的信任，我们会以最温暖的方式陪伴您度过这段时光
          </p>
          <div className="bg-amber-50 rounded-xl p-4 mb-8 text-left">
            <div className="flex items-center gap-2 mb-2">
              <PawPrint className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-neutral-text">{formData.petName}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <CalendarCheck className="w-5 h-5 text-amber-600" />
              <span className="text-neutral-muted">{formData.expectedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-neutral-muted">{formData.expectedTimeSlot}</span>
            </div>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(1);
              setFormData(initialFormData);
            }}
            className="btn-primary w-full"
          >
            再次预约
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-400 rounded-2xl mb-4 shadow-lg">
            <CalendarCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-neutral-text mb-3">
            预约服务
          </h1>
          <p className="text-lg text-neutral-muted">
            为您的爱宠安排最后的告别
          </p>
        </div>

        <div className="flex items-center justify-center mb-10">
          {[1, 2, 3].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  step < currentStep
                    ? 'bg-green-500 text-white'
                    : step === currentStep
                    ? 'bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-lg scale-110'
                    : 'bg-white text-neutral-muted border-2 border-primary-200'
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              {index < 2 && (
                <div
                  className={`w-20 h-1 mx-2 rounded-full transition-all duration-300 ${
                    step < currentStep ? 'bg-green-500' : 'bg-primary-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-bold text-neutral-text mb-6">
                宠物和主人信息
              </h2>

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <PawPrint className="w-4 h-4" />
                  宠物信息
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="label-text">宠物姓名 *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="例如：豆豆"
                      value={formData.petName}
                      onChange={(e) => updateForm('petName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-text">品种 *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="例如：金毛寻回犬"
                      value={formData.petBreed}
                      onChange={(e) => updateForm('petBreed', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-text">年龄 *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="例如：8岁"
                      value={formData.petAge}
                      onChange={(e) => updateForm('petAge', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  主人信息
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="label-text">姓名 *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="请输入您的姓名"
                      value={formData.ownerName}
                      onChange={(e) => updateForm('ownerName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-text flex items-center gap-1">
                      <Phone className="w-3 h-3" /> 电话 *
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="请输入联系电话"
                      value={formData.ownerPhone}
                      onChange={(e) => updateForm('ownerPhone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-text flex items-center gap-1">
                      <Mail className="w-3 h-3" /> 邮箱 *
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="请输入邮箱地址"
                      value={formData.ownerEmail}
                      onChange={(e) => updateForm('ownerEmail', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-bold text-neutral-text mb-2">
                服务选择
              </h2>
              <p className="text-neutral-muted mb-6">
                请选择适合您的服务类型
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {serviceOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.serviceType === option.type;
                  return (
                    <div
                      key={option.type}
                      onClick={() => updateForm('serviceType', option.type)}
                      className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 shadow-lg scale-[1.02]'
                          : 'border-primary-100 bg-white hover:border-primary-300 hover:shadow-md'
                      }`}
                    >
                      {option.recommended && (
                        <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          推荐
                        </div>
                      )}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                          isSelected
                            ? 'bg-gradient-to-br from-amber-500 to-rose-500 text-white'
                            : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-lg text-neutral-text mb-2">
                        {option.title}
                      </h3>
                      <p className="text-sm text-neutral-muted mb-4 leading-relaxed">
                        {option.description}
                      </p>
                      <div className="text-2xl font-bold text-amber-600">
                        {option.price}
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 left-4">
                          <CheckCircle className="w-6 h-6 text-amber-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-bold text-neutral-text mb-2">
                时间选择与确认
              </h2>
              <p className="text-neutral-muted mb-6">
                请选择您期望的服务时间
              </p>

              <div className="space-y-6">
                <div>
                  <label className="label-text flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4" />
                    期望日期 *
                  </label>
                  <input
                    type="date"
                    className="input-field max-w-xs"
                    value={formData.expectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateForm('expectedDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="label-text flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    期望时间段 *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => updateForm('expectedTimeSlot', slot)}
                        className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                          formData.expectedTimeSlot === slot
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                            : 'bg-primary-50 text-neutral-text border border-primary-200 hover:bg-primary-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label-text">备注</label>
                  <textarea
                    className="input-field min-h-[120px] resize-none"
                    placeholder="如有特殊需求请在此说明..."
                    value={formData.notes}
                    onChange={(e) => updateForm('notes', e.target.value)}
                  />
                </div>

                <div className="bg-amber-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-neutral-text mb-4">预约信息确认</h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-muted">宠物：</span>
                      <span className="text-neutral-text font-medium">{formData.petName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-muted">品种：</span>
                      <span className="text-neutral-text font-medium">{formData.petBreed || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-muted">主人：</span>
                      <span className="text-neutral-text font-medium">{formData.ownerName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-muted">服务：</span>
                      <span className="text-neutral-text font-medium">
                        {serviceOptions.find((o) => o.type === formData.serviceType)?.title || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-muted">日期：</span>
                      <span className="text-neutral-text font-medium">{formData.expectedDate || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-muted">时间：</span>
                      <span className="text-neutral-text font-medium">{formData.expectedTimeSlot || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-10 pt-6 border-t border-primary-100">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              上一步
            </button>
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一步
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5 mr-1" />
                提交预约
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
