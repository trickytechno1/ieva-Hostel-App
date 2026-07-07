import {
  Hostel,
  Room,
  Bed,
  Student,
  RentRecord,
  AttendanceRecord,
  Visitor,
  LeaveRequest,
  Complaint,
  MessMenu,
  InventoryItem,
  Expense,
  User,
} from './types';

// Multi-tenant initial users
export const INITIAL_USERS: User[] = [
  {
    id: 'user_owner_1',
    email: 'aravind@luxehostel.com',
    name: 'Aravind Sharma',
    role: 'HostelOwner',
    ownerId: 'owner_1',
  },
  {
    id: 'user_owner_2',
    email: 'rohan@elitehostel.com',
    name: 'Rohan Deshmukh',
    role: 'HostelOwner',
    ownerId: 'owner_2',
  },
  {
    id: 'user_super_admin',
    email: 'admin@hostelsaas.com',
    name: 'Super Admin Staff',
    role: 'SuperAdmin',
    ownerId: 'super_admin_system',
  },
  {
    id: 'user_manager_1',
    email: 'manager1@luxehostel.com',
    name: 'Karan Malhotra',
    role: 'Manager',
    hostelId: 'hostel_1_1',
    ownerId: 'owner_1',
  },
  {
    id: 'user_student_1',
    email: 'aditya.sen@gmail.com',
    name: 'Aditya Sen',
    role: 'Student',
    hostelId: 'hostel_1_1',
    ownerId: 'owner_1',
  },
];

export const INITIAL_HOSTELS: Hostel[] = [
  {
    id: 'hostel_1_1',
    ownerId: 'owner_1',
    name: 'Grand Pine Premium Hostel',
    address: 'Plot 42, Tech Park Avenue, Sector 62, Noida, UP',
    buildings: ['Tower A (Boys)', 'Tower B (Girls)'],
    floors: 4,
    roomTypes: ['Single AC', 'Double AC', 'Quad Non-AC'],
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'hostel_1_2',
    ownerId: 'owner_1',
    name: 'Oakwood Executive Living',
    address: 'Lane 4, Near University Main Gate, Pune, Maharashtra',
    buildings: ['Main Block'],
    floors: 3,
    roomTypes: ['Deluxe Single', 'Deluxe Double'],
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'hostel_2_1',
    ownerId: 'owner_2',
    name: 'Elite Heights Student Residency',
    address: '22/A, Knowledge Park II, Greater Noida, UP',
    buildings: ['Block Alpha', 'Block Beta'],
    floors: 5,
    roomTypes: ['Double AC', 'Four Bed Shared'],
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
  },
];

export const INITIAL_ROOMS: Room[] = [
  // For Grand Pine (hostel_1_1)
  { id: 'room_1_1_101', hostelId: 'hostel_1_1', roomNumber: '101', floor: 1, capacity: 1, roomType: 'AC', status: 'occupied' },
  { id: 'room_1_1_102', hostelId: 'hostel_1_1', roomNumber: '102', floor: 1, capacity: 2, roomType: 'AC', status: 'available' },
  { id: 'room_1_1_103', hostelId: 'hostel_1_1', roomNumber: '103', floor: 1, capacity: 2, roomType: 'Non-AC', status: 'maintenance' },
  { id: 'room_1_1_201', hostelId: 'hostel_1_1', roomNumber: '201', floor: 2, capacity: 4, roomType: 'Non-AC', status: 'available' },

  // For Oakwood Executive (hostel_1_2)
  { id: 'room_1_2_101', hostelId: 'hostel_1_2', roomNumber: '101', floor: 1, capacity: 1, roomType: 'Deluxe', status: 'occupied' },
  { id: 'room_1_2_102', hostelId: 'hostel_1_2', roomNumber: '102', floor: 1, capacity: 2, roomType: 'Deluxe', status: 'available' },

  // For Elite Heights (hostel_2_1)
  { id: 'room_2_1_101', hostelId: 'hostel_2_1', roomNumber: '101', floor: 1, capacity: 2, roomType: 'AC', status: 'occupied' },
  { id: 'room_2_1_102', hostelId: 'hostel_2_1', roomNumber: '102', floor: 1, capacity: 4, roomType: 'Suite', status: 'available' },
];

