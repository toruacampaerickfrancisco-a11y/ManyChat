const DEFAULT_SYSTEM_PROMPT = `Eres Nikola, el asistente virtual oficial de CLIPOP (Ingeniería de Costos, Consultoría y Licitaciones, fundada por el Ing. Francisco Gardea).
Debes responder de forma concisa, cordial, precisa y profesional siguiendo exactamente la oferta de servicios y enlaces oficiales de CLIPOP:

1. SERVICIOS PRINCIPALES:
   - 1️⃣ Cursos pregrabados:
  * Nuestro curso más completo: [Análisis de Precios Unitarios OPUS y Neodata, Proyectos CFE](https://go.hotmart.com/K93054265G)
  * BENEFICIO ESPECIAL: Al adquirir el curso más completo, el alumno recibe acceso a todos nuestros cursos especializados (OPUS 22/24/Neodata, Concursos CFE, OPUS 2025, etc.) incluidos sin costo extra.
  * Catálogo completo y detalles en la web: [Ver Cursos en Clipop](https://clipop.com.mx/cursos)
  * Asesoría y dudas: contacto@clipop.com.mx
   - 2️⃣ Cursos en tiempo real por Teams: Impartidos mediante Microsoft Teams. Convocatorias en redes oficiales, o programación personalizada a contacto@clipop.com.mx.
   - 3️⃣ Cursos presenciales (Hermosillo): Abiertos al público en la ciudad de Hermosillo, Sonora. Convocatorias en redes oficiales. Para cursos en otras ciudades de México, escribir a contacto@clipop.com.mx.
   - 4️⃣ Cotización de proyectos de media o alta tensión: Para cotizar un proyecto, enviar catálogo de conceptos, especificaciones, planos y condiciones comerciales a contacto@clipop.com.mx con el asunto "Solicitud de cotización".

2. ENLACES Y REDES SOCIALES (siempre en formato markdown limpio [Texto](URL)):
   - 🌐 [Sitio Web](https://clipop.com.mx)
   - 📸 [Instagram Clipop](https://instagram.com/clipopoficial)
   - 🔵 [Facebook Clipop](https://facebook.com/profile.php?id=61591801231145)
   - ✉️ Correo Oficial: contacto@clipop.com.mx

3. NAVEGACIÓN, CORREO DE CONTACTO Y CIERRE:
   - Al responder cualquier duda técnica o consulta, responde de forma clara y añade siempre:
     "✉️ *Si deseas enviar documentación de tu proyecto o dudas específicas:* contacto@clipop.com.mx"
   - Incluye siempre al final la pregunta de continuidad:
     "━━━━━━━━━━━━━━━━━━━\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
   - Si el usuario responde "Sí", pregúntale en qué más le puedes apoyar y ofrécele las 4 opciones de servicio.
   - Si el usuario responde "No", finaliza amablemente e indica que puede volver al menú escribiendo 'Menú' o '0'.`;

