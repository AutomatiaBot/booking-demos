(function(){
  // Mobile menu toggle
  const hamb = document.querySelector('[data-hamburger]');
  const panel = document.querySelector('[data-mobile-panel]');
  if(hamb && panel){
    hamb.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      hamb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Active nav highlighting
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('a[data-nav]').forEach(a=>{
    const href = (a.getAttribute('href') || '').toLowerCase();
    if(href === path) a.classList.add('active');
  });

  // Contact form -> mailto fallback
  const form = document.querySelector('[data-contact-form]');
  const toast = document.querySelector('[data-toast]');
  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 4200);
  }

  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name')||'').toString().trim();
      const phone = (fd.get('phone')||'').toString().trim();
      const email = (fd.get('email')||'').toString().trim();
      const topic = (fd.get('topic')||'').toString();
      const message = (fd.get('message')||'').toString().trim();

      const lang = document.documentElement.lang || 'en';
      const errorMsg = lang === 'es' 
        ? 'Por favor ingrese su nombre y teléfono.'
        : 'Please enter your name and phone so our team can reach you.';
      const phoneErrorMsg = lang === 'es'
        ? 'Por favor confirme su número de teléfono (al menos 10 dígitos).'
        : 'Please confirm your phone number (at least 10 digits).';

      if(!name || !phone){
        showToast(errorMsg);
        return;
      }
      const digits = phone.replace(/\D/g,'');
      if(digits.length < 10){
        showToast(phoneErrorMsg);
        return;
      }

      const subject = encodeURIComponent('New website inquiry — ' + topic);
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}\n\n— Sent from PeakPoint website`
      );

      const mailto = form.getAttribute('data-mailto');
      if(mailto){
        window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;
        const successMsg = lang === 'es'
          ? 'Abriendo su aplicación de correo.'
          : 'Opening your email app to send your request.';
        showToast(successMsg);
      } else {
        const fallbackMsg = lang === 'es'
          ? 'Gracias. Por favor llame a la clínica para programar.'
          : 'Thanks—your info is ready. Please call the clinic to schedule.';
        showToast(fallbackMsg);
      }
      form.reset();
    });
  }

  // ===================
  // TRANSLATIONS SYSTEM
  // ===================
  const translations = {
    // Navigation
    'nav.home': { en: 'Home', es: 'Inicio' },
    'nav.services': { en: 'Services', es: 'Servicios' },
    'nav.conditions': { en: 'Conditions', es: 'Condiciones' },
    'nav.patients': { en: 'Patients', es: 'Pacientes' },
    'nav.schedule': { en: 'Schedule Now', es: 'Agendar' },
    'nav.call': { en: 'Call (555) 907-1148', es: 'Llamar (555) 907-1148' },
    
    // Topbar
    'topbar.hours': { en: 'Hours', es: 'Horario' },
    'topbar.hours.value': { en: 'Mon–Fri 8:30 AM – 5:30 PM', es: 'Lun–Vie 8:30 AM – 5:30 PM' },
    'topbar.call': { en: 'Call Now', es: 'Llamar' },
    
    // Brand
    'brand.tagline': { en: 'Sports Medicine', es: 'Medicina Deportiva' },
    
    // Hero - Index
    'hero.kicker': { en: 'Orthopedics & Sports Medicine', es: 'Ortopedia y Medicina Deportiva' },
    'hero.title': { en: 'Get Back to Moving. Get Back to Living.', es: 'Vuelve a Moverte. Vuelve a Vivir.' },
    'hero.lead': { en: 'Expert orthopedic and sports medicine care designed to help you recover faster and stay active. From acute injuries to chronic conditions, we provide personalized evaluation and clear next steps.', es: 'Atención ortopédica y de medicina deportiva experta diseñada para ayudarte a recuperarte más rápido. Desde lesiones agudas hasta condiciones crónicas, ofrecemos evaluación personalizada.' },
    'hero.cta.call': { en: 'Call (555) 907-1148', es: 'Llamar (555) 907-1148' },
    'hero.cta.services': { en: 'Our Services', es: 'Servicios' },
    'hero.cta.patients': { en: 'New Patient Info', es: 'Info Pacientes' },
    'hero.badge.years': { en: '20+ Years', es: '20+ Años' },
    'hero.badge.experience': { en: 'Trusted Experience', es: 'Experiencia Confiable' },
    
    // Stats
    'stats.patients': { en: 'Patients Treated', es: 'Pacientes Atendidos' },
    'stats.satisfaction': { en: 'Patient Satisfaction', es: 'Satisfacción' },
    'stats.sameday': { en: 'Same Day', es: 'Mismo Día' },
    'stats.appointments': { en: 'Appointments Available', es: 'Citas Disponibles' },
    'stats.teams': { en: 'Sports Teams Served', es: 'Equipos Deportivos' },
    
    // Services Section
    'services.overline': { en: 'What We Treat', es: 'Qué Tratamos' },
    'services.title': { en: 'Expert Orthopedic Care for Every Need', es: 'Atención Ortopédica Experta' },
    'services.subtitle': { en: 'From sports injuries to chronic joint pain, our team provides comprehensive evaluation and personalized treatment plans.', es: 'Desde lesiones deportivas hasta dolor articular crónico, nuestro equipo ofrece evaluación integral y planes de tratamiento personalizados.' },
    'services.joint.title': { en: 'Joint Pain & Arthritis', es: 'Dolor Articular y Artritis' },
    'services.joint.desc': { en: 'Comprehensive evaluation and treatment options including activity modification, therapy, bracing, and injection consults.', es: 'Evaluación integral y opciones de tratamiento incluyendo modificación de actividad, terapia, férulas y consultas de inyecciones.' },
    'services.sports.title': { en: 'Sports Injuries', es: 'Lesiones Deportivas' },
    'services.sports.desc': { en: 'Specialized care for sprains, strains, tendon injuries, instability, and overuse conditions in athletes of all levels.', es: 'Atención especializada para esguinces, distensiones, lesiones de tendones e inestabilidad en atletas de todos los niveles.' },
    'services.spine.title': { en: 'Neck & Back Issues', es: 'Cuello y Espalda' },
    'services.spine.desc': { en: 'Expert evaluation for spinal conditions with urgent escalation guidance for red-flag symptoms requiring immediate care.', es: 'Evaluación experta para condiciones espinales con guía de escalación urgente para síntomas de alerta.' },
    'services.imaging.title': { en: 'Imaging Coordination', es: 'Coordinación de Imágenes' },
    'services.imaging.desc': { en: 'Guidance on how to send prior X-rays and MRIs, plus coordination for any additional imaging needed for diagnosis.', es: 'Guía sobre cómo enviar radiografías y resonancias previas, más coordinación para imágenes adicionales.' },
    'services.injection.title': { en: 'Injection Consults', es: 'Consultas de Inyección' },
    'services.injection.desc': { en: 'Information and scheduling support for therapeutic injections—specific options determined after your evaluation.', es: 'Información y apoyo para programar inyecciones terapéuticas—opciones específicas determinadas después de su evaluación.' },
    'services.surgical.title': { en: 'Surgical Consults', es: 'Consultas Quirúrgicas' },
    'services.surgical.desc': { en: 'When surgery may be needed, we coordinate next steps for arthroscopy or joint replacement consultations.', es: 'Cuando se necesita cirugía, coordinamos los próximos pasos para consultas de artroscopia o reemplazo articular.' },
    'services.viewall': { en: 'View All Services', es: 'Ver Todos los Servicios' },
    
    // Sports Medicine Section
    'sports.overline': { en: 'Sports Medicine', es: 'Medicina Deportiva' },
    'sports.title': { en: 'Get Athletes Back in the Game', es: 'Devolvemos a los Atletas al Juego' },
    'sports.desc': { en: 'Whether you\'re a weekend warrior or competitive athlete, our sports medicine team specializes in treating and preventing athletic injuries. We work with athletes at all levels to optimize performance and recovery.', es: 'Ya sea un atleta recreativo o competitivo, nuestro equipo de medicina deportiva se especializa en tratar y prevenir lesiones atléticas.' },
    'sports.acl': { en: 'ACL & Ligament Injuries', es: 'Lesiones de LCA y Ligamentos' },
    'sports.acl.desc': { en: 'Comprehensive rehab and surgical consults', es: 'Rehabilitación integral y consultas quirúrgicas' },
    'sports.rotator': { en: 'Rotator Cuff Issues', es: 'Problemas del Manguito Rotador' },
    'sports.rotator.desc': { en: 'Shoulder pain and instability treatment', es: 'Tratamiento de dolor e inestabilidad del hombro' },
    'sports.concussion': { en: 'Concussion Care', es: 'Atención de Conmociones' },
    'sports.concussion.desc': { en: 'Return-to-play protocols and monitoring', es: 'Protocolos de regreso al juego y monitoreo' },
    'sports.overuse': { en: 'Overuse Injuries', es: 'Lesiones por Sobreuso' },
    'sports.overuse.desc': { en: 'Tendinitis, stress fractures, and more', es: 'Tendinitis, fracturas por estrés y más' },
    'sports.conditions.cta': { en: 'See All Conditions We Treat', es: 'Ver Condiciones que Tratamos' },
    'sports.card.title': { en: 'Personalized Treatment Plans', es: 'Planes de Tratamiento Personalizados' },
    'sports.card.desc': { en: 'Every athlete is different. We create customized recovery plans based on your sport, goals, and timeline.', es: 'Cada atleta es diferente. Creamos planes de recuperación personalizados según su deporte, metas y cronograma.' },
    'sports.banner.title': { en: 'Trusted by Local Athletes & Teams', es: 'Confianza de Atletas y Equipos Locales' },
    'sports.banner.desc': { en: 'From high school athletics to recreational leagues, we\'re proud to support our community\'s athletes with expert sports medicine care.', es: 'Desde atletismo escolar hasta ligas recreativas, apoyamos a los atletas de nuestra comunidad con atención experta.' },
    
    // Reviews Section
    'reviews.overline': { en: 'Patient Reviews', es: 'Reseñas de Pacientes' },
    'reviews.title': { en: 'What Our Patients Say', es: 'Lo que Dicen Nuestros Pacientes' },
    'reviews.subtitle': { en: 'Don\'t just take our word for it. Here\'s what patients have to say about their experience with PeakPoint Orthopedics.', es: 'No solo confíe en nuestra palabra. Esto es lo que dicen los pacientes sobre su experiencia con PeakPoint.' },
    
    // FAQ Section
    'faq.overline': { en: 'FAQ', es: 'Preguntas Frecuentes' },
    'faq.title': { en: 'Frequently Asked Questions', es: 'Preguntas Frecuentes' },
    'faq.subtitle': { en: 'Get answers to common questions about our services, appointments, and what to expect during your visit.', es: 'Obtenga respuestas a preguntas comunes sobre nuestros servicios, citas y qué esperar durante su visita.' },
    'faq.contact.cta': { en: 'Still Have Questions? Contact Us', es: '¿Más Preguntas? Contáctenos' },
    
    // CTA Section
    'cta.title': { en: 'Ready to Get Moving Again?', es: '¿Listo para Volver a Moverte?' },
    'cta.subtitle': { en: 'Don\'t let pain hold you back. Our expert team is ready to help you recover and return to the activities you love.', es: 'No dejes que el dolor te detenga. Nuestro equipo experto está listo para ayudarte a recuperarte.' },
    'cta.call': { en: 'Call (555) 907-1148', es: 'Llamar (555) 907-1148' },
    'cta.message': { en: 'Send a Message', es: 'Enviar Mensaje' },
    
    // Footer
    'footer.desc': { en: 'Expert orthopedic and sports medicine care designed to keep you moving. We provide personalized evaluation and treatment for joint pain, sports injuries, and musculoskeletal conditions.', es: 'Atención ortopédica y de medicina deportiva experta diseñada para mantenerte en movimiento. Ofrecemos evaluación personalizada para dolor articular y lesiones.' },
    'footer.address': { en: 'Address:', es: 'Dirección:' },
    'footer.phone': { en: 'Phone:', es: 'Teléfono:' },
    'footer.email': { en: 'Email:', es: 'Correo:' },
    'footer.quicklinks': { en: 'Quick Links', es: 'Enlaces Rápidos' },
    'footer.services': { en: 'Our Services', es: 'Nuestros Servicios' },
    'footer.conditions': { en: 'Conditions We Treat', es: 'Condiciones que Tratamos' },
    'footer.patients': { en: 'New Patient Info', es: 'Info para Pacientes' },
    'footer.contact': { en: 'Contact Us', es: 'Contáctenos' },
    'footer.privacy': { en: 'Privacy Policy', es: 'Política de Privacidad' },
    'footer.copyright': { en: '© 2026 PeakPoint Orthopedics & Sports Medicine. All rights reserved.', es: '© 2026 PeakPoint Orthopedics & Sports Medicine. Todos los derechos reservados.' },
    'footer.demo': { en: 'This is a demo website. All information is fictional.', es: 'Este es un sitio de demostración. Toda la información es ficticia.' },
    
    // Services Page
    'services.page.kicker': { en: 'Our Services', es: 'Nuestros Servicios' },
    'services.page.title': { en: 'Comprehensive Orthopedic Care', es: 'Atención Ortopédica Integral' },
    'services.page.lead': { en: 'From initial evaluation to recovery, we provide complete orthopedic and sports medicine services. Our team focuses on accurate diagnosis, personalized treatment plans, and getting you back to your active life.', es: 'Desde la evaluación inicial hasta la recuperación, ofrecemos servicios completos de ortopedia y medicina deportiva.' },
    'services.page.overline': { en: 'What We Offer', es: 'Lo Que Ofrecemos' },
    'services.page.title2': { en: 'Expert Orthopedic Services', es: 'Servicios Ortopédicos Expertos' },
    'services.page.subtitle': { en: 'Our comprehensive services cover everything from initial evaluation to surgical consultations, ensuring you receive the right care at every stage.', es: 'Nuestros servicios integrales cubren desde la evaluación inicial hasta consultas quirúrgicas.' },
    'services.ortho.title': { en: 'Orthopedic Evaluations', es: 'Evaluaciones Ortopédicas' },
    'services.ortho.desc': { en: 'Comprehensive assessment for joint pain, mobility limits, and injury concerns across all major body regions including knee, shoulder, hip, spine, and extremities.', es: 'Evaluación integral para dolor articular, limitaciones de movilidad y lesiones en todas las regiones principales del cuerpo.' },
    'services.sportsmed.title': { en: 'Sports Medicine', es: 'Medicina Deportiva' },
    'services.sportsmed.desc': { en: 'Specialized care for acute injuries and overuse conditions in athletes and active adults. We understand the demands of sports and work to optimize your recovery timeline.', es: 'Atención especializada para lesiones agudas y condiciones por sobreuso en atletas y adultos activos.' },
    'services.rehab.title': { en: 'Rehab Coordination', es: 'Coordinación de Rehabilitación' },
    'services.rehab.desc': { en: 'Physical therapy referrals, return-to-activity planning, and follow-up coordination to ensure your recovery stays on track with trusted therapy partners.', es: 'Referencias de fisioterapia, planificación de regreso a actividades y coordinación de seguimiento.' },
    'services.injection2.desc': { en: 'General information and scheduling for clinic-offered injections based on your evaluation, including corticosteroid, hyaluronic acid, and other therapeutic options.', es: 'Información general y programación de inyecciones clínicas incluyendo corticosteroides, ácido hialurónico y otras opciones.' },
    'services.imaging2.desc': { en: 'Expert guidance for X-ray and MRI studies, plus help coordinating how to send prior imaging for review before your appointment.', es: 'Guía experta para estudios de rayos X y resonancia magnética, más ayuda para enviar imágenes previas.' },
    'services.surgical2.desc': { en: 'When indicated, we coordinate consultation pathways for arthroscopy, joint replacement, and other orthopedic surgical procedures.', es: 'Cuando está indicado, coordinamos consultas para artroscopia, reemplazo articular y otros procedimientos quirúrgicos.' },
    'services.excellence.overline': { en: 'Specialized Care', es: 'Atención Especializada' },
    'services.excellence.title': { en: 'Sports Medicine Excellence', es: 'Excelencia en Medicina Deportiva' },
    'services.excellence.desc': { en: 'Our sports medicine team specializes in treating athletic injuries and helping athletes return to peak performance. We understand the unique demands of different sports and tailor our approach accordingly.', es: 'Nuestro equipo de medicina deportiva se especializa en tratar lesiones atléticas y ayudar a los atletas a volver a su máximo rendimiento.' },
    'services.acute': { en: 'Acute Injury Care', es: 'Atención de Lesiones Agudas' },
    'services.acute.desc': { en: 'Sprains, strains, and fractures', es: 'Esguinces, distensiones y fracturas' },
    'services.overuse2': { en: 'Overuse Injuries', es: 'Lesiones por Sobreuso' },
    'services.overuse2.desc': { en: 'Tendinitis, stress reactions', es: 'Tendinitis, reacciones por estrés' },
    'services.concussion2': { en: 'Concussion Protocol', es: 'Protocolo de Conmoción' },
    'services.concussion2.desc': { en: 'Evaluation and return-to-play', es: 'Evaluación y regreso al juego' },
    'services.performance': { en: 'Performance Recovery', es: 'Recuperación de Rendimiento' },
    'services.performance.desc': { en: 'Optimize your return to sport', es: 'Optimice su regreso al deporte' },
    'services.conditions.cta': { en: 'View Conditions We Treat', es: 'Ver Condiciones que Tratamos' },
    'services.athletes.title': { en: 'Serving Athletes of All Levels', es: 'Atendemos Atletas de Todos los Niveles' },
    'services.athletes.desc': { en: 'From weekend warriors to competitive athletes, we provide personalized care that understands your goals and timeline.', es: 'Desde atletas recreativos hasta competitivos, ofrecemos atención personalizada.' },
    'services.prepare.overline': { en: 'Prepare for Your Visit', es: 'Prepárese para su Visita' },
    'services.prepare.title': { en: 'What to Bring & Expect', es: 'Qué Traer y Esperar' },
    'services.prepare.subtitle': { en: 'Being prepared helps us make the most of your appointment time and ensures accurate diagnosis.', es: 'Estar preparado nos ayuda a aprovechar al máximo su cita y asegura un diagnóstico preciso.' },
    'services.bring.title': { en: 'What to Bring', es: 'Qué Traer' },
    'services.bring.id': { en: 'Photo ID', es: 'Identificación con Foto' },
    'services.bring.insurance': { en: 'and insurance card (if applicable)', es: 'y tarjeta de seguro (si aplica)' },
    'services.bring.meds': { en: 'Medication list', es: 'Lista de Medicamentos' },
    'services.bring.meds.desc': { en: 'including dosages and any allergies', es: 'incluyendo dosis y alergias' },
    'services.bring.imaging': { en: 'Prior imaging', es: 'Imágenes Previas' },
    'services.bring.imaging.desc': { en: 'reports or discs (X-ray, MRI, CT)', es: 'informes o discos (Rayos X, MRI, CT)' },
    'services.bring.referral': { en: 'Referral paperwork', es: 'Documentos de Referencia' },
    'services.bring.referral.desc': { en: 'if required by your insurance', es: 'si lo requiere su seguro' },
    'services.bring.timeline': { en: 'Brief timeline', es: 'Cronología Breve' },
    'services.bring.timeline.desc': { en: 'of your symptoms and what you\'ve tried', es: 'de sus síntomas y lo que ha intentado' },
    'services.bring.note': { en: 'Want to send records ahead of time? Email', es: '¿Quiere enviar registros con anticipación? Envíe correo a' },
    'services.bring.note2': { en: 'and call to confirm receipt.', es: 'y llame para confirmar recibo.' },
    'services.pricing.title': { en: 'Pricing & Insurance', es: 'Precios y Seguro' },
    'services.pricing.desc': { en: 'We accept most major insurance plans and are committed to transparent pricing. While we don\'t quote specific prices online, our team is happy to:', es: 'Aceptamos la mayoría de los planes de seguro principales y estamos comprometidos con precios transparentes.' },
    'services.pricing.verify': { en: 'Verify your insurance benefits before your visit', es: 'Verificar sus beneficios de seguro antes de su visita' },
    'services.pricing.selfpay': { en: 'Provide cost estimates for self-pay patients', es: 'Proporcionar estimaciones de costos para pacientes sin seguro' },
    'services.pricing.payment': { en: 'Discuss payment plan options if needed', es: 'Discutir opciones de planes de pago si es necesario' },
    'services.pricing.coverage': { en: 'Answer questions about coverage for specific services', es: 'Responder preguntas sobre cobertura para servicios específicos' },
    'services.pricing.note': { en: 'For a personalized estimate, please call', es: 'Para un estimado personalizado, llame al' },
    'services.cta.title': { en: 'Ready to Schedule?', es: '¿Listo para Agendar?' },
    'services.cta.subtitle': { en: 'Our team is here to help. Call us to schedule an appointment or ask any questions about our services.', es: 'Nuestro equipo está aquí para ayudar. Llámenos para programar una cita o hacer preguntas.' },
    'services.conditions.cta': { en: 'View Conditions We Treat', es: 'Ver Condiciones que Tratamos' },
    
    // Conditions Page
    'conditions.overline': { en: 'Conditions', es: 'Condiciones' },
    'conditions.title': { en: 'Conditions We Treat', es: 'Condiciones que Tratamos' },
    'conditions.subtitle': { en: 'Our orthopedic and sports medicine team evaluates and treats a wide range of musculoskeletal conditions. Below are common concerns we help with—this list is not exhaustive.', es: 'Nuestro equipo evalúa y trata una amplia gama de condiciones musculoesqueléticas. A continuación, las condiciones comunes con las que ayudamos.' },
    'conditions.contact.cta': { en: 'Have Questions? Contact Us', es: '¿Preguntas? Contáctenos' },
    'conditions.knee': { en: 'Knee Conditions', es: 'Condiciones de Rodilla' },
    'conditions.shoulder': { en: 'Shoulder Conditions', es: 'Condiciones de Hombro' },
    'conditions.hip': { en: 'Hip Conditions', es: 'Condiciones de Cadera' },
    'conditions.ankle': { en: 'Ankle & Foot Conditions', es: 'Condiciones de Tobillo y Pie' },
    'conditions.hand': { en: 'Hand & Wrist Conditions', es: 'Condiciones de Mano y Muñeca' },
    'conditions.spine': { en: 'Neck & Back Conditions', es: 'Condiciones de Cuello y Espalda' },
    'conditions.sports.overline': { en: 'Sports Medicine', es: 'Medicina Deportiva' },
    'conditions.sports.title': { en: 'Sports-Related Injuries', es: 'Lesiones Deportivas' },
    'conditions.sports.desc': { en: 'Athletes put unique demands on their bodies. Our sports medicine team specializes in treating athletic injuries and optimizing recovery for a safe return to sport.', es: 'Los atletas ponen demandas únicas en sus cuerpos. Nuestro equipo se especializa en tratar lesiones atléticas.' },
    'conditions.sports.all': { en: 'We treat athletes in all sports including basketball, baseball, football, soccer, tennis, running, and more.', es: 'Tratamos atletas en todos los deportes incluyendo baloncesto, béisbol, fútbol americano, fútbol, tenis, running y más.' },
    'conditions.urgent.overline': { en: 'Important', es: 'Importante' },
    'conditions.urgent.title': { en: 'When to Seek Urgent Care', es: 'Cuándo Buscar Atención Urgente' },
    'conditions.urgent.subtitle': { en: 'Certain symptoms require immediate medical attention. If you experience any of the following, seek urgent care or go to the emergency room.', es: 'Ciertos síntomas requieren atención médica inmediata. Si experimenta alguno de los siguientes, busque atención urgente.' },
    'conditions.fracture.title': { en: 'Possible Fracture or Dislocation', es: 'Posible Fractura o Dislocación' },
    'conditions.fracture.desc': { en: 'Visible deformity, bone or joint out of place, or severe pain after trauma. Do not attempt to move or realign the affected area.', es: 'Deformidad visible, hueso o articulación fuera de lugar, o dolor severo después de un trauma.' },
    'conditions.weight.title': { en: 'Can\'t Bear Weight or Use Limb', es: 'No Puede Soportar Peso o Usar Extremidad' },
    'conditions.weight.desc': { en: 'After an injury, complete inability to stand, walk, or use your arm/leg normally may indicate a serious injury requiring immediate evaluation.', es: 'Después de una lesión, la incapacidad de pararse, caminar o usar su brazo/pierna puede indicar una lesión seria.' },
    'conditions.neuro.title': { en: 'Neurologic Red Flags', es: 'Señales Neurológicas de Alerta' },
    'conditions.neuro.desc': { en: 'New or worsening weakness, numbness, tingling, or severe back pain accompanied by bowel or bladder changes.', es: 'Debilidad nueva o empeorando, entumecimiento, hormigueo, o dolor de espalda severo con cambios intestinales.' },
    'conditions.severe': { en: 'If symptoms are severe', es: 'Si los síntomas son severos' },
    'conditions.severe.desc': { en: 'Go to the nearest emergency room or call 911. If your condition is urgent but stable, call our office at', es: 'Vaya a la sala de emergencias más cercana o llame al 911. Si su condición es urgente pero estable, llame a nuestra oficina al' },
    'conditions.severe.desc2': { en: 'as soon as possible for same-day guidance.', es: 'lo antes posible para orientación del mismo día.' },
    'conditions.cta.title': { en: 'Not Sure If We Can Help?', es: '¿No Está Seguro Si Podemos Ayudar?' },
    'conditions.cta.subtitle': { en: 'Call us to discuss your symptoms. Our team can help determine if you need an appointment or if you should seek care elsewhere.', es: 'Llámenos para discutir sus síntomas. Nuestro equipo puede ayudar a determinar si necesita una cita.' },
    
    // Patients Page
    'patients.kicker': { en: 'New Patients', es: 'Nuevos Pacientes' },
    'patients.title': { en: 'Your First Visit', es: 'Su Primera Visita' },
    'patients.lead': { en: 'We want to make your first appointment as smooth as possible. Here\'s everything you need to know about preparing for your visit and what to expect during your evaluation.', es: 'Queremos que su primera cita sea lo más fluida posible. Aquí está todo lo que necesita saber.' },
    'patients.schedule.cta': { en: 'Schedule Now', es: 'Agendar Ahora' },
    'patients.urgent.cta': { en: 'Urgent Symptoms Guide', es: 'Guía de Síntomas Urgentes' },
    'patients.checklist.overline': { en: 'Be Prepared', es: 'Prepárese' },
    'patients.checklist.title': { en: 'New Patient Checklist', es: 'Lista para Pacientes Nuevos' },
    'patients.checklist.subtitle': { en: 'Bring these items to your first appointment to help us provide the best possible care.', es: 'Traiga estos artículos a su primera cita para ayudarnos a brindar la mejor atención.' },
    'patients.required.title': { en: 'Required Items', es: 'Artículos Requeridos' },
    'patients.required.id': { en: 'Photo ID', es: 'Identificación con Foto' },
    'patients.required.id.desc': { en: '– Driver\'s license, passport, or state ID', es: '– Licencia de conducir, pasaporte o ID estatal' },
    'patients.required.insurance': { en: 'Insurance card', es: 'Tarjeta de Seguro' },
    'patients.required.insurance.desc': { en: '– Front and back (if applicable)', es: '– Frente y reverso (si aplica)' },
    'patients.required.forms': { en: 'Completed intake forms', es: 'Formularios de Admisión' },
    'patients.required.forms.desc': { en: '– Download below or arrive 15 min early', es: '– Descargue abajo o llegue 15 min antes' },
    'patients.required.payment': { en: 'Payment method', es: 'Método de Pago' },
    'patients.required.payment.desc': { en: '– For any copays or deductibles', es: '– Para copagos o deducibles' },
    'patients.helpful.title': { en: 'Helpful to Have', es: 'Útil Tener' },
    'patients.helpful.meds': { en: 'Medication list', es: 'Lista de Medicamentos' },
    'patients.helpful.meds.desc': { en: '– Names, dosages, and any allergies', es: '– Nombres, dosis y alergias' },
    'patients.helpful.imaging': { en: 'Prior imaging', es: 'Imágenes Previas' },
    'patients.helpful.imaging.desc': { en: '– X-rays, MRIs, or CT scans (disc or report)', es: '– Rayos X, resonancias o tomografías' },
    'patients.helpful.timeline': { en: 'Symptom timeline', es: 'Cronología de Síntomas' },
    'patients.helpful.timeline.desc': { en: '– When it started, what helps or worsens it', es: '– Cuándo comenzó, qué ayuda o empeora' },
    'patients.helpful.referral': { en: 'Referral paperwork', es: 'Documentos de Referencia' },
    'patients.helpful.referral.desc': { en: '– If required by your insurance', es: '– Si lo requiere su seguro' },
    'patients.records.note': { en: 'Want to send records ahead of time?', es: '¿Quiere enviar registros con anticipación?' },
    'patients.records.note2': { en: 'Email imaging and documents to', es: 'Envíe imágenes y documentos a' },
    'patients.records.note3': { en: 'and call us at', es: 'y llámenos al' },
    'patients.records.note4': { en: 'to confirm we received them. This helps us review your case before your visit.', es: 'para confirmar que los recibimos. Esto nos ayuda a revisar su caso antes de su visita.' },
    'patients.expect.overline': { en: 'Your Appointment', es: 'Su Cita' },
    'patients.expect.title': { en: 'What to Expect', es: 'Qué Esperar' },
    'patients.expect.desc': { en: 'Your first visit typically takes 30-45 minutes. Here\'s what will happen during your evaluation:', es: 'Su primera visita típicamente toma 30-45 minutos. Esto es lo que pasará durante su evaluación:' },
    'patients.expect.step1': { en: 'Medical History Review', es: 'Revisión del Historial Médico' },
    'patients.expect.step1.desc': { en: 'We\'ll discuss your symptoms, when they started, and what you\'ve already tried.', es: 'Discutiremos sus síntomas, cuándo comenzaron y qué ha intentado.' },
    'patients.expect.step2': { en: 'Physical Examination', es: 'Examen Físico' },
    'patients.expect.step2.desc': { en: 'A focused exam to assess your range of motion, strength, and areas of concern.', es: 'Un examen enfocado para evaluar su rango de movimiento, fuerza y áreas de preocupación.' },
    'patients.expect.step3': { en: 'Imaging Review', es: 'Revisión de Imágenes' },
    'patients.expect.step3.desc': { en: 'If you brought prior imaging, we\'ll review it together. We may recommend additional studies.', es: 'Si trajo imágenes previas, las revisaremos juntos. Podemos recomendar estudios adicionales.' },
    'patients.expect.step4': { en: 'Treatment Plan Discussion', es: 'Discusión del Plan de Tratamiento' },
    'patients.expect.step4.desc': { en: 'Clear explanation of your diagnosis and recommended next steps (therapy, injections, follow-up, etc.).', es: 'Explicación clara de su diagnóstico y próximos pasos recomendados.' },
    'patients.expect.note': { en: 'We do not provide diagnosis or medication instructions through the website or over the phone. All treatment decisions happen after an in-person evaluation.', es: 'No proporcionamos diagnósticos ni instrucciones de medicación por el sitio web o teléfono. Todas las decisiones de tratamiento ocurren después de una evaluación en persona.' },
    'patients.card.title': { en: 'Thorough & Personalized', es: 'Minuciosa y Personalizada' },
    'patients.card.desc': { en: 'Every patient receives individualized attention and clear explanations.', es: 'Cada paciente recibe atención individualizada y explicaciones claras.' },
    'patients.insurance.overline': { en: 'Financial Information', es: 'Información Financiera' },
    'patients.insurance.title': { en: 'Insurance & Billing', es: 'Seguro y Facturación' },
    'patients.insurance.subtitle': { en: 'We accept most major insurance plans and are committed to transparent pricing.', es: 'Aceptamos la mayoría de los planes de seguro principales y estamos comprometidos con precios transparentes.' },
    'patients.insurance.verify.title': { en: 'Insurance Verification', es: 'Verificación de Seguro' },
    'patients.insurance.verify.desc': { en: 'Our team can verify your benefits before your appointment so you know what to expect for out-of-pocket costs.', es: 'Nuestro equipo puede verificar sus beneficios antes de su cita para que sepa qué esperar en costos.' },
    'patients.insurance.selfpay.title': { en: 'Self-Pay Options', es: 'Opciones de Pago Directo' },
    'patients.insurance.selfpay.desc': { en: 'For patients without insurance, we offer competitive self-pay rates. Call us for a quote based on your needs.', es: 'Para pacientes sin seguro, ofrecemos tarifas competitivas de pago directo. Llámenos para una cotización.' },
    'patients.insurance.payment.title': { en: 'Payment Plans', es: 'Planes de Pago' },
    'patients.insurance.payment.desc': { en: 'We understand healthcare costs can add up. Ask about payment plan options to spread costs over time.', es: 'Entendemos que los costos de salud pueden acumularse. Pregunte sobre opciones de planes de pago.' },
    'patients.insurance.note': { en: 'Questions about costs?', es: '¿Preguntas sobre costos?' },
    'patients.insurance.note2': { en: 'We don\'t quote specific pricing online to ensure accuracy. Call us at', es: 'No cotizamos precios específicos en línea para asegurar precisión. Llámenos al' },
    'patients.insurance.note3': { en: 'for a personalized estimate based on your insurance and the services you need.', es: 'para un estimado personalizado basado en su seguro y los servicios que necesita.' },
    'patients.urgent.overline': { en: 'Important', es: 'Importante' },
    'patients.urgent.title': { en: 'When to Seek Urgent Care', es: 'Cuándo Buscar Atención Urgente' },
    'patients.urgent.subtitle': { en: 'Some symptoms require immediate medical attention. If you experience any of the following, seek urgent care or go to the emergency room.', es: 'Algunos síntomas requieren atención médica inmediata. Si experimenta alguno de los siguientes, busque atención urgente.' },
    'patients.er': { en: 'Go to the ER if:', es: 'Vaya a Emergencias si:' },
    'patients.er.desc': { en: 'You have severe, worsening symptoms, open wounds with bone visible, signs of infection (fever, hot swollen joint, red streaking), or any life-threatening emergency.', es: 'Tiene síntomas severos que empeoran, heridas abiertas con hueso visible, signos de infección o cualquier emergencia.' },
    'patients.call': { en: 'Call us for urgent (non-emergency) needs:', es: 'Llámenos para necesidades urgentes (no emergencia):' },
    'patients.call.desc': { en: 'If your situation is urgent but stable—like a possible sprain or acute injury where you can still function—call', es: 'Si su situación es urgente pero estable—como un posible esguince o lesión aguda—llame al' },
    'patients.call.desc2': { en: '. We often have same-day appointments available.', es: '. A menudo tenemos citas disponibles para el mismo día.' },
    'patients.cta.title': { en: 'Ready to Schedule Your Appointment?', es: '¿Listo para Programar su Cita?' },
    'patients.cta.subtitle': { en: 'Our team is here to help you get the care you need. Call us to schedule or ask any questions about your first visit.', es: 'Nuestro equipo está aquí para ayudarlo. Llámenos para programar o hacer preguntas sobre su primera visita.' },
    
    // Contact Page
    'contact.overline': { en: 'Get in Touch', es: 'Contáctenos' },
    'contact.title': { en: 'Contact Us', es: 'Contáctenos' },
    'contact.subtitle': { en: 'Ready to schedule an appointment or have questions? The fastest way to reach us is by phone. You can also send a message for non-urgent inquiries.', es: '¿Listo para programar una cita o tiene preguntas? La forma más rápida de contactarnos es por teléfono.' },
    'contact.cta.title': { en: 'Prefer to Talk?', es: '¿Prefiere Hablar?' },
    'contact.cta.subtitle': { en: 'Our friendly staff is ready to help you schedule an appointment or answer your questions.', es: 'Nuestro personal amable está listo para ayudarlo a programar una cita o responder sus preguntas.' },
    'contact.location': { en: 'Location', es: 'Ubicación' },
    'contact.directions': { en: 'Get Directions', es: 'Obtener Direcciones' },
    'contact.phone.email': { en: 'Phone & Email', es: 'Teléfono y Correo' },
    'contact.call.schedule': { en: 'Call to Schedule', es: 'Llamar para Agendar' },
    'contact.hours': { en: 'Office Hours', es: 'Horario de Oficina' },
    'contact.monday': { en: 'Monday', es: 'Lunes' },
    'contact.tuesday': { en: 'Tuesday', es: 'Martes' },
    'contact.wednesday': { en: 'Wednesday', es: 'Miércoles' },
    'contact.thursday': { en: 'Thursday', es: 'Jueves' },
    'contact.friday': { en: 'Friday', es: 'Viernes' },
    'contact.saturday': { en: 'Saturday', es: 'Sábado' },
    'contact.sunday': { en: 'Sunday', es: 'Domingo' },
    'contact.byappt': { en: 'By appointment', es: 'Con cita' },
    'contact.closed': { en: 'Closed', es: 'Cerrado' },
    'contact.emergency': { en: 'Emergency Notice', es: 'Aviso de Emergencia' },
    'contact.emergency.desc': { en: 'If you believe you have a medical emergency, call 911 or go to the nearest emergency room immediately. This form is not monitored for urgent requests.', es: 'Si cree que tiene una emergencia médica, llame al 911 o vaya a la sala de emergencias más cercana. Este formulario no se monitorea para solicitudes urgentes.' },
    'contact.form.title': { en: 'Send a Message', es: 'Enviar un Mensaje' },
    'contact.form.desc': { en: 'For non-urgent questions only. For scheduling, please call us directly. Do not include sensitive medical details in this form.', es: 'Solo para preguntas no urgentes. Para programar, llámenos directamente. No incluya detalles médicos sensibles.' },
    'contact.form.name': { en: 'Full Name *', es: 'Nombre Completo *' },
    'contact.form.name.placeholder': { en: 'Your full name', es: 'Su nombre completo' },
    'contact.form.phone': { en: 'Phone Number *', es: 'Número de Teléfono *' },
    'contact.form.email': { en: 'Email (optional)', es: 'Correo (opcional)' },
    'contact.form.topic': { en: 'What can we help with?', es: '¿En qué podemos ayudar?' },
    'contact.form.topic.injury': { en: 'New injury', es: 'Nueva lesión' },
    'contact.form.topic.pain': { en: 'Chronic pain', es: 'Dolor crónico' },
    'contact.form.topic.scheduling': { en: 'Scheduling question', es: 'Pregunta de cita' },
    'contact.form.topic.imaging': { en: 'Imaging / records', es: 'Imágenes / registros' },
    'contact.form.topic.insurance': { en: 'Insurance / billing', es: 'Seguro / facturación' },
    'contact.form.topic.other': { en: 'Other', es: 'Otro' },
    'contact.form.message': { en: 'Message', es: 'Mensaje' },
    'contact.form.message.placeholder': { en: 'Example: I\'ve been having knee pain after running. It started about two weeks ago. I\'m looking for an evaluation and would like to know the next steps.', es: 'Ejemplo: He tenido dolor de rodilla después de correr. Comenzó hace unas dos semanas. Busco una evaluación y me gustaría saber los próximos pasos.' },
    'contact.form.submit': { en: 'Send Message', es: 'Enviar Mensaje' },
    'contact.form.privacy': { en: 'By sending this message, you agree to our', es: 'Al enviar este mensaje, acepta nuestra' },
    'contact.cta.title': { en: 'Prefer to Talk?', es: '¿Prefiere Hablar?' },
    'contact.cta.subtitle': { en: 'Our friendly staff is ready to help you schedule an appointment or answer your questions.', es: 'Nuestro personal amable está listo para ayudarlo a programar una cita o responder sus preguntas.' },
    
    // Language toggle
    'lang.en': { en: 'EN', es: 'EN' },
    'lang.es': { en: 'ES', es: 'ES' },
    'lang.english': { en: 'English', es: 'Inglés' },
    'lang.spanish': { en: 'Spanish', es: 'Español' },
    
    // Back to demo
    'demo.back': { en: 'Back to Demo', es: 'Volver a Demo' }
  };

  // Get current language from localStorage or default to 'en'
  function getCurrentLang() {
    return localStorage.getItem('peakpoint-lang') || 'en';
  }

  // Set language
  function setLang(lang) {
    localStorage.setItem('peakpoint-lang', lang);
    document.documentElement.lang = lang;
    applyTranslations(lang);
    updateLangToggle(lang);
  }

  // Apply translations to all elements with data-i18n attribute
  function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key] && translations[key][lang]) {
        el.textContent = translations[key][lang];
      }
    });

    // Handle placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key] && translations[key][lang]) {
        el.placeholder = translations[key][lang];
      }
    });

    // Handle aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (translations[key] && translations[key][lang]) {
        el.setAttribute('aria-label', translations[key][lang]);
      }
    });
  }

  // Update language toggle button appearance
  function updateLangToggle(lang) {
    const toggles = document.querySelectorAll('[data-lang-toggle]');
    toggles.forEach(toggle => {
      const enBtn = toggle.querySelector('[data-lang="en"]');
      const esBtn = toggle.querySelector('[data-lang="es"]');
      if (enBtn && esBtn) {
        enBtn.classList.toggle('active', lang === 'en');
        esBtn.classList.toggle('active', lang === 'es');
      }
    });
  }

  // Initialize language system
  function initLang() {
    const lang = getCurrentLang();
    document.documentElement.lang = lang;
    applyTranslations(lang);
    updateLangToggle(lang);

    // Add click handlers to language toggle buttons
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const newLang = btn.getAttribute('data-lang');
        setLang(newLang);
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
  } else {
    initLang();
  }
})();
