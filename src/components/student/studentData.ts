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
  homeCity: 'Patna, Bihar',
  guardianName: 'xyz',
  guardianPhone: '+91 94310 12345',
  guardianRelation: 'Brother',
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
  homeCity: 'Patna, Bihar',
  isSelf: true,
};

export const ROOMMATES_B004: Roommate[] = [
  {
    id: 'RES-AMAN-001',
    name: 'Aksh',
    bed: 'Bed A (Window Side)',
    department: '',
    college: 'IILM University',
    year: '2nd Year',
    phone: '+91 98765 43210',
    email: 'aman.sharma26@iilm.edu',
    bloodGroup: 'B+',
    homeCity: 'Chandigarh, Punjab',
    isSelf: false,
  },
  {
    id: 'RES-ROHAN-002',
    name: 'Amar',
    bed: 'Bed B (Center Bed)',
    department: '',
    college: 'IILM University',
    year: '2nd Year',
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

// Menu timings are shared by the live dining clock; every course below comes from the supplied weekly chart.
export const MESS_MENU_DATA: Record<'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner', { timing: string }> = {
  Breakfast: { timing: '07:30 AM - 09:00 AM' },
  Lunch: { timing: '12:10 PM - 01:30 PM' },
  Snacks: { timing: '05:00 PM - 06:00 PM' },
  Dinner: { timing: '08:00 PM - 09:00 PM' },
};

export const WEEKLY_MESS_COURSES: Record<string, Record<'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner', { timing: string; description: string; dishes: MealDish[] }>> = {
  Monday: {
    Breakfast: { ...MESS_MENU_DATA.Breakfast, description: 'Aloo puri breakfast with sabji and tea', dishes: [{ name: 'Aloo Puri', category: 'Main Course', type: 'Veg' }, { name: 'Sabji', category: 'Accompaniment', type: 'Veg' }, { name: 'Tea', category: 'Beverage', type: 'Veg' }] },
    Lunch: { ...MESS_MENU_DATA.Lunch, description: 'Dal, seasonal vegetable, rice, breads, pickle and salad', dishes: [{ name: 'Arhar Dal', category: 'Lentils', type: 'Veg' }, { name: 'Parwal Do Pyaza', category: 'Main Course', type: 'Veg' }, { name: 'Roti', category: 'Bread', type: 'Veg' }, { name: 'Rice', category: 'Rice', type: 'Veg' }, { name: 'Pickle', category: 'Accompaniment', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }] },
    Snacks: { ...MESS_MENU_DATA.Snacks, description: 'Fresh samosa and Rasna', dishes: [{ name: 'Samosa', category: 'Snack', type: 'Veg' }, { name: 'Rasna', category: 'Beverage', type: 'Veg' }] },
    Dinner: { ...MESS_MENU_DATA.Dinner, description: 'Dal, vegetable curry, kofta, roti, salad and pickle', dishes: [{ name: 'Chana Dal', category: 'Lentils', type: 'Veg' }, { name: 'Aloo Gobhi', category: 'Main Course', type: 'Veg' }, { name: 'Kofta', category: 'Main Course', type: 'Veg' }, { name: 'Roti', category: 'Bread', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }, { name: 'Pickle', category: 'Accompaniment', type: 'Veg' }] },
  },
  Tuesday: {
    Breakfast: { ...MESS_MENU_DATA.Breakfast, description: 'Sambar, upma, chutney and tea', dishes: [{ name: 'Sambar', category: 'Accompaniment', type: 'Veg' }, { name: 'Upma', category: 'Main Course', type: 'Veg' }, { name: 'Chutney', category: 'Accompaniment', type: 'Veg' }, { name: 'Tea', category: 'Beverage', type: 'Veg' }] },
    Lunch: { ...MESS_MENU_DATA.Lunch, description: 'Rajma, aloo matar, rice, roti, pickle and salad', dishes: [{ name: 'Rajma', category: 'Lentils', type: 'Veg' }, { name: 'Aloo Matar', category: 'Main Course', type: 'Veg' }, { name: 'Rice', category: 'Rice', type: 'Veg' }, { name: 'Roti', category: 'Bread', type: 'Veg' }, { name: 'Pickle', category: 'Accompaniment', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }] },
    Snacks: { ...MESS_MENU_DATA.Snacks, description: 'Poha or macaroni with tea', dishes: [{ name: 'Poha/Macaroni', category: 'Snack', type: 'Veg' }, { name: 'Tea', category: 'Beverage', type: 'Veg' }] },
    Dinner: { ...MESS_MENU_DATA.Dinner, description: 'Puri chola, kaddu ki sabji, kheer, rice, roti, pickle and salad', dishes: [{ name: 'Puri Chola', category: 'Main Course', type: 'Veg' }, { name: 'Kaddu Ki Sabji', category: 'Main Course', type: 'Veg' }, { name: 'Kheer', category: 'Dessert', type: 'Veg' }, { name: 'Rice', category: 'Rice', type: 'Veg' }, { name: 'Roti', category: 'Bread', type: 'Veg' }, { name: 'Pickle', category: 'Accompaniment', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }] },
  },
  Wednesday: {
    Breakfast: { ...MESS_MENU_DATA.Breakfast, description: 'Aloo paratha, dahi and tea', dishes: [{ name: 'Aloo Paratha', category: 'Main Course', type: 'Veg' }, { name: 'Dahi', category: 'Accompaniment', type: 'Veg' }, { name: 'Tea', category: 'Beverage', type: 'Veg' }] },
    Lunch: { ...MESS_MENU_DATA.Lunch, description: 'Kadai paneer, kali masoor dal, rice, roti, pickle and salad', dishes: [{ name: 'Kadai Paneer', category: 'Main Course', type: 'Veg' }, { name: 'Kali Masoor Dal', category: 'Lentils', type: 'Veg' }, { name: 'Rice', category: 'Rice', type: 'Veg' }, { name: 'Roti', category: 'Bread', type: 'Veg' }, { name: 'Pickle', category: 'Accompaniment', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }] },
    Snacks: { ...MESS_MENU_DATA.Snacks, description: 'Aloo bread sandwich and Rasna', dishes: [{ name: 'Aloo Bread Sandwich', category: 'Snack', type: 'Veg' }, { name: 'Rasna', category: 'Beverage', type: 'Veg' }] },
    Dinner: { ...MESS_MENU_DATA.Dinner, description: 'Egg curry or malai kofta with rice, roti, salad and gulab jamun', dishes: [{ name: 'Egg Curry', category: 'Egg Course', type: 'Non-Veg' }, { name: 'Malai Kofta', category: 'Main Course', type: 'Veg' }, { name: 'Rice', category: 'Rice', type: 'Veg' }, { name: 'Roti', category: 'Bread', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }, { name: 'Gulab Jamun', category: 'Dessert', type: 'Veg' }] },
  },
  Thursday: {
    Breakfast: { ...MESS_MENU_DATA.Breakfast, description: 'Bread, butter, jam, banana and tea', dishes: [{ name: 'Bread', category: 'Main Course', type: 'Veg' }, { name: 'Butter', category: 'Accompaniment', type: 'Veg' }, { name: 'Jam', category: 'Accompaniment', type: 'Veg' }, { name: 'Banana', category: 'Fruit', type: 'Veg' }, { name: 'Tea', category: 'Beverage', type: 'Veg' }] },
    Lunch: { ...MESS_MENU_DATA.Lunch, description: 'Mixed vegetable sabzi, Punjabi dal tadka, rice, roti and salad', dishes: [{ name: 'Mix Vegetable Sabzi', category: 'Main Course', type: 'Veg' }, { name: 'Punjabi Dal Tadka', category: 'Lentils', type: 'Veg' }, { name: 'Rice', category: 'Rice', type: 'Veg' }, { name: 'Roti', category: 'Bread', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }] },
    Snacks: { ...MESS_MENU_DATA.Snacks, description: 'Chow mein and tea', dishes: [{ name: 'Chow Mein', category: 'Snack', type: 'Veg' }, { name: 'Tea', category: 'Beverage', type: 'Veg' }] },
    Dinner: { ...MESS_MENU_DATA.Dinner, description: 'Dal makhani, patta gobhi aloo, seasonal sabzi, roti, salad and gulab jamun', dishes: [{ name: 'Dal Makhani', category: 'Lentils', type: 'Veg' }, { name: 'Patta Gobhi Aloo', category: 'Main Course', type: 'Veg' }, { name: 'Seasonal Sabzi', category: 'Main Course', type: 'Veg' }, { name: 'Roti', category: 'Bread', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }, { name: 'Gulab Jamun', category: 'Dessert', type: 'Veg' }] },
  },
  Friday: {
    Breakfast: { ...MESS_MENU_DATA.Breakfast, description: 'Pav bhaji or chole kulcha with tea', dishes: [{ name: 'Pav Bhaji', category: 'Main Course', type: 'Veg' }, { name: 'Chole Kulcha', category: 'Main Course', type: 'Veg' }, { name: 'Tea', category: 'Beverage', type: 'Veg' }] },
    Lunch: { ...MESS_MENU_DATA.Lunch, description: 'Mixed vegetable sabzi, Punjabi dal, rice, roti, pickle and salad', dishes: [{ name: 'Mix Vegetable Sabzi', category: 'Main Course', type: 'Veg' }, { name: 'Punjabi Dal', category: 'Lentils', type: 'Veg' }, { name: 'Rice', category: 'Rice', type: 'Veg' }, { name: 'Roti', category: 'Bread', type: 'Veg' }, { name: 'Pickle', category: 'Accompaniment', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }] },
    Snacks: { ...MESS_MENU_DATA.Snacks, description: 'Aloo tikki burger or vegetable burger with tea', dishes: [{ name: 'Aloo Tikki Burger', category: 'Snack', type: 'Veg' }, { name: 'Vegetable Burger', category: 'Snack', type: 'Veg' }, { name: 'Tea', category: 'Beverage', type: 'Veg' }] },
    Dinner: { ...MESS_MENU_DATA.Dinner, description: 'Chilli paneer, veg Manchurian, fried rice, roti and salad', dishes: [{ name: 'Chilli Paneer', category: 'Main Course', type: 'Veg' }, { name: 'Veg Manchurian', category: 'Main Course', type: 'Veg' }, { name: 'Fried Rice', category: 'Rice', type: 'Veg' }, { name: 'Roti', category: 'Bread', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }] },
  },
  Saturday: {
    Breakfast: { ...MESS_MENU_DATA.Breakfast, description: 'Kala chana, plain paratha and tea', dishes: [{ name: 'Kala Chana', category: 'Main Course', type: 'Veg' }, { name: 'Plain Paratha', category: 'Bread', type: 'Veg' }, { name: 'Tea', category: 'Beverage', type: 'Veg' }] },
    Lunch: { ...MESS_MENU_DATA.Lunch, description: 'Vegetable biryani, chutney, raita, papad and salad', dishes: [{ name: 'Vegetable Biryani', category: 'Rice', type: 'Veg' }, { name: 'Chutney', category: 'Accompaniment', type: 'Veg' }, { name: 'Raita', category: 'Accompaniment', type: 'Veg' }, { name: 'Papad', category: 'Accompaniment', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }] },
    Snacks: { ...MESS_MENU_DATA.Snacks, description: 'Dahi bhalla and Rasna', dishes: [{ name: 'Dahi Bhalla', category: 'Snack', type: 'Veg' }, { name: 'Rasna', category: 'Beverage', type: 'Veg' }] },
    Dinner: { ...MESS_MENU_DATA.Dinner, description: 'Dal, rice, roti, chana, custard, salad and pickle', dishes: [{ name: 'Dal', category: 'Lentils', type: 'Veg' }, { name: 'Rice', category: 'Rice', type: 'Veg' }, { name: 'Roti', category: 'Bread', type: 'Veg' }, { name: 'Chana', category: 'Main Course', type: 'Veg' }, { name: 'Custard', category: 'Dessert', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }, { name: 'Pickle', category: 'Accompaniment', type: 'Veg' }] },
  },
  Sunday: {
    Breakfast: { ...MESS_MENU_DATA.Breakfast, description: 'Paneer paratha and tea', dishes: [{ name: 'Paneer Paratha', category: 'Main Course', type: 'Veg' }, { name: 'Tea', category: 'Beverage', type: 'Veg' }] },
    Lunch: { ...MESS_MENU_DATA.Lunch, description: 'Chole bhature, rice, raita, pickle and salad', dishes: [{ name: 'Chole Bhature', category: 'Main Course', type: 'Veg' }, { name: 'Rice', category: 'Rice', type: 'Veg' }, { name: 'Raita', category: 'Accompaniment', type: 'Veg' }, { name: 'Pickle', category: 'Accompaniment', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }] },
    Snacks: { ...MESS_MENU_DATA.Snacks, description: 'Aloo patties and tea', dishes: [{ name: 'Aloo Patties', category: 'Snack', type: 'Veg' }, { name: 'Tea', category: 'Beverage', type: 'Veg' }] },
    Dinner: { ...MESS_MENU_DATA.Dinner, description: 'Chicken curry, paneer do pyaza, rice, roti, salad and pickle', dishes: [{ name: 'Chicken Curry', category: 'Main Course', type: 'Non-Veg' }, { name: 'Paneer Do Pyaza', category: 'Main Course', type: 'Veg' }, { name: 'Rice', category: 'Rice', type: 'Veg' }, { name: 'Roti', category: 'Bread', type: 'Veg' }, { name: 'Salad', category: 'Salad', type: 'Veg' }, { name: 'Pickle', category: 'Accompaniment', type: 'Veg' }] },
  },
};

export const WEEKLY_MEAL_PLAN = [
  { day: 'Monday', vegSpecial: 'Aloo Puri, Arhar Dal, Parwal Do Pyaza, Samosa', nonVegSpecial: 'Chana Dal, Aloo Gobhi, Kofta' },
  { day: 'Tuesday', vegSpecial: 'Sambar Upma, Rajma, Aloo Matar, Poha/Macaroni', nonVegSpecial: 'Puri Chola, Kaddu Ki Sabji' },
  { day: 'Wednesday', vegSpecial: 'Aloo Paratha, Kadai Paneer, Aloo Bread Sandwich', nonVegSpecial: 'Egg Curry/Malai Kofta' },
  { day: 'Thursday', vegSpecial: 'Bread Butter Jam, Mix Vegetable Sabzi, Chow Mein', nonVegSpecial: 'Dal Makhani, Patta Gobhi Aloo' },
  { day: 'Friday', vegSpecial: 'Pav Bhaji, Mix Vegetable Sabzi, Aloo Tikki Burger', nonVegSpecial: 'Chilli Paneer, Veg Manchurian, Fried Rice' },
  { day: 'Saturday', vegSpecial: 'Kala Chana, Vegetable Biryani, Dahi Bhalla', nonVegSpecial: 'Dal, Rice, Roti, Chana, Custard' },
  { day: 'Sunday', vegSpecial: 'Paneer Paratha, Chole Bhature, Aloo Patties', nonVegSpecial: 'Chicken Curry, Paneer Do Pyaza' },
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