const ORIGINAL_BOT_RULES = [
  // Flujo 0: Bienvenida y Menú Principal (Exacto como en la Web)
  {
    id: 1,
    keyword: "menu",
    match_type: "exact",
    response: "¡Hola! Soy Nikola, tu asistente ¿En qué te puedo ayudar hoy?\n\n*Platícanos, ¿en cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales (Hermosillo)*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._"
  },
  {
    id: 2,
    keyword: "hola",
    match_type: "exact",
    response: "¡Hola! Soy Nikola, tu asistente ¿En qué te puedo ayudar hoy?\n\n*Platícanos, ¿en cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales (Hermosillo)*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._"
  },
  {
    id: 3,
    keyword: "inicio",
    match_type: "exact",
    response: "¡Hola! Soy Nikola, tu asistente ¿En qué te puedo ayudar hoy?\n\n*Platícanos, ¿en cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales (Hermosillo)*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._"
  },
  {
    id: 4,
    keyword: "0",
    match_type: "exact",
    response: "¡Hola! Soy Nikola, tu asistente ¿En qué te puedo ayudar hoy?\n\n*Platícanos, ¿en cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales (Hermosillo)*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._"
  },

  // Flujo 1: Cursos pregrabados
  {
    id: 6,
    keyword: "1",
    match_type: "exact",
    response: `¡Excelente! 🎓 Te presentamos nuestro programa de formación profesional:

⭐ *NUESTRO CURSO MÁS COMPLETO:*
👉 [Análisis de Precios Unitarios OPUS y Neodata (CFE)](https://go.hotmart.com/K93054265G)

🎁 *¡BENEFICIO EXCLUSIVO!*
Al adquirir nuestro curso más completo, *tienes acceso incluido a todos nuestros cursos especializados*:
• Precios Unitarios OPUS 22, 24, Neodata y Excel
• Cómo Presentar Concursos para CFE desde cero
• Análisis de Precios Unitarios 100% Práctico (OPUS 2025)
• OPUS 2020. Análisis de Precios Unitarios
• Curso Gratuito Introductorio APU

🌐 [Ver Catálogo y Detalles en Clipop](https://clipop.com.mx/cursos)
📧 *Dudas y asesoría:* contacto@clipop.com.mx

━━━━━━━━━━━━━━━━━━━
🌐 [Sitio Web](https://clipop.com.mx) | 📸 [Instagram](https://instagram.com/clipopoficial) | 📘 [Facebook](https://facebook.com/profile.php?id=61591801231145)
━━━━━━━━━━━━━━━━━━━

❓ *¿Deseas continuar con la conversación?*
👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal).`
  },

  // Flujo 2: Cursos en tiempo real (Teams)
  {
    id: 9,
    keyword: "2",
    match_type: "exact",
    response: "Te invitamos a seguir nuestras redes oficiales, donde publicamos las convocatorias para los cursos en tiempo real vía *Microsoft Teams* 💻:\n\n━━━━━━━━━━━━━━━━━━━\n📸 [Instagram Clipop Oficial](https://instagram.com/clipopoficial)\n🔵 [Facebook Clipop Oficial](https://facebook.com/profile.php?id=61591801231145)\n🌐 [Sitio Web Oficial](https://clipop.com.mx)\n━━━━━━━━━━━━━━━━━━━\n\n📅 Si deseas programar un curso exclusivo en una fecha específica o resolver dudas, envíanos un correo a:\n✉️ *contacto@clipop.com.mx*\n\n━━━━━━━━━━━━━━━━━━━\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
  },

  // Flujo 3: Cursos presenciales (Hermosillo)
  {
    id: 12,
    keyword: "3",
    match_type: "exact",
    response: "¡Excelente! 📍 Los cursos presenciales abiertos al público se imparten en la ciudad de *Hermosillo, Sonora*.\n\nEn nuestras redes sociales damos a conocer las próximas convocatorias, fechas y horarios:\n\n━━━━━━━━━━━━━━━━━━━\n📸 [Instagram Clipop Oficial](https://instagram.com/clipopoficial)\n🔵 [Facebook Clipop Oficial](https://facebook.com/profile.php?id=61591801231145)\n🌐 [Sitio Web Oficial](https://clipop.com.mx)\n━━━━━━━━━━━━━━━━━━━\n\n🏢 Si te interesa un curso presencial en otra ciudad o tienes dudas específicas, escríbenos a:\n✉️ *contacto@clipop.com.mx*\n\n━━━━━━━━━━━━━━━━━━━\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
  },

  // Flujo 4: Cotización de proyecto de media o alta tensión
  {
    id: 15,
    keyword: "4",
    match_type: "exact",
    response: "¡Excelente! 🤝⚡ Para nosotros será un placer hacer sinergia en tu proyecto de media o alta tensión.\n\nPor favor envíanos la información técnica del proyecto (catálogo de conceptos, especificaciones, planos y condiciones comerciales) a:\n✉️ *contacto@clipop.com.mx*\n📌 Asunto: *Solicitud de cotización*\n\nNuestro equipo de ingeniería de costos se comunicará contigo a la brevedad.\n\n━━━━━━━━━━━━━━━━━━━\n📸 [Instagram Clipop Oficial](https://instagram.com/clipopoficial)\n🔵 [Facebook Clipop Oficial](https://facebook.com/profile.php?id=61591801231145)\n🌐 [Sitio Web Oficial](https://clipop.com.mx)\n━━━━━━━━━━━━━━━━━━━\n\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
  },

  // Flujo: Duda explícita ("duda", "dudas", "pregunta")
  {
    id: 16,
    keyword: "duda",
    match_type: "contains",
    response: "¡Con gusto resolvemos tu duda! 💬\n\nPor favor cuéntanos detalladamente tu consulta técnica o sobre qué curso/proyecto requieres información.\n\n✉️ *También puedes enviarnos tu duda o documentación a:* contacto@clipop.com.mx\n\n━━━━━━━━━━━━━━━━━━━\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
  },
  {
    id: 17,
    keyword: "dudas",
    match_type: "contains",
    response: "¡Con gusto resolvemos todas tus dudas! 💬\n\nPor favor escribe tu consulta técnica o sobre qué curso o proyecto deseas orientación.\n\n✉️ *También puedes enviarnos tus dudas a:* contacto@clipop.com.mx\n\n━━━━━━━━━━━━━━━━━━━\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
  },

  // Flujo: Continuar conversación ("si" o "sí")
  {
    id: 18,
    keyword: "si",
    match_type: "exact",
    response: "¡Excelente! 😊 ¿En qué más te podemos apoyar o sobre qué tema es tu consulta?\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales (Hermosillo)*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n✉️ *Correo oficial:* contacto@clipop.com.mx\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda directamente._"
  },
  {
    id: 19,
    keyword: "sí",
    match_type: "exact",
    response: "¡Excelente! 😊 ¿En qué más te podemos apoyar o sobre qué tema es tu consulta?\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales (Hermosillo)*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n✉️ *Correo oficial:* contacto@clipop.com.mx\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda directamente._"
  },

  // Flujo: Finalizar conversación ("no")
  {
    id: 20,
    keyword: "no",
    match_type: "exact",
    response: "🔒 *Sesión finalizada*\n\n¡Muchas gracias por comunicarte con CLIPOP! 🚀✨ Ha sido un placer atenderte.\n\nRecuerda seguirnos en nuestras redes oficiales para convocatorias y novedades:\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n✉️ *Correo:* contacto@clipop.com.mx\n━━━━━━━━━━━━━━━━━━━\n\n¡Mucho éxito en tus proyectos! Si deseas iniciar nuevamente o consultar los servicios, solo escribe *'Menú'* o *'0'*. 🙌"
  },

  // Flujo: Asesor Humano
  {
    id: 21,
    keyword: "asesor",
    match_type: "contains",
    response: "👨‍💼 *Atención con un Asesor de CLIPOP*\n\n¡Perfecto! Hemos notificado a nuestro equipo. Un asesor humano del equipo de CLIPOP tomará el control de la conversación a la brevedad.\n\n✉️ *Correo:* contacto@clipop.com.mx\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n\n━━━━━━━━━━━━━━━━━━━\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
  },
  {
    id: 22,
    keyword: "humano",
    match_type: "contains",
    response: "👨‍💼 *Atención con un Asesor de CLIPOP*\n\nUn asesor humano del equipo de *CLIPOP* tomará la conversación a la brevedad.\n\n✉️ *Correo:* contacto@clipop.com.mx\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n\n━━━━━━━━━━━━━━━━━━━\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
  }
];

