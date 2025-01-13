import { addKeyword } from "@builderbot/bot"

export const softwareReportFlow = addKeyword('reportar software:')
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
