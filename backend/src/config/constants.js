module.exports = {
  SYSTEM_PROMPT: `Eres el Asistente Virtual y Asesor Técnico de Ingeniería de "CLIPOP" (Consultoría Especializada, Proyectos y Construcción), liderada por el Ing. Francisco Ramón Gardea Hernández.

Misión y Personalidad:
- Tu tono es profesional, cordial, altamente técnico pero accesible, confiable y enfocado en soluciones de ingeniería.
- Dominas temas de Ingeniería Eléctrica (Líneas de media y alta tensión, Subestaciones eléctricas, Normativas de CFE, Código de Red) y Obra Civil / Precios Unitarios (OPUS, Neodata, Concursos de obra pública y privada, Análisis de Costos Horarios y FSR).
- Ofreces cursos especializados en Udemy y asesorías directas para contratistas, ingenieros y empresas.
- Eres capaz de generar cotizaciones aproximadas de proyectos, brindar temarios de cursos y transferir la conversación a un ingeniero especialista cuando sea necesario.

Reglas de Comunicación:
1. Responde de manera concisa y clara. Usa formato markdown limpio y emojis técnicos apropiados (⚡, 🏗️, 📋, 💡).
2. Si el usuario pregunta por cursos, menciona los diplomados de OPUS, Concursos de CFE y análisis de precios unitarios.
3. Si el usuario necesita cotizar una obra o proyecto, utiliza la herramienta correspondiente para capturar los detalles técnicos.
4. Si el usuario solicita hablar con un humano o la situación requiere atención directa, utiliza la herramienta de escalamiento.`,

  DEFAULT_PRODUCTS: [
    {
      id: "C-01",
      name: "Concurso de Obra Pública para Líneas de Distribución en Media Tensión",
      titulo: "Concurso de Obra Pública para Líneas de Distribución en Media Tensión",
      category: "CURSO",
      status: "ACTIVO",
      is_active: true,
      price: 349,
      author: "FRANCISCO RAMÓN GARDEA HERNÁNDEZ",
      url: "https://www.udemy.com/course/concurso-de-obra-publica-para-lineas-de-distribucion-cfe/",
      enlace: "https://www.udemy.com/course/concurso-de-obra-publica-para-lineas-de-distribucion-cfe/",
      rating: "5.0",
      valoraciones: "48",
      estudiantes: "320",
      badge: "Más Vendido",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      description: "Aprende paso a paso a integrar una propuesta técnica y económica ganadora bajo normativa de CFE.",
      descripcion: "Aprende paso a paso a integrar una propuesta técnica y económica ganadora bajo normativa de CFE.",
      imagen: "/concurso_lineas.png"
    },
    {
      id: "C-02",
      name: "Elaboración de Propuesta Técnica y Económica para Subestación Eléctrica",
      titulo: "Elaboración de Propuesta Técnica y Económica para Subestación Eléctrica",
      category: "CURSO",
      status: "ACTIVO",
      is_active: true,
      price: 399,
      author: "FRANCISCO RAMÓN GARDEA HERNÁNDEZ",
      url: "https://www.udemy.com/course/concurso-de-obra-publica-para-subestacion-electrica-cfe/",
      enlace: "https://www.udemy.com/course/concurso-de-obra-publica-para-subestacion-electrica-cfe/",
      rating: "4.9",
      valoraciones: "36",
      estudiantes: "245",
      badge: "Destacado",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      description: "Especialízate en la cuantificación, análisis y licitación de subestaciones de potencia y media tensión.",
      descripcion: "Especialízate en la cuantificación, análisis y licitación de subestaciones de potencia y media tensión.",
      imagen: "/concurso_subestacion.png"
    }
  ]
};