const DEFAULT_PRODUCTS = [
  {
    id: "hotmart-1",
    name: "Curso de Análisis de Precios Unitarios. OPUS y Neodata, Proyectos de la Vida Real, CFE",
    titulo: "Curso de Análisis de Precios Unitarios. OPUS y Neodata, Proyectos de la Vida Real, CFE",
    category: "CURSO",
    status: "ACTIVO",
    is_active: true,
    price: 999,
    author: "ING. FRANCISCO GARDEA",
    url: "https://go.hotmart.com/K93054265G",
    enlace: "https://go.hotmart.com/K93054265G",
    rating: "5.0",
    valoraciones: "48",
    estudiantes: "320",
    badge: "Hotmart Masterclass",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-300",
    description: "Domina precios unitarios desde cero con OPUS y Neodata para proyectos reales de CFE y licitaciones públicas. Incluye clases en vivo por Teams y más de 40 horas de capacitación.",
    descripcion: "Domina precios unitarios desde cero con OPUS y Neodata para proyectos reales de CFE y licitaciones públicas. Incluye clases en vivo por Teams y más de 40 horas de capacitación.",
    imagen: "/curso_hotmart_opus_neodata.jpg"
  },
  {
    id: "1",
    name: "Curso Gratuito Introductorio: Análisis de Precios Unitarios",
    titulo: "Curso Gratuito Introductorio: Análisis de Precios Unitarios",
    category: "CURSO",
    status: "ACTIVO",
    is_active: true,
    price: 0,
    author: "FRANCISCO RAMÓN GARDEA HERNÁNDEZ",
    url: "https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED",
    enlace: "https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED",
    rating: "4.6",
    valoraciones: "62",
    estudiantes: "754",
    badge: "Gratuito",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description: "Curso de especialización introductorio y dinámico para aprender a trabajar con la CFE, licitaciones y análisis de precios unitarios con OPUS.",
    descripcion: "Curso de especialización introductorio y dinámico para aprender a trabajar con la CFE, licitaciones y análisis de precios unitarios con OPUS.",
    imagen: "/concurso_redes.png"
  },
  {
    id: "2",
    name: "Precios Unitarios OPUS 22, 24, Neodata y Excel",
    titulo: "Precios Unitarios OPUS 22, 24, Neodata y Excel",
    category: "CURSO",
    status: "ACTIVO",
    is_active: true,
    price: 349,
    author: "FRANCISCO RAMÓN GARDEA HERNÁNDEZ",
    url: "https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/",
    enlace: "https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/",
    rating: "4.4",
    valoraciones: "226",
    estudiantes: "1244",
    badge: "Más Vendido",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    description: "Estructuración de presupuestos y análisis de precios unitarios (APU) desde cero en OPUS, Neodata y Excel.",
    descripcion: "Estructuración de presupuestos y análisis de precios unitarios (APU) desde cero en OPUS, Neodata y Excel.",
    imagen: "/concurso_subestacion.png"
  },
  {
    id: "3",
    name: "Cómo Presentar Concursos para CFE desde cero con OPUS 2020",
    titulo: "Cómo Presentar Concursos para CFE desde cero con OPUS 2020",
    category: "CURSO",
    status: "ACTIVO",
    is_active: true,
    price: 349,
    author: "FRANCISCO RAMÓN GARDEA HERNÁNDEZ",
    url: "https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/",
    enlace: "https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/",
    rating: "4.9",
    valoraciones: "24",
    estudiantes: "77",
    badge: "Mejor Valorado",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    description: "Aprende paso a paso a integrar una propuesta técnica y económica ganadora bajo normativa de CFE.",
    descripcion: "Aprende paso a paso a integrar una propuesta técnica y económica ganadora bajo normativa de CFE.",
    imagen: "/concurso_subestacion.png"
  },
  {
    id: "4",
    name: "Análisis de Precios Unitarios 100% Práctico (OPUS 2025)",
    titulo: "Análisis de Precios Unitarios 100% Práctico (OPUS 2025)",
    category: "CURSO",
    status: "ACTIVO",
    is_active: true,
    price: 449,
    author: "FRANCISCO RAMÓN GARDEA HERNÁNDEZ",
    url: "https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F",
    enlace: "https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F",
    rating: "5.0",
    valoraciones: "29",
    estudiantes: "180",
    badge: "Nuevo 2025",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
    description: "El curso más actualizado con OPUS 2025 para elaboración de presupuestos y licitaciones de alto nivel.",
    descripcion: "El curso más actualizado con OPUS 2025 para elaboración de presupuestos y licitaciones de alto nivel.",
    imagen: "/concurso_subestacion.png"
  },
  {
    id: "5",
    name: "Opus 2020. Análisis de precios unitarios",
    titulo: "Opus 2020. Análisis de precios unitarios",
    category: "CURSO",
    status: "ACTIVO",
    is_active: true,
    price: 1999,
    author: "FRANCISCO RAMÓN GARDEA HERNÁNDEZ",
    url: "https://www.udemy.com/course/opus-2020-analisis-de-precios-unitarios/?referralCode=37ABE3618B5C83C37D65",
    enlace: "https://www.udemy.com/course/opus-2020-analisis-de-precios-unitarios/?referralCode=37ABE3618B5C83C37D65",
    rating: "4.5",
    valoraciones: "72",
    estudiantes: "362",
    badge: "OPUS 2020",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    description: "Desarrollo de concursos y licitaciones publicas y privadas con OPUS 2020.",
    descripcion: "Desarrollo de concursos y licitaciones publicas y privadas con OPUS 2020.",
    imagen: "/concurso_lineas.png"
  }
];

module.exports = {
  SYSTEM_PROMPT: DEFAULT_SYSTEM_PROMPT,
  ORIGINAL_BOT_RULES,
  DEFAULT_PRODUCTS
};

