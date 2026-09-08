const { prisma } = require('../../config/database');

async function execute(leadId, args) {
  const motivo = args.motivo || 'Solicitud de atención humana';
  const prioridad = args.prioridad || 'media';
  console.log(`[Tool: escalarAAgenteHumano] Pausando bot para Lead #${leadId}. Motivo: ${motivo}, Prioridad: ${prioridad}`);

  try {
    if (prisma && leadId) {
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          bot_paused: true,
          sentiment: prioridad === 'urgente' ? 'urgente' : 'interesado'
        }
      });
    }
  } catch (error) {
    console.warn('[Tool: escalarAAgenteHumano DB Warning]', error.message);
  }

  return {
    success: true,
    mensaje: "El bot ha sido pausado temporalmente. Un ingeniero de CLIPOP tomará el control de la conversación a la brevedad.",
    motivo,
    prioridad
  };
}

module.exports = { execute };
