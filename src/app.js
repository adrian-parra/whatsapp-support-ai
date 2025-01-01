import "dotenv/config" 
import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils,EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { toAskGemini} from './ai/gemini.js'
import { fromAudioToText } from './ai/groq.js'
import ffmpeg from 'fluent-ffmpeg'
import { unlink } from 'fs/promises'
//import { chatWithAI } from './ai/openia.js'
import { chatWithAI21 } from './ai/ai21studio.js'
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
const welcomeFlow = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, { flowDynamic }) => {
        // Obtiene el mensaje del usuario del contexto
        const message = ctx.body
        
        // Envía el mensaje a Gemini para procesamiento
        // El array vacío [] indica que no hay historial de conversación previo
        //const textConvertedItaliano = await toAskGemini({message,history: []})

        // Envía la respuesta procesada de vuelta al usuario
        //const textEntrenadorPersonal = await toAskEntrenadorPersonal({message,history: []})
        // Envía la respuesta procesada de vuelta al usuario
        //await flowDynamic(textEntrenadorPersonal)
        //const textIngenieroDeSoftware = await toAskIngenieroDeSoftware({message,history: []})
        //await flowDynamic(textIngenieroDeSoftware)
        // try {
        //     const textOpenIA = await chatWithAI(message)
        //     await flowDynamic(textOpenIA)
        // } catch (error) {
        //     await flowDynamic('*¡Lo sentimos!* 🔧\n\nDisculpe, en este momento estamos experimentando dificultades técnicas para procesar su solicitud.\n\nLe agradecemos su comprensión y le invitamos a intentarlo nuevamente en unos momentos. 🙏\n\n_El equipo de soporte está trabajando para resolver este inconveniente._')
        // }
        try {
            const textAI21 = await chatWithAI21({message})
            await flowDynamic(textAI21)
        } catch (error) {
            await flowDynamic('*¡Lo sentimos!* 🔧\n\nDisculpe, en este momento estamos experimentando dificultades técnicas para procesar su solicitud.\n\nLe agradecemos su comprensión y le invitamos a intentarlo nuevamente en unos momentos. 🙏\n\n_El equipo de soporte está trabajando para resolver este inconveniente._')
        }
    })

const voiceFlow = addKeyword(EVENTS.VOICE_NOTE)
    .addAction(async (ctx, { provider, flowDynamic }) => {
        const storagePath = join(process.cwd(), 'storage')
        const originalFilePath = await provider.saveFile(ctx, { path: storagePath })
        
        // Crear el nombre del archivo convertido
        const wavFilePath = originalFilePath.replace('.oga', '.wav')
        
        // Convertir el archivo usando ffmpeg
        await new Promise((resolve, reject) => {
            ffmpeg(originalFilePath)
                .toFormat('wav')
                .on('end', async () => {
                    // Eliminar el archivo .oga original después de la conversión
                    await unlink(originalFilePath)
                    resolve()
                })
                .on('error', (err) => reject(err))
                .save(wavFilePath)
        })
        
        const textConverted = await fromAudioToText(wavFilePath)
        const textConvertedItaliano = await toAskGemini({message: textConverted, history: []})
        //const audioResponse = await toAudio(textConvertedItaliano)
        
        //const fileName = `audio-${Date.now()}.mp3`;
        //const filePath = join(process.cwd(), 'storage', fileName);
        //console.log(filePath)

        //await writeFile(filePath, audioResponse);

        await flowDynamic(`Original: ${textConverted}`)
        await flowDynamic(`Italiano: ${textConvertedItaliano}`)
        //await flowDynamic([{ media: filePath }])

        //await unlink(filePath)
        await unlink(wavFilePath)

    })

/**
 * 
**/
const registerFlow = addKeyword(utils.setEvent('REGISTER_FLOW'))
    .addAnswer(`What is your name?`, { capture: true }, async (ctx, { state }) => {
        await state.update({ name: ctx.body })
    })
    .addAnswer('What is your age?', { capture: true }, async (ctx, { state }) => {
        await state.update({ age: ctx.body })
    })
    .addAction(async (_, { flowDynamic, state }) => {
        await flowDynamic(`${state.get('name')}, thanks for your information!: Your age: ${state.get('age')}`)
    })

const fullSamplesFlow = addKeyword(['samples', utils.setEvent('SAMPLES')])
    .addAnswer(`💪 I'll send you a lot files...`)
    .addAnswer(`Send image from Local`, { media: join(process.cwd(), 'assets', 'sample.png') })
    .addAnswer(`Send video from URL`, {
        media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJ0ZGdjd2syeXAwMjQ4aWdkcW04OWlqcXI3Ynh1ODkwZ25zZWZ1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LCohAb657pSdHv0Q5h/giphy.mp4',
    })
    .addAnswer(`Send audio from URL`, { media: 'https://cdn.freesound.org/previews/728/728142_11861866-lq.mp3' })
    .addAnswer(`Send file from URL`, {
        media: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    })

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

