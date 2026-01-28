(function(){
  // =====================
  // Language Translations
  // =====================
  const translations = {
    en: {
      // Topbar
      'topbar.call': 'Call:',
      'topbar.hours': 'Mon–Fri: 9:00 AM – 6:30 PM',
      
      // Navigation
      'nav.home': 'Home',
      'nav.practice': 'Practice Areas',
      'nav.contact': 'Contact',
      'nav.demos': 'Back to Demos',
      'nav.cta': 'Request a Consultation',
      'nav.menu': 'Menu',
      
      // Homepage Hero
      'hero.kicker': 'Riverton, New York',
      'hero.title': 'Clear next steps when things feel complicated.',
      'hero.lead': 'We offer a calm, structured intake process and explain options in plain language—so you can make confident decisions about your personal injury, immigration, or family law matter.',
      'hero.cta.consultation': 'Request a Consultation',
      'hero.cta.practice': 'Explore Practice Areas',
      'hero.badge.years': '30+ Years',
      'hero.badge.exp': 'Combined Experience',
      'hero.trust.confidential': 'Confidential Consultations',
      'hero.trust.clear': 'Clear Communication',
      'hero.trust.responsive': 'Responsive Service',
      
      // Practice Areas Section
      'practice.title': 'Practice Areas',
      'practice.subtitle': 'Focused services with a consistent, step-by-step intake process.',
      
      // Personal Injury
      'injury.title': 'Personal Injury',
      'injury.desc': 'Intake support for accidents and injuries—then we guide you through next steps and documentation.',
      'injury.item1': 'Auto accidents',
      'injury.item2': 'Slip & fall',
      'injury.item3': 'Pedestrian injuries',
      'injury.item4': 'Dog bites',
      'injury.link': 'Learn more →',
      
      // Immigration
      'immigration.title': 'Immigration',
      'immigration.desc': 'Process-oriented help for petitions, work permits, green card pathways, and citizenship filings.',
      'immigration.item1': 'Family petitions',
      'immigration.item2': 'Work authorization (EAD)',
      'immigration.item3': 'Adjustment of status',
      'immigration.item4': 'Citizenship',
      'immigration.link': 'Learn more →',
      
      // Family Law
      'family.title': 'Family Law',
      'family.desc': 'Support for divorce, custody, and support matters—focused on clarity, respect, and documentation.',
      'family.item1': 'Divorce & separation',
      'family.item2': 'Custody & visitation',
      'family.item3': 'Child & spousal support',
      'family.item4': 'Order modifications',
      'family.link': 'Learn more →',
      
      // Feature Section
      'feature.kicker': 'Our Approach',
      'feature.title': 'Helping families navigate life\'s transitions',
      'feature.desc': 'Whether you\'re dealing with an unexpected injury, immigration paperwork, or a family matter, we believe you deserve clear answers and respectful treatment.',
      'feature.clarity': 'Clarity',
      'feature.clarity.desc': 'We explain steps and documents in straightforward terms.',
      'feature.structure': 'Structure',
      'feature.structure.desc': 'Key dates and deadlines are identified early.',
      'feature.respect': 'Respect',
      'feature.respect.desc': 'We treat each matter with professionalism and care.',
      'feature.privacy': 'Privacy-minded',
      'feature.privacy.desc': 'We avoid collecting sensitive details over chat or forms.',
      
      // Process Section
      'process.title': 'How We Work Together',
      'process.subtitle': 'We keep it structured and simple—so you know what happens next.',
      'process.step1.title': 'Quick Intake',
      'process.step1.desc': 'We gather matter type, urgency level, and key dates to understand your situation.',
      'process.step2.title': 'Conflicts Check',
      'process.step2.desc': 'We confirm we can speak with you about the matter before proceeding.',
      'process.step3.title': 'Consultation',
      'process.step3.desc': 'We review documents and discuss your options in clear, plain language.',
      'process.step4.title': 'Representation',
      'process.step4.desc': 'Begins only after conflicts clearance and a signed engagement agreement.',
      
      // Urgent Section
      'urgent.title': 'When to Call Immediately',
      'urgent.desc': 'Some situations should not wait for an email response.',
      'urgent.safety': 'Safety risk:',
      'urgent.safety.desc': 'threats, violence, or immediate danger → call 911',
      'urgent.deadline': 'Urgent deadlines:',
      'urgent.deadline.desc': 'hearing dates, court filings, or detentions',
      'urgent.medical': 'Injury emergencies:',
      'urgent.medical.desc': 'severe symptoms → seek medical care first',
      'urgent.call': 'Call (555) 508-4402',
      'urgent.nonurgent': 'Send a non-urgent request',
      
      // CTA Section
      'cta.title': 'Ready to take the next step?',
      'cta.desc': 'Request a consultation and we\'ll help you understand your options.',
      
      // Footer
      'footer.tagline': 'Clear guidance. Strong advocacy. Respectful communication. We handle <strong>Personal Injury</strong>, <strong>Immigration</strong>, and <strong>Family Law</strong> matters.',
      'footer.disclaimer': '<strong>Disclaimer:</strong> This website provides general information and does not provide legal advice. No attorney–client relationship is formed by using this site or contacting us until a signed engagement agreement is in place.',
      'footer.office': 'Office',
      'footer.links': 'Links',
      'footer.privacy': 'Privacy Policy',
      'footer.copyright': '© 2026 Calder & Rowe Legal Services. All rights reserved.',
      
      // Contact Page
      'contact.breadcrumb': 'Home',
      'contact.title': 'Request a Consultation',
      'contact.lead': 'Please keep messages short and non-confidential. For urgent deadlines, call (555) 508-4402.',
      'contact.details': 'Contact Details',
      'contact.phone': 'Phone:',
      'contact.email': 'Email:',
      'contact.address': 'Address:',
      'contact.hours': 'Office Hours',
      'contact.hours.mon': 'Mon–Thu: 9:00 AM – 6:30 PM',
      'contact.hours.fri': 'Fri: 9:00 AM – 5:00 PM',
      'contact.hours.sat': 'Sat: By appointment',
      'contact.hours.sun': 'Sun: Closed',
      'contact.form.disclaimer': '<strong>Disclaimer:</strong> No legal advice is provided via this form. No attorney–client relationship is formed by submitting it.',
      'contact.form.title': 'Quick Intake Form',
      'contact.form.privacy': '<strong>Privacy notice:</strong> Do not include confidential details. For full discussion, please schedule a consultation by phone.',
      'contact.form.name': 'Name',
      'contact.form.phone': 'Phone',
      'contact.form.phone.helper': '10+ digits required.',
      'contact.form.email': 'Email (optional)',
      'contact.form.matter': 'Matter type',
      'contact.form.matter.select': 'Select…',
      'contact.form.matter.injury': 'Personal Injury',
      'contact.form.matter.immigration': 'Immigration',
      'contact.form.matter.family': 'Family Law',
      'contact.form.urgency': 'Urgency',
      'contact.form.urgency.select': 'Select…',
      'contact.form.urgency.urgent': 'Urgent deadline (next 7 days)',
      'contact.form.urgency.sensitive': 'Time-sensitive (next 30 days)',
      'contact.form.urgency.general': 'General inquiry',
      'contact.form.message': 'Short message',
      'contact.form.message.placeholder': 'Briefly describe what you need (no confidential details).',
      'contact.form.consent': 'Before we proceed, please note that by providing your information, you agree to our Privacy Policy in accordance with regulations.',
      'contact.form.consent.link': 'View Privacy Policy',
      'contact.form.submit': 'Send (opens email)',
      
      // Practice Areas Page
      'practice.breadcrumb': 'Home',
      'practice.page.title': 'Practice Areas',
      'practice.page.lead': 'Focused services with a consistent, step-by-step intake process.',
      
      'injury.full.desc': 'We help with intake and case evaluation for common injury claims, including auto accidents and premises injuries.',
      'injury.matters': 'Common matters',
      'injury.matters.item1': 'Car, rideshare, and pedestrian accidents',
      'injury.matters.item2': 'Slip & fall and unsafe property conditions',
      'injury.matters.item3': 'Dog bites',
      'injury.matters.item4': 'Work-related injuries (intake and referral as appropriate)',
      'injury.prepare': 'What to prepare',
      'injury.prepare.item1': 'Incident date, location, and a short summary',
      'injury.prepare.item2': 'Photos (if available) and insurance claim info',
      'injury.prepare.item3': 'Medical visit dates (no detailed medical history needed in chat)',
      'injury.prepare.item4': 'Any upcoming deadlines you\'re aware of',
      'injury.note': '<strong>Note:</strong> We cannot estimate case value or give fault analysis in chat. Please call (555) 508-4402 for a consultation.',
      
      'immigration.full.desc': 'We provide process-focused guidance for common immigration pathways and help clients prepare for next steps.',
      'immigration.matters': 'Common matters',
      'immigration.matters.item1': 'Family petitions',
      'immigration.matters.item2': 'Work authorization (EAD)',
      'immigration.matters.item3': 'Adjustment of status (green card pathways)',
      'immigration.matters.item4': 'Naturalization / citizenship',
      'immigration.prepare': 'What to prepare',
      'immigration.prepare.item1': 'Goal (petition, EAD, adjustment, citizenship)',
      'immigration.prepare.item2': 'Key dates and any notices (RFE, interview, biometrics)',
      'immigration.prepare.item3': 'General timeline (no sensitive ID numbers via chat)',
      'immigration.prepare.item4': 'Urgency: hearings, detentions, imminent deadlines',
      'immigration.note': '<strong>Important:</strong> Do not share passport numbers, SSNs, or A-numbers via chat. For urgent matters, call (555) 508-4402.',
      
      'family.full.desc': 'We support clients with divorce, custody, and support matters with an emphasis on respectful communication and documentation.',
      'family.matters': 'Common matters',
      'family.matters.item1': 'Divorce and separation',
      'family.matters.item2': 'Custody and visitation',
      'family.matters.item3': 'Child support and spousal support',
      'family.matters.item4': 'Modifications to existing orders',
      'family.prepare': 'What to prepare',
      'family.prepare.item1': 'County/state where the matter is filed (or will be filed)',
      'family.prepare.item2': 'Any existing orders and upcoming court dates',
      'family.prepare.item3': 'Whether children are involved',
      'family.prepare.item4': 'Any immediate safety concerns (call 911 if danger)',
      'family.note': '<strong>Safety:</strong> If there is an immediate danger or threats of violence, call 911.',
      
      'practice.cta.title': 'Ready to take the next step?',
      'practice.cta.desc': 'We\'ll start with a brief intake to route you correctly and confirm any urgent deadlines.',
      
      // Privacy Page
      'privacy.breadcrumb': 'Home',
      'privacy.title': 'Privacy Policy',
      'privacy.lead': 'Our commitment to protecting your information.',
      'privacy.summary': 'Summary',
      'privacy.summary.desc': 'We collect limited contact information so we can respond to requests and route inquiries appropriately.',
      'privacy.summary.required': '<strong>Required:</strong> Name and phone number for follow-up.',
      'privacy.summary.optional': '<strong>Optional:</strong> Email address.',
      'privacy.summary.donotsub': '<strong>Do not submit:</strong> confidential or privileged details through forms.',
      'privacy.collect': 'Information We May Collect',
      'privacy.collect.item1': 'Contact details (name, phone, email if provided)',
      'privacy.collect.item2': 'Matter category (Personal Injury, Immigration, or Family Law)',
      'privacy.collect.item3': 'General urgency (e.g., upcoming deadline)',
      'privacy.use': 'How We Use Information',
      'privacy.use.item1': 'To respond to your inquiry',
      'privacy.use.item2': 'To route your request to the appropriate team member',
      'privacy.use.item3': 'To schedule a consultation by phone or email',
      'privacy.confidentiality': 'Confidentiality and Attorney–Client Relationship',
      'privacy.confidentiality.desc': 'Website communications and form submissions are <strong>not</strong> a substitute for a consultation. No attorney–client relationship is formed until conflicts are cleared and an engagement agreement is signed.',
      'privacy.contact': 'Contact',
      'privacy.contact.desc': 'Questions about this policy? Contact us at',
      'privacy.contact.or': 'or call',
      'privacy.note': '<strong>Note:</strong> This policy should be reviewed with legal counsel and updated to comply with applicable jurisdiction requirements before deployment.',
      
      // Form validation messages
      'validation.name': 'Please enter your name.',
      'validation.phone': 'Please enter a valid phone number (at least 10 digits).',
      'validation.email': 'Please enter a valid email address, or leave it blank.',
      'validation.matter': 'Please select a matter type.',
      'validation.message': 'Please add a short message (no confidential details).',
      'validation.consent': 'Before we proceed, please confirm you agree to our Privacy Policy:',
      'validation.success': 'Thanks—your email draft is ready. If it doesn\'t open, please call the office phone number shown on this page.',
      'email.subject': 'New intake inquiry —'
    },
    es: {
      // Topbar
      'topbar.call': 'Llamar:',
      'topbar.hours': 'Lun–Vie: 9:00 AM – 6:30 PM',
      
      // Navigation
      'nav.home': 'Inicio',
      'nav.practice': 'Áreas de Práctica',
      'nav.contact': 'Contacto',
      'nav.demos': 'Volver a Demos',
      'nav.cta': 'Solicitar Consulta',
      'nav.menu': 'Menú',
      
      // Homepage Hero
      'hero.kicker': 'Riverton, Nueva York',
      'hero.title': 'Pasos claros cuando las cosas se sienten complicadas.',
      'hero.lead': 'Ofrecemos un proceso de admisión tranquilo y estructurado y explicamos las opciones en lenguaje sencillo, para que pueda tomar decisiones con confianza sobre su caso de lesiones personales, inmigración o derecho familiar.',
      'hero.cta.consultation': 'Solicitar Consulta',
      'hero.cta.practice': 'Explorar Áreas de Práctica',
      'hero.badge.years': '30+ Años',
      'hero.badge.exp': 'Experiencia Combinada',
      'hero.trust.confidential': 'Consultas Confidenciales',
      'hero.trust.clear': 'Comunicación Clara',
      'hero.trust.responsive': 'Servicio Responsivo',
      
      // Practice Areas Section
      'practice.title': 'Áreas de Práctica',
      'practice.subtitle': 'Servicios enfocados con un proceso de admisión consistente, paso a paso.',
      
      // Personal Injury
      'injury.title': 'Lesiones Personales',
      'injury.desc': 'Apoyo de admisión para accidentes y lesiones—luego lo guiamos a través de los próximos pasos y documentación.',
      'injury.item1': 'Accidentes de auto',
      'injury.item2': 'Resbalones y caídas',
      'injury.item3': 'Lesiones de peatones',
      'injury.item4': 'Mordeduras de perro',
      'injury.link': 'Más información →',
      
      // Immigration
      'immigration.title': 'Inmigración',
      'immigration.desc': 'Ayuda orientada al proceso para peticiones, permisos de trabajo, vías de residencia permanente y solicitudes de ciudadanía.',
      'immigration.item1': 'Peticiones familiares',
      'immigration.item2': 'Autorización de trabajo (EAD)',
      'immigration.item3': 'Ajuste de estatus',
      'immigration.item4': 'Ciudadanía',
      'immigration.link': 'Más información →',
      
      // Family Law
      'family.title': 'Derecho Familiar',
      'family.desc': 'Apoyo para divorcio, custodia y asuntos de manutención—enfocados en claridad, respeto y documentación.',
      'family.item1': 'Divorcio y separación',
      'family.item2': 'Custodia y visitación',
      'family.item3': 'Manutención infantil y conyugal',
      'family.item4': 'Modificaciones de órdenes',
      'family.link': 'Más información →',
      
      // Feature Section
      'feature.kicker': 'Nuestro Enfoque',
      'feature.title': 'Ayudando a las familias a navegar las transiciones de la vida',
      'feature.desc': 'Ya sea que esté lidiando con una lesión inesperada, trámites de inmigración o un asunto familiar, creemos que merece respuestas claras y un trato respetuoso.',
      'feature.clarity': 'Claridad',
      'feature.clarity.desc': 'Explicamos los pasos y documentos en términos sencillos.',
      'feature.structure': 'Estructura',
      'feature.structure.desc': 'Las fechas clave y los plazos se identifican temprano.',
      'feature.respect': 'Respeto',
      'feature.respect.desc': 'Tratamos cada caso con profesionalismo y cuidado.',
      'feature.privacy': 'Privacidad',
      'feature.privacy.desc': 'Evitamos recopilar detalles sensibles por chat o formularios.',
      
      // Process Section
      'process.title': 'Cómo Trabajamos Juntos',
      'process.subtitle': 'Lo mantenemos estructurado y simple—para que sepa qué sigue.',
      'process.step1.title': 'Admisión Rápida',
      'process.step1.desc': 'Recopilamos tipo de caso, nivel de urgencia y fechas clave para entender su situación.',
      'process.step2.title': 'Verificación de Conflictos',
      'process.step2.desc': 'Confirmamos que podemos hablar con usted sobre el asunto antes de proceder.',
      'process.step3.title': 'Consulta',
      'process.step3.desc': 'Revisamos documentos y discutimos sus opciones en lenguaje claro y sencillo.',
      'process.step4.title': 'Representación',
      'process.step4.desc': 'Comienza solo después de la verificación de conflictos y un acuerdo de compromiso firmado.',
      
      // Urgent Section
      'urgent.title': 'Cuándo Llamar Inmediatamente',
      'urgent.desc': 'Algunas situaciones no deben esperar una respuesta por correo electrónico.',
      'urgent.safety': 'Riesgo de seguridad:',
      'urgent.safety.desc': 'amenazas, violencia o peligro inmediato → llame al 911',
      'urgent.deadline': 'Plazos urgentes:',
      'urgent.deadline.desc': 'fechas de audiencia, presentaciones judiciales o detenciones',
      'urgent.medical': 'Emergencias de lesiones:',
      'urgent.medical.desc': 'síntomas severos → busque atención médica primero',
      'urgent.call': 'Llamar (555) 508-4402',
      'urgent.nonurgent': 'Enviar solicitud no urgente',
      
      // CTA Section
      'cta.title': '¿Listo para dar el siguiente paso?',
      'cta.desc': 'Solicite una consulta y le ayudaremos a entender sus opciones.',
      
      // Footer
      'footer.tagline': 'Orientación clara. Defensa fuerte. Comunicación respetuosa. Manejamos casos de <strong>Lesiones Personales</strong>, <strong>Inmigración</strong> y <strong>Derecho Familiar</strong>.',
      'footer.disclaimer': '<strong>Aviso legal:</strong> Este sitio web proporciona información general y no brinda asesoramiento legal. No se forma ninguna relación abogado-cliente al usar este sitio o contactarnos hasta que se firme un acuerdo de compromiso.',
      'footer.office': 'Oficina',
      'footer.links': 'Enlaces',
      'footer.privacy': 'Política de Privacidad',
      'footer.copyright': '© 2026 Calder & Rowe Legal Services. Todos los derechos reservados.',
      
      // Contact Page
      'contact.breadcrumb': 'Inicio',
      'contact.title': 'Solicitar una Consulta',
      'contact.lead': 'Por favor mantenga los mensajes breves y no confidenciales. Para plazos urgentes, llame al (555) 508-4402.',
      'contact.details': 'Datos de Contacto',
      'contact.phone': 'Teléfono:',
      'contact.email': 'Correo:',
      'contact.address': 'Dirección:',
      'contact.hours': 'Horario de Oficina',
      'contact.hours.mon': 'Lun–Jue: 9:00 AM – 6:30 PM',
      'contact.hours.fri': 'Vie: 9:00 AM – 5:00 PM',
      'contact.hours.sat': 'Sáb: Con cita previa',
      'contact.hours.sun': 'Dom: Cerrado',
      'contact.form.disclaimer': '<strong>Aviso:</strong> No se proporciona asesoramiento legal a través de este formulario. No se forma ninguna relación abogado-cliente al enviarlo.',
      'contact.form.title': 'Formulario de Admisión Rápida',
      'contact.form.privacy': '<strong>Aviso de privacidad:</strong> No incluya detalles confidenciales. Para una discusión completa, por favor programe una consulta por teléfono.',
      'contact.form.name': 'Nombre',
      'contact.form.phone': 'Teléfono',
      'contact.form.phone.helper': 'Se requieren más de 10 dígitos.',
      'contact.form.email': 'Correo electrónico (opcional)',
      'contact.form.matter': 'Tipo de caso',
      'contact.form.matter.select': 'Seleccionar…',
      'contact.form.matter.injury': 'Lesiones Personales',
      'contact.form.matter.immigration': 'Inmigración',
      'contact.form.matter.family': 'Derecho Familiar',
      'contact.form.urgency': 'Urgencia',
      'contact.form.urgency.select': 'Seleccionar…',
      'contact.form.urgency.urgent': 'Plazo urgente (próximos 7 días)',
      'contact.form.urgency.sensitive': 'Sensible al tiempo (próximos 30 días)',
      'contact.form.urgency.general': 'Consulta general',
      'contact.form.message': 'Mensaje breve',
      'contact.form.message.placeholder': 'Describa brevemente lo que necesita (sin detalles confidenciales).',
      'contact.form.consent': 'Antes de continuar, tenga en cuenta que al proporcionar su información, acepta nuestra Política de Privacidad de acuerdo con las regulaciones.',
      'contact.form.consent.link': 'Ver Política de Privacidad',
      'contact.form.submit': 'Enviar (abre correo)',
      
      // Practice Areas Page
      'practice.breadcrumb': 'Inicio',
      'practice.page.title': 'Áreas de Práctica',
      'practice.page.lead': 'Servicios enfocados con un proceso de admisión consistente, paso a paso.',
      
      'injury.full.desc': 'Ayudamos con la admisión y evaluación de casos para reclamos comunes de lesiones, incluyendo accidentes de auto y lesiones en propiedades.',
      'injury.matters': 'Casos comunes',
      'injury.matters.item1': 'Accidentes de auto, viaje compartido y peatones',
      'injury.matters.item2': 'Resbalones, caídas y condiciones inseguras de propiedad',
      'injury.matters.item3': 'Mordeduras de perro',
      'injury.matters.item4': 'Lesiones relacionadas con el trabajo (admisión y referencia según corresponda)',
      'injury.prepare': 'Qué preparar',
      'injury.prepare.item1': 'Fecha del incidente, ubicación y un breve resumen',
      'injury.prepare.item2': 'Fotos (si están disponibles) e información del reclamo de seguro',
      'injury.prepare.item3': 'Fechas de visitas médicas (no se necesita historial médico detallado en chat)',
      'injury.prepare.item4': 'Cualquier plazo próximo del que esté enterado',
      'injury.note': '<strong>Nota:</strong> No podemos estimar el valor del caso ni dar análisis de culpa por chat. Por favor llame al (555) 508-4402 para una consulta.',
      
      'immigration.full.desc': 'Proporcionamos orientación enfocada en el proceso para vías de inmigración comunes y ayudamos a los clientes a prepararse para los próximos pasos.',
      'immigration.matters': 'Casos comunes',
      'immigration.matters.item1': 'Peticiones familiares',
      'immigration.matters.item2': 'Autorización de trabajo (EAD)',
      'immigration.matters.item3': 'Ajuste de estatus (vías de residencia permanente)',
      'immigration.matters.item4': 'Naturalización / ciudadanía',
      'immigration.prepare': 'Qué preparar',
      'immigration.prepare.item1': 'Objetivo (petición, EAD, ajuste, ciudadanía)',
      'immigration.prepare.item2': 'Fechas clave y cualquier notificación (RFE, entrevista, biométricos)',
      'immigration.prepare.item3': 'Cronología general (sin números de identificación sensibles por chat)',
      'immigration.prepare.item4': 'Urgencia: audiencias, detenciones, plazos inminentes',
      'immigration.note': '<strong>Importante:</strong> No comparta números de pasaporte, SSN o números A por chat. Para asuntos urgentes, llame al (555) 508-4402.',
      
      'family.full.desc': 'Apoyamos a los clientes con divorcio, custodia y asuntos de manutención con énfasis en comunicación respetuosa y documentación.',
      'family.matters': 'Casos comunes',
      'family.matters.item1': 'Divorcio y separación',
      'family.matters.item2': 'Custodia y visitación',
      'family.matters.item3': 'Manutención infantil y conyugal',
      'family.matters.item4': 'Modificaciones a órdenes existentes',
      'family.prepare': 'Qué preparar',
      'family.prepare.item1': 'Condado/estado donde se presenta el caso (o se presentará)',
      'family.prepare.item2': 'Cualquier orden existente y fechas de corte próximas',
      'family.prepare.item3': 'Si hay niños involucrados',
      'family.prepare.item4': 'Cualquier preocupación de seguridad inmediata (llame al 911 si hay peligro)',
      'family.note': '<strong>Seguridad:</strong> Si hay peligro inmediato o amenazas de violencia, llame al 911.',
      
      'practice.cta.title': '¿Listo para dar el siguiente paso?',
      'practice.cta.desc': 'Comenzaremos con una breve admisión para dirigirlo correctamente y confirmar cualquier plazo urgente.',
      
      // Privacy Page
      'privacy.breadcrumb': 'Inicio',
      'privacy.title': 'Política de Privacidad',
      'privacy.lead': 'Nuestro compromiso de proteger su información.',
      'privacy.summary': 'Resumen',
      'privacy.summary.desc': 'Recopilamos información de contacto limitada para poder responder a las solicitudes y dirigir las consultas apropiadamente.',
      'privacy.summary.required': '<strong>Requerido:</strong> Nombre y número de teléfono para seguimiento.',
      'privacy.summary.optional': '<strong>Opcional:</strong> Dirección de correo electrónico.',
      'privacy.summary.donotsub': '<strong>No envíe:</strong> detalles confidenciales o privilegiados a través de formularios.',
      'privacy.collect': 'Información Que Podemos Recopilar',
      'privacy.collect.item1': 'Datos de contacto (nombre, teléfono, correo si se proporciona)',
      'privacy.collect.item2': 'Categoría del caso (Lesiones Personales, Inmigración o Derecho Familiar)',
      'privacy.collect.item3': 'Urgencia general (ej., plazo próximo)',
      'privacy.use': 'Cómo Usamos la Información',
      'privacy.use.item1': 'Para responder a su consulta',
      'privacy.use.item2': 'Para dirigir su solicitud al miembro del equipo apropiado',
      'privacy.use.item3': 'Para programar una consulta por teléfono o correo electrónico',
      'privacy.confidentiality': 'Confidencialidad y Relación Abogado-Cliente',
      'privacy.confidentiality.desc': 'Las comunicaciones del sitio web y los envíos de formularios <strong>no</strong> son un sustituto de una consulta. No se forma ninguna relación abogado-cliente hasta que se aclaren los conflictos y se firme un acuerdo de compromiso.',
      'privacy.contact': 'Contacto',
      'privacy.contact.desc': '¿Preguntas sobre esta política? Contáctenos en',
      'privacy.contact.or': 'o llame al',
      'privacy.note': '<strong>Nota:</strong> Esta política debe ser revisada con un asesor legal y actualizada para cumplir con los requisitos jurisdiccionales aplicables antes de su implementación.',
      
      // Form validation messages
      'validation.name': 'Por favor ingrese su nombre.',
      'validation.phone': 'Por favor ingrese un número de teléfono válido (al menos 10 dígitos).',
      'validation.email': 'Por favor ingrese una dirección de correo válida, o déjela en blanco.',
      'validation.matter': 'Por favor seleccione un tipo de caso.',
      'validation.message': 'Por favor agregue un mensaje breve (sin detalles confidenciales).',
      'validation.consent': 'Antes de continuar, por favor confirme que acepta nuestra Política de Privacidad:',
      'validation.success': 'Gracias—su borrador de correo está listo. Si no se abre, por favor llame al número de oficina mostrado en esta página.',
      'email.subject': 'Nueva consulta de admisión —'
    }
  };

  // =====================
  // Language Switcher
  // =====================
  let currentLang = localStorage.getItem('cr-lang') || 'en';

  function t(key) {
    return translations[currentLang][key] || translations['en'][key] || key;
  }

  function updateContent() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = t(key);
      if (translation) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.hasAttribute('placeholder')) {
            el.placeholder = translation;
          }
        } else {
          el.innerHTML = translation;
        }
      }
    });

    // Update elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });

    // Update the html lang attribute
    document.documentElement.lang = currentLang;

    // Update toggle button text
    const langBtn = document.querySelector('.lang-toggle');
    if (langBtn) {
      langBtn.innerHTML = currentLang === 'en' 
        ? '<span class="lang-icon">ES</span> Español' 
        : '<span class="lang-icon">EN</span> English';
      langBtn.setAttribute('aria-label', currentLang === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés');
    }
  }

  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    localStorage.setItem('cr-lang', currentLang);
    updateContent();
  }

  // Initialize language toggle
  const langToggle = document.querySelector('.lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
  }

  // Apply saved language on page load
  document.addEventListener('DOMContentLoaded', updateContent);
  // Also run immediately in case DOM is already loaded
  if (document.readyState !== 'loading') {
    updateContent();
  }

  // =====================
  // Mobile Menu
  // =====================
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.menu-btn');
  if(btn && nav){
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('mobile-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  // =====================
  // Contact Form
  // =====================
  const form = document.querySelector('[data-contact-form]');
  if(form){
    const status = document.querySelector('[data-form-status]');
    const privacyUrl = form.getAttribute('data-privacy-url') || '#';

    const digitsOnly = (s) => (s || '').replace(/\D/g, '');

    const validate = () => {
      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const matter = form.querySelector('[name="matter"]').value;
      const message = form.querySelector('[name="message"]').value.trim();

      if(!name) return t('validation.name');
      if(digitsOnly(phone).length < 10) return t('validation.phone');
      if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return t('validation.email');
      if(!matter) return t('validation.matter');
      if(!message) return t('validation.message');
      return null;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = validate();
      if(err){
        status.className = 'alert warn';
        status.textContent = err;
        status.hidden = false;
        return;
      }

      // Privacy consent reminder
      const consent = form.querySelector('[name="consent"]').checked;
      if(!consent){
        status.className = 'alert warn';
        status.innerHTML = t('validation.consent') + ' ' + privacyUrl;
        status.hidden = false;
        return;
      }

      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const matter = form.querySelector('[name="matter"]').value;
      const urgency = form.querySelector('[name="urgency"]').value;
      const message = form.querySelector('[name="message"]').value.trim();

      const subject = encodeURIComponent(`${t('email.subject')} ${matter}`);
      const body = encodeURIComponent(
`Name: ${name}
Phone: ${phone}
Email: ${email || '(not provided)'}
Matter: ${matter}
Urgency: ${urgency || '(not selected)'}

Message (please avoid confidential details in email as well):
${message}

— Sent from website intake form`
      );

      const to = form.getAttribute('data-intake-email');
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

      status.className = 'alert success';
      status.textContent = t('validation.success');
      status.hidden = false;
      form.reset();
    });
  }
})();
