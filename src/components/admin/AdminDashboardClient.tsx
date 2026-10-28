'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Scissors,
  Settings as SettingsIcon,
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Phone,
  MessageCircle,
  Shield,
  Layers,
  ArrowRight,
  Loader2,
  Check,
} from 'lucide-react';

interface AdminStats {
  totalToday: number;
  upcomingCount: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  totalRevenue: number;
}

interface AppointmentItem {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  totalPrice: number;
  status: string;
  services: { id: string; name: string; price: number; durationMinutes: number }[];
  notes?: string | null;
  createdAt: string;
}

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface AdminDashboardClientProps {
  initialStats: AdminStats;
  initialRecent: AppointmentItem[];
  adminUser: { id: string; email: string; name: string; role: string };
  initialSettings: Record<string, string>;
}

export default function AdminDashboardClient({
  initialStats,
  initialRecent,
  adminUser,
  initialSettings,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'services' | 'settings'>('overview');

  // Stats state
  const [stats, setStats] = useState<AdminStats>(initialStats);

  // Appointments state
  const [appointments, setAppointments] = useState<AppointmentItem[]>(initialRecent);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Reschedule Modal State
  const [rescheduleTarget, setRescheduleTarget] = useState<AppointmentItem | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('');
  const [rescheduling, setRescheduling] = useState<boolean>(false);
  const [rescheduleError, setRescheduleError] = useState<string>('');

  // Services State
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(false);
  const [serviceModalOpen, setServiceModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [savingService, setSavingService] = useState<boolean>(false);

  // Settings State
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [settingsSuccess, setSettingsSuccess] = useState<string>('');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch appointments list
  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (statusFilter && statusFilter !== 'ALL') params.set('status', statusFilter);
      if (dateFilter) params.set('date', dateFilter);

      const res = await fetch(`/api/admin/appointments?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch {
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Fetch services list
  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch {
      showToast('Failed to load services', 'error');
    } finally {
      setLoadingServices(false);
    }
  };

  // Re-fetch when filters change in appointments tab
  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [activeTab, statusFilter, dateFilter]);

  // Fetch services when services tab opens
  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
    }
  }, [activeTab]);

  // Update appointment status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        showToast(`Appointment status updated to ${newStatus}`);
        // update local list
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        // refresh stats
        refreshStats();
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch {
      showToast('Network error while updating appointment', 'error');
    }
  };

  // Refresh stats
  const refreshStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Reschedule
  const handleRescheduleSubmit = async () => {
    if (!rescheduleTarget || !rescheduleDate || !rescheduleTime) {
      setRescheduleError('Please select both a new date and start time.');
      return;
    }

    setRescheduling(true);
    setRescheduleError('');

    try {
      const res = await fetch(`/api/admin/appointments/${rescheduleTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESCHEDULE',
          newDate: rescheduleDate,
          newStartTime: rescheduleTime,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Appointment rescheduled successfully');
        setRescheduleTarget(null);
        fetchAppointments();
        refreshStats();
      } else {
        setRescheduleError(data.error || 'Failed to reschedule slot');
      }
    } catch {
      setRescheduleError('Network error while rescheduling.');
    } finally {
      setRescheduling(false);
    }
  };

  // Save Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.name || !editingService?.price || !editingService?.durationMinutes) {
      showToast('Name, price, and duration are required', 'error');
      return;
    }

    setSavingService(true);
    try {
      const isEdit = Boolean(editingService.id);
      const url = isEdit ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });

      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? 'Service updated successfully' : 'New service created');
        setServiceModalOpen(false);
        setEditingService(null);
        fetchServices();
      } else {
        showToast(data.error || 'Failed to save service', 'error');
      }
    } catch {
      showToast('Network error while saving service', 'error');
    } finally {
      setSavingService(false);
    }
  };

  // Delete Service
  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Service removed');
        fetchServices();
      } else {
        showToast(data.error || 'Failed to remove service', 'error');
      }
    } catch {
      showToast('Network error while deleting service', 'error');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSettingsSuccess('Business settings saved persistently.');
        showToast('Settings saved successfully');
      } else {
        showToast(data.error || 'Failed to save settings', 'error');
      }
    } catch {
      showToast('Network error while saving settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const currency = settings.currency || '৳';

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2EA] flex flex-col font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-[#122818] border-[#10B981]/50 text-[#86EFAC]'
              : 'bg-[#2A1616] border-[#EF4444]/50 text-[#FCA5A5]'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <header className="bg-[#121212] border-b border-[#222222] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#181818] border border-[#C8A24D]/40 flex items-center justify-center text-[#C8A24D]">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-sm sm:text-base text-[#F5F2EA]">
                {settings.salon_name || 'GOLDEN CUTS'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-[#C8A24D]/15 text-[#C8A24D] border border-[#C8A24D]/30">
                Staff Control
              </span>
            </div>
            <span className="text-[11px] text-[#A6A6A6]">
              Logged in as {adminUser.name} ({adminUser.email})
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-[#A6A6A6] hover:text-[#F5F2EA] px-3 py-1.5 rounded-lg border border-[#2B2B2B]"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 text-xs text-[#EF4444] hover:bg-[#2A1616] px-3 py-1.5 rounded-lg border border-[#EF4444]/30 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="bg-[#101010] border-b border-[#222222] px-4 sm:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Layers },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'services', label: 'Services & Pricing', icon: Scissors },
            { id: 'settings', label: 'Salon Settings', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#C8A24D] text-[#0B0B0B] shadow-md'
                    : 'text-[#A6A6A6] hover:text-[#F5F2EA] hover:bg-[#181818]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Real Database Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626]">
                <div className="flex items-center justify-between text-xs text-[#A6A6A6] mb-2">
                  <span>Today&apos;s Bookings</span>
                  <Calendar className="w-4 h-4 text-[#C8A24D]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#F5F2EA]">
                  {stats.totalToday}
                </div>
                <span className="text-[11px] text-[#737373] mt-1 block">Scheduled for today</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626]">
                <div className="flex items-center justify-between text-xs text-[#A6A6A6] mb-2">
                  <span>Upcoming Appointments</span>
                  <Clock className="w-4 h-4 text-[#C8A24D]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#F5F2EA]">
                  {stats.upcomingCount}
                </div>
                <span className="text-[11px] text-[#737373] mt-1 block">Future reserved slots</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626]">
                <div className="flex items-center justify-between text-xs text-[#A6A6A6] mb-2">
                  <span>Pending Confirmation</span>
                  <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#F59E0B]">
                  {stats.pendingCount}
                </div>
                <span className="text-[11px] text-[#737373] mt-1 block">Awaiting review</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626]">
                <div className="flex items-center justify-between text-xs text-[#A6A6A6] mb-2">
                  <span>Confirmed Bookings</span>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#10B981]">
                  {stats.confirmedCount}
                </div>
                <span className="text-[11px] text-[#737373] mt-1 block">Active reserved slots</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626]">
                <div className="flex items-center justify-between text-xs text-[#A6A6A6] mb-2">
                  <span>Completed Appointments</span>
                  <Check className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-blue-400">
                  {stats.completedCount}
                </div>
                <span className="text-[11px] text-[#737373] mt-1 block">Finished services</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626]">
                <div className="flex items-center justify-between text-xs text-[#A6A6A6] mb-2">
                  <span>Cancelled Appointments</span>
                  <XCircle className="w-4 h-4 text-[#EF4444]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#EF4444]">
                  {stats.cancelledCount}
                </div>
                <span className="text-[11px] text-[#737373] mt-1 block">Released slots</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626] col-span-2">
                <div className="flex items-center justify-between text-xs text-[#A6A6A6] mb-2">
                  <span>Total Scheduled Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#C8A24D]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#C8A24D]">
                  {currency}{stats.totalRevenue.toLocaleString()}
                </div>
                <span className="text-[11px] text-[#737373] mt-1 block">
                  From active and completed reservations
                </span>
              </div>
            </div>

            {/* Recent Appointments List */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#F5F2EA]">
                    Recent Activity & Upcoming Slots
                  </h3>
                  <p className="text-xs text-[#A6A6A6]">
                    Immediate appointments requiring attention.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="inline-flex items-center space-x-1 text-xs text-[#C8A24D] hover:underline font-semibold"
                >
                  <span>View All Bookings</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="py-12 text-center text-[#737373] text-xs">
                  No appointments recorded in system yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-[#0E0E0E] border border-[#222] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-mono text-xs font-bold text-[#C8A24D]">
                            {app.reference}
                          </span>
                          <span className="text-xs text-[#737373]">•</span>
                          <span className="text-sm font-semibold text-[#F5F2EA]">
                            {app.customerName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              app.status === 'CONFIRMED'
                                ? 'bg-[#10B981]/15 text-[#10B981]'
                                : app.status === 'COMPLETED'
                                ? 'bg-blue-500/15 text-blue-400'
                                : app.status === 'CANCELLED'
                                ? 'bg-red-500/15 text-red-400'
                                : 'bg-yellow-500/15 text-yellow-400'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#A6A6A6]">
                          {app.services.map((s) => s.name).join(', ')} • {app.appointmentDate} at {app.startTime}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-auto">
                        <span className="font-mono font-bold text-sm text-[#C8A24D] mr-2">
                          {currency}{app.totalPrice}
                        </span>
                        {app.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')}
                            className="px-3 py-1 rounded bg-[#10B981] hover:bg-[#0EA271] text-[#0B0B0B] font-bold text-xs"
                          >
                            Confirm
                          </button>
                        )}
                        {app.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}
                            className="px-3 py-1 rounded bg-[#1F1F1F] hover:bg-[#2A2A2A] text-blue-400 border border-blue-500/30 text-xs font-semibold"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: APPOINTMENTS MANAGEMENT ===================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filters & Actions Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#262626] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchAppointments()}
                  placeholder="Search by customer name, phone, or reference..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] placeholder-[#555] focus:outline-none focus:border-[#C8A24D]"
                />
              </div>

              {/* Status filter */}
              <div className="flex items-center space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                {/* Date Filter */}
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                />

                {/* Export CSV button */}
                <a
                  href={`/api/admin/appointments?export=csv${statusFilter !== 'ALL' ? `&status=${statusFilter}` : ''}${dateFilter ? `&date=${dateFilter}` : ''}`}
                  download
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#1F1F1F] hover:bg-[#282828] border border-[#333] text-xs font-semibold text-[#F5F2EA] transition"
                  title="Export appointments to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-[#C8A24D]" />
                  <span className="hidden sm:inline">Export CSV</span>
                </a>
              </div>
            </div>

            {/* Appointments Table / Cards */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl">
              {loadingAppointments ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-2 text-[#A6A6A6]">
                  <Loader2 className="w-7 h-7 animate-spin text-[#C8A24D]" />
                  <span className="text-xs">Loading appointments...</span>
                </div>
              ) : appointments.length === 0 ? (
                <div className="py-16 text-center text-[#737373] text-xs">
                  No appointments found matching current filters.
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0E0E0E] text-[#A6A6A6] uppercase tracking-wider font-mono border-b border-[#222]">
                        <tr>
                          <th className="py-3 px-4">Ref</th>
                          <th className="py-3 px-4">Client</th>
                          <th className="py-3 px-4">Phone</th>
                          <th className="py-3 px-4">Date & Time</th>
                          <th className="py-3 px-4">Services</th>
                          <th className="py-3 px-4">Total</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1C1C1C]">
                        {appointments.map((a) => (
                          <tr key={a.id} className="hover:bg-[#181818]/60 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-[#C8A24D]">
                              {a.reference}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-[#F5F2EA]">
                              {a.customerName}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[#A6A6A6]">
                              <a href={`tel:${a.customerPhone}`} className="hover:text-[#C8A24D]">
                                {a.customerPhone}
                              </a>
                            </td>
                            <td className="py-3.5 px-4 text-[#F5F2EA]">
                              <div>{a.appointmentDate}</div>
                              <span className="text-[11px] text-[#A6A6A6]">
                                {a.startTime} – {a.endTime} ({a.totalDuration}m)
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[#A6A6A6] max-w-xs truncate">
                              {a.services.map((s) => s.name).join(', ')}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-[#C8A24D]">
                              {currency}{a.totalPrice}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  a.status === 'CONFIRMED'
                                    ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                                    : a.status === 'COMPLETED'
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                    : a.status === 'CANCELLED'
                                    ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                    : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                                }`}
                              >
                                {a.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                {a.status === 'PENDING' && (
                                  <button
                                    onClick={() => handleUpdateStatus(a.id, 'CONFIRMED')}
                                    className="p-1.5 rounded bg-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/30"
                                    title="Confirm Booking"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {a.status === 'CONFIRMED' && (
                                  <button
                                    onClick={() => handleUpdateStatus(a.id, 'COMPLETED')}
                                    className="p-1.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                    title="Mark Completed"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setRescheduleTarget(a);
                                    setRescheduleDate(a.appointmentDate);
                                    setRescheduleTime(a.startTime);
                                  }}
                                  className="p-1.5 rounded bg-[#1F1F1F] text-[#C8A24D] hover:bg-[#2A2A2A]"
                                  title="Reschedule slot"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                </button>
                                {a.status !== 'CANCELLED' && (
                                  <button
                                    onClick={() => {
                                      if (confirm(`Cancel appointment ${a.reference}?`)) {
                                        handleUpdateStatus(a.id, 'CANCELLED');
                                      }
                                    }}
                                    className="p-1.5 rounded bg-red-500/15 text-red-400 hover:bg-red-500/25"
                                    title="Cancel"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="block lg:hidden divide-y divide-[#222]">
                    {appointments.map((a) => (
                      <div key={a.id} className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-[#C8A24D]">
                            {a.reference}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              a.status === 'CONFIRMED'
                                ? 'bg-[#10B981]/15 text-[#10B981]'
                                : a.status === 'COMPLETED'
                                ? 'bg-blue-500/15 text-blue-400'
                                : a.status === 'CANCELLED'
                                ? 'bg-red-500/15 text-red-400'
                                : 'bg-yellow-500/15 text-yellow-400'
                            }`}
                          >
                            {a.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-[#F5F2EA]">{a.customerName}</h4>
                          <a href={`tel:${a.customerPhone}`} className="text-xs text-[#A6A6A6]">
                            {a.customerPhone}
                          </a>
                        </div>

                        <div className="text-xs text-[#A6A6A6]">
                          <div>
                            <strong className="text-[#F5F2EA]">{a.appointmentDate}</strong> at {a.startTime} – {a.endTime}
                          </div>
                          <p className="line-clamp-1 mt-0.5 text-[11px]">
                            {a.services.map((s) => s.name).join(', ')}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C]">
                          <span className="font-mono font-bold text-sm text-[#C8A24D]">
                            {currency}{a.totalPrice}
                          </span>

                          <div className="flex items-center space-x-2">
                            {a.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateStatus(a.id, 'CONFIRMED')}
                                className="px-3 py-1 rounded bg-[#10B981] text-[#0B0B0B] text-xs font-bold"
                              >
                                Confirm
                              </button>
                            )}
                            {a.status === 'CONFIRMED' && (
                              <button
                                onClick={() => handleUpdateStatus(a.id, 'COMPLETED')}
                                className="px-3 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold"
                              >
                                Complete
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setRescheduleTarget(a);
                                setRescheduleDate(a.appointmentDate);
                                setRescheduleTime(a.startTime);
                              }}
                              className="p-1.5 rounded bg-[#1F1F1F] text-[#C8A24D]"
                            >
                              <Clock className="w-3.5 h-3.5" />
                            </button>
                            {a.status !== 'CANCELLED' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Cancel booking ${a.reference}?`)) {
                                    handleUpdateStatus(a.id, 'CANCELLED');
                                  }
                                }}
                                className="p-1.5 rounded bg-red-500/15 text-red-400"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Reschedule Modal */}
            {rescheduleTarget && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#141414] border border-[#C8A24D]/40 rounded-2xl max-w-md w-full p-6 relative">
                  <h3 className="font-serif text-lg font-bold text-[#F5F2EA] mb-1">
                    Reschedule Appointment
                  </h3>
                  <p className="text-xs text-[#A6A6A6] mb-4">
                    Rescheduling Ref: <strong className="text-[#C8A24D]">{rescheduleTarget.reference}</strong> for {rescheduleTarget.customerName}
                  </p>

                  {rescheduleError && (
                    <div className="mb-4 p-2.5 rounded-lg bg-[#2A1616] text-[#FCA5A5] text-xs">
                      {rescheduleError}
                    </div>
                  )}

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                        New Date
                      </label>
                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                        New Start Time (HH:mm)
                      </label>
                      <input
                        type="time"
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                      />
                      <span className="text-[10px] text-[#737373] mt-1 block">
                        Duration: {rescheduleTarget.totalDuration} mins
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => setRescheduleTarget(null)}
                      className="px-4 py-2 rounded-xl border border-[#2B2B2B] text-xs text-[#A6A6A6]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRescheduleSubmit}
                      disabled={rescheduling}
                      className="px-5 py-2 rounded-xl bg-[#C8A24D] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                    >
                      {rescheduling ? 'Saving...' : 'Confirm Reschedule'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: SERVICES MANAGEMENT ===================== */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#F5F2EA]">
                  Manage Services & Pricing
                </h3>
                <p className="text-xs text-[#A6A6A6]">
                  Changes affect future bookings. Existing bookings preserve their agreed snapshot.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingService({
                    name: '',
                    description: '',
                    price: 250,
                    durationMinutes: 30,
                    category: 'HAIRCUT',
                    isActive: true,
                    sortOrder: services.length + 1,
                  });
                  setServiceModalOpen(true);
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider transition shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            {loadingServices ? (
              <div className="py-16 text-center text-[#A6A6A6]">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C8A24D]" />
                <span className="text-xs">Loading services...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className={`p-5 rounded-2xl bg-[#141414] border transition flex flex-col justify-between ${
                      s.isActive ? 'border-[#262626]' : 'border-[#2A1616] opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="font-serif font-bold text-base text-[#F5F2EA]">{s.name}</h4>
                        <span className="font-mono font-bold text-base text-[#C8A24D]">
                          {currency}{s.price}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-[#A6A6A6] mb-3">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-[#C8A24D]" />
                          <span>{s.durationMinutes}m</span>
                        </span>
                        <span>•</span>
                        <span className="uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-[#1F1F1F]">
                          {s.category}
                        </span>
                        <span>•</span>
                        <span className={`text-[10px] ${s.isActive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                          {s.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-[#A6A6A6] line-clamp-2 mb-4">{s.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#222] flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingService(s);
                          setServiceModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-[#1F1F1F] text-[#C8A24D] hover:bg-[#282828]"
                        title="Edit service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(s.id)}
                        className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25"
                        title="Delete service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Service Create / Edit Modal */}
            {serviceModalOpen && editingService && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#141414] border border-[#C8A24D]/40 rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
                  <h3 className="font-serif text-lg font-bold text-[#F5F2EA] mb-4">
                    {editingService.id ? 'Edit Service' : 'Add New Service'}
                  </h3>

                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                        Service Name *
                      </label>
                      <input
                        type="text"
                        value={editingService.name || ''}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        placeholder="e.g. Skin Fade"
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                          Price ({currency}) *
                        </label>
                        <input
                          type="number"
                          value={editingService.price || ''}
                          onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                          Duration (Mins) *
                        </label>
                        <input
                          type="number"
                          value={editingService.durationMinutes || ''}
                          onChange={(e) => setEditingService({ ...editingService, durationMinutes: parseInt(e.target.value, 10) })}
                          className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                        Category
                      </label>
                      <select
                        value={editingService.category || 'HAIRCUT'}
                        onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                      >
                        <option value="HAIRCUT">HAIRCUT</option>
                        <option value="BEARD">BEARD</option>
                        <option value="COMBO">COMBO</option>
                        <option value="STYLING">STYLING</option>
                        <option value="PACKAGE">PACKAGE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={editingService.description || ''}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="checkbox"
                        id="activeCheck"
                        checked={editingService.isActive !== false}
                        onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                        className="rounded border-[#262626] bg-[#0B0B0B] text-[#C8A24D] focus:ring-[#C8A24D]"
                      />
                      <label htmlFor="activeCheck" className="text-xs text-[#F5F2EA]">
                        Service is active and available for online booking
                      </label>
                    </div>

                    <div className="pt-4 border-t border-[#222] flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setServiceModalOpen(false);
                          setEditingService(null);
                        }}
                        className="px-4 py-2 rounded-xl border border-[#2B2B2B] text-xs text-[#A6A6A6]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingService}
                        className="px-5 py-2 rounded-xl bg-[#C8A24D] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                      >
                        {savingService ? 'Saving...' : 'Save Service'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: SALON SETTINGS ===================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#F5F2EA]">
                Business & Booking Settings
              </h3>
              <p className="text-xs text-[#A6A6A6]">
                Configure salon hours, contact coordinates, buffer times, and booking policies.
              </p>
            </div>

            {settingsSuccess && (
              <div className="p-3 rounded-xl bg-[#122818] border border-[#10B981]/40 text-[#86EFAC] text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                    Salon Name
                  </label>
                  <input
                    type="text"
                    value={settings.salon_name || ''}
                    onChange={(e) => setSettings({ ...settings, salon_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={settings.currency || '৳'}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                    Public Phone Number
                  </label>
                  <input
                    type="text"
                    value={settings.phone || ''}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                    WhatsApp Number (International format)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp || ''}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                  Salon Physical Address
                </label>
                <input
                  type="text"
                  value={settings.address || ''}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F2EA] mb-1">
                  Google Maps URL
                </label>
                <input
                  type="text"
                  value={settings.map_url || ''}
                  onChange={(e) => setSettings({ ...settings, map_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#C8A24D]"
                />
              </div>

              {/* Operating Hours */}
              <div className="pt-4 border-t border-[#222]">
                <h4 className="text-xs uppercase tracking-wider text-[#C8A24D] font-mono font-bold mb-3">
                  Operating Hours & Intervals
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#A6A6A6] mb-1">Weekday Open</label>
                    <input
                      type="time"
                      value={settings.opening_time_weekday || '10:00'}
                      onChange={(e) => setSettings({ ...settings, opening_time_weekday: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#A6A6A6] mb-1">Weekday Close</label>
                    <input
                      type="time"
                      value={settings.closing_time_weekday || '22:00'}
                      onChange={(e) => setSettings({ ...settings, closing_time_weekday: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#A6A6A6] mb-1">Weekend Open</label>
                    <input
                      type="time"
                      value={settings.opening_time_weekend || '14:00'}
                      onChange={(e) => setSettings({ ...settings, opening_time_weekend: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#A6A6A6] mb-1">Weekend Close</label>
                    <input
                      type="time"
                      value={settings.closing_time_weekend || '22:00'}
                      onChange={(e) => setSettings({ ...settings, closing_time_weekend: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA]"
                    />
                  </div>
                </div>
              </div>

              {/* Intervals & Buffer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[#A6A6A6] mb-1">
                    Slot Interval (Minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.slot_interval || '30'}
                    onChange={(e) => setSettings({ ...settings, slot_interval: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#A6A6A6] mb-1">
                    Buffer Time (Minutes between cuts)
                  </label>
                  <input
                    type="number"
                    value={settings.buffer_time || '10'}
                    onChange={(e) => setSettings({ ...settings, buffer_time: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#A6A6A6] mb-1">
                    Booking Window (Days ahead)
                  </label>
                  <input
                    type="number"
                    value={settings.booking_window_days || '30'}
                    onChange={(e) => setSettings({ ...settings, booking_window_days: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B0B0B] border border-[#262626] text-xs text-[#F5F2EA]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#222] flex items-center justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-2.5 rounded-xl bg-[#C8A24D] hover:bg-[#D8B45E] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider transition disabled:opacity-50"
                >
                  {savingSettings ? 'Saving Settings...' : 'Save All Settings'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
