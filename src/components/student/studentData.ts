import { Roommate, FeeRecord, FeeNoticeItem, MealDish, UserProfile } from '../../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'RES-HARSH-004',
  name: 'Harsh',
  email: 'upadhyayharshpritam@gmail.com',
  phone: '+91 88099 00560',
  room: 'Room B-004',
  roomType: '3-Seater AC',
  bed: 'Bed C (Door Side)',
  block: 'Royal Paradise Block',
  floor: 'Ground Floor (Floor 0)',
  college: 'IILM University, Greater Noida',
  department: '',
  program: 'B.Tech',
  year: '1st Year',
  bloodGroup: 'O+',
  homeCity: 'Bokaro, Jharkhand',
  guardianName: 'XYZ',
  guardianPhone: '+91 94310 12345',
  guardianRelation: 'Father',
  enrollmentStatus: 'Active Resident',
};

export const CURRENT_STUDENT: Roommate = {
  id: 'RES-HARSH-004',
  name: 'Harsh',
  bed: 'Bed C (Door Side)',
  department: '',
  college: 'IILM University',
  year: '1st Year',
  phone: '+91 88099 00560',
  email: 'upadhyayharshpritam@gmail.com',
  bloodGroup: 'O+',
  homeCity: 'Bokaro, Jharkhand',
  isSelf: true,
};

export const ROOMMATES_B004: Roommate[] = [
  {
    id: 'RES-AMAN-001',
    name: 'Aman Sharma',
    bed: 'Bed A (Window Side)',
    department: '',
    college: 'IILM University',
    year: '1st Year',
    phone: '+91 98765 43210',
    email: 'aman.sharma26@iilm.edu',
    bloodGroup: 'B+',
    homeCity: 'Chandigarh, Punjab',
    isSelf: false,
  },
  {
    id: 'RES-ROHAN-002',
    name: 'Rohan Verma',
    bed: 'Bed B (Center Bed)',
    department: '',
    college: 'IILM University',
    year: '1st Year',
    phone: '+91 91234 56789',
    email: 'rohan.verma26@iilm.edu',
    bloodGroup: 'A+',
    homeCity: 'Jaipur, Rajasthan',
    isSelf: false,
  },
  CURRENT_STUDENT,
];

export const ROOM_SPECS_B004 = {
  roomNumber: 'B-004',
  roomType: '3-Seater AC',
  block: 'Royal Paradise Block',
  floor: 'Ground Floor (Floor 0)',
  wing: 'South Wing',
  totalBeds: 3,
  occupiedBeds: 3,
  airConditioning: {
    unit: '1.5 Ton 5-Star Split Inverter AC (Voltas)',
    status: 'Optimal / Running',
    setTemp: '24°C',
    ambientTemp: '23.8°C',
    humidity: '48%',
    powerConsumption: '1.1 kWh',
  },
  inventory: [
    { item: 'Ergonomic Wooden Study Desks', count: 3, condition: 'Excellent' },
    { item: 'High-Back Mesh Desk Chairs', count: 3, condition: 'Verified' },
    { item: 'Full-Height Metallic Wardrobes (Keypad Lock)', count: 3, condition: 'Operational' },
    { item: 'Orthopedic Single Mattresses (Beds A, B, C)', count: 3, condition: 'Pristine' },
    { item: 'Attached Washroom with 25L Instant Geyser', count: 1, condition: 'Operational' },
    { item: 'Dedicated Ceiling Wi-Fi 6 Access Point (1 Gbps)', count: 1, condition: '5 GHz Online' },
  ],
  network: {
    ssid: 'RP-SECURE-5G',
    gatewayIp: '10.24.4.1',
    speed: '1 Gbps Dedicated Optical Fiber',
    ping: '9 ms',
  },
};

