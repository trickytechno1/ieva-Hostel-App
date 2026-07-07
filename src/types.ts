export type UserRole =
  | 'SuperAdmin'
  | 'HostelOwner'
  | 'Manager'
  | 'Warden'
  | 'Receptionist'
  | 'Accountant'
  | 'Student'
  | 'Parent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hostelId?: string; // If restricted to a hostel
  ownerId: string;   // Multi-tenant isolation ID
}

export interface Hostel {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  buildings: string[];
  floors: number;
  roomTypes: string[];
  status: 'active' | 'inactive';
  imageUrl?: string;
}

export interface Room {
  id: string;
  hostelId: string;
  roomNumber: string;
  floor: number;
  capacity: number; // e.g. 1 (Single), 2 (Double), 4 (Quad)
  roomType: 'AC' | 'Non-AC' | 'Deluxe' | 'Suite';
  status: 'available' | 'occupied' | 'maintenance';
}

export interface Bed {
  id: string;
  roomId: string;
  bedNumber: string; // e.g. A, B, C, D
  status: 'available' | 'occupied' | 'maintenance';
  assignedStudentId?: string;
}

export interface Student {
  id: string;
  ownerId: string;
  hostelId: string;
  bedId?: string;
  roomId?: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  documents: { name: string; type: string; url: string }[];
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  emergencyContact: { name: string; relation: string; phone: string };
  collegeName: string;
  collegeIdNo: string;
  idCardUrl?: string;
  policeVerification: 'pending' | 'verified' | 'failed';
  medicalInfo: { bloodGroup: string; allergies: string; chronicConditions: string };
  status: 'active' | 'graduated' | 'suspended';
  admissionDate: string;
}

export interface RentRecord {
  id: string;
  studentId: string;
  bedId: string;
  month: string; // e.g. "2026-07"
  baseRent: number;
  electricityCharges: number;
  messCharges: number;
  waterCharges: number;
  internetCharges: number;
  lateFees: number;
  discount: number;
  totalDue: number;
  paidAmount: number;
  status: 'paid' | 'unpaid' | 'partial';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'Cash' | 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking';
  receiptNo: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  hostelId: string;
  date: string; // YYYY-MM-DD
  time: 'morning' | 'night';
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}

export interface Visitor {
  id: string;
  hostelId: string;
  name: string;
  phone: string;
  purpose: string;
  studentId?: string;
  roomNumber?: string;
  checkIn: string; // ISO DateTime
  checkOut?: string; // ISO DateTime
  photoUrl?: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  hostelId: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: 'regular' | 'emergency';
  status: 'pending' | 'approved' | 'rejected';
  gatePassGenerated: boolean;
  approvedBy?: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  hostelId: string;
  category: 'Electrical' | 'Plumbing' | 'Cleaning' | 'Mess/Food' | 'Wifi/Internet' | 'Security' | 'Miscellaneous';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'resolving' | 'resolved';
  createdAt: string;
  comments: { id: string; author: string; role: string; text: string; time: string }[];
  attachmentUrl?: string;
}

export interface MessMenu {
  id: string;
  hostelId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface MealLog {
  id: string;
  studentId: string;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner';
  taken: boolean;
}

export interface InventoryItem {
  id: string;
  hostelId: string;
  name: string;
  category: 'Furniture' | 'Mattress/Pillow' | 'Kitchen' | 'Electrical' | 'Cleaning Supply' | 'Other';
  totalQty: number;
  allocatedQty: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Damaged';
  lastPurchaseDate: string;
  totalCost: number;
}

export interface Expense {
  id: string;
  hostelId: string;
  category: 'Electricity' | 'Salary' | 'Food' | 'Maintenance' | 'Cleaning' | 'Gas' | 'Internet' | 'Miscellaneous';
  amount: number;
  date: string;
  description: string;
  paidTo?: string;
}

export interface RentNotification {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  rentId: string;
  month: string;
  type: 'upcoming' | 'overdue';
  amountDue: number;
  channels: string[]; // ['Email', 'In-App']
  recipients: string[]; // ['Student', 'Parent']
  dateSent: string; // YYYY-MM-DD HH:mm
  status: 'Delivered' | 'Pending' | 'Failed';
  messageBody: string;
  paymentDetails: string;
}
