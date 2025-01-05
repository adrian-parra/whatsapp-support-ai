import { addKeyword, EVENTS } from '@builderbot/bot'
import { chatWithAI21 } from '../../ai/ai21studio.js'

export const welcomeFlow = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, { flowDynamic }) => {
        const message = ctx.body
        
        try {
            await flowDynamic([
                '🤖 *Procesando tu mensaje...*',
                'ℹ️ *Nota importante:* Esta IA no guarda el contexto de conversaciones anteriores, por lo que cada mensaje será tratado de forma independiente. Por favor, sé específico en tus preguntas.'
            ])
            
            const textAI21 = await chatWithAI21({message})
            await flowDynamic(`🤖 ${textAI21}`)
        } catch (error) {
            await flowDynamic('*¡Lo sentimos!* 🔧\n\nDisculpe, en este momento estamos experimentando dificultades técnicas para procesar su solicitud.\n\nLe agradecemos su comprensión y le invitamos a intentarlo nuevamente en unos momentos. 🙏\n\n_El equipo de soporte está trabajando para resolver este inconveniente._')
        }
    })
