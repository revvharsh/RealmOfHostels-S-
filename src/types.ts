export type RoomStatus = 
  | 'Available' 
  | 'Partially Occupied' 
  | 'Fully Occupied' 
  | 'Reserved' 
  | 'Under Maintenance';

export interface StudentDetail {
  id: string;
  name: string;
  room: string;
  bed: string;
  college: string;
  department: string;
  year: string;
  rollNo: string;
  phone: string;
  email: string;
  guardian: string;
  guardianPhone: string;
  bloodGroup: string;
  homeCity: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  room: string;
  roomType: string;
  bed: string;
  block: string;
  floor: string;
  college: string;
  department: string;
  program: string;
  year: string;
  bloodGroup: string;
  homeCity: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  enrollmentStatus: string;
}

export interface Room {
  number: string;
  floor: string;
  floorId: number;
  wing: 'North' | 'South' | 'East' | 'West';
  type: 'AC' | 'Non-AC';
  capacity: number;
  occupied: number;
  free: number;
  status: RoomStatus;
  students: string[];
  lastCleaned: string;
}

export type TicketStatus = 'Pending' | 'In-Progress' | 'Awaiting Approval' | 'Resolved';
export type TicketUrgency = 'High' | 'Medium' | 'Normal' | 'Low';

export interface TicketUpdate {
  id: string;
  sender: 'Resident' | 'Admin' | 'Technician' | 'Warden';
  senderName: string;
  message: string;
  timestamp: string;
  isOverdueAlert?: boolean;
}

export interface ResolutionChecklistItem {
  id: string;
  label: string;
  verifiedByResident: boolean;
}

export interface InspectionReport {
  isDone: boolean;
  inspectedAt?: string;
  inspectorName?: string;
  residentRating?: number;
  residentReview?: string;
  submittedForAdminPortal?: boolean;
}

export interface Ticket {
  id: string;
  hostelId?: string;
  email?: string;
  student: string;
  room: string;
  subject: string;
  category: string;
  status: TicketStatus;
  timestamp: string;
  desc: string;
  urgency: TicketUrgency;
  assignedTechnician?: string;
  assignedSlot?: string;
  resolutionNote?: string;
  resolutionDispatchedAt?: string;
  studentApprovedAt?: string;
  studentFeedback?: string;
  // Complaint workflow & tracking
  wardenApproved?: boolean;
  wardenApprovedAt?: string;
  updates?: TicketUpdate[];
  inspection?: InspectionReport;
  resolutionChecklist?: ResolutionChecklistItem[];
  hasMissedSlotAlert?: boolean;
}

export interface DayMeals {
  Breakfast: string;
  Lunch: string;
  'Evening Snack': string;
  Dinner: string;
}

export interface MealDish {
  name: string;
  category: string;
  type: 'Veg' | 'Non-Veg';
}

export interface Roommate {
  id: string;
  name: string;
  bed: string;
  department: string;
  college?: string;
  year: string;
  phone: string;
  email: string;
  bloodGroup: string;
  homeCity: string;
  isSelf?: boolean;
}

export interface FeeRecord {
  id: string;
  receiptNo: string;
  academicYear: string;
  semester: string;
  description: string;
  amountPaid: number;
  paymentDate: string;
  paymentMode: 'UPI' | 'NetBanking' | 'Debit/Credit Card' | 'NEFT';
  transactionId: string;
  status: 'Verified & Paid' | 'Due' | 'Upcoming';
  breakdown: {
    roomRent: number;
    acSupplement: number;
    messDietetics: number;
    securityDeposit: number;
    amenitiesLaundry: number;
  };
}

export interface FeeNoticeItem {
  id: string;
  title: string;
  issuedDate: string;
  dueDate: string;
  amountDue: number;
  academicYear: string;
  urgency: 'Immediate' | 'Upcoming';
  note: string;
  authorizedBy: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  priority: 'High' | 'Medium' | 'Normal' | 'Low';
  target: string;
  body: string;
  author: string;
}

export interface ShuttleRide {
  id?: string;
  route: string;
  departure: string;
  arrival: string;
  busNo: string;
  driver: string;
  status: 'On Time' | 'Standby' | 'Scheduled' | 'Delayed';
}

export interface StudentPayment {
  name: string;
  room: string;
  dues: number;
  status: 'Paid' | 'Overdue' | 'Partial';
  lastPaymentDate?: string;
}

export type LaundryStatus = 'Received' | 'In Wash' | 'Ironing' | 'Ready for Pickup' | 'Delivered';

export interface LaundryClothItem {
  type: string;
  count: number;
}

export interface LaundryOrder {
  id: string;
  receiptNumber: string;
  studentName: string;
  roomNumber: string;
  mobileNumber: string;
  clothCount: number;
  clothBreakdown?: LaundryClothItem[];
  photoUrl?: string;
  photoFileName?: string;
  status: LaundryStatus;
  createdAt: string;
  expectedDelivery: string;
  specialInstructions?: string;
  tokenPin: string;
  weightKg?: number;
}

export interface RoomCleaningTask {
  id: string;
  label: string;
  category: 'Flooring & Surfaces' | 'Sanitation' | 'Linens & Bed' | 'Air & Ventilation';
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: string;
}

export interface RoomCleaningState {
  roomNumber: string;
  date: string;
  tasks: RoomCleaningTask[];
  housekeepingStatus: 'Pending' | 'Housekeeping Requested' | 'Cleaned & Verified';
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  housekeepingNotes?: string;
}

