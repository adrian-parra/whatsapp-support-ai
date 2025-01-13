import "dotenv/config" 
//import { join } from 'path'
import fetch, { Headers } from 'node-fetch';
// Hacer fetch y Headers globales
globalThis.fetch = fetch;
globalThis.Headers = Headers;
import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { flows } from "./flows/index.js"
import "./tasks/notificationScheduler.task.js"

//import { toAskGemini} from './ai/gemini.js'
//import { fromAudioToText } from './ai/groq.js'
//import ffmpeg from 'fluent-ffmpeg'
//import { unlink } from 'fs/promises'
//import { chatWithAI } from './ai/openia.js'
//import { chatWithAI21 } from './ai/ai21studio.js'
//import { toAudio } from './ai/eleventlab.js'
const PORT = process.env.PORT ?? 3008






/**
 * @description Flujo de bienvenida del bot que maneja los mensajes iniciales de los usuarios
 * @constant {Flow} welcomeFlow
 * @listens {EVENTS.WELCOME} Se activa cuando un usuario inicia una conversación
 * @example
 * // El flujo se activa automáticamente cuando un usuario envía un mensaje inicial
 * // Ejemplo de uso interno del bot:
 * bot.dispatch(EVENTS.WELCOME, { from: "123456789" })
 * 
 * @returns {Flow} Retorna un objeto Flow configurado para el manejo de mensajes de bienvenida
 */
// const welcomeFlow = addKeyword(EVENTS.WELCOME)
//     .addAction(async (ctx, { flowDynamic }) => {
//         // Obtiene el mensaje del usuario del contexto
//         const message = ctx.body
        
//         // Envía el mensaje a Gemini para procesamiento
//         // El array vacío [] indica que no hay historial de conversación previo
//         //const textConvertedItaliano = await toAskGemini({message,history: []})

//         // Envía la respuesta procesada de vuelta al usuario
//         //const textEntrenadorPersonal = await toAskEntrenadorPersonal({message,history: []})
//         // Envía la respuesta procesada de vuelta al usuario
//         //await flowDynamic(textEntrenadorPersonal)
//         //const textIngenieroDeSoftware = await toAskIngenieroDeSoftware({message,history: []})
//         //await flowDynamic(textIngenieroDeSoftware)
//         // try {
//         //     const textOpenIA = await chatWithAI(message)
//         //     await flowDynamic(textOpenIA)
//         // } catch (error) {
//         //     await flowDynamic('*¡Lo sentimos!* 🔧\n\nDisculpe, en este momento estamos experimentando dificultades técnicas para procesar su solicitud.\n\nLe agradecemos su comprensión y le invitamos a intentarlo nuevamente en unos momentos. 🙏\n\n_El equipo de soporte está trabajando para resolver este inconveniente._')
//         // }
//         try {
//             const textAI21 = await chatWithAI21({message})
//             await flowDynamic(textAI21)
//         } catch (error) {
//             await flowDynamic('*¡Lo sentimos!* 🔧\n\nDisculpe, en este momento estamos experimentando dificultades técnicas para procesar su solicitud.\n\nLe agradecemos su comprensión y le invitamos a intentarlo nuevamente en unos momentos. 🙏\n\n_El equipo de soporte está trabajando para resolver este inconveniente._')
//         }
//     })

// const voiceFlow = addKeyword(EVENTS.VOICE_NOTE)
//     .addAction(async (ctx, { provider, flowDynamic }) => {
//         const storagePath = join(process.cwd(), 'storage')
//         const originalFilePath = await provider.saveFile(ctx, { path: storagePath })
        
//         // Crear el nombre del archivo convertido
//         const wavFilePath = originalFilePath.replace('.oga', '.wav')
        
//         // Convertir el archivo usando ffmpeg
//         await new Promise((resolve, reject) => {
//             ffmpeg(originalFilePath)
//                 .toFormat('wav')
//                 .on('end', async () => {
//                     // Eliminar el archivo .oga original después de la conversión
//                     await unlink(originalFilePath)
//                     resolve()
//                 })
//                 .on('error', (err) => reject(err))
//                 .save(wavFilePath)
//         })
        