// Fee Records by Academic Year
export const INITIAL_FEE_RECORDS: FeeRecord[] = [
  // Year 1 (2026 - 2027)
  {
    id: 'FR-2026-01',
    receiptNo: 'ROH-REC-2026-0412',
    academicYear: '2026 - 2027',
    semester: 'Year 1 · Term 1',
    description: 'Term 1 Hostel Accommodation & 3-Seater AC Supplement',
    amountPaid: 140000,
    paymentDate: '12 Jul 2026',
    paymentMode: 'NetBanking',
    transactionId: 'TXN-HDFC-991204882',
    status: 'Verified & Paid',
    breakdown: {
      roomRent: 80000,
      acSupplement: 25000,
      messDietetics: 20000,
      securityDeposit: 10000,
      amenitiesLaundry: 5000,
    },
  },
  {
    id: 'FR-2026-02',
    receiptNo: 'ROH-REC-2026-0789',
    academicYear: '2026 - 2027',
    semester: 'Year 1 · Term 1',
    description: 'Term 1 Mess Dining Subscription (Full Boarding)',
    amountPaid: 45000,
    paymentDate: '18 Aug 2026',
    paymentMode: 'UPI',
    transactionId: 'UPI-ICICI-8823104921',
    status: 'Verified & Paid',
    breakdown: {
      roomRent: 0,
      acSupplement: 0,
      messDietetics: 40000,
      securityDeposit: 0,
      amenitiesLaundry: 5000,
    },
  },
  // Year 2 (2027 - 2028 - Next Year Stay / Retention)
  {
    id: 'FR-2027-01',
    receiptNo: 'ROH-REC-2027-RES01',
    academicYear: '2027 - 2028',
    semester: 'Year 2 · Advance',
    description: 'Year 2 Room B-004 Retention & Priority Seat Allocation Advance',
    amountPaid: 25000,
    paymentDate: '02 Sep 2026',
    paymentMode: 'UPI',
    transactionId: 'UPI-GPAY-7729910411',
    status: 'Verified & Paid',
    breakdown: {
      roomRent: 20000,
      acSupplement: 5000,
      messDietetics: 0,
      securityDeposit: 0,
      amenitiesLaundry: 0,
    },
  },
];

// Fee Due Notice sent by Admin / Finance Office
export const CURRENT_FEE_NOTICE: FeeNoticeItem = {
  id: 'FEE-NOT-2026-T2',
  title: 'Hostel Accommodation & Mess Term 2 Installment Due Notice',
  issuedDate: '10 Sep 2026',
  dueDate: '15 Oct 2026',
  amountDue: 45000,
  academicYear: '2026 - 2027',
  urgency: 'Upcoming',
  note: 'All residents of Royal Paradise Block must clear the 2nd installment for hostel maintenance, AC utility tariff, and semester dining services on or before the due date.',
  authorizedBy: 'Prof. B.K. Singhal (Accounts Officer, Hostel Finance Cell)',
};

// Mess Menu categorized strictly into VEG and NON-VEG ONLY
export const MESS_MENU_DATA: Record<
  'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner',
  {
    timing: string;
    description: string;
    dishes: MealDish[];
  }
> = {
  Breakfast: {
    timing: '07:30 AM - 09:00 AM',
    description: 'Morning fueling station with live tawa and hot counter',
    dishes: [
      { name: 'Stuffed Aloo & Paneer Paratha with Butter', category: 'Hot Griddle', type: 'Veg' },
      { name: 'Fresh Mint Dahi & Mixed Lemon Pickle', category: 'Accompaniment', type: 'Veg' },
      { name: 'Steamed Indori Poha with Roasted Peanuts & Sev', category: 'Traditional', type: 'Veg' },
      { name: 'Double Egg Masala Omelette with Buttered Toast', category: 'Live Station', type: 'Non-Veg' },
      { name: 'Hard Boiled Farm Eggs (2 Pcs) with Crushed Pepper', category: 'High Protein', type: 'Non-Veg' },
      { name: 'Toasted Multi-Grain Bread with Butter & Mixed Fruit Jam', category: 'Continental', type: 'Veg' },
      { name: 'Fresh Seasonal Banana & Papaya Bowls', category: 'Fruits', type: 'Veg' },
      { name: 'Kadak Masala Chai & South Indian Filter Coffee', category: 'Beverage', type: 'Veg' },
    ],
  },
  Lunch: {
    timing: '12:10 PM - 01:30 PM',
    description: 'Full royal buffet with curries, lentils, rice, breads & dessert',
    dishes: [
      { name: 'Paneer Butter Masala (Rich Cashew Tomato Gravy)', category: 'Main Gravy', type: 'Veg' },
      { name: 'Desi Ghee Dal Tadka (Double Tempered Yellow Lentils)', category: 'Lentils', type: 'Veg' },
      { name: 'Homestyle Murgh Curry (Fresh Chicken Stew - Wed/Sun)', category: 'Poultry', type: 'Non-Veg' },
      { name: 'Dhaba-Style Egg Curry (Spiced Onion Tomato Gravy)', category: 'Egg Station', type: 'Non-Veg' },
      { name: 'Jeera Basmati Long Grain Rice', category: 'Rice', type: 'Veg' },
      { name: 'Tandoori Roti & Butter Phulka', category: 'Breads', type: 'Veg' },
      { name: 'Boondi Mint Raita (Chilled Spiced Yogurt)', category: 'Yogurt', type: 'Veg' },
      { name: 'Fresh Green Salad (Cucumber, Beetroot, Onion, Lemon)', category: 'Salad', type: 'Veg' },
      { name: 'Hot Desi Ghee Gulab Jamun (2 Pcs)', category: 'Dessert', type: 'Veg' },
    ],
  },
  Snacks: {
    timing: '05:00 PM - 06:00 PM',
    description: 'Evening tea-time refreshments and crisp station',
    dishes: [
      { name: 'Crispy Punjabi Samosa with Mint & Tamarind Chutneys', category: 'Frying Station', type: 'Veg' },
      { name: 'Kolkata Style Double Egg Kathi Roll', category: 'Live Roll Counter', type: 'Non-Veg' },
      { name: 'Roasted Salted Makhana & Spiced Peanuts', category: 'Healthy Snack', type: 'Veg' },
      { name: 'Fresh Ginger Cardamom Cutting Chai', category: 'Hot Beverage', type: 'Veg' },
      { name: 'Filter Coffee & Cold Bournvita', category: 'Beverage', type: 'Veg' },
    ],
  },
  Dinner: {
    timing: '08:00 PM - 09:00 PM',
    description: 'Wholesome evening dining with protein selection and dessert',
    dishes: [
      { name: 'Kadai Paneer Mushroom Melange', category: 'Main Gravy', type: 'Veg' },
      { name: 'Dal Makhani (Slow-Cooked Overnight with White Butter)', category: 'Lentils', type: 'Veg' },
      { name: 'Chicken Tikka Masala / Kadhai Chicken (Daily Alternate)', category: 'Poultry', type: 'Non-Veg' },
      { name: 'Spicy Egg Bhurji with Diced Onions & Coriander', category: 'Egg Station', type: 'Non-Veg' },
      { name: 'Steamed Rice & Veg Green Peas Pulao', category: 'Rice', type: 'Veg' },
      { name: 'Fresh Tawa Butter Roti', category: 'Breads', type: 'Veg' },
      { name: 'Sprouted Moong & Corn Salad', category: 'Salad', type: 'Veg' },
      { name: 'Royal Kesar Pista Kulfi / Vanilla Scoop', category: 'Dessert', type: 'Veg' },
    ],
  },
};

