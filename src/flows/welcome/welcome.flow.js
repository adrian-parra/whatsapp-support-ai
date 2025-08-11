import { addKeyword, EVENTS } from '@builderbot/bot'

export const welcomeFlow = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, { flowDynamic }) => {
        const message = ctx.body
        
        try {
            await flowDynamic([
                '🤖 *Mejorando tu texto...*',
                // 'ℹ️  *Nota importante:* Esta IA no guarda el contexto de conversaciones anteriores, por lo que cada entrada se procesará de forma independiente. Por favor, proporciona texto claro para obtener mejores mejoras.'
            ])

            //const textAI21 = await chatWithAI21({message})

            const formData = new FormData()
            formData.append("text", message)
            

            const response = await fetch(process.env.URL_API_BACK+"gemini/correct-text", {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ text: message }),
            })

            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`)
            }

            const data = await response.json()
            await flowDynamic(`${data.correctedText}`)
        } catch (error) {
            await flowDynamic('*¡Lo sentimos!* 🔧\n\nDisculpe, en este momento estamos experimentando dificultades técnicas para procesar su solicitud.\n\nLe agradecemos su comprensión y le invitamos a intentarlo nuevamente en unos momentos. 🙏\n\n_El equipo de soporte está trabajando para resolver este inconveniente._')
        }
    })
