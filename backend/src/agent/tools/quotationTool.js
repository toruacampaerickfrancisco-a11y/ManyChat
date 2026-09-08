const { prisma } = require('../../config/database');

async function execute(leadId, args) {
  console.log(`[Tool: cotizarProyecto] Ejecutando para Lead #${leadId}:`, args);

  const quotationData = {
    tipoProyecto: args.tipoProyecto || 'Ingeniería General',
    voltajeNivel: args.voltajeNivel || 'No especificado',
    ubicacion: args.ubicacion || 'No especificada',
    correoContacto: args.correoContacto || 'Pendiente',
    fechaSolicitud: new Date().toISOString()
  };

  try {
    if (prisma && leadId) {
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          status: 'COTIZADO',
          custom_data: quotationData
        }
      });
    }
  } catch (error) {
    console.warn('[Tool: cotizarProyecto DB Warning]', error.message);
  }

  return {
    success: true,
    mensaje: `Solicitud de cotización registrada exitosamente para '${quotationData.tipoProyecto}' (${quotationData.voltajeNivel}). Un ingeniero revisará las especificaciones.`,
    detalles: quotationData
  };
}

module.exports = { execute };
