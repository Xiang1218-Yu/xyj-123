import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Owner, Pet, Ceremony, Cremation, Urn, Reminder, ServiceItem, FuneralPackage, Album, Photo, Employee, ShiftSchedule, LeaveRequest, AttendanceRecord, PetBreed, BreedArticle, FavoriteBreed, ContractTemplate, Contract, ContractSignature, ContractTimelineEntry, ContractType, PetLifeStory, StoryNode, MemorialProduct, CartItem, Order, ShippingAddress, OrderPlacementPhoto, OrderStatus } from '../shared/types';
import {
  mockOwners,
  mockPets,
  mockCeremonies,
  mockCremations,
  mockUrns,
  mockReminders,
  mockServiceItems,
  mockFuneralPackages,
  mockAlbums,
  mockPhotos,
  mockEmployees,
  mockShiftSchedules,
  mockLeaveRequests,
  mockAttendanceRecords,
  mockPetBreeds,
  mockBreedArticles,
  mockContractTemplates,
  mockContracts,
  mockContractSignatures,
  mockContractTimelines,
  mockPetLifeStories,
  mockMemorialProducts,
  mockMemorialOrders
} from '../data/mockData';

interface AppState {
  owners: Owner[];
  pets: Pet[];
  ceremonies: Ceremony[];
  cremations: Cremation[];
  urns: Urn[];
  reminders: Reminder[];
  serviceItems: ServiceItem[];
  funeralPackages: FuneralPackage[];
  albums: Album[];
  photos: Photo[];
  employees: Employee[];
  shiftSchedules: ShiftSchedule[];
  leaveRequests: LeaveRequest[];
  attendanceRecords: AttendanceRecord[];

  petBreeds: PetBreed[];
  breedArticles: BreedArticle[];
  favoriteBreeds: FavoriteBreed[];

  contractTemplates: ContractTemplate[];
  contracts: Contract[];
  contractSignatures: ContractSignature[];
  contractTimelines: ContractTimelineEntry[];

  petLifeStories: PetLifeStory[];

  memorialProducts: MemorialProduct[];
  cartItems: CartItem[];
  memorialOrders: Order[];

  addOwner: (owner: Omit<Owner, 'id'>) => Owner;
  updateOwner: (id: string, data: Partial<Owner>) => void;
  deleteOwner: (id: string) => void;
  getOwnerById: (id: string) => Owner | undefined;

