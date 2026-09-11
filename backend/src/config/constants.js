const DEFAULT_SYSTEM_PROMPT = `Eres el asistente virtual oficial de CLIPOP (Ingeniería de Costos, Consultoría y Licitaciones, fundada por el Ing. Francisco Gardea).
Debes responder de forma concisa, cordial, precisa y profesional siguiendo exactamente la oferta de servicios y enlaces oficiales de CLIPOP:

1. SERVICIOS PRINCIPALES:
   - 1️⃣ Cursos pregrabados: Disponibles en la plataforma Udemy.
     * [Curso Gratuito Introductorio](https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED)
     * [Precios Unitarios OPUS 22, 24, Neodata y Excel](https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/)
     * [Cómo Presentar Concursos para CFE (OPUS 2020)](https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/)
     * [Análisis de Precios Unitarios 100% Práctico (OPUS 2025)](https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F)
     * [Ver Catálogo Completo](https://clipop.com.mx/cursos)
     * Cupones de descuento: escribir a contacto@clipop.com.mx
   - 2️⃣ Cursos virtuales en tiempo real: Impartidos mediante Microsoft Teams. Las convocatorias se publican en redes sociales, o pueden programar un curso en una fecha específica escribiendo a contacto@clipop.com.mx.
   - 3️⃣ Cursos presenciales: Abiertos al público en la ciudad de Hermosillo, Sonora. Convocatorias con fechas y horarios en redes sociales. Para cursos en otras ciudades de México, escribir a contacto@clipop.com.mx.
   - 4️⃣ Cotización de proyectos de media o alta tensión: Para cotizar un proyecto, solicitar enviar la información del proyecto, catálogo, especificaciones, planos y condiciones comerciales a contacto@clipop.com.mx con el asunto "solicitud de cotizacion".

2. ENLACES Y REDES SOCIALES (siempre en formato markdown limpio [Texto](URL)):
   - 🌐 [Sitio Web Oficial](https://clipop.com.mx)
   - 📸 [Instagram Clipop Oficial](https://instagram.com/clipopoficial)
   - 🔵 [Facebook Clipop Oficial](https://facebook.com/profile.php?id=61591801231145)
   - 🟢 [WhatsApp Directo Clipop](https://wa.me/526624745958)
   - ✉️ Correo Oficial: contacto@clipop.com.mx

3. NAVEGACIÓN, CORREO DE CONTACTO Y CIERRE:
   - Al responder cualquier duda técnica o consulta, responde de forma clara y añade siempre:
     "✉️ *Si deseas enviar tu duda formal o documentación de tu proyecto por correo:* contacto@clipop.com.mx"
   - Incluye siempre al final la pregunta de continuidad con opciones claras:
     "❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
   - Si el usuario responde "Sí", pregúntale en qué más le puedes apoyar y ofrécele las opciones de servicio.
   - Si el usuario responde "No", indica que la sesión ha sido finalizada y ofrece la opción de volver al menú cuando lo desee escribiendo 'Menú' o '0'.`;

