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
