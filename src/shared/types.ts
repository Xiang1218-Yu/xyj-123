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
