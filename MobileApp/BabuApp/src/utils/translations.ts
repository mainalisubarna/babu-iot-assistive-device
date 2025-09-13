// Translation utility for dynamic content
export const translateReminderTitle = (title: string, language: 'en' | 'ne'): string => {
  if (language === 'en') return title;

  const translations: { [key: string]: string } = {
    'Doctor Appointment': 'डाक्टरसँग भेटघाट',
    'Call daughter': 'छोरीलाई फोन गर्नुहोस्',
    'Take evening walk': 'साँझको हिँडडुल गर्नुहोस्',
    'Blood test at clinic': 'क्लिनिकमा रगत जाँच',
    'Buy groceries': 'किराना सामान किन्नुहोस्',
    'Physical therapy session': 'फिजियो थेरापी सेसन',
    'Call son for birthday': 'छोराको जन्मदिनमा फोन गर्नुहोस्',
    'Dentist checkup': 'दाँतको जाँच',
  };

  return translations[title] || title;
};

export const translateActivityDetail = (detail: any, language: 'en' | 'ne'): any => {
  if (language === 'en') return detail;

  const translated = { ...detail };

  // Translate location
  if (detail.location === 'Living room') {
    translated.location = 'बैठक कोठा';
  }

  // Translate contact names
  if (detail.contactName === 'Son') {
    translated.contactName = 'छोरा';
  } else if (detail.contactName === 'Daughter') {
    translated.contactName = 'छोरी';
  }

  // Translate duration
  if (detail.duration === '10 minutes') {
    translated.duration = '१० मिनेट';
  } else if (detail.duration === '5 minutes') {
    translated.duration = '५ मिनेट';
  }

  // Translate reminder titles
  if (detail.reminderTitle) {
    translated.reminderTitle = translateReminderTitle(detail.reminderTitle, language);
  }

  return translated;
};

export const translateContactName = (name: string, language: 'en' | 'ne'): string => {
  if (language === 'en') return name;

  const translations: { [key: string]: string } = {
    'Sita Sharma (Daughter)': 'सीता शर्मा (छोरी)',
    'Raj Sharma (Son)': 'राज शर्मा (छोरा)',
    'Dr. Krishna Thapa': 'डा. कृष्ण थापा',
    'Maya Gurung (Neighbor)': 'माया गुरुङ (छिमेकी)',
    'Hari Bahadur (Caretaker)': 'हरि बहादुर (हेरचाहकर्ता)',
  };

  return translations[name] || name;
};

