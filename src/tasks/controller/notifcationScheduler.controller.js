import { getChecadorStatusService } from '../../flows/gestionPlantas/services/checador.service.js';
import { sendMessage } from '../../services/whatsappApi.service.js';
import { formatMessage } from '../../flows/utils/messages.util.js';

export const notificationController = async ()=>{
    const hostnameChecadores = process.env.CHECADORES_HOSTNAME;

    const checadores = hostnameChecadores.split(',');

    for (const checador of checadores) {
        try {
            // Consume la API para obtener el estado del checador.
            const data = await getChecadorStatusService(checador);

            // Muestra el estado del checador al usuario.
            await sendMessage({message:formatMessage({
                header: `Estado del Checador ${checador}`,
                body: `Estado: Éxito\n` +
                    `Última conexión: ${data.tiempoEncendido}\n` +
                    `Tiempo de actividad: ${data.tiempoEncendido}`,
            }),number:"5216683972780"})
        } catch (error) {
            // Maneja los errores al obtener el estado del checador.
            await sendMessage({message:formatMessage({
                header: `Error al obtener el estado del checador ${checador}`,
                body: "Por favor, revisa el checador manualmente.",
                type: 'error'
            }),number:"5216683972780"});
            console.error(`Error al obtener los datos del checador ${checador}:`, error); // Registra el error con el nombre del checador
        }
    }

}