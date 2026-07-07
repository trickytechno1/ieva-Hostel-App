import { useState } from 'react';
import { Settings, Save, ShieldAlert, Sparkles, Sliders, ToggleLeft, ToggleRight, CheckCircle2, Bell, Mail, Users, CheckSquare, CreditCard } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { loadState, saveState } from '../data';

export default function SettingsTab() {
  const [currency, setCurrency] = useState(() => loadState('settings_currency', 'INR (₹)'));
  const [taxRate, setTaxRate] = useState(() => loadState('settings_taxRate', 18));
  const [whatsappEnabled, setWhatsappEnabled] = useState(() => loadState('settings_whatsappEnabled', true));
  const [autoDues, setAutoDues] = useState(() => loadState('settings_autoDues', true));
  const [language, setLanguage] = useState(() => loadState('settings_language', 'English (US)'));
  const [savedStatus, setSavedStatus] = useState(false);

  // Notification-specific settings
  const [notifyEnabled, setNotifyEnabled] = useState(() => loadState('notify_enabled', true));
  const [notifyUpcoming, setNotifyUpcoming] = useState(() => loadState('notify_upcoming', true));
  const [notifyUpcomingDays, setNotifyUpcomingDays] = useState(() => loadState('notify_upcoming_days', 5));
  const [notifyOverdue, setNotifyOverdue] = useState(() => loadState('notify_overdue', true));
  const [notifyOverdueFreq, setNotifyOverdueFreq] = useState(() => loadState('notify_overdue_freq', 'Every 3 Days'));
  const [notifyChannel, setNotifyChannel] = useState(() => loadState('notify_channel', 'both')); // 'in_app' | 'email' | 'both'
  const [notifyRecipients, setNotifyRecipients] = useState(() => loadState('notify_recipients', 'both')); // 'students' | 'parents' | 'both'
  const [paymentDetails, setPaymentDetails] = useState(() => loadState('notify_payment_details', 'UPI ID: rentpay@luxehostel | Net Banking: HDFC Bank A/C 501002345678 (IFSC: HDFC0000123)'));

  const handleSave = () => {
    saveState('settings_currency', currency);
    saveState('settings_taxRate', taxRate);
    saveState('settings_whatsappEnabled', whatsappEnabled);
    saveState('settings_autoDues', autoDues);
    saveState('settings_language', language);

    saveState('notify_enabled', notifyEnabled);
    saveState('notify_upcoming', notifyUpcoming);
    saveState('notify_upcoming_days', Number(notifyUpcomingDays));
    saveState('notify_overdue', notifyOverdue);
    saveState('notify_overdue_freq', notifyOverdueFreq);
    saveState('notify_channel', notifyChannel);
    saveState('notify_recipients', notifyRecipients);
    saveState('notify_payment_details', paymentDetails);

    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 font-sans relative">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {savedStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3.5 rounded-2xl shadow-xl border border-slate-800 dark:border-slate-200 flex items-center gap-3"
          >
            <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-500/10" />
            <div className="text-xs">
              <p className="font-extrabold">Settings updated successfully!</p>
              <p className="text-slate-400 dark:text-slate-500 font-medium">Tenant variables cached and bound to database.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-100/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">SaaS Configuration & Rules</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure system settings, branches parameters, currency, active taxes, roles permissions matrix, and WhatsApp alerts gateway.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-600/10"
        >
          <Save className="h-4.5 w-4.5" /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branch parameters and metrics */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-100/50 space-y-4 text-xs">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sliders className="h-5 w-5 text-blue-600" /> Regional & Branch parameters
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Standard Currency Symbol</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-white"
              >
                <option value="INR (₹)">Indian Rupee (INR - ₹)</option>
                <option value="USD ($)">United States Dollar (USD - $)</option>
                <option value="EUR (€)">Euro (EUR - €)</option>
                <option value="GBP (£)">Great British Pound (GBP - £)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Service & Luxury Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => setTaxRate(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Onboarding Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-semibold"
              >
                <option value="English (US)">English (US / Global)</option>
                <option value="Hindi (IN)">Hindi (India)</option>
                <option value="Spanish (ES)">Spanish</option>
                <option value="French (FR)">French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Integration switches */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-100/50 space-y-5 text-xs">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" /> Smart Integrations & Alerts Gateways
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">WhatsApp Alert Gateway (Twilio/Meta ready)</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Transmit check-in/out stamps and rent alerts to parents automatically</p>
              </div>
              <button
                onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                className="focus:outline-none"
              >
                {whatsappEnabled ? (
                  <ToggleRight className="h-8 w-8 text-blue-600 cursor-pointer animate-pulse" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-slate-400 cursor-pointer" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Automatic Rent Calculation Service</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Auto-calculate and post monthly dues on the 1st of every month</p>
              </div>
              <button
                onClick={() => setAutoDues(!autoDues)}
                className="focus:outline-none"
              >
                {autoDues ? (
                  <ToggleRight className="h-8 w-8 text-blue-600 cursor-pointer" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-slate-400 cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/20 text-[10px] font-bold leading-relaxed">
            🔔 All adjustments are updated inside the metadata parameters tree and securely bind to your designated tenant scope.
          </div>
        </div>
      </div>

      {/* Automated Notification Configurator Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-100/50 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-950 dark:text-white">Automated Rent Payments Notification System</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Configure automated emails, WhatsApp, and in-app reminders for rent due dates and overdue bills</p>
            </div>
          </div>
          <button
            onClick={() => setNotifyEnabled(!notifyEnabled)}
            className="focus:outline-none flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            <span>System Status:</span>
            {notifyEnabled ? (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">● Active</span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1">○ Inactive</span>
            )}
            {notifyEnabled ? (
              <ToggleRight className="h-6 w-6 text-blue-600 cursor-pointer" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-slate-400 cursor-pointer" />
            )}
          </button>
        </div>

        {notifyEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Column 1: Upcoming Reminders */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <CheckSquare className="h-4.5 w-4.5 text-blue-600" />
                <h4 className="font-extrabold text-slate-850 dark:text-slate-200 uppercase tracking-wider text-[11px]">Upcoming Due Dates</h4>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Enable Upcoming Reminders</span>
                <button onClick={() => setNotifyUpcoming(!notifyUpcoming)}>
                  {notifyUpcoming ? (
                    <ToggleRight className="h-7 w-7 text-blue-600" />
                  ) : (
                    <ToggleLeft className="h-7 w-7 text-slate-400" />
                  )}
                </button>
              </div>
              {notifyUpcoming && (
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-500 dark:text-slate-400">Days Before Due Date to Remind</label>
                  <select
                    value={notifyUpcomingDays}
                    onChange={(e) => setNotifyUpcomingDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-850 dark:text-white"
                  >
                    <option value="1">1 Day Before</option>
                    <option value="3">3 Days Before</option>
                    <option value="5">5 Days Before</option>
                    <option value="7">7 Days Before</option>
                    <option value="10">10 Days Before</option>
                  </select>
                </div>
              )}
            </div>

            {/* Column 2: Overdue Reminders */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                <h4 className="font-extrabold text-slate-850 dark:text-slate-200 uppercase tracking-wider text-[11px]">Overdue Payment Reminders</h4>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Enable Overdue Reminders</span>
                <button onClick={() => setNotifyOverdue(!notifyOverdue)}>
                  {notifyOverdue ? (
                    <ToggleRight className="h-7 w-7 text-blue-600" />
                  ) : (
                    <ToggleLeft className="h-7 w-7 text-slate-400" />
                  )}
                </button>
              </div>
              {notifyOverdue && (
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-500 dark:text-slate-400">Reminders Frequency</label>
                  <select
                    value={notifyOverdueFreq}
                    onChange={(e) => setNotifyOverdueFreq(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-850 dark:text-white"
                  >
                    <option value="Daily">Daily Recurring</option>
                    <option value="Every 2 Days">Every 2 Days</option>
                    <option value="Every 3 Days">Every 3 Days</option>
                    <option value="Weekly">Weekly Recurring</option>
                  </select>
                </div>
              )}
            </div>

            {/* Column 3: Recipients & Channels */}
            <div className="space-y-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Users className="h-4.5 w-4.5 text-amber-500" />
                <h4 className="font-extrabold text-slate-850 dark:text-slate-200 uppercase tracking-wider text-[11px]">Recipients & Delivery</h4>
              </div>
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-500 dark:text-slate-400">Target Recipients</label>
                <select
                  value={notifyRecipients}
                  onChange={(e) => setNotifyRecipients(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-850 dark:text-white"
                >
                  <option value="students">Students Only</option>
                  <option value="parents">Parents Only</option>
                  <option value="both">Both Students & Parents</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-500 dark:text-slate-400">Delivery Channels</label>
                <select
                  value={notifyChannel}
                  onChange={(e) => setNotifyChannel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-850 dark:text-white"
                >
                  <option value="in_app">In-App Alerts Only</option>
                  <option value="email">Email Alerts Only</option>
                  <option value="both">In-App + Email (Both Channels)</option>
                </select>
              </div>
            </div>

            {/* Full width payment details input */}
            <div className="md:col-span-3 space-y-2 p-4 rounded-xl bg-blue-50/30 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <label className="block font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">Configured Payment Methods (Included in all Outgoing Alerts)</label>
              </div>
              <textarea
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                placeholder="Enter UPI ID, Bank Name, Account Number, IFSC Code, or payment steps..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-white text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400">This payment instruction template will be dynamically embedded within all automated and manual due reminders sent via the LuxeHostel platform.</p>
            </div>
          </div>
        )}
      </div>

      {/* Permissions matrix */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-100/50 text-xs space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
          <ShieldAlert className="h-5 w-5 text-rose-500" /> Active SaaS Role Authorization Matrix
        </h3>
        <p className="text-slate-400 dark:text-slate-500 text-xs">Review feature-level capabilities mapping across platform roles</p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase font-bold">
                <th className="p-3">Core Capability</th>
                <th className="p-3">Super Admin</th>
                <th className="p-3">Hostel Owner</th>
                <th className="p-3">Manager / Warden</th>
                <th className="p-3">Student / Parent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                <td className="p-3 font-bold text-slate-800 dark:text-white">Configure Global Properties</td>
                <td className="p-3 text-emerald-600 font-bold">✓ Full Control</td>
                <td className="p-3 text-emerald-600">✓ Isolated Branch Only</td>
                <td className="p-3 text-rose-500">✕ Blocked</td>
                <td className="p-3 text-rose-500">✕ Blocked</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800">Admissions & Roster Allocations</td>
                <td className="p-3 text-emerald-600">✓ Full Access</td>
                <td className="p-3 text-emerald-600">✓ Full Access</td>
                <td className="p-3 text-emerald-600">✓ Restricted</td>
                <td className="p-3 text-rose-500">✕ Blocked</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-800">Rent Ledger Billing & UPI Log Checks</td>
                <td className="p-3 text-slate-400">View Only</td>
                <td className="p-3 text-emerald-600">✓ Complete Control</td>
                <td className="p-3 text-emerald-600">✓ Restricted</td>
                <td className="p-3 text-blue-600 font-bold">✓ Pay Only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
