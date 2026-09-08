const { prisma } = require('../../config/database');

async function execute(leadId, args) {
  console.log(`[Tool: agendarAsesoria] Ejecutando para Lead #${leadId}:`, args);

  const cita = {
    fecha: args.fechaDeseada || 'Próximo día hábil',
    hora: args.horaDeseada || 'Horario a convenir',
    tema: args.tema || 'Asesoría técnica general'
  };

  try {
    if (prisma && leadId) {
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          status: 'EN_CONTACTO',
          custom_data: { citaAgendada: cita }
        }
      });
    }
  } catch (error) {
    console.warn('[Tool: agendarAsesoria DB Warning]', error.message);
  }

  return {
    success: true,
    mensaje: `Sesión técnica reservada preliminarmente para el tema: '${cita.tema}' en la fecha ${cita.fecha} (${cita.hora}).`,
    cita
  };
}

module.exports = { execute };
