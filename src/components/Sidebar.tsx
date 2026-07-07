import {
  LayoutDashboard,
  Building2,
  BedDouble,
  Users,
  CreditCard,
  Settings,
  FolderLock,
  Database,
  Layers,
  LogOut,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: { email: string; name: string; role: UserRole; ownerId: string };
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout }: SidebarProps) {
  const getMenuBadge = (tab: string) => {
    return null;
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['HostelOwner', 'SuperAdmin', 'Manager', 'Student'] },
    { id: 'hostels', label: 'Hostel Matrix', icon: Building2, roles: ['HostelOwner', 'SuperAdmin', 'Manager'] },
    { id: 'rooms', label: 'Rooms & Beds', icon: BedDouble, roles: ['HostelOwner', 'Manager', 'Warden'] },
    { id: 'students', label: 'Students Roster', icon: Users, roles: ['HostelOwner', 'Manager', 'Warden', 'Receptionist'] },
    { id: 'rents', label: 'Rent Ledger', icon: CreditCard, roles: ['HostelOwner', 'Manager', 'Accountant', 'Student'] },
    { id: 'other-modules', label: 'SaaS Modules', icon: Layers, roles: ['HostelOwner', 'Manager', 'Warden', 'Receptionist', 'Accountant', 'Student'] },
    { id: 'database', label: 'Supabase Hub', icon: Database, roles: ['HostelOwner', 'SuperAdmin'] },
    { id: 'settings', label: 'SaaS Config', icon: Settings, roles: ['HostelOwner', 'SuperAdmin'] },
  ];

  const allowedItems = navItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="w-64 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex flex-col h-screen border-r border-slate-200 dark:border-slate-800 font-sans select-none shrink-0">
      {/* SaaS Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md shadow-blue-500/15">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <div>
          <span className="font-bold text-slate-950 dark:text-white text-lg tracking-tight">LuxeHostel</span>
          <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-widest">
            SaaS PLATFORM v2.4
          </span>
        </div>
      </div>

      {/* Tenant Indicator */}
      <div className="p-4 mx-4 my-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Active Workspace
        </span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[170px]">
            {currentUser.role === 'SuperAdmin' ? 'Global Platform' : `${currentUser.name}`}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono truncate">
          Tenant: {currentUser.ownerId}
        </span>
        {currentUser.role !== 'HostelOwner' && currentUser.role !== 'SuperAdmin' && (
          <div className="mt-1 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-md self-start">
            Role: {currentUser.role}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <span className="block px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Management
        </span>
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-semibold transition duration-200 ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {getMenuBadge(item.id)}
            </button>
          );
        })}
      </div>

      {/* System Status / User Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center font-bold text-xs text-slate-700 dark:text-white uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-white max-w-[120px] truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 max-w-[120px] truncate">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Log Out Securely"
            className="p-2 bg-white hover:bg-red-50 dark:bg-slate-900 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 dark:hover:text-red-400 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900/40 rounded-xl transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold bg-white dark:bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Sec: OK
          </span>
          <span>SSL (AES-256)</span>
        </div>
      </div>
    </div>
  );
}