//         const textConverted = await fromAudioToText(wavFilePath)
//         const textConvertedItaliano = await toAskGemini({message: textConverted, history: []})
//         //const audioResponse = await toAudio(textConvertedItaliano)
        
//         //const fileName = `audio-${Date.now()}.mp3`;
//         //const filePath = join(process.cwd(), 'storage', fileName);
//         //console.log(filePath)

//         //await writeFile(filePath, audioResponse);

//         await flowDynamic(`Original: ${textConverted}`)
//         await flowDynamic(`Italiano: ${textConvertedItaliano}`)
//         //await flowDynamic([{ media: filePath }])

//         //await unlink(filePath)
//         await unlink(wavFilePath)

//     })

/**
 * 
**/
// const registerFlow = addKeyword(utils.setEvent('REGISTER_FLOW'))
//     .addAnswer(`What is your name?`, { capture: true }, async (ctx, { state }) => {
//         await state.update({ name: ctx.body })
//     })
//     .addAnswer('What is your age?', { capture: true }, async (ctx, { state }) => {
//         await state.update({ age: ctx.body })
//     })
//     .addAction(async (_, { flowDynamic, state }) => {
//         await flowDynamic(`${state.get('name')}, thanks for your information!: Your age: ${state.get('age')}`)
//     })

// const fullSamplesFlow = addKeyword(['samples', utils.setEvent('SAMPLES')])
//     .addAnswer(`💪 I'll send you a lot files...`)
//     .addAnswer(`Send image from Local`, { media: join(process.cwd(), 'assets', 'sample.png') })
//     .addAnswer(`Send video from URL`, {
//         media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJ0ZGdjd2syeXAwMjQ4aWdkcW04OWlqcXI3Ynh1ODkwZ25zZWZ1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LCohAb657pSdHv0Q5h/giphy.mp4',
//     })
//     .addAnswer(`Send audio from URL`, { media: 'https://cdn.freesound.org/previews/728/728142_11861866-lq.mp3' })
//     .addAnswer(`Send file from URL`, {
//         media: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
//     })

// const menuFlow = addKeyword(['menu', 'opciones', 'ayuda'])
//     .addAnswer('🎯 *MENÚ PRINCIPAL* 🎯\n' +
//         'Selecciona una opción escribiendo el número:\n\n' +
//         '1️⃣ *Información general*\n' +
//         '2️⃣ *Servicios*\n' +
//         '3️⃣ *Contacto*\n' +
//         '4️⃣ *Horarios*\n' +
//         '5️⃣ *Volver al menú*\n')
//     .addAnswer('Escribe el número de la opción que deseas consultar:', { capture: true },
//         async (ctx, { fallBack, flowDynamic }) => {
//             const option = ctx.body.trim()

//             switch (option) {
//                 case '1':
//                     await flowDynamic('📌 *Información General*\nAquí va la información de tu empresa...')
//                     break
//                 case '2':
//                     await flowDynamic('🛠️ *Nuestros Servicios*\n1. Servicio A\n2. Servicio B\n3. Servicio C')
//                     break
//                 case '3':
//                     await flowDynamic('📞 *Contacto*\nTeléfono: +XX XXXX XXXX\nEmail: ejemplo@email.com')
//                     break
//                 case '4':
//                     await flowDynamic('⏰ *Horarios de Atención*\nLunes a Viernes: 9:00 - 18:00\nSábados: 9:00 - 13:00')
//                     break
//                 case '5':
//                     // Volver a mostrar el menú
//                     return fallBack()
//                 default:
//                     await flowDynamic('❌ Opción no válida. Por favor, selecciona un número del 1 al 5.')
//                     return fallBack()
//             }
//         })