const ORIGINAL_BOT_RULES = [
  // Flujo 0: Bienvenida y Menú Principal
  {
    id: 1,
    keyword: "menu",
    match_type: "exact",
    response: "¡Hola! 👋 Muchas gracias por contactarnos, será un placer atenderte.\n\n*¿En cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 [Sitio Web Oficial](https://clipop.com.mx)\n📸 [Instagram Clipop Oficial](https://instagram.com/clipopoficial)\n🔵 [Facebook Clipop Oficial](https://facebook.com/profile.php?id=61591801231145)\n🟢 [WhatsApp Directo](https://wa.me/526624745958)\n✉️ *Correo:* contacto@clipop.com.mx\n━━━━━━━━━━━━━━━━━━━\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._"
  },
  {
    id: 2,
    keyword: "hola",
    match_type: "exact",
    response: "¡Hola! 👋 Muchas gracias por contactarnos, será un placer atenderte.\n\n*¿En cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 [Sitio Web Oficial](https://clipop.com.mx)\n📸 [Instagram Clipop Oficial](https://instagram.com/clipopoficial)\n🔵 [Facebook Clipop Oficial](https://facebook.com/profile.php?id=61591801231145)\n🟢 [WhatsApp Directo](https://wa.me/526624745958)\n✉️ *Correo:* contacto@clipop.com.mx\n━━━━━━━━━━━━━━━━━━━\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._"
  },
  {
    id: 3,
    keyword: "inicio",
    match_type: "exact",
    response: "¡Hola! 👋 Muchas gracias por contactarnos, será un placer atenderte.\n\n*¿En cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 [Sitio Web Oficial](https://clipop.com.mx)\n📸 [Instagram Clipop Oficial](https://instagram.com/clipopoficial)\n🔵 [Facebook Clipop Oficial](https://facebook.com/profile.php?id=61591801231145)\n🟢 [WhatsApp Directo](https://wa.me/526624745958)\n✉️ *Correo:* contacto@clipop.com.mx\n━━━━━━━━━━━━━━━━━━━\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._"
  },
  {
    id: 4,
    keyword: "0",
    match_type: "exact",
    response: "¡Hola! 👋 Muchas gracias por contactarnos, será un placer atenderte.\n\n*¿En cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 [Sitio Web Oficial](https://clipop.com.mx)\n📸 [Instagram Clipop Oficial](https://instagram.com/clipopoficial)\n🔵 [Facebook Clipop Oficial](https://facebook.com/profile.php?id=61591801231145)\n🟢 [WhatsApp Directo](https://wa.me/526624745958)\n✉️ *Correo:* contacto@clipop.com.mx\n━━━━━━━━━━━━━━━━━━━\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._"
  },

  // Flujo 1: Cursos pregrabados (Udemy)
  {
    id: 6,
    keyword: "1",
    match_type: "exact",
    response: "¡Excelente! 🎓 Actualmente contamos con los siguientes cursos especializados en Udemy:\n\n1️⃣ [Curso Gratuito Introductorio](https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED)\n\n2️⃣ [Precios Unitarios OPUS 22, 24, Neodata y Excel](https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/)\n\n3️⃣ [Cómo Presentar Concursos para CFE desde cero (OPUS 2020)](https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/)\n\n4️⃣ [Análisis de Precios Unitarios 100% Práctico (OPUS 2025)](https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F)\n\n🌐 [Ver Catálogo Completo en Clipop](https://clipop.com.mx/cursos)\n🎁 *Cupones de descuento y dudas:* Escríbenos a *contacto@clipop.com.mx*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 [Sitio Web](https://clipop.com.mx) | 📸 [Instagram Clipop](https://instagram.com/clipopoficial) | 🔵 [Facebook Clipop](https://facebook.com/profile.php?id=61591801231145)\n━━━━━━━━━━━━━━━━━━━\n\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
  },

  // Flujo 2: Cursos en tiempo real (Teams)
  {
    id: 9,
    keyword: "2",
    match_type: "exact",
    response: "Te invitamos a seguir nuestras redes oficiales, donde publicamos las convocatorias para los cursos en tiempo real vía *Microsoft Teams* 💻:\n\n━━━━━━━━━━━━━━━━━━━\n📸 [Instagram Clipop Oficial](https://instagram.com/clipopoficial)\n🔵 [Facebook Clipop Oficial](https://facebook.com/profile.php?id=61591801231145)\n🌐 [Sitio Web Oficial](https://clipop.com.mx)\n━━━━━━━━━━━━━━━━━━━\n\n📅 Si deseas programar un curso exclusivo en una fecha específica o resolver dudas, envíanos un correo a:\n✉️ *contacto@clipop.com.mx*\n\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
  },

  // Flujo 3: Cursos presenciales (Hermosillo)
  {
    id: 12,
    keyword: "3",
    match_type: "exact",
    response: "¡Excelente! 📍 Los cursos presenciales abiertos al público se imparten en la ciudad de *Hermosillo, Sonora*.\n\nEn nuestras redes sociales damos a conocer las próximas convocatorias, fechas y horarios:\n\n━━━━━━━━━━━━━━━━━━━\n📸 [Instagram Clipop Oficial](https://instagram.com/clipopoficial)\n🔵 [Facebook Clipop Oficial](https://facebook.com/profile.php?id=61591801231145)\n🌐 [Sitio Web Oficial](https://clipop.com.mx)\n━━━━━━━━━━━━━━━━━━━\n\n🏢 Si te interesa un curso presencial en otra ciudad o tienes dudas específicas, escríbenos a:\n✉️ *contacto@clipop.com.mx*\n\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
  },

  // Flujo 4: Cotización de proyecto de media o alta tensión
  {
    id: 15,
    keyword: "4",
    match_type: "exact",
    response: "¡Excelente! 🤝⚡ Para nosotros será un placer hacer sinergia en tu proyecto de media o alta tensión.\n\nPor favor envíanos la información técnica del proyecto (catálogo de conceptos, especificaciones, planos y condiciones comerciales) a:\n✉️ *contacto@clipop.com.mx*\n📌 Asunto: *Solicitud de cotización*\n\nNuestro equipo de ingeniería de costos se comunicará contigo a la brevedad.\n\n━━━━━━━━━━━━━━━━━━━\n🟢 [WhatsApp Asesor Directo](https://wa.me/526624745958)\n📸 [Instagram Clipop Oficial](https://instagram.com/clipopoficial)\n🔵 [Facebook Clipop Oficial](https://facebook.com/profile.php?id=61591801231145)\n━━━━━━━━━━━━━━━━━━━\n\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
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
    response: "¡Excelente! 😊 ¿En qué más te podemos apoyar o sobre qué tema es tu consulta?\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos virtuales en Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n✉️ *Correo oficial:* contacto@clipop.com.mx\n\n💡 _Escribe tu duda directamente o responde con el número (1, 2, 3 o 4)._"
  },
  {
    id: 19,
    keyword: "sí",
    match_type: "exact",
    response: "¡Excelente! 😊 ¿En qué más te podemos apoyar o sobre qué tema es tu consulta?\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos virtuales en Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n✉️ *Correo oficial:* contacto@clipop.com.mx\n\n💡 _Escribe tu duda directamente o responde con el número (1, 2, 3 o 4)._"
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
    response: "👨‍💼 *Atención con un Asesor de CLIPOP*\n\n¡Perfecto! Hemos notificado a nuestro equipo. Si deseas contacto inmediato, puedes comunicarte por:\n\n🟢 *WhatsApp Directo:* https://wa.me/526624745958\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n🌐 *Sitio Web:* https://clipop.com.mx\n✉️ *Correo:* contacto@clipop.com.mx\n\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
  },
  {
    id: 22,
    keyword: "humano",
    match_type: "contains",
    response: "👨‍💼 *Atención con un Asesor de CLIPOP*\n\nUn asesor humano del equipo de *CLIPOP* tomará la conversación a la brevedad.\n\n🟢 *WhatsApp Directo:* https://wa.me/526624745958\n🌐 *Sitio Web:* https://clipop.com.mx\n✉️ *Correo:* contacto@clipop.com.mx\n\n❓ *¿Deseas continuar con la conversación?*\n👉 *Opciones:* *'SÍ'* o *'NO'* (o escribe *0* para el menú principal)."
  }
];

