import React, { useState } from 'react';
import { Room, Bed, Hostel, Student } from '../types';
import { BedDouble, Plus, ToggleLeft, ToggleRight, Settings, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

interface RoomTabProps {
  hostels: Hostel[];
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  beds: Bed[];
  setBeds: (beds: Bed[]) => void;
  students: Student[];
}

export default function RoomTab({ hostels, rooms, setRooms, beds, setBeds, students }: RoomTabProps) {
  const [selectedHostel, setSelectedHostel] = useState<string>(hostels[0]?.id || '');
  const [showAddRoom, setShowAddRoom] = useState(false);

  // Form states
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor] = useState<number>(1);
  const [capacity, setCapacity] = useState<number>(2); // Single, Double, Quad, etc.
  const [roomType, setRoomType] = useState<'AC' | 'Non-AC' | 'Deluxe' | 'Suite'>('AC');
  const [status, setStatus] = useState<'available' | 'occupied' | 'maintenance'>('available');

  // Beds mapping
  const activeRooms = rooms.filter(r => r.hostelId === selectedHostel);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();

    if (rooms.some(r => r.hostelId === selectedHostel && r.roomNumber === roomNumber)) {
      alert(`Room number ${roomNumber} already exists in this hostel!`);
      return;
    }

    const newRoomId = `room_${selectedHostel}_${roomNumber}`;
    const newRoom: Room = {
      id: newRoomId,
      hostelId: selectedHostel,
      roomNumber,
      floor,
      capacity,
      roomType,
      status,
    };

    // Auto-create beds for the room depending on capacity
    const newBeds: Bed[] = Array.from({ length: capacity }).map((_, idx) => {
      const letter = String.fromCharCode(65 + idx); // A, B, C, D...
      return {
        id: `bed_${newRoomId}_${letter}`,
        roomId: newRoomId,
        bedNumber: letter,
        status: status === 'maintenance' ? 'maintenance' : 'available',
      };
    });

    setRooms([...rooms, newRoom]);
    setBeds([...beds, ...newBeds]);

    // Reset Form
    setRoomNumber('');
    setFloor(1);
    setCapacity(2);
    setRoomType('AC');
    setStatus('available');
    setShowAddRoom(false);
  };

  const toggleRoomMaintenance = (roomId: string) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;

    const nextStatus = targetRoom.status === 'maintenance' ? 'available' : 'maintenance';

    setRooms(rooms.map(r => {
      if (r.id === roomId) {
        return { ...r, status: nextStatus };
      }
      return r;
    }));

    // Update beds status correspondingly
    setBeds(beds.map(b => {
      if (b.roomId === roomId) {
        if (nextStatus === 'maintenance') {
          return { ...b, status: 'maintenance' };
        } else {
          // If available, keep occupied status or revert to available
          return { ...b, status: b.assignedStudentId ? 'occupied' : 'available' };
        }
      }
      return b;
    }));
  };

  const getBedsForRoom = (roomId: string) => {
    return beds.filter(b => b.roomId === roomId);
  };

  const handleTransferBed = (bedId: string) => {
    const targetBed = beds.find(b => b.id === bedId);
    if (!targetBed || !targetBed.assignedStudentId) {
      alert("Only occupied beds can be transferred!");
      return;
    }

    // List other available beds in the SAME hostel
    const targetRoom = rooms.find(r => r.id === targetBed.roomId);
    if (!targetRoom) return;

    const sameHostelRooms = rooms.filter(r => r.hostelId === targetRoom.hostelId).map(r => r.id);
    const availableBeds = beds.filter(b => sameHostelRooms.includes(b.roomId) && b.status === 'available');

    if (availableBeds.length === 0) {
      alert("No vacant beds available in this hostel to execute a transfer!");
      return;
    }

    const confirmTransfer = confirm(`Transfer student to another available bed?`);
    if (confirmTransfer) {
      // Pick first available bed and switch
      const destinationBed = availableBeds[0];
      const studentId = targetBed.assignedStudentId;

      setBeds(beds.map(b => {
        if (b.id === bedId) {
          // Vacation
          return { ...b, status: 'available', assignedStudentId: undefined };
        }
        if (b.id === destinationBed.id) {
          // Allocation
          return { ...b, status: 'occupied', assignedStudentId: studentId };
        }
        return b;
      }));

      alert(`Successfully transferred Student from Bed ${targetBed.bedNumber} to Bed ${destinationBed.bedNumber} (Room ${rooms.find(r => r.id === destinationBed.roomId)?.roomNumber})`);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Room & Bed Allocation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure room inventory, assign beds to incoming students, and handle property maintenance locks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Property Focus:</label>
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

      {/* Button to show Create Room form */}
      {!showAddRoom && (
        <button
          onClick={() => setShowAddRoom(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-600/10"
        >
          <Plus className="h-4.5 w-4.5" /> Initialize New Room
        </button>
      )}

      {showAddRoom && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md">
          <h2 className="text-lg font-bold text-slate-900 mb-4">🚪 Register New Room Instance</h2>
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. 104-A, 302"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Floor No.</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={floor}
                  onChange={(e) => setFloor(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Capacity (Beds quantity)</label>
                <select
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value={1}>1 (Single Room)</option>
                  <option value={2}>2 (Double Sharing)</option>
                  <option value={3}>3 (Triple Sharing)</option>
                  <option value={4}>4 (Quad Bed Shared)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">AC Specification Type</label>
                <select
                  value={roomType}
                  onChange={(e: any) => setRoomType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="AC">Premium Air-Conditioned (AC)</option>
                  <option value="Non-AC">Standard Ventilated (Non-AC)</option>
                  <option value="Deluxe">Executive Deluxe King (AC)</option>
                  <option value="Suite">Presidential Student Suite</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Initial Status</label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="available">Vacant & Clean</option>
                  <option value="maintenance">Under Routine Repair Maintenance</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddRoom(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-semibold rounded-xl"
              >
                Cancel registration
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Create Room Instance & Beds
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms and Beds Allocation Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeRooms.map((room) => {
          const roomBeds = getBedsForRoom(room.id);
          const occupiedCount = roomBeds.filter(b => b.status === 'occupied').length;

          return (
            <div key={room.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition duration-200">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Floor {room.floor}</span>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">Room {room.roomNumber}</h3>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-black uppercase rounded-lg border border-slate-200/60">
                      ⚡ {room.roomType} Type
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1">
                      {occupiedCount} / {room.capacity} occupied
                    </span>
                  </div>
                </div>

                {/* Beds allocation checklist */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Beds Matrix</h4>
                  {roomBeds.map((bed) => {
                    const student = students.find(s => s.id === bed.assignedStudentId);

                    return (
                      <div key={bed.id} className="p-3 rounded-xl border border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg font-black text-xs ${
                            bed.status === 'occupied'
                              ? 'bg-blue-100 text-blue-700'
                              : bed.status === 'maintenance'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            Bed {bed.bedNumber}
                          </div>
                          <div>
                            {bed.status === 'occupied' && student ? (
                              <div>
                                <p className="text-xs font-bold text-slate-800">{student.name}</p>
                                <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{student.collegeName}</p>
                              </div>
                            ) : bed.status === 'maintenance' ? (
                              <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Blocked for repair
                              </p>
                            ) : (
                              <p className="text-xs font-semibold text-emerald-600">✨ Available / Vacant</p>
                            )}
                          </div>
                        </div>

                        {bed.status === 'occupied' && (
                          <button
                            onClick={() => handleTransferBed(bed.id)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider border border-slate-200 rounded-lg shadow-sm transition"
                          >
                            🔄 Transfer
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Toggle maintenance locks */}
              <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Maintenance Control Lock</span>
                <button
                  onClick={() => toggleRoomMaintenance(room.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 focus:outline-none"
                >
                  {room.status === 'maintenance' ? (
                    <span className="flex items-center gap-1.5 text-rose-600 font-black">
                      <ToggleRight className="h-6 w-6" /> LOCK ACTIVE
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-slate-400 font-bold">
                      <ToggleLeft className="h-6 w-6" /> UNLOCKED
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {activeRooms.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <BedDouble className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No rooms generated inside this hostel branch</h3>
            <p className="text-xs text-slate-400 mt-1">Register first room block using button above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