// Nuevo flujo para problemas comunes de red
// const networkHelpFlow = addKeyword(['red ayuda', 'reed ayuda', 'red help', 'ayuda red'])
//     .addAnswer('🌐 *GUÍA RÁPIDA DE PROBLEMAS DE RED*\n\n' +
//         '1️⃣ *Verificación básica:*\n' +
//         '- Revisa si el cable de red está conectado\n' +
//         '- Confirma que el WiFi esté activado\n' +
//         '- Intenta reiniciar el router\n\n' +
//         '2️⃣ *Pasos para reiniciar la conexión:*\n' +
//         '1. Desconecta el cable de red\n' +
//         '2. Espera 30 segundos\n' +
//         '3. Reconecta el cable\n' +
//         '4. Espera 2 minutos\n\n' +
//         '❓ ¿Deseas realizar una prueba de conexión?\n' +
//         'Escribe: "test red"')

// const supportFlow = addKeyword(['soporte', 'ayuda', 'help', 'it'])
//     .addAnswer('🖥️ *SISTEMA DE SOPORTE TÉCNICO* 🛠️\n' +
//         'Bienvenido al sistema de soporte. ¿En qué podemos ayudarte?\n\n' +
//         '1️⃣ *Problemas con Hardware*\n' +
//         '2️⃣ *Problemas con Software*\n' +
//         '3️⃣ *Accesos y Credenciales*\n' +
//         '4️⃣ *Solicitar Equipo Nuevo*\n' +
//         '5️⃣ *Reportar Incidente*\n' +
//         '6️⃣ *Estado de Ticket*\n' +
//         '7️⃣ *FAQ/Ayuda Rápida*\n' +
//         '8️⃣ *Volver al menú principal*\n')
//     .addAnswer('Por favor, escribe el número de la opción que necesitas:', { capture: true },
//         async (ctx, { fallBack, flowDynamic }) => {
//             const option = ctx.body.trim()

//             switch (option) {
//                 case '1':
//                     await flowDynamic('🔧 *PROBLEMAS DE HARDWARE*\n\n' +
//                         '1. Problemas con la laptop\n' +
//                         '2. Problemas con monitor/periféricos\n' +
//                         '3. Problemas de batería\n' +
//                         '4. Problemas de red/conexión\n\n' +
//                         'Para reportar un problema específico, escribe:\n' +
//                         '"reportar hardware: [descripción del problema]"')
//                     break
//                 case '2':
//                     await flowDynamic('💻 *PROBLEMAS DE SOFTWARE*\n\n' +
//                         '1. Problemas con Windows/macOS\n' +
//                         '2. Problemas con aplicaciones corporativas\n' +
//                         '3. Actualizaciones pendientes\n' +
//                         '4. Antivirus/Seguridad\n\n' +
//                         'Para reportar un problema específico, escribe:\n' +
//                         '"reportar software: [descripción del problema]"')
//                     break
//                 case '3':
//                     await flowDynamic('🔑 *ACCESOS Y CREDENCIALES*\n\n' +
//                         '• Para restablecer contraseña: "reset password"\n' +
//                         '• Para acceso a VPN: "solicitar vpn"\n' +
//                         '• Para acceso a sistemas: "acceso [nombre del sistema]"\n\n' +
//                         '📞 Contacto directo soporte:\n' +
//                         'Tel: +XX XXXX XXXX\n' +
//                         'Email: soporte@tuempresa.com')
//                     break
//                 case '4':
//                     await flowDynamic('📋 *SOLICITUD DE EQUIPO NUEVO*\n\n' +
//                         'Para iniciar una solicitud, necesitamos:\n' +
//                         '1. Nombre completo\n' +
//                         '2. Departamento\n' +
//                         '3. Justificación\n' +
//                         '4. Aprobación de supervisor\n\n' +
//                         'Escribe "nueva solicitud" para comenzar el proceso')
//                     break
//                 case '5':
//                     await flowDynamic('🚨 *REPORTAR INCIDENTE*\n\n' +
//                         'Por favor, proporciona:\n' +
//                         '1. Tipo de incidente\n' +
//                         '2. Descripción detallada\n' +
//                         '3. Nivel de urgencia\n\n' +
//                         'Formato: "incidente: [descripción]"\n\n' +
//                         '⚠️ Para emergencias, llamar directamente al: +XX XXXX XXXX')
//                     break
//                 case '6':
//                     await flowDynamic('🔍 *CONSULTA DE TICKET*\n\n' +
//                         'Para consultar el estado de tu ticket:\n' +
//                         '1. Escribe "estado #[número de ticket]"\n' +
//                         '2. Te informaremos:\n' +
//                         '   - Estado actual\n' +
//                         '   - Técnico asignado\n' +
//                         '   - Tiempo estimado de resolución\n' +
//                         '   - Últimas actualizaciones\n\n' +
//                         'Ejemplo: estado #123456')
//                     break
//                 case '7':
//                     await flowDynamic('📚 *PREGUNTAS FRECUENTES*\n\n' +
//                         '1. *Problemas comunes de red*\n' +
//                         '   Escribe: "red ayuda"\n\n' +
//                         '2. *Restablecer contraseña*\n' +
//                         '   Escribe: "password reset"\n\n' +
//                         '3. *Problemas de impresora*\n' +
//                         '   Escribe: "impresora ayuda"\n\n' +
//                         '4. *Acceso VPN*\n' +
//                         '   Escribe: "vpn guía"\n\n' +
//                         '5. *Software corporativo*\n' +
//                         '   Escribe: "software lista"')
//                     break
//                 case '8':
//                     return fallBack()
//                 default:
//                     await flowDynamic('❌ Opción no válida. Por favor, selecciona un número del 1 al 8.')
//                     return fallBack()
//             }
//         })

