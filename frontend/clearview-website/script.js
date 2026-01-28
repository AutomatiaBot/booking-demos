(function(){
  // ============================================
  // TRANSLATIONS
  // ============================================
  const translations = {
    en: {
      // Navigation
      'nav.services': 'Services',
      'nav.why': 'Why ClearView',
      'nav.faq': 'FAQ',
      'nav.contact': 'Contact',
      'nav.demo': 'Demo Portal',
      'nav.call': 'Call (555) 203-7811',

      // Hero
      'hero.kicker': 'Modern eye care in Mesa Ridge',
      'hero.title': 'Eye exams, contacts, and dry eye help—without the runaround.',
      'hero.subtitle': 'From comprehensive exams to contact lens fittings and pediatric visits, ClearView helps you see comfortably and confidently.',
      'hero.cta1': 'Call to Schedule',
      'hero.cta2': 'Request a Call Back',
      'hero.locationLabel': 'Location',
      'hero.locationValue': '2147 Willow Park Blvd, Suite 210',
      'hero.hoursLabel': 'Hours',
      'hero.hoursValue': 'Mon–Fri 9–6 · Sat 9–2',
      'hero.imgAlt': 'Optometrist providing eye care',

      // Services
      'services.label': 'Our Services',
      'services.title': 'Care built around your vision needs',
      'services.subtitle': 'High-clarity exams, practical recommendations, and smooth follow-up.',
      'services.exam.title': 'Comprehensive Exams',
      'services.exam.desc': 'Routine checkups, prescription updates, and screenings for adults and seniors.',
      'services.contacts.title': 'Contact Lenses',
      'services.contacts.desc': 'Fittings for daily, monthly, toric, and multifocal lenses with comfort checks.',
      'services.dryeye.title': 'Dry Eye Support',
      'services.dryeye.desc': 'Evaluation and in-office treatment options for burning, gritty, or teary eyes.',
      'services.pediatric.title': 'Pediatric Exams',
      'services.pediatric.desc': 'Age-appropriate testing for kids—addressing squinting, headaches, and focus.',
      'services.diabetic.title': 'Diabetic Screenings',
      'services.diabetic.desc': 'Non-emergency screening support and referral guidance when needed.',
      'services.glasses.title': 'Glasses Guidance',
      'services.glasses.desc': 'Practical frame and lens recommendations for your lifestyle.',

      // Why ClearView
      'why.label': 'Why ClearView',
      'why.title': 'Clarity, comfort, and communication',
      'why.intro': 'We prioritize straightforward explanations, comfort-first care, and efficient visits that respect your time.',
      'why.item1': 'Clear explanations of what we\'re checking and why',
      'why.item2': 'Comfort-first approach for contacts and dry eye',
      'why.item3': 'Efficient visits with streamlined intake',
      'why.item4': 'Recommendations aligned with your daily activities',
      'why.imgAlt': 'Happy couple with clear vision',

      // Family
      'family.label': 'Family Care',
      'family.title': 'Eye care for every age',
      'family.desc': 'From your child\'s first eye exam to senior care, ClearView provides comprehensive vision services for your whole family.',
      'family.pediatric.title': 'Pediatric',
      'family.pediatric.desc': 'School-ready vision testing',
      'family.adults.title': 'Adults',
      'family.adults.desc': 'Routine exams & contacts',
      'family.seniors.title': 'Seniors',
      'family.seniors.desc': 'Age-related screenings',
      'family.cta': 'Schedule a Family Visit',
      'family.imgAlt': 'Family enjoying clear vision together',

      // Testimonials
      'testimonials.label': 'Patient Reviews',
      'testimonials.title': 'What our patients say',
      'testimonials.subtitle': 'Real experiences from real patients who trust ClearView with their vision care.',
      'testimonials.cta': 'Join Our Happy Patients',
      'testimonials.r1.text': '"Dr. Chen took the time to explain every step of my exam. My new contacts are more comfortable than any I\'ve worn before. Highly recommend!"',
      'testimonials.r1.name': 'Maria Rodriguez',
      'testimonials.r1.service': 'Contact Lens Fitting',
      'testimonials.r2.text': '"Finally found relief for my dry eyes! The team was thorough and caring. Three months into treatment and I can work on my computer without constant discomfort."',
      'testimonials.r2.name': 'James Thompson',
      'testimonials.r2.service': 'Dry Eye Treatment',
      'testimonials.r3.text': '"Brought my 7-year-old for her first eye exam. The staff was so patient and made her feel comfortable. Now she\'s excited to wear her new glasses to school!"',
      'testimonials.r3.name': 'Sarah Lin',
      'testimonials.r3.service': 'Pediatric Eye Exam',
      'testimonials.r4.text': '"As a diabetic, regular eye exams are crucial. ClearView caught early signs of retinopathy and coordinated with my doctor immediately. They may have saved my vision."',
      'testimonials.r4.name': 'Robert Patel',
      'testimonials.r4.service': 'Diabetic Eye Screening',
      'testimonials.r5.text': '"Quick, professional, and no unnecessary upselling. Got my annual exam done in under an hour and the new prescription is perfect. Will definitely be back."',
      'testimonials.r5.name': 'Emily Watson',
      'testimonials.r5.service': 'Comprehensive Exam',
      'testimonials.r6.text': '"The whole family comes here now—from my 10-year-old to my 75-year-old mother. They handle all our different needs with the same level of care and expertise."',
      'testimonials.r6.name': 'David Martinez',
      'testimonials.r6.service': 'Family Eye Care',

      // FAQ
      'faq.label': 'FAQ',
      'faq.title': 'Frequently Asked Questions',
      'faq.subtitle': 'Everything you need to know about our eye care services. Can\'t find what you\'re looking for? Give us a call.',
      'faq.cta': 'Call (555) 203-7811',
      'faq.q1.question': 'Do I need an exam to get contact lenses?',
      'faq.q1.answer': 'Yes—contact lenses require a current contact lens exam and fitting. This ensures proper fit, comfort, and eye health. The exam includes measuring your cornea, evaluating tear film quality, and determining the best lens type for your lifestyle. Call (555) 203-7811 and we\'ll guide you through the process.',
      'faq.q2.question': 'I have dry, burning, or gritty eyes—what should I do?',
      'faq.q2.answer': 'Dry eye symptoms vary by person and can have multiple causes including screen time, medications, environmental factors, or underlying conditions. We recommend a comprehensive dry eye evaluation so we can understand what\'s driving your specific symptoms and create a personalized treatment plan. Options may include prescription drops, lifestyle changes, or in-office treatments.',
      'faq.q3.question': 'Do you see children? At what age should kids get their first eye exam?',
      'faq.q3.answer': 'Yes! We offer pediatric eye exams with age-appropriate testing techniques. The American Optometric Association recommends children have their first comprehensive eye exam at 6 months, again at age 3, and before starting school. Regular exams help catch vision problems early—important since 80% of learning is visual. Call us to schedule an appointment for your child.',
      'faq.q4.question': 'Is this an emergency? When should I seek urgent care?',
      'faq.q4.answer': 'Seek immediate care for: sudden vision loss or changes, eye injuries or chemical exposure, severe eye pain, sudden onset of flashes, floaters, or a "curtain" over your vision, or red eye with pain and vision changes. Call us immediately at (555) 203-7811. If symptoms are severe and you can\'t reach us, go to the nearest emergency room. For non-urgent concerns, schedule a regular appointment.',
      'faq.q5.question': 'How much does an eye exam cost? Do you accept insurance?',
      'faq.q5.answer': 'Exam costs depend on the type of exam and your specific needs. We accept most major vision insurance plans and can verify your benefits before your appointment. For patients without insurance, we offer competitive self-pay rates and can discuss payment options. Call (555) 203-7811 for a personalized estimate based on your needs and insurance coverage.',
      'faq.q6.question': 'How often should I get an eye exam?',
      'faq.q6.answer': 'For healthy adults ages 18-64, we recommend a comprehensive eye exam every 1-2 years. Adults 65+ should have annual exams due to higher risk of age-related conditions. If you have diabetes, high blood pressure, a family history of eye disease, or wear contacts, more frequent exams may be recommended. Children should be examined annually during school years.',

      // Contact
      'contact.label': 'Get in Touch',
      'contact.title': 'Contact & location',
      'contact.subtitle': 'Call us for appointments, or request a call back below.',
      'contact.form.title': 'Request a call back',
      'contact.form.notice': 'By submitting, you agree to our <a href="privacy.html">Privacy Policy</a>.',
      'contact.form.name': 'Your name',
      'contact.form.namePlaceholder': 'Jordan Rivera',
      'contact.form.phone': 'Phone number',
      'contact.form.email': 'Email (optional)',
      'contact.form.reason': 'What do you need help with?',
      'contact.form.selectOne': 'Select one',
      'contact.form.opt1': 'Comprehensive eye exam',
      'contact.form.opt2': 'Contact lens exam & fitting',
      'contact.form.opt3': 'Dry eye evaluation',
      'contact.form.opt4': 'Pediatric eye exam',
      'contact.form.opt5': 'Diabetic eye screening',
      'contact.form.opt6': 'General question',
      'contact.form.notes': 'Notes (optional)',
      'contact.form.notesPlaceholder': 'Any additional context...',
      'contact.form.submit': 'Submit Request',
      'contact.info.title': 'Visit us',
      'contact.info.address': 'Address',
      'contact.info.addressValue': '2147 Willow Park Blvd, Suite 210<br/>Mesa Ridge, CA 91740',
      'contact.info.hours': 'Hours',
      'contact.info.hoursValue': 'Mon–Fri: 9am – 6pm<br/>Saturday: 9am – 2pm<br/>Sunday: Closed',
      'contact.info.phone': 'Phone',
      'contact.info.email': 'Email',
      'contact.info.map': 'Map embed area',

      // Urgent
      'urgent.title': 'Urgent symptoms?',
      'urgent.desc': 'Sudden vision changes, injury, severe pain, or flashes/floaters—call immediately or seek emergency care.',
      'urgent.cta': 'Call Now',

      // Footer
      'footer.services': 'Services',
      'footer.contact': 'Contact',
      'footer.privacy': 'Privacy',
      'footer.home': 'Home',

      // Privacy Page
      'privacy.label': 'Legal',
      'privacy.title': 'Privacy Policy',
      'privacy.intro': 'This is a placeholder privacy policy for demonstration purposes. Replace with your official policy and compliance language before publishing.',
      'privacy.collect.title': 'What we collect',
      'privacy.collect.desc': 'We may collect contact information you choose to provide (such as name, phone number, and email) when you request an appointment or information.',
      'privacy.use.title': 'How we use information',
      'privacy.use.desc': 'We use your information to respond to requests, provide customer service, and coordinate scheduling via phone or email.',
      'privacy.medical.title': 'Medical information',
      'privacy.medical.desc': 'Do not submit sensitive medical information through website forms. If you have urgent symptoms, call our office or seek emergency care.',
      'privacy.contact.title': 'Contact',
      'privacy.contact.desc': 'Questions about privacy? Email us at <a href="mailto:hello@clearviewvision.example">hello@clearviewvision.example</a>',
      'privacy.back': 'Back to home',

      // Toast messages
      'toast.missingName': 'Please enter your name so we can follow up.',
      'toast.missingNameTitle': 'Missing info',
      'toast.checkPhone': 'Please enter a valid phone number (at least 10 digits).',
      'toast.checkPhoneTitle': 'Check phone number',
      'toast.checkEmail': 'Please enter a valid email address (or leave it blank).',
      'toast.checkEmailTitle': 'Check email',
      'toast.selectReason': 'Please select what you\'d like help with.',
      'toast.selectReasonTitle': 'Tell us what you need',
      'toast.successTitle': 'Request received',
      'toast.successMsg': 'Thanks! For scheduling, please call (555) 203-7811. If urgent symptoms are present, seek immediate care.'
    },
    es: {
      // Navigation
      'nav.services': 'Servicios',
      'nav.why': 'Nosotros',
      'nav.faq': 'FAQ',
      'nav.contact': 'Contacto',
      'nav.demo': 'Demo',
      'nav.call': 'Llamar (555) 203-7811',

      // Hero
      'hero.kicker': 'Cuidado visual moderno en Mesa Ridge',
      'hero.title': 'Exámenes de la vista, lentes de contacto y tratamiento de ojo seco, sin complicaciones.',
      'hero.subtitle': 'Desde exámenes completos hasta adaptación de lentes de contacto y visitas pediátricas, ClearView te ayuda a ver con comodidad y confianza.',
      'hero.cta1': 'Llamar para agendar',
      'hero.cta2': 'Solicitar una llamada',
      'hero.locationLabel': 'Ubicación',
      'hero.locationValue': '2147 Willow Park Blvd, Suite 210',
      'hero.hoursLabel': 'Horario',
      'hero.hoursValue': 'Lun–Vie 9–6 · Sáb 9–2',
      'hero.imgAlt': 'Optometrista brindando cuidado visual',

      // Services
      'services.label': 'Nuestros Servicios',
      'services.title': 'Atención diseñada para tus necesidades visuales',
      'services.subtitle': 'Exámenes de alta precisión, recomendaciones prácticas y seguimiento sin complicaciones.',
      'services.exam.title': 'Exámenes Completos',
      'services.exam.desc': 'Chequeos de rutina, actualización de recetas y revisiones para adultos y adultos mayores.',
      'services.contacts.title': 'Lentes de Contacto',
      'services.contacts.desc': 'Adaptación de lentes diarios, mensuales, tóricos y multifocales con pruebas de comodidad.',
      'services.dryeye.title': 'Tratamiento de Ojo Seco',
      'services.dryeye.desc': 'Evaluación y opciones de tratamiento en consultorio para ojos con ardor, irritación o lagrimeo.',
      'services.pediatric.title': 'Exámenes Pediátricos',
      'services.pediatric.desc': 'Pruebas apropiadas para niños, abordando problemas de enfoque, dolor de cabeza y entrecerrar los ojos.',
      'services.diabetic.title': 'Revisiones para Diabéticos',
      'services.diabetic.desc': 'Apoyo en revisiones no urgentes y orientación para referencias cuando sea necesario.',
      'services.glasses.title': 'Asesoría en Lentes',
      'services.glasses.desc': 'Recomendaciones prácticas de armazones y lentes según tu estilo de vida.',

      // Why ClearView
      'why.label': 'Por qué ClearView',
      'why.title': 'Claridad, comodidad y comunicación',
      'why.intro': 'Priorizamos explicaciones claras, atención enfocada en tu comodidad y visitas eficientes que respetan tu tiempo.',
      'why.item1': 'Explicaciones claras de lo que revisamos y por qué',
      'why.item2': 'Enfoque en comodidad para lentes de contacto y ojo seco',
      'why.item3': 'Visitas eficientes con registro simplificado',
      'why.item4': 'Recomendaciones alineadas con tus actividades diarias',
      'why.imgAlt': 'Pareja feliz con visión clara',

      // Family
      'family.label': 'Atención Familiar',
      'family.title': 'Cuidado visual para todas las edades',
      'family.desc': 'Desde el primer examen de la vista de tu hijo hasta la atención para adultos mayores, ClearView ofrece servicios completos de visión para toda tu familia.',
      'family.pediatric.title': 'Pediátrico',
      'family.pediatric.desc': 'Exámenes de visión escolar',
      'family.adults.title': 'Adultos',
      'family.adults.desc': 'Exámenes y lentes de contacto',
      'family.seniors.title': 'Adultos mayores',
      'family.seniors.desc': 'Revisiones relacionadas con la edad',
      'family.cta': 'Agendar visita familiar',
      'family.imgAlt': 'Familia disfrutando de una visión clara',

      // Testimonials
      'testimonials.label': 'Reseñas de Pacientes',
      'testimonials.title': 'Lo que dicen nuestros pacientes',
      'testimonials.subtitle': 'Experiencias reales de pacientes que confían en ClearView para el cuidado de su visión.',
      'testimonials.cta': 'Únete a Nuestros Pacientes Felices',
      'testimonials.r1.text': '"La Dra. Chen se tomó el tiempo de explicarme cada paso de mi examen. Mis nuevos lentes de contacto son más cómodos que cualquiera que haya usado antes. ¡Muy recomendado!"',
      'testimonials.r1.name': 'María Rodríguez',
      'testimonials.r1.service': 'Adaptación de Lentes de Contacto',
      'testimonials.r2.text': '"¡Por fin encontré alivio para mis ojos secos! El equipo fue minucioso y atento. Tres meses después del tratamiento y puedo trabajar en la computadora sin molestias constantes."',
      'testimonials.r2.name': 'Jaime Thompson',
      'testimonials.r2.service': 'Tratamiento de Ojo Seco',
      'testimonials.r3.text': '"Traje a mi hija de 7 años para su primer examen de la vista. El personal fue muy paciente y la hizo sentir cómoda. ¡Ahora está emocionada de usar sus nuevos lentes en la escuela!"',
      'testimonials.r3.name': 'Sara Lin',
      'testimonials.r3.service': 'Examen Ocular Pediátrico',
      'testimonials.r4.text': '"Como diabético, los exámenes regulares de la vista son cruciales. ClearView detectó signos tempranos de retinopatía y coordinó con mi médico de inmediato. Quizás salvaron mi visión."',
      'testimonials.r4.name': 'Roberto Patel',
      'testimonials.r4.service': 'Revisión Ocular para Diabéticos',
      'testimonials.r5.text': '"Rápido, profesional y sin ventas innecesarias. Completé mi examen anual en menos de una hora y la nueva receta es perfecta. Definitivamente volveré."',
      'testimonials.r5.name': 'Emily Watson',
      'testimonials.r5.service': 'Examen Completo',
      'testimonials.r6.text': '"Toda la familia viene aquí ahora, desde mi hijo de 10 años hasta mi madre de 75. Manejan todas nuestras diferentes necesidades con el mismo nivel de cuidado y experiencia."',
      'testimonials.r6.name': 'David Martínez',
      'testimonials.r6.service': 'Cuidado Visual Familiar',

      // FAQ
      'faq.label': 'Preguntas Frecuentes',
      'faq.title': 'Preguntas Frecuentes',
      'faq.subtitle': 'Todo lo que necesitas saber sobre nuestros servicios de cuidado visual. ¿No encuentras lo que buscas? Llámanos.',
      'faq.cta': 'Llamar (555) 203-7811',
      'faq.q1.question': '¿Necesito un examen para obtener lentes de contacto?',
      'faq.q1.answer': 'Sí, los lentes de contacto requieren un examen y adaptación actualizada. Esto garantiza un ajuste adecuado, comodidad y salud ocular. El examen incluye medir tu córnea, evaluar la calidad de la película lagrimal y determinar el mejor tipo de lente para tu estilo de vida. Llama al (555) 203-7811 y te guiaremos en el proceso.',
      'faq.q2.question': 'Tengo ojos secos, con ardor o irritación, ¿qué debo hacer?',
      'faq.q2.answer': 'Los síntomas de ojo seco varían según la persona y pueden tener múltiples causas, incluyendo tiempo de pantalla, medicamentos, factores ambientales o condiciones subyacentes. Recomendamos una evaluación completa de ojo seco para entender qué está causando tus síntomas específicos y crear un plan de tratamiento personalizado. Las opciones pueden incluir gotas recetadas, cambios de estilo de vida o tratamientos en consultorio.',
      'faq.q3.question': '¿Atienden niños? ¿A qué edad deben tener su primer examen?',
      'faq.q3.answer': '¡Sí! Ofrecemos exámenes oculares pediátricos con técnicas de prueba apropiadas para cada edad. La Asociación Americana de Optometría recomienda que los niños tengan su primer examen completo a los 6 meses, nuevamente a los 3 años y antes de comenzar la escuela. Los exámenes regulares ayudan a detectar problemas de visión temprano, importante ya que el 80% del aprendizaje es visual. Llámanos para programar una cita para tu hijo.',
      'faq.q4.question': '¿Es esto una emergencia? ¿Cuándo debo buscar atención urgente?',
      'faq.q4.answer': 'Busca atención inmediata para: pérdida o cambios repentinos de visión, lesiones oculares o exposición química, dolor ocular severo, aparición repentina de destellos, moscas volantes o una "cortina" sobre tu visión, u ojo rojo con dolor y cambios de visión. Llámanos inmediatamente al (555) 203-7811. Si los síntomas son graves y no puedes contactarnos, ve a la sala de emergencias más cercana. Para preocupaciones no urgentes, programa una cita regular.',
      'faq.q5.question': '¿Cuánto cuesta un examen de la vista? ¿Aceptan seguro?',
      'faq.q5.answer': 'Los costos del examen dependen del tipo de examen y tus necesidades específicas. Aceptamos la mayoría de los planes de seguro de visión y podemos verificar tus beneficios antes de tu cita. Para pacientes sin seguro, ofrecemos tarifas competitivas de pago directo y podemos discutir opciones de pago. Llama al (555) 203-7811 para un presupuesto personalizado basado en tus necesidades y cobertura de seguro.',
      'faq.q6.question': '¿Con qué frecuencia debo hacerme un examen de la vista?',
      'faq.q6.answer': 'Para adultos saludables de 18-64 años, recomendamos un examen completo de la vista cada 1-2 años. Los adultos de 65+ deben tener exámenes anuales debido al mayor riesgo de condiciones relacionadas con la edad. Si tienes diabetes, presión arterial alta, historial familiar de enfermedades oculares o usas lentes de contacto, pueden recomendarse exámenes más frecuentes. Los niños deben ser examinados anualmente durante los años escolares.',

      // Contact
      'contact.label': 'Contáctanos',
      'contact.title': 'Contacto y ubicación',
      'contact.subtitle': 'Llámanos para citas o solicita una llamada de regreso a continuación.',
      'contact.form.title': 'Solicitar una llamada',
      'contact.form.notice': 'Al enviar, aceptas nuestra <a href="privacy.html">Política de Privacidad</a>.',
      'contact.form.name': 'Tu nombre',
      'contact.form.namePlaceholder': 'María García',
      'contact.form.phone': 'Número de teléfono',
      'contact.form.email': 'Correo electrónico (opcional)',
      'contact.form.reason': '¿En qué podemos ayudarte?',
      'contact.form.selectOne': 'Selecciona una opción',
      'contact.form.opt1': 'Examen de la vista completo',
      'contact.form.opt2': 'Examen y adaptación de lentes de contacto',
      'contact.form.opt3': 'Evaluación de ojo seco',
      'contact.form.opt4': 'Examen ocular pediátrico',
      'contact.form.opt5': 'Revisión ocular para diabéticos',
      'contact.form.opt6': 'Pregunta general',
      'contact.form.notes': 'Notas (opcional)',
      'contact.form.notesPlaceholder': 'Cualquier contexto adicional...',
      'contact.form.submit': 'Enviar solicitud',
      'contact.info.title': 'Visítanos',
      'contact.info.address': 'Dirección',
      'contact.info.addressValue': '2147 Willow Park Blvd, Suite 210<br/>Mesa Ridge, CA 91740',
      'contact.info.hours': 'Horario',
      'contact.info.hoursValue': 'Lun–Vie: 9am – 6pm<br/>Sábado: 9am – 2pm<br/>Domingo: Cerrado',
      'contact.info.phone': 'Teléfono',
      'contact.info.email': 'Correo electrónico',
      'contact.info.map': 'Área del mapa',

      // Urgent
      'urgent.title': '¿Síntomas urgentes?',
      'urgent.desc': 'Cambios repentinos de visión, lesiones, dolor severo o destellos/moscas volantes—llama inmediatamente o busca atención de emergencia.',
      'urgent.cta': 'Llamar ahora',

      // Footer
      'footer.services': 'Servicios',
      'footer.contact': 'Contacto',
      'footer.privacy': 'Privacidad',
      'footer.home': 'Inicio',

      // Privacy Page
      'privacy.label': 'Legal',
      'privacy.title': 'Política de Privacidad',
      'privacy.intro': 'Esta es una política de privacidad de ejemplo para fines de demostración. Reemplázala con tu política oficial y lenguaje de cumplimiento antes de publicar.',
      'privacy.collect.title': 'Qué recopilamos',
      'privacy.collect.desc': 'Podemos recopilar información de contacto que elijas proporcionar (como nombre, número de teléfono y correo electrónico) cuando solicites una cita o información.',
      'privacy.use.title': 'Cómo usamos la información',
      'privacy.use.desc': 'Usamos tu información para responder a solicitudes, brindar servicio al cliente y coordinar citas por teléfono o correo electrónico.',
      'privacy.medical.title': 'Información médica',
      'privacy.medical.desc': 'No envíes información médica sensible a través de formularios del sitio web. Si tienes síntomas urgentes, llama a nuestra oficina o busca atención de emergencia.',
      'privacy.contact.title': 'Contacto',
      'privacy.contact.desc': '¿Preguntas sobre privacidad? Escríbenos a <a href="mailto:hello@clearviewvision.example">hello@clearviewvision.example</a>',
      'privacy.back': 'Volver al inicio',

      // Toast messages
      'toast.missingName': 'Por favor ingresa tu nombre para que podamos contactarte.',
      'toast.missingNameTitle': 'Información faltante',
      'toast.checkPhone': 'Por favor ingresa un número de teléfono válido (al menos 10 dígitos).',
      'toast.checkPhoneTitle': 'Verificar teléfono',
      'toast.checkEmail': 'Por favor ingresa una dirección de correo válida (o déjalo en blanco).',
      'toast.checkEmailTitle': 'Verificar correo',
      'toast.selectReason': 'Por favor selecciona en qué te podemos ayudar.',
      'toast.selectReasonTitle': 'Cuéntanos qué necesitas',
      'toast.successTitle': 'Solicitud recibida',
      'toast.successMsg': '¡Gracias! Para agendar, llama al (555) 203-7811. Si tienes síntomas urgentes, busca atención inmediata.'
    }
  };

  // ============================================
  // LANGUAGE TOGGLE FUNCTIONALITY
  // ============================================
  function getCurrentLang() {
    return localStorage.getItem('clearview_lang') || 'en';
  }

  function setLang(lang) {
    localStorage.setItem('clearview_lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    applyTranslations(lang);
    updateLangLabels(lang);
  }

  function applyTranslations(lang) {
    const t = translations[lang] || translations.en;

    // Translate text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) {
        el.setAttribute('placeholder', t[key]);
      }
    });

    // Translate alt attributes
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (t[key]) {
        el.setAttribute('alt', t[key]);
      }
    });
  }

  function updateLangLabels(currentLang) {
    // Update all language toggle buttons to show the opposite language
    const nextLang = currentLang === 'en' ? 'ES' : 'EN';
    document.querySelectorAll('[data-lang-label]').forEach(el => {
      el.textContent = nextLang;
    });
  }

  function toggleLang() {
    const currentLang = getCurrentLang();
    const newLang = currentLang === 'en' ? 'es' : 'en';
    setLang(newLang);
  }

  // Initialize language on page load
  function initLanguage() {
    const savedLang = getCurrentLang();
    setLang(savedLang);

    // Add click handlers to all language toggle buttons
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.addEventListener('click', toggleLang);
    });
  }

  // Initialize language
  initLanguage();

  // ============================================
  // EXISTING FUNCTIONALITY
  // ============================================

  // Year in footer
  const yearElements = document.querySelectorAll('[data-year]');
  yearElements.forEach(el => el.textContent = String(new Date().getFullYear()));

  // Mobile menu
  const burger = document.querySelector('[data-burger]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('show');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('show');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // Toast notifications
  const toast = document.querySelector('[data-toast]');
  const toastClose = document.querySelector('[data-toast-close]');
  let toastTimeout;

  function showToast(title, msg) {
    if (!toast) return;
    
    clearTimeout(toastTimeout);
    toast.querySelector('[data-toast-title]').textContent = title;
    toast.querySelector('[data-toast-msg]').textContent = msg;
    toast.classList.add('show');
    
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 6500);
  }

  if (toastClose && toast) {
    toastClose.addEventListener('click', () => {
      clearTimeout(toastTimeout);
      toast.classList.remove('show');
    });
  }

  // Form handling
  const form = document.querySelector('[data-lead-form]');
  const phoneDigits = (v) => (v || '').replace(/\D/g, '');
  const isEmailLike = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);

  // Helper to get translated string
  function t(key) {
    const lang = getCurrentLang();
    return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const phone = phoneDigits(String(data.get('phone') || ''));
      const email = String(data.get('email') || '').trim();
      const reason = String(data.get('reason') || '').trim();

      if (!name) return showToast(t('toast.missingNameTitle'), t('toast.missingName'));
      if (phone.length < 10) return showToast(t('toast.checkPhoneTitle'), t('toast.checkPhone'));
      if (!isEmailLike(email)) return showToast(t('toast.checkEmailTitle'), t('toast.checkEmail'));
      if (!reason) return showToast(t('toast.selectReasonTitle'), t('toast.selectReason'));

      // Store locally for demo purposes
      const payload = { name, phone, email, reason, createdAt: new Date().toISOString() };
      try {
        localStorage.setItem('clearview_lead_last', JSON.stringify(payload));
      } catch (_) {}

      form.reset();
      showToast(t('toast.successTitle'), t('toast.successMsg'));
    });
  }

  // Header scroll effect
  const header = document.querySelector('.header');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        header.style.boxShadow = '0 4px 20px rgba(11, 18, 32, 0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('[data-faq]');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const btn = otherItem.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        
        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
})();
