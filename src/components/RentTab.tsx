import React, { useState, useEffect } from 'react';
import { RentRecord, Student, Bed, Hostel, Room, RentNotification } from '../types';
import { Receipt, Search, Plus, CreditCard, Check, Download, AlertCircle, FileText, Sparkles, Bell, Send, CheckCircle2, RefreshCw, Mail, Smartphone, Users } from 'lucide-react';
import { loadState, saveState } from '../data';

interface RentTabProps {
  rents: RentRecord[];
  setRents: (rents: RentRecord[]) => void;
  students: Student[];
  beds: Bed[];
  hostels: Hostel[];
  rooms: Room[];
}

export default function RentTab({ rents, setRents, students, beds, hostels, rooms }: RentTabProps) {
  const [selectedHostel, setSelectedHostel] = useState<string>(hostels[0]?.id || '');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReceipt, setActiveReceipt] = useState<RentRecord | null>(null);

  // Sub tab tracking and notification records state
  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'notifications'>('ledger');
  const [notificationLogs, setNotificationLogs] = useState<RentNotification[]>(() => {
    return loadState<RentNotification[]>('rent_notifications_log', []);
  });

  const currentUser = loadState<any>('active_session_user', null);
  const isStudent = currentUser?.role === 'Student' || currentUser?.role === 'Parent';

  // Filters notification logs based on role-based tenant constraints
  const displayedNotificationLogs = isStudent && currentUser?.id
    ? notificationLogs.filter(l => l.studentId === currentUser.id)
    : notificationLogs.filter(l => {
        // Find if student is in selected hostel
        const st = students.find(s => s.id === l.studentId);
        return st && st.hostelId === selectedHostel;
      });

  // Form Fields
  const [targetStudentId, setTargetStudentId] = useState('');
  const [month, setMonth] = useState('2026-07');
  const [baseRent, setBaseRent] = useState<number>(8000);
  const [electricityCharges, setElectricityCharges] = useState<number>(500);
  const [messCharges, setMessCharges] = useState<number>(3000);
  const [waterCharges, setWaterCharges] = useState<number>(100);
  const [internetCharges, setInternetCharges] = useState<number>(300);
  const [lateFees, setLateFees] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [dueDate, setDueDate] = useState('2026-07-10');

  // Lists and stats
  const activeHostelStudentIds = students.filter(s => s.hostelId === selectedHostel).map(s => s.id);
  const filteredRents = rents.filter(r => activeHostelStudentIds.includes(r.studentId) &&
    (students.find(s => s.id === r.studentId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  const calculateTotalDue = () => {
    return Number(baseRent) + Number(electricityCharges) + Number(messCharges) + Number(waterCharges) + Number(internetCharges) + Number(lateFees) - Number(discount);
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetStudentId) {
      alert("Please select a student target!");
      return;
    }

    const studentObj = students.find(s => s.id === targetStudentId);
    if (!studentObj) return;

    // Check if invoice for student and month already generated
    if (rents.some(r => r.studentId === targetStudentId && r.month === month)) {
      alert(`Invoice is already active for this student in ${month}!`);
      return;
    }

    const totalDue = calculateTotalDue();
    const newRentRecord: RentRecord = {
      id: `rent_${Date.now()}`,
      studentId: targetStudentId,
      bedId: studentObj.bedId || '',
      month,
      baseRent,
      electricityCharges,
      messCharges,
      waterCharges,
      internetCharges,
      lateFees,
      discount,
      totalDue,
      paidAmount: 0,
      status: 'unpaid',
      dueDate,
      receiptNo: `REC-2026-07-0${rents.length + 1}`,
    };

    setRents([newRentRecord, ...rents]);

    // Reset Form Fields
    setTargetStudentId('');
    setMonth('2026-07');
    setBaseRent(8000);
    setElectricityCharges(500);
    setMessCharges(3000);
    setWaterCharges(100);
    setInternetCharges(300);
    setLateFees(0);
    setDiscount(0);
    setDueDate('2026-07-10');
    setShowInvoiceForm(false);
  };

  const handleRecordPayment = (rentId: string, method: 'Cash' | 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking') => {
    setRents(rents.map(r => {
      if (r.id === rentId) {
        return {
          ...r,
          paidAmount: r.totalDue,
          status: 'paid',
          paidDate: new Date().toISOString().split('T')[0],
          paymentMethod: method,
        };
      }
      return r;
    }));
  };

  // Automated rent notification dispatch trigger
  const handleTriggerAutomatedNotifications = () => {
    const notifyEnabled = loadState('notify_enabled', true);
    if (!notifyEnabled) {
      alert("Rent payments automated notifications system is currently INACTIVE. Enable it inside the 'Automated Rent Payments Notification System' configurator panel under settings.");
      return;
    }

    const notifyUpcoming = loadState('notify_upcoming', true);
    const notifyUpcomingDays = loadState('notify_upcoming_days', 5);
    const notifyOverdue = loadState('notify_overdue', true);
    const notifyChannel = loadState('notify_channel', 'both');
    const notifyRecipients = loadState('notify_recipients', 'both');
    const paymentDetails = loadState('notify_payment_details', 'UPI ID: rentpay@luxehostel | Net Banking: HDFC Bank A/C 501002345678 (IFSC: HDFC0000123)');

    // Relative mock time reference: 2026-07-05
    const today = new Date('2026-07-05');
    const newLogs: RentNotification[] = [];

    rents.forEach(rent => {
      const student = students.find(s => s.id === rent.studentId);
      if (!student || student.hostelId !== selectedHostel) return;

      // Only notify for unpaid or partially paid records
      if (rent.status === 'paid') return;

      const dueDateObj = new Date(rent.dueDate);
      const diffTime = dueDateObj.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let shouldNotify = false;
      let type: 'upcoming' | 'overdue' = 'upcoming';

      if (diffDays === notifyUpcomingDays && notifyUpcoming) {
        shouldNotify = true;
        type = 'upcoming';
      } else if (diffDays < 0 && notifyOverdue) {
        shouldNotify = true;
        type = 'overdue';
      }

      // Check if we already processed a reminder for this rent and type today
      const alreadySent = notificationLogs.some(
        l => l.rentId === rent.id && l.type === type && l.dateSent.startsWith('2026-07-05')
      );

      if (shouldNotify && !alreadySent) {
        const channels = notifyChannel === 'both' ? ['Email', 'In-App'] : notifyChannel === 'email' ? ['Email'] : ['In-App'];
        const recipients = notifyRecipients === 'both' ? ['Student', 'Parent'] : notifyRecipients === 'students' ? ['Student'] : ['Parent'];

        const msgBody = type === 'upcoming'
          ? `Dear ${student.name}, this is a friendly automated reminder that your hostel accommodation rent of ₹${rent.totalDue.toLocaleString()} for the billing month ${rent.month} is due on ${rent.dueDate}. Please clear your dues securely using the configured payment modes: ${paymentDetails}.`
          : `URGENT ALERT: Your hostel accommodation rent billing of ₹${rent.totalDue.toLocaleString()} for ${rent.month} was due on ${rent.dueDate} and is now OVERDUE. Kindly settle immediately using any of the accepted payment methods: ${paymentDetails}.`;

        newLogs.push({
          id: `notif_auto_${Date.now()}_${rent.id}`,
          studentId: rent.studentId,
          studentName: student.name,
          parentName: student.parentName,
          rentId: rent.id,
          month: rent.month,
          type,
          amountDue: rent.totalDue,
          channels,
          recipients,
          dateSent: '2026-07-05 18:35',
          status: 'Delivered',
          messageBody: msgBody,
          paymentDetails
        });
      }
    });

    if (newLogs.length > 0) {
      const updatedLogs = [...newLogs, ...notificationLogs];
      setNotificationLogs(updatedLogs);
      saveState('rent_notifications_log', updatedLogs);
      alert(`Automated scan finished successfully! Dispatch summary:\n- Generated & dispatched ${newLogs.length} matching pending rent alerts.\n- Notifications delivered securely via local email and in-app portals.`);
    } else {
      alert("Billing scanner executed successfully!\nNo new rent records met the upcoming/overdue offset criteria relative to today (July 5, 2026).");
    }
  };

  // Manual one-click nudge dispatch trigger
  const handleSendManualReminder = (rent: RentRecord) => {
    const student = students.find(s => s.id === rent.studentId);
    if (!student) return;

    const paymentDetails = loadState('notify_payment_details', 'UPI ID: rentpay@luxehostel | Net Banking: HDFC Bank A/C 501002345678 (IFSC: HDFC0000123)');
    const notifyChannel = loadState('notify_channel', 'both');
    const notifyRecipients = loadState('notify_recipients', 'both');

    const today = new Date('2026-07-05');
    const dueDateObj = new Date(rent.dueDate);
    const isOverdue = dueDateObj.getTime() < today.getTime();
    const type = isOverdue ? 'overdue' : 'upcoming';

    const channels = notifyChannel === 'both' ? ['Email', 'In-App'] : notifyChannel === 'email' ? ['Email'] : ['In-App'];
    const recipients = notifyRecipients === 'both' ? ['Student', 'Parent'] : notifyRecipients === 'students' ? ['Student'] : ['Parent'];

    const msgBody = isOverdue
      ? `Dear ${student.name} / Parent, this is an urgent manual notification that your rent balance of ₹${(rent.totalDue - rent.paidAmount).toLocaleString()} for ${rent.month} is OVERDUE since ${rent.dueDate}. Kindly process clearing immediately via: ${paymentDetails}.`
      : `Dear ${student.name} / Parent, this is a friendly manual reminder that your accommodation rent of ₹${rent.totalDue.toLocaleString()} for ${rent.month} is due on ${rent.dueDate}. Please clear via: ${paymentDetails}.`;

    const newLog: RentNotification = {
      id: `notif_manual_${Date.now()}_${rent.id}`,
      studentId: rent.studentId,
      studentName: student.name,
      parentName: student.parentName,
      rentId: rent.id,
      month: rent.month,
      type,
      amountDue: rent.totalDue - rent.paidAmount,
      channels,
      recipients,
      dateSent: '2026-07-05 18:37',
      status: 'Delivered',
      messageBody: msgBody,
      paymentDetails
    };

    const updatedLogs = [newLog, ...notificationLogs];
    setNotificationLogs(updatedLogs);
    saveState('rent_notifications_log', updatedLogs);

    alert(`Manual Rent Alert dispatched securely!\n- Recipient target: ${recipients.join(' and ')}\n- Channels: ${channels.join(' and ')}\n- Amount: ₹${(rent.totalDue - rent.paidAmount).toLocaleString()}`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-100/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
            <Receipt className="h-6 w-6 text-blue-600" /> Financial Rent Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calculate service charges automatically, invoice student profiles, record UPI/cash clearing, and generate premium downloadable receipts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hostel Scope:</label>
          <select
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-250 dark:border-slate-850 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            {hostels.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`px-6 py-3 text-sm font-black border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'ledger'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-850'
          }`}
        >
          <CreditCard className="h-4 w-4" /> Rent Ledger Records
        </button>
        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`px-6 py-3 text-sm font-black border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'notifications'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-850'
          }`}
        >
          <Bell className="h-4 w-4" /> Reminders & Notification Logs
          {notificationLogs.length > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] rounded-full font-black">
              {notificationLogs.length}
            </span>
          )}
        </button>
      </div>

      {activeSubTab === 'ledger' ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rent history by resident name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>
            {!showInvoiceForm && (
              <button
                onClick={() => setShowInvoiceForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-600/10"
              >
                <Plus className="h-4.5 w-4.5" /> Generate Rent Invoice
              </button>
            )}
          </div>

      {/* Generating Invoice on-the-fly Form */}
      {showInvoiceForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" /> Auto-calculate & Generate Monthly Dues
          </h2>
          <form onSubmit={handleGenerateInvoice} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Select Resident Profile</label>
                <select
                  required
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="">-- Choose student target --</option>
                  {students.filter(s => s.hostelId === selectedHostel).map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.collegeIdNo})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Billing Month</label>
                <input
                  type="month"
                  required
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Due Date deadline</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 border-b border-blue-50 pb-1 mt-4">Breakup charges calculator</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Base Room Rent (₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={baseRent}
                  onChange={(e) => setBaseRent(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Electricity Share (₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={electricityCharges}
                  onChange={(e) => setElectricityCharges(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Mess/Food fees (₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={messCharges}
                  onChange={(e) => setMessCharges(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Water charges (₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={waterCharges}
                  onChange={(e) => setWaterCharges(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Wi-Fi Internet (₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={internetCharges}
                  onChange={(e) => setInternetCharges(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Late Fine penalty (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={lateFees}
                  onChange={(e) => setLateFees(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Deductible Discount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 flex flex-col justify-center items-center">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Calculated Total</span>
                <span className="text-lg font-black text-blue-600 mt-1">₹{calculateTotalDue().toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowInvoiceForm(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-semibold rounded-xl"
              >
                Cancel Ledger
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md"
              >
                Launch Invoice Billing
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Financial records table list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Invoice / Receipt</th>
                <th className="p-4">Student Resident</th>
                <th className="p-4">Bill Period</th>
                <th className="p-4">Breakup (Rent + Bills)</th>
                <th className="p-4">Net Total Due</th>
                <th className="p-4">Collection Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
              {filteredRents.map((rent) => {
                const student = students.find(s => s.id === rent.studentId);
                const room = rooms.find(r => r.id === rent.bedId.split('_').slice(1, 4).join('_'));

                return (
                  <tr key={rent.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <span className="block font-mono font-bold text-slate-800 text-xs">{rent.receiptNo}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">SaaS Ref: {rent.id.substring(0, 8)}</span>
                    </td>
                    <td className="p-4">
                      <span className="block font-bold text-slate-900 text-sm">{student?.name || 'Unknown Student'}</span>
                      <span className="text-[10px] text-slate-500">College ID: {student?.collegeIdNo}</span>
                    </td>
                    <td className="p-4">
                      <span className="block text-slate-800">{rent.month}</span>
                      <span className="text-[10px] text-rose-500 font-bold">Due: {rent.dueDate}</span>
                    </td>
                    <td className="p-4 text-slate-500 max-w-xs truncate">
                      ₹{rent.baseRent} Room + ₹{rent.electricityCharges} Elec + ₹{rent.messCharges} Mess + ₹{rent.internetCharges} Net
                    </td>
                    <td className="p-4 font-black text-slate-900 text-sm">
                      ₹{rent.totalDue.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border ${
                        rent.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : rent.status === 'partial'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        ● {rent.status}
                      </span>
                      {rent.paidDate && (
                        <span className="block text-[9px] text-slate-400 font-mono mt-1">Cleared: {rent.paidDate} ({rent.paymentMethod})</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        {rent.status !== 'paid' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleRecordPayment(rent.id, 'UPI')}
                              className="px-2 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-[10px] font-bold"
                              title="UPI Record"
                            >
                              Pay UPI
                            </button>
                            <button
                              onClick={() => handleRecordPayment(rent.id, 'Cash')}
                              className="px-2 py-1 bg-slate-800 text-white hover:bg-slate-900 rounded-lg text-[10px] font-bold"
                              title="Cash Record"
                            >
                              Pay Cash
                            </button>
                            <button
                              onClick={() => handleSendManualReminder(rent)}
                              className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 rounded-lg text-[10px] font-bold flex items-center gap-1"
                              title="Send Reminder Alert"
                            >
                              <Send className="h-3 w-3" /> Remind
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => setActiveReceipt(rent)}
                          className="p-1.5 bg-white text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl shadow-inner"
                          title="Generate Receipt Document"
                        >
                          <Receipt className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRents.length === 0 && (
          <div className="py-16 text-center text-slate-400">
            <Receipt className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching rent logs</h3>
            <p className="text-xs text-slate-400 mt-1">Generate invoices for student profiles to view lists.</p>
          </div>
        )}
      </div>
        </>
      ) : (
        /* Notifications Tab View */
        <div className="space-y-6">
          {/* Top Quick Status Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Reminders</span>
                <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">{displayedNotificationLogs.length}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Upcoming Reminders</span>
                <span className="text-2xl font-black text-blue-600 mt-1 block">
                  {displayedNotificationLogs.filter(l => l.type === 'upcoming').length}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Overdue Reminders</span>
                <span className="text-2xl font-black text-rose-600 mt-1 block">
                  {displayedNotificationLogs.filter(l => l.type === 'overdue').length}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">System Engine Status</span>
                <span className="text-sm font-black text-emerald-600 mt-2 block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  {loadState('notify_enabled', true) ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <RefreshCw className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Action Header bar */}
          {!isStudent && (
            <div className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl gap-4 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Run Automated Rent Billing Scanner</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Evaluates active rents against configured offsets ({loadState('notify_upcoming_days', 5)} days upcoming / overdue) relative to today (July 5, 2026).
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {notificationLogs.length > 0 && (
                  <button
                    onClick={() => {
                      if(confirm("Are you sure you want to clear the notification logs?")) {
                        setNotificationLogs([]);
                        saveState('rent_notifications_log', []);
                      }
                    }}
                    className="px-4 py-2 text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition"
                  >
                    Clear History
                  </button>
                )}
                <button
                  onClick={handleTriggerAutomatedNotifications}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md shadow-blue-500/10 flex items-center gap-2 transition"
                >
                  <RefreshCw className="h-4 w-4" /> Scan & Send Rent Alerts
                </button>
              </div>
            </div>
          )}

          {/* Logs Table / List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-white flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/10">
              <span>Notification Transmission Feed</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">All logs local database validated</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedNotificationLogs.map((log) => (
                <div key={log.id} className="p-5 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition flex flex-col md:flex-row gap-4 justify-between items-start">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                        log.type === 'upcoming'
                          ? 'bg-blue-50 text-blue-800 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                          : 'bg-rose-50 text-rose-800 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
                      }`}>
                        {log.type === 'upcoming' ? ' Upcoming Reminder' : ' Overdue Reminder'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.dateSent}</span>
                      <span className="text-[10px] text-slate-400">| Rent Period: <strong>{log.month}</strong></span>
                    </div>

                    <div className="text-slate-800 dark:text-slate-200 text-sm font-semibold">
                      Alert sent to <strong className="text-slate-950 dark:text-white">{log.studentName}</strong> (Student) & <strong className="text-slate-950 dark:text-white">{log.parentName}</strong> (Parent)
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-900 font-mono">
                      {log.messageBody}
                    </p>

                    <div className="flex gap-4 text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-blue-500" /> Recipients: <strong className="text-slate-600 dark:text-slate-300">{log.recipients.join(', ')}</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5 text-blue-500" /> Channels: <strong className="text-slate-600 dark:text-slate-300">{log.channels.join(' & ')}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0 self-stretch justify-between">
                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                      ₹{log.amountDue.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 text-green-700 dark:text-green-400 text-[9px] font-black uppercase rounded-lg">
                      <Check className="h-3 w-3" /> {log.status}
                    </span>
                  </div>
                </div>
              ))}

              {displayedNotificationLogs.length === 0 && (
                <div className="py-16 text-center text-slate-400">
                  <Bell className="h-12 w-12 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">No reminders generated yet</h4>
                  <p className="text-xs text-slate-400 mt-1">Run the automated bill scanner above to automatically process due rent alerts.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Receipt popup modal */}
      {activeReceipt && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-slate-100 p-6 animate-in fade-in zoom-in duration-200">
            {/* Stamp Logo */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded-lg border border-emerald-200">
                  ✔ PAYMENT RECORDED
                </span>
                <h3 className="font-extrabold text-slate-900 text-base mt-2">LuxeHostel Tax Invoice</h3>
              </div>
              <div className="p-2 bg-slate-100 rounded-xl">
                <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />
              </div>
            </div>

            {/* Receipt Specifications */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Receipt Number</span>
                  <span className="text-slate-800 font-bold block font-mono">{activeReceipt.receiptNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Ref ID</span>
                  <span className="text-slate-800 font-bold block font-mono">{activeReceipt.id.substring(0, 12)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider mb-2">Billed To Profile</span>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{students.find(s => s.id === activeReceipt.studentId)?.name}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{students.find(s => s.id === activeReceipt.studentId)?.collegeIdNo}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider mb-2">Itemized Breakdown</span>
                <div className="flex justify-between text-slate-600">
                  <span>Standard Room Accommodation Base:</span>
                  <span className="font-bold">₹{activeReceipt.baseRent}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Allocated Electricity Share (AC/Fan):</span>
                  <span className="font-bold">₹{activeReceipt.electricityCharges}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Scheduled Mess / Caterer fees:</span>
                  <span className="font-bold">₹{activeReceipt.messCharges}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Wi-Fi Fiber Speed Allocation:</span>
                  <span className="font-bold">₹{activeReceipt.internetCharges}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Water & Utility Maintenance:</span>
                  <span className="font-bold">₹{activeReceipt.waterCharges}</span>
                </div>
                {activeReceipt.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Tenant Promotional Discount:</span>
                    <span>-₹{activeReceipt.discount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between border-t border-slate-100 pt-3 text-sm font-black text-slate-900">
                <span>Total Amount Paid Securely</span>
                <span className="text-emerald-600">₹{activeReceipt.totalDue.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 mt-6">
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold"
              >
                Close Receipt
              </button>
              <button
                onClick={() => { alert('Downloading receipt PDF onto device...'); setActiveReceipt(null); }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