// Flujo para reportes de hardware
// const hardwareReportFlow = addKeyword('reportar hardware:')
//     .addAction(async (ctx, { flowDynamic }) => {
//         const report = ctx.body.replace('reportar hardware:', '').trim()
//         await flowDynamic(`✅ *Reporte de Hardware Registrado*\n\n` +
//             `Ticket #${Date.now().toString().slice(-6)}\n` +
//             `Problema: ${report}\n\n` +
//             `Un técnico se pondrá en contacto contigo pronto.\n` +
//             `Tiempo estimado de respuesta: 2-4 horas hábiles.`)
//     })

// Flujo para reportes de software
// const softwareReportFlow = addKeyword('reportar software:')
//     .addAction(async (ctx, { flowDynamic, provider }) => {
//         const report = ctx.body.replace('reportar software:', '').trim()
//         const ticketNumber = Date.now().toString().slice(-6)
        
//         // Mensaje para el usuario
//         await flowDynamic(`✅ *Reporte de Software Registrado*\n\n` +
//             `Ticket #${ticketNumber}\n` +
//             `Problema: ${report}\n\n` +
//             `Un técnico se pondrá en contacto contigo pronto.\n` +
//             `Tiempo estimado de respuesta: 1-3 horas hábiles.`)
        
//         // Notificación para el técnico
//         const technicianNumber = process.env.TECHNICIAN_PHONE
//         const notificationMessage = `🔔 *Nuevo Ticket de Software*\n\n` +
//             `Ticket #${ticketNumber}\n` +
//             `Usuario: ${ctx.from}\n` +
//             `Problema: ${report}\n\n` +
//             `Por favor, revisa este caso lo antes posible.`
            
//         await provider.sendText(
//             `${technicianNumber}@c.us`,
//             notificationMessage
//         )
//     })

// Nuevo flujo para consulta de estado de tickets
// const ticketStatusFlow = addKeyword('estado #')
//     .addAction(async (ctx, { flowDynamic }) => {
//         const ticketNumber = ctx.body.replace('estado #', '').trim()
//         // Aquí irías a tu base de datos para obtener la información real del ticket
//         await flowDynamic(`🎫 *Estado del Ticket #${ticketNumber}*\n\n` +
//             `Estado: 🟡 En Proceso\n` +
//             `Técnico: Juan Pérez\n` +
//             `Prioridad: Media\n` +
//             `Creado: ${new Date().toLocaleDateString()}\n` +
//             `Última actualización: Hace 2 horas\n\n` +
//             `📝 *Últimas notas:*\n` +
//             `- Se está analizando el problema\n` +
//             `- Se solicitaron recursos adicionales\n\n` +
//             `⏱️ Tiempo estimado de resolución: 4 horas`)
//     })

