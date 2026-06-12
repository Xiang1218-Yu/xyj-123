import type { Owner, Pet, Ceremony, CeremonyTemplate, Cremation, Urn, Reminder, ServiceItem, FuneralPackage, Album, Photo, Employee, ShiftSchedule, LeaveRequest, AttendanceRecord, PetBreed, BreedArticle, ContractTemplate, Contract, ContractSignature, ContractTimelineEntry, PetLifeStory, MemorialProduct, Order, Furnace, FurnaceMaintenance, FurnaceCremationProcess, MemorialRecord, TimeSlotLock, AppointmentChangeLog } from '../shared/types';

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

export const mockCeremonyTemplates: CeremonyTemplate[] = [
  {
    id: 'tpl-traditional-001',
    name: '传统告别仪式',
    type: 'traditional',
    description: '庄重肃穆的传统告别仪式，包含完整的祭奠流程，适合希望为宠物举办隆重告别仪式的家庭。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20traditional%20pet%20memorial%20ceremony%20with%20elegant%20flower%20arrangements%20and%20candles%2C%20solemn%20and%20respectful%20atmosphere%2C%20warm%20lighting&image_size=landscape_16_9',
    flowSteps: [
      { title: '入场签到', description: '家属及宾客入场，在签到簿上留下名字和寄语，领取悼念胸花。', duration: 15, sortOrder: 1 },
      { title: '仪式开始', description: '主持人致开场白，介绍仪式流程，全体默哀一分钟。', duration: 10, sortOrder: 2 },
      { title: '宠物生平介绍', description: '主持人讲述宠物的一生，回顾与主人相伴的美好时光。', duration: 15, sortOrder: 3 },
      { title: '家属致辞', description: '主人及家属代表上台发表感言，分享与宠物的珍贵回忆。', duration: 20, sortOrder: 4 },
      { title: '敬献鲜花', description: '家属及宾客依次上前，为宠物献上鲜花，表达思念之情。', duration: 20, sortOrder: 5 },
      { title: '祭拜仪式', description: '传统三鞠躬祭拜仪式，敬香、献果、祭酒。', duration: 15, sortOrder: 6 },
      { title: '封棺/封盒仪式', description: '主人见宠物最后一面，由工作人员完成封棺/封盒。', duration: 15, sortOrder: 7 },
      { title: '仪式结束', description: '主持人致结束语，家属答谢宾客，仪式圆满结束。', duration: 10, sortOrder: 8 }
    ],
    items: [
      { name: '遗像相框', quantity: 1, unit: '个', category: 'decoration', note: '8寸实木相框' },
      { name: '白菊花束', quantity: 10, unit: '束', category: 'decoration' },
      { name: '白蜡烛', quantity: 6, unit: '对', category: 'ritual' },
      { name: '香', quantity: 3, unit: '柱', category: 'ritual' },
      { name: '果盘', quantity: 3, unit: '盘', category: 'ritual', note: '时令水果' },
      { name: '祭酒', quantity: 1, unit: '杯', category: 'ritual' },
      { name: '悼念胸花', quantity: 20, unit: '个', category: 'supplies' },
      { name: '签到簿', quantity: 1, unit: '本', category: 'supplies' },
      { name: '纪念卡片', quantity: 20, unit: '张', category: 'supplies' },
      { name: '纸巾', quantity: 2, unit: '盒', category: 'supplies' },
      { name: '矿泉水', quantity: 20, unit: '瓶', category: 'other' }
    ],
    estimatedDuration: 120,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'tpl-simple-001',
    name: '简约温馨仪式',
    type: 'simple',
    description: '简洁而不失温度的告别仪式，适合追求简单温馨氛围的家庭，在安静祥和的气氛中送别爱宠。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20simple%20and%20warm%20pet%20memorial%20ceremony%20with%20soft%20lighting%20and%20minimalist%20decor%2C%20peaceful%20and%20cozy%20atmosphere&image_size=landscape_16_9',
    flowSteps: [
      { title: '入场就座', description: '家属入场，在舒缓的音乐中就座，仪式准备开始。', duration: 10, sortOrder: 1 },
      { title: '默哀追思', description: '全体默哀三分钟，在心中回忆与宠物相伴的点点滴滴。', duration: 5, sortOrder: 2 },
      { title: '温馨回顾', description: '播放宠物生前照片视频，配合轻柔音乐，共同回顾美好时光。', duration: 15, sortOrder: 3 },
      { title: '主人诉说', description: '主人分享与宠物之间最难忘的故事和情感。', duration: 15, sortOrder: 4 },
      { title: '献花道别', description: '每位家属手持一枝鲜花，上前与宠物道别。', duration: 15, sortOrder: 5 },
      { title: '仪式结束', description: '在轻音乐中仪式结束，工作人员引导家属休息。', duration: 5, sortOrder: 6 }
    ],
    items: [
      { name: '遗像相框', quantity: 1, unit: '个', category: 'decoration', note: '7寸简约相框' },
      { name: '白玫瑰', quantity: 6, unit: '枝', category: 'decoration' },
      { name: 'LED电子蜡烛', quantity: 4, unit: '个', category: 'decoration' },
      { name: '纪念册', quantity: 1, unit: '本', category: 'supplies', note: '可粘贴照片' },
      { name: '纸巾', quantity: 1, unit: '盒', category: 'supplies' },
      { name: '温水', quantity: 6, unit: '杯', category: 'other' }
    ],
    estimatedDuration: 60,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'tpl-religious-001',
    name: '佛教超度仪式',
    type: 'religious',
    description: '按照佛教传统仪轨举行的超度仪式，为宠物诵经祈福，祈愿它往生善道、离苦得乐。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20peaceful%20Buddhist%20pet%20memorial%20ceremony%20with%20incense%20and%20lotus%20flowers%2C%20serene%20and%20spiritual%20atmosphere%2C%20soft%20golden%20light&image_size=landscape_16_9',
    flowSteps: [
      { title: '洒净仪式', description: '法师手持杨枝净水，为坛场及宠物洒净，清净业障。', duration: 10, sortOrder: 1 },
      { title: '召请圣众', description: '焚香召请诸佛菩萨、护法龙天降临道场，加持宠物。', duration: 10, sortOrder: 2 },
      { title: '诵经超度', description: '法师诵念《往生咒》《地藏经》等经文，为宠物超度。', duration: 30, sortOrder: 3 },
      { title: '授三皈依', description: '为宠物授三皈依，种下菩提种子，结下法缘。', duration: 15, sortOrder: 4 },
      { title: '回向', description: '将诵经功德回向给宠物，祈愿它离苦得乐、往生净土。', duration: 10, sortOrder: 5 },
      { title: '家属祭拜', description: '家属依次上香、礼拜，表达对宠物的思念与祝福。', duration: 20, sortOrder: 6 },
      { title: '仪式圆满', description: '法师致答谢词，仪式圆满结束，家属祭拜后可离开。', duration: 10, sortOrder: 7 }
    ],
    items: [
      { name: '佛像', quantity: 1, unit: '尊', category: 'ritual', note: '阿弥陀佛像' },
      { name: '莲花灯', quantity: 2, unit: '对', category: 'decoration' },
      { name: '酥油灯', quantity: 7, unit: '盏', category: 'ritual', note: '七星灯' },
      { name: '立香', quantity: 1, unit: '把', category: 'ritual' },
      { name: '檀香', quantity: 1, unit: '盒', category: 'ritual' },
      { name: '供果', quantity: 5, unit: '盘', category: 'ritual', note: '五果' },
      { name: '净水', quantity: 1, unit: '杯', category: 'ritual' },
      { name: '往生被', quantity: 1, unit: '条', category: 'ritual' },
      { name: '咒轮', quantity: 1, unit: '张', category: 'ritual', note: '往生咒轮' },
      { name: '念珠', quantity: 1, unit: '串', category: 'ritual', note: '可放置骨灰盒旁' },
      { name: '莲花', quantity: 3, unit: '朵', category: 'decoration' },
      { name: '功德簿', quantity: 1, unit: '本', category: 'supplies' }
    ],
    estimatedDuration: 90,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
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
    packageId: 'package-002',
    templateId: 'tpl-traditional-001',
    templateType: 'traditional'
  },
  {
    id: 'ceremony-002',
    petId: 'pet-003',
    ceremonyTime: '2025-01-13T14:30:00Z',
    location: '追思堂B厅',
    participants: '张明华及朋友共5人',
    status: 'completed',
    notes: '老狗旺财的告别仪式，主人数度落泪。',
    packageId: 'package-001',
    templateId: 'tpl-simple-001',
    templateType: 'simple'
  },
  {
    id: 'ceremony-003',
    petId: 'pet-002',
    ceremonyTime: '2025-04-23T09:30:00Z',
    location: '追思堂C厅',
    participants: '李小红及家人共4人',
    status: 'completed',
    notes: '咪咪的告别仪式简单而温馨。',
    packageId: 'package-003',
    templateId: 'tpl-simple-001',
    templateType: 'simple'
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
    status: 'stored',
    storageType: 'vip'
  },
  {
    id: 'urn-002',
    petId: 'pet-003',
    area: 'A区',
    shelf: '第1排',
    position: '5号',
    storedDate: '2025-01-14',
    expiryDate: '2035-01-14',
    status: 'stored',
    storageType: 'normal'
  },
  {
    id: 'urn-003',
    petId: 'pet-002',
    area: 'B区',
    shelf: '第2排',
    position: '8号',
    storedDate: '2025-04-24',
    expiryDate: '2035-04-24',
    status: 'stored',
    storageType: 'normal'
  }
];

export const mockMemorialRecords: MemorialRecord[] = [
  {
    id: 'mem-001',
    urnId: 'urn-001',
    petId: 'pet-001',
    actionType: 'incense',
    createdAt: '2025-06-10T10:30:00Z',
    visitorName: '张明华'
  },
  {
    id: 'mem-002',
    urnId: 'urn-001',
    petId: 'pet-001',
    actionType: 'flower',
    flowerType: '白菊花',
    createdAt: '2025-06-10T10:35:00Z',
    visitorName: '张明华'
  },
  {
    id: 'mem-003',
    urnId: 'urn-001',
    petId: 'pet-001',
    actionType: 'message',
    content: '豆豆，你永远是我们家的一员，我们永远爱你。',
    createdAt: '2025-06-10T10:40:00Z',
    visitorName: '张明华'
  },
  {
    id: 'mem-004',
    urnId: 'urn-002',
    petId: 'pet-003',
    actionType: 'incense',
    createdAt: '2025-06-08T14:20:00Z',
    visitorName: '张明华'
  },
  {
    id: 'mem-005',
    urnId: 'urn-002',
    petId: 'pet-003',
    actionType: 'message',
    content: '旺财，谢谢你12年的忠诚陪伴，一路走好。',
    createdAt: '2025-06-08T14:25:00Z',
    visitorName: '张明华'
  },
  {
    id: 'mem-006',
    urnId: 'urn-003',
    petId: 'pet-002',
    actionType: 'flower',
    flowerType: '白玫瑰',
    createdAt: '2025-06-09T09:15:00Z',
    visitorName: '李小红'
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

export const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    name: '张师傅',
    phone: '13900139001',
    role: 'cremation-operator',
    status: 'active',
    hireDate: '2022-03-01',
    notes: '资深火化师，操作经验丰富。'
  },
  {
    id: 'emp-002',
    name: '李晓婷',
    phone: '13900139002',
    role: 'ceremony-host',
    status: 'active',
    hireDate: '2023-06-15',
    notes: '仪式主持人，擅长温馨告别仪式。'
  },
  {
    id: 'emp-003',
    name: '王建国',
    phone: '13900139003',
    role: 'driver',
    status: 'active',
    hireDate: '2023-01-10'
  },
  {
    id: 'emp-004',
    name: '赵雅琴',
    phone: '13900139004',
    role: 'receptionist',
    status: 'active',
    hireDate: '2024-02-20',
    notes: '前台接待，沟通能力强。'
  },
  {
    id: 'emp-005',
    name: '陈志远',
    phone: '13900139005',
    role: 'storage-manager',
    status: 'active',
    hireDate: '2022-08-05'
  },
  {
    id: 'emp-006',
    name: '孙丽华',
    phone: '13900139006',
    role: 'manager',
    status: 'active',
    hireDate: '2021-11-01',
    notes: '服务中心经理，负责整体运营管理。'
  }
];

