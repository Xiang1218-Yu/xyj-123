import type { Owner, Pet, Ceremony, Cremation, Urn, Reminder, ServiceItem, FuneralPackage, Album, Photo } from '../shared/types';

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
    notes: '仪式温馨庄重，家属对服务表示满意。',
    packageId: 'package-002'
  },
  {
    id: 'ceremony-002',
    petId: 'pet-003',
    ceremonyTime: '2025-01-13T14:30:00Z',
    location: '追思堂B厅',
    participants: '张明华及朋友共5人',
    status: 'completed',
    notes: '老狗旺财的告别仪式，主人数度落泪。',
    packageId: 'package-001'
  },
  {
    id: 'ceremony-003',
    petId: 'pet-002',
    ceremonyTime: '2025-04-23T09:30:00Z',
    location: '追思堂C厅',
    participants: '李小红及家人共4人',
    status: 'completed',
    notes: '咪咪的告别仪式简单而温馨。',
    packageId: 'package-003'
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

export const mockServiceItems: ServiceItem[] = [
  {
    id: 'service-001',
    name: '接送服务',
    description: '专车上门接送爱宠遗体至服务中心',
    price: 300,
    category: 'transport'
  },
  {
    id: 'service-002',
    name: '鲜花布置',
    description: '追思堂鲜花装饰，营造温馨氛围',
    price: 500,
    category: 'ceremony'
  },
  {
    id: 'service-003',
    name: '视频录制',
    description: '全程高清录制告别仪式，永久珍藏回忆',
    price: 800,
    category: 'memorial'
  },
  {
    id: 'service-004',
    name: '专业告别仪式',
    description: '主持人引导的庄重告别仪式',
    price: 1200,
    category: 'ceremony'
  },
  {
    id: 'service-005',
    name: '独立火化',
    description: '单炉独立火化，确保骨灰纯净完整',
    price: 2000,
    category: 'cremation'
  },
  {
    id: 'service-006',
    name: '精美骨灰盒',
    description: '高品质实木骨灰盒，多种款式可选',
    price: 600,
    category: 'memorial'
  },
  {
    id: 'service-007',
    name: '骨灰存放1年',
    description: '骨灰堂规范存放，专人管理',
    price: 365,
    category: 'memorial'
  },
  {
    id: 'service-008',
    name: '纪念照片打印',
    description: '专业冲印爱宠纪念照片',
    price: 100,
    category: 'memorial'
  },
  {
    id: 'service-009',
    name: '礼仪人员服务',
    description: '专业礼仪人员全程引导服务',
    price: 400,
    category: 'ceremony'
  }
];

export const mockFuneralPackages: FuneralPackage[] = [
  {
    id: 'package-001',
    name: '温馨基础套餐',
    description: '简洁温馨的基础告别服务，适合预算有限的家庭',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20simple%20and%20warm%20pet%20funeral%20ceremony%20setup%20with%20soft%20lighting%20and%20white%20flowers%2C%20peaceful%20atmosphere&image_size=landscape_16_9',
    basePrice: 1999,
    serviceItems: [
      { serviceItemId: 'service-001', included: true },
      { serviceItemId: 'service-004', included: true },
      { serviceItemId: 'service-005', included: true },
      { serviceItemId: 'service-006', included: true },
      { serviceItemId: 'service-002', included: false },
      { serviceItemId: 'service-003', included: false },
      { serviceItemId: 'service-007', included: false },
      { serviceItemId: 'service-008', included: false },
      { serviceItemId: 'service-009', included: false }
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'package-002',
    name: '臻爱尊享套餐',
    description: '全方位贴心服务，给爱宠最尊贵的告别',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=An%20elegant%20and%20luxurious%20pet%20memorial%20ceremony%20with%20beautiful%20flower%20arrangements%20and%20candles%2C%20warm%20golden%20lighting&image_size=landscape_16_9',
    basePrice: 4999,
    isRecommended: true,
    serviceItems: [
      { serviceItemId: 'service-001', included: true },
      { serviceItemId: 'service-002', included: true },
      { serviceItemId: 'service-003', included: true },
      { serviceItemId: 'service-004', included: true },
      { serviceItemId: 'service-005', included: true },
      { serviceItemId: 'service-006', included: true },
      { serviceItemId: 'service-007', included: true },
      { serviceItemId: 'service-008', included: true },
      { serviceItemId: 'service-009', included: true }
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'package-003',
    name: '简约环保套餐',
    description: '简约而不失温度，环保理念的告别方式',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20minimalist%20eco-friendly%20pet%20memorial%20with%20green%20plants%20and%20natural%20elements%2C%20serene%20outdoor%20setting&image_size=landscape_16_9',
    basePrice: 2999,
    serviceItems: [
      { serviceItemId: 'service-001', included: true },
      { serviceItemId: 'service-004', included: true },
      { serviceItemId: 'service-005', included: true },
      { serviceItemId: 'service-006', included: true },
      { serviceItemId: 'service-007', included: true },
      { serviceItemId: 'service-002', included: false },
      { serviceItemId: 'service-003', included: false },
      { serviceItemId: 'service-008', included: false },
      { serviceItemId: 'service-009', included: false }
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

export const mockAlbums: Album[] = [
  {
    id: 'album-001',
    petId: 'pet-001',
    ownerId: 'owner-001',
    title: '豆豆的美好回忆',
    description: '豆豆陪伴我们走过的8年美好时光，每一张照片都是珍贵的回忆。',
    coverPhotoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20golden%20retriever%20dog%20playing%20in%20a%20sunny%20park%20with%20a%20frisbee%2C%20happy%20expression%2C%20warm%20afternoon%20light&image_size=landscape_16_9',
    createdAt: '2025-03-16T10:00:00Z',
    updatedAt: '2025-03-20T14:30:00Z'
  },
  {
    id: 'album-002',
    petId: 'pet-002',
    ownerId: 'owner-002',
    title: '咪咪的日常',
    description: '记录咪咪生活中的点点滴滴，她永远是我们家的小公主。',
    coverPhotoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20British%20Shorthair%20cat%20curled%20up%20on%20a%20windowsill%20with%20sunlight%20streaming%20in%2C%20peaceful%20and%20cozy&image_size=landscape_16_9',
    createdAt: '2025-04-21T09:00:00Z',
    updatedAt: '2025-05-10T11:20:00Z'
  },
  {
    id: 'album-003',
    petId: 'pet-003',
    ownerId: 'owner-001',
    title: '旺财的忠诚岁月',
    description: '12年的陪伴，旺财是我们家最忠诚的成员。',
    coverPhotoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=An%20elderly%20Chinese%20rural%20dog%20sitting%20in%20a%20courtyard%20with%20warm%20sunset%20light%2C%20wise%20and%20gentle%20expression&image_size=landscape_16_9',
    createdAt: '2025-01-11T08:00:00Z',
    updatedAt: '2025-02-15T16:45:00Z'
  }
];

export const mockPhotos: Photo[] = [
  {
    id: 'photo-001',
    albumId: 'album-001',
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20golden%20retriever%20puppy%20sleeping%20in%20a%20cozy%20dog%20bed%20with%20soft%20blankets%2C%20adorable%20and%20peaceful&image_size=landscape_4_3',
    note: '刚到家的第一天，小小的一只，睡得好香。',
    takenAt: '2017-05-10',
    uploadedAt: '2025-03-16T10:05:00Z'
  },
  {
    id: 'photo-002',
    albumId: 'album-001',
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20golden%20retriever%20learning%20to%20sit%20with%20a%20treat%20in%20front%20of%20him%2C%20training%20session%20in%20the%20living%20room&image_size=landscape_4_3',
    note: '第一次学会坐下，真是聪明的孩子！',
    takenAt: '2017-06-20',
    uploadedAt: '2025-03-16T10:10:00Z'
  },
  {
    id: 'photo-003',
    albumId: 'album-001',
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20golden%20retriever%20playing%20fetch%20on%20a%20beautiful%20beach%20at%20sunset%2C%20running%20through%20waves%20happily&image_size=landscape_4_3',
    note: '第一次去海边玩耍，豆豆玩得特别开心。',
    takenAt: '2018-08-15',
    uploadedAt: '2025-03-16T10:15:00Z'
  },
  {
    id: 'photo-004',
    albumId: 'album-001',
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20golden%20retriever%20celebrating%20birthday%20with%20a%20dog-friendly%20cake%2C%20wearing%20a%20party%20hat%2C%20family%20around&image_size=landscape_4_3',
    note: '5岁生日，全家人一起为豆豆庆祝。',
    takenAt: '2022-05-10',
    uploadedAt: '2025-03-17T15:30:00Z'
  },
  {
    id: 'photo-005',
    albumId: 'album-001',
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20senior%20golden%20retriever%20resting%20on%20a%20soft%20couch%20with%20grey%20around%20the%20muzzle%2C%20content%20expression&image_size=landscape_4_3',
    note: '晚年的豆豆，虽然走不动了，但依然那么温顺可爱。',
    takenAt: '2025-02-28',
    uploadedAt: '2025-03-18T09:00:00Z'
  },
  {
    id: 'photo-006',
    albumId: 'album-002',
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20British%20Shorthair%20kitten%20peeking%20from%20behind%20a%20curtain%2C%20curious%20big%20eyes%2C%20playful&image_size=landscape_4_3',
    note: '刚到家的小咪咪，对一切都充满好奇。',
    takenAt: '2020-03-15',
    uploadedAt: '2025-04-21T09:05:00Z'
  },
  {
    id: 'photo-007',
    albumId: 'album-002',
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20British%20Shorthair%20cat%20sitting%20in%20a%20cardboard%20box%2C%20looking%20very%20pleased%20with%20herself&image_size=landscape_4_3',
    note: '咪咪最喜欢纸箱了，无论多大的盒子都想钻进去。',
    takenAt: '2021-07-22',
    uploadedAt: '2025-04-21T09:10:00Z'
  },
  {
    id: 'photo-008',
    albumId: 'album-002',
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20British%20Shorthair%20cat%20napping%20in%20a%20patch%20of%20sunlight%20on%20the%20floor%2C%20completely%20relaxed&image_size=landscape_4_3',
    note: '晒着太阳睡觉，这是咪咪最幸福的时刻。',
    takenAt: '2023-11-10',
    uploadedAt: '2025-04-22T14:20:00Z'
  },
  {
    id: 'photo-009',
    albumId: 'album-003',
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20young%20Chinese%20rural%20dog%20standing%20guard%20at%20the%20door%20of%20a%20country%20house%2C%20alert%20and%20loyal&image_size=landscape_4_3',
    note: '年轻时的旺财，是我们家最忠实的守护者。',
    takenAt: '2013-06-01',
    uploadedAt: '2025-01-11T08:05:00Z'
  },
  {
    id: 'photo-010',
    albumId: 'album-003',
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20Chinese%20rural%20dog%20walking%20with%20his%20owner%20on%20a%20country%20road%20in%20autumn%2C%20leaves%20falling&image_size=landscape_4_3',
    note: '每天傍晚的散步时光，旺财总是走在我前面。',
    takenAt: '2018-10-20',
    uploadedAt: '2025-01-11T08:10:00Z'
  },
  {
    id: 'photo-011',
    albumId: 'album-003',
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=An%20old%20Chinese%20rural%20dog%20being%20petted%20by%20his%20owner%27s%20hand%2C%20eyes%20closed%20contentedly&image_size=landscape_4_3',
    note: '晚年的旺财，最喜欢被我摸摸头。',
    takenAt: '2024-12-25',
    uploadedAt: '2025-01-12T10:30:00Z'
  }
];