export const INITIAL_BEDS: Bed[] = [
  // For room 101 (Grand Pine, single bed)
  { id: 'bed_1_1_101_A', roomId: 'room_1_1_101', bedNumber: 'A', status: 'occupied', assignedStudentId: 'student_1_1' },

  // For room 102 (Grand Pine, double bed)
  { id: 'bed_1_1_102_A', roomId: 'room_1_1_102', bedNumber: 'A', status: 'occupied', assignedStudentId: 'student_1_2' },
  { id: 'bed_1_1_102_B', roomId: 'room_1_1_102', bedNumber: 'B', status: 'available' },

  // For room 103 (Grand Pine, maintenance)
  { id: 'bed_1_1_103_A', roomId: 'room_1_1_103', bedNumber: 'A', status: 'maintenance' },
  { id: 'bed_1_1_103_B', roomId: 'room_1_1_103', bedNumber: 'B', status: 'maintenance' },

  // For room 201 (Grand Pine, quad)
  { id: 'bed_1_1_201_A', roomId: 'room_1_1_201', bedNumber: 'A', status: 'occupied', assignedStudentId: 'student_1_3' },
  { id: 'bed_1_1_201_B', roomId: 'room_1_1_201', bedNumber: 'B', status: 'available' },
  { id: 'bed_1_1_201_C', roomId: 'room_1_1_201', bedNumber: 'C', status: 'available' },
  { id: 'bed_1_1_201_D', roomId: 'room_1_1_201', bedNumber: 'D', status: 'available' },

  // For Oakwood room 101 (Single)
  { id: 'bed_1_2_101_A', roomId: 'room_1_2_101', bedNumber: 'A', status: 'occupied', assignedStudentId: 'student_1_4' },

  // For Elite Heights (owner_2) room 101 (Double)
  { id: 'bed_2_1_101_A', roomId: 'room_2_1_101', bedNumber: 'A', status: 'occupied', assignedStudentId: 'student_2_1' },
  { id: 'bed_2_1_101_B', roomId: 'room_2_1_101', bedNumber: 'B', status: 'available' },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'student_1_1',
    ownerId: 'owner_1',
    hostelId: 'hostel_1_1',
    roomId: 'room_1_1_101',
    bedId: 'bed_1_1_101_A',
    name: 'Aditya Sen',
    email: 'aditya.sen@gmail.com',
    phone: '+91 98765 43210',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    documents: [
      { name: 'AadharCard.pdf', type: 'ID Proof', url: '#' },
      { name: 'CollegeAdmissionLetter.pdf', type: 'College Document', url: '#' },
    ],
    parentName: 'Ramesh Sen',
    parentPhone: '+91 98765 11111',
    parentEmail: 'ramesh.sen@gmail.com',
    emergencyContact: { name: 'Sanjay Sen', relation: 'Uncle', phone: '+91 98765 22222' },
    collegeName: 'National Institute of Technology (NIT)',
    collegeIdNo: 'NIT-2024-CSE-045',
    policeVerification: 'verified',
    medicalInfo: { bloodGroup: 'O+', allergies: 'N/A', chronicConditions: 'Asthma (Mild)' },
    status: 'active',
    admissionDate: '2025-07-15',
  },
  {
    id: 'student_1_2',
    ownerId: 'owner_1',
    hostelId: 'hostel_1_1',
    roomId: 'room_1_1_102',
    bedId: 'bed_1_1_102_A',
    name: 'Ananya Roy',
    email: 'ananya.roy@yahoo.com',
    phone: '+91 87654 32109',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    documents: [{ name: 'Passport_Copy.pdf', type: 'Passport', url: '#' }],
    parentName: 'Bimal Roy',
    parentPhone: '+91 87654 11111',
    parentEmail: 'bimal.roy@gmail.com',
    emergencyContact: { name: 'Kiran Roy', relation: 'Brother', phone: '+91 87654 22222' },
    collegeName: 'Amity University',
    collegeIdNo: 'AU-MBA-2025-890',
    policeVerification: 'verified',
    medicalInfo: { bloodGroup: 'A+', allergies: 'Peanuts', chronicConditions: 'None' },
    status: 'active',
    admissionDate: '2025-08-01',
  },
  {
    id: 'student_1_3',
    ownerId: 'owner_1',
    hostelId: 'hostel_1_1',
    roomId: 'room_1_1_201',
    bedId: 'bed_1_1_201_A',
    name: 'Vikram Malhotra',
    email: 'vikram.m@gmail.com',
    phone: '+91 76543 21098',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    documents: [],
    parentName: 'Sunil Malhotra',
    parentPhone: '+91 76543 11111',
    emergencyContact: { name: 'Sunil Malhotra', relation: 'Father', phone: '+91 76543 11111' },
    collegeName: 'Sharda University',
    collegeIdNo: 'SU-BTECH-23-451',
    policeVerification: 'pending',
    medicalInfo: { bloodGroup: 'B+', allergies: 'None', chronicConditions: 'None' },
    status: 'active',
    admissionDate: '2026-06-10',
  },
  {
    id: 'student_1_4',
    ownerId: 'owner_1',
    hostelId: 'hostel_1_2',
    roomId: 'room_1_2_101',
    bedId: 'bed_1_2_101_A',
    name: 'Rahul Dev',
    email: 'rahul.dev@outlook.com',
    phone: '+91 99999 88888',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    documents: [{ name: 'Driving_License.pdf', type: 'DL Proof', url: '#' }],
    parentName: 'Vijay Dev',
    parentPhone: '+91 99999 77777',
    emergencyContact: { name: 'Vijay Dev', relation: 'Father', phone: '+91 99999 77777' },
    collegeName: 'Symbiosis Pune',
    collegeIdNo: 'SYM-LAW-2024-11',
    policeVerification: 'verified',
    medicalInfo: { bloodGroup: 'AB+', allergies: 'Penicillin', chronicConditions: 'None' },
    status: 'active',
    admissionDate: '2025-09-12',
  },
  {
    id: 'student_2_1',
    ownerId: 'owner_2',
    hostelId: 'hostel_2_1',
    roomId: 'room_2_1_101',
    bedId: 'bed_2_1_101_A',
    name: 'Siddharth Nair',
    email: 'sidnair@gmail.com',
    phone: '+91 88888 77777',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    documents: [],
    parentName: 'Gopal Nair',
    parentPhone: '+91 88888 66666',
    emergencyContact: { name: 'Gopal Nair', relation: 'Father', phone: '+91 88888 66666' },
    collegeName: 'Galgotias University',
    collegeIdNo: 'GAL-BCA-25-101',
    policeVerification: 'verified',
    medicalInfo: { bloodGroup: 'O-', allergies: 'Dust', chronicConditions: 'None' },
    status: 'active',
    admissionDate: '2026-01-20',
  },
];

