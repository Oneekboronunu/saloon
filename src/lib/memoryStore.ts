import { DEFAULT_SERVICES, DEFAULT_SETTINGS, ServiceItem } from './constants';

export interface MemoryAppointment {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  notes?: string | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  totalPrice: number;
  servicesSnapshot: string;
  status: string;
  cancellationReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const globalStore = globalThis as unknown as {
  __gc_appointments?: MemoryAppointment[];
  __gc_services?: ServiceItem[];
  __gc_settings?: Record<string, string>;
};

if (!globalStore.__gc_appointments) {
  globalStore.__gc_appointments = [];
}

if (!globalStore.__gc_services) {
  globalStore.__gc_services = [...DEFAULT_SERVICES];
}

if (!globalStore.__gc_settings) {
  globalStore.__gc_settings = { ...DEFAULT_SETTINGS };
}

export const memoryStore = {
  getAppointments: () => globalStore.__gc_appointments || [],
  addAppointment: (app: MemoryAppointment) => {
    if (!globalStore.__gc_appointments) globalStore.__gc_appointments = [];
    globalStore.__gc_appointments.unshift(app);
    return app;
  },
  findAppointmentByRef: (ref: string) => {
    return (globalStore.__gc_appointments || []).find(
      (a) => a.reference.toUpperCase() === ref.toUpperCase()
    );
  },
  updateAppointmentStatus: (id: string, status: string, reason?: string) => {
    const list = globalStore.__gc_appointments || [];
    const app = list.find((a) => a.id === id);
    if (app) {
      app.status = status;
      if (reason) app.cancellationReason = reason;
      app.updatedAt = new Date();
    }
    return app;
  },
  rescheduleAppointment: (id: string, newDate: string, newStartTime: string, newEndTime: string) => {
    const list = globalStore.__gc_appointments || [];
    const app = list.find((a) => a.id === id);
    if (app) {
      app.appointmentDate = newDate;
      app.startTime = newStartTime;
      app.endTime = newEndTime;
      app.status = 'CONFIRMED';
      app.updatedAt = new Date();
    }
    return app;
  },
  getServices: () => globalStore.__gc_services || DEFAULT_SERVICES,
  saveService: (service: ServiceItem) => {
    if (!globalStore.__gc_services) globalStore.__gc_services = [...DEFAULT_SERVICES];
    const idx = globalStore.__gc_services.findIndex((s) => s.id === service.id);
    if (idx >= 0) {
      globalStore.__gc_services[idx] = service;
    } else {
      globalStore.__gc_services.push(service);
    }
    return service;
  },
  deleteService: (id: string) => {
    if (!globalStore.__gc_services) return;
    globalStore.__gc_services = globalStore.__gc_services.filter((s) => s.id !== id);
  },
  getSettings: () => globalStore.__gc_settings || DEFAULT_SETTINGS,
  updateSettings: (newSettings: Record<string, string>) => {
    globalStore.__gc_settings = { ...(globalStore.__gc_settings || DEFAULT_SETTINGS), ...newSettings };
    return globalStore.__gc_settings;
  },
};
