import type { Owner, Pet, Ceremony, Cremation, Urn, Reminder } from '../shared/types';

export const mockOwners: Owner[] = [
  {
    id: 'owner-001',
    name: '张明华',
    phone: '13800138001',
    email: 'zhangminghua@example.com',
    address: '北京市朝阳区建国路88号'
  },
  {
    id: 'owner-002',
    name: '李小红',
    phone: '13800138002',
    email: 'lixiaohong@example.com',
    address: '上海市浦东新区陆家嘴环路1000号'
  },
  {
    id: 'owner-003',
    name: '王大伟',
    phone: '13800138003',
    email: 'wangdawei@example.com',
    address: '广州市天河区天河路385号'
  }
];

export const mockPets: Pet[] = [
  {
    id: 'pet-001',
    name: '豆豆',
    breed: '金毛寻回犬',
    age: '8岁',
    gender: 'male',
    photoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20golden%20retriever%20dog%20sitting%20on%20grass%20with%20a%20happy%20expression%2C%20warm%20sunlight%2C%20realistic%20pet%20portrait&image_size=square_hd',
    ownerId: 'owner-001',
    createdAt: '2025-03-15T10:30:00Z',
    notes: '性格温顺，喜欢与人亲近，最爱吃牛肉干。'
  },
  {
    id: 'pet-002',
    name: '咪咪',
    breed: '英国短毛猫',
    age: '5岁',
    gender: 'female',
    photoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20cute%20British%20Shorthair%20cat%20with%20grey%20fur%20and%20big%20round%20eyes%2C%20sitting%20on%20a%20soft%20cushion%2C%20realistic%20pet%20portrait&image_size=square_hd',
    ownerId: 'owner-002',
    createdAt: '2025-04-20T14:15:00Z',
    notes: '喜欢安静，偶尔会撒娇，最爱吃鱼罐头。'
  },
  {
    id: 'pet-003',
    name: '旺财',
    breed: '中华田园犬',
    age: '12岁',
    gender: 'male',
    photoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20loyal%20Chinese%20rural%20dog%20with%20brown%20and%20white%20fur%2C%20elderly%20but%20gentle%20expression%2C%20realistic%20pet%20portrait&image_size=square_hd',
    ownerId: 'owner-001',
    createdAt: '2025-01-10T09:00:00Z',
    notes: '非常忠诚的老狗，陪伴了主人很多年。'
  },
  {
    id: 'pet-004',
    name: '雪球',
    breed: '萨摩耶',
    age: '6岁',
    gender: 'female',
    photoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20beautiful%20Samoyed%20dog%20with%20fluffy%20white%20fur%20and%20smiling%20face%2C%20snow%20background%2C%20realistic%20pet%20portrait&image_size=square_hd',
    ownerId: 'owner-003',
    createdAt: '2025-05-05T11:45:00Z',
    notes: '毛发雪白，笑容甜美，最喜欢在雪地里玩耍。'
  },
  {
    id: 'pet-005',
    name: '小花',
    breed: '布偶猫',
    age: '3岁',
    gender: 'female',
    photoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20gorgeous%20Ragdoll%20cat%20with%20blue%20eyes%20and%20cream%20colored%20fur%2C%20relaxing%20pose%2C%20realistic%20pet%20portrait&image_size=square_hd',
    ownerId: 'owner-002',
    createdAt: '2025-06-12T16:20:00Z',
    notes: '蓝眼睛非常漂亮，性格粘人，喜欢被抱抱。'
  }
];

export const mockCeremonies: Ceremony[] = [
  {
    id: 'ceremony-001',
    petId: 'pet-001',
    ceremonyTime: '2025-03-18T10:00:00Z',
    location: '追思堂A厅',
    participants: '张明华及家人共8人',
    status: 'completed',
    notes: '仪式温馨庄重，家属对服务表示满意。'
  },
  {
    id: 'ceremony-002',
    petId: 'pet-003',
    ceremonyTime: '2025-01-13T14:30:00Z',
    location: '追思堂B厅',
    participants: '张明华及朋友共5人',
    status: 'completed',
    notes: '老狗旺财的告别仪式，主人数度落泪。'
  },
  {
    id: 'ceremony-003',
    petId: 'pet-002',
    ceremonyTime: '2025-04-23T09:30:00Z',
    location: '追思堂C厅',
    participants: '李小红及家人共4人',
    status: 'completed',
    notes: '咪咪的告别仪式简单而温馨。'
  }
];

export const mockCremations: Cremation[] = [
  {
    id: 'cremation-001',
    petId: 'pet-001',
    cremationTime: '2025-03-18T14:00:00Z',
    furnaceId: 'F-001',
    status: 'completed',
    operator: '张师傅'
  },
  {
    id: 'cremation-002',
    petId: 'pet-003',
    cremationTime: '2025-01-13T17:00:00Z',
    furnaceId: 'F-002',
    status: 'completed',
    operator: '李师傅'
  },
  {
    id: 'cremation-003',
    petId: 'pet-002',
    cremationTime: '2025-04-23T13:00:00Z',
    furnaceId: 'F-001',
    status: 'completed',
    operator: '张师傅'
  }
];

export const mockUrns: Urn[] = [
  {
    id: 'urn-001',
    petId: 'pet-001',
    area: 'A区',
    shelf: '第3排',
    position: '12号',
    storedDate: '2025-03-19',
    expiryDate: '2035-03-19',
    status: 'stored'
  },
  {
    id: 'urn-002',
    petId: 'pet-003',
    area: 'A区',
    shelf: '第1排',
    position: '5号',
    storedDate: '2025-01-14',
    expiryDate: '2035-01-14',
    status: 'stored'
  },
  {
    id: 'urn-003',
    petId: 'pet-002',
    area: 'B区',
    shelf: '第2排',
    position: '8号',
    storedDate: '2025-04-24',
    expiryDate: '2035-04-24',
    status: 'stored'
  }
];

export const mockReminders: Reminder[] = [
  {
    id: 'reminder-001',
    petId: 'pet-001',
    ownerId: 'owner-001',
    title: '豆豆的周年忌日',
    remindDate: '2026-03-18',
    remindType: 'email',
    frequency: 'yearly',
    enabled: true
  },
  {
    id: 'reminder-002',
    petId: 'pet-001',
    ownerId: 'owner-001',
    title: '豆豆的生日',
    remindDate: '2026-07-15',
    remindType: 'both',
    frequency: 'yearly',
    enabled: true
  },
  {
    id: 'reminder-003',
    petId: 'pet-003',
    ownerId: 'owner-001',
    title: '旺财的周年忌日',
    remindDate: '2026-01-13',
    remindType: 'sms',
    frequency: 'yearly',
    enabled: true
  },
  {
    id: 'reminder-004',
    petId: 'pet-002',
    ownerId: 'owner-002',
    title: '咪咪的周年忌日',
    remindDate: '2026-04-23',
    remindType: 'email',
    frequency: 'yearly',
    enabled: true
  },
  {
    id: 'reminder-005',
    petId: 'pet-002',
    ownerId: 'owner-002',
    title: '骨灰存放续费提醒',
    remindDate: '2026-04-01',
    remindType: 'both',
    frequency: 'once',
    enabled: true
  }
];
