import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Owner, Pet, Ceremony, Cremation, Urn, Reminder, ServiceItem, FuneralPackage, Album, Photo, Employee, ShiftSchedule, LeaveRequest, AttendanceRecord } from '../shared/types';
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
  mockAttendanceRecords
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
  getAttendanceByEmployeeId: (employeeId: string) => AttendanceRecord[];
  getAttendanceByDate: (date: string) => AttendanceRecord[];
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
        const newSchedule = { ...schedule, id: generateId('shift') };
        set((state) => ({
          shiftSchedules: [...state.shiftSchedules, newSchedule]
        }));
        return newSchedule;
      },
      updateShiftSchedule: (id, data) =>
        set((state) => ({
          shiftSchedules: state.shiftSchedules.map((s) =>
            s.id === id ? { ...s, ...data } : s
          )
        })),
      deleteShiftSchedule: (id) =>
        set((state) => ({
          shiftSchedules: state.shiftSchedules.filter((s) => s.id !== id)
        })),
      getShiftsByEmployeeId: (employeeId) =>
        get().shiftSchedules.filter((s) => s.employeeId === employeeId),
      getShiftsByDate: (date) =>
        get().shiftSchedules.filter((s) => s.date === date),
      batchSetShifts: (schedules) => {
        const newSchedules = schedules.map((s) => ({
          ...s,
          id: generateId('shift')
        }));
        set((state) => ({
          shiftSchedules: [...state.shiftSchedules, ...newSchedules]
        }));
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
      getAttendanceByEmployeeId: (employeeId) =>
        get().attendanceRecords.filter((a) => a.employeeId === employeeId),
      getAttendanceByDate: (date) =>
        get().attendanceRecords.filter((a) => a.date === date)
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
        attendanceRecords: state.attendanceRecords
      })
    }
  )
);