export const WEEKLY_MEAL_PLAN = [
  { day: 'Monday', vegSpecial: 'Paneer Makhani & Dal Tadka', nonVegSpecial: 'Egg Curry (Lunch) & Chicken Korma (Dinner)' },
  { day: 'Tuesday', vegSpecial: 'Kadhai Paneer & Chana Masala', nonVegSpecial: 'Egg Bhurji (Dinner)' },
  { day: 'Wednesday', vegSpecial: 'Shahi Paneer & Rajma Masala', nonVegSpecial: 'Butter Chicken (Lunch & Dinner)' },
  { day: 'Thursday', vegSpecial: 'Matar Paneer & Yellow Dal Fry', nonVegSpecial: 'Egg Curry (Lunch)' },
  { day: 'Friday', vegSpecial: 'Palak Paneer & Dal Makhani', nonVegSpecial: 'Chicken Biryani (Dinner Special)' },
  { day: 'Saturday', vegSpecial: 'Malai Kofta & Mix Veg Korma', nonVegSpecial: 'Egg Masala & Chicken Tikka' },
  { day: 'Sunday', vegSpecial: 'Special Paneer Lababdar & Chole Bhature', nonVegSpecial: 'Homestyle Chicken Curry & Mutton Stew' },
];

export const ANNOUNCEMENTS_LIST = [
  {
    id: 'ANN-01',
    title: 'Water Storage Overhead Tank Annual Chlorination & Pressure Testing',
    category: 'Facility Maintenance',
    date: 'Today · 09:00 AM',
    priority: 'Urgent',
    content:
      'Overhead reservoirs for Block B (Royal Paradise) will undergo descaling and UV pump sanitation between 14:00 - 16:30. Low gravity pressure expected on ground floor washrooms.',
    acknowledged: false,
  },
  {
    id: 'ANN-02',
    title: 'Wi-Fi Backbone Router Upgrade: Optical Fiber Switchover in Royal Paradise Block',
    category: 'IT & Infrastructure',
    date: 'Today · 07:30 AM',
    priority: 'Normal',
    content:
      'New dual-band Wi-Fi 6 APs installed in Ground Floor corridor B-001 to B-012. SSID updated to RP-SECURE-5G. Direct 1 Gbps speeds available.',
    acknowledged: false,
  },
  {
    id: 'ANN-03',
    title: 'Hostel Biometric Turnstile Gate Curfew & Night Entry Protocol (10:30 PM)',
    category: 'Security Notice',
    date: 'Yesterday',
    priority: 'Normal',
    content:
      'All residents must register biometric check-in at the Main Gate before 10:30 PM. Overnight outings require verified Warden approval on the portal.',
    acknowledged: true,
  },
];

