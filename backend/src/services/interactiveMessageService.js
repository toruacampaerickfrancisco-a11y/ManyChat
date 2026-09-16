// Servicio de plantillas de mensajes interactivos oficiales para WhatsApp y Messenger

const BANNER_URL = 'https://clipop.com.mx/avatar-torre/Avatar_Torre_Estilo_Pixar.jpg';

function buildWelcomeCard(senderName = '') {
  const nameGreeting = senderName ? ` *${senderName}*` : '';

  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'image',
        image: {
          link: BANNER_URL
        }
      },
      body: {
        text: `⚡ *¡Hola${nameGreeting}! Bienvenido a CLIPOP.* ¿En qué te podemos apoyar hoy?\n\n1️⃣ *Cursos pregrabados (Udemy)*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales (Hermosillo)*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n_Escribe el número de la opción o presiona un botón:_`
      },
      footer: {
        text: 'CLIPOP • clipop.com.mx'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'btn_cursos',
              title: '1️⃣ Cursos (Udemy)'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'btn_teams',
              title: '2️⃣ Teams en Vivo'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'btn_cotizar',
              title: '4️⃣ Cotizar Proyecto'
            }
          }
        ]
      }
    }
  };
}

function buildCoursesCard() {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'image',
        image: {
          link: 'https://clipop.com.mx/concurso_lineas.png'
        }
      },
      body: {
        text: `🎓 *CURSOS ESPECIALIZADOS EN UDEMY*\n\n1️⃣ *Curso Gratuito Introductorio APU*\n👉 https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED\n\n2️⃣ *Precios Unitarios OPUS 22, 24, Neodata y Excel*\n👉 https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/\n\n3️⃣ *Cómo Presentar Concursos para CFE (OPUS 2020)*\n👉 https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/\n\n4️⃣ *Análisis de Precios Unitarios (OPUS 2025)*\n👉 https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F\n\n5️⃣ *Opus 2020. Análisis de Precios Unitarios*\n👉 https://www.udemy.com/course/opus-2020-analisis-de-precios-unitarios/?referralCode=37ABE3618B5C83C37D65\n\n🌐 *Catálogo Completo:* https://clipop.com.mx/cursos\n✉️ *Dudas y cupones:* contacto@clipop.com.mx`
      },
      footer: {
        text: 'CLIPOP • Ingeniería de Costos'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'btn_cotizar',
              title: '⚡ Cotizar Proyecto'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'btn_asesor',
              title: '👤 Asesor Humano'
            }
          }
        ]
      }
    }
  };
}

function buildQuotationCard() {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'image',
        image: {
          link: 'https://clipop.com.mx/concurso_subestacion.png'
        }
      },
      body: {
        text: `⚡ *COTIZACIÓN DE PROYECTOS DE MEDIA O ALTA TENSIÓN*\n\nPara cotizar un proyecto, por favor envíanos la información técnica (catálogo de conceptos, especificaciones, planos y condiciones comerciales) a:\n\n✉️ *contacto@clipop.com.mx*\n📌 Asunto: *Solicitud de cotización*\n\nNuestro equipo de ingeniería de costos se comunicará a la brevedad.`
      },
      footer: {
        text: 'Ingeniería y Consultoría CLIPOP'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'btn_cursos',
              title: '📚 Ver Cursos'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'btn_asesor',
              title: '👤 Asesor Humano'
            }
          }
        ]
      }
    }
  };
}

module.exports = {
  buildWelcomeCard,
  buildCoursesCard,
  buildQuotationCard
};
