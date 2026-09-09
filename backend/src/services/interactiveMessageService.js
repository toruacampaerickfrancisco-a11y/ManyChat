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
        text: `⚡ *¡Hola${nameGreeting}! Bienvenido a CLIPOP Ingeniería y Consultoría.*\n\nSoy *Nikola*, tu asesor técnico virtual. Estamos especializados en proyectos de media/alta tensión de CFE y cursos de precios unitarios con OPUS 2025.\n\n¿En qué podemos apoyarte hoy? Selecciona una opción:`
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
              title: '📚 Cursos OPUS / CFE'
            }
          },
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
        text: `🎓 *CATÁLOGO DE CURSOS Y DIPLOMADOS OFICIALES*\n\n1️⃣ *Concurso de Obra para Líneas de Distribución CFE*\n👉 https://www.udemy.com/course/concurso-de-obra-publica-para-lineas-de-distribucion-cfe/\n\n2️⃣ *Propuesta Técnica y Económica para Subestaciones Eléctricas*\n👉 https://www.udemy.com/course/concurso-de-obra-publica-para-subestacion-electrica-cfe/\n\n✅ Acceso de por vida en Udemy\n✅ Certificado oficial\n✅ Archivos de trabajo y catálogos en OPUS incluidos.`
      },
      footer: {
        text: 'Instructores Certificados CFE & OPUS'
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
              title: '👤 Hablar con Asesor'
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
        text: `⚡ *COTIZACIÓN DE PROYECTOS Y CONSULTORÍA TÉCNICA*\n\nRealizamos estudios, ingeniería y construcción para:\n• 🏗️ Subestaciones Eléctricas (Media y Alta Tensión)\n• ⚡ Líneas de Distribución Aéreas y Subterráneas\n• 📋 Integración de Licitaciones y Precios Unitarios (OPUS)\n• 📊 Estudios de Código de Red y Calidad de Energía\n\n_Por favor, indícanos el tipo de proyecto, ubicación o compártenos tu plano/catálogo de conceptos en este chat._`
      },
      footer: {
        text: 'Ing. Francisco Ramón Gardea Hernández'
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
              title: '👤 Transferir a Ingeniero'
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
