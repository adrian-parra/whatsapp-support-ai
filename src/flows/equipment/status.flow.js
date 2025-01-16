// import { addKeyword } from '@builderbot/bot'

// export const equipmentStatusFlow = addKeyword(['estado equipo', 'status equipo'])
//     .addAnswer('🔍 *Consulta de Estado de Solicitud* 📋\n\n' +
//         'Por favor, ingresa el número de ticket de tu solicitud:',
//         { capture: true },
//         async (ctx, { flowDynamic }) => {
//             const ticketNumber = ctx.body.trim()
            
//             // Aquí normalmente consultarías una base de datos
//             // Por ahora, simulamos una respuesta
//             await flowDynamic([
//                 {
//                     body: `🎫 *Ticket #${ticketNumber}*\n\n` +
//                         `Estado: En revisión\n` +
//                         `Última actualización: ${new Date().toLocaleDateString()}\n\n` +
//                         `Tu solicitud está siendo evaluada por el departamento correspondiente.`
//                 }
//             ])
//         })
