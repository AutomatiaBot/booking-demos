"""
Seed script to create initial demos in Firestore.
Run this once after setting up the database.

Usage:
    cd backend
    export GCP_PROJECT_ID=your-project-id
    export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
    python scripts/seed_demos.py
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db


# Initial demos to create
# Legacy demos are deactivated, new website demos are active
INITIAL_DEMOS = [
    # ============================================
    # LEGACY DEMOS (Deactivated)
    # ============================================
    {
        "demo_id": "manhattan-smiles",
        "title": "Manhattan Smiles (Legacy)",
        "title_es": "Manhattan Smiles (Legado)",
        "description": "Premium dental studio in NYC. Showcases AI appointment booking, patient inquiries, and 24/7 support for a high-end dental practice.",
        "description_es": "Estudio dental premium en NYC. Muestra reserva de citas con IA, consultas de pacientes y soporte 24/7 para una práctica dental de alto nivel.",
        "icon": "🦷",
        "industry": "HealthTech",
        "path": "manhattan-smiles/manhattan-smiles.html",
        "tags": ["Chatbot", "Appointment Booking", "Patient Support"],
        "tags_es": ["Chatbot", "Reserva de Citas", "Soporte al Paciente"],
        "keywords": "dental dentist healthcare teeth smile manhattan new york appointment booking healthtech",
        "sort_order": 100,
        "is_active": False,
        "is_external": False,
    },
    {
        "demo_id": "gbc",
        "title": "Global Beauty Circle (Legacy)",
        "title_es": "Global Beauty Circle (Legado)",
        "description": "Medical tourism platform for aesthetic procedures. AI concierge helps clients explore surgeries, get quotes, and plan trips to DR & Colombia.",
        "description_es": "Plataforma de turismo médico para procedimientos estéticos. El asistente de IA ayuda a clientes a explorar cirugías, obtener cotizaciones y planear viajes a RD y Colombia.",
        "icon": "✨",
        "industry": "MedTourism",
        "path": "gbc/gbc-booking.html",
        "tags": ["Chatbot", "Lead Qualification", "Bilingual"],
        "tags_es": ["Chatbot", "Calificación de Leads", "Bilingüe"],
        "keywords": "beauty medical tourism aesthetic surgery cosmetic plastic dominican colombia gbc global medtourism",
        "sort_order": 101,
        "is_active": False,
        "is_external": False,
    },
    {
        "demo_id": "dr-michael-doe",
        "title": "Kate AI Demo (Legacy)",
        "title_es": "Demo Kate AI (Legado)",
        "description": "Our flagship demo showcasing Kate's full capabilities: chatbot interaction and voice agent testing with live phone numbers.",
        "description_es": "Nuestro demo principal mostrando las capacidades completas de Kate: interacción por chat y prueba de agente de voz con números telefónicos reales.",
        "icon": "🤖",
        "industry": "General",
        "path": "dr-michael-doe/automatia-booking.html",
        "tags": ["Chatbot", "Voice Agent", "Phone Demo"],
        "tags_es": ["Chatbot", "Agente de Voz", "Demo Telefónico"],
        "keywords": "kate automatia general voice call phone demo test agent assistant receptionist flagship",
        "sort_order": 102,
        "is_active": False,
        "is_external": False,
    },
    {
        "demo_id": "ray-avila",
        "title": "Ray Avila Demo (Legacy)",
        "title_es": "Demo Ray Avila (Legado)",
        "description": "Custom demo page for Ray Avila's sales presentations. Tailored content and configuration for specific client needs.",
        "description_es": "Página de demo personalizada para las presentaciones de ventas de Ray Avila. Contenido y configuración adaptados a necesidades específicas del cliente.",
        "icon": "🎯",
        "industry": "Custom",
        "path": "ray-avila/ray-avila.html",
        "tags": ["Custom", "Sales", "Personalized"],
        "tags_es": ["Personalizado", "Ventas", "A Medida"],
        "keywords": "ray avila custom personalized sales",
        "sort_order": 103,
        "is_active": False,
        "is_external": False,
    },

    # ============================================
    # ACTIVE DEMOS - External Website
    # ============================================
    {
        "demo_id": "dr-michael-doe-website",
        "title": "Dr. Michael Doe",
        "title_es": "Dr. Michael Doe",
        "description": "Live production website for Dr. Michael Doe, premier cosmetic dentist in Manhattan. Features AI-powered chatbot for patient inquiries and appointment booking.",
        "description_es": "Sitio web en producción del Dr. Michael Doe, dentista cosmético premier en Manhattan. Cuenta con chatbot de IA para consultas de pacientes y reserva de citas.",
        "icon": "🦷",
        "industry": "HealthTech",
        "path": "https://www.drmichaeldoe.com/",
        "tags": ["Live Site", "Dental", "Chatbot"],
        "tags_es": ["Sitio en Vivo", "Dental", "Chatbot"],
        "keywords": "dr michael doe dental cosmetic dentist manhattan live production website external dentistry implants",
        "sort_order": 1,
        "is_active": True,
        "is_external": True,
    },

    # ============================================
    # ACTIVE DEMOS - Internal Websites
    # ============================================
    {
        "demo_id": "calder-rowe-legal-website",
        "title": "Calder & Rowe Legal",
        "title_es": "Calder & Rowe Legal",
        "description": "Law firm website for Calder & Rowe Legal Services in Riverton, NY. Specializes in personal injury, immigration, and family law with AI-powered client intake.",
        "description_es": "Sitio web del bufete Calder & Rowe Legal Services en Riverton, NY. Especializado en lesiones personales, inmigración y derecho familiar con asistencia de IA.",
        "icon": "⚖️",
        "industry": "Legal",
        "path": "calder-rowe-legal-website/index.html",
        "tags": ["Legal", "Law Firm", "Chatbot"],
        "tags_es": ["Legal", "Bufete", "Chatbot"],
        "keywords": "law legal attorney lawyer personal injury immigration family law calder rowe riverton new york",
        "sort_order": 2,
        "is_active": True,
        "is_external": False,
    },
    {
        "demo_id": "harborlight-website",
        "title": "Harborlight Counseling",
        "title_es": "Harborlight Counseling",
        "description": "Mental health and wellness website for Harborlight Counseling & Wellness in Brookhaven. Offers evidence-based therapy with virtual and in-person options.",
        "description_es": "Sitio web de salud mental y bienestar para Harborlight Counseling & Wellness en Brookhaven. Ofrece terapia basada en evidencia con opciones virtuales y presenciales.",
        "icon": "🧠",
        "industry": "Mental Health",
        "path": "harborlight-website/index.html",
        "tags": ["Therapy", "Wellness", "Chatbot"],
        "tags_es": ["Terapia", "Bienestar", "Chatbot"],
        "keywords": "therapy counseling mental health wellness harborlight brookhaven therapist psychologist anxiety depression",
        "sort_order": 3,
        "is_active": True,
        "is_external": False,
    },
    {
        "demo_id": "paws-and-pines-website",
        "title": "Paws & Pines Veterinary",
        "title_es": "Paws & Pines Veterinaria",
        "description": "Veterinary clinic website for Paws & Pines in Cedar Glen, CO. Features wellness exams, sick visits, dental care, and AI appointment scheduling.",
        "description_es": "Sitio web de clínica veterinaria Paws & Pines en Cedar Glen, CO. Ofrece exámenes de bienestar, visitas por enfermedad, cuidado dental y programación de citas con IA.",
        "icon": "🐾",
        "industry": "Veterinary",
        "path": "paws-and-pines-website/index.html",
        "tags": ["Veterinary", "Pet Care", "Chatbot"],
        "tags_es": ["Veterinaria", "Mascotas", "Chatbot"],
        "keywords": "veterinary vet pet animal dog cat clinic paws pines cedar glen colorado wellness dental",
        "sort_order": 4,
        "is_active": True,
        "is_external": False,
    },
    {
        "demo_id": "peakpoint-ortho-website",
        "title": "PeakPoint Orthopedics",
        "title_es": "PeakPoint Ortopedia",
        "description": "Orthopedic and sports medicine website for PeakPoint in Northbridge, TX. Performance-minded care for active patients with AI-powered scheduling.",
        "description_es": "Sitio web de ortopedia y medicina deportiva para PeakPoint en Northbridge, TX. Atención enfocada en rendimiento para pacientes activos con programación de IA.",
        "icon": "🦴",
        "industry": "Orthopedics",
        "path": "peakpoint-ortho-website/index.html",
        "tags": ["Orthopedics", "Sports Medicine", "Chatbot"],
        "tags_es": ["Ortopedia", "Medicina Deportiva", "Chatbot"],
        "keywords": "orthopedic ortho sports medicine bone joint knee hip shoulder peakpoint northbridge texas injury",
        "sort_order": 5,
        "is_active": True,
        "is_external": False,
    },
    {
        "demo_id": "restoremotion-website",
        "title": "RestoreMotion Physical Therapy",
        "title_es": "RestoreMotion Fisioterapia",
        "description": "Physical therapy website for RestoreMotion PT in Bayshore, FL. Offers orthopedic rehab, post-op care, sports injury treatment, and AI-assisted scheduling.",
        "description_es": "Sitio web de fisioterapia para RestoreMotion PT en Bayshore, FL. Ofrece rehabilitación ortopédica, cuidado post-operatorio, tratamiento de lesiones deportivas y programación asistida por IA.",
        "icon": "💪",
        "industry": "Physical Therapy",
        "path": "restore-motion-pt-website/index.html",
        "tags": ["Physical Therapy", "Rehab", "Chatbot"],
        "tags_es": ["Fisioterapia", "Rehabilitación", "Chatbot"],
        "keywords": "physical therapy pt rehab rehabilitation sports injury post op orthopedic restoremotion bayshore florida",
        "sort_order": 6,
        "is_active": True,
        "is_external": False,
    },
    {
        "demo_id": "stonebridge-realty-website",
        "title": "Stonebridge Realty",
        "title_es": "Stonebridge Realty",
        "description": "Real estate website for Stonebridge Realty Group. Buy, sell, or rent properties with AI-powered agent matching and property inquiries.",
        "description_es": "Sitio web inmobiliario para Stonebridge Realty Group. Compra, vende o alquila propiedades con emparejamiento de agentes y consultas de propiedades asistidas por IA.",
        "icon": "🏠",
        "industry": "Real Estate",
        "path": "stonebridge-realty-website/index.html",
        "tags": ["Real Estate", "Property", "Chatbot"],
        "tags_es": ["Bienes Raíces", "Propiedades", "Chatbot"],
        "keywords": "real estate realty property home house buy sell rent agent stonebridge realtor",
        "sort_order": 7,
        "is_active": True,
        "is_external": False,
    },
]


def seed_demos():
    """Create initial demos in Firestore."""
    print("🌱 Seeding demos...")
    
    db = get_db()
    
    for demo_data in INITIAL_DEMOS:
        demo_id = demo_data["demo_id"]
        
        # Check if demo already exists
        existing = db.get_demo_by_id(demo_id)
        if existing:
            print(f"  ⏭️  Demo '{demo_id}' already exists, skipping...")
            continue
        
        # Create demo
        db.create_demo(
            demo_id=demo_id,
            title=demo_data["title"],
            description=demo_data["description"],
            icon=demo_data["icon"],
            industry=demo_data["industry"],
            path=demo_data["path"],
            tags=demo_data["tags"],
            keywords=demo_data["keywords"],
            title_es=demo_data.get("title_es", ""),
            description_es=demo_data.get("description_es", ""),
            tags_es=demo_data.get("tags_es", []),
            sort_order=demo_data.get("sort_order", 0),
            is_active=demo_data.get("is_active", True),
            is_external=demo_data.get("is_external", False),
        )
        external_tag = " [External]" if demo_data.get("is_external") else ""
        print(f"  ✅ Created demo: {demo_id} ({demo_data['title']}){external_tag}")
    
    print("\n✨ Demo seeding complete!")
    print(f"   Total demos: {len(INITIAL_DEMOS)}")


def list_demos():
    """List all demos in Firestore."""
    print("\n📋 Current demos in database:")
    
    db = get_db()
    demos = db.list_demos(include_inactive=True)
    
    if not demos:
        print("   No demos found")
        return
    
    for demo in demos:
        status = "✅ Active" if demo.get("is_active", True) else "❌ Inactive"
        print(f"   {demo['icon']} {demo['id']}: {demo['title']} [{status}]")


if __name__ == "__main__":
    # Check environment
    if not os.getenv("GCP_PROJECT_ID"):
        print("❌ Error: GCP_PROJECT_ID environment variable is required")
        print("   export GCP_PROJECT_ID=your-project-id")
        sys.exit(1)
    
    if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
        print("⚠️  Warning: GOOGLE_APPLICATION_CREDENTIALS not set")
        print("   Make sure you have authenticated with GCP (gcloud auth application-default login)")
    
    seed_demos()
    list_demos()
