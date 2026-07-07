import React, { useState } from 'react';
import { Hostel } from '../types';
import { Building, Plus, Trash2, Edit3, MapPin, Layers, ShieldCheck, CheckCircle } from 'lucide-react';

interface HostelTabProps {
  hostels: Hostel[];
  setHostels: (hostels: Hostel[]) => void;
  currentUser: { ownerId: string };
}

export default function HostelTab({ hostels, setHostels, currentUser }: HostelTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editHostelId, setEditHostelId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [buildingsInput, setBuildingsInput] = useState('');
  const [floors, setFloors] = useState<number>(3);
  const [roomTypesInput, setRoomTypesInput] = useState('Single AC, Double AC, Quad Non-AC');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [imageUrl, setImageUrl] = useState('');

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const buildingsArray = buildingsInput.split(',').map(b => b.trim()).filter(b => b.length > 0);
    const roomTypesArray = roomTypesInput.split(',').map(t => t.trim()).filter(t => t.length > 0);

    if (editHostelId) {
      // Edit mode
      const updatedList = hostels.map(h => {
        if (h.id === editHostelId) {
          return {
            ...h,
            name,
            address,
            buildings: buildingsArray,
            floors,
            roomTypes: roomTypesArray,
            status,
            imageUrl: imageUrl || h.imageUrl,
          };
        }
        return h;
      });
      setHostels(updatedList);
      setEditHostelId(null);
    } else {
      // Create mode
      const newHostel: Hostel = {
        id: `hostel_${Date.now()}`,
        ownerId: currentUser.ownerId,
        name,
        address,
        buildings: buildingsArray,
        floors,
        roomTypes: roomTypesArray,
        status,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600',
      };
      setHostels([...hostels, newHostel]);
    }

    // Reset Form
    setName('');
    setAddress('');
    setBuildingsInput('');
    setFloors(3);
    setRoomTypesInput('Single AC, Double AC, Quad Non-AC');
    setStatus('active');
    setImageUrl('');
    setShowAddForm(false);
  };

  const startEdit = (h: Hostel) => {
    setEditHostelId(h.id);
    setName(h.name);
    setAddress(h.address);
    setBuildingsInput(h.buildings.join(', '));
    setFloors(h.floors);
    setRoomTypesInput(h.roomTypes.join(', '));
    setStatus(h.status);
    setImageUrl(h.imageUrl || '');
    setShowAddForm(true);
  };

  const deleteHostel = (id: string) => {
    if (confirm('Are you absolutely sure you want to delete this hostel branch? All associated rooms and bed records will be Cascade deleted in the Supabase instance.')) {
      setHostels(hostels.filter(h => h.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hostel Property Matrix</h1>
          <p className="text-sm text-slate-500 mt-1">
            Build, edit, and expand hostel property scopes. Fully tenant isolated in database triggers.
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => {
              setEditHostelId(null);
              setShowAddForm(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-600/10"
          >
            <Plus className="h-4.5 w-4.5" /> Add Hostel Branch
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {editHostelId ? '🔧 Modify Hostel Specifications' : '🏢 Initialize New Hostel Branch'}
          </h2>
          <form onSubmit={handleCreateOrUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Hostel Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grand Pine Girls Premium"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Photo/Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot Number, Sector, landmark, state, pin-code"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Floors</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={floors}
                  onChange={(e) => setFloors(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Buildings / Towers (Comma separated)</label>
                <input
                  type="text"
                  value={buildingsInput}
                  onChange={(e) => setBuildingsInput(e.target.value)}
                  placeholder="Tower A, Tower B"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Room Types Offered (Comma separated)</label>
                <input
                  type="text"
                  value={roomTypesInput}
                  onChange={(e) => setRoomTypesInput(e.target.value)}
                  placeholder="Single AC, Double AC, Quad Non-AC"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Operational Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  🟢 Active & Open for Bookings
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'inactive'}
                    onChange={() => setStatus('inactive')}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                  />
                  🔴 Suspended / Under Renovation
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-semibold rounded-xl"
              >
                Cancel specifications
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
              >
                {editHostelId ? 'Apply updates' : 'Add Property'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hostel Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostels.map((h) => (
          <div key={h.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition duration-200">
            <div>
              <div className="relative h-48 bg-slate-100">
                <img
                  src={h.imageUrl}
                  alt={h.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-4 right-4 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm ${
                  h.status === 'active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {h.status === 'active' ? '🟢 Operational' : '🔴 Suspended'}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">{h.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" /> {h.address}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-50">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Towers</span>
                    <span className="text-xs font-black text-slate-700 mt-1 block truncate">
                      {h.buildings.length > 0 ? h.buildings.join(', ') : 'Single'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storeys</span>
                    <span className="text-xs font-black text-slate-700 mt-1 block">
                      {h.floors} Floors
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Room Types Allowed</span>
                  <div className="flex flex-wrap gap-1.5">
                    {h.roomTypes.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-50/60 text-blue-700 text-[10px] font-bold rounded-md border border-blue-100/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" /> Isolated ID: {h.id.substring(0, 10)}...
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(h)}
                  className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition"
                  title="Modify specs"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteHostel(h.id)}
                  className="p-2 bg-white hover:bg-rose-50 text-rose-600 rounded-xl border border-slate-200 hover:border-rose-200 transition"
                  title="Delete branch"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {hostels.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <Building className="h-12 w-12 text-slate-300 mx-auto mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-800">No Hostels Registered</h3>
            <p className="text-xs text-slate-400 mt-1">Initialize your SaaS property map by clicking "Add Hostel Branch" above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
