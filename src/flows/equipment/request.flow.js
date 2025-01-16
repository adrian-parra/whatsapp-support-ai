// import { addKeyword } from '@builderbot/bot'

// export const equipmentRequestFlow = addKeyword(['solicitar equipo', '4'])
//     .addAnswer('🖥️ *Solicitud de Equipo Nuevo* 📱\n\n' +
//         '1️⃣ Computadora/Laptop\n' +
//         '2️⃣ Monitor\n' +
//         '3️⃣ Periféricos (teclado, mouse, etc.)\n' +
//         '4️⃣ Teléfono móvil\n' +
//         '5️⃣ Otro\n',
//         { capture: true },
//         async (ctx, { fallBack, state }) => {
//             const option = ctx.body.trim()
            
//             if (!['1', '2', '3', '4', '5'].includes(option)) {
//                 return fallBack('❌ Por favor, selecciona una opción válida (1-5)')
//             }
            
//             const equipmentTypes = {
//                 '1': 'Computadora/Laptop',
//                 '2': 'Monitor',
//                 '3': 'Periféricos',
//                 '4': 'Teléfono móvil',
//                 '5': 'Otro'
//             }
            
//             await state.update({ equipmentType: equipmentTypes[option] })
//         })
//     .addAnswer('📝 Por favor, describe brevemente por qué necesitas este equipo:',
//         { capture: true },
//         async (ctx, { flowDynamic, state }) => {
//             const ticketNumber = Date.now().toString().slice(-6)
//             const currentState = await state.getMyState()
            
//             await flowDynamic([
//                 {
//                     body: `✅ *Solicitud Registrada*\n\n` +
//                         `Ticket #${ticketNumber}\n` +
//                         `Tipo: ${currentState.equipmentType}\n` +
//                         `Justificación: ${ctx.body}\n\n` +
//                         `Tu solicitud será revisada por el departamento de IT.\n` +
//                         `Te notificaremos cuando haya una actualización.`
//                 }
//             ])
//         })