export const INITIAL_RENT: RentRecord[] = [
  // For Grand Pine students (hostel_1_1)
  {
    id: 'rent_1_1_1',
    studentId: 'student_1_1',
    bedId: 'bed_1_1_101_A',
    month: '2026-07',
    baseRent: 8500,
    electricityCharges: 450,
    messCharges: 3000,
    waterCharges: 100,
    internetCharges: 300,
    lateFees: 0,
    discount: 500,
    totalDue: 11850,
    paidAmount: 11850,
    status: 'paid',
    dueDate: '2026-07-05',
    paidDate: '2026-07-03',
    paymentMethod: 'UPI',
    receiptNo: 'REC-2026-07-001',
  },
  {
    id: 'rent_1_1_2',
    studentId: 'student_1_2',
    bedId: 'bed_1_1_102_A',
    month: '2026-07',
    baseRent: 7500,
    electricityCharges: 380,
    messCharges: 3000,
    waterCharges: 100,
    internetCharges: 300,
    lateFees: 0,
    discount: 0,
    totalDue: 11280,
    paidAmount: 0,
    status: 'unpaid',
    dueDate: '2026-07-10',
    receiptNo: 'REC-2026-07-002',
  },
  {
    id: 'rent_1_1_3',
    studentId: 'student_1_3',
    bedId: 'bed_1_1_201_A',
    month: '2026-07',
    baseRent: 5500,
    electricityCharges: 250,
    messCharges: 3000,
    waterCharges: 100,
    internetCharges: 300,
    lateFees: 0,
    discount: 0,
    totalDue: 9150,
    paidAmount: 5000,
    status: 'partial',
    dueDate: '2026-07-10',
    paidDate: '2026-07-04',
    paymentMethod: 'Cash',
    receiptNo: 'REC-2026-07-003',
  },

  // For Oakwood student (hostel_1_2)
  {
    id: 'rent_1_2_1',
    studentId: 'student_1_4',
    bedId: 'bed_1_2_101_A',
    month: '2026-07',
    baseRent: 12000,
    electricityCharges: 600,
    messCharges: 4000,
    waterCharges: 150,
    internetCharges: 400,
    lateFees: 0,
    discount: 1000,
    totalDue: 16150,
    paidAmount: 16150,
    status: 'paid',
    dueDate: '2026-07-05',
    paidDate: '2026-07-01',
    paymentMethod: 'Credit Card',
    receiptNo: 'REC-2026-07-004',
  },

  // For Elite Heights student (hostel_2_1) - Owner 2
  {
    id: 'rent_2_1_1',
    studentId: 'student_2_1',
    bedId: 'bed_2_1_101_A',
    month: '2026-07',
    baseRent: 9000,
    electricityCharges: 500,
    messCharges: 3200,
    waterCharges: 100,
    internetCharges: 300,
    lateFees: 0,
    discount: 0,
    totalDue: 13100,
    paidAmount: 13100,
    status: 'paid',
    dueDate: '2026-07-05',
    paidDate: '2026-07-02',
    paymentMethod: 'UPI',
    receiptNo: 'REC-2026-07-201',
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att_1', studentId: 'student_1_1', hostelId: 'hostel_1_1', date: '2026-07-05', time: 'morning', status: 'present' },
  { id: 'att_2', studentId: 'student_1_2', hostelId: 'hostel_1_1', date: '2026-07-05', time: 'morning', status: 'present' },
  { id: 'att_3', studentId: 'student_1_3', hostelId: 'hostel_1_1', date: '2026-07-05', time: 'morning', status: 'late', remarks: 'Late entry at 9:15 AM' },
  { id: 'att_4', studentId: 'student_1_1', hostelId: 'hostel_1_1', date: '2026-07-04', time: 'night', status: 'present' },
  { id: 'att_5', studentId: 'student_1_2', hostelId: 'hostel_1_1', date: '2026-07-04', time: 'night', status: 'absent', remarks: 'Approved Leave' },
  { id: 'att_6', studentId: 'student_1_3', hostelId: 'hostel_1_1', date: '2026-07-04', time: 'night', status: 'present' },
];

export const INITIAL_VISITORS: Visitor[] = [
  {
    id: 'vis_1',
    hostelId: 'hostel_1_1',
    name: 'Gaurav Roy',
    phone: '+91 91234 56789',
    purpose: 'Deliver Laptop Charger & Clothes',
    studentId: 'student_1_2',
    roomNumber: '102',
    checkIn: '2026-07-05T14:30:00Z',
    checkOut: '2026-07-05T15:15:00Z',
  },
  {
    id: 'vis_2',
    hostelId: 'hostel_1_1',
    name: 'Shyam Sharan',
    phone: '+91 93456 78901',
    purpose: 'Parent Inquiry / Visit Warden Office',
    checkIn: '2026-07-05T17:45:00Z',
  },
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'leave_1',
    studentId: 'student_1_2',
    hostelId: 'hostel_1_1',
    startDate: '2026-07-12',
    endDate: '2026-07-15',
    reason: 'Attending cousin’s wedding in Jaipur',
    type: 'regular',
    status: 'approved',
    gatePassGenerated: true,
    approvedBy: 'Karan Malhotra (Manager)',
  },
  {
    id: 'leave_2',
    studentId: 'student_1_1',
    hostelId: 'hostel_1_1',
    startDate: '2026-07-20',
    endDate: '2026-07-22',
    reason: 'Medical checkup and dental treatment at home town',
    type: 'emergency',
    status: 'pending',
    gatePassGenerated: false,
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'comp_1',
    studentId: 'student_1_1',
    hostelId: 'hostel_1_1',
    category: 'Electrical',
    title: 'Ceiling Fan making squeaking noise',
    description: 'The ceiling fan in Room 101 rotates very slowly and makes a loud metallic grinding noise when kept at high speeds. Difficult to sleep.',
    priority: 'medium',
    status: 'resolving',
    createdAt: '2026-07-04T09:00:00Z',
    comments: [
      { id: 'c_1', author: 'Aditya Sen', role: 'Student', text: 'Please repair it soon, Noida heat is unbearable!', time: '2026-07-04T09:05:00Z' },
      { id: 'c_2', author: 'Karan Malhotra', role: 'Manager', text: 'Electrician scheduled to visit tomorrow morning.', time: '2026-07-04T16:20:00Z' },
    ],
  },
  {
    id: 'comp_2',
    studentId: 'student_1_2',
    hostelId: 'hostel_1_1',
    category: 'Wifi/Internet',
    title: 'Extremely slow Wi-Fi speed in Tower B',
    description: 'The Wi-Fi speed is less than 1 Mbps since yesterday. It repeatedly disconnects during online college classes and lectures.',
    priority: 'high',
    status: 'pending',
    createdAt: '2026-07-05T11:15:00Z',
    comments: [],
  },
];

