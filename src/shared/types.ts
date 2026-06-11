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

export interface Ceremony {
  id: string;
  petId: string;
  ceremonyTime: string;
  location: string;
  participants: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  packageId?: string;
}

export interface Cremation {
  id: string;
  petId: string;
  cremationTime: string;
  furnaceId: string;
  status: 'pending' | 'in-progress' | 'completed';
  operator?: string;
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