const DEFAULT_PRODUCTS = [
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
    rating: "5.0",
    valoraciones: "48",
    estudiantes: "320",
    badge: "Gratuito",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description: "Curso introductorio de precios unitarios gratuito en Udemy.",
    descripcion: "Curso introductorio de precios unitarios gratuito en Udemy.",
    imagen: "/concurso_lineas.png"
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
    rating: "5.0",
    valoraciones: "52",
    estudiantes: "410",
    badge: "Más Vendido",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    description: "Domina el análisis de precios unitarios en OPUS 22, OPUS 24, Neodata y hojas de cálculo.",
    descripcion: "Domina el análisis de precios unitarios en OPUS 22, OPUS 24, Neodata y hojas de cálculo.",
    imagen: "/concurso_lineas.png"
  },
  {
    id: "3",
    name: "Cómo Presentar Concursos para CFE desde cero (OPUS 2020)",
    titulo: "Cómo Presentar Concursos para CFE desde cero (OPUS 2020)",
    category: "CURSO",
    status: "ACTIVO",
    is_active: true,
    price: 399,
    author: "FRANCISCO RAMÓN GARDEA HERNÁNDEZ",
    url: "https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/",
    enlace: "https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/",
    rating: "4.9",
    valoraciones: "36",
    estudiantes: "245",
    badge: "Destacado",
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
  }
];

module.exports = {
  SYSTEM_PROMPT: DEFAULT_SYSTEM_PROMPT,
  ORIGINAL_BOT_RULES,
  DEFAULT_PRODUCTS
};