export const INITIAL_MESS_MENU: MessMenu[] = [
  { id: 'm_1', hostelId: 'hostel_1_1', day: 'Monday', breakfast: 'Idli Sambar, Fruit Juice, Tea', lunch: 'Rice, Dal Fry, Kadai Paneer, Roti, Salad', dinner: 'Jeera Rice, Mix Veg Sabzi, Tawa Roti, Kheer' },
  { id: 'm_2', hostelId: 'hostel_1_1', day: 'Tuesday', breakfast: 'Aloo Paratha, Curd, Tea/Coffee', lunch: 'Veg Pulav, Rajma, Aloo Gobhi, Butter Roti, Curd', dinner: 'Dal Tadka, Bhindi Do Pyaza, Roti, Sweet Boondi' },
  { id: 'm_3', hostelId: 'hostel_1_1', day: 'Wednesday', breakfast: 'Poha, Sprouts, Milk/Tea', lunch: 'Steam Rice, Egg Curry / Paneer Bhurji, Dal, Salad', dinner: 'Tawa Pulav, Veg Kofta, Naan, Custard Fruit' },
  { id: 'm_4', hostelId: 'hostel_1_1', day: 'Thursday', breakfast: 'Bread Toast, Omelette / Butter, Juice', lunch: 'Rice, Chole Bhature / Rice, Mix Veg, Curd', dinner: 'Kadhi Chawal, Seasonal Dry Sabji, Roti, Ice Cream' },
  { id: 'm_5', hostelId: 'hostel_1_1', day: 'Friday', breakfast: 'Puri Sabji, Halwa, Tea', lunch: 'Rice, Dal Makhani, Shahi Paneer, Garlic Naan', dinner: 'Veg Biryani, Raita, Soya Chunk Curry, Gulab Jamun' },
  { id: 'm_6', hostelId: 'hostel_1_1', day: 'Saturday', breakfast: 'Upma, Coconut Chutney, Tea/Coffee', lunch: 'Khichdi, Papad, Beguni, Pickle, Salad', dinner: 'Aloo Dum, Lucchi (Puri), Chana Dal, Sweet Curd' },
  { id: 'm_7', hostelId: 'hostel_1_1', day: 'Sunday', breakfast: 'Stuffed Gobhi Paratha, Tea', lunch: 'Dum Biryani (Chicken/Paneer), Mirchi Salan, Raita', dinner: 'Plain Rice, Dal, Matar Paneer, Butter Roti, Rasgulla' },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv_1', hostelId: 'hostel_1_1', name: 'Wooden Study Chairs', category: 'Furniture', totalQty: 45, allocatedQty: 40, condition: 'Good', lastPurchaseDate: '2025-06-15', totalCost: 67500 },
  { id: 'inv_2', hostelId: 'hostel_1_1', name: 'Orthopedic Mattresses', category: 'Mattress/Pillow', totalQty: 50, allocatedQty: 42, condition: 'Excellent', lastPurchaseDate: '2025-07-10', totalCost: 150000 },
  { id: 'inv_3', hostelId: 'hostel_1_1', name: 'LED Tube Lights 20W', category: 'Electrical', totalQty: 60, allocatedQty: 48, condition: 'Good', lastPurchaseDate: '2025-11-20', totalCost: 12000 },
  { id: 'inv_4', hostelId: 'hostel_1_1', name: 'Heavy Duty Plastic Buckets', category: 'Cleaning Supply', totalQty: 30, allocatedQty: 25, condition: 'Good', lastPurchaseDate: '2026-02-12', totalCost: 6000 },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp_1', hostelId: 'hostel_1_1', category: 'Electricity', amount: 18500, date: '2026-06-25', description: 'Tower A and Tower B Main Power Bill for June 2026', paidTo: 'State Electricity Board' },
  { id: 'exp_2', hostelId: 'hostel_1_1', category: 'Salary', amount: 35000, date: '2026-07-01', description: 'Monthly Salary for Warden & 2 Cleaning Staff', paidTo: 'Staff Accounts' },
  { id: 'exp_3', hostelId: 'hostel_1_1', category: 'Food', amount: 24500, date: '2026-07-02', description: 'Weekly Groceries, Vegetables, Dairy and gas cylinder refilling', paidTo: 'Vrindavan Grocery Wholesalers' },
  { id: 'exp_4', hostelId: 'hostel_1_1', category: 'Maintenance', amount: 4800, date: '2026-07-04', description: 'Plumbing repairs for ground floor bathrooms of Tower A', paidTo: 'QuickFix Plumbers' },
];

