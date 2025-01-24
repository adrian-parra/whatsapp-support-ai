import { formatMessage } from "../../../../utils/messages.util.js";
import { getProccessInfo } from "../../../../../services/gestionEquipoApi.service.js";
import { getChecadorStatusService } from "../services/checador.service.js";
import { getProgressIcon } from "../../../../utils/messages.util.js";
import { validateUptimeDuration } from "../../../../../utils/duration.util.js";

/**
 * Controlador para obtener el estado de los checadores.
 * @param {*} flowDynamic - Función para enviar mensajes dinámicos.
 * @param {string} hostnameChecadores - Hostnames de los checadores separados por comas.
 */
export const obtenerStatusChecadoresController = async (flowDynamic, hostnameChecadores) => {
    // Envía un mensaje al usuario indicando que se está obteniendo el estado de los checadores.
    await flowDynamic(formatMessage({
        header: "Obteniendo estado de los checadores",
        body: "Por favor, espera un momento...",
        type: 'info'
    }));

    const checadores = hostnameChecadores.split(',');
    let currentIndex = 0;
    const total = checadores.length;

    for (const checador of checadores) {
        try {
            // Obtener estado del checador y procesos
            const statusData = await getChecadorStatusService(checador);
            const processData = await getProccessInfo(checador);

            // Verificar si la aplicación está abierta
            const appChecadasIsOpen = processData.some(proc => proc.name === 'TIMECE Sinaloa.exe');
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

            await flowDynamic(formatMessage({
                header: `Estado del checador ${checador}`,
                body: `${updatedProgressBar}\n\n` +
                      `${messageStatus}\n` +
                      `Ha estado funcionando por *${uptimeValidation.duration}*${warningMessage}`,
                type: (appChecadasIsOpen && !uptimeValidation.exceedsFiveDays) ? 'success' : 'warning'
            }));

            currentIndex++;
        } catch (error) {
            const errorProgressBar = getProgressIcon(currentIndex + 1, total);
            await flowDynamic(formatMessage({
                header: `❌ Error en checador ${checador}`,
                body: `${errorProgressBar}\n\n` +
                      `No se pudo obtener el estado del checador. ${error.message}`,
                type: 'error'
            }));
            currentIndex++;
        }
    }

    // Mensaje final con barra de progreso completa
    const finalProgressBar = getProgressIcon(total - 1, total);
    await flowDynamic(formatMessage({
        header: "✅ Verificación completada",
        body: `${finalProgressBar}\n\nSe han verificado ${total} checadores.`,
        type: 'success'
    }));
};