const supportFlow = addKeyword(['soporte', 'ayuda', 'help', 'it'])
    .addAnswer('🖥️ *SISTEMA DE SOPORTE TÉCNICO* 🛠️\n' +
        'Bienvenido al sistema de soporte. ¿En qué podemos ayudarte?\n\n' +
        '1️⃣ *Problemas con Hardware*\n' +
        '2️⃣ *Problemas con Software*\n' +
        '3️⃣ *Accesos y Credenciales*\n' +
        '4️⃣ *Solicitar Equipo Nuevo*\n' +
        '5️⃣ *Reportar Incidente*\n' +
        '6️⃣ *Volver al menú principal*\n')
    .addAnswer('Por favor, escribe el número de la opción que necesitas:', { capture: true },
        async (ctx, { fallBack, flowDynamic }) => {
            const option = ctx.body.trim()

            switch (option) {
                case '1':
                    await flowDynamic('🔧 *PROBLEMAS DE HARDWARE*\n\n' +
                        '1. Problemas con la laptop\n' +
                        '2. Problemas con monitor/periféricos\n' +
                        '3. Problemas de batería\n' +
                        '4. Problemas de red/conexión\n\n' +
                        'Para reportar un problema específico, escribe:\n' +
                        '"reportar hardware: [descripción del problema]"')
                    break
                case '2':
                    await flowDynamic('💻 *PROBLEMAS DE SOFTWARE*\n\n' +
                        '1. Problemas con Windows/macOS\n' +
                        '2. Problemas con aplicaciones corporativas\n' +
                        '3. Actualizaciones pendientes\n' +
                        '4. Antivirus/Seguridad\n\n' +
                        'Para reportar un problema específico, escribe:\n' +
                        '"reportar software: [descripción del problema]"')
                    break
                case '3':
                    await flowDynamic('🔑 *ACCESOS Y CREDENCIALES*\n\n' +
                        '• Para restablecer contraseña: "reset password"\n' +
                        '• Para acceso a VPN: "solicitar vpn"\n' +
                        '• Para acceso a sistemas: "acceso [nombre del sistema]"\n\n' +
                        '📞 Contacto directo soporte:\n' +
                        'Tel: +XX XXXX XXXX\n' +
                        'Email: soporte@tuempresa.com')
                    break
                case '4':
                    await flowDynamic('📋 *SOLICITUD DE EQUIPO NUEVO*\n\n' +
                        'Para iniciar una solicitud, necesitamos:\n' +
                        '1. Nombre completo\n' +
                        '2. Departamento\n' +
                        '3. Justificación\n' +
                        '4. Aprobación de supervisor\n\n' +
                        'Escribe "nueva solicitud" para comenzar el proceso')
                    break
                case '5':
                    await flowDynamic('🚨 *REPORTAR INCIDENTE*\n\n' +
                        'Por favor, proporciona:\n' +
                        '1. Tipo de incidente\n' +
                        '2. Descripción detallada\n' +
                        '3. Nivel de urgencia\n\n' +
                        'Formato: "incidente: [descripción]"\n\n' +
                        '⚠️ Para emergencias, llamar directamente al: +XX XXXX XXXX')
                    break
                case '6':
                    return fallBack()
                default:
                    await flowDynamic('❌ Opción no válida. Por favor, selecciona un número del 1 al 6.')
                    return fallBack()
            }
        })

// Flujo para reportes de hardware
const hardwareReportFlow = addKeyword('reportar hardware:')
    .addAction(async (ctx, { flowDynamic }) => {
        const report = ctx.body.replace('reportar hardware:', '').trim()
        await flowDynamic(`✅ *Reporte de Hardware Registrado*\n\n` +
            `Ticket #${Date.now().toString().slice(-6)}\n` +
            `Problema: ${report}\n\n` +
            `Un técnico se pondrá en contacto contigo pronto.\n` +
            `Tiempo estimado de respuesta: 2-4 horas hábiles.`)
    })

// Flujo para reportes de software
const softwareReportFlow = addKeyword('reportar software:')
    .addAction(async (ctx, { flowDynamic, provider }) => {
        const report = ctx.body.replace('reportar software:', '').trim()
        const ticketNumber = Date.now().toString().slice(-6)
        
        // Mensaje para el usuario
        await flowDynamic(`✅ *Reporte de Software Registrado*\n\n` +
            `Ticket #${ticketNumber}\n` +
            `Problema: ${report}\n\n` +
            `Un técnico se pondrá en contacto contigo pronto.\n` +
            `Tiempo estimado de respuesta: 1-3 horas hábiles.`)
        
        // Notificación para el técnico
        const technicianNumber = process.env.TECHNICIAN_PHONE
        const notificationMessage = `🔔 *Nuevo Ticket de Software*\n\n` +
            `Ticket #${ticketNumber}\n` +
            `Usuario: ${ctx.from}\n` +
            `Problema: ${report}\n\n` +
            `Por favor, revisa este caso lo antes posible.`
            
        await provider.sendText(
            `${technicianNumber}@c.us`,
            notificationMessage
        )
    })

/**
 * caul es la funcion de main?
 * la funcion main es la funcion que se encarga de crear el flujo del bot
 * y crear el provider del bot
 * y crear la base de datos del bot
 * y crear el servidor del bot
 */
const main = async () => {
    const adapterFlow = createFlow([
        welcomeFlow,
        registerFlow,
        fullSamplesFlow,
        voiceFlow,
        // menuFlow,
        supportFlow,
        hardwareReportFlow,
        softwareReportFlow
    ])
    
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
