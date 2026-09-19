import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi';

export interface Translations {
  // App Header & Branding
  brand: string;
  hostelSub: string;
  roomTag: string;
  langSwitchBtn: string;
  langSwitchLabel: string;
  emergencyBtn: string;
  signOutBtn: string;
  profileBtn: string;
  themeToggle: string;

  // Nav Tabs
  tabRoom: string;
  tabCleaning: string;
  tabLaundry: string;
  tabMess: string;
  tabFees: string;
  tabComplaints: string;
  tabContacts: string;
  tabNotices: string;
  tabMore: string;

  // Common UI words
  done: string;
  pending: string;
  close: string;
  back: string;
  viewDetails: string;
  call: string;
  whatsapp: string;
  copyNumber: string;
  copied: string;
  downloadPdf: string;
  status: string;
  date: string;
  time: string;
  optional: string;
  submit: string;
  search: string;

  // My Room
  roomTitle: string;
  roomDesc: string;
  threeSeaterAc: string;
  occupied: string;
  residentsTitle: string;
  residentsHint: string;
  contactResident: string;
  youBadge: string;
  hostelCalendar: string;

  // Daily Cleaning
  cleaningTitle: string;
  cleaningSub: string;
  cleaningProgress: string;
  floorTask: string;
  dustingTask: string;
  trashTask: string;
  washroomTask: string;
  acTask: string;
  cleanedBy: string;
  syncNote: string;

  // Laundry Depot
  laundryTitle: string;
  laundrySub: string;
  dropLaundryBtn: string;
  laundryHistoryTitle: string;
  receiptNumber: string;
  tokenPin: string;
  expectedDelivery: string;
  totalPieces: string;
  dropModalTitle: string;
  studentNameLabel: string;
  roomNumberLabel: string;
  mobileNumberLabel: string;
  clothCountLabel: string;
  photoUploadLabel: string;
  photoHint: string;
  takePhotoBtn: string;
  removePhoto: string;
  generateReceiptBtn: string;

  // Mess / Dining
  messTitle: string;
  messSub: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;

  // Fees
  feesTitle: string;
  totalPaid: string;
  pendingDues: string;
  allCleared: string;
  downloadReceiptBtn: string;

  // Wi-Fi & Notices
  wifiTitle: string;
  wifiSub: string;
  wifiSsid: string;
  wifiPass: string;
  copyWifiPass: string;
  noticesTitle: string;
  unreadDirectives: string;
  allCategory: string;
  safetyCategory: string;
  maintenanceCategory: string;
  curfewCategory: string;
  generalCategory: string;
  acknowledgeBtn: string;
  acknowledged: string;

  // Contacts
  wardenTitle: string;
  busTitle: string;
  callWarden: string;

  // Complaints & Gate Pass
  lodgeComplaintBtn: string;
  complaintsSubTab: string;
  gatePassSubTab: string;
  activeComplaints: string;
  generateGatePassTitle: string;
  passCategoryLabel: string;
  dayOuting: string;
  nightLeave: string;
  destinationLabel: string;
  exitTimeLabel: string;
  expectedInLabel: string;
  generateTurnstileBtn: string;
  recentPassesTitle: string;
  quickOutpassShortcut: string;
  validTurnstileNotice: string;
  showToGuard: string;
  passActive: string;
  passExpired: string;
  savePassBtn: string;
  copyPassToken: string;

  // User details
  collegeLabel: string;
  yearLabel: string;
  bloodGroupLabel: string;
  cityLabel: string;
  emergencyGuardian: string;
  phoneLabel: string;

  // Header & Menu extras
  hostelHelpdesk: string;
  userDetails: string;
  editDetails: string;
  viewRoomBed: string;
  updateContact: string;
  signOutPortal: string;

