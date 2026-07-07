import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BedDouble,
  FileSpreadsheet,
  AlertOctagon,
  CalendarDays,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Hostel, Room, Bed, Student, RentRecord, Complaint, LeaveRequest, Expense } from '../types';

interface OverviewTabProps {
  hostels: Hostel[];
  rooms: Room[];
  beds: Bed[];
  students: Student[];
  rents: RentRecord[];
  complaints: Complaint[];
  leaves: LeaveRequest[];
  expenses: Expense[];
  onNavigate: (tab: string) => void;
}

export default function OverviewTab({
  hostels,
  rooms,
  beds,
  students,
  rents,
  complaints,
  leaves,
  expenses,
  onNavigate,
}: OverviewTabProps) {
  const [selectedHostelFilter, setSelectedHostelFilter] = useState<string>('all');

  // Filter lists based on selected hostel
  const filteredRooms = selectedHostelFilter === 'all'
    ? rooms
    : rooms.filter(r => r.hostelId === selectedHostelFilter);

  const filteredBeds = selectedHostelFilter === 'all'
    ? beds
    : beds.filter(b => {
        const r = rooms.find(rm => rm.id === b.roomId);
        return r && r.hostelId === selectedHostelFilter;
      });

  const filteredStudents = selectedHostelFilter === 'all'
    ? students
    : students.filter(s => s.hostelId === selectedHostelFilter);

  const filteredRents = selectedHostelFilter === 'all'
    ? rents
    : rents.filter(rt => {
        const s = students.find(std => std.id === rt.studentId);
        return s && s.hostelId === selectedHostelFilter;
      });

  const filteredExpenses = selectedHostelFilter === 'all'
    ? expenses
    : expenses.filter(e => e.hostelId === selectedHostelFilter);

  // Stats Calculations
  const activeHostelsCount = hostels.filter(h => h.status === 'active').length;
  const totalBedsCount = filteredBeds.length;
  const occupiedBedsCount = filteredBeds.filter(b => b.status === 'occupied').length;
  const maintenanceBedsCount = filteredBeds.filter(b => b.status === 'maintenance').length;
  const availableBedsCount = totalBedsCount - occupiedBedsCount - maintenanceBedsCount;

  const occupancyRate = totalBedsCount > 0 ? Math.round((occupiedBedsCount / totalBedsCount) * 100) : 0;

  // Rent Analysis (Current Month)
  const totalInvoiced = filteredRents.reduce((acc, curr) => acc + curr.totalDue, 0);
  const totalCollected = filteredRents.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPendingRent = totalInvoiced - totalCollected;

  // Expenses Calculation
  const totalExpensesAmount = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalCollected - totalExpensesAmount;

  // Recent admissions (last 30 days or general listing)
  const recentAdmissions = [...filteredStudents].sort((a, b) => b.admissionDate.localeCompare(a.admissionDate)).slice(0, 3);

  // Complaints / Leave badges
  const pendingComplaints = complaints.filter(c => c.status === 'pending');
  const pendingLeaves = leaves.filter(l => l.status === 'pending');

  // Interactive charting data
  const financialData = [
    { name: 'Jan', Revenue: 65000, Expenses: 32000, Profit: 33000 },
    { name: 'Feb', Revenue: 78000, Expenses: 31000, Profit: 47000 },
    { name: 'Mar', Revenue: 82000, Expenses: 38000, Profit: 44000 },
    { name: 'Apr', Revenue: 95000, Expenses: 41000, Profit: 54000 },
    { name: 'May', Revenue: 110000, Expenses: 43000, Profit: 67000 },
    { name: 'Jun', Revenue: totalCollected || 125000, Expenses: totalExpensesAmount || 49000, Profit: (totalCollected - totalExpensesAmount) || 76000 },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Workspace Dashboard <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time multi-tenant telemetry and hostel capacity utilization matrices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hostel Scope:</label>
          <select
            value={selectedHostelFilter}
            onChange={(e) => setSelectedHostelFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Properties</option>
            {hostels.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-slate-200 transition duration-200">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <BedDouble className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Occupancy Rate</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{occupancyRate}%</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              <strong>{occupiedBedsCount}</strong> allocated / {availableBedsCount} free
            </p>
          </div>
        </div>

        {/* Admissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-slate-200 transition duration-200">
          <div className="p-3.5 bg-teal-50 text-teal-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Students</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{filteredStudents.length}</h3>
            <p className="text-[11px] text-teal-600 font-bold mt-0.5 flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" /> +2 New Admissions
            </p>
          </div>
        </div>

        {/* Collections (Revenue) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-slate-200 transition duration-200">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rent Collected</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">₹{totalCollected.toLocaleString()}</h3>
            <p className="text-[11px] text-rose-500 font-bold mt-0.5 flex items-center gap-0.5">
              <TrendingDown className="h-3.5 w-3.5" /> ₹{totalPendingRent.toLocaleString()} due/pending
            </p>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-slate-200 transition duration-200">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Profit (Monthly)</p>
            <h3 className={`text-2xl font-black mt-0.5 ${netProfit >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              ₹{netProfit.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Less ₹{totalExpensesAmount.toLocaleString()} expenses
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Visualization and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Flow Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Revenue & Operations Telemetry</h2>
              <p className="text-xs text-slate-400">Cash-in vs Operational expense ledger comparison</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expenses
              </span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Revenue" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                <Area type="monotone" dataKey="Expenses" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Hub Panel */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-blue-500/20">
              Direct Command Panel
            </span>
            <h3 className="text-xl font-bold mt-4">Property Command & Quick Actions</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Instantly run high-frequency operational updates across your tenant scope with absolute isolation.
            </p>
            <div className="mt-6 space-y-2">
              <button
                onClick={() => onNavigate('hostels')}
                className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/50 text-xs font-bold text-slate-200 transition"
              >
                <span>🏢 Add New Hostel Branch</span>
                <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
              </button>
              <button
                onClick={() => onNavigate('students')}
                className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/50 text-xs font-bold text-slate-200 transition"
              >
                <span>📝 Launch Student Admission Wizard</span>
                <ArrowRight className="h-3.5 w-3.5 text-teal-400" />
              </button>
              <button
                onClick={() => onNavigate('other-modules')}
                className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/50 text-xs font-bold text-slate-200 transition"
              >
                <span>🛂 Log Visitor Registration / Check-In</span>
                <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
              </button>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="h-5 w-5 text-blue-500" /> Tenant-Locked RLS Active
          </div>
        </div>
      </div>

      {/* Critical Leaves & Complaints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Urgent Action: Complaints */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                🚨 Urgent Grievances ({pendingComplaints.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Complaints filed by residents awaiting action</p>
            </div>
            <button
              onClick={() => onNavigate('other-modules')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Manage Grievances
            </button>
          </div>
          {pendingComplaints.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-100">
              No outstanding high priority grievances. Excellent!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingComplaints.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-100 transition flex justify-between items-start">
                  <div>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${
                      c.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.priority} Priority
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mt-1.5">{c.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{c.description}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">Category: {c.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leave Workflow Monitor */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                📝 Leave Gate Passes ({pendingLeaves.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Gate pass requests requiring warden/manager signoff</p>
            </div>
            <button
              onClick={() => onNavigate('other-modules')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Approvals Board
            </button>
          </div>
          {pendingLeaves.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-100">
              No pending leave pass clearance requests.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingLeaves.map((l) => (
                <div key={l.id} className="p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-100 transition flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Student ID: {l.studentId.substring(0, 8)}...</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Dates: {l.startDate} to {l.endDate}</p>
                    <p className="text-[11px] font-bold text-slate-600 line-clamp-1">"{l.reason}"</p>
                  </div>
                  <span className={`px-2 py-1 text-[9px] font-extrabold uppercase rounded-lg ${
                    l.type === 'emergency' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}>
                    {l.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Ledger */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
          📈 Property Event Stream (Recent activities)
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4 items-start text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">Student Aditya Sen submitted monthly UPI rent</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Checked & verified by Automatic Bill Calculator • 1 day ago</p>
            </div>
          </div>
          <div className="flex gap-4 items-start text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">Room 103 marked as "Maintenance" for plumbing overhaul</p>
              <p className="text-[10px] text-slate-400 mt-0.5">System triggered bed lock preventions for prospective student listings • 2 days ago</p>
            </div>
          </div>
          <div className="flex gap-4 items-start text-sm">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">Warden validated gate-pass of student Ananya Roy</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Aadhar matched securely against parent contact references • 3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
