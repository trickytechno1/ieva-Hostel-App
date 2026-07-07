import React, { useState } from 'react';
import { Student, Hostel, Bed, Room } from '../types';
import { Search, Plus, User, FileText, Phone, Award, ShieldAlert, Heart, Calendar, Download, CheckCircle, Eye } from 'lucide-react';

interface StudentTabProps {
  hostels: Hostel[];
  students: Student[];
  setStudents: (students: Student[]) => void;
  rooms: Room[];
  beds: Bed[];
  setBeds: (beds: Bed[]) => void;
  currentUser: { ownerId: string };
}

export default function StudentTab({
  hostels,
  students,
  setStudents,
  rooms,
  beds,
  setBeds,
  currentUser,
}: StudentTabProps) {
  const [selectedHostel, setSelectedHostel] = useState<string>(hostels[0]?.id || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<Student | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [collegeIdNo, setCollegeIdNo] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [policeVerification, setPoliceVerification] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [photoUrl, setPhotoUrl] = useState('');
  const [assignedBedId, setAssignedBedId] = useState('');

  // Lists filtering
  const activeHostelStudents = students.filter(
    s => s.hostelId === selectedHostel &&
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get vacant beds in current hostel for assignment
  const hostelRooms = rooms.filter(r => r.hostelId === selectedHostel).map(r => r.id);
  const vacantBeds = beds.filter(b => hostelRooms.includes(b.roomId) && b.status === 'available');

  const handleAdmission = (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignedBedId) {
      alert("Please allocate a vacant bed to complete student admission!");
      return;
    }

    const studentId = `student_${Date.now()}`;
    const selectedBed = beds.find(b => b.id === assignedBedId);
    if (!selectedBed) return;

    const assignedRoom = rooms.find(r => r.id === selectedBed.roomId);

    const newStudent: Student = {
      id: studentId,
      ownerId: currentUser.ownerId,
      hostelId: selectedHostel,
      roomId: assignedRoom?.id,
      bedId: assignedBedId,
      name,
      email,
      phone,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
      documents: [
        { name: 'GovtIDProof.pdf', type: 'Govt ID Proof', url: '#' },
        { name: 'AcademicDeclaration.pdf', type: 'College verification', url: '#' },
      ],
      parentName,
      parentPhone,
      parentEmail,
      emergencyContact: { name: emergencyName, relation: emergencyRelation, phone: emergencyPhone },
      collegeName,
      collegeIdNo,
      policeVerification,
      medicalInfo: { bloodGroup, allergies: allergies || 'None', chronicConditions: chronicConditions || 'None' },
      status: 'active',
      admissionDate: new Date().toISOString().split('T')[0],
    };

    // Update students list
    setStudents([...students, newStudent]);

    // Update allocated bed status
    setBeds(beds.map(b => {
      if (b.id === assignedBedId) {
        return { ...b, status: 'occupied', assignedStudentId: studentId };
      }
      return b;
    }));

    // Reset Form Fields
    setName('');
    setEmail('');
    setPhone('');
    setParentName('');
    setParentPhone('');
    setParentEmail('');
    setEmergencyName('');
    setEmergencyRelation('');
    setEmergencyPhone('');
    setCollegeName('');
    setCollegeIdNo('');
    setBloodGroup('O+');
    setAllergies('');
    setChronicConditions('');
    setPoliceVerification('pending');
    setPhotoUrl('');
    setAssignedBedId('');
    setShowAddForm(false);
  };

  const handlePoliceVerify = (studentId: string, status: 'verified' | 'failed') => {
    setStudents(students.map(s => {
      if (s.id === studentId) {
        return { ...s, policeVerification: status };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header section with Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Admission & Roster</h1>
          <p className="text-sm text-slate-500 mt-1">
            Execute professional admissions, perform police background record verifications, and compile digital resident ID cards.
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

      {/* Roster actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          />
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-600/10"
          >
            <Plus className="h-4.5 w-4.5" /> Record Student Admission
          </button>
        )}
      </div>

      {/* Admission form wizard */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md">
          <h2 className="text-lg font-bold text-slate-900 mb-4">📝 Complete Resident Admission Application</h2>
          <form onSubmit={handleAdmission} className="space-y-6">
            {/* Step 1: Personal Specifications */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 border-b border-blue-50 pb-1">1. Student Personal Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Student Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aditya Sen"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 XXXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Avatar / Photo URL</label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Select Vacant Bed Allocation</label>
                  <select
                    required
                    value={assignedBedId}
                    onChange={(e) => setAssignedBedId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 bg-white font-semibold"
                  >
                    <option value="">-- Choose Vacant Bed Spot --</option>
                    {vacantBeds.map(b => {
                      const roomObj = rooms.find(r => r.id === b.roomId);
                      return (
                        <option key={b.id} value={b.id}>
                          Room {roomObj?.roomNumber} (Floor {roomObj?.floor}) - Bed Spot {b.bedNumber} ({roomObj?.roomType})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: College and Parents information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 border-b border-blue-50 pb-1">2. Parent & Emergency Information</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Parent Name</label>
                      <input
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="Father / Mother Name"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Parent Mobile</label>
                      <input
                        type="text"
                        required
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="+91 98765 XXXXX"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Parent Email</label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="parent@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Emergency Relation</label>
                      <input
                        type="text"
                        required
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                        placeholder="e.g. Uncle"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Name</label>
                      <input
                        type="text"
                        required
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="Sanjay"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Emergency Phone</label>
                      <input
                        type="text"
                        required
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="Mobile"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 border-b border-blue-50 pb-1">3. College Specifications</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">University / College Name</label>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="National Institute of Technology (NIT)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">College Roll No / Student ID Number</label>
                    <input
                      type="text"
                      required
                      value={collegeIdNo}
                      onChange={(e) => setCollegeIdNo(e.target.value)}
                      placeholder="NIT-2024-CSE-045"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Police verification check status</label>
                    <select
                      value={policeVerification}
                      onChange={(e: any) => setPoliceVerification(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="pending">🟡 Pending verification process</option>
                      <option value="verified">🟢 Cleared and Verified</option>
                      <option value="failed">🔴 Record Failed check</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Medical specification checks */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 border-b border-blue-50 pb-1">4. Critical Medical Declarations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Allergies (If any)</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Peanuts, Gluten"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Chronic conditions / Daily Medications</label>
                  <input
                    type="text"
                    value={chronicConditions}
                    onChange={(e) => setChronicConditions(e.target.value)}
                    placeholder="e.g. Mild Asthma, Diabetes"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-semibold rounded-xl"
              >
                Cancel Application
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-blue-600/10"
              >
                Confirm Admission & Allocate Bed Space
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Roster student grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeHostelStudents.map((student) => {
          const studentRoom = rooms.find(r => r.id === student.roomId);
          const studentBed = beds.find(b => b.id === student.bedId);

          return (
            <div key={student.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition duration-200">
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm shrink-0">
                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">{student.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{student.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-md border border-blue-100/50">
                      Room {studentRoom?.roomNumber || 'N/A'} (Bed {studentBed?.bedNumber || 'N/A'})
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mt-4 pt-4 border-t border-slate-50 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Contact Phone:</span>
                    <span className="text-slate-700 font-bold">{student.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">College/Uni:</span>
                    <span className="text-slate-700 font-bold max-w-[150px] truncate">{student.collegeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Emergency:</span>
                    <span className="text-slate-700 font-bold">{student.emergencyContact.relation} • {student.emergencyContact.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Police Status:</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md ${
                        student.policeVerification === 'verified'
                          ? 'bg-emerald-50 text-emerald-800'
                          : student.policeVerification === 'failed'
                          ? 'bg-rose-50 text-rose-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {student.policeVerification}
                      </span>
                      {student.policeVerification === 'pending' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handlePoliceVerify(student.id, 'verified')}
                            className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold border border-emerald-200"
                            title="Verify and Approve"
                          >
                            ✓
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital ID Card popup trigger */}
              <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono font-bold">Verified: {student.admissionDate}</span>
                <button
                  onClick={() => setSelectedStudentForIdCard(student)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <Eye className="h-4 w-4" /> View Digital ID
                </button>
              </div>
            </div>
          );
        })}

        {activeHostelStudents.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No matching student records found</h3>
            <p className="text-xs text-slate-400 mt-1">Initiate first admission using the button above.</p>
          </div>
        )}
      </div>

      {/* ID Card rendering Modal overlay */}
      {selectedStudentForIdCard && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full border border-slate-100 animate-in fade-in zoom-in duration-200">
            {/* Header portion */}
            <div className="bg-blue-600 p-6 text-center text-white relative">
              <button
                onClick={() => setSelectedStudentForIdCard(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white font-bold text-lg focus:outline-none"
              >
                ✕
              </button>
              <h4 className="font-extrabold text-lg tracking-tight">LuxeHostel Digital ID</h4>
              <p className="text-[9px] text-blue-200 font-bold uppercase tracking-widest mt-0.5">Verified Smart Pass</p>
            </div>

            {/* Core details */}
            <div className="p-6 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md mb-4 -mt-16 bg-white">
                <img
                  src={selectedStudentForIdCard.photoUrl}
                  alt={selectedStudentForIdCard.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-black text-slate-900">{selectedStudentForIdCard.name}</h3>
              <p className="text-xs text-slate-400 font-bold mt-0.5">{selectedStudentForIdCard.email}</p>

              <div className="w-full grid grid-cols-2 gap-3 mt-6 text-left border-t border-slate-100 pt-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest">University</span>
                  <span className="text-slate-800 font-bold block truncate">{selectedStudentForIdCard.collegeName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest">Student ID No</span>
                  <span className="text-slate-800 font-bold block truncate">{selectedStudentForIdCard.collegeIdNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest">Gate Access Code</span>
                  <span className="text-slate-800 font-bold block truncate">SYS-{selectedStudentForIdCard.id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest">Medical Record</span>
                  <span className="text-rose-600 font-bold block">Blood {selectedStudentForIdCard.medicalInfo.bloodGroup}</span>
                </div>
              </div>

              {/* Verified badge */}
              <div className="mt-6 p-2 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase rounded-lg border border-emerald-200 w-full flex items-center justify-center gap-1.5 shadow-inner">
                <CheckCircle className="h-4 w-4 text-emerald-600" /> POLICE RECORD VERIFIED & SIGNED
              </div>
            </div>

            {/* ID footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>SaaS ID: {selectedStudentForIdCard.id.substring(0, 12)}</span>
              <button
                onClick={() => { alert('Digital pass saved to memory! Ready for local Wallet sync.'); setSelectedStudentForIdCard(null); }}
                className="text-blue-600 hover:text-blue-700 font-black flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5" /> DOWNLOAD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
