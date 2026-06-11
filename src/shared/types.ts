export interface Owner {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: 'male' | 'female';
  photoUrl: string;
  ownerId: string;
  createdAt: string;
  notes?: string;
}

export interface CeremonyItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  category?: 'decoration' | 'supplies' | 'ritual' | 'other';
  note?: string;
}

export interface CeremonyFlowStep {
  id: string;
  title: string;
  description: string;
  duration?: number;
  sortOrder: number;
}

export type CeremonyTemplateType = 'traditional' | 'simple' | 'religious' | 'custom';

export const CeremonyTemplateTypeLabel: Record<CeremonyTemplateType, string> = {
  traditional: '传统仪式',
  simple: '简约仪式',
  religious: '宗教仪式',
  custom: '自定义仪式'
};

export interface CeremonyTemplate {
  id: string;
  name: string;
  type: CeremonyTemplateType;
  description: string;
  coverImage?: string;
  flowSteps: Omit<CeremonyFlowStep, 'id'>[];
  items: Omit<CeremonyItem, 'id'>[];
  estimatedDuration?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ceremony {
  id: string;
  petId: string;
  ceremonyTime: string;
  location: string;
  participants: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  packageId?: string;
  templateId?: string;
  templateType?: CeremonyTemplateType;
  flowSteps?: CeremonyFlowStep[];
  items?: CeremonyItem[];
}

export interface Cremation {
  id: string;
  petId: string;
  cremationTime: string;
  furnaceId: string;
  status: 'pending' | 'in-progress' | 'completed';
  operator?: string;
}

export type FurnaceStatus = 'idle' | 'running' | 'maintenance' | 'cleaning' | 'offline';

export const FurnaceStatusLabel: Record<FurnaceStatus, string> = {
  idle: '空闲',
  running: '运行中',
  maintenance: '检修中',
  cleaning: '清洁中',
  offline: '离线'
};

export const FurnaceStatusColor: Record<FurnaceStatus, string> = {
  idle: 'bg-green-500',
  running: 'bg-orange-500',
  maintenance: 'bg-yellow-500',
  cleaning: 'bg-blue-500',
  offline: 'bg-gray-500'
};

export interface Furnace {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  installDate: string;
  maxTemperature: number;
  currentTemperature: number;
  status: FurnaceStatus;
  totalUsageHours: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MaintenanceType = 'cleaning' | 'inspection' | 'repair' | 'parts-replacement';

export const MaintenanceTypeLabel: Record<MaintenanceType, string> = {
  cleaning: '清洁',
  inspection: '检修',
  repair: '维修',
  'parts-replacement': '零件更换'
};

export interface FurnaceMaintenance {
  id: string;
  furnaceId: string;
  type: MaintenanceType;
  title: string;
  description: string;
  performedBy: string;
  performedAt: string;
  nextDueDate?: string;
  cost?: number;
  partsUsed?: string;
}

export type CremationProcessStage = 'idle' | 'loading' | 'heating' | 'constant' | 'cooling' | 'unloading';

export const CremationProcessStageLabel: Record<CremationProcessStage, string> = {
  idle: '待开始',
  loading: '入炉',
  heating: '升温',
  constant: '恒温',
  cooling: '降温',
  unloading: '出炉'
};

export const CremationProcessStageColor: Record<CremationProcessStage, string> = {
  idle: 'bg-gray-400',
  loading: 'bg-blue-500',
  heating: 'bg-orange-500',
  constant: 'bg-red-500',
  cooling: 'bg-cyan-500',
  unloading: 'bg-green-500'
};

export interface TemperaturePoint {
  time: string;
  temperature: number;
}

export interface FurnaceCremationProcess {
  id: string;
  furnaceId: string;
  cremationId?: string;
  petName?: string;
  stage: CremationProcessStage;
  loadingTime?: string;
  heatingTime?: string;
  constantStartTime?: string;
  constantEndTime?: string;
  coolingStartTime?: string;
  unloadingTime?: string;
  completedTime?: string;
  targetTemperature: number;
  temperatureHistory: TemperaturePoint[];
  operator?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Urn {
  id: string;
  petId: string;
  area: string;
  shelf: string;
  position: string;
  storedDate: string;
  expiryDate?: string;
  status: 'stored' | 'retrieved';
}

export interface Reminder {
  id: string;
  petId: string;
  ownerId: string;
  title: string;
  remindDate: string;
  remindType: 'email' | 'sms' | 'both';
  frequency: 'once' | 'yearly';
  enabled: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'transport' | 'ceremony' | 'cremation' | 'memorial' | 'other';
  icon?: string;
}

export interface PackageServiceItem {
  serviceItemId: string;
  included: boolean;
  customPrice?: number;
}

export interface FuneralPackage {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  basePrice: number;
  isRecommended?: boolean;
  serviceItems: PackageServiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  albumId: string;
  url: string;
  note?: string;
  takenAt?: string;
  uploadedAt: string;
}

export interface Album {
  id: string;
  petId: string;
  ownerId: string;
  title: string;
  description?: string;
  coverPhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ShiftType = 'morning' | 'afternoon' | 'night' | 'rest';

export interface Employee {
  id: string;
  name: string;
  phone: string;
  role: 'ceremony-host' | 'cremation-operator' | 'receptionist' | 'storage-manager' | 'driver' | 'manager';
  status: 'active' | 'inactive';
  hireDate: string;
  avatarUrl?: string;
  notes?: string;
}

export interface ShiftSchedule {
  id: string;
  employeeId: string;
  date: string;
  shiftType: ShiftType;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'personal' | 'bereavement';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  shiftType: ShiftType;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'normal' | 'late' | 'early-leave' | 'absent';
}

export type PetCategory = 'dog' | 'cat' | 'rabbit' | 'bird' | 'hamster' | 'reptile' | 'other';

export const PetCategoryLabel: Record<PetCategory, string> = {
  dog: '犬类',
  cat: '猫类',
  rabbit: '兔类',
  bird: '鸟类',
  hamster: '仓鼠类',
  reptile: '爬行类',
  other: '其他'
};

export interface PetBreed {
  id: string;
  name: string;
  englishName?: string;
  category: PetCategory;
  origin?: string;
  lifespan?: string;
  weight?: string;
  height?: string;
  personality?: string[];
  appearance?: string;
  careGuide?: string;
  commonDiseases?: string[];
  suitableFor?: string[];
  history?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BreedArticle {
  id: string;
  breedId: string;
  title: string;
  summary?: string;
  content: string;
  author?: string;
  articleType: 'care' | 'health' | 'training' | 'diet' | 'behavior' | 'history' | 'other';
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export const ArticleTypeLabel: Record<BreedArticle['articleType'], string> = {
  care: '养护指南',
  health: '健康护理',
  training: '训练技巧',
  diet: '饮食营养',
  behavior: '行为解读',
  history: '品种历史',
  other: '其他'
};

export interface FavoriteBreed {
  breedId: string;
  favoritedAt: string;
}

export type ContractType = 'cremation' | 'ceremony' | 'comprehensive' | 'urn-storage' | 'transport' | 'other';

export const ContractTypeLabel: Record<ContractType, string> = {
  cremation: '火化服务合同',
  ceremony: '告别仪式合同',
  comprehensive: '综合服务合同',
  'urn-storage': '骨灰存放合同',
  transport: '接送服务合同',
  other: '其他服务合同'
};

export type ContractStatus = 'draft' | 'pending' | 'signed' | 'archived' | 'cancelled';

export const ContractStatusLabel: Record<ContractStatus, string> = {
  draft: '草稿',
  pending: '待签署',
  signed: '已签署',
  archived: '已归档',
  cancelled: '已取消'
};

export interface ContractVariable {
  key: string;
  label: string;
  defaultValue?: string;
  required: boolean;
}

export interface ContractTemplate {
  id: string;
  name: string;
  type: ContractType;
  content: string;
  variables: ContractVariable[];
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SignatoryRole = 'customer' | 'company' | 'witness';

export const SignatoryRoleLabel: Record<SignatoryRole, string> = {
  customer: '客户',
  company: '公司代表',
  witness: '见证人'
};

export interface ContractSignature {
  id: string;
  contractId: string;
  signatoryName: string;
  signatoryRole: SignatoryRole;
  signatureData: string;
  signedAt: string;
  ipAddress?: string;
}

export type ContractTimelineAction =
  | 'created'
  | 'updated'
  | 'sent_for_signature'
  | 'signed'
  | 'all_signed'
  | 'archived'
  | 'cancelled'
  | 'viewed';

export const ContractTimelineActionLabel: Record<ContractTimelineAction, string> = {
  created: '合同创建',
  updated: '合同更新',
  sent_for_signature: '发送签署',
  signed: '完成签署',
  all_signed: '全部签署完成',
  archived: '合同归档',
  cancelled: '合同取消',
  viewed: '合同查看'
};

export interface ContractTimelineEntry {
  id: string;
  contractId: string;
  action: ContractTimelineAction;
  description: string;
  operator: string;
  timestamp: string;
}

export interface Contract {
  id: string;
  contractNo: string;
  templateId: string;
  type: ContractType;
  title: string;
  content: string;
  petId?: string;
  ownerId?: string;
  ceremonyId?: string;
  cremationId?: string;
  packageId?: string;
  status: ContractStatus;
  totalAmount: number;
  signedAt?: string;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type StoryNodeType = 'birth' | 'growth' | 'milestone' | 'memory' | 'departure' | 'other';

export const StoryNodeTypeLabel: Record<StoryNodeType, string> = {
  birth: '诞生',
  growth: '成长',
  milestone: '里程碑',
  memory: '珍贵回忆',
  departure: '离别',
  other: '其他'
};

export const StoryNodeTypeColor: Record<StoryNodeType, string> = {
  birth: 'bg-pink-500',
  growth: 'bg-green-500',
  milestone: 'bg-blue-500',
  memory: 'bg-amber-500',
  departure: 'bg-slate-500',
  other: 'bg-purple-500'
};

export interface StoryNode {
  id: string;
  storyId: string;
  title: string;
  content: string;
  date: string;
  type: StoryNodeType;
  imageUrl?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PetLifeStory {
  id: string;
  petId: string;
  ownerId: string;
  title: string;
  description: string;
  coverImage?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  nodes: StoryNode[];
}

export type MemorialProductCategory =
  | 'spirit-tablet'
  | 'memorial-ornament'
  | 'urn'
  | 'pet-tombstone'
  | 'incense-candle'
  | 'afterlife-blanket';

export const MemorialProductCategoryLabel: Record<MemorialProductCategory, string> = {
  'spirit-tablet': '灵位牌',
  'memorial-ornament': '纪念摆件',
  urn: '骨灰罐',
  'pet-tombstone': '宠物墓碑',
  'incense-candle': '祭祀香烛',
  'afterlife-blanket': '往生被',
};

export interface MemorialProduct {
  id: string;
  name: string;
  category: MemorialProductCategory;
  description: string;
  price: number;
  imageUrl: string;
  material?: string;
  specs?: string;
  stock: number;
  sales: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type OrderStatus =
  | 'pending-payment'
  | 'paid'
  | 'processing'
  | 'placed'
  | 'completed';

export const OrderStatusLabel: Record<OrderStatus, string> = {
  'pending-payment': '待支付',
  paid: '已支付',
  processing: '备货中',
  placed: '已放置',
  completed: '已完成',
};

export type AddressType = 'home' | 'urn-storage' | 'cemetery';

export const AddressTypeLabel: Record<AddressType, string> = {
  home: '家庭住址',
  'urn-storage': '骨灰存放处',
  cemetery: '墓地/安放地',
};

export interface ShippingAddress {
  name: string;
  phone: string;
  addressType: AddressType;
  province: string;
  city: string;
  district: string;
  detail: string;
  notes?: string;
}

export interface OrderPlacementPhoto {
  id: string;
  url: string;
  caption?: string;
  takenAt: string;
}

export interface Order {
  id: string;
  orderNo: string;
  items: CartItem[];
  address: ShippingAddress;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  placedAt?: string;
  placementPhotos: OrderPlacementPhoto[];
  placementNote?: string;
}