// Base de conocimientos con soluciones comunes
// const knowledgeBase = {
//     'vpn': {
//         title: '🔒 Guía de Conexión VPN',
//         steps: [
//             '1. Abrir FortiClient VPN',
//             '2. Seleccionar perfil corporativo',
//             '3. Ingresar usuario de dominio',
//             '4. Ingresar contraseña',
//             '5. Hacer clic en "Conectar"'
//         ],
//         troubleshooting: [
//             '- Si aparece "Error de autenticación": Verificar credenciales',
//             '- Si muestra "Error de conexión": Revisar internet',
//             '- Si dice "Tiempo agotado": Contactar a soporte'
//         ],
//         docs: 'https://docs.empresa.com/vpn-guide',
//         video: 'https://videos.empresa.com/vpn-tutorial'
//     },
//     'impresora': {
//         title: '🖨️ Solución de Problemas de Impresora',
//         steps: [
//             '1. Verificar conexión de cables',
//             '2. Confirmar papel disponible',
//             '3. Revisar cola de impresión',
//             '4. Reiniciar servicio de impresión'
//         ],
//         troubleshooting: [
//             '- Papel atascado: Seguir guía en pantalla',
//             '- Error de conexión: Verificar red',
//             '- Calidad baja: Revisar tóner'
//         ],
//         docs: 'https://docs.empresa.com/printer-guide',
//         video: 'https://videos.empresa.com/printer-help'
//     },
//     'outlook': {
//         title: '📧 Problemas con Outlook',
//         steps: [
//             '1. Verificar conexión a internet',
//             '2. Reiniciar Outlook',
//             '3. Comprobar espacio en buzón',
//             '4. Actualizar credenciales'
//         ],
//         troubleshooting: [
//             '- Si no envía correos: Verificar servidor SMTP',
//             '- Si no recibe: Revisar filtros de spam',
//             '- Si está lento: Compactar PST'
//         ],
//         docs: 'https://docs.empresa.com/outlook-guide',
//         video: 'https://videos.empresa.com/outlook-tutorial'
//     }
// }

// Flujo para consultar la base de conocimientos
// const knowledgeBaseFlow = addKeyword(['ayuda', 'guía', 'como'])
//     .addAction(async (ctx, { flowDynamic }) => {
//         const message = ctx.body.toLowerCase()
//         let topic = null

//         // Detectar el tema de la consulta
//         if (message.includes('vpn')) topic = 'vpn'
//         if (message.includes('impresora')) topic = 'impresora'
//         if (message.includes('outlook')) topic = 'outlook'

//         if (topic && knowledgeBase[topic]) {
//             const kb = knowledgeBase[topic]
            
//             await flowDynamic(`*${kb.title}*\n\n` +
//                 `📝 *Pasos a seguir:*\n${kb.steps.join('\n')}\n\n` +
//                 `⚠️ *Solución de problemas:*\n${kb.troubleshooting.join('\n')}\n\n` +
//                 `📚 *Recursos adicionales:*\n` +
//                 `- Documentación: ${kb.docs}\n` +
//                 `- Video tutorial: ${kb.video}\n\n` +
//                 `Si necesitas ayuda adicional, escribe "soporte" para hablar con un técnico.`)
//         } else {
//             await flowDynamic('Lo siento, no encontré información específica sobre ese tema. ' +
//                 'Puedes consultar sobre:\n' +
//                 '- VPN\n' +
//                 '- Impresora\n' +
//                 '- Outlook\n' +
//                 'O escribe "soporte" para hablar con un técnico.')
//         }
//     })

