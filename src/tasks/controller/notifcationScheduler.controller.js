import { getChecadorStatusService } from '../../flows/gestionPlantas/flow/statusChecadores/services/checador.service.js';
import { sendMessage } from '../../services/whatsappApi.service.js';
import { formatMessage } from '../../flows/utils/messages.util.js';
import { getProccessInfo } from '../../services/gestionEquipoApi.service.js';
import { validateUptimeDuration } from '../../utils/duration.util.js';
import { getProgressIcon } from '../../flows/utils/messages.util.js';

/**
 * Función que se encarga de enviar notificaciones a los técnicos con el estado actual de los checadores.
 * La función consume la API de statusChecadores y se encarga de enviar los mensajes a cada uno de los técnicos
 * configurados en el archivo de variables de entorno (.env).
 * @return {Promise<void>} - Resuelve si se envian todas las notificaciones sin errores.
 */
export const sendNotificationChecadores = async () => {
    const hostnameChecadores = process.env.CHECADORES_HOSTNAME;

    const checadores = hostnameChecadores.split(',');

    let currentIndex = 0;
    const total = checadores.length;

    const tecnicosSupport = process.env.TECHNICIAN_PHONE_SUPPORTS;

    for (const checador of checadores) {
        try {
            // Consume la API para obtener el estado del checador.
            const statusData = await getChecadorStatusService(checador);

            //Consume la API para obtener la informacion de los procesos abiertos
            const dataProccess = await getProccessInfo(checador);

            // Verificar si la aplicación está abierta
            const appChecadasIsOpen = dataProccess.some(proc => proc.name === 'TIMECE Sinaloa.exe');
            const messageStatus = appChecadasIsOpen ?
                "✅ App *TIMECE Sinaloa.exe* está abierta." :
                "❌ App *TIMECE Sinaloa.exe* no está abierta.";

            // Validar tiempo de actividad
            const uptimeValidation = validateUptimeDuration(statusData.tiempoEncendido);
            const warningMessage = uptimeValidation.exceedsFiveDays
                ? '\n⚠️ *ADVERTENCIA:* El checador lleva más de *5 días sin reiniciarse* por lo que se recomienda revisarlo.'
                : uptimeValidation.rebootMessage || '';

            // Muestra el progreso actualizado
            const updatedProgressBar = getProgressIcon(currentIndex + 1, total);





            for (const tecnico of tecnicosSupport.split(',')) {
                // Envía un mensaje al usuario indicando que se está obteniendo el estado del checador.

                await sendMessage({
                    message: formatMessage({
                        header: `Estado del checador ${checador}`,
                        body: `${updatedProgressBar}\n\n` +
                            `${messageStatus}\n` +
                            `Ha estado funcionando por *${uptimeValidation.duration}*${warningMessage}`,
                        type: (appChecadasIsOpen && !uptimeValidation.exceedsFiveDays) ? 'success' : 'warning'
                    }), number: tecnico
                });


            }
            currentIndex++;

        } catch (error) {
            // Maneja los errores al obtener el estado del checador.
            for (const tecnico of tecnicosSupport.split(',')) {
                await sendMessage({
                    message: formatMessage({
                        header: `Error al obtener el estado del checador ${checador}`,
                        body: `Por favor, revisa el checador manualmente.`,
                        type: 'notification',
                    }), number: tecnico
                });


            }
            console.error(`Error al obtener los datos del checador ${checador}:`, error); // Registra el error con el nombre del checador
        }
    }

}