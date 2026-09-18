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
        text: `⚡ *¡Hola${nameGreeting}! Bienvenido a CLIPOP.* ¿En qué te podemos apoyar hoy?\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales (Hermosillo)*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n_Escribe el número de la opción o presiona un botón:_`
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
              title: '1️⃣ Cursos pregrabados'
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
        text: `🎓 *CURSOS PREGRABADOS - CLIPOP*

⭐ *NUESTRO CURSO MÁS COMPLETO:*
👉 https://go.hotmart.com/K93054265G

🎁 *¡BENEFICIO EXCLUSIVO!*
Al adquirir nuestro curso más completo, tienes acceso a *todos nuestros cursos especializados incluidos sin costo adicional*:
• Precios Unitarios OPUS 22, 24, Neodata y Excel
• Cómo Presentar Concursos para CFE desde cero
• Análisis de Precios Unitarios 100% Práctico (OPUS 2025)
• OPUS 2020. Análisis de Precios Unitarios
• Curso Gratuito Introductorio APU

🌐 *Ver Catálogo Completo:* https://clipop.com.mx/cursos
📧 *Dudas y asesoría:* contacto@clipop.com.mx`
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
