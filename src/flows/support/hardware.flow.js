import { addKeyword } from '@builderbot/bot'

export const hardwareReportFlow = addKeyword('reportar hardware:')
    .addAction(async (ctx, { flowDynamic }) => {
        const report = ctx.body.replace('reportar hardware:', '').trim()
        await flowDynamic(`✅ *Reporte de Hardware Registrado*\n\n` +
            `Ticket #${Date.now().toString().slice(-6)}\n` +
            `Problema: ${report}\n\n` +
            `Un técnico se pondrá en contacto contigo pronto.\n` +
            `Tiempo estimado de respuesta: 2-4 horas hábiles.`)
    })
