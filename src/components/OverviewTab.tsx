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
  Home,
  CheckCircle2,
  ShieldAlert,
  Heart,
  Phone,
  Mail,
  Check,
  Calendar,
  Activity,
  Coffee,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { Hostel, Room, Bed, Student, RentRecord, Complaint, LeaveRequest, Expense, MessMenu } from '../types';

interface OverviewTabProps {
  hostels: Hostel[];
  rooms: Room[];
  beds: Bed[];
  students: Student[];
  rents: RentRecord[];
  complaints: Complaint[];
  leaves: LeaveRequest[];
  expenses: Expense[];
  messMenu: MessMenu[];
  onNavigate: (tab: string) => void;
  currentUser?: any;
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
  messMenu,
  onNavigate,
  currentUser,
}: OverviewTabProps) {
  const isStudent = currentUser?.role === 'Student' || currentUser?.role === 'Parent';

  if (isStudent) {
    const currentStudent = students.find(s => s.id === currentUser?.id);
    const studentHostel = hostels.find(h => h.id === currentStudent?.hostelId);
    const studentRoom = rooms.find(r => r.id === currentStudent?.roomId);
    const studentBed = beds.find(b => b.id === currentStudent?.bedId);
    
    const myRents = rents.filter(r => r.studentId === currentUser?.id);
    const myComplaints = complaints.filter(c => c.studentId === currentUser?.id);
    const myLeaves = leaves.filter(l => l.studentId === currentUser?.id);
    const myMess = studentHostel ? messMenu.filter(m => m.hostelId === studentHostel.id) : [];

    const pendingRentCount = myRents.filter(r => r.status !== 'paid').length;
    const resolvedComplaintsCount = myComplaints.filter(c => c.status === 'resolved').length;
    const pendingComplaintsCount = myComplaints.length - resolvedComplaintsCount;
    const approvedLeavesCount = myLeaves.filter(l => l.status === 'approved').length;

    return (
      <div className="space-y-6 font-sans">
        {/* Welcome Card banner */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg overflow-hidden border border-blue-500/10">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute right-12 bottom-0 w-48 h-48 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-2xl uppercase shadow-inner text-white">
                {currentUser?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <span className="px-2 py-0.5 bg-blue-500/30 text-blue-200 text-[10px] font-black uppercase tracking-widest rounded-md border border-white/10">
                  Student Portal Active
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                  Welcome back, {currentUser?.name}!
                </h1>
                <p className="text-sm text-blue-100 mt-1 flex items-center gap-1.5 font-medium">
                  <Home className="h-4 w-4 shrink-0 text-blue-300" /> 
                  {studentHostel?.name || 'Assigned Hostel'} • Room {studentRoom?.roomNumber || 'N/A'} • Bed {studentBed?.bedNumber || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs font-semibold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SaaS RLS Secure Isolation Active
            </div>
          </div>
        </div>

        {/* Quick KPI stats blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div>
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Unpaid Rent Bills</span>
              <span className={`text-2xl font-black mt-1 block ${pendingRentCount > 0 ? 'text-rose-600' : 'text-slate-800 dark:text-white'}`}>
                {pendingRentCount}
              </span>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pendingRentCount > 0 ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div>
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Active Complaints</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">
                {pendingComplaintsCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <AlertOctagon className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div>
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Approved Leave Passes</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                {approvedLeavesCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div>
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Police Verification</span>
              <span className={`text-xs font-black mt-2 block px-2 py-0.5 rounded uppercase max-w-max ${
                currentStudent?.policeVerification === 'verified'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                  : currentStudent?.policeVerification === 'failed'
                  ? 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
                  : 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
              }`}>
                {currentStudent?.policeVerification || 'Pending'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Dynamic Multi-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Resident Profile Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" /> My Resident Profile
              </h3>
              
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img src={currentStudent?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'} alt={currentStudent?.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{currentStudent?.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">College ID: {currentStudent?.collegeIdNo || 'N/A'}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">College Name:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-right">{currentStudent?.collegeName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Mobile Number:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentStudent?.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Email Address:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentStudent?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Parent Contact:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentStudent?.parentName} ({currentStudent?.parentPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Blood Group:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentStudent?.medicalInfo?.bloodGroup || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Admission Date:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentStudent?.admissionDate || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Student Profile Locked to Verified ID
            </div>
          </div>

          {/* Today's Mess Menu Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Coffee className="h-4 w-4 text-amber-500" /> Today's Mess Schedule
              </h3>
              
              {myMess.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Mess menu schedule is not configured for your hostel property.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Find today's day of week or default to Mon */}
                  {(() => {
                    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const todayDayName = daysOfWeek[new Date().getDay()] || 'Monday';
                    const todayMenu = myMess.find(m => m.day.toLowerCase() === todayDayName.toLowerCase()) || myMess[0];
                    
                    return (
                      <>
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 mb-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Day schedule:</span>
                          <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 px-2.5 py-0.5 rounded-lg border border-blue-100 dark:border-blue-900/30 uppercase tracking-wider">
                            {todayMenu.day}
                          </span>
                        </div>
                        
                        <div className="space-y-3.5">
                          <div className="flex gap-3">
                            <span className="text-base shrink-0">🍳</span>
                            <div>
                              <strong className="block text-xs text-slate-500 uppercase tracking-wider font-extrabold">Breakfast Menu</strong>
                              <p className="text-slate-800 dark:text-slate-200 text-xs font-semibold mt-0.5 leading-snug">{todayMenu.breakfast || 'Not Specified'}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <span className="text-base shrink-0">🍛</span>
                            <div>
                              <strong className="block text-xs text-slate-500 uppercase tracking-wider font-extrabold">Lunch Menu</strong>
                              <p className="text-slate-800 dark:text-slate-200 text-xs font-semibold mt-0.5 leading-snug">{todayMenu.lunch || 'Not Specified'}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <span className="text-base shrink-0">🍲</span>
                            <div>
                              <strong className="block text-xs text-slate-500 uppercase tracking-wider font-extrabold">Dinner Menu</strong>
                              <p className="text-slate-800 dark:text-slate-200 text-xs font-semibold mt-0.5 leading-snug">{todayMenu.dinner || 'Not Specified'}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('other-modules')}
              className="mt-6 w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition"
            >
              <span>View Weekly Mess Schedule</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
            </button>
          </div>

          {/* Quick Direct Actions & Contact Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-blue-500/20">
                LuxeHostel Helpline
              </span>
              <h3 className="text-xl font-bold mt-4">Helpdesk & Portal Support</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Connect instantly with the property warden, manager, or mess committee for fast-track grievance resolution.
              </p>
              
              <div className="mt-6 space-y-3.5">
                <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                  <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Hostel Warden Hotline</span>
                    <strong className="text-slate-200">+91 98765 43210</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                  <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                  <div className="text-xs">
                    <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Property Support Email</span>
                    <strong className="text-slate-200">help@luxehostels.com</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={() => onNavigate('other-modules')}
                className="w-full flex items-center justify-between p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold text-white transition shadow-lg shadow-blue-600/20"
              >
                <span>📝 Log New Complaint/Grievance</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onNavigate('other-modules')}
                className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-750 rounded-xl text-xs font-bold text-slate-200 transition"
              >
                <span>🚪 Request Leave Gate-Pass</span>
                <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
              </button>
            </div>
          </div>
        </div>

        {/* My Rent Bills Ledger */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-blue-600" /> My Rent Bills Ledger
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Your monthly accommodation rent invoices and transaction ledger</p>
            </div>
            <button
              onClick={() => onNavigate('rents')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              Go to Full Ledger <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          {myRents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
              No rent records listed for your profile in this property tenant scope.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/75 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="p-3">Receipt No</th>
                    <th className="p-3">Billing Month</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Breakup Summary</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Payment Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myRents.map((rent) => (
                    <tr key={rent.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition text-slate-750 dark:text-slate-300">
                      <td className="p-3 font-mono font-bold text-slate-800 dark:text-white">{rent.receiptNo}</td>
                      <td className="p-3 font-semibold">{rent.month}</td>
                      <td className="p-3 text-slate-500">{rent.dueDate}</td>
                      <td className="p-3 text-slate-400 max-w-xs truncate">
                        ₹{rent.baseRent} Rent + ₹{rent.electricityCharges} Elec + ₹{rent.messCharges} Mess
                      </td>
                      <td className="p-3 font-black text-slate-950 dark:text-white">₹{rent.totalDue.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase rounded border ${
                          rent.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/20'
                            : rent.status === 'partial'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/20'
                            : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/20'
                        }`}>
                          {rent.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onNavigate('rents')}
                          className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 font-black text-[10px] rounded-lg uppercase tracking-wider transition"
                        >
                          View/Pay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Grievances & Leave Gate-Passes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Urgent Action: Complaints */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  🚨 My Filed Grievances ({myComplaints.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Track your ticket resolution statuses</p>
              </div>
              <button
                onClick={() => onNavigate('other-modules')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Manage
              </button>
            </div>
            
            {myComplaints.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                You haven't filed any complaints. Good job!
              </div>
            ) : (
              <div className="space-y-3">
                {myComplaints.slice(0, 3).map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100/50 rounded-xl border border-slate-100 dark:border-slate-850 transition flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded ${
                          c.priority === 'high' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                        }`}>
                          {c.priority} Priority
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded ${
                          c.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1.5">{c.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{c.description}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">Category: {c.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leave Passes */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  📝 My Leave Gate-Passes ({myLeaves.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Clearance logs for overnight or emergency exits</p>
              </div>
              <button
                onClick={() => onNavigate('other-modules')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Apply
              </button>
            </div>
            
            {myLeaves.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                No leave requests filed or active.
              </div>
            ) : (
              <div className="space-y-3">
                {myLeaves.slice(0, 3).map((l) => (
                  <div key={l.id} className="p-3 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100/50 rounded-xl border border-slate-100 dark:border-slate-850 transition flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">Dates: {l.startDate} to {l.endDate}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-semibold">Reason: "{l.reason}"</p>
                      {l.approvedBy && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">✓ Cleared by: {l.approvedBy}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                        l.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : l.status === 'rejected' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {l.status}
                      </span>
                      {l.gatePassGenerated && (
                        <span className="text-[8px] bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-150 dark:border-blue-900/30 px-1 py-0.5 rounded uppercase font-black tracking-widest">
                          Gate-Pass Generated
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }

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