// Helper to load state from localStorage or fallback to defaults
export function loadState<T>(key: string, fallback: T): T {
  const item = localStorage.getItem(`hostel_saas_${key}`);
  if (!item) return fallback;
  try {
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
}

// Helper to save state to localStorage
export function saveState<T>(key: string, data: T): void {
  localStorage.setItem(`hostel_saas_${key}`, JSON.stringify(data));
}

// Complete fully functional SQL setup instructions for Supabase
export const SUPABASE_SQL_SCHEMA = `-- =========================================================
-- LUXEHOSTEL SAAS - FULLY NORMALIZED POSTGRESQL SCHEMA (SUPABASE READY)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS (Linked to Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('SuperAdmin', 'HostelOwner', 'Manager', 'Warden', 'Receptionist', 'Accountant', 'Student', 'Parent')),
  owner_id UUID NOT NULL, -- Logical tenant group identifier
  hostel_id UUID,        -- Optional binding to a specific hostel
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. HOSTELS TABLE
CREATE TABLE public.hostels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL, -- Tenant Owner ID
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  buildings TEXT[] DEFAULT '{}'::TEXT[],
  floors INTEGER NOT NULL CHECK (floors > 0),
  room_types TEXT[] DEFAULT '{}'::TEXT[],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;

-- 3. ROOMS TABLE
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  floor INTEGER NOT NULL CHECK (floor >= 0),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  room_type TEXT NOT NULL CHECK (room_type IN ('AC', 'Non-AC', 'Deluxe', 'Suite')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(hostel_id, room_number)
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- 4. BEDS TABLE
CREATE TABLE public.beds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  bed_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  assigned_student_id UUID, -- Back-reference to students when occupied
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(room_id, bed_number)
);

ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;

-- 5. STUDENTS TABLE
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL, -- Tenant Owner ID
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  bed_id UUID REFERENCES public.beds(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  photo_url TEXT,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT,
  emergency_contact JSONB NOT NULL DEFAULT '{}'::JSONB, -- {name, relation, phone}
  college_name TEXT NOT NULL,
  college_id_no TEXT NOT NULL,
  id_card_url TEXT,
  police_verification TEXT NOT NULL DEFAULT 'pending' CHECK (police_verification IN ('pending', 'verified', 'failed')),
  medical_info JSONB NOT NULL DEFAULT '{}'::JSONB,       -- {bloodGroup, allergies, chronicConditions}
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'suspended')),
  admission_date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Add foreign key constraint to beds for student assignment
ALTER TABLE public.beds ADD CONSTRAINT fk_assigned_student FOREIGN KEY (assigned_student_id) REFERENCES public.students(id) ON DELETE SET NULL;

-- 6. RENT RECORDS TABLE
CREATE TABLE public.rent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  bed_id UUID NOT NULL REFERENCES public.beds(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- YYYY-MM
  base_rent NUMERIC(10, 2) NOT NULL,
  electricity_charges NUMERIC(10, 2) DEFAULT 0,
  mess_charges NUMERIC(10, 2) DEFAULT 0,
  water_charges NUMERIC(10, 2) DEFAULT 0,
  internet_charges NUMERIC(10, 2) DEFAULT 0,
  late_fees NUMERIC(10, 2) DEFAULT 0,
  discount NUMERIC(10, 2) DEFAULT 0,
  total_due NUMERIC(10, 2) GENERATED ALWAYS AS (base_rent + electricity_charges + mess_charges + water_charges + internet_charges + late_fees - discount) STORED,
  paid_amount NUMERIC(10, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid', 'partial')),
  due_date DATE NOT NULL,
  paid_date DATE,
  payment_method TEXT CHECK (payment_method IN ('Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking')),
  receipt_no TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.rent_records ENABLE ROW LEVEL SECURITY;

-- 7. ATTENDANCE RECORDS TABLE
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL CHECK (time IN ('morning', 'night')),
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(student_id, date, time)
);

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- 8. COMPLAINTS TABLE
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('Electrical', 'Plumbing', 'Cleaning', 'Mess/Food', 'Wifi/Internet', 'Security', 'Miscellaneous')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolving', 'resolved')),
  comments JSONB DEFAULT '[]'::JSONB NOT NULL, -- Array of {id, author, role, text, time}
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- 9. EXPENSES TABLE
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('Electricity', 'Salary', 'Food', 'Maintenance', 'Cleaning', 'Gas', 'Internet', 'Miscellaneous')),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  paid_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 10. VISITORS TABLE
CREATE TABLE public.visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  purpose TEXT NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  room_number TEXT,
  check_in TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  check_out TIMESTAMP WITH TIME ZONE,
  photo_url TEXT
);

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;


-- =========================================================
-- INDEXES FOR MAXIMUM HIGH-SCALE PERFORMANCE
-- =========================================================
CREATE INDEX idx_profiles_owner ON public.profiles(owner_id);
CREATE INDEX idx_hostels_owner ON public.hostels(owner_id);
CREATE INDEX idx_rooms_hostel ON public.rooms(hostel_id);
CREATE INDEX idx_beds_room ON public.beds(room_id);
CREATE INDEX idx_students_owner ON public.students(owner_id);
CREATE INDEX idx_students_hostel ON public.students(hostel_id);
CREATE INDEX idx_rent_student ON public.rent_records(student_id);
CREATE INDEX idx_attendance_lookup ON public.attendance_records(hostel_id, date, time);
CREATE INDEX idx_complaints_hostel ON public.complaints(hostel_id);
CREATE INDEX idx_expenses_hostel ON public.expenses(hostel_id);


-- =========================================================
-- TENANT ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- Hostel Owner Policies (Complete Tenant Isolation)
-- All operations are restricted to matching the owner's owner_id.

-- Hostels Security Policy
CREATE POLICY "Hostel Owners can select their own hostels"
  ON public.hostels FOR ALL
  USING (owner_id = (SELECT owner_id FROM public.profiles WHERE id = auth.uid()));

-- Students Security Policy
CREATE POLICY "Hostel Owners can manage their students"
  ON public.students FOR ALL
  USING (owner_id = (SELECT owner_id FROM public.profiles WHERE id = auth.uid()));

-- Rooms Security Policy
CREATE POLICY "Hostel Owners can manage their rooms"
  ON public.rooms FOR ALL
  USING (hostel_id IN (
    SELECT id FROM public.hostels WHERE owner_id = (SELECT owner_id FROM public.profiles WHERE id = auth.uid())
  ));

-- Beds Security Policy
CREATE POLICY "Hostel Owners can manage their beds"
  ON public.beds FOR ALL
  USING (room_id IN (
    SELECT r.id FROM public.rooms r 
    INNER JOIN public.hostels h ON r.hostel_id = h.id 
    WHERE h.owner_id = (SELECT owner_id FROM public.profiles WHERE id = auth.uid())
  ));

-- Rent Security Policy
CREATE POLICY "Hostel Owners can manage their rent bills"
  ON public.rent_records FOR ALL
  USING (student_id IN (
    SELECT id FROM public.students WHERE owner_id = (SELECT owner_id FROM public.profiles WHERE id = auth.uid())
  ));

-- Expense Security Policy
CREATE POLICY "Hostel Owners can manage their expenses"
  ON public.expenses FOR ALL
  USING (hostel_id IN (
    SELECT id FROM public.hostels WHERE owner_id = (SELECT owner_id FROM public.profiles WHERE id = auth.uid())
  ));

-- Attendance Security Policy
CREATE POLICY "Hostel Owners can manage attendance logs"
  ON public.attendance_records FOR ALL
  USING (hostel_id IN (
    SELECT id FROM public.hostels WHERE owner_id = (SELECT owner_id FROM public.profiles WHERE id = auth.uid())
  ));


-- =========================================================
-- CUSTOM TRIGGER FUNCTIONS (E.G. SYNC PROFILE TIMESTAMPS)
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hostels_timestamp BEFORE UPDATE ON public.hostels
  FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

CREATE TRIGGER update_rooms_timestamp BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

CREATE TRIGGER update_students_timestamp BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();
`;
