import { addKeyword } from '@builderbot/bot'

export const statusChecadores = addKeyword('checadores')
.addAction(async (ctx, { flowDynamic }) => {
    const ticketNumber = ctx.body.replace('checadores', '').trim()

    try {

        const formData = new FormData()

        formData.append("ip", "C7TIME306")

        const response = await fetch("http://172.30.106.138:7100/cmd/UptimeDeviceWmi", {
            method: "POST",
            body:formData
        });

        const data = await response.json();

        console.log(data);


        let message = "";
        if (data.status !== "success") {
            message = `✅ *Estado del Checador ${ticketNumber}*\n\n` +
                `Estado: success \n` +
                `Última conexión: ${data.tiempoEncendido}\n` +
                `Tiempo de actividad: ${data.tiempoEncendido}`;
        } else {
            message = `❌ *Error al obtener el estado del checador ${ticketNumber}*\n\n` +
                `Por favor, intenta de nuevo más tarde.`;
        }

        await flowDynamic(message);
    } catch (error) {
        await flowDynamic(`❌ *Error al obtener el estado del checador ${ticketNumber}*\n\n` +
            `Por favor, intenta de nuevo más tarde.`);
        console.error("Error fetching data:", error);
    }

    })