  // Pass & Complaints headings
  gatePassHeading: string;
  complaintHeading: string;
  generateTurnstilePassBtn: string;
  profileResident: string;
  profileOutpassType: string;
  profileDestination: string;
  profileExitWindow: string;
  profileReturnCurfew: string;
  copyToken: string;
  doneBtn: string;
  navComplaints: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brand: 'REALM OF HOSTELS',
    hostelSub: 'Royal Paradise Student Hostel',
    roomTag: 'Room B-004 · 3-Seater AC',
    langSwitchBtn: 'हिंदी',
    langSwitchLabel: 'Switch to Hindi',
    emergencyBtn: 'Help / Emergency',
    signOutBtn: 'Sign Out',
    profileBtn: 'My Profile',
    themeToggle: 'Toggle Theme',

    tabRoom: 'My Room',
    tabCleaning: 'Cleaning',
    tabLaundry: 'Laundry',
    tabMess: 'Mess',
    tabFees: 'Fees',
    tabComplaints: 'Help / Complaints',
    tabContacts: 'Wardens & Bus',
    tabNotices: 'Notices & Wi-Fi',
    tabMore: 'More',

    done: 'Done',
    pending: 'Pending',
    close: 'Close',
    back: 'Back',
    viewDetails: 'View Details',
    call: 'Call',
    whatsapp: 'WhatsApp',
    copyNumber: 'Copy Number',
    copied: 'Copied!',
    downloadPdf: 'Download PDF',
    status: 'Status',
    date: 'Date',
    time: 'Time',
    optional: 'Optional',
    submit: 'Submit',
    search: 'Search...',

    roomTitle: 'Room B-004',
    roomDesc: 'Royal Paradise Block · Ground Floor (Wing B)',
    threeSeaterAc: '3-Seater AC Room',
    occupied: '3 Residents Occupied',
    residentsTitle: 'Room Beds & Roommates',
    residentsHint: 'Tap any bed to see roommate details or contact them',
    contactResident: 'Contact Roommate',
    youBadge: 'You',
    hostelCalendar: 'Hostel & Academic Calendar',

    cleaningTitle: 'Daily Room Cleaning',
    cleaningSub: 'Room B-004 Daily Housekeeping Status',
    cleaningProgress: 'Tasks Done',
    floorTask: 'Floor Swept & Wet Mopped',
    dustingTask: 'Study Tables & Wardrobes Dusted',
    trashTask: 'Waste Bin Emptied & Bag Replaced',
    washroomTask: 'Washroom & Basin Sanitized',
    acTask: 'AC Dust Filter Inspected',
    cleanedBy: 'Cleaned by',
    syncNote: 'Updates instantly sync across all roommates',

    laundryTitle: 'Laundry & Dry-Clean',
    laundrySub: 'Drop clothes, get voucher & track washing status',
    dropLaundryBtn: 'Drop Laundry & Get Receipt',
    laundryHistoryTitle: 'My Laundry History & Receipts',
    receiptNumber: 'Receipt Number',
    tokenPin: 'Pickup Token PIN',
    expectedDelivery: 'Expected Return',
    totalPieces: 'Total Clothes',
    dropModalTitle: 'Drop Laundry & Get Receipt',
    studentNameLabel: 'Student Name',
    roomNumberLabel: 'Room Number',
    mobileNumberLabel: 'Mobile Number',
    clothCountLabel: 'Number of Clothes',
    photoUploadLabel: 'Photo of Laundry (Optional)',
    photoHint: 'Take a picture of clothes for verification',
    takePhotoBtn: 'Tap to Take Photo or Upload Image',
    removePhoto: 'Remove Photo',
    generateReceiptBtn: 'Generate Laundry Receipt Voucher',

    messTitle: 'Mess & Daily Food Menu',
    messSub: 'Fresh 4-meal daily dining schedule for residents',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    snacks: 'Evening Snacks',
    dinner: 'Dinner',

    feesTitle: 'Fees & Payment Receipts',
    totalPaid: 'Total Paid Fees',
    pendingDues: 'Pending Dues',
    allCleared: '₹0 · All Cleared',
    downloadReceiptBtn: 'Download Receipt',

