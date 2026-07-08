import { useState, useEffect } from 'react';
import { UserRole, Hostel, Room, Bed, Student, RentRecord, AttendanceRecord, Visitor, LeaveRequest, Complaint, MessMenu, InventoryItem, Expense } from './types';
import {
  INITIAL_HOSTELS,
  INITIAL_ROOMS,
  INITIAL_BEDS,
  INITIAL_STUDENTS,
  INITIAL_RENT,
  INITIAL_ATTENDANCE,
  INITIAL_VISITORS,
  INITIAL_LEAVES,
  INITIAL_COMPLAINTS,
  INITIAL_MESS_MENU,
  INITIAL_INVENTORY,
  INITIAL_EXPENSES,
  loadState,
  saveState,
} from './data';

import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import OverviewTab from './components/OverviewTab';
import HostelTab from './components/HostelTab';
import RoomTab from './components/RoomTab';
import StudentTab from './components/StudentTab';
import RentTab from './components/RentTab';
import OtherModulesTab from './components/OtherModulesTab';
import DatabaseTab from './components/DatabaseTab';
import SettingsTab from './components/SettingsTab';

import { Sparkles, Sun, Moon, Bell, Menu, ShieldAlert } from 'lucide-react';

interface ActiveUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  ownerId: string;
  hostelId?: string;
}