  addPet: (pet: Omit<Pet, 'id'>) => Pet;
  updatePet: (id: string, data: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  getPetById: (id: string) => Pet | undefined;

  addCeremony: (ceremony: Omit<Ceremony, 'id'>) => Ceremony;
  updateCeremony: (id: string, data: Partial<Ceremony>) => void;
  deleteCeremony: (id: string) => void;
  getCeremonyById: (id: string) => Ceremony | undefined;

  addCremation: (cremation: Omit<Cremation, 'id'>) => Cremation;
  updateCremation: (id: string, data: Partial<Cremation>) => void;
  deleteCremation: (id: string) => void;
  getCremationById: (id: string) => Cremation | undefined;

  addUrn: (urn: Omit<Urn, 'id'>) => Urn;
  updateUrn: (id: string, data: Partial<Urn>) => void;
  deleteUrn: (id: string) => void;
  getUrnById: (id: string) => Urn | undefined;

  addReminder: (reminder: Omit<Reminder, 'id'>) => Reminder;
  updateReminder: (id: string, data: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  getReminderById: (id: string) => Reminder | undefined;

  addServiceItem: (item: Omit<ServiceItem, 'id'>) => ServiceItem;
  updateServiceItem: (id: string, data: Partial<ServiceItem>) => void;
  deleteServiceItem: (id: string) => void;
  getServiceItemById: (id: string) => ServiceItem | undefined;

  addFuneralPackage: (pkg: Omit<FuneralPackage, 'id' | 'createdAt' | 'updatedAt'>) => FuneralPackage;
  updateFuneralPackage: (id: string, data: Partial<FuneralPackage>) => void;
  deleteFuneralPackage: (id: string) => void;
  getFuneralPackageById: (id: string) => FuneralPackage | undefined;
  calculatePackagePrice: (pkg: FuneralPackage) => number;

  addAlbum: (album: Omit<Album, 'id' | 'createdAt' | 'updatedAt'>) => Album;
  updateAlbum: (id: string, data: Partial<Album>) => void;
  deleteAlbum: (id: string) => void;
  getAlbumById: (id: string) => Album | undefined;
  getAlbumsByPetId: (petId: string) => Album[];
  getAlbumsByOwnerId: (ownerId: string) => Album[];

  addPhoto: (photo: Omit<Photo, 'id' | 'uploadedAt'>) => Photo;
  updatePhoto: (id: string, data: Partial<Photo>) => void;
  deletePhoto: (id: string) => void;
  getPhotoById: (id: string) => Photo | undefined;
  getPhotosByAlbumId: (albumId: string) => Photo[];

  addEmployee: (employee: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;

  addShiftSchedule: (schedule: Omit<ShiftSchedule, 'id'>) => ShiftSchedule;
  updateShiftSchedule: (id: string, data: Partial<ShiftSchedule>) => void;
  deleteShiftSchedule: (id: string) => void;
  getShiftsByEmployeeId: (employeeId: string) => ShiftSchedule[];
  getShiftsByDate: (date: string) => ShiftSchedule[];
  batchSetShifts: (schedules: Omit<ShiftSchedule, 'id'>[]) => void;

  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'createdAt'>) => LeaveRequest;
  updateLeaveRequest: (id: string, data: Partial<LeaveRequest>) => void;
  approveLeaveRequest: (id: string, reviewerId: string) => void;
  rejectLeaveRequest: (id: string, reviewerId: string) => void;
  getLeaveRequestsByEmployeeId: (employeeId: string) => LeaveRequest[];

  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => AttendanceRecord;
  updateAttendanceRecord: (id: string, data: Partial<AttendanceRecord>) => void;
  deleteAttendanceRecord: (id: string) => void;
  getAttendanceByEmployeeId: (employeeId: string) => AttendanceRecord[];
  getAttendanceByDate: (date: string) => AttendanceRecord[];
  getAttendanceByEmployeeAndDate: (employeeId: string, date: string) => AttendanceRecord | undefined;
  hasLeaveConflict: (employeeId: string, date: string) => boolean;
  syncAttendanceFromShifts: () => void;

  addPetBreed: (breed: Omit<PetBreed, 'id' | 'createdAt' | 'updatedAt'>) => PetBreed;
  updatePetBreed: (id: string, data: Partial<PetBreed>) => void;
  deletePetBreed: (id: string) => void;
  getPetBreedById: (id: string) => PetBreed | undefined;
  getPetBreedsByCategory: (category: PetBreed['category']) => PetBreed[];

  addBreedArticle: (article: Omit<BreedArticle, 'id' | 'createdAt' | 'updatedAt'>) => BreedArticle;
  updateBreedArticle: (id: string, data: Partial<BreedArticle>) => void;
  deleteBreedArticle: (id: string) => void;
  getBreedArticleById: (id: string) => BreedArticle | undefined;
  getBreedArticlesByBreedId: (breedId: string) => BreedArticle[];

  toggleFavoriteBreed: (breedId: string) => void;
  isBreedFavorited: (breedId: string) => boolean;

  addContractTemplate: (template: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>) => ContractTemplate;
  updateContractTemplate: (id: string, data: Partial<ContractTemplate>) => void;
  deleteContractTemplate: (id: string) => void;
  getContractTemplateById: (id: string) => ContractTemplate | undefined;
  getActiveTemplatesByType: (type: ContractType) => ContractTemplate[];

  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => Contract;
  updateContract: (id: string, data: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  getContractById: (id: string) => Contract | undefined;
  getContractsByPetId: (petId: string) => Contract[];
  getContractsByOwnerId: (ownerId: string) => Contract[];
  getContractsByStatus: (status: Contract['status']) => Contract[];
  generateContractNo: () => string;
  fillTemplateVariables: (templateContent: string, variables: Record<string, string>) => string;
  sendContractForSignature: (contractId: string, operator: string) => void;

  addContractSignature: (signature: Omit<ContractSignature, 'id' | 'signedAt'>) => ContractSignature;
  getSignaturesByContractId: (contractId: string) => ContractSignature[];
  checkAllSignaturesComplete: (contractId: string) => boolean;

  addContractTimelineEntry: (entry: Omit<ContractTimelineEntry, 'id' | 'timestamp'>) => ContractTimelineEntry;
  getTimelineByContractId: (contractId: string) => ContractTimelineEntry[];

  autoArchiveContract: (contractId: string, operator?: string) => void;
  archiveSignedContractsAutomatically: () => void;

  addPetLifeStory: (story: Omit<PetLifeStory, 'id' | 'createdAt' | 'updatedAt' | 'nodes'> & { nodes?: Omit<StoryNode, 'id' | 'storyId' | 'createdAt' | 'updatedAt'>[] }) => PetLifeStory;
  updatePetLifeStory: (id: string, data: Partial<Omit<PetLifeStory, 'id' | 'createdAt' | 'updatedAt' | 'nodes'>> & { nodes?: StoryNode[]; updatedAt?: string }) => void;
  deletePetLifeStory: (id: string) => void;
  getPetLifeStoryById: (id: string) => PetLifeStory | undefined;
  getPetLifeStoriesByPetId: (petId: string) => PetLifeStory[];
  getPetLifeStoriesByOwnerId: (ownerId: string) => PetLifeStory[];
  searchPetLifeStories: (keyword: string) => PetLifeStory[];
  addStoryNode: (storyId: string, node: Omit<StoryNode, 'id' | 'storyId' | 'createdAt' | 'updatedAt'>) => StoryNode;
  updateStoryNode: (storyId: string, nodeId: string, data: Partial<Omit<StoryNode, 'id' | 'storyId' | 'createdAt' | 'updatedAt'>>) => void;
  deleteStoryNode: (storyId: string, nodeId: string) => void;
  reorderStoryNodes: (storyId: string, nodes: StoryNode[]) => void;

  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getMemorialProductById: (id: string) => MemorialProduct | undefined;
  createOrder: (address: ShippingAddress) => Order;
  payOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addPlacementPhoto: (orderId: string, photo: Omit<OrderPlacementPhoto, 'id'>) => void;
  updatePlacementNote: (orderId: string, note: string) => void;
  getOrderById: (id: string) => Order | undefined;
  generateOrderNo: () => string;
}

const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      owners: mockOwners,
      pets: mockPets,
      ceremonies: mockCeremonies,
      cremations: mockCremations,
      urns: mockUrns,
      reminders: mockReminders,
      serviceItems: mockServiceItems,
      funeralPackages: mockFuneralPackages,
      albums: mockAlbums,
      photos: mockPhotos,
      employees: mockEmployees,
      shiftSchedules: mockShiftSchedules,
      leaveRequests: mockLeaveRequests,
      attendanceRecords: mockAttendanceRecords,
      petBreeds: mockPetBreeds,
      breedArticles: mockBreedArticles,
      favoriteBreeds: [],
      contractTemplates: mockContractTemplates,
      contracts: mockContracts,
      contractSignatures: mockContractSignatures,
      contractTimelines: mockContractTimelines,
      petLifeStories: mockPetLifeStories,
      memorialProducts: mockMemorialProducts,
      cartItems: [],
      memorialOrders: mockMemorialOrders,

      addOwner: (owner) => {
        const newOwner = { ...owner, id: generateId('owner') };
        set((state) => ({
          owners: [...state.owners, newOwner]
        }));
        return newOwner;
      },
      updateOwner: (id, data) =>
        set((state) => ({
          owners: state.owners.map((o) =>
            o.id === id ? { ...o, ...data } : o
          )
        })),
      deleteOwner: (id) =>
        set((state) => ({
          owners: state.owners.filter((o) => o.id !== id)
        })),
      getOwnerById: (id) => get().owners.find((o) => o.id === id),

      addPet: (pet) => {
        const newPet = { ...pet, id: generateId('pet') };
        set((state) => ({
          pets: [...state.pets, newPet]
        }));
        return newPet;
      },
      updatePet: (id, data) =>
        set((state) => ({
          pets: state.pets.map((p) => (p.id === id ? { ...p, ...data } : p))
        })),
      deletePet: (id) =>
        set((state) => ({
          pets: state.pets.filter((p) => p.id !== id)
        })),
      getPetById: (id) => get().pets.find((p) => p.id === id),

      addCeremony: (ceremony) => {
        const newCeremony = { ...ceremony, id: generateId('ceremony') };
        set((state) => ({
          ceremonies: [...state.ceremonies, newCeremony]
        }));
        return newCeremony;
      },
      updateCeremony: (id, data) =>
        set((state) => ({
          ceremonies: state.ceremonies.map((c) =>
            c.id === id ? { ...c, ...data } : c
          )
        })),
      deleteCeremony: (id) =>
        set((state) => ({
          ceremonies: state.ceremonies.filter((c) => c.id !== id)
        })),
      getCeremonyById: (id) => get().ceremonies.find((c) => c.id === id),

      addCremation: (cremation) => {
        const newCremation = { ...cremation, id: generateId('cremation') };
        set((state) => ({
          cremations: [...state.cremations, newCremation]
        }));
        return newCremation;
      },
      updateCremation: (id, data) =>
        set((state) => ({
          cremations: state.cremations.map((c) =>
            c.id === id ? { ...c, ...data } : c
          )
        })),
      deleteCremation: (id) =>
        set((state) => ({
          cremations: state.cremations.filter((c) => c.id !== id)
        })),
      getCremationById: (id) => get().cremations.find((c) => c.id === id),

      addUrn: (urn) => {
        const newUrn = { ...urn, id: generateId('urn') };
        set((state) => ({
          urns: [...state.urns, newUrn]
        }));
        return newUrn;
      },
      updateUrn: (id, data) =>
        set((state) => ({
          urns: state.urns.map((u) => (u.id === id ? { ...u, ...data } : u))
        })),
      deleteUrn: (id) =>
        set((state) => ({
          urns: state.urns.filter((u) => u.id !== id)
        })),
      getUrnById: (id) => get().urns.find((u) => u.id === id),

      addReminder: (reminder) => {
        const newReminder = { ...reminder, id: generateId('reminder') };
        set((state) => ({
          reminders: [...state.reminders, newReminder]
        }));
        return newReminder;
      },
      updateReminder: (id, data) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, ...data } : r
          )
        })),
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id)
        })),
      getReminderById: (id) => get().reminders.find((r) => r.id === id),

      addServiceItem: (item) => {
        const newItem = { ...item, id: generateId('service') };
        set((state) => ({
          serviceItems: [...state.serviceItems, newItem]
        }));
        return newItem;
      },
      updateServiceItem: (id, data) =>
        set((state) => ({
          serviceItems: state.serviceItems.map((s) =>
            s.id === id ? { ...s, ...data } : s
          )
        })),
      deleteServiceItem: (id) =>
        set((state) => ({
          serviceItems: state.serviceItems.filter((s) => s.id !== id)
        })),
      getServiceItemById: (id) => get().serviceItems.find((s) => s.id === id),

      addFuneralPackage: (pkg) => {
        const now = new Date().toISOString();
        const newPkg: FuneralPackage = {
          ...pkg,
          id: generateId('package'),
          createdAt: now,
          updatedAt: now
        };
        set((state) => ({
          funeralPackages: [...state.funeralPackages, newPkg]
        }));
        return newPkg;
      },
      updateFuneralPackage: (id, data) =>
        set((state) => ({
          funeralPackages: state.funeralPackages.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          )
        })),
      deleteFuneralPackage: (id) =>
        set((state) => ({
          funeralPackages: state.funeralPackages.filter((p) => p.id !== id)
        })),
      getFuneralPackageById: (id) => get().funeralPackages.find((p) => p.id === id),

      calculatePackagePrice: (pkg) => {
        let total = pkg.basePrice;
        pkg.serviceItems.forEach((psi) => {
          if (psi.included) {
            const serviceItem = get().serviceItems.find((s) => s.id === psi.serviceItemId);
            if (serviceItem) {
              total += psi.customPrice ?? serviceItem.price;
            }
          }
        });
        return total;
      },

      addAlbum: (album) => {
        const now = new Date().toISOString();
        const newAlbum: Album = {
          ...album,
          id: generateId('album'),
          createdAt: now,
          updatedAt: now
        };
        set((state) => ({
          albums: [...state.albums, newAlbum]
        }));
        return newAlbum;
      },
      updateAlbum: (id, data) =>
        set((state) => ({
          albums: state.albums.map((a) =>
            a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
          )
        })),
      deleteAlbum: (id) => {
        set((state) => ({
          albums: state.albums.filter((a) => a.id !== id),
          photos: state.photos.filter((p) => p.albumId !== id)
        }));
      },
      getAlbumById: (id) => get().albums.find((a) => a.id === id),
      getAlbumsByPetId: (petId) => get().albums.filter((a) => a.petId === petId),
      getAlbumsByOwnerId: (ownerId) => get().albums.filter((a) => a.ownerId === ownerId),

      addPhoto: (photo) => {
        const newPhoto: Photo = {
          ...photo,
          id: generateId('photo'),
          uploadedAt: new Date().toISOString()
        };
        set((state) => ({
          photos: [...state.photos, newPhoto]
        }));
        return newPhoto;
      },
      updatePhoto: (id, data) =>
        set((state) => ({
          photos: state.photos.map((p) =>
            p.id === id ? { ...p, ...data } : p
          )
        })),
      deletePhoto: (id) =>
        set((state) => ({
          photos: state.photos.filter((p) => p.id !== id)
        })),
      getPhotoById: (id) => get().photos.find((p) => p.id === id),
      getPhotosByAlbumId: (albumId) =>
        get().photos
          .filter((p) => p.albumId === albumId)
          .sort((a, b) => {
            const dateA = a.takenAt ?? a.uploadedAt;
            const dateB = b.takenAt ?? b.uploadedAt;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          }),

      addEmployee: (employee) => {
        const newEmployee = { ...employee, id: generateId('emp') };
        set((state) => ({
          employees: [...state.employees, newEmployee]
        }));
        return newEmployee;
      },
      updateEmployee: (id, data) =>
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, ...data } : e
          )
        })),
      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
          shiftSchedules: state.shiftSchedules.filter((s) => s.employeeId !== id),
          leaveRequests: state.leaveRequests.filter((l) => l.employeeId !== id),
          attendanceRecords: state.attendanceRecords.filter((a) => a.employeeId !== id)
        })),
      getEmployeeById: (id) => get().employees.find((e) => e.id === id),

      addShiftSchedule: (schedule) => {
        if (schedule.shiftType !== 'rest' && get().hasLeaveConflict(schedule.employeeId, schedule.date)) {
          throw new Error('该日期员工已有请假审批，无法安排非休息班次');
        }
        const newSchedule = { ...schedule, id: generateId('shift') };
        set((state) => {
          let newAttendanceRecords = state.attendanceRecords;
          if (schedule.shiftType !== 'rest') {
            const existing = state.attendanceRecords.find(
              (a) => a.employeeId === schedule.employeeId && a.date === schedule.date
            );
            if (!existing) {
              const newAttendance: AttendanceRecord = {
                id: generateId('att'),
                employeeId: schedule.employeeId,
                date: schedule.date,
                shiftType: schedule.shiftType,
                status: 'normal'
              };
              newAttendanceRecords = [...state.attendanceRecords, newAttendance];
            }
          }
          return {
            shiftSchedules: [...state.shiftSchedules, newSchedule],
            attendanceRecords: newAttendanceRecords
          };
        });
        return newSchedule;
      },
      updateShiftSchedule: (id, data) => {
        const existing = get().shiftSchedules.find((s) => s.id === id);
        if (!existing) return;
        const newShiftType = data.shiftType ?? existing.shiftType;
        const targetDate = data.date ?? existing.date;
        const targetEmployeeId = data.employeeId ?? existing.employeeId;
        if (newShiftType !== 'rest' && get().hasLeaveConflict(targetEmployeeId, targetDate)) {
          throw new Error('该日期员工已有请假审批，无法安排非休息班次');
        }
        set((state) => {
          const updatedSchedules = state.shiftSchedules.map((s) =>
            s.id === id ? { ...s, ...data } : s
          );
          let updatedAttendance = state.attendanceRecords;
          if (newShiftType === 'rest') {
            updatedAttendance = updatedAttendance.filter(
              (a) => !(a.employeeId === targetEmployeeId && a.date === targetDate)
            );
          } else {
            const existingAttendance = updatedAttendance.find(
              (a) => a.employeeId === targetEmployeeId && a.date === targetDate
            );
            if (existingAttendance) {
              updatedAttendance = updatedAttendance.map((a) =>
                a.id === existingAttendance.id ? { ...a, shiftType: newShiftType } : a
              );
            } else {
              const newAttendance: AttendanceRecord = {
                id: generateId('att'),
                employeeId: targetEmployeeId,
                date: targetDate,
                shiftType: newShiftType,
                status: 'normal'
              };
              updatedAttendance = [...updatedAttendance, newAttendance];
            }
          }
          return {
            shiftSchedules: updatedSchedules,
            attendanceRecords: updatedAttendance
          };
        });
      },
      deleteShiftSchedule: (id) => {
        const schedule = get().shiftSchedules.find((s) => s.id === id);
        set((state) => ({
          shiftSchedules: state.shiftSchedules.filter((s) => s.id !== id),
          attendanceRecords: schedule && schedule.shiftType !== 'rest'
            ? state.attendanceRecords.filter(
                (a) => !(a.employeeId === schedule.employeeId && a.date === schedule.date)
              )
            : state.attendanceRecords
        }));
      },
      getShiftsByEmployeeId: (employeeId) =>
        get().shiftSchedules.filter((s) => s.employeeId === employeeId),
      getShiftsByDate: (date) =>
        get().shiftSchedules.filter((s) => s.date === date),
      batchSetShifts: (schedules) => {
        const state = get();
        for (const s of schedules) {
          if (s.shiftType !== 'rest' && state.hasLeaveConflict(s.employeeId, s.date)) {
            throw new Error(`员工在 ${s.date} 已有请假审批，无法安排非休息班次`);
          }
        }
        const newSchedules = schedules.map((s) => ({
          ...s,
          id: generateId('shift')
        }));
        set((state) => {
          const newAttendance = [...state.attendanceRecords];
          for (const s of newSchedules) {
            if (s.shiftType === 'rest') continue;
            const existing = newAttendance.find(
              (a) => a.employeeId === s.employeeId && a.date === s.date
            );
            if (!existing) {
              newAttendance.push({
                id: generateId('att'),
                employeeId: s.employeeId,
                date: s.date,
                shiftType: s.shiftType,
                status: 'normal'
              });
            }
          }
          return {
            shiftSchedules: [...state.shiftSchedules, ...newSchedules],
            attendanceRecords: newAttendance
          };
        });
      },

      addLeaveRequest: (request) => {
        const newRequest: LeaveRequest = {
          ...request,
          id: generateId('leave'),
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          leaveRequests: [...state.leaveRequests, newRequest]
        }));
        return newRequest;
      },
      updateLeaveRequest: (id, data) =>
        set((state) => ({
          leaveRequests: state.leaveRequests.map((l) =>
            l.id === id ? { ...l, ...data } : l
          )
        })),
      approveLeaveRequest: (id, reviewerId) =>
        set((state) => ({
          leaveRequests: state.leaveRequests.map((l) =>
            l.id === id
              ? { ...l, status: 'approved' as const, reviewedBy: reviewerId, reviewedAt: new Date().toISOString() }
              : l
          )
        })),
      rejectLeaveRequest: (id, reviewerId) =>
        set((state) => ({
          leaveRequests: state.leaveRequests.map((l) =>
            l.id === id
              ? { ...l, status: 'rejected' as const, reviewedBy: reviewerId, reviewedAt: new Date().toISOString() }
              : l
          )
        })),
      getLeaveRequestsByEmployeeId: (employeeId) =>
        get().leaveRequests.filter((l) => l.employeeId === employeeId),

      addAttendanceRecord: (record) => {
        const newRecord = { ...record, id: generateId('att') };
        set((state) => ({
          attendanceRecords: [...state.attendanceRecords, newRecord]
        }));
        return newRecord;
      },
      updateAttendanceRecord: (id, data) =>
        set((state) => ({
          attendanceRecords: state.attendanceRecords.map((a) =>
            a.id === id ? { ...a, ...data } : a
          )
        })),
      deleteAttendanceRecord: (id) =>
        set((state) => ({
          attendanceRecords: state.attendanceRecords.filter((a) => a.id !== id)
        })),
      getAttendanceByEmployeeId: (employeeId) =>
        get().attendanceRecords.filter((a) => a.employeeId === employeeId),
      getAttendanceByDate: (date) =>
        get().attendanceRecords.filter((a) => a.date === date),
      getAttendanceByEmployeeAndDate: (employeeId, date) =>
        get().attendanceRecords.find((a) => a.employeeId === employeeId && a.date === date),
      hasLeaveConflict: (employeeId, date) => {
        const state = get();
        return state.leaveRequests.some((l) => {
          if (l.employeeId !== employeeId || l.status !== 'approved') return false;
          return date >= l.startDate && date <= l.endDate;
        });
      },
      syncAttendanceFromShifts: () => {
        const state = get();
        const recordsToAdd: AttendanceRecord[] = [];
        for (const shift of state.shiftSchedules) {
          if (shift.shiftType === 'rest') continue;
          const existing = state.attendanceRecords.find(
            (a) => a.employeeId === shift.employeeId && a.date === shift.date
          );
          if (!existing) {
            recordsToAdd.push({
              id: generateId('att'),
              employeeId: shift.employeeId,
              date: shift.date,
              shiftType: shift.shiftType,
              status: 'normal'
            });
          }
        }
        if (recordsToAdd.length > 0) {
          set((state) => ({
            attendanceRecords: [...state.attendanceRecords, ...recordsToAdd]
          }));
        }
      },

      addPetBreed: (breed) => {
        const now = new Date().toISOString();
        const newBreed: PetBreed = {
          ...breed,
          id: generateId('breed'),
          createdAt: now,
          updatedAt: now
        };
        set((state) => ({
          petBreeds: [...state.petBreeds, newBreed]
        }));
        return newBreed;
      },
      updatePetBreed: (id, data) =>
        set((state) => ({
          petBreeds: state.petBreeds.map((b) =>
            b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b
          )
        })),
      deletePetBreed: (id) =>
        set((state) => ({
          petBreeds: state.petBreeds.filter((b) => b.id !== id),
          breedArticles: state.breedArticles.filter((a) => a.breedId !== id),
          favoriteBreeds: state.favoriteBreeds.filter((f) => f.breedId !== id)
        })),
      getPetBreedById: (id) => get().petBreeds.find((b) => b.id === id),
      getPetBreedsByCategory: (category) =>
        get().petBreeds.filter((b) => b.category === category),

      addBreedArticle: (article) => {
        const now = new Date().toISOString();
        const newArticle: BreedArticle = {
          ...article,
          id: generateId('article'),
          createdAt: now,
          updatedAt: now
        };
        set((state) => ({
          breedArticles: [...state.breedArticles, newArticle]
        }));
        return newArticle;
      },
      updateBreedArticle: (id, data) =>
        set((state) => ({
          breedArticles: state.breedArticles.map((a) =>
            a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
          )
        })),
      deleteBreedArticle: (id) =>
        set((state) => ({
          breedArticles: state.breedArticles.filter((a) => a.id !== id)
        })),
      getBreedArticleById: (id) => get().breedArticles.find((a) => a.id === id),
      getBreedArticlesByBreedId: (breedId) =>
        get()
          .breedArticles.filter((a) => a.breedId === breedId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

      toggleFavoriteBreed: (breedId) =>
        set((state) => {
          const exists = state.favoriteBreeds.find((f) => f.breedId === breedId);
          if (exists) {
            return {
              favoriteBreeds: state.favoriteBreeds.filter((f) => f.breedId !== breedId)
            };
          }
          return {
            favoriteBreeds: [
              ...state.favoriteBreeds,
              { breedId, favoritedAt: new Date().toISOString() }
            ]
          };
        }),
      isBreedFavorited: (breedId) =>
        get().favoriteBreeds.some((f) => f.breedId === breedId),

      addContractTemplate: (template) => {
        const now = new Date().toISOString();
        const newTemplate: ContractTemplate = {
          ...template,
          id: generateId('tpl'),
          createdAt: now,
          updatedAt: now
        };
        set((state) => ({
          contractTemplates: [...state.contractTemplates, newTemplate]
        }));
        return newTemplate;
      },
      updateContractTemplate: (id, data) =>
        set((state) => ({
          contractTemplates: state.contractTemplates.map((t) =>
            t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
          )
        })),
      deleteContractTemplate: (id) =>
        set((state) => ({
          contractTemplates: state.contractTemplates.filter((t) => t.id !== id)
        })),
      getContractTemplateById: (id) => get().contractTemplates.find((t) => t.id === id),
      getActiveTemplatesByType: (type) =>
        get().contractTemplates.filter((t) => t.type === type && t.isActive),

      addContract: (contract) => {
        const now = new Date().toISOString();
        const newContract: Contract = {
          ...contract,
          id: generateId('contract'),
          createdAt: now,
          updatedAt: now
        };
        set((state) => ({
          contracts: [...state.contracts, newContract]
        }));
        get().addContractTimelineEntry({
          contractId: newContract.id,
          action: 'created',
          description: `创建${newContract.title}`,
          operator: '管理员'
        });
        return newContract;
      },
      updateContract: (id, data) => {
        const old = get().getContractById(id);
        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
          )
        }));
        if (old) {
          get().addContractTimelineEntry({
            contractId: id,
            action: 'updated',
            description: '更新合同内容',
            operator: '管理员'
          });
        }
      },
      deleteContract: (id) =>
        set((state) => ({
          contracts: state.contracts.filter((c) => c.id !== id),
          contractSignatures: state.contractSignatures.filter((s) => s.contractId !== id),
          contractTimelines: state.contractTimelines.filter((t) => t.contractId !== id)
        })),
      getContractById: (id) => get().contracts.find((c) => c.id === id),
      getContractsByPetId: (petId) => get().contracts.filter((c) => c.petId === petId),
      getContractsByOwnerId: (ownerId) => get().contracts.filter((c) => c.ownerId === ownerId),
      getContractsByStatus: (status) => get().contracts.filter((c) => c.status === status),
      generateContractNo: () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const count = get().contracts.filter((c) =>
          c.contractNo.startsWith(`HT${y}${m}${d}`)
        ).length + 1;
        return `HT${y}${m}${d}${String(count).padStart(3, '0')}`;
      },
      fillTemplateVariables: (templateContent, variables) => {
        let result = templateContent;
        Object.entries(variables).forEach(([key, value]) => {
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
          result = result.replace(regex, value || '');
        });
        return result;
      },
      sendContractForSignature: (contractId, operator) => {
        get().updateContract(contractId, { status: 'pending' });
        get().addContractTimelineEntry({
          contractId,
          action: 'sent_for_signature',
          description: '发送合同给各方签署',
          operator
        });
      },

      addContractSignature: (signature) => {
        const now = new Date().toISOString();
        const newSig: ContractSignature = {
          ...signature,
          id: generateId('sig'),
          signedAt: now
        };
        set((state) => ({
          contractSignatures: [...state.contractSignatures, newSig]
        }));
        const roleLabel = signature.signatoryRole === 'customer' ? '客户' :
          signature.signatoryRole === 'company' ? '公司代表' : '见证人';
        get().addContractTimelineEntry({
          contractId: signature.contractId,
          action: 'signed',
          description: `${roleLabel}${signature.signatoryName}完成签署`,
          operator: signature.signatoryName
        });
        if (get().checkAllSignaturesComplete(signature.contractId)) {
          get().updateContract(signature.contractId, {
            status: 'signed',
            signedAt: now
          });
          get().addContractTimelineEntry({
            contractId: signature.contractId,
            action: 'all_signed',
            description: '合同全部签署完成',
            operator: '系统'
          });
        }
        return newSig;
      },
      getSignaturesByContractId: (contractId) =>
        get().contractSignatures.filter((s) => s.contractId === contractId),
      checkAllSignaturesComplete: (contractId) => {
        const sigs = get().getSignaturesByContractId(contractId);
        const hasCompany = sigs.some((s) => s.signatoryRole === 'company');
        const hasCustomer = sigs.some((s) => s.signatoryRole === 'customer');
        return hasCompany && hasCustomer;
      },

      addContractTimelineEntry: (entry) => {
        const newEntry: ContractTimelineEntry = {
          ...entry,
          id: generateId('tl'),
          timestamp: new Date().toISOString()
        };
        set((state) => ({
          contractTimelines: [...state.contractTimelines, newEntry]
        }));
        return newEntry;
      },
      getTimelineByContractId: (contractId) =>
        get()
          .contractTimelines.filter((t) => t.contractId === contractId)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),

      autoArchiveContract: (contractId, operator = '系统') => {
        const contract = get().getContractById(contractId);
        if (contract && contract.status === 'signed') {
          const now = new Date().toISOString();
          set((state) => ({
            contracts: state.contracts.map((c) =>
              c.id === contractId ? { ...c, status: 'archived', archivedAt: now, updatedAt: now } : c
            )
          }));
          get().addContractTimelineEntry({
            contractId,
            action: 'archived',
            description: '服务完成，合同自动归档',
            operator
          });
        }
      },
      archiveSignedContractsAutomatically: () => {
        const signed = get().getContractsByStatus('signed');
        signed.forEach((c) => {
          if (c.signedAt) {
            const signedDate = new Date(c.signedAt);
            const diffDays = (Date.now() - signedDate.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays >= 7) {
              get().autoArchiveContract(c.id, '系统自动归档');
            }
          }
        });
      },

      addPetLifeStory: (story) => {
        const now = new Date().toISOString();
        const newStory: PetLifeStory = {
          ...story,
          id: generateId('story'),
          createdAt: now,
          updatedAt: now,
          nodes: (story.nodes || []).map((node, index) => ({
            ...node,
            id: generateId('node'),
            storyId: '',
            sortOrder: index,
            createdAt: now,
            updatedAt: now
          }))
        };
        newStory.nodes = newStory.nodes.map(node => ({ ...node, storyId: newStory.id }));
        set((state) => ({
          petLifeStories: [...state.petLifeStories, newStory]
        }));
        return newStory;
      },
      updatePetLifeStory: (id, data) =>
        set((state) => ({
          petLifeStories: state.petLifeStories.map((s) =>
            s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
          )
        })),
      deletePetLifeStory: (id) =>
        set((state) => ({
          petLifeStories: state.petLifeStories.filter((s) => s.id !== id)
        })),
      getPetLifeStoryById: (id) => get().petLifeStories.find((s) => s.id === id),
      getPetLifeStoriesByPetId: (petId) =>
        get().petLifeStories.filter((s) => s.petId === petId),
      getPetLifeStoriesByOwnerId: (ownerId) =>
        get().petLifeStories.filter((s) => s.ownerId === ownerId),
      searchPetLifeStories: (keyword) => {
        const stories = get().petLifeStories;
        const pets = get().pets;
        return stories.filter((story) => {
          const pet = pets.find((p) => p.id === story.petId);
          const petName = pet?.name || '';
          return (
            story.title.toLowerCase().includes(keyword.toLowerCase()) ||
            story.description.toLowerCase().includes(keyword.toLowerCase()) ||
            petName.toLowerCase().includes(keyword.toLowerCase())
          );
        });
      },
      addStoryNode: (storyId, node) => {
        const now = new Date().toISOString();
        const story = get().getPetLifeStoryById(storyId);
        if (!story) throw new Error('Story not found');
        const newNode: StoryNode = {
          ...node,
          id: generateId('node'),
          storyId,
          createdAt: now,
          updatedAt: now
        };
        const updatedNodes = [...story.nodes, newNode].sort((a, b) => a.sortOrder - b.sortOrder);
        get().updatePetLifeStory(storyId, { nodes: updatedNodes, updatedAt: now });
        return newNode;
      },
      updateStoryNode: (storyId, nodeId, data) => {
        const now = new Date().toISOString();
        const story = get().getPetLifeStoryById(storyId);
        if (!story) throw new Error('Story not found');
        const updatedNodes = story.nodes.map((n) =>
          n.id === nodeId ? { ...n, ...data, updatedAt: now } : n
        );
        get().updatePetLifeStory(storyId, { nodes: updatedNodes, updatedAt: now });
      },
      deleteStoryNode: (storyId, nodeId) => {
        const now = new Date().toISOString();
        const story = get().getPetLifeStoryById(storyId);
        if (!story) throw new Error('Story not found');
        const updatedNodes = story.nodes
          .filter((n) => n.id !== nodeId)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((n, index) => ({ ...n, sortOrder: index }));
        get().updatePetLifeStory(storyId, { nodes: updatedNodes, updatedAt: now });
      },
      reorderStoryNodes: (storyId, nodes) => {
        const now = new Date().toISOString();
        const reorderedNodes = nodes
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((n, index) => ({ ...n, sortOrder: index, updatedAt: now }));
        get().updatePetLifeStory(storyId, { nodes: reorderedNodes, updatedAt: now });
      },

      addToCart: (productId, quantity = 1) => {
        set((state) => {
          const existing = state.cartItems.find((item) => item.productId === productId);
          if (existing) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          return {
            cartItems: [...state.cartItems, { productId, quantity }]
          };
        });
      },
      removeFromCart: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.productId !== productId)
        })),
      updateCartItemQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )
        }));
      },
      clearCart: () => set({ cartItems: [] }),
      getCartTotal: () => {
        const state = get();
        return state.cartItems.reduce((total, item) => {
          const product = state.memorialProducts.find((p) => p.id === item.productId);
          return total + (product ? product.price * item.quantity : 0);
        }, 0);
      },
      getCartItemCount: () =>
        get().cartItems.reduce((count, item) => count + item.quantity, 0),
      getMemorialProductById: (id) =>
        get().memorialProducts.find((p) => p.id === id),
      createOrder: (address) => {
        const now = new Date().toISOString();
        const orderNo = get().generateOrderNo();
        const totalAmount = get().getCartTotal();
        const newOrder: Order = {
          id: generateId('order'),
          orderNo,
          items: [...get().cartItems],
          address,
          totalAmount,
          status: 'pending-payment',
          createdAt: now,
          placementPhotos: []
        };
        set((state) => ({
          memorialOrders: [...state.memorialOrders, newOrder],
          cartItems: []
        }));
        return newOrder;
      },
      payOrder: (orderId) => {
        const now = new Date().toISOString();
        set((state) => ({
          memorialOrders: state.memorialOrders.map((o) =>
            o.id === orderId ? { ...o, status: 'paid' as const, paidAt: now } : o
          )
        }));
      },
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          memorialOrders: state.memorialOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  ...(status === 'placed' ? { placedAt: new Date().toISOString() } : {})
                }
              : o
          )
        })),
      addPlacementPhoto: (orderId, photo) => {
        const newPhoto: OrderPlacementPhoto = {
          ...photo,
          id: generateId('pp')
        };
        set((state) => ({
          memorialOrders: state.memorialOrders.map((o) =>
            o.id === orderId
              ? { ...o, placementPhotos: [...o.placementPhotos, newPhoto] }
              : o
          )
        }));
      },
      updatePlacementNote: (orderId, note) =>
        set((state) => ({
          memorialOrders: state.memorialOrders.map((o) =>
            o.id === orderId ? { ...o, placementNote: note } : o
          )
        })),
      getOrderById: (id) => get().memorialOrders.find((o) => o.id === id),
      generateOrderNo: () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const count = get().memorialOrders.filter((o) =>
          o.orderNo.startsWith(`SM${y}${m}${d}`)
        ).length + 1;
        return `SM${y}${m}${d}${String(count).padStart(3, '0')}`;
      }
    }),
    {
      name: 'xyj-123-storage',
      partialize: (state) => ({
        owners: state.owners,
        pets: state.pets,
        ceremonies: state.ceremonies,
        cremations: state.cremations,
        urns: state.urns,
        reminders: state.reminders,
        serviceItems: state.serviceItems,
        funeralPackages: state.funeralPackages,
        albums: state.albums,
        photos: state.photos,
        employees: state.employees,
        shiftSchedules: state.shiftSchedules,
        leaveRequests: state.leaveRequests,
        attendanceRecords: state.attendanceRecords,
        petBreeds: state.petBreeds,
        breedArticles: state.breedArticles,
        favoriteBreeds: state.favoriteBreeds,
        contractTemplates: state.contractTemplates,
        contracts: state.contracts,
        contractSignatures: state.contractSignatures,
        contractTimelines: state.contractTimelines,
        petLifeStories: state.petLifeStories,
        memorialProducts: state.memorialProducts,
        cartItems: state.cartItems,
        memorialOrders: state.memorialOrders
      })
    }
  )
);