export const mockShiftSchedules: ShiftSchedule[] = [
  { id: 'shift-001', employeeId: 'emp-001', date: '2025-06-09', shiftType: 'morning' },
  { id: 'shift-002', employeeId: 'emp-001', date: '2025-06-10', shiftType: 'morning' },
  { id: 'shift-003', employeeId: 'emp-001', date: '2025-06-11', shiftType: 'afternoon' },
  { id: 'shift-004', employeeId: 'emp-001', date: '2025-06-12', shiftType: 'rest' },
  { id: 'shift-005', employeeId: 'emp-001', date: '2025-06-13', shiftType: 'morning' },
  { id: 'shift-006', employeeId: 'emp-001', date: '2025-06-14', shiftType: 'morning' },
  { id: 'shift-007', employeeId: 'emp-001', date: '2025-06-15', shiftType: 'rest' },
  { id: 'shift-008', employeeId: 'emp-002', date: '2025-06-09', shiftType: 'afternoon' },
  { id: 'shift-009', employeeId: 'emp-002', date: '2025-06-10', shiftType: 'afternoon' },
  { id: 'shift-010', employeeId: 'emp-002', date: '2025-06-11', shiftType: 'morning' },
  { id: 'shift-011', employeeId: 'emp-002', date: '2025-06-12', shiftType: 'afternoon' },
  { id: 'shift-012', employeeId: 'emp-002', date: '2025-06-13', shiftType: 'rest' },
  { id: 'shift-013', employeeId: 'emp-002', date: '2025-06-14', shiftType: 'morning' },
  { id: 'shift-014', employeeId: 'emp-002', date: '2025-06-15', shiftType: 'rest' },
  { id: 'shift-015', employeeId: 'emp-003', date: '2025-06-09', shiftType: 'morning' },
  { id: 'shift-016', employeeId: 'emp-003', date: '2025-06-10', shiftType: 'morning' },
  { id: 'shift-017', employeeId: 'emp-003', date: '2025-06-11', shiftType: 'morning' },
  { id: 'shift-018', employeeId: 'emp-003', date: '2025-06-12', shiftType: 'rest' },
  { id: 'shift-019', employeeId: 'emp-003', date: '2025-06-13', shiftType: 'afternoon' },
  { id: 'shift-020', employeeId: 'emp-003', date: '2025-06-14', shiftType: 'morning' },
  { id: 'shift-021', employeeId: 'emp-004', date: '2025-06-09', shiftType: 'afternoon' },
  { id: 'shift-022', employeeId: 'emp-004', date: '2025-06-10', shiftType: 'morning' },
  { id: 'shift-023', employeeId: 'emp-004', date: '2025-06-11', shiftType: 'afternoon' },
  { id: 'shift-024', employeeId: 'emp-004', date: '2025-06-12', shiftType: 'morning' },
  { id: 'shift-025', employeeId: 'emp-004', date: '2025-06-13', shiftType: 'afternoon' },
  { id: 'shift-026', employeeId: 'emp-004', date: '2025-06-14', shiftType: 'rest' },
  { id: 'shift-027', employeeId: 'emp-005', date: '2025-06-09', shiftType: 'morning' },
  { id: 'shift-028', employeeId: 'emp-005', date: '2025-06-10', shiftType: 'afternoon' },
  { id: 'shift-029', employeeId: 'emp-005', date: '2025-06-11', shiftType: 'morning' },
  { id: 'shift-030', employeeId: 'emp-005', date: '2025-06-12', shiftType: 'morning' },
  { id: 'shift-031', employeeId: 'emp-005', date: '2025-06-13', shiftType: 'rest' },
  { id: 'shift-032', employeeId: 'emp-005', date: '2025-06-14', shiftType: 'afternoon' },
  { id: 'shift-033', employeeId: 'emp-006', date: '2025-06-09', shiftType: 'morning' },
  { id: 'shift-034', employeeId: 'emp-006', date: '2025-06-10', shiftType: 'morning' },
  { id: 'shift-035', employeeId: 'emp-006', date: '2025-06-11', shiftType: 'morning' },
  { id: 'shift-036', employeeId: 'emp-006', date: '2025-06-12', shiftType: 'morning' },
  { id: 'shift-037', employeeId: 'emp-006', date: '2025-06-13', shiftType: 'morning' },
  { id: 'shift-038', employeeId: 'emp-006', date: '2025-06-14', shiftType: 'rest' }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-001',
    employeeId: 'emp-002',
    type: 'annual',
    startDate: '2025-06-16',
    endDate: '2025-06-18',
    reason: '家中有事需要处理',
    status: 'pending',
    createdAt: '2025-06-08T10:00:00Z'
  },
  {
    id: 'leave-002',
    employeeId: 'emp-003',
    type: 'sick',
    startDate: '2025-06-11',
    endDate: '2025-06-11',
    reason: '身体不适需就医',
    status: 'pending',
    createdAt: '2025-06-10T22:00:00Z'
  },
  {
    id: 'leave-003',
    employeeId: 'emp-001',
    type: 'personal',
    startDate: '2025-06-20',
    endDate: '2025-06-20',
    reason: '个人事务',
    status: 'approved',
    reviewedBy: 'emp-006',
    reviewedAt: '2025-06-09T09:30:00Z',
    createdAt: '2025-06-07T14:00:00Z'
  },
  {
    id: 'leave-004',
    employeeId: 'emp-004',
    type: 'annual',
    startDate: '2025-07-01',
    endDate: '2025-07-05',
    reason: '计划外出旅游',
    status: 'rejected',
    reviewedBy: 'emp-006',
    reviewedAt: '2025-06-10T11:00:00Z',
    createdAt: '2025-06-05T16:30:00Z'
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: 'att-001', employeeId: 'emp-001', date: '2025-06-09', shiftType: 'morning', checkInTime: '08:00', checkOutTime: '16:00', status: 'normal' },
  { id: 'att-002', employeeId: 'emp-001', date: '2025-06-10', shiftType: 'morning', checkInTime: '08:15', checkOutTime: '16:00', status: 'late' },
  { id: 'att-003', employeeId: 'emp-002', date: '2025-06-09', shiftType: 'afternoon', checkInTime: '13:00', checkOutTime: '21:00', status: 'normal' },
  { id: 'att-004', employeeId: 'emp-002', date: '2025-06-10', shiftType: 'afternoon', checkInTime: '13:00', checkOutTime: '20:30', status: 'early-leave' },
  { id: 'att-005', employeeId: 'emp-003', date: '2025-06-09', shiftType: 'morning', checkInTime: '07:55', checkOutTime: '16:00', status: 'normal' },
  { id: 'att-006', employeeId: 'emp-003', date: '2025-06-10', shiftType: 'morning', checkInTime: '08:00', checkOutTime: '16:00', status: 'normal' },
  { id: 'att-007', employeeId: 'emp-004', date: '2025-06-09', shiftType: 'afternoon', checkInTime: '13:00', checkOutTime: '21:00', status: 'normal' },
  { id: 'att-008', employeeId: 'emp-004', date: '2025-06-10', shiftType: 'morning', checkInTime: '08:00', checkOutTime: '16:00', status: 'normal' },
  { id: 'att-009', employeeId: 'emp-005', date: '2025-06-09', shiftType: 'morning', checkInTime: '08:05', checkOutTime: '16:00', status: 'normal' },
  { id: 'att-010', employeeId: 'emp-005', date: '2025-06-10', shiftType: 'afternoon', checkInTime: '13:00', checkOutTime: '21:00', status: 'normal' },
  { id: 'att-011', employeeId: 'emp-006', date: '2025-06-09', shiftType: 'morning', checkInTime: '07:50', checkOutTime: '16:00', status: 'normal' },
  { id: 'att-012', employeeId: 'emp-006', date: '2025-06-10', shiftType: 'morning', checkInTime: '08:00', checkOutTime: '16:00', status: 'normal' },
  { id: 'att-013', employeeId: 'emp-001', date: '2025-06-11', shiftType: 'afternoon', status: 'absent' },
  { id: 'att-014', employeeId: 'emp-002', date: '2025-06-11', shiftType: 'morning', checkInTime: '08:00', checkOutTime: '16:00', status: 'normal' }
];

