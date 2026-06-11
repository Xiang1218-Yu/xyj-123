import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Owner, Pet, Ceremony, Cremation, Urn, Reminder, ServiceItem, FuneralPackage, Album, Photo, Employee, ShiftSchedule, LeaveRequest, AttendanceRecord, PetBreed, BreedArticle, FavoriteBreed } from '../shared/types';
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
  mockBreedArticles
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
        get().favoriteBreeds.some((f) => f.breedId === breedId)
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
        favoriteBreeds: state.favoriteBreeds
      })
    }
  )
);