// Nuevo flujo para solicitudes de equipo con seguimiento
// const equipmentRequestFlow = addKeyword(['solicitar equipo', 'equipo nuevo'])
//     .addAnswer('📋 *SOLICITUD DE EQUIPO NUEVO*\n' +
//         'Para procesar tu solicitud, necesito algunos datos.')
//     .addAnswer('Por favor, indica tu departamento:', { capture: true }, 
//         async (ctx, { state }) => {
//             await state.update({ department: ctx.body })
//         })
//     .addAnswer('¿Qué tipo de equipo necesitas?\n' +
//         '1. Laptop\n' +
//         '2. Desktop\n' +
//         '3. Monitor\n' +
//         '4. Otro', 
//         { capture: true },
//         async (ctx, { state }) => {
//             await state.update({ equipmentType: ctx.body })
//         })
//     .addAnswer('Describe brevemente la justificación de la solicitud:', 
//         { capture: true },
//         async (ctx, { state, flowDynamic }) => {
//             const requestData = {
//                 department: state.get('department'),
//                 equipmentType: state.get('equipmentType'),
//                 justification: ctx.body,
//                 requestId: Date.now().toString().slice(-6)
//             }
            
//             await flowDynamic(`✅ *Solicitud Registrada*\n\n` +
//                 `ID: #${requestData.requestId}\n` +
//                 `Departamento: ${requestData.department}\n` +
//                 `Equipo: ${requestData.equipmentType}\n` +
//                 `Estado: Pendiente de aprobación\n\n` +
//                 `Te notificaremos cuando haya una actualización.`)
            
//             // Notificar al administrador
//             // ... código para notificar ...
//         })

// Flujo de autodiagnóstico
// const diagnosticFlow = addKeyword(['diagnóstico', 'diagnosticar', 'revisar'])
//     .addAnswer('🔍 *Iniciando Diagnóstico del Sistema*\n' +
//         'Voy a realizar algunas pruebas básicas...')
//     .addAction(async (ctx, { flowDynamic }) => {
//         // Simulamos la ejecución de diagnósticos
//         await flowDynamic('⚡ *Ejecutando pruebas de red...*')
//         await new Promise(resolve => setTimeout(resolve, 2000))

//         await flowDynamic('🖥️ *Verificando estado del sistema...*')
//         await new Promise(resolve => setTimeout(resolve, 2000))

//         // Resultados del diagnóstico
//         const diagnosticResults = {
//             network: {
//                 status: '✅ Conectado',
//                 speed: '100 Mbps',
//                 latency: '15ms'
//             },
//             system: {
//                 cpu: '45%',
//                 memory: '60%',
//                 disk: '75%'
//             },
//             services: {
//                 email: '✅ Activo',
//                 vpn: '✅ Disponible',
//                 printer: '⚠️ Requiere atención'
//             }
//         }

//         // Enviar resumen del diagnóstico
//         await flowDynamic(`📊 *Resultados del Diagnóstico*\n\n` +
//             `*Red:*\n` +
//             `- Estado: ${diagnosticResults.network.status}\n` +
//             `- Velocidad: ${diagnosticResults.network.speed}\n` +
//             `- Latencia: ${diagnosticResults.network.latency}\n\n` +
//             `*Sistema:*\n` +
//             `- CPU: ${diagnosticResults.system.cpu}\n` +
//             `- Memoria: ${diagnosticResults.system.memory}\n` +
//             `- Disco: ${diagnosticResults.system.disk}\n\n` +
//             `*Servicios:*\n` +
//             `- Email: ${diagnosticResults.services.email}\n` +
//             `- VPN: ${diagnosticResults.services.vpn}\n` +
//             `- Impresora: ${diagnosticResults.services.printer}`)

//         // Analizar resultados y dar recomendaciones
//         const recommendations = []
        
//         if (parseInt(diagnosticResults.system.cpu.replace('%', '')) > 80) {
//             recommendations.push('❗ Alto uso de CPU. Considere cerrar aplicaciones innecesarias.')
//         }
        
//         if (parseInt(diagnosticResults.system.memory.replace('%', '')) > 90) {
//             recommendations.push('❗ Memoria RAM crítica. Reinicie su equipo.')
//         }
        
//         if (parseInt(diagnosticResults.system.disk.replace('%', '')) > 90) {
//             recommendations.push('❗ Espacio en disco bajo. Libere espacio.')
//         }