export default function App() {
  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<ActiveUser | null>(() => {
    return loadState<ActiveUser | null>('active_session_user', null);
  });

  // Global Datastore State
  const [hostels, setHostels] = useState<Hostel[]>(() => loadState('hostels', INITIAL_HOSTELS));
  const [rooms, setRooms] = useState<Room[]>(() => loadState('rooms', INITIAL_ROOMS));
  const [beds, setBeds] = useState<Bed[]>(() => loadState('beds', INITIAL_BEDS));
  const [students, setStudents] = useState<Student[]>(() => loadState('students', INITIAL_STUDENTS));
  const [rents, setRents] = useState<RentRecord[]>(() => loadState('rents', INITIAL_RENT));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadState('attendance', INITIAL_ATTENDANCE));
  const [visitors, setVisitors] = useState<Visitor[]>(() => loadState('visitors', INITIAL_VISITORS));
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => loadState('leaves', INITIAL_LEAVES));
  const [complaints, setComplaints] = useState<Complaint[]>(() => loadState('complaints', INITIAL_COMPLAINTS));
  const [messMenu, setMessMenu] = useState<MessMenu[]>(() => loadState('messMenu', INITIAL_MESS_MENU));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadState('inventory', INITIAL_INVENTORY));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadState('expenses', INITIAL_EXPENSES));

  // UX State
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => { saveState('active_session_user', currentUser); }, [currentUser]);
  useEffect(() => { saveState('hostels', hostels); }, [hostels]);
  useEffect(() => { saveState('rooms', rooms); }, [rooms]);
  useEffect(() => { saveState('beds', beds); }, [beds]);
  useEffect(() => { saveState('students', students); }, [students]);
  useEffect(() => { saveState('rents', rents); }, [rents]);
  useEffect(() => { saveState('attendance', attendance); }, [attendance]);
  useEffect(() => { saveState('visitors', visitors); }, [visitors]);
  useEffect(() => { saveState('leaves', leaves); }, [leaves]);
  useEffect(() => { saveState('complaints', complaints); }, [complaints]);
  useEffect(() => { saveState('messMenu', messMenu); }, [messMenu]);
  useEffect(() => { saveState('inventory', inventory); }, [inventory]);
  useEffect(() => { saveState('expenses', expenses); }, [expenses]);

  const handleLogin = (user: ActiveUser) => {
    setCurrentUser(user);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hostel_saas_active_session_user');
  };

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLogin} />;
  }

  // --- MULTI-TENANT ISOLATION FILTERING (CRITICAL SECURITY COMPONENT) ---
  const isSuperAdmin = currentUser.role === 'SuperAdmin';
  const ownerId = currentUser.ownerId;

  // 1. Hostels filtering
  const tenantHostels = isSuperAdmin
    ? hostels
    : hostels.filter(h => h.ownerId === ownerId);

  const tenantHostelIds = tenantHostels.map(h => h.id);

  // 2. Students filtering
  const tenantStudents = isSuperAdmin
    ? students
    : currentUser.role === 'Student'
    ? students.filter(s => s.id === currentUser.id)
    : students.filter(s => s.ownerId === ownerId);

  const tenantStudentIds = tenantStudents.map(s => s.id);

  // 3. Rooms filtering
  const tenantRooms = isSuperAdmin
    ? rooms
    : rooms.filter(r => tenantHostelIds.includes(r.hostelId));

  const tenantRoomIds = tenantRooms.map(r => r.id);

  // 4. Beds filtering
  const tenantBeds = isSuperAdmin
    ? beds
    : beds.filter(b => tenantRoomIds.includes(b.roomId));

  // 5. Rents filtering
  const tenantRents = isSuperAdmin
    ? rents
    : currentUser.role === 'Student'
    ? rents.filter(r => r.studentId === currentUser.id)
    : rents.filter(r => tenantStudentIds.includes(r.studentId));

  // 6. Attendance filtering
  const tenantAttendance = isSuperAdmin
    ? attendance
    : currentUser.role === 'Student'
    ? attendance.filter(a => a.studentId === currentUser.id)
    : attendance.filter(a => tenantHostelIds.includes(a.hostelId));

  // 7. Visitors filtering
  const tenantVisitors = isSuperAdmin
    ? visitors
    : visitors.filter(v => tenantHostelIds.includes(v.hostelId));

  // 8. Leaves filtering
  const tenantLeaves = isSuperAdmin
    ? leaves
    : currentUser.role === 'Student'
    ? leaves.filter(l => l.studentId === currentUser.id)
    : leaves.filter(l => tenantHostelIds.includes(l.hostelId));

  // 9. Complaints filtering
  const tenantComplaints = isSuperAdmin
    ? complaints
    : currentUser.role === 'Student'
    ? complaints.filter(c => c.studentId === currentUser.id)
    : complaints.filter(c => tenantHostelIds.includes(c.hostelId));

  // 10. Mess Menu filtering
  const tenantMessMenu = isSuperAdmin
    ? messMenu
    : messMenu.filter(m => tenantHostelIds.includes(m.hostelId));

  // 11. Inventory filtering
  const tenantInventory = isSuperAdmin
    ? inventory
    : inventory.filter(i => tenantHostelIds.includes(i.hostelId));

  // 12. Expenses filtering
  const tenantExpenses = isSuperAdmin
    ? expenses
    : expenses.filter(e => tenantHostelIds.includes(e.hostelId));

  return (
    <div className={`min-h-screen flex bg-[#F8FAFC] text-slate-900 ${darkMode ? 'dark bg-slate-950 text-slate-100' : ''}`}>
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      </div>

      {/* Main content viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl md:hidden text-slate-600 dark:text-slate-300"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 rounded-lg">
                SaaS Tenant Isolation Engine Active
              </span>
              {isSuperAdmin && (
                <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                  PLATFORM OVERSEER
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark mode toggler */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl transition"
              title="Toggle Theme Mode"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* In-app Notification Alert bell */}
            <div className="relative">
              <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl transition">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-600" />
              </button>
            </div>

            {/* User details header segment */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">Tenant Owner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Tabs Switcher Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {activeTab === 'overview' && (
            <OverviewTab
              hostels={tenantHostels}
              rooms={tenantRooms}
              beds={tenantBeds}
              students={tenantStudents}
              rents={tenantRents}
              complaints={tenantComplaints}
              leaves={tenantLeaves}
              expenses={tenantExpenses}
              messMenu={tenantMessMenu}
              onNavigate={setActiveTab}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'hostels' && (
            <HostelTab
              hostels={tenantHostels}
              setHostels={setHostels}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'rooms' && (
            <RoomTab
              hostels={tenantHostels}
              rooms={tenantRooms}
              setRooms={setRooms}
              beds={tenantBeds}
              setBeds={setBeds}
              students={tenantStudents}
            />
          )}

          {activeTab === 'students' && (
            <StudentTab
              hostels={tenantHostels}
              students={tenantStudents}
              setStudents={setStudents}
              rooms={tenantRooms}
              beds={tenantBeds}
              setBeds={setBeds}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'rents' && (
            <RentTab
              rents={tenantRents}
              setRents={setRents}
              students={tenantStudents}
              beds={tenantBeds}
              hostels={tenantHostels}
              rooms={tenantRooms}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'other-modules' && (
            <OtherModulesTab
              hostels={tenantHostels}
              students={tenantStudents}
              attendance={tenantAttendance}
              setAttendance={setAttendance}
              visitors={tenantVisitors}
              setVisitors={setVisitors}
              leaves={tenantLeaves}
              setLeaves={setLeaves}
              complaints={tenantComplaints}
              setComplaints={setComplaints}
              messMenu={tenantMessMenu}
              setMessMenu={setMessMenu}
              inventory={tenantInventory}
              setInventory={setInventory}
              expenses={tenantExpenses}
              setExpenses={setExpenses}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'database' && (
            <DatabaseTab />
          )}

          {activeTab === 'settings' && (
            <SettingsTab />
          )}
        </main>
      </div>

      {/* Mobile Drawer Sidebar Navigation */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex md:hidden">
          <div className="w-64">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="flex-1 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
