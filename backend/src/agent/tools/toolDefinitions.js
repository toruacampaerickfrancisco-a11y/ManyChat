const toolDeclarations = [
  {
    name: "cotizarProyecto",
    description: "Calcula y registra formalmente una solicitud de cotización técnica para proyectos de ingeniería eléctrica o civil.",
    parameters: {
      type: "OBJECT",
      properties: {
        tipoProyecto: {
          type: "STRING",
          description: "Tipo de obra (ej. 'Subestación eléctrica', 'Línea de media tensión', 'Obra civil', 'Alumbrado público', 'Estudio de Código de Red')"
        },
        voltajeNivel: {
          type: "STRING",
          description: "Nivel de tensión si se conoce (ej. '13.8 kV', '34.5 kV', '115 kV', 'Baja tensión', 'No especificado')"
        },
        ubicacion: {
          type: "STRING",
          description: "Ciudad o estado donde se ejecutará la obra si se menciona"
        },
        correoContacto: {
          type: "STRING",
          description: "Correo electrónico donde se enviará el expediente o cotización"
        }
      },
      required: ["tipoProyecto"]
    }
  },
  {
    name: "agendarAsesoria",
    description: "Agenda una sesión técnica en vivo con un ingeniero de CLIPOP o bloquea un horario para consultoría técnica.",
    parameters: {
      type: "OBJECT",
      properties: {
        fechaDeseada: {
          type: "STRING",
          description: "Fecha deseada en formato YYYY-MM-DD o día de la semana"
        },
        horaDeseada: {
          type: "STRING",
          description: "Hora aproximada (ej. '10:00 AM', '4:00 PM')"
        },
        tema: {
          type: "STRING",
          description: "Motivo de la reunión (ej. 'Duda sobre concurso CFE', 'Asesoría en OPUS', 'Revisión de plano')"
        }
      },
      required: ["tema"]
    }
  },
  {
    name: "consultarCursos",
    description: "Busca en el catálogo oficial de CLIPOP cursos de OPUS, Neodata, Concursos de CFE y precios unitarios.",
    parameters: {
      type: "OBJECT",
      properties: {
        filtroTema: {
          type: "STRING",
          description: "Palabra clave a buscar (ej. 'lineas', 'subestaciones', 'opus', 'cfe')"
        }
      }
    }
  },
  {
    name: "escalarAAgenteHumano",
    description: "Pausa el bot automático y transfiere la conversación a un ingeniero asesor humano de CLIPOP.",
    parameters: {
      type: "OBJECT",
      properties: {
        motivo: {
          type: "STRING",
          description: "Razón por la cual se transfiere a un humano (ej. 'Cliente solicita hablar con el Ing. Francisco', 'Caso complejo', 'Queja o seguimiento')"
        },
        prioridad: {
          type: "STRING",
          description: "Nivel de prioridad: 'baja', 'media', 'alta', 'urgente'"
        }
      },
      required: ["motivo"]
    }
  }
];

module.exports = {
  toolDeclarations
};