//         if (recommendations.length > 0) {
//             await flowDynamic(`\n⚠️ *Recomendaciones:*\n${recommendations.join('\n')}`)
//         }

//         // Preguntar si necesita ayuda adicional
//         await flowDynamic('\n¿Necesita ayuda adicional con algún problema específico?\n' +
//             '1️⃣ Problemas de red\n' +
//             '2️⃣ Problemas de rendimiento\n' +
//             '3️⃣ Problemas de servicios\n' +
//             '4️⃣ Hablar con un técnico\n\n' +
//             'Responda con el número de la opción deseada.')
//     })
//     .addAction({
//         capture: true
//     }, async (ctx, { flowDynamic }) => {
//         const option = ctx.body.trim()

//         switch (option) {
//             case '1':
//                 await flowDynamic('🌐 *Solución de Problemas de Red*\n\n' +
//                     '1. Reinicie su router\n' +
//                     '2. Verifique la conexión del cable\n' +
//                     '3. Ejecute el comando "ipconfig /renew"\n\n' +
//                     'Si el problema persiste, escriba "soporte red"')
//                 break
//             case '2':
//                 await flowDynamic('⚡ *Mejora del Rendimiento*\n\n' +
//                     '1. Cierre programas no utilizados\n' +
//                     '2. Elimine archivos temporales\n' +
//                     '3. Ejecute el desfragmentador\n\n' +
//                     'Si necesita más ayuda, escriba "soporte sistema"')
//                 break
//             case '3':
//                 await flowDynamic('🔧 *Verificación de Servicios*\n\n' +
//                     '1. Reinicie los servicios afectados\n' +
//                     '2. Verifique credenciales\n' +
//                     '3. Actualice controladores\n\n' +
//                     'Para asistencia, escriba "soporte servicios"')
//                 break
//             case '4':
//                 await flowDynamic('👨‍💻 *Contactando Soporte Técnico*\n\n' +
//                     'Un técnico se pondrá en contacto con usted pronto.\n' +
//                     'Ticket #' + Date.now().toString().slice(-6))
//                 break
//             default:
//                 await flowDynamic('❌ Opción no válida. Por favor, seleccione un número del 1 al 4.')
//         }
//     })

// Sistema de feedback para tickets cerrados
// const feedbackFlow = addKeyword(['cerrar ticket', 'finalizar ticket'])
//     .addAnswer('🎫 Por favor, ingresa el número de ticket que deseas cerrar:', 
//         { capture: true },
//         async (ctx, { state }) => {
//             const ticketNumber = ctx.body.trim()
//             await state.update({ ticketNumber })
//         })
//     .addAnswer('⭐ ¿Cómo calificarías la atención recibida?\n\n' +
//         '1 = Muy insatisfecho 😠\n' +
//         '2 = Insatisfecho ☹️\n' +
//         '3 = Neutral 😐\n' +
//         '4 = Satisfecho 😊\n' +
//         '5 = Muy satisfecho 😄\n\n' +
//         'Responde con un número del 1 al 5:', 
//         { capture: true },
//         async (ctx, { state }) => {
//             const rating = parseInt(ctx.body)
//             if (rating >= 1 && rating <= 5) {
//                 await state.update({ rating })
//             } else {
//                 return false // Volver a pedir calificación si no es válida
//             }
//         })
//     .addAnswer('📝 ¿Qué podríamos mejorar? (Escribe tu comentario o "skip" para omitir):', 
//         { capture: true },
//         async (ctx, { state, flowDynamic, provider }) => {
//             const feedback = {
//                 ticketNumber: state.get('ticketNumber'),
//                 rating: state.get('rating'),
//                 comment: ctx.body !== 'skip' ? ctx.body : 'Sin comentarios',
//                 timestamp: new Date().toISOString(),
//                 userId: ctx.from
//             }

//             // Mensaje de agradecimiento al usuario
//             await flowDynamic(`✅ *¡Gracias por tu feedback!*\n\n` +
//                 `Ticket: #${feedback.ticketNumber}\n` +
//                 `Calificación: ${'⭐'.repeat(feedback.rating)}\n` +
//                 `Tu opinión nos ayuda a mejorar nuestro servicio.`)