export const translate = (key: string, fallback: string, language: 'en' | 'ne' = 'en'): string => {
  if (language === 'en') return fallback;

  const nepaliTranslations: { [key: string]: string } = {
    // Medicine Management
    'medicineReminders': 'औषधि सम्झना',
    'addMedicine': 'औषधि थप्नुहोस्',
    'editMedicine': 'औषधि सम्पादन गर्नुहोस्',
    'medicineName': 'औषधिको नाम',
    'colorPouch': 'रंगीन झोला',
    'dosage': 'मात्रा (गोली)',
    'times': 'समयहरू',
    'voiceInstructions': 'आवाज निर्देशन',
    'pouch': 'झोला',
    'pills': 'गोलीहरू',
    'loading': 'लोड हुँदैछ...',
    'noMedicines': 'कुनै औषधि थपिएको छैन',
    'addFirstMedicine': 'तपाईंको पहिलो औषधि सम्झना थप्नुहोस्',
    'enterMedicineName': 'औषधिको नाम लेख्नुहोस्',
    'enterVoiceInstructions': 'नेपालीमा आवाज निर्देशन लेख्नुहोस्',
    'addTime': 'समय थप्नुहोस्',
    'save': 'सुरक्षित गर्नुहोस्',
    'cancel': 'रद्द गर्नुहोस्',
    'delete': 'मेटाउनुहोस्',
    'error': 'त्रुटि',
    'success': 'सफल',
    'medicineNameRequired': 'औषधिको नाम आवश्यक छ',
    'medicineAdded': 'औषधि सफलतापूर्वक थपियो',
    'medicineUpdated': 'औषधि सफलतापूर्वक अपडेट भयो',
    'medicineDeleted': 'औषधि सफलतापूर्वक मेटाइयो',
    'confirmDelete': 'मेटाउने पुष्टि गर्नुहोस्',
    'deleteMedicineConfirm': 'के तपाईं यो औषधि मेटाउन चाहनुहुन्छ?',
    'failedToLoadMedicines': 'औषधिहरू लोड गर्न असफल',

    // Document Reader
    'documentReader': 'कागजात पढ्ने',
    'scanDocument': 'कागजात स्क्यान गर्नुहोस्',
    'takePhoto': 'फोटो खिच्नुहोस्',
    'selectFromGallery': 'ग्यालेरीबाट छान्नुहोस्',
    'scanningDocument': 'कागजात स्क्यान गर्दै...',
    'readingDocument': 'कागजात पढ्दै...',
    'documentScanned': 'कागजात स्क्यान भयो',
    'noDocumentFound': 'कुनै कागजात फेला परेन',
    'cameraPermissionRequired': 'क्यामेरा अनुमति आवश्यक छ',

    // Call Contacts
    'callContacts': 'सम्पर्कहरूलाई फोन गर्नुहोस्',
    'addContact': 'सम्पर्क थप्नुहोस्',
    'editContact': 'सम्पर्क सम्पादन गर्नुहोस्',
    'contactName': 'सम्पर्कको नाम',
    'phoneNumber': 'फोन नम्बर',
    'voiceTag': 'आवाज ट्याग',
    'emergencyContact': 'आपातकालीन सम्पर्क',
    'callNow': 'अहिले फोन गर्नुहोस्',
    'noContacts': 'कुनै सम्पर्क थपिएको छैन',
    'addFirstContact': 'तपाईंको पहिलो सम्पर्क थप्नुहोस्',
    'contactAdded': 'सम्पर्क सफलतापूर्वक थपियो',
    'contactUpdated': 'सम्पर्क सफलतापूर्वक अपडेट भयो',
    'contactDeleted': 'सम्पर्क सफलतापूर्वक मेटाइयो',
    'deleteContactConfirm': 'के तपाईं यो सम्पर्क मेटाउन चाहनुहुन्छ?',

    // Companion Tools
    'companionTools': 'साथी उपकरणहरू',
    'nepaliCalendar': 'नेपाली पात्रो',
    'horoscope': 'राशिफल',
    'todaysDate': 'आजको मिति',
    'todaysHoroscope': 'आजको राशिफल',
    'selectZodiacSign': 'राशि छान्नुहोस्',
    'calendarEvents': 'पात्रो घटनाहरू',
    'festivals': 'चाडपर्वहरू',
    'importantDates': 'महत्वपूर्ण मितिहरू',

    // Features Screen
    'features': 'सुविधाहरू',
    'manageFeatures': 'तपाईंको बाबु यन्त्रका सुविधाहरू व्यवस्थापन गर्नुहोस्',
    'recentActivity': 'हालको गतिविधि',
    'manage': 'व्यवस्थापन गर्नुहोस्',
    'viewAll': 'सबै हेर्नुहोस्',
    'quickStats': 'छिटो तथ्याङ्क',
    'medicines': 'औषधिहरू',
    'contacts': 'सम्पर्कहरू',
    'documents': 'कागजातहरू',

    // Voice Companion
    'voiceCompanion': 'आवाज साथी',
    'availableTools': 'उपलब्ध उपकरणहरू',
    'voiceCommands': 'आवाज आदेशहरू',
    'lastUsed': 'अन्तिम प्रयोग',
    'useNow': 'अहिले प्रयोग गर्नुहोस्',
    'addReminder': 'सम्झना थप्नुहोस्',
    'comingSoon': 'छिट्टै आउँदैछ',

    // General Reminders
    'generalReminders': 'सामान्य सम्झना',
    'noReminders': 'कुनै सम्झना थपिएको छैन',
    'addFirstReminder': 'तपाईंको पहिलो सम्झना वा स्मृति थप्नुहोस्',
    'editReminder': 'सम्झना सम्पादन गर्नुहोस्',
    'addReminder': 'सम्झना थप्नुहोस्',
    'title': 'शीर्षक',
    'time': 'समय',
    'type': 'प्रकार',
    'description': 'विवरण',
    'changesSaved': 'परिवर्तनहरू सफलतापूर्वक सुरक्षित भयो',
  };

  return nepaliTranslations[key] || fallback;
};