    wifiTitle: 'Hostel High-Speed Wi-Fi',
    wifiSub: 'Available across all rooms in Royal Paradise Block',
    wifiSsid: 'Wi-Fi Name',
    wifiPass: 'Password',
    copyWifiPass: 'Copy Password',
    noticesTitle: 'Hostel Notices & Directives',
    unreadDirectives: 'Unread Directives',
    allCategory: 'All Notices',
    safetyCategory: 'Safety',
    maintenanceCategory: 'Maintenance',
    curfewCategory: 'Curfew & Gate',
    generalCategory: 'General',
    acknowledgeBtn: 'Mark as Read',
    acknowledged: 'Read',

    wardenTitle: 'Hostel Wardens & Caretakers',
    busTitle: 'Campus Transport Schedule',
    callWarden: 'Call Warden',

    lodgeComplaintBtn: 'Lodge Complaint',
    complaintsSubTab: 'Complaints & Tracking',
    gatePassSubTab: 'Gate Pass / Outpass',
    activeComplaints: 'Active & Historic Complaints',
    generateGatePassTitle: 'Generate Security Turnstile Pass',
    passCategoryLabel: 'Pass Category',
    dayOuting: 'Day Outing (Curfew 10:30 PM)',
    nightLeave: 'Night Outpass / Weekend',
    destinationLabel: 'Purpose / Destination',
    exitTimeLabel: 'Exit Time',
    expectedInLabel: 'Expected In',
    generateTurnstileBtn: 'Generate Turnstile QR Pass',
    recentPassesTitle: 'Recent Outpasses & QR Tokens',
    quickOutpassShortcut: 'Quick 1-Click Outing Pass',
    validTurnstileNotice: 'VALID AT MAIN TURNSTILE GATES 1 & 2',
    showToGuard: 'Show this scannable QR pass to security at the gate',
    passActive: 'ACTIVE PASS',
    passExpired: 'EXPIRED',
    savePassBtn: 'Save Pass',
    copyPassToken: 'Copy Token ID',

    collegeLabel: 'College / Institution',
    yearLabel: 'Current Year',
    bloodGroupLabel: 'Blood Group',
    cityLabel: 'Permanent City',
    emergencyGuardian: 'Emergency Guardian',
    phoneLabel: 'Mobile Phone',

    hostelHelpdesk: 'Hostel Helpdesk',
    userDetails: 'User Details',
    editDetails: 'Edit Details',
    viewRoomBed: 'View room, bed & college records',
    updateContact: 'Update contact, city & blood group',
    signOutPortal: 'Sign Out of Portal',