//             // Notificar al supervisor sobre el feedback
//             const supervisorNumber = process.env.SUPERVISOR_PHONE
//             const supervisorMessage = `📊 *Nuevo Feedback Recibido*\n\n` +
//                 `Ticket: #${feedback.ticketNumber}\n` +
//                 `Calificación: ${feedback.rating}/5 ${'⭐'.repeat(feedback.rating)}\n` +
//                 `Usuario: ${feedback.userId}\n` +
//                 `Comentario: ${feedback.comment}\n` +
//                 `Fecha: ${new Date(feedback.timestamp).toLocaleString()}`

//             await provider.sendText(
//                 `${supervisorNumber}@c.us`,
//                 supervisorMessage
//             )

//             // Si la calificación es baja (1 o 2), programar seguimiento
//             if (feedback.rating <= 2) {
//                 const followUpMessage = `⚠️ *Alerta de Satisfacción Baja*\n\n` +
//                     `Se requiere seguimiento inmediato:\n` +
//                     `Ticket: #${feedback.ticketNumber}\n` +
//                     `Usuario: ${feedback.userId}\n` +
//                     `Calificación: ${feedback.rating}/5\n` +
//                     `Comentario: ${feedback.comment}`

//                 // Enviar alerta al equipo de calidad
//                 const qualityTeamNumber = process.env.QUALITY_TEAM_PHONE
//                 await provider.sendText(
//                     `${qualityTeamNumber}@c.us`,
//                     followUpMessage
//                 )
//             }
//         })
//     .addAnswer('🔄 ¿Te gustaría participar en una breve encuesta para mejorar nuestro servicio?\n' +
//         '1. Sí\n' +
//         '2. No', 
//         { capture: true },
//         async (ctx, { flowDynamic }) => {
//             if (ctx.body.trim() === '1') {
//                 await flowDynamic('📋 *Encuesta de Satisfacción*\n\n' +
//                     '¿Qué aspectos consideras más importantes?\n' +
//                     '1. Tiempo de respuesta\n' +
//                     '2. Calidad de la solución\n' +
//                     '3. Amabilidad del servicio\n' +
//                     '4. Seguimiento del caso\n' +
//                     'Puedes seleccionar múltiples opciones separadas por coma')
//             } else {
//                 await flowDynamic('👍 Entendido. ¡Gracias por usar nuestro servicio de soporte!')
//             }
//         })

// Flujo adicional para encuesta detallada
// const surveyFlow = addKeyword(['encuesta', 'survey'])
//     .addAnswer('🎯 *Encuesta de Calidad de Servicio*\n\n' +
//         'Tu opinión es muy importante para nosotros.\n' +
//         'Esta encuesta tomará aproximadamente 2 minutos.')
//     .addAnswer('1️⃣ ¿El técnico entendió claramente tu problema?', 
//         { capture: true },
//         async (ctx, { state }) => {
//             await state.update({ understanding: ctx.body })
//         })
//     .addAnswer('2️⃣ ¿La solución proporcionada resolvió completamente tu problema?', 
//         { capture: true },
//         async (ctx, { state }) => {
//             await state.update({ solution: ctx.body })
//         })
//     .addAnswer('3️⃣ ¿El tiempo de respuesta fue adecuado?', 
//         { capture: true },
//         async (ctx, { state, flowDynamic }) => {
//             // const surveyData = {
//             //     understanding: state.get('understanding'),
//             //     solution: state.get('solution'),
//             //     responseTime: ctx.body
//             // }
//             console.log(state)

//             await flowDynamic('📊 *¡Gracias por completar la encuesta!*\n\n' +
//                 'Tus respuestas nos ayudarán a mejorar nuestro servicio.')
//         })

/**
 * caul es la funcion de main?
 * la funcion main es la funcion que se encarga de crear el flujo del bot
 * y crear el provider del bot
 * y crear la base de datos del bot
 * y crear el servidor del bot
 */
const main = async () => {
    const adapterFlow = createFlow(flows)
    
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