export interface WardenContact {
  id: string;
  name: string;
  role: string;
  office: string;
  phone: string;
  intercom: string;
  email: string;
  availability: string;
  badge: 'Chief Warden' | 'Deputy Warden' | 'Night Caretaker';
  avatarInitials: string;
}

export const WARDEN_DIRECTORY: WardenContact[] = [
  {
    id: 'WRD-01',
    name: 'Dr. Rajeshwardhan Singh',
    role: 'Chief Hostel Warden & Disciplinary Dean',
    office: 'Admin Wing · Ground Floor · Office AD-02',
    phone: '+91 98112 34567',
    intercom: 'Ext 401',
    email: 'chiefwarden@royalparadise.edu',
    availability: '09:00 AM – 08:00 PM (Direct) · 24/7 Emergency',
    badge: 'Chief Warden',
    avatarInitials: 'RS',
  },
  {
    id: 'WRD-02',
    name: 'Mr. Somnath Chatterjee',
    role: 'Deputy Warden (Boys Hostel & Block B Resident)',
    office: 'Block B Ground Floor · Warden Flat B-101',
    phone: '+91 98765 43210',
    intercom: 'Ext 405',
    email: 'deputywarden.blockb@royalparadise.edu',
    availability: '24/7 In-Campus Resident Warden',
    badge: 'Deputy Warden',
    avatarInitials: 'SC',
  },
  {
    id: 'WRD-03',
    name: 'Mr. Devendra Yadav',
    role: 'Assistant Warden & Night Security Supervisor',
    office: 'Block B Security Command Post & Gate 2',
    phone: '+91 98101 98765',
    intercom: 'Ext 101',
    email: 'nightcaretaker@royalparadise.edu',
    availability: '08:00 PM – 08:00 AM (Night Vigil & Patrol)',
    badge: 'Night Caretaker',
    avatarInitials: 'DY',
  },
];

export interface TransportVehicle {
  id: string;
  serviceName: string;
  vehicleType: string;
  vehicleNo: string;
  driverName: string;
  phone: string;
  route: string;
  timings: string;
  status: 'Active on Route' | 'On Duty' | 'Standby 24/7' | 'Available on Call';
}

export const TRANSPORT_VEHICLES_DIRECTORY: TransportVehicle[] = [
  {
    id: 'TR-01',
    serviceName: 'Campus Metro Feeder Shuttle 1',
    vehicleType: 'Tata Winger 15-Seater AC Shuttle',
    vehicleNo: 'UP 16 AT 4022',
    driverName: 'Mr. Ram Naresh',
    phone: '+91 98188 11223',
    route: 'Royal Paradise Block ↔ Knowledge Park Metro ↔ City Mall',
    timings: 'Every 30 Mins (07:00 AM – 09:30 PM)',
    status: 'Active on Route',
  },
  {
    id: 'TR-02',
    serviceName: 'Academic Quad Express Shuttle 2',
    vehicleType: 'Ashok Leyland 32-Seater Coach',
    vehicleNo: 'UP 16 BT 9918',
    driverName: 'Mr. Balwant Singh',
    phone: '+91 98711 33445',
    route: 'Hostel Terminal ↔ Main Lecture Hall Complex ↔ Sports Arena',
    timings: 'Peak Hours (08:00 AM – 06:30 PM)',
    status: 'On Duty',
  },
  {
    id: 'TR-03',
    serviceName: '24/7 Medical & Emergency Vehicle',
    vehicleType: 'Mahindra Bolero Response Utility',
    vehicleNo: 'UP 16 EV 0108',
    driverName: 'Mr. Sanjay Verma',
    phone: '+91 98990 77661',
    route: 'Hostel Gate 1 ↔ Campus Medical Center ↔ City Hospital / Station',
    timings: '24/7 Dedicated Emergency Standby',
    status: 'Standby 24/7',
  },
  {
    id: 'TR-04',
    serviceName: 'Internal Campus Eco EV Cart',
    vehicleType: '6-Seater Electric Golf Cart',
    vehicleNo: 'UP 16 EV 002',
    driverName: 'Mr. Manoj Kumar',
    phone: '+91 98102 44556',
    route: 'Internal Walkways ↔ Dining Hall Annex ↔ Library Gate',
    timings: '07:30 AM – 10:00 PM (Daily)',
    status: 'Available on Call',
  },
];