    gatePassHeading: 'Generate Gate Pass (Turnstile QR)',
    complaintHeading: 'Complaints, Work Orders & Gate Pass',
    generateTurnstilePassBtn: 'Generate Security Turnstile Pass',
    profileResident: 'Resident',
    profileOutpassType: 'Pass Category',
    profileDestination: 'Destination',
    profileExitWindow: 'Exit Window',
    profileReturnCurfew: 'Return Curfew',
    copyToken: 'Copy Token ID',
    doneBtn: 'Done',
    navComplaints: 'Campus Facilities & Service SLA',
  },

  hi: {
    brand: 'रॉयल हॉस्टल पोर्टल',
    hostelSub: 'रॉयल पैराडाइज छात्र हॉस्टल',
    roomTag: 'कमरा B-004 · 3-सीटर एसी',
    langSwitchBtn: 'English',
    langSwitchLabel: 'अंग्रेजी में बदलें',
    emergencyBtn: 'मदद / आपातकालीन',
    signOutBtn: 'लॉगआउट',
    profileBtn: 'मेरी प्रोफाइल',
    themeToggle: 'थीम बदलें',

    tabRoom: 'कमरा',
    tabCleaning: 'सफाई',
    tabLaundry: 'लॉन्ड्री',
    tabMess: 'खाना (मेस)',
    tabFees: 'फीस',
    tabComplaints: 'शिकायत / मदद',
    tabContacts: 'वार्डन और बस',
    tabNotices: 'नोटिस और Wi-Fi',
    tabMore: 'अन्य',

    done: 'हो गया',
    pending: 'बाकी',
    close: 'बंद करें',
    back: 'वापस',
    viewDetails: 'विवरण देखें',
    call: 'कॉल करें',
    whatsapp: 'व्हाट्सएप',
    copyNumber: 'नंबर कॉपी करें',
    copied: 'कॉपी हो गया!',
    downloadPdf: 'PDF डाउनलोड करें',
    status: 'स्थिति',
    date: 'दिनांक',
    time: 'समय',
    optional: 'वैकल्पिक',
    submit: 'जमा करें',
    search: 'खोजें...',

    roomTitle: 'कमरा B-004',
    roomDesc: 'रॉयल पैराडाइज ब्लॉक · भूतल (विंग B)',
    threeSeaterAc: '3-सीटर एसी कमरा',
    occupied: '3 छात्र आवंटित',
    residentsTitle: 'कमरे के बेड और रूममेट',
    residentsHint: 'रूममेट का विवरण देखने या संपर्क करने के लिए बेड पर टैप करें',
    contactResident: 'रूममेट से संपर्क',
    youBadge: 'आप',
    hostelCalendar: 'हॉस्टल और शैक्षणिक कैलेंडर',

    cleaningTitle: 'दैनिक कमरा सफाई',
    cleaningSub: 'कमरा B-004 की आज की सफाई स्थिति',
    cleaningProgress: 'सफाई कार्य पूर्ण',
    floorTask: 'फर्श पर झाड़ू और गीला पोछा',
    dustingTask: 'स्टडी टेबल और अलमारी की धूल सफाई',
    trashTask: 'कचरा डिब्बा खाली कर नया बैग लगाया',
    washroomTask: 'वॉशरूम और वॉशबेसिन की सफाई',
    acTask: 'एसी फिल्टर की जांच व सफाई',
    cleanedBy: 'सफाई कर्ता',
    syncNote: 'सभी रूममेट्स के फोन पर तुरंत अपडेट होता है',

    laundryTitle: 'लॉन्ड्री और कपड़े धुलाई',
    laundrySub: 'कपड़े जमा करें, रसीद प्राप्त करें और स्थिति देखें',
    dropLaundryBtn: 'कपड़े जमा करें और रसीद पाएं',
    laundryHistoryTitle: 'मेरी लॉन्ड्री रसीदें और इतिहास',
    receiptNumber: 'रसीद संख्या',
    tokenPin: 'पिकअप टोकन पिन',
    expectedDelivery: 'अनुमानित वापसी',
    totalPieces: 'कुल कपड़े',
    dropModalTitle: 'कपड़े जमा करें और रसीद पाएं',
    studentNameLabel: 'छात्र का नाम',
    roomNumberLabel: 'कमरा नंबर',
    mobileNumberLabel: 'मोबाइल नंबर',
    clothCountLabel: 'कपड़ों की संख्या (पीस)',
    photoUploadLabel: 'कपड़ों की फोटो (वैकल्पिक)',
    photoHint: 'पहचान व सत्यापन हेतु कपड़ों की फोटो लें',
    takePhotoBtn: 'फोटो खींचने या अपलोड करने के लिए टैप करें',
    removePhoto: 'फोटो हटाएं',
    generateReceiptBtn: 'लॉन्ड्री रसीद वाउचर बनाएं',

    messTitle: 'मेस और आज का भोजन',
    messSub: 'छात्रों के लिए ताजा 4 समय का भोजन मेन्यू',
    breakfast: 'सुबह का नाश्ता',
    lunch: 'दोपहर का खाना',
    snacks: 'शाम की चाय/नाश्ता',
    dinner: 'रात का भोजन',

    feesTitle: 'हॉस्टल फीस और रसीदें',
    totalPaid: 'कुल जमा फीस',
    pendingDues: 'बकाया फीस',
    allCleared: '₹0 · कोई बकाया नहीं',
    downloadReceiptBtn: 'रसीद डाउनलोड करें',

    wifiTitle: 'हॉस्टल हाई-स्पीड वाई-फाई',
    wifiSub: 'रॉयल पैराडाइज ब्लॉक के सभी कमरों में उपलब्ध',
    wifiSsid: 'वाई-फाई नाम',
    wifiPass: 'पासवर्ड',
    copyWifiPass: 'पासवर्ड कॉपी करें',
    noticesTitle: 'हॉस्टल सूचनाएं और निर्देश',
    unreadDirectives: 'अपठित सूचनाएं',
    allCategory: 'सभी सूचनाएं',
    safetyCategory: 'सुरक्षा',
    maintenanceCategory: 'मरम्मत/सफाई',
    curfewCategory: 'कर्फ्यू और गेट नियम',
    generalCategory: 'सामान्य',
    acknowledgeBtn: 'पढ़ा गया चिह्नित करें',
    acknowledged: 'पढ़ा गया',

    wardenTitle: 'हॉस्टल वार्डन और कर्मचारी',
    busTitle: 'कैंपस बस समय-सारणी',
    callWarden: 'वार्डन को कॉल करें',

    lodgeComplaintBtn: 'शिकायत दर्ज करें',
    complaintsSubTab: 'शिकायतें और स्थिति',
    gatePassSubTab: 'गेट पास / टर्नस्टाइल पास',
    activeComplaints: 'सक्रिय और पिछली शिकायतें',
    generateGatePassTitle: 'टर्नस्टाइल गेट पास बनाएं',
    passCategoryLabel: 'पास का प्रकार',
    dayOuting: 'डे आउटिंग (कर्फ्यू 10:30 PM)',
    nightLeave: 'नाइट आउटपास / सप्ताहांत',
    destinationLabel: 'कारण / जाने का स्थान',
    exitTimeLabel: 'प्रस्थान समय',
    expectedInLabel: 'वापसी का समय',
    generateTurnstileBtn: 'टर्नस्टाइल QR पास बनाएं',
    recentPassesTitle: 'हाल के आउटपास और QR टोकन',
    quickOutpassShortcut: 'त्वरित 1-क्लिक आउटिंग पास',
    validTurnstileNotice: 'टर्नस्टाइल गेट 1 और 2 पर मान्य',
    showToGuard: 'गेट पर सुरक्षा गार्ड या स्कैनर को यह QR कोड दिखाएं',
    passActive: 'सक्रिय पास',
    passExpired: 'समाप्त',
    savePassBtn: 'पास सेव करें',
    copyPassToken: 'टोकन कोड कॉपी करें',

    collegeLabel: 'कॉलेज / संस्थान',
    yearLabel: 'वर्तमान वर्ष',
    bloodGroupLabel: 'ब्लड ग्रुप',
    cityLabel: 'स्थायी शहर',
    emergencyGuardian: 'आपातकालीन अभिभावक',
    phoneLabel: 'मोबाइल फोन',

    hostelHelpdesk: 'हॉस्टल हेल्पडेस्क',
    userDetails: 'छात्र विवरण',
    editDetails: 'विवरण संपादित करें',
    viewRoomBed: 'कमरा, बेड और कॉलेज रिकॉर्ड देखें',
    updateContact: 'संपर्क, शहर व ब्लड ग्रुप अपडेट करें',
    signOutPortal: 'पोर्टल से लॉग आउट करें',

    gatePassHeading: 'गेट पास बनाएं (टर्नस्टाइल क्यूआर)',
    complaintHeading: 'शिकायतें, कार्य आदेश और गेट पास',
    generateTurnstilePassBtn: 'सुरक्षा टर्नस्टाइल पास बनाएं',
    profileResident: 'छात्र',
    profileOutpassType: 'पास का प्रकार',
    profileDestination: 'गंतव्य',
    profileExitWindow: 'प्रस्थान समय',
    profileReturnCurfew: 'वापसी का समय',
    copyToken: 'पास टोकन कॉपी करें',
    doneBtn: 'संपन्न',
    navComplaints: 'कैंपस सुविधाएं व सर्विस एसएलए',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('realm_app_lang');
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('realm_app_lang', lang);
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: TRANSLATIONS[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
