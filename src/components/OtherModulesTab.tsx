import React, { useState } from 'react';
import {
  AttendanceRecord,
  Visitor,
  LeaveRequest,
  Complaint,
  MessMenu,
  InventoryItem,
  Expense,
  Student,
  Hostel,
} from '../types';
import {
  CalendarDays,
  UserCheck,
  FolderOpen,
  AlertOctagon,
  UtensilsCrossed,
  PackageCheck,
  CircleDollarSign,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Send,
} from 'lucide-react';

interface OtherModulesTabProps {
  hostels: Hostel[];
  students: Student[];
  attendance: AttendanceRecord[];
  setAttendance: (att: AttendanceRecord[]) => void;
  visitors: Visitor[];
  setVisitors: (vis: Visitor[]) => void;
  leaves: LeaveRequest[];
  setLeaves: (leaves: LeaveRequest[]) => void;
  complaints: Complaint[];
  setComplaints: (complaints: Complaint[]) => void;
  messMenu: MessMenu[];
  setMessMenu: (menu: MessMenu[]) => void;
  inventory: InventoryItem[];
  setInventory: (inv: InventoryItem[]) => void;
  expenses: Expense[];
  setExpenses: (exp: Expense[]) => void;
}

export default function OtherModulesTab({
  hostels,
  students,
  attendance,
  setAttendance,
  visitors,
  setVisitors,
  leaves,
  setLeaves,
  complaints,
  setComplaints,
  messMenu,
  setMessMenu,
  inventory,
  setInventory,
  expenses,
  setExpenses,
}: OtherModulesTabProps) {
  const [activeModule, setActiveModule] = useState<'attendance' | 'visitors' | 'leaves' | 'complaints' | 'mess' | 'inventory' | 'expenses'>('attendance');
  const [selectedHostel, setSelectedHostel] = useState<string>(hostels[0]?.id || '');

  // Filter students by current hostel
  const hostelStudents = students.filter(s => s.hostelId === selectedHostel);

  // --- ATTENDANCE CODE ---
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attTime, setAttTime] = useState<'morning' | 'night'>('night');

  const handleToggleAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    // Check if record exists
    const existingIdx = attendance.findIndex(a => a.studentId === studentId && a.date === attDate && a.time === attTime);

    if (existingIdx > -1) {
      const updated = [...attendance];
      updated[existingIdx].status = status;
      setAttendance(updated);
    } else {
      const newRec: AttendanceRecord = {
        id: `att_${Date.now()}_${studentId}`,
        studentId,
        hostelId: selectedHostel,
        date: attDate,
        time: attTime,
        status,
      };
      setAttendance([...attendance, newRec]);
    }
  };

  const getAttendanceStatus = (studentId: string) => {
    const found = attendance.find(a => a.studentId === studentId && a.date === attDate && a.time === attTime);
    return found ? found.status : undefined;
  };


  // --- VISITOR CODE ---
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorPurpose, setVisitorPurpose] = useState('');
  const [vStudentId, setVStudentId] = useState('');

  const handleRegisterVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    const newVis: Visitor = {
      id: `vis_${Date.now()}`,
      hostelId: selectedHostel,
      name: visitorName,
      phone: visitorPhone,
      purpose: visitorPurpose,
      studentId: vStudentId || undefined,
      checkIn: new Date().toISOString(),
    };
    setVisitors([newVis, ...visitors]);
    setVisitorName('');
    setVisitorPhone('');
    setVisitorPurpose('');
    setVStudentId('');
  };

  const handleCheckOutVisitor = (id: string) => {
    setVisitors(visitors.map(v => {
      if (v.id === id) {
        return { ...v, checkOut: new Date().toISOString() };
      }
      return v;
    }));
  };


  // --- LEAVE CODE ---
  const [lStudentId, setLStudentId] = useState('');
  const [lStart, setLStart] = useState('');
  const [lEnd, setLEnd] = useState('');
  const [lReason, setLReason] = useState('');
  const [lType, setLType] = useState<'regular' | 'emergency'>('regular');

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const newL: LeaveRequest = {
      id: `leave_${Date.now()}`,
      studentId: lStudentId,
      hostelId: selectedHostel,
      startDate: lStart,
      endDate: lEnd,
      reason: lReason,
      type: lType,
      status: 'pending',
      gatePassGenerated: false,
    };
    setLeaves([...leaves, newL]);
    setLStudentId('');
    setLStart('');
    setLEnd('');
    setLReason('');
    setLType('regular');
  };

  const handleApproveLeave = (id: string, status: 'approved' | 'rejected') => {
    setLeaves(leaves.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status,
          gatePassGenerated: status === 'approved',
          approvedBy: 'Admin Warden Signoff',
        };
      }
      return l;
    }));
  };


  // --- COMPLAINTS CODE ---
  const [cCategory, setCCategory] = useState<'Electrical' | 'Plumbing' | 'Cleaning' | 'Mess/Food' | 'Wifi/Internet' | 'Security' | 'Miscellaneous'>('Electrical');
  const [cTitle, setCTitle] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cPriority, setCPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [cStudent, setCStudent] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentingComplaintId, setCommentingComplaintId] = useState<string | null>(null);

  const handleLogComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const newC: Complaint = {
      id: `comp_${Date.now()}`,
      studentId: cStudent || 'student_1_1',
      hostelId: selectedHostel,
      category: cCategory,
      title: cTitle,
      description: cDesc,
      priority: cPriority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setComplaints([newC, ...complaints]);
    setCTitle('');
    setCDesc('');
    setCPriority('medium');
    setCStudent('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText || !commentingComplaintId) return;

    setComplaints(complaints.map(c => {
      if (c.id === commentingComplaintId) {
        return {
          ...c,
          status: 'resolving',
          comments: [
            ...c.comments,
            {
              id: `comment_${Date.now()}`,
              author: 'Property Manager',
              role: 'Manager',
              text: newCommentText,
              time: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    }));

    setNewCommentText('');
    setCommentingComplaintId(null);
  };

  const handleResolveComplaint = (id: string) => {
    setComplaints(complaints.map(c => {
      if (c.id === id) {
        return { ...c, status: 'resolved' };
      }
      return c;
    }));
  };


  // --- MESS CODE ---
  const handleUpdateMessMenu = (day: string, type: 'breakfast' | 'lunch' | 'dinner', text: string) => {
    setMessMenu(messMenu.map(m => {
      if (m.day === day && m.hostelId === selectedHostel) {
        return { ...m, [type]: text };
      }
      return m;
    }));
  };


  // --- INVENTORY CODE ---
  const [invName, setInvName] = useState('');
  const [invCategory, setInvCategory] = useState<'Furniture' | 'Mattress/Pillow' | 'Kitchen' | 'Electrical' | 'Cleaning Supply' | 'Other'>('Furniture');
  const [invQty, setInvQty] = useState(10);
  const [invCondition, setInvCondition] = useState<'Excellent' | 'Good' | 'Fair' | 'Damaged'>('Good');
  const [invCost, setInvCost] = useState(5000);

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: InventoryItem = {
      id: `inv_${Date.now()}`,
      hostelId: selectedHostel,
      name: invName,
      category: invCategory,
      totalQty: invQty,
      allocatedQty: 0,
      condition: invCondition,
      lastPurchaseDate: new Date().toISOString().split('T')[0],
      totalCost: invCost,
    };
    setInventory([...inventory, newItem]);
    setInvName('');
    setInvQty(10);
    setInvCost(5000);
  };


  // --- EXPENSE CODE ---
  const [expCat, setExpCat] = useState<'Electricity' | 'Salary' | 'Food' | 'Maintenance' | 'Cleaning' | 'Gas' | 'Internet' | 'Miscellaneous'>('Maintenance');
  const [expAmt, setExpAmt] = useState(2500);
  const [expDesc, setExpDesc] = useState('');
  const [expTo, setExpTo] = useState('');

  const handleRecordExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newE: Expense = {
      id: `exp_${Date.now()}`,
      hostelId: selectedHostel,
      category: expCat,
      amount: expAmt,
      date: new Date().toISOString().split('T')[0],
      description: expDesc,
      paidTo: expTo,
    };
    setExpenses([newE, ...expenses]);
    setExpAmt(2500);
    setExpDesc('');
    setExpTo('');
  };


  return (
    <div className="space-y-6 font-sans">
      {/* Scope control header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">SaaS Auxiliary Modules</h1>
          <p className="text-sm text-slate-500 mt-1">
            Toggle auxiliary sub-systems for daily attendance checks, guest logs, complaints, and expense pipelines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hostel Scope:</label>
          <select
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none"
          >
            {hostels.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Auxiliary module switch bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
        {[
          { id: 'attendance', label: 'Attendance logs', icon: CalendarDays },
          { id: 'visitors', label: 'Visitor Logs', icon: UserCheck },
          { id: 'leaves', label: 'Leave gatepass', icon: FolderOpen },
          { id: 'complaints', label: 'Grievance desk', icon: AlertOctagon },
          { id: 'mess', label: 'Mess builder', icon: UtensilsCrossed },
          { id: 'inventory', label: 'Inventory list', icon: PackageCheck },
          { id: 'expenses', label: 'Expense logs', icon: CircleDollarSign },
        ].map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE IMPLEMENTATION */}

      {/* 1. ATTENDANCE */}
      {activeModule === 'attendance' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Morning & Night Residence Muster</h2>
              <p className="text-xs text-slate-400">Lock date/shift and check-off student presence securely</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={attDate}
                onChange={(e) => setAttDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold"
              />
              <select
                value={attTime}
                onChange={(e: any) => setAttTime(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
              >
                <option value="morning">🌅 Morning Check-in</option>
                <option value="night">🌙 Curfew Night Muster</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {hostelStudents.map(s => {
              const currentStatus = getAttendanceStatus(s.id);

              return (
                <div key={s.id} className="p-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100">
                      <img src={s.photoUrl} alt={s.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{s.name}</p>
                      <p className="text-[10px] text-slate-400">ID: {s.collegeIdNo}</p>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleToggleAttendance(s.id, 'present')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase transition ${
                        currentStatus === 'present'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleToggleAttendance(s.id, 'absent')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase transition ${
                        currentStatus === 'absent'
                          ? 'bg-rose-600 text-white'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => handleToggleAttendance(s.id, 'late')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase transition ${
                        currentStatus === 'late'
                          ? 'bg-amber-600 text-white'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      Late
                    </button>
                  </div>
                </div>
              );
            })}

            {hostelStudents.length === 0 && (
              <p className="text-center text-slate-400 py-12 text-xs font-bold">No students registered in current property branch scope.</p>
            )}
          </div>
        </div>
      )}

      {/* 2. VISITORS */}
      {activeModule === 'visitors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-150">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-1 h-fit">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">🛂 Guest Registration</h2>
            <form onSubmit={handleRegisterVisitor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Mobile</label>
                <input
                  type="text"
                  required
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Purpose of Visit</label>
                <textarea
                  required
                  rows={2}
                  value={visitorPurpose}
                  onChange={(e) => setVisitorPurpose(e.target.value)}
                  placeholder="e.g. Delv clothes to room"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Associate Resident (Optional)</label>
                <select
                  value={vStudentId}
                  onChange={(e) => setVStudentId(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="">-- No resident associated --</option>
                  {hostelStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl"
              >
                Log Check-In
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">🛂 Guest Access Stream</h2>
            <div className="space-y-3">
              {visitors.filter(v => v.hostelId === selectedHostel).map(vis => (
                <div key={vis.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <h3 className="font-bold text-slate-900">{vis.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Phone: {vis.phone} | Purpose: "{vis.purpose}"</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      In: {new Date(vis.checkIn).toLocaleTimeString()}
                      {vis.checkOut ? ` | Out: ${new Date(vis.checkOut).toLocaleTimeString()}` : ' (Active check-in)'}
                    </p>
                  </div>
                  {!vis.checkOut && (
                    <button
                      onClick={() => handleCheckOutVisitor(vis.id)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-black text-slate-700"
                    >
                      Check-Out
                    </button>
                  )}
                </div>
              ))}
              {visitors.filter(v => v.hostelId === selectedHostel).length === 0 && (
                <p className="text-center text-slate-400 py-12">No guests recorded today.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. LEAVES */}
      {activeModule === 'leaves' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-150">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-1 h-fit">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">🎟 Request Gate Pass</h2>
            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Select Student</label>
                <select
                  required
                  value={lStudentId}
                  onChange={(e) => setLStudentId(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="">-- Choose profile --</option>
                  {hostelStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={lStart}
                    onChange={(e) => setLStart(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={lEnd}
                    onChange={(e) => setLEnd(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Leave Reason</label>
                <input
                  type="text"
                  required
                  value={lReason}
                  onChange={(e) => setLReason(e.target.value)}
                  placeholder=" cousin's marriage etc."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Severity / Type</label>
                <select
                  value={lType}
                  onChange={(e: any) => setLType(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="regular">Regular Leave</option>
                  <option value="emergency">🚨 Emergency Leave</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl"
              >
                Log Gate-Pass Request
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">🎟 Leave Approval Workflow</h2>
            <div className="space-y-3">
              {leaves.filter(l => l.hostelId === selectedHostel).map(l => {
                const s = students.find(std => std.id === l.studentId);
                return (
                  <div key={l.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between md:flex-row md:items-center gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900">{s?.name || 'Student Profile'}</h3>
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md ${
                          l.type === 'emergency' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {l.type}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1">Dates: <strong>{l.startDate}</strong> to <strong>{l.endDate}</strong></p>
                      <p className="text-slate-600 italic mt-0.5">"{l.reason}"</p>
                      {l.status === 'approved' && (
                        <p className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                          ✓ Signed: {l.approvedBy}
                        </p>
                      )}
                    </div>

                    <div>
                      {l.status === 'pending' ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleApproveLeave(l.id, 'approved')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveLeave(l.id, 'rejected')}
                            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${
                          l.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {l.status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. COMPLAINTS */}
      {activeModule === 'complaints' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-150">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-1 h-fit">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">🚨 Log Grievance / Complaint</h2>
            <form onSubmit={handleLogComplaint} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Filing Resident</label>
                <select
                  required
                  value={cStudent}
                  onChange={(e) => setCStudent(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="">-- Choose student profile --</option>
                  {hostelStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Grievance Category</label>
                <select
                  value={cCategory}
                  onChange={(e: any) => setCCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="Electrical">Electrical (Fan/Light/AC)</option>
                  <option value="Plumbing">Plumbing (Tap/Geyser)</option>
                  <option value="Cleaning">Cleaning / Hygiene</option>
                  <option value="Mess/Food">Mess / Food quality</option>
                  <option value="Wifi/Internet">Wi-Fi Internet issues</option>
                  <option value="Security">Security / Lock-out</option>
                  <option value="Miscellaneous">Other Miscellaneous</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Issue Headline</label>
                <input
                  type="text"
                  required
                  value={cTitle}
                  onChange={(e) => setCTitle(e.target.value)}
                  placeholder=" Fan making noises"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Description</label>
                <textarea
                  required
                  rows={3}
                  value={cDesc}
                  onChange={(e) => setCDesc(e.target.value)}
                  placeholder="Explain issue in detail..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Grievance Priority</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input type="radio" checked={cPriority === 'low'} onChange={() => setCPriority('low')} /> Low
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input type="radio" checked={cPriority === 'medium'} onChange={() => setCPriority('medium')} /> Medium
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input type="radio" checked={cPriority === 'high'} onChange={() => setCPriority('high')} /> High
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl"
              >
                Log Grievance Ticket
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-2">🚨 Grievances Helpdesk</h2>

            <div className="space-y-4">
              {complaints.filter(c => c.hostelId === selectedHostel).map((comp) => {
                const s = students.find(std => std.id === comp.studentId);
                return (
                  <div key={comp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md ${
                          comp.priority === 'high' ? 'bg-rose-100 text-rose-800' : comp.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {comp.priority} Priority
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-sm mt-1.5">{comp.title}</h3>
                        <p className="text-slate-400 text-[10px] mt-0.5">Filer: {s?.name} ({comp.category})</p>
                      </div>
                      <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg border ${
                        comp.status === 'resolved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : comp.status === 'resolving' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {comp.status}
                      </span>
                    </div>

                    <p className="text-slate-600 font-semibold leading-relaxed">"{comp.description}"</p>

                    {/* Comments Timeline */}
                    <div className="border-t border-slate-200/50 pt-3 space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Warden Timeline Log</h4>
                      {comp.comments.map((comm) => (
                        <div key={comm.id} className="bg-white p-2 rounded-xl border border-slate-100 text-[11px]">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{comm.author} ({comm.role})</span>
                            <span className="text-[9px] text-slate-400">{new Date(comm.time).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-slate-600 mt-1">{comm.text}</p>
                        </div>
                      ))}

                      {commentingComplaintId === comp.id ? (
                        <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
                          <input
                            type="text"
                            required
                            placeholder="Type progress update comment..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="submit"
                            className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                          >
                            <Send className="h-3 w-3" />
                          </button>
                        </form>
                      ) : (
                        <div className="flex gap-2 mt-2">
                          {comp.status !== 'resolved' && (
                            <>
                              <button
                                onClick={() => setCommentingComplaintId(comp.id)}
                                className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600"
                              >
                                💬 Add Status Update
                              </button>
                              <button
                                onClick={() => handleResolveComplaint(comp.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                              >
                                ✓ Resolve Ticket
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. MESS MENU */}
      {activeModule === 'mess' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 animate-in fade-in duration-150">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Mess Menu Builder</h2>
            <p className="text-xs text-slate-400">Modify daily catering schedules dynamically for the current hostel campus</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messMenu.filter(m => m.hostelId === selectedHostel).map((dayMenu) => (
              <div key={dayMenu.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3 text-xs">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-1 flex items-center justify-between">
                  <span>🍱 {dayMenu.day} Menu</span>
                  <span className="text-[10px] text-blue-500 uppercase font-black">7-Day Cycle</span>
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Breakfast (7:30 AM - 9:00 AM)</label>
                    <input
                      type="text"
                      value={dayMenu.breakfast}
                      onChange={(e) => handleUpdateMessMenu(dayMenu.day, 'breakfast', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Lunch (12:30 PM - 2:00 PM)</label>
                    <input
                      type="text"
                      value={dayMenu.lunch}
                      onChange={(e) => handleUpdateMessMenu(dayMenu.day, 'lunch', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Dinner (8:00 PM - 9:30 PM)</label>
                    <input
                      type="text"
                      value={dayMenu.dinner}
                      onChange={(e) => handleUpdateMessMenu(dayMenu.day, 'dinner', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. INVENTORY */}
      {activeModule === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-150">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-1 h-fit">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">🚪 Register Property Asset</h2>
            <form onSubmit={handleAddInventory} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Asset/Item Name</label>
                <input
                  type="text"
                  required
                  value={invName}
                  onChange={(e) => setInvName(e.target.value)}
                  placeholder="e.g. Wooden Study Table"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                <select
                  value={invCategory}
                  onChange={(e: any) => setInvCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="Furniture">Furniture (Chairs/Tables)</option>
                  <option value="Mattress/Pillow">Mattress/Pillow Blocks</option>
                  <option value="Kitchen">Kitchen Equipment</option>
                  <option value="Electrical">Electrical Spares</option>
                  <option value="Cleaning Supply">Cleaning Supplies</option>
                  <option value="Other">Other Assets</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={invQty}
                    onChange={(e) => setInvQty(parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Cost (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={invCost}
                    onChange={(e) => setInvCost(parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Condition Status</label>
                <select
                  value={invCondition}
                  onChange={(e: any) => setInvCondition(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Excellent">Excellent condition</option>
                  <option value="Good">Good / Workable</option>
                  <option value="Fair">Fair / Requires check</option>
                  <option value="Damaged">Damaged / Broken</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
              >
                Register Asset Item
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">📦 Campus Inventory Registry</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] font-semibold text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase">
                    <th className="p-3">Asset Item</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Total Qty</th>
                    <th className="p-3">Estimated Cost</th>
                    <th className="p-3">Condition Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {inventory.filter(i => i.hostelId === selectedHostel).map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-800">{item.name}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3">{item.totalQty} Units</td>
                      <td className="p-3 font-bold text-slate-900">₹{item.totalCost.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                          item.condition === 'Excellent' ? 'bg-emerald-50 text-emerald-800' : item.condition === 'Good' ? 'bg-blue-50 text-blue-800' : 'bg-rose-50 text-rose-800'
                        }`}>
                          {item.condition}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. EXPENSES */}
      {activeModule === 'expenses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-150">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-1 h-fit">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">💳 Record Operation Expense</h2>
            <form onSubmit={handleRecordExpense} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Expense Category</label>
                <select
                  value={expCat}
                  onChange={(e: any) => setExpCat(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="Electricity">Electricity Bills</option>
                  <option value="Salary">Staff Salary</option>
                  <option value="Food">Food / Kitchen Groceries</option>
                  <option value="Maintenance">Plumbing / Repairs</option>
                  <option value="Cleaning">Cleaning & Consumables</option>
                  <option value="Gas">LPG Gas refilling</option>
                  <option value="Internet">Internet lease line</option>
                  <option value="Miscellaneous">Other Miscellaneous</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Expense Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={expAmt}
                  onChange={(e) => setExpAmt(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Payee / Vendor name</label>
                <input
                  type="text"
                  required
                  value={expTo}
                  onChange={(e) => setExpTo(e.target.value)}
                  placeholder="e.g. State Power Corporation"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Electricity billing June 2026 etc."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
              >
                Log Expense
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">💳 Operation Expense Ledger</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] font-semibold text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase">
                    <th className="p-3">Expense Details</th>
                    <th className="p-3">Payee Vendor</th>
                    <th className="p-3">Amount Charged</th>
                    <th className="p-3">Date logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {expenses.filter(e => e.hostelId === selectedHostel).map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <span className="block font-bold text-slate-800">{exp.description}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Category: {exp.category}</span>
                      </td>
                      <td className="p-3">{exp.paidTo || 'N/A'}</td>
                      <td className="p-3 font-bold text-rose-600">-₹{exp.amount.toLocaleString()}</td>
                      <td className="p-3 font-mono text-slate-400">{exp.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
