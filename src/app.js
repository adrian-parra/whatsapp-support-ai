import "dotenv/config" 
import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils,EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { toAskGemini , toAskIngenieroDeSoftware} from './ai/gemini.js'
import { fromAudioToText } from './ai/groq.js'
import ffmpeg from 'fluent-ffmpeg'
import { unlink } from 'fs/promises'
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
        const textIngenieroDeSoftware = await toAskIngenieroDeSoftware({message,history: []})
        await flowDynamic(textIngenieroDeSoftware)
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

/**
 * caul es la funcion de main?
 * la funcion main es la funcion que se encarga de crear el flujo del bot
 * y crear el provider del bot
 * y crear la base de datos del bot
 * y crear el servidor del bot
 */
const main = async () => {
    const adapterFlow = createFlow([welcomeFlow, registerFlow, fullSamplesFlow, voiceFlow])
    
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