export const mockPetBreeds: PetBreed[] = [
  {
    id: 'breed-001',
    name: '金毛寻回犬',
    englishName: 'Golden Retriever',
    category: 'dog',
    origin: '苏格兰',
    lifespan: '10-12年',
    weight: '25-34kg',
    height: '51-61cm',
    personality: ['温顺', '忠诚', '聪明', '友善', '活泼'],
    appearance: '体型匀称，被毛浓密呈金黄色，表情友善，眼睛深褐色，耳朵下垂。',
    careGuide: '每天需要至少1-2小时的运动，定期梳理毛发（每周2-3次），注意髋关节和眼睛健康。饮食要均衡，避免过度喂食导致肥胖。',
    commonDiseases: ['髋关节发育不良', '白内障', '心脏病', '皮肤过敏', '甲状腺功能减退'],
    suitableFor: ['有小孩的家庭', '首次养犬者', '有时间陪伴的家庭'],
    history: '金毛寻回犬起源于19世纪的苏格兰，由Lord Tweedmouth培育，最初用于猎取水禽。1925年被AKC正式认可，现在是全球最受欢迎的家庭犬之一。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20beautiful%20golden%20retriever%20dog%20with%20shiny%20golden%20fur%20sitting%20on%20green%20grass%2C%20friendly%20expression%2C%20professional%20dog%20photography&image_size=square_hd',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'breed-002',
    name: '英国短毛猫',
    englishName: 'British Shorthair',
    category: 'cat',
    origin: '英国',
    lifespan: '12-20年',
    weight: '4-8kg',
    height: '30-35cm',
    personality: ['安静', '独立', '温和', '稳重', '粘人'],
    appearance: '圆脸圆眼，体型健壮，被毛短密柔软，典型的"泰迪熊"外貌，最常见蓝灰色。',
    careGuide: '每周梳理1-2次毛发即可，性格独立不需要太多陪伴，但喜欢与主人互动。注意控制体重，该品种容易发胖。',
    commonDiseases: ['多囊肾病', '肥厚型心肌病', '肥胖症', '泌尿结石'],
    suitableFor: ['上班族', '公寓居住者', '喜欢安静宠物的人'],
    history: '英国短毛猫是最古老的猫种之一，起源可追溯到古罗马时期。20世纪初正式成为注册品种，以其圆胖可爱的外形深受喜爱。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20cute%20British%20Shorthair%20cat%20with%20blue%20grey%20fur%20and%20round%20copper%20eyes%2C%20sitting%20elegantly%2C%20professional%20cat%20photography&image_size=square_hd',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'breed-003',
    name: '中华田园犬',
    englishName: 'Chinese Rural Dog',
    category: 'dog',
    origin: '中国',
    lifespan: '12-20年',
    weight: '15-30kg',
    height: '40-60cm',
    personality: ['忠诚', '警觉', '聪明', '适应力强', '勇敢'],
    appearance: '体型中等匀称，毛色多样，常见黄、黑、白、花等色，耳朵半立或下垂，尾巴卷曲。',
    careGuide: '适应力极强，不挑食，但建议喂食优质狗粮。需要每天运动，忠诚度极高，一生可能只认一个主人。',
    commonDiseases: ['髋关节问题', '皮肤病', '寄生虫感染'],
    suitableFor: ['农村/有院子的家庭', '重视忠诚品质的主人', '有养狗经验者'],
    history: '中华田园犬是中国本土犬种的统称，伴随中华文明数千年。古代用于看家护院、狩猎，是华夏农耕文化的重要组成部分，被誉为"国犬"。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20noble%20Chinese%20rural%20dog%20with%20brown%20fur%20standing%20proudly%20in%20a%20traditional%20Chinese%20courtyard%2C%20loyal%20expression%2C%20warm%20sunlight&image_size=square_hd',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'breed-004',
    name: '萨摩耶',
    englishName: 'Samoyed',
    category: 'dog',
    origin: '俄罗斯西伯利亚',
    lifespan: '12-14年',
    weight: '16-30kg',
    height: '48-60cm',
    personality: ['友善', '活泼', '温顺', '爱笑', '亲人'],
    appearance: '双层雪白被毛，像毛绒玩具，嘴角上翘呈现标志性的"萨摩耶微笑"，眼睛深邃。',
    careGuide: '需要大量运动，每天至少1.5小时。换毛期掉毛极多，需每日梳理。耐热性差，夏季要注意降温。性格顽皮，训练需要耐心。',
    commonDiseases: ['髋关节发育不良', '糖尿病', '白内障', '皮肤病'],
    suitableFor: ['有充足时间的主人', '寒冷地区', '喜欢户外活动的家庭'],
    history: '萨摩耶由西伯利亚的萨摩耶德游牧民族培育，用于拉雪橇、放牧驯鹿和陪伴人类。19世纪末传入欧洲，20世纪成为全球知名的伴侣犬。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20gorgeous%20Samoyed%20dog%20with%20fluffy%20white%20fur%20and%20famous%20smile%2C%20sitting%20in%20snow%2C%20sparkling%20eyes%2C%20professional%20photography&image_size=square_hd',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'breed-005',
    name: '布偶猫',
    englishName: 'Ragdoll',
    category: 'cat',
    origin: '美国',
    lifespan: '12-17年',
    weight: '4.5-9kg',
    height: '23-28cm',
    personality: ['粘人', '温顺', '安静', '亲人', '懒散'],
    appearance: '大型长毛猫，蓝眼睛是标志，毛色重点色分布，被毛柔软蓬松如布偶，体型优雅。',
    careGuide: '需要每日梳毛防止打结，性格温顺适合室内饲养。非常粘人，需要主人较多陪伴。注意肾脏和心脏健康检查。',
    commonDiseases: ['肥厚型心肌病', '多囊肾病', '尿路结石', '肥胖'],
    suitableFor: ['有时间陪伴的家庭', '室内饲养环境', '喜欢被猫咪依赖的人'],
    history: '布偶猫于1960年代由美国的Ann Baker女士培育，因被抱起时全身放松如布娃娃而得名。1970年代开始正式注册。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20stunning%20Ragdoll%20cat%20with%20striking%20blue%20eyes%20and%20cream%20colored%20fluffy%20fur%2C%20relaxing%20on%20a%20soft%20blanket%2C%20elegant%20pose&image_size=square_hd',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'breed-006',
    name: '哈士奇',
    englishName: 'Siberian Husky',
    category: 'dog',
    origin: '俄罗斯西伯利亚',
    lifespan: '12-15年',
    weight: '16-27kg',
    height: '51-60cm',
    personality: ['活泼', '独立', '友善', '调皮', '精力充沛'],
    appearance: '中型犬，被毛厚实，面部有独特的"面罩"花纹，眼睛蓝色或异色，耳朵直立呈三角形。',
    careGuide: '需要极大运动量！每天至少2小时以上剧烈运动。容易"撒手没"，遛狗必须牵绳。掉毛多，尤其是换毛季。叫声独特爱狼嚎。',
    commonDiseases: ['白内障', '髋关节发育不良', '锌缺乏皮肤病'],
    suitableFor: ['精力充沛的年轻主人', '有养犬经验者', '寒冷地区'],
    history: '哈士奇由西伯利亚的楚科奇人培育，用于拉雪橇和狩猎。1909年在阿拉斯加雪橇犬大赛中崭露头角，1930年被AKC认可。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20handsome%20Siberian%20Husky%20dog%20with%20stunning%20blue%20eyes%20and%20black%20white%20fur%2C%20wolf-like%20appearance%2C%20sitting%20on%20snow&image_size=square_hd',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'breed-007',
    name: '美国短毛猫',
    englishName: 'American Shorthair',
    category: 'cat',
    origin: '美国',
    lifespan: '15-20年',
    weight: '3.5-7kg',
    height: '30-38cm',
    personality: ['活泼', '聪明', '独立', '好奇心强', '适应力好'],
    appearance: '体型强壮，圆脸短吻，被毛短而浓密有光泽，银虎斑是最经典的花色。',
    careGuide: '皮实好养，每周梳毛一次即可。喜欢玩耍但不过度粘人，适合新手。注意控制体重和定期体检。',
    commonDiseases: ['肥厚型心肌病', '肥胖', '泌尿系统问题'],
    suitableFor: ['新手养猫者', '上班族', '有小孩的家庭'],
    history: '美短的祖先随五月花号从欧洲来到美洲，用于捕鼠保护粮食。1906年正式被CFA认可，是美国最受欢迎的猫种之一。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20beautiful%20American%20Shorthair%20cat%20with%20classic%20silver%20tabby%20pattern%2C%20alert%20expression%2C%20sitting%20on%20a%20window%20ledge&image_size=square_hd',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'breed-008',
    name: '柴犬',
    englishName: 'Shiba Inu',
    category: 'dog',
    origin: '日本',
    lifespan: '12-15年',
    weight: '8-11kg',
    height: '35-41cm',
    personality: ['独立', '机警', '倔强', '爱干净', '聪明'],
    appearance: '小型犬，立耳卷尾，脸型似狐狸，被毛短密，常见赤色、黑褐色和胡麻色。',
    careGuide: '性格独立倔强，训练需要耐心和技巧。爱干净会自己舔毛，但仍需每周梳理。需要适量运动，社交化要从小做起。',
    commonDiseases: ['髋关节发育不良', '髌骨脱位', '过敏性皮炎', '眼部疾病'],
    suitableFor: ['有养狗经验者', '喜欢独立性格宠物的人', '单身/小家庭'],
    history: '柴犬是日本最古老的犬种之一，已有2000多年历史。原产于日本山区，用于狩猎小型猎物。1936年被指定为日本天然纪念物。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20cute%20Shiba%20Inu%20dog%20with%20red%20fur%20and%20fox-like%20face%2C%20happy%20smile%2C%20curly%20tail%2C%20sitting%20on%20tatami%20mat%2C%20Japanese%20style&image_size=square_hd',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'breed-009',
    name: '荷兰垂耳兔',
    englishName: 'Holland Lop',
    category: 'rabbit',
    origin: '荷兰',
    lifespan: '7-14年',
    weight: '1.4-2kg',
    height: '25-30cm',
    personality: ['温顺', '安静', '粘人', '胆小', '好奇'],
    appearance: '小型兔，特征是下垂的耳朵，圆脸短毛，体型紧凑可爱，毛色多样。',
    careGuide: '需要宽敞的兔笼，每天至少1小时放风时间。主粮以提摩西草为主，兔粮为辅，适量新鲜蔬菜。定期剪指甲和梳理毛发。',
    commonDiseases: ['耳道感染', '胃肠停滞', '牙齿过长', '球虫病'],
    suitableFor: ['耐心细心的主人', '家庭饲养', '喜欢安静宠物的人'],
    history: '荷兰垂耳兔由荷兰的Adrian de Cock于1949年培育，是法国垂耳兔和荷兰侏儒兔的杂交后代，1979年被ARBA认可。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=An%20adorable%20Holland%20Lop%20rabbit%20with%20floppy%20ears%20and%20soft%20brown%20white%20fur%2C%20sitting%20on%20fresh%20hay%2C%20cute%20expression&image_size=square_hd',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'breed-010',
    name: '玄凤鹦鹉',
    englishName: 'Cockatiel',
    category: 'bird',
    origin: '澳大利亚',
    lifespan: '15-25年',
    weight: '80-120g',
    height: '30-33cm',
    personality: ['温顺', '聪明', '亲人', '会学舌', '喜欢互动'],
    appearance: '中小型鹦鹉，有标志性的顶冠，脸颊上有橙色圆斑，野生型为灰色，变种有黄化、珍珠等。',
    careGuide: '需要大笼子，每天放出笼互动2小时以上。主食为专用鹦鹉粮，适量新鲜蔬果补充。注意清洁笼舍，避免环境过冷过热。',
    commonDiseases: ['呼吸道感染', '脂肪肝', '羽虱', '喙羽病'],
    suitableFor: ['有时间陪伴互动的人', '喜欢鸟类的家庭', '听力敏感者可接受'],
    history: '玄凤鹦鹉原产澳大利亚内陆，1770年代被欧洲探险家发现，1800年代开始人工饲养，现在是全球最受欢迎的宠物鸟之一。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20beautiful%20Cockatiel%20bird%20with%20yellow%20crest%20and%20orange%20cheek%20patches%2C%20grey%20feathers%2C%20perched%20on%20a%20wooden%20branch%2C%20curious%20look&image_size=square_hd',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'breed-011',
    name: '金丝熊仓鼠',
    englishName: 'Syrian Hamster',
    category: 'hamster',
    origin: '叙利亚',
    lifespan: '2-3年',
    weight: '100-150g',
    height: '15-18cm',
    personality: ['独居', '夜行性', '好奇心强', '胆小', '爱囤粮'],
    appearance: '体型最大的仓鼠，耳朵圆黑，眼睛明亮，被毛浓密柔软，有金色、白色、花斑等多种花色。',
    careGuide: '必须独居！一鼠一笼，底盘面积不小于0.4平米。需配备跑轮（直径28cm以上），垫料厚度15cm以上供挖掘。主粮仓鼠粮+少量新鲜蔬果。',
    commonDiseases: ['湿尾病', '皮肤真菌', '呼吸道感染', '肿瘤'],
    suitableFor: ['喜欢观察类宠物的人', '空间有限的养宠新手', '能接受短寿命的人'],
    history: '金丝熊仓鼠1839年被科学描述，1930年一窝幼崽从叙利亚被带到以色列进行人工繁殖，此后逐步扩散到世界各地成为流行宠物。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20cute%20golden%20Syrian%20hamster%20with%20fluffy%20fur%20stuffing%20cheeks%20with%20food%2C%20sitting%20on%20bedding%2C%20adorable%20expression&image_size=square_hd',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'breed-012',
    name: '豹纹守宫',
    englishName: 'Leopard Gecko',
    category: 'reptile',
    origin: '中亚地区',
    lifespan: '15-20年',
    weight: '45-80g',
    height: '20-28cm',
    personality: ['温顺', '夜行性', '胆小', '适应力强', '易上手'],
    appearance: '身体覆盖豹纹斑点，皮肤粗糙有颗粒感，有可活动的眼睑（区别于多数守宫），尾巴肥大储存脂肪。',
    careGuide: '需要加温饲养箱，热点30-32度，冷区25-27度。垫料建议使用厨房纸或瓷砖避免误食。主食为面包虫、蟋蟀等活饵，需补钙粉。',
    commonDiseases: ['代谢性骨病', '脱皮困难', '寄生虫感染', '肠炎'],
    suitableFor: ['对爬行动物感兴趣的人', '时间有限的上班族', '想养异宠的新手'],
    history: '豹纹守宫原产于巴基斯坦、阿富汗、伊朗等中亚干旱地区。1970年代开始进入宠物贸易，因饲养简单性格温顺成为最受欢迎的入门爬行宠物。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20beautiful%20Leopard%20Gecko%20lizard%20with%20yellow%20orange%20body%20and%20black%20spots%2C%20resting%20on%20a%20rock%2C%20reptile%20photography&image_size=square_hd',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

export const mockBreedArticles: BreedArticle[] = [
  {
    id: 'article-001',
    breedId: 'breed-001',
    title: '金毛寻回犬日常护理全指南',
    summary: '从毛发护理到运动需求，全面了解如何照顾你的金毛',
    content: '## 毛发护理\n金毛的被毛分为上下两层，下层浓密防水，外层较长。每周至少梳理2-3次，换毛期（春秋季）需要每天梳理，以减少家中掉毛。建议使用针梳和脱毛梳配合使用。\n\n## 运动需求\n金毛是工作犬出身，精力充沛。成年金毛每天需要1-2小时的运动时间，包括散步、奔跑和游泳等。金毛尤其喜欢玩水，夏天可以带它去安全的水域游泳。\n\n## 饮食管理\n金毛容易发胖，要严格控制饮食量。成年犬每天喂食2次，选择优质高蛋白狗粮，避免过多零食。可以适量补充鱼油对毛发健康有益。\n\n## 健康检查\n每年至少做一次全面体检，重点关注髋关节、心脏和眼睛。金毛是癌症高发品种，老年期要特别注意。',
    author: '宠物医师-李医生',
    articleType: 'care',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20golden%20retriever%20being%20brushed%20and%20groomed%20happily%2C%20professional%20dog%20grooming%20scene%2C%20warm%20lighting&image_size=landscape_16_9',
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2025-02-10T10:00:00Z'
  },
  {
    id: 'article-002',
    breedId: 'breed-001',
    title: '金毛常见疾病预防与识别',
    summary: '了解高发疾病的早期症状，提前预防守护健康',
    content: '## 髋关节发育不良(HD)\n金毛是HD高发品种，症状包括：走路摇摆、起身困难、不愿爬楼梯、跑跳时兔子跳。8个月后可以拍X光确诊。预防：避免幼犬过度运动、控制体重、科学补钙。\n\n## 白内障\n老年金毛常见，表现为眼睛变白、视力下降、走路撞到东西。早期可以用眼药水控制，严重时需要手术治疗。\n\n## 心脏病\n金毛易发扩张型心肌病，症状：咳嗽、呼吸困难、运动耐力下降、腹部肿胀。每年心脏彩超检查可早期发现。\n\n## 癌症\n金毛癌症发病率约60%，常见淋巴瘤、血管瘤、骨肉瘤。注意体表肿块、不明原因消瘦、食欲下降等异常，定期体检很重要。',
    author: '宠物医师-王医生',
    articleType: 'health',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20veterinarian%20doctor%20examining%20a%20golden%20retriever%20dog%20at%20a%20modern%20clinic%2C%20caring%20atmosphere&image_size=landscape_16_9',
    createdAt: '2025-03-05T14:30:00Z',
    updatedAt: '2025-03-05T14:30:00Z'
  },
  {
    id: 'article-003',
    breedId: 'breed-002',
    title: '英国短毛猫饲养入门手册',
    summary: '新手养猫必读：英短的日常照顾要点',
    content: '## 性格特点\n英短性格温和稳重，独立性强，不会过度粘人，但也喜欢安静地陪伴在主人身边。适应能力强，不容易应激。\n\n## 饮食建议\n英短是易胖体质，一定要定时定量喂食。建议主食为主，零食为辅。每天换干净的饮用水，猫咪喜欢流动的水可以考虑饮水机。\n\n## 毛发护理\n虽然是短毛猫，但春秋换毛季掉毛也不少。每周用硅胶梳或梳毛手套梳理1-2次，既能减少浮毛又能增进感情。\n\n## 环境布置\n英短喜欢高处，猫爬架是必备。猫砂盆要放在安静隐蔽处，数量遵循N+1原则。多准备几个纸箱子，英短的最爱！',
    author: '资深铲屎官-小美',
    articleType: 'care',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20happy%20British%20Shorthair%20cat%20relaxing%20in%20a%20cozy%20modern%20home%20with%20cat%20tree%20and%20toys&image_size=landscape_16_9',
    createdAt: '2025-02-15T09:00:00Z',
    updatedAt: '2025-02-15T09:00:00Z'
  },
  {
    id: 'article-004',
    breedId: 'breed-005',
    title: '布偶猫爆毛护理秘籍',
    summary: '如何让你家布偶拥有一身蓬松的仙女毛',
    content: '## 日常梳理\n布偶是长毛猫，每天梳理是必须的！使用排梳从发根到发梢仔细梳理，重点检查腋下、腹部、尾巴根部是否有打结。\n\n## 洗澡频率\n布偶本身很爱干净，不需要频繁洗澡。建议2-3个月洗一次即可，使用猫咪专用浴液，彻底吹干防止猫癣。\n\n## 营养补充\n想要毛发好，内服很重要：\n- 卵磷脂：帮助毛发生长\n- 深海鱼油：Omega-3让毛发更亮泽\n- 熟蛋黄：每周2-3个补充生物素\n- 高蛋白主食：肉类是最好的营养品',
    author: '布偶猫舍-专业繁育人',
    articleType: 'care',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20magnificent%20fluffy%20Ragdoll%20cat%20with%20long%20flowing%20fur%20being%20combed%2C%20beautiful%20blue%20eyes&image_size=landscape_16_9',
    createdAt: '2025-03-20T16:00:00Z',
    updatedAt: '2025-03-20T16:00:00Z'
  },
  {
    id: 'article-005',
    breedId: 'breed-006',
    title: '哈士奇训练技巧分享',
    summary: '搞定"撒手没"，二哈也能听话',
    content: '## 为什么哈士奇不听话\n哈士奇是工作犬，独立性极强，原本就是拉雪橇时自己判断路况的。所以它不是听不懂，而是在想"凭什么听你的"。\n\n## 建立领袖地位\n- 进门出门你先走\n- 吃饭你先吃，它后吃\n- 不要让它上床沙发（可以买专属床）\n- 游戏时间由你决定开始和结束\n\n## 召回训练\n- 从封闭空间开始，每次叫名字回来就奖励\n- 使用最高等级奖励（它最爱的零食）\n- 绝对不要在它回来后骂它（否则下次更不回来）\n- 循序渐进，不要急着放开长绳\n\n## 精力释放\n二哈拆家99%是因为精力没处花！每天2小时以上运动，再加益智喂食玩具，可以大幅减少破坏行为。',
    author: '训犬师-阿杰',
    articleType: 'training',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20happy%20Siberian%20Husky%20dog%20training%20in%20a%20park%20with%20trainer%2C%20obedience%20session%2C%20sunny%20day&image_size=landscape_16_9',
    createdAt: '2025-04-02T11:20:00Z',
    updatedAt: '2025-04-02T11:20:00Z'
  },
  {
    id: 'article-006',
    breedId: 'breed-008',
    title: '柴犬社会化训练指南',
    summary: '让"小倔驴"变成友好小天使',
    content: '## 什么是社会化\n社会化就是让幼犬在3-14周的黄金期，尽可能多地接触不同的人、动物、环境、声音，长大后就不会胆小或攻击。\n\n## 接触清单\n- 不同年龄的人：老人、小孩、男生、女生\n- 戴帽子/眼镜/口罩的人\n- 其他狗狗：从温顺的朋友开始\n- 各种环境：公园、商场、车上\n- 各种声音：汽车喇叭、吸尘器、门铃\n\n## 柴犬常见问题\n柴犬天生警觉，容易对陌生人/狗保持距离。如果没做好社会化，成年后可能对其他狗有攻击性。每一次正面接触都要给零食奖励！',
    author: '柴犬爱好者俱乐部',
    articleType: 'behavior',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20friendly%20Shiba%20Inu%20playing%20with%20other%20dogs%20in%20a%20dog%20park%2C%20happy%20social%20interaction&image_size=landscape_16_9',
    createdAt: '2025-04-18T13:40:00Z',
    updatedAt: '2025-04-18T13:40:00Z'
  },
  {
    id: 'article-007',
    breedId: 'breed-009',
    title: '垂耳兔饲养十大误区',
    summary: '新手必看！这些错误会伤害兔兔',
    content: '## 误区1：只喂胡萝卜蔬菜\n错！兔子主食是干草（提摩西草为主），蔬菜只是辅食，不能当主食，否则会拉肚子甚至死亡。\n\n## 误区2：不给喝水\n错！兔子需要无限量干净的饮水，用滚珠水壶，不要用碗（会打翻导致口炎）。\n\n## 误区3：两只养一起做伴\n慎选！兔子是独居动物，同性容易打架，异性会疯狂繁殖。真想养两只必须先绝育再慢慢合笼。\n\n## 误区4：抓耳朵抱\n绝对禁止！兔耳神经血管丰富，抓耳朵会造成永久损伤。正确抱法：一手托胸一手托屁股。',
    author: '兔子救助中心',
    articleType: 'care',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20happy%20Holland%20Lop%20rabbit%20eating%20fresh%20hay%20and%20vegetables%2C%20proper%20rabbit%20care&image_size=landscape_16_9',
    createdAt: '2025-05-08T15:10:00Z',
    updatedAt: '2025-05-08T15:10:00Z'
  },
  {
    id: 'article-008',
    breedId: 'breed-010',
    title: '玄凤鹦鹉上手训练全攻略',
    summary: '从怕人到亲人，一步步教你培养粘人小太阳',
    content: '## 第一步：建立信任\n刚到家的鹦鹉先让它安静适应环境3-5天，不要打扰。之后每天在笼边轻声说话，让它熟悉你的声音和存在。\n\n## 第二步：手喂食物\n隔着笼子用手拿它爱吃的（小米穗、瓜子），等它愿意过来吃，再慢慢打开笼门。注意动作要慢！\n\n## 第三步：站手训练\n等它不抗拒你的手后，用手指轻轻抵住它的腹部，配合口令"上来"，只要站上来就奖励。\n\n## 最后：日常互动\n每天至少抽30-60分钟出笼互动。鹦鹉非常聪明，可以学简单的词语和小把戏，比如转圈、握手。',
    author: '鹦鹉训练达人',
    articleType: 'training',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20friendly%20Cockatiel%20perched%20on%20a%20person%27s%20finger%2C%20bonding%20moment%2C%20trust%20and%20affection&image_size=landscape_16_9',
    createdAt: '2025-05-22T10:50:00Z',
    updatedAt: '2025-05-22T10:50:00Z'
  }
];

export const mockContractTemplates: ContractTemplate[] = [
  {
    id: 'tpl-001',
    name: '宠物火化服务合同（标准版）',
    type: 'cremation',
    content: `宠物火化服务合同

合同编号：{{contractNo}}

甲方（服务提供方）：永恒宠物纪念服务中心
地址：北京市朝阳区XX路XX号
联系电话：400-XXX-XXXX

乙方（客户）：{{ownerName}}
身份证号：{{ownerIdCard}}
联系电话：{{ownerPhone}}
联系地址：{{ownerAddress}}

鉴于乙方委托甲方为其宠物提供火化服务，双方经友好协商，达成如下协议：

第一条 宠物信息
1.1 宠物姓名：{{petName}}
1.2 宠物品种：{{petBreed}}
1.3 宠物年龄：{{petAge}}
1.4 宠物性别：{{petGender}}

第二条 服务内容
2.1 服务类型：{{serviceType}}
2.2 火化方式：独立火化 / 集体火化
2.3 服务时间：{{serviceDate}}
2.4 服务地点：{{serviceLocation}}

第三条 费用及支付
3.1 服务总费用：人民币 {{totalAmount}} 元整
3.2 支付方式：现金 / 微信 / 支付宝 / 银行转账
3.3 乙方应在服务开始前支付全部费用

第四条 双方权利义务
4.1 甲方应按照约定时间、地点和标准提供火化服务
4.2 甲方应确保火化过程规范、尊重，保障骨灰的完整性
4.3 乙方应按时支付服务费用，提供真实准确的信息
4.4 乙方应遵守甲方服务场所的管理规定

第五条 骨灰处理
5.1 火化完成后，骨灰由：□ 家属领取  □ 骨灰堂寄存  □ 环保花葬
5.2 骨灰存放期限：{{storagePeriod}}
5.3 逾期未领取的骨灰，甲方有权按相关规定处理

第六条 违约责任
6.1 任何一方违反本合同约定，应承担相应的违约责任
6.2 因不可抗力导致服务无法履行的，双方均不承担违约责任

第七条 争议解决
本合同在履行过程中发生的争议，由双方协商解决；协商不成的，任何一方可向甲方所在地人民法院提起诉讼。

第八条 其他约定
8.1 本合同一式两份，甲乙双方各执一份，具有同等法律效力
8.2 本合同自双方签字（盖章）之日起生效

甲方（盖章）：__________________        乙方（签字）：__________________
授权代表签字：__________________        签署日期：______年____月____日
签署日期：______年____月____日`,
    variables: [
      { key: 'contractNo', label: '合同编号', required: true },
      { key: 'ownerName', label: '客户姓名', required: true },
      { key: 'ownerIdCard', label: '身份证号', required: true },
      { key: 'ownerPhone', label: '联系电话', required: true },
      { key: 'ownerAddress', label: '联系地址', required: false },
      { key: 'petName', label: '宠物姓名', required: true },
      { key: 'petBreed', label: '宠物品种', required: true },
      { key: 'petAge', label: '宠物年龄', required: true },
      { key: 'petGender', label: '宠物性别', required: true },
      { key: 'serviceType', label: '服务类型', defaultValue: '宠物火化服务', required: true },
      { key: 'serviceDate', label: '服务时间', required: true },
      { key: 'serviceLocation', label: '服务地点', required: true },
      { key: 'totalAmount', label: '服务总费用（元）', required: true },
      { key: 'storagePeriod', label: '骨灰存放期限', defaultValue: '1年', required: false }
    ],
    version: '1.0.0',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'tpl-002',
    name: '告别仪式服务合同',
    type: 'ceremony',
    content: `告别仪式服务合同

合同编号：{{contractNo}}

甲方（服务提供方）：永恒宠物纪念服务中心
地址：北京市朝阳区XX路XX号
联系电话：400-XXX-XXXX

乙方（客户）：{{ownerName}}
身份证号：{{ownerIdCard}}
联系电话：{{ownerPhone}}
联系地址：{{ownerAddress}}

鉴于乙方委托甲方为其宠物举办告别仪式服务，双方经友好协商，达成如下协议：

第一条 宠物信息
1.1 宠物姓名：{{petName}}
1.2 宠物品种：{{petBreed}}
1.3 与乙方关系：{{petRelation}}

第二条 仪式详情
2.1 仪式类型：{{ceremonyType}}
2.2 仪式时间：{{ceremonyDate}}
2.3 仪式地点：{{ceremonyLocation}}
2.4 预计参加人数：{{participantCount}}人
2.5 仪式主持人：{{hostName}}

第三条 套餐与服务
3.1 选定套餐：{{packageName}}
3.2 包含服务项目：
    - 仪式场地布置
    - 专业主持人
    - 鲜花装饰
    - 纪念照片打印
    - 视频录制
    - 其他：{{extraServices}}

第四条 费用及支付
4.1 服务总费用：人民币 {{totalAmount}} 元整
4.2 定金：人民币 {{depositAmount}} 元整（已含在总费用中）
4.3 支付方式：乙方应在签订本合同时支付定金，仪式前3日付清余款

第五条 双方权利义务
5.1 甲方应按约定提供仪式场地、设备和人员服务
5.2 甲方应尊重乙方及家属的情感，营造庄重温馨的氛围
5.3 乙方应按约定时间到达仪式现场，遵守场所管理规定
5.4 乙方应提前告知特殊需求或宗教习俗要求

第六条 变更与取消
6.1 乙方如需变更仪式时间或内容，应提前48小时通知甲方
6.2 乙方在仪式前24小时内取消的，定金不予退还
6.3 因不可抗力导致仪式无法举行的，双方协商解决

第七条 保密条款
甲方对仪式过程中获取的乙方个人信息和影像资料负有保密义务，未经乙方同意不得向第三方披露。

第八条 其他约定
8.1 本合同一式两份，甲乙双方各执一份，具有同等法律效力
8.2 本合同自双方签字（盖章）之日起生效

甲方（盖章）：__________________        乙方（签字）：__________________
授权代表签字：__________________        签署日期：______年____月____日
签署日期：______年____月____日`,
    variables: [
      { key: 'contractNo', label: '合同编号', required: true },
      { key: 'ownerName', label: '客户姓名', required: true },
      { key: 'ownerIdCard', label: '身份证号', required: true },
      { key: 'ownerPhone', label: '联系电话', required: true },
      { key: 'ownerAddress', label: '联系地址', required: false },
      { key: 'petName', label: '宠物姓名', required: true },
      { key: 'petBreed', label: '宠物品种', required: true },
      { key: 'petRelation', label: '与客户关系', defaultValue: '家庭成员', required: true },
      { key: 'ceremonyType', label: '仪式类型', defaultValue: '标准告别仪式', required: true },
      { key: 'ceremonyDate', label: '仪式时间', required: true },
      { key: 'ceremonyLocation', label: '仪式地点', required: true },
      { key: 'participantCount', label: '参加人数', defaultValue: '10', required: true },
      { key: 'hostName', label: '主持人', required: false },
      { key: 'packageName', label: '套餐名称', required: true },
      { key: 'extraServices', label: '附加服务', required: false },
      { key: 'totalAmount', label: '服务总费用（元）', required: true },
      { key: 'depositAmount', label: '定金（元）', defaultValue: '500', required: true }
    ],
    version: '1.0.0',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'tpl-003',
    name: '综合服务合同（火化+告别+骨灰寄存）',
    type: 'comprehensive',
    content: `宠物殡葬综合服务合同

合同编号：{{contractNo}}

甲方（服务提供方）：永恒宠物纪念服务中心
地址：北京市朝阳区XX路XX号
联系电话：400-XXX-XXXX

乙方（客户）：{{ownerName}}
身份证号：{{ownerIdCard}}
联系电话：{{ownerPhone}}

兹因乙方委托甲方为其已故宠物提供殡葬综合服务，经双方友好协商，达成如下协议：

第一条 宠物基本信息
1.1 宠物姓名：{{petName}}
1.2 宠物品种：{{petBreed}}
1.3 出生日期：{{petBirthDate}}
1.4 死亡日期：{{petDeathDate}}
1.5 死亡原因：{{petDeathReason}}

第二条 服务项目及内容
2.1 接送服务：□ 需要  □ 不需要；如需：接送地址{{pickupAddress}}
2.2 告别仪式：
    - 时间：{{ceremonyDate}}
    - 地点：{{ceremonyLocation}}
    - 类型：{{ceremonyType}}
    - 参加人数：{{participantCount}}人
2.3 火化服务：
    - 方式：□ 独立火化  □ 集体火化
    - 时间：{{cremationDate}}
2.4 骨灰处理：
    - □ 家属自行领取
    - □ 骨灰寄存：期限{{storagePeriod}}，位置{{storageLocation}}
    - □ 其他方式：{{ashDisposal}}

第三条 费用明细
3.1 接送服务费：{{transportFee}}元
3.2 告别仪式费：{{ceremonyFee}}元
3.3 火化服务费：{{cremationFee}}元
3.4 骨灰寄存费：{{storageFee}}元
3.5 其他费用：{{otherFee}}元（说明：{{otherFeeDesc}}）
3.6 费用合计：人民币 {{totalAmount}} 元整

第四条 付款方式
4.1 本合同签订时，乙方支付总费用的30%作为定金，即 {{depositAmount}}元
4.2 服务完成当日，乙方一次性支付余款 {{balanceAmount}}元

第五条 服务标准
5.1 甲方承诺所有服务均由专业人员操作，流程规范
5.2 火化过程全程可（视频）监督，确保骨灰纯净完整
5.3 仪式服务尊重客户宗教信仰和个人习俗

第六条 特殊约定
{{specialTerms}}

第七条 违约责任
7.1 甲方未能按约定提供服务的，应退还对应项目费用
7.2 乙方逾期付款的，按日支付应付金额0.5%的违约金
7.3 因不可抗力导致部分或全部服务无法履行的，双方协商退款或改期

第八条 争议解决
本合同履行中发生争议，双方友好协商解决；协商不成的，提交甲方所在地法院诉讼解决。

本合同一式两份，甲乙双方各执一份，签字盖章后生效。

甲方（盖章）：__________________        乙方（签字）：__________________
授权代表：______________________        日期：______年____月____日
日期：______年____月____日`,
    variables: [
      { key: 'contractNo', label: '合同编号', required: true },
      { key: 'ownerName', label: '客户姓名', required: true },
      { key: 'ownerIdCard', label: '身份证号', required: true },
      { key: 'ownerPhone', label: '联系电话', required: true },
      { key: 'petName', label: '宠物姓名', required: true },
      { key: 'petBreed', label: '宠物品种', required: true },
      { key: 'petBirthDate', label: '出生日期', required: false },
      { key: 'petDeathDate', label: '死亡日期', required: true },
      { key: 'petDeathReason', label: '死亡原因', required: false },
      { key: 'pickupAddress', label: '接送地址', required: false },
      { key: 'ceremonyDate', label: '仪式时间', required: true },
      { key: 'ceremonyLocation', label: '仪式地点', required: true },
      { key: 'ceremonyType', label: '仪式类型', required: true },
      { key: 'participantCount', label: '参加人数', defaultValue: '10', required: true },
      { key: 'cremationDate', label: '火化时间', required: true },
      { key: 'storagePeriod', label: '寄存期限', defaultValue: '3年', required: false },
      { key: 'storageLocation', label: '寄存位置', required: false },
      { key: 'ashDisposal', label: '骨灰其他处理方式', required: false },
      { key: 'transportFee', label: '接送服务费（元）', defaultValue: '0', required: true },
      { key: 'ceremonyFee', label: '告别仪式费（元）', required: true },
      { key: 'cremationFee', label: '火化服务费（元）', required: true },
      { key: 'storageFee', label: '骨灰寄存费（元）', defaultValue: '0', required: true },
      { key: 'otherFee', label: '其他费用（元）', defaultValue: '0', required: true },
      { key: 'otherFeeDesc', label: '其他费用说明', required: false },
      { key: 'totalAmount', label: '费用合计（元）', required: true },
      { key: 'depositAmount', label: '定金（元）', required: true },
      { key: 'balanceAmount', label: '余款（元）', required: true },
      { key: 'specialTerms', label: '特殊约定', defaultValue: '无', required: false }
    ],
    version: '1.0.0',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'tpl-004',
    name: '骨灰存放服务合同',
    type: 'urn-storage',
    content: `骨灰存放服务合同

合同编号：{{contractNo}}

甲方（存放方）：永恒宠物纪念服务中心
地址：北京市朝阳区XX路XX号
联系电话：400-XXX-XXXX

乙方（寄存方）：{{ownerName}}
身份证号：{{ownerIdCard}}
联系电话：{{ownerPhone}}
联系地址：{{ownerAddress}}

根据《中华人民共和国民法典》及相关法律法规，甲乙双方就宠物骨灰存放事宜，经友好协商，达成如下协议：

第一条 存放物品
1.1 物品名称：宠物骨灰（骨灰盒）
1.2 所属宠物：{{petName}}（{{petBreed}}）
1.3 骨灰盒规格：{{urnSpec}}
1.4 随存物品：{{extraItems}}

第二条 存放位置与期限
2.1 存放区域：{{storageArea}}
2.2 存放架位：第{{shelfNo}}层 第{{positionNo}}号
2.3 存放期限：自{{startDate}}起至{{endDate}}止，共计{{periodYears}}年
2.4 到期处理方式：□ 续费续存  □ 家属领取  □ 环保安葬

第三条 费用标准
3.1 年存放费：{{annualFee}}元/年
3.2 存放期限合计费用：人民币 {{totalAmount}} 元整
3.3 支付方式：一次性支付 / 按年支付
3.4 续费提醒：甲方应在到期前30天通知乙方续费

第四条 双方权利义务
4.1 甲方权利义务：
    （1）提供安全、整洁、肃穆的存放环境
    （2）配备专人管理，定期清洁维护
    （3）建立存取登记制度，保障物品安全
    （4）按约定提供祭扫服务
4.2 乙方权利义务：
    （1）按时足额支付存放费用
    （2）凭有效证件办理存取、祭扫手续
    （3）遵守甲方骨灰堂管理规定
    （4）联系方式变更时及时通知甲方

第五条 安全与责任
5.1 甲方对存放物品负有妥善保管义务
5.2 因不可抗力（地震、火灾等）造成损失的，甲方不承担赔偿责任
5.3 乙方逾期未续费超过6个月的，甲方有权按约定方式处理骨灰

第六条 祭扫规定
6.1 祭扫时间：工作日 9:00-17:00，节假日请提前预约
6.2 祭扫时请遵守秩序，不得喧哗、焚烧纸钱
6.3 每次祭扫人数不超过{{visitorLimit}}人

第七条 合同终止
7.1 存放期满，乙方办理领取手续后合同终止
7.2 存放期满乙方续费的，合同续期
7.3 一方严重违约，另一方有权解除合同

第八条 争议解决
本合同履行中发生争议，双方协商解决；协商不成的，可向甲方所在地人民法院起诉。

本合同一式两份，甲乙双方各执一份，签字盖章后生效。

甲方（盖章）：__________________        乙方（签字）：__________________
经办人签字：__________________          签署日期：______年____月____日
签署日期：______年____月____日`,
    variables: [
      { key: 'contractNo', label: '合同编号', required: true },
      { key: 'ownerName', label: '寄存人姓名', required: true },
      { key: 'ownerIdCard', label: '身份证号', required: true },
      { key: 'ownerPhone', label: '联系电话', required: true },
      { key: 'ownerAddress', label: '联系地址', required: false },
      { key: 'petName', label: '宠物姓名', required: true },
      { key: 'petBreed', label: '宠物品种', required: true },
      { key: 'urnSpec', label: '骨灰盒规格', required: true },
      { key: 'extraItems', label: '随存物品', defaultValue: '无', required: false },
      { key: 'storageArea', label: '存放区域', required: true },
      { key: 'shelfNo', label: '架层号', required: true },
      { key: 'positionNo', label: '位置号', required: true },
      { key: 'startDate', label: '起始日期', required: true },
      { key: 'endDate', label: '到期日期', required: true },
      { key: 'periodYears', label: '存放年限', required: true },
      { key: 'annualFee', label: '年费（元）', required: true },
      { key: 'totalAmount', label: '合计费用（元）', required: true },
      { key: 'visitorLimit', label: '祭扫人数上限', defaultValue: '6', required: false }
    ],
    version: '1.0.0',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'tpl-005',
    name: '宠物接送服务合同',
    type: 'transport',
    content: `宠物遗体接送服务合同

合同编号：{{contractNo}}

甲方（服务方）：永恒宠物纪念服务中心
联系电话：400-XXX-XXXX

乙方（委托方）：{{ownerName}}
联系电话：{{ownerPhone}}
身份证号：{{ownerIdCard}}

乙方因宠物身故，委托甲方提供宠物遗体接送服务，经双方协商一致，达成如下协议：

第一条 服务内容
1.1 接送宠物：{{petName}}（{{petBreed}}，体重约{{petWeight}}kg）
1.2 接运地点：{{pickupAddress}}
1.3 送达地点：{{deliveryAddress}}
1.4 预定接送时间：{{pickupDateTime}}

第二条 服务费用
2.1 基础接送费：{{baseFee}}元
2.2 里程附加费（超出{{baseKm}}公里）：{{kmFee}}元（{{extraKm}}公里 × {{perKmRate}}元/公里）
2.3 夜间附加费（22:00-06:00）：{{nightFee}}元
2.4 其他费用：{{otherFee}}元（说明：{{otherFeeDesc}}）
2.5 费用合计：人民币 {{totalAmount}} 元整

第三条 支付方式
3.1 □ 预约时一次性支付
3.2 □ 服务完成后现场支付（现金/扫码）

第四条 双方权利义务
4.1 甲方：
    （1）安排专业车辆和人员，按时到达指定地点
    （2）提供专用遗体袋/箱，尊重逝者，文明搬运
    （3）保证运输过程平稳，避免损坏
    （4）司机联系方式：{{driverPhone}}，车牌号：{{carPlate}}
4.2 乙方：
    （1）提供准确的接送地址和联系方式
    （2）按时到达接送地点等候
    （3）如实告知宠物状况（是否有传染病等特殊情况）
    （4）按约定支付服务费用

第五条 特殊约定
5.1 如遇交通管制、恶劣天气等不可抗力导致延误，双方协商调整时间
5.2 乙方取消服务：
    - 提前4小时以上取消：全额退款
    - 提前2-4小时取消：退还50%
    - 不足2小时取消：不予退款

第六条 争议解决
本合同履行中发生争议，双方友好协商解决；协商不成的，提交甲方所在地消费者协会调解或向法院起诉。

本合同一式两份，甲乙双方各执一份，签字后生效。

甲方（签字/盖章）：_______________      乙方（签字）：__________________
签署日期：______年____月____日            签署日期：______年____月____日`,
    variables: [
      { key: 'contractNo', label: '合同编号', required: true },
      { key: 'ownerName', label: '委托人姓名', required: true },
      { key: 'ownerPhone', label: '联系电话', required: true },
      { key: 'ownerIdCard', label: '身份证号', required: true },
      { key: 'petName', label: '宠物姓名', required: true },
      { key: 'petBreed', label: '宠物品种', required: true },
      { key: 'petWeight', label: '宠物体重（kg）', required: true },
      { key: 'pickupAddress', label: '接运地址', required: true },
      { key: 'deliveryAddress', label: '送达地址', required: true },
      { key: 'pickupDateTime', label: '接送时间', required: true },
      { key: 'baseFee', label: '基础接送费（元）', defaultValue: '300', required: true },
      { key: 'baseKm', label: '基础里程（公里）', defaultValue: '20', required: false },
      { key: 'kmFee', label: '里程附加费（元）', defaultValue: '0', required: false },
      { key: 'extraKm', label: '超出里程（公里）', defaultValue: '0', required: false },
      { key: 'perKmRate', label: '每公里单价（元）', defaultValue: '10', required: false },
      { key: 'nightFee', label: '夜间附加费（元）', defaultValue: '0', required: false },
      { key: 'otherFee', label: '其他费用（元）', defaultValue: '0', required: false },
      { key: 'otherFeeDesc', label: '其他费用说明', required: false },
      { key: 'totalAmount', label: '费用合计（元）', required: true },
      { key: 'driverPhone', label: '司机电话', required: false },
      { key: 'carPlate', label: '车牌号', required: false }
    ],
    version: '1.0.0',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

export const mockContracts: Contract[] = [
  {
    id: 'contract-001',
    contractNo: 'HT20250318001',
    templateId: 'tpl-001',
    type: 'cremation',
    title: '豆豆火化服务合同',
    content: '',
    petId: 'pet-001',
    ownerId: 'owner-001',
    cremationId: 'cremation-001',
    status: 'archived',
    totalAmount: 2600,
    signedAt: '2025-03-16T09:30:00Z',
    archivedAt: '2025-03-20T18:00:00Z',
    createdAt: '2025-03-16T09:00:00Z',
    updatedAt: '2025-03-20T18:00:00Z'
  },
  {
    id: 'contract-002',
    contractNo: 'HT20250318002',
    templateId: 'tpl-002',
    type: 'ceremony',
    title: '豆豆告别仪式服务合同',
    content: '',
    petId: 'pet-001',
    ownerId: 'owner-001',
    ceremonyId: 'ceremony-001',
    status: 'archived',
    totalAmount: 4999,
    signedAt: '2025-03-16T10:00:00Z',
    archivedAt: '2025-03-20T18:00:00Z',
    createdAt: '2025-03-16T09:30:00Z',
    updatedAt: '2025-03-20T18:00:00Z'
  },
  {
    id: 'contract-003',
    contractNo: 'HT20250113001',
    templateId: 'tpl-003',
    type: 'comprehensive',
    title: '旺财综合服务合同',
    content: '',
    petId: 'pet-003',
    ownerId: 'owner-001',
    ceremonyId: 'ceremony-002',
    cremationId: 'cremation-002',
    packageId: 'package-002',
    status: 'archived',
    totalAmount: 5999,
    signedAt: '2025-01-11T14:00:00Z',
    archivedAt: '2025-01-15T18:00:00Z',
    createdAt: '2025-01-11T10:00:00Z',
    updatedAt: '2025-01-15T18:00:00Z'
  },
  {
    id: 'contract-004',
    contractNo: 'HT20250423001',
    templateId: 'tpl-001',
    type: 'cremation',
    title: '咪咪火化服务合同',
    content: '',
    petId: 'pet-002',
    ownerId: 'owner-002',
    cremationId: 'cremation-003',
    status: 'signed',
    totalAmount: 2200,
    signedAt: '2025-04-22T11:30:00Z',
    createdAt: '2025-04-22T10:00:00Z',
    updatedAt: '2025-04-22T11:30:00Z'
  },
  {
    id: 'contract-005',
    contractNo: 'HT20250423002',
    templateId: 'tpl-004',
    type: 'urn-storage',
    title: '咪咪骨灰存放合同（3年）',
    content: '',
    petId: 'pet-002',
    ownerId: 'owner-002',
    status: 'pending',
    totalAmount: 1095,
    createdAt: '2025-04-23T09:00:00Z',
    updatedAt: '2025-04-23T09:00:00Z'
  },
  {
    id: 'contract-006',
    contractNo: 'HT20250506001',
    templateId: 'tpl-003',
    type: 'comprehensive',
    title: '雪球综合服务合同',
    content: '',
    petId: 'pet-004',
    ownerId: 'owner-003',
    status: 'draft',
    totalAmount: 0,
    createdAt: '2025-05-06T14:20:00Z',
    updatedAt: '2025-05-06T14:20:00Z'
  }
];

export const mockContractSignatures: ContractSignature[] = [
  {
    id: 'sig-001',
    contractId: 'contract-001',
    signatoryName: '永恒宠物纪念服务中心',
    signatoryRole: 'company',
    signatureData: 'data:image/png;base64,company-stamp-placeholder',
    signedAt: '2025-03-16T09:20:00Z',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'sig-002',
    contractId: 'contract-001',
    signatoryName: '张明华',
    signatoryRole: 'customer',
    signatureData: 'data:image/png;base64,customer-signature-placeholder',
    signedAt: '2025-03-16T09:30:00Z',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'sig-003',
    contractId: 'contract-002',
    signatoryName: '永恒宠物纪念服务中心',
    signatoryRole: 'company',
    signatureData: 'data:image/png;base64,company-stamp-placeholder',
    signedAt: '2025-03-16T09:50:00Z'
  },
  {
    id: 'sig-004',
    contractId: 'contract-002',
    signatoryName: '张明华',
    signatoryRole: 'customer',
    signatureData: 'data:image/png;base64,customer-signature-placeholder',
    signedAt: '2025-03-16T10:00:00Z'
  },
  {
    id: 'sig-005',
    contractId: 'contract-003',
    signatoryName: '永恒宠物纪念服务中心',
    signatoryRole: 'company',
    signatureData: 'data:image/png;base64,company-stamp-placeholder',
    signedAt: '2025-01-11T13:50:00Z'
  },
  {
    id: 'sig-006',
    contractId: 'contract-003',
    signatoryName: '张明华',
    signatoryRole: 'customer',
    signatureData: 'data:image/png;base64,customer-signature-placeholder',
    signedAt: '2025-01-11T14:00:00Z'
  },
  {
    id: 'sig-007',
    contractId: 'contract-004',
    signatoryName: '永恒宠物纪念服务中心',
    signatoryRole: 'company',
    signatureData: 'data:image/png;base64,company-stamp-placeholder',
    signedAt: '2025-04-22T11:20:00Z'
  },
  {
    id: 'sig-008',
    contractId: 'contract-004',
    signatoryName: '李小红',
    signatoryRole: 'customer',
    signatureData: 'data:image/png;base64,customer-signature-placeholder',
    signedAt: '2025-04-22T11:30:00Z'
  }
];

export const mockContractTimelines: ContractTimelineEntry[] = [
  { id: 'tl-001', contractId: 'contract-001', action: 'created', description: '创建火化服务合同', operator: '赵雅琴', timestamp: '2025-03-16T09:00:00Z' },
  { id: 'tl-002', contractId: 'contract-001', action: 'updated', description: '填写合同服务内容与费用明细', operator: '赵雅琴', timestamp: '2025-03-16T09:10:00Z' },
  { id: 'tl-003', contractId: 'contract-001', action: 'sent_for_signature', description: '发送合同给客户签署', operator: '赵雅琴', timestamp: '2025-03-16T09:15:00Z' },
  { id: 'tl-004', contractId: 'contract-001', action: 'signed', description: '公司方完成签署', operator: '孙丽华', timestamp: '2025-03-16T09:20:00Z' },
  { id: 'tl-005', contractId: 'contract-001', action: 'signed', description: '客户张明华完成签署', operator: '张明华', timestamp: '2025-03-16T09:30:00Z' },
  { id: 'tl-006', contractId: 'contract-001', action: 'all_signed', description: '合同全部签署完成', operator: '系统', timestamp: '2025-03-16T09:30:05Z' },
  { id: 'tl-007', contractId: 'contract-001', action: 'viewed', description: '查看合同详情', operator: '张师傅', timestamp: '2025-03-18T08:30:00Z' },
  { id: 'tl-008', contractId: 'contract-001', action: 'archived', description: '火化服务完成，合同自动归档', operator: '系统', timestamp: '2025-03-20T18:00:00Z' },
  { id: 'tl-009', contractId: 'contract-003', action: 'created', description: '创建综合服务合同', operator: '赵雅琴', timestamp: '2025-01-11T10:00:00Z' },
  { id: 'tl-010', contractId: 'contract-003', action: 'sent_for_signature', description: '发送合同给客户签署', operator: '赵雅琴', timestamp: '2025-01-11T13:00:00Z' },
  { id: 'tl-011', contractId: 'contract-003', action: 'signed', description: '公司方完成签署', operator: '孙丽华', timestamp: '2025-01-11T13:50:00Z' },
  { id: 'tl-012', contractId: 'contract-003', action: 'signed', description: '客户张明华完成签署', operator: '张明华', timestamp: '2025-01-11T14:00:00Z' },
  { id: 'tl-013', contractId: 'contract-003', action: 'all_signed', description: '合同全部签署完成', operator: '系统', timestamp: '2025-01-11T14:00:05Z' },
  { id: 'tl-014', contractId: 'contract-003', action: 'archived', description: '全部服务完成，合同自动归档', operator: '系统', timestamp: '2025-01-15T18:00:00Z' },
  { id: 'tl-015', contractId: 'contract-004', action: 'created', description: '创建火化服务合同', operator: '赵雅琴', timestamp: '2025-04-22T10:00:00Z' },
  { id: 'tl-016', contractId: 'contract-004', action: 'sent_for_signature', description: '发送合同给客户签署', operator: '赵雅琴', timestamp: '2025-04-22T11:00:00Z' },
  { id: 'tl-017', contractId: 'contract-004', action: 'signed', description: '公司方完成签署', operator: '孙丽华', timestamp: '2025-04-22T11:20:00Z' },
  { id: 'tl-018', contractId: 'contract-004', action: 'signed', description: '客户李小红完成签署', operator: '李小红', timestamp: '2025-04-22T11:30:00Z' },
  { id: 'tl-019', contractId: 'contract-004', action: 'all_signed', description: '合同全部签署完成', operator: '系统', timestamp: '2025-04-22T11:30:05Z' },
  { id: 'tl-020', contractId: 'contract-005', action: 'created', description: '创建骨灰存放合同', operator: '陈志远', timestamp: '2025-04-23T09:00:00Z' },
  { id: 'tl-021', contractId: 'contract-006', action: 'created', description: '创建综合服务合同（草稿）', operator: '赵雅琴', timestamp: '2025-05-06T14:20:00Z' }
];

export const mockPetLifeStories: PetLifeStory[] = [
  {
    id: 'story-001',
    petId: 'pet-001',
    ownerId: 'owner-001',
    title: '豆豆的金色岁月',
    description: '纪念我的金毛豆豆，陪伴我走过8年美好时光的忠诚伙伴。从毛茸茸的小奶狗到温顺的大暖男，每一段回忆都值得珍藏。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20beautiful%20golden%20retriever%20dog%20with%20wings%20in%20heaven%2C%20peaceful%20and%20warm%20sunset%20light%2C%20angelic%20pet%20memorial&image_size=landscape_16_9',
    isPublished: true,
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2025-04-10T14:30:00Z',
    nodes: [
      {
        id: 'node-001',
        storyId: 'story-001',
        title: '豆豆来到我家',
        content: '2017年5月10日，豆豆第一次来到我们家。小小的一只，蜷缩在纸箱里，眼睛还没完全睁开。那天阳光特别好，我就知道，这个小生命将成为我们家庭的重要一员。给他取名叫"豆豆"，希望他像小豆子一样充满生机。',
        date: '2017-05-10',
        type: 'birth',
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20tiny%20golden%20retriever%20puppy%20in%20a%20cardboard%20box%2C%20newborn%2C%20eyes%20closed%2C%20soft%20lighting%2C%20heartwarming&image_size=square_hd',
        sortOrder: 0,
        createdAt: '2025-03-20T10:00:00Z',
        updatedAt: '2025-03-20T10:00:00Z'
      },
      {
        id: 'node-002',
        storyId: 'story-001',
        title: '第一次学会坐下',
        content: '经过两周的耐心训练，豆豆终于学会了"坐下"这个指令！当他第一次听到口令后乖乖坐下，摇着尾巴等待奖励时，我激动得差点哭出来。那时候他才两个多月大，真是个聪明的孩子。',
        date: '2017-06-20',
        type: 'milestone',
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20cute%20golden%20retriever%20puppy%20sitting%20obediently%2C%20looking%20up%20at%20treat%2C%20happy%20expression%2C%20training%20session&image_size=square_hd',
        sortOrder: 1,
        createdAt: '2025-03-20T10:10:00Z',
        updatedAt: '2025-03-20T10:10:00Z'
      },
      {
        id: 'node-003',
        storyId: 'story-001',
        title: '第一次去海边',
        content: '2018年夏天，我们带豆豆去了北戴河。第一次见到大海的豆豆兴奋极了，在沙滩上奔跑，追逐浪花，还第一次尝到了海水的味道（看他皱眉的样子就知道很咸）。那天他玩得特别开心，回家路上在车里睡得呼呼的。',
        date: '2018-08-15',
        type: 'memory',
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20happy%20golden%20retriever%20playing%20on%20a%20beautiful%20beach%20at%20sunset%2C%20running%20through%20waves%2C%20joyful%20expression&image_size=square_hd',
        sortOrder: 2,
        createdAt: '2025-03-20T10:20:00Z',
        updatedAt: '2025-03-20T10:20:00Z'
      },
      {
        id: 'node-004',
        storyId: 'story-001',
        title: '成为守护哥哥',
        content: '2020年，我的儿子出生了。一开始我们还担心豆豆会嫉妒，没想到他立刻承担起了"守护哥哥"的责任。宝宝哭的时候他会第一个跑过去，宝宝学走路时他会在旁边慢慢跟着，生怕宝宝摔倒。豆豆成了宝宝最忠诚的玩伴和守护者。',
        date: '2020-03-01',
        type: 'milestone',
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20gentle%20golden%20retriever%20lying%20next%20to%20a%20sleeping%20baby%2C%20protective%20and%20loving%2C%20nursery%20room%2C%20warm%20atmosphere&image_size=square_hd',
        sortOrder: 3,
        createdAt: '2025-03-20T10:30:00Z',
        updatedAt: '2025-03-20T10:30:00Z'
      },
      {
        id: 'node-005',
        storyId: 'story-001',
        title: '5岁生日派对',
        content: '豆豆5岁生日那天，我们邀请了邻居家的狗狗朋友们一起来开派对。有生日蛋糕（狗狗专用的）、有礼物、还有好多零食。豆豆戴着生日帽，虽然有点不自在，但看得出他特别开心。那天拍了好多照片，每张里他都笑着。',
        date: '2022-05-10',
        type: 'memory',
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20golden%20retriever%20celebrating%20birthday%20with%20dog%20friends%2C%20wearing%20party%20hat%2C%20dog%20cake%2C%20festive%20atmosphere&image_size=square_hd',
        sortOrder: 4,
        createdAt: '2025-03-20T10:40:00Z',
        updatedAt: '2025-03-20T10:40:00Z'
      },
      {
        id: 'node-006',
        storyId: 'story-001',
        title: '慢慢变老的豆豆',
        content: '不知道从什么时候开始，豆豆的嘴边开始长出灰白的毛发，走路也慢了下来。以前能一口气跑几公里，现在走一会儿就要休息。但他看我的眼神还是那么温柔，每次回家他还是会努力摇着尾巴迎接我。我知道，他老了，但对我们的爱永远不会变。',
        date: '2024-09-01',
        type: 'growth',
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20senior%20golden%20retriever%20with%20grey%20muzzle%2C%20resting%20on%20a%20sunny%20couch%2C%20wise%20and%20gentle%20expression%2C%20peaceful&image_size=square_hd',
        sortOrder: 5,
        createdAt: '2025-03-20T10:50:00Z',
        updatedAt: '2025-03-20T10:50:00Z'
      },
      {
        id: 'node-007',
        storyId: 'story-001',
        title: '最后的告别',
        content: '2025年3月18日，豆豆永远地离开了我们。在他最后的时刻，我们全家人都陪在他身边，轻轻地摸着他的头，告诉他我们有多爱他。他走得很安详，就像睡着了一样。豆豆，谢谢你8年的陪伴，你永远是我们家庭的一员，永远活在我们心中。',
        date: '2025-03-18',
        type: 'departure',
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20beautiful%20sunset%20over%20ocean%20with%20a%20golden%20light%2C%20peaceful%20and%20serene%2C%20symbolizing%20farewell%20and%20eternal%20peace&image_size=square_hd',
        sortOrder: 6,
        createdAt: '2025-03-20T11:00:00Z',
        updatedAt: '2025-03-20T11:00:00Z'
      }
    ]
  },
  {
    id: 'story-002',
    petId: 'pet-003',
    ownerId: 'owner-001',
    title: '旺财的忠诚岁月',
    description: '12年的陪伴，旺财是我们家最忠诚的守护者。从农村到城市，他始终不离不弃，用一生诠释了"忠诚"二字。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20noble%20Chinese%20rural%20dog%20silhouette%20against%20sunset%2C%20loyal%20guardian%2C%20warm%20golden%20light%2C%20memorial&image_size=landscape_16_9',
    isPublished: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-02-01T14:30:00Z',
    nodes: [
      {
        id: 'node-008',
        storyId: 'story-002',
        title: '捡回家的小奶狗',
        content: '2013年的一个雨天，我在老家村口发现了瑟瑟发抖的小旺财。他被遗弃在纸箱里，脐带都还没完全脱落。我把他抱回了家，那时候他只有巴掌大。奶奶说他命大，就叫"旺财"吧，希望他能健康长大，给家里带来好运。',
        date: '2013-06-01',
        type: 'birth',
        sortOrder: 0,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      },
      {
        id: 'node-009',
        storyId: 'story-002',
        title: '看家护院的好帮手',
        content: '旺财慢慢长大，成了我们家最称职的"门卫"。但他从不乱咬人，熟人来了他会摇尾巴，只有陌生人靠近才会警觉地叫几声。村里的人都夸旺财懂事，也再也没有人敢来我家偷鸡摸狗了。',
        date: '2014-01-01',
        type: 'growth',
        sortOrder: 1,
        createdAt: '2025-01-15T10:10:00Z',
        updatedAt: '2025-01-15T10:10:00Z'
      },
      {
        id: 'node-010',
        storyId: 'story-002',
        title: '陪我度过高考',
        content: '高三那年，我每晚都学习到很晚。旺财总是静静地趴在我脚边，陪着我熬夜。有时候我太累了趴在桌上睡着，他会用头拱拱我的手，好像在提醒我去床上睡。高考那天，他一路送我到村口，摇着尾巴看着我离开。',
        date: '2016-06-07',
        type: 'milestone',
        sortOrder: 2,
        createdAt: '2025-01-15T10:20:00Z',
        updatedAt: '2025-01-15T10:20:00Z'
      },
      {
        id: 'node-011',
        storyId: 'story-002',
        title: '跟着我来到城市',
        content: '大学毕业后我留在了北京工作，最放心不下的就是旺财。犹豫了很久，最后决定把他也接过来。第一次坐长途车的旺财很紧张，但一直乖乖趴在我脚边。到了城市的他很不适应，总是趴在窗边望着老家的方向。过了好几个月，他才慢慢接受了这个新家。',
        date: '2020-10-01',
        type: 'milestone',
        sortOrder: 3,
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-15T10:30:00Z'
      },
      {
        id: 'node-012',
        storyId: 'story-002',
        title: '永远的守护者',
        content: '2025年1月13日，旺财在睡梦中安详地离开了。他活了12岁，对于中华田园犬来说已经算是高寿了。旺财，谢谢你用一生守护我们，从农村的土坯房到城市的高楼，你始终不离不弃。如果有来生，还做我的狗，好吗？',
        date: '2025-01-13',
        type: 'departure',
        sortOrder: 4,
        createdAt: '2025-01-15T10:40:00Z',
        updatedAt: '2025-01-15T10:40:00Z'
      }
    ]
  },
  {
    id: 'story-003',
    petId: 'pet-002',
    ownerId: 'owner-002',
    title: '咪咪的公主日记',
    description: '我的小公主咪咪，虽然只有短短5年的陪伴，但每一天都充满了她带来的温暖和欢乐。她永远是我心中最可爱的小公主。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20cute%20British%20Shorthair%20cat%20with%20angel%20wings%20on%20a%20pink%20cloud%2C%20dreamy%20and%20sweet%2C%20pet%20memorial&image_size=landscape_16_9',
    isPublished: false,
    createdAt: '2025-04-25T10:00:00Z',
    updatedAt: '2025-05-05T14:30:00Z',
    nodes: [
      {
        id: 'node-013',
        storyId: 'story-003',
        title: '选中了小公主',
        content: '2020年3月15日，我去猫舍看小猫。一窝小奶猫里，咪咪特别安静，只是用她那双圆圆的大眼睛静静地看着我。当我蹲下来时，她慢慢走过来，用小脑袋蹭了蹭我的手。那一刻我就知道，她就是我要找的猫咪。因为她娇小可爱，我给她取名"咪咪"，我的小公主。',
        date: '2020-03-15',
        type: 'birth',
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20tiny%20British%20Shorthair%20kitten%20with%20big%20round%20eyes%2C%20peeking%20from%20blanket%2C%20adorable%20and%20sweet&image_size=square_hd',
        sortOrder: 0,
        createdAt: '2025-04-25T10:00:00Z',
        updatedAt: '2025-04-25T10:00:00Z'
      },
      {
        id: 'node-014',
        storyId: 'story-003',
        title: '纸箱征服者',
        content: '咪咪有个奇怪的爱好——不管多大的纸箱，她都想钻进去。快递盒、鞋盒、收纳箱，只要是盒子她都要进去躺一躺。看着她明明很大一只却非要挤进小盒子里，滑稽又可爱。我给她买了豪华猫窝，她却偏偏最爱几块钱的快递盒，真是个节俭的小公主。',
        date: '2020-07-22',
        type: 'memory',
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20British%20Shorthair%20cat%20sitting%20happily%20in%20a%20too%20small%20cardboard%20box%2C%20silly%20and%20cute&image_size=square_hd',
        sortOrder: 1,
        createdAt: '2025-04-25T10:10:00Z',
        updatedAt: '2025-04-25T10:10:00Z'
      },
      {
        id: 'node-015',
        storyId: 'story-003',
        title: '第一次生病',
        content: '2022年冬天，咪咪突然开始呕吐，还不吃东西。我吓坏了，连夜带她去宠物医院。医生说是尿路感染，需要住院输液。那几天我每天下班都去陪她，她看到我就会虚弱地叫两声。好在治疗及时，一周后她就痊愈了。经过这次，我才意识到她对我有多重要。',
        date: '2022-12-01',
        type: 'growth',
        sortOrder: 2,
        createdAt: '2025-04-25T10:20:00Z',
        updatedAt: '2025-04-25T10:20:00Z'
      },
      {
        id: 'node-016',
        storyId: 'story-003',
        title: '陪我走过低谷',
        content: '2023年我经历了一次很严重的失恋，那段时间每天都以泪洗面。咪咪似乎察觉到了我的情绪，平时高傲的她那段时间特别粘人，总是蜷缩在我身边，用头蹭我的脸，好像在安慰我。有她的陪伴，那段最难熬的日子终于慢慢过去了。谢谢你，我的小棉袄。',
        date: '2023-05-20',
        type: 'milestone',
        sortOrder: 3,
        createdAt: '2025-04-25T10:30:00Z',
        updatedAt: '2025-04-25T10:30:00Z'
      },
      {
        id: 'node-017',
        storyId: 'story-003',
        title: '突然的离别',
        content: '2025年4月23日，咪咪突发心脏病离开了我。前一天晚上她还好好的，躺在我枕边陪我看剧，没想到第二天早上就...医生说这种病来得很快，她没有受太多痛苦。咪咪，谢谢你5年的陪伴，你永远是我最爱的小公主，在喵星球要继续快乐啊。',
        date: '2025-04-23',
        type: 'departure',
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20beautiful%20cherry%20blossom%20tree%20with%20pink%20petals%20falling%2C%20gentle%20breeze%2C%20peaceful%20and%20ethereal&image_size=square_hd',
        sortOrder: 4,
        createdAt: '2025-04-25T10:40:00Z',
        updatedAt: '2025-04-25T10:40:00Z'
      }
    ]
  }
];

export const mockMemorialProducts: MemorialProduct[] = [
  {
    id: 'mp-001',
    name: '青玉灵位牌',
    category: 'spirit-tablet',
    description: '精选天然青玉材质，手工雕刻宠物姓名与生卒日期，庄重典雅，永世留念。',
    price: 688,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Elegant%20jade%20spirit%20tablet%20memorial%20plaque%20with%20delicate%20carvings%20on%20a%20dark%20wood%20stand%2C%20traditional%20Chinese%20style%2C%20warm%20lighting%2C%20product%20photography&image_size=square_hd',
    material: '天然青玉',
    specs: '高20cm×宽12cm',
    stock: 50,
    sales: 128,
    createdAt: '2025-01-15T08:00:00Z'
  },
  {
    id: 'mp-002',
    name: '红木雕花灵位牌',
    category: 'spirit-tablet',
    description: '老红木精工雕花，配金色刻字，传统工艺与现代审美相结合，彰显尊贵与庄重。',
    price: 1288,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Red%20wood%20carved%20spirit%20memorial%20tablet%20with%20gold%20lettering%20on%20ornate%20stand%2C%20traditional%20craftsmanship%2C%20product%20photography&image_size=square_hd',
    material: '老红木',
    specs: '高25cm×宽15cm',
    stock: 30,
    sales: 76,
    createdAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'mp-003',
    name: '水晶天使纪念摆件',
    category: 'memorial-ornament',
    description: 'K9水晶材质，内雕天使守护造型，寓意小天使在天堂受到守护，温馨而美丽。',
    price: 398,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Crystal%20angel%20memorial%20ornament%20with%20inner%20carving%2C%20K9%20crystal%20material%2C%20soft%20light%20reflection%2C%20product%20photography%20on%20white%20background&image_size=square_hd',
    material: 'K9水晶',
    specs: '高12cm×宽8cm',
    stock: 80,
    sales: 215,
    createdAt: '2025-02-01T08:00:00Z'
  },
  {
    id: 'mp-004',
    name: '树脂爪印纪念摆件',
    category: 'memorial-ornament',
    description: '可定制宠物爪印造型，配彩色树脂浇注，独一无二的纪念方式，留住爱的印记。',
    price: 258,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Resin%20paw%20print%20memorial%20ornament%20with%20colorful%20resin%20fill%2C%20pet%20keepsake%2C%20warm%20tones%2C%20product%20photography&image_size=square_hd',
    material: '环保树脂',
    specs: '直径10cm',
    stock: 120,
    sales: 342,
    createdAt: '2025-02-10T08:00:00Z'
  },
  {
    id: 'mp-005',
    name: '青花瓷骨灰罐',
    category: 'urn',
    description: '景德镇青花瓷工艺，手工绘制祥云纹样，密封性优良，典雅而永恒的安息之所。',
    price: 1588,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Blue%20and%20white%20porcelain%20cremation%20urn%20with%20cloud%20patterns%2C%20Jingdezhen%20craftsmanship%2C%20elegant%20design%2C%20product%20photography&image_size=square_hd',
    material: '景德镇青花瓷',
    specs: '高18cm×直径12cm',
    stock: 25,
    sales: 89,
    createdAt: '2025-01-10T08:00:00Z'
  },
  {
    id: 'mp-006',
    name: '黑檀木骨灰罐',
    category: 'urn',
    description: '精选黑檀木整木车制，木质温润厚重，配铜质密封盖，守护永恒安宁。',
    price: 2388,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Ebony%20wood%20cremation%20urn%20with%20brass%20sealing%20lid%2C%20dark%20polished%20wood%20grain%2C%20dignified%20design%2C%20product%20photography&image_size=square_hd',
    material: '黑檀木',
    specs: '高16cm×直径14cm',
    stock: 15,
    sales: 45,
    createdAt: '2025-01-15T08:00:00Z'
  },
  {
    id: 'mp-007',
    name: '汉白玉宠物墓碑',
    category: 'pet-tombstone',
    description: '天然汉白玉材质，支持定制雕刻宠物照片、名字和寄语，庄严肃穆的永恒纪念。',
    price: 3688,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=White%20marble%20pet%20tombstone%20with%20elegant%20carving%2C%20cemetery%20memorial%20stone%2C%20dignified%20design%2C%20product%20photography&image_size=square_hd',
    material: '天然汉白玉',
    specs: '高40cm×宽30cm×厚8cm',
    stock: 10,
    sales: 33,
    createdAt: '2025-03-01T08:00:00Z'
  },
  {
    id: 'mp-008',
    name: '花岗岩宠物墓碑',
    category: 'pet-tombstone',
    description: '黑色花岗岩材质，耐候性极强，激光雕刻不褪色，户外安放无忧。',
    price: 2688,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Black%20granite%20pet%20gravestone%20with%20laser%20engraving%2C%20outdoor%20memorial%20marker%2C%20solemn%20design%2C%20product%20photography&image_size=square_hd',
    material: '黑色花岗岩',
    specs: '高35cm×宽25cm×厚6cm',
    stock: 20,
    sales: 52,
    createdAt: '2025-03-10T08:00:00Z'
  },
  {
    id: 'mp-009',
    name: '檀香祭祀套装',
    category: 'incense-candle',
    description: '印度老山檀香线香配铜质香炉，香气悠远绵长，为逝去的伙伴祈福安息。',
    price: 168,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sandalwood%20incense%20set%20with%20brass%20burner%2C%20traditional%20Chinese%20incense%20ceremony%2C%20warm%20lighting%2C%20product%20photography&image_size=square_hd',
    material: '印度老山檀香',
    specs: '线香100支+铜香炉',
    stock: 200,
    sales: 567,
    createdAt: '2025-02-20T08:00:00Z'
  },
  {
    id: 'mp-010',
    name: '长明烛礼盒',
    category: 'incense-candle',
    description: '特制无烟长明烛，燃烧时间长达72小时，寓意光明永不断绝，指引归途。',
    price: 88,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Elegant%20memorial%20candle%20gift%20box%20with%20white%20candles%2C%20soft%20warm%20glow%2C%20respectful%20design%2C%20product%20photography&image_size=square_hd',
    material: '植物蜡',
    specs: '4支装/72小时燃烧',
    stock: 300,
    sales: 890,
    createdAt: '2025-02-25T08:00:00Z'
  },
  {
    id: 'mp-011',
    name: '往生被（金色莲花纹）',
    category: 'afterlife-blanket',
    description: '金色莲花纹往生被，精工刺绣，寓意接引往生净土，覆盖骨灰罐或灵位，表达最后的祝福。',
    price: 358,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Golden%20lotus%20pattern%20Buddhist%20memorial%20blanket%2C%20embroidered%20silk%20fabric%2C%20traditional%20design%2C%20product%20photography&image_size=square_hd',
    material: '真丝缎面',
    specs: '60cm×60cm',
    stock: 60,
    sales: 178,
    createdAt: '2025-03-05T08:00:00Z'
  },
  {
    id: 'mp-012',
    name: '往生被（八宝祥云纹）',
    category: 'afterlife-blanket',
    description: '八宝祥云纹往生被，手工绣制，色泽庄重柔和，愿逝者在祥云之中安息。',
    price: 468,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Eight%20treasures%20auspicious%20cloud%20pattern%20memorial%20blanket%2C%20hand%20embroidered%2C%20solemn%20colors%2C%20product%20photography&image_size=square_hd',
    material: '织锦缎',
    specs: '80cm×80cm',
    stock: 40,
    sales: 95,
    createdAt: '2025-03-15T08:00:00Z'
  }
];

export const mockMemorialOrders: Order[] = [
  {
    id: 'order-001',
    orderNo: 'SM20250601001',
    items: [
      { productId: 'mp-001', quantity: 1 },
      { productId: 'mp-009', quantity: 2 }
    ],
    address: {
      name: '张明华',
      phone: '13800138001',
      addressType: 'urn-storage',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '宠爱纪念园A区3排-001号位',
      notes: '请放置在骨灰存放处'
    },
    totalAmount: 1024,
    status: 'placed',
    createdAt: '2025-06-01T10:30:00Z',
    paidAt: '2025-06-01T10:32:00Z',
    placedAt: '2025-06-03T14:00:00Z',
    placementPhotos: [
      {
        id: 'pp-001',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Memorial%20products%20placed%20at%20pet%20urn%20storage%20shelf%2C%20jade%20spirit%20tablet%20and%20incense%20set%20neatly%20arranged%2C%20warm%20memorial%20hall%20lighting&image_size=square_hd',
        caption: '灵位牌与檀香已放置在骨灰存放位',
        takenAt: '2025-06-03T14:00:00Z'
      },
      {
        id: 'pp-002',
        url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Close%20up%20of%20memorial%20items%20on%20shelf%2C%20incense%20burning%20softly%2C%20peaceful%20atmosphere%2C%20warm%20indoor%20lighting&image_size=square_hd',
        caption: '檀香已点燃祈福',
        takenAt: '2025-06-03T14:05:00Z'
      }
    ],
    placementNote: '已按照要求将灵位牌和檀香放置在骨灰存放处，并点燃檀香祈福。'
  },
  {
    id: 'order-002',
    orderNo: 'SM20250605002',
    items: [
      { productId: 'mp-005', quantity: 1 }
    ],
    address: {
      name: '李小红',
      phone: '13800138002',
      addressType: 'home',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      detail: '陆家嘴环路1000号2栋1801'
    },
    totalAmount: 1588,
    status: 'processing',
    createdAt: '2025-06-05T16:20:00Z',
    paidAt: '2025-06-05T16:22:00Z',
    placementPhotos: []
  }
];

export const mockFurnaces: Furnace[] = [
  {
    id: 'F-001',
    name: '1号火化炉',
    model: 'PET-CR-2000A',
    manufacturer: '永洁环保设备',
    installDate: '2023-06-15',
    maxTemperature: 1200,
    currentTemperature: 25,
    status: 'idle',
    totalUsageHours: 1520,
    lastMaintenanceDate: '2025-05-20',
    nextMaintenanceDate: '2025-08-20',
    notes: '高效节能型，适合中小型宠物',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2025-06-10T08:00:00Z'
  },
  {
    id: 'F-002',
    name: '2号火化炉',
    model: 'PET-CR-3000B',
    manufacturer: '永洁环保设备',
    installDate: '2023-06-15',
    maxTemperature: 1300,
    currentTemperature: 856,
    status: 'running',
    totalUsageHours: 1680,
    lastMaintenanceDate: '2025-04-18',
    nextMaintenanceDate: '2025-07-18',
    notes: '大型火化炉，适合大型宠物及批量火化',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2025-06-11T10:30:00Z'
  },
  {
    id: 'F-003',
    name: '3号火化炉',
    model: 'PET-CR-1500C',
    manufacturer: '安泰环保科技',
    installDate: '2024-03-20',
    maxTemperature: 1100,
    currentTemperature: 25,
    status: 'maintenance',
    totalUsageHours: 650,
    lastMaintenanceDate: '2025-02-10',
    nextMaintenanceDate: '2025-06-11',
    notes: '经济型火化炉，正在进行定期检修',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2025-06-11T09:00:00Z'
  }
];

export const mockFurnaceMaintenances: FurnaceMaintenance[] = [
  {
    id: 'fmain-001',
    furnaceId: 'F-001',
    type: 'cleaning',
    title: '炉膛深度清洁',
    description: '清除炉膛内积灰和残留物，检查烟道畅通情况，更换过滤棉。',
    performedBy: '设备科-王工',
    performedAt: '2025-05-20T14:00:00Z',
    nextDueDate: '2025-08-20',
    cost: 500,
    partsUsed: '耐高温过滤棉x2, 炉膛清洁剂x1'
  },
  {
    id: 'fmain-002',
    furnaceId: 'F-002',
    type: 'inspection',
    title: '季度安全检修',
    description: '全面检查燃烧系统、温控系统、尾气处理系统，校准温度传感器。',
    performedBy: '设备科-李工',
    performedAt: '2025-04-18T10:00:00Z',
    nextDueDate: '2025-07-18',
    cost: 1200,
    partsUsed: '温度传感器x1'
  },
  {
    id: 'fmain-003',
    furnaceId: 'F-001',
    type: 'repair',
    title: '点火系统维修',
    description: '点火器损坏导致无法正常点火，更换点火电极及高压包。',
    performedBy: '厂家售后-赵工',
    performedAt: '2025-03-15T09:30:00Z',
    cost: 3500,
    partsUsed: '点火电极x1, 高压包x1'
  },
  {
    id: 'fmain-004',
    furnaceId: 'F-003',
    type: 'parts-replacement',
    title: '更换燃烧室耐火砖',
    description: '燃烧室耐火砖出现裂纹，进行整体更换以防止热量损失。',
    performedBy: '设备科-王工',
    performedAt: '2025-02-10T08:00:00Z',
    nextDueDate: '2025-06-11',
    cost: 8000,
    partsUsed: '耐高温耐火砖x50块, 耐火水泥x2桶'
  }
];

export const mockFurnaceProcesses: FurnaceCremationProcess[] = [
  {
    id: 'fproc-001',
    furnaceId: 'F-002',
    cremationId: 'cremation-004',
    petName: '雪球',
    stage: 'constant',
    loadingTime: '2025-06-11T09:00:00Z',
    heatingTime: '2025-06-11T09:15:00Z',
    constantStartTime: '2025-06-11T10:00:00Z',
    targetTemperature: 900,
    temperatureHistory: [
      { time: '09:00', temperature: 25 },
      { time: '09:10', temperature: 180 },
      { time: '09:20', temperature: 420 },
      { time: '09:30', temperature: 650 },
      { time: '09:40', temperature: 820 },
      { time: '09:50', temperature: 890 },
      { time: '10:00', temperature: 900 },
      { time: '10:10', temperature: 905 },
      { time: '10:20', temperature: 898 },
      { time: '10:30', temperature: 856 }
    ],
    operator: '张师傅',
    notes: '萨摩耶，体重约28kg，预计恒温1.5小时',
    createdAt: '2025-06-11T09:00:00Z',
    updatedAt: '2025-06-11T10:30:00Z'
  }
];

export const mockTimeSlotLocks: TimeSlotLock[] = [
  {
    id: 'lock-001',
    date: '2025-06-15',
    timeSlot: '09:00 - 10:30',
    reason: '设备检修，暂停预约',
    lockedBy: '孙丽华',
    lockedAt: '2025-06-10T09:00:00Z'
  },
  {
    id: 'lock-002',
    date: '2025-06-15',
    timeSlot: '10:30 - 12:00',
    reason: '全员培训，暂停预约',
    lockedBy: '孙丽华',
    lockedAt: '2025-06-10T09:05:00Z'
  }
];

export const mockAppointmentChangeLogs: AppointmentChangeLog[] = [
  {
    id: 'alog-001',
    ceremonyId: 'ceremony-001',
    action: 'created',
    description: '创建预约，套餐：臻爱尊享套餐',
    operator: '张明华',
    timestamp: '2025-03-15T10:30:00Z'
  },
  {
    id: 'alog-002',
    ceremonyId: 'ceremony-001',
    action: 'status_changed',
    description: '预约状态从"待开始"变更为"进行中"',
    oldValue: 'pending',
    newValue: 'in-progress',
    operator: '系统',
    timestamp: '2025-03-18T10:00:00Z'
  },
  {
    id: 'alog-003',
    ceremonyId: 'ceremony-001',
    action: 'status_changed',
    description: '预约状态从"进行中"变更为"已完成"',
    oldValue: 'in-progress',
    newValue: 'completed',
    operator: '系统',
    timestamp: '2025-03-18T12:00:00Z'
  },
  {
    id: 'alog-004',
    ceremonyId: 'ceremony-002',
    action: 'created',
    description: '创建预约，套餐：温馨基础套餐',
    operator: '张明华',
    timestamp: '2025-01-11T09:00:00Z'
  },
  {
    id: 'alog-005',
    ceremonyId: 'ceremony-002',
    action: 'status_changed',
    description: '预约状态从"待开始"变更为"进行中"',
    oldValue: 'pending',
    newValue: 'in-progress',
    operator: '系统',
    timestamp: '2025-01-13T14:30:00Z'
  },
  {
    id: 'alog-006',
    ceremonyId: 'ceremony-002',
    action: 'status_changed',
    description: '预约状态从"进行中"变更为"已完成"',
    oldValue: 'in-progress',
    newValue: 'completed',
    operator: '系统',
    timestamp: '2025-01-13T17:00:00Z'
  },
  {
    id: 'alog-007',
    ceremonyId: 'ceremony-003',
    action: 'created',
    description: '创建预约，套餐：简约环保套餐',
    operator: '李小红',
    timestamp: '2025-04-22T15:00:00Z'
  }
];
