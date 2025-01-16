
import { variableEntornoStatusChecadoresValidation } from "../validations/checador.validation.js";
import { getChecadorStatusService } from "../services/checador.service.js";
import { formatMessage } from "../../../../utils/messages.util.js";

/**
 * Controlador para obtener el estado de los checadores.
 * @param {Function} flowDynamic - Función para mostrar mensajes al usuario.
 * @returns {Promise<void>} - Resuelve si se obtienen los estados de todos los checadores, o rechaza si hay un error.
 */
export const statusChecadoresController = async (flowDynamic) => {
    /**
     * Valida las variables de entorno necesarias para la gestión de checadores.
     */
    if (!(await variableEntornoStatusChecadoresValidation(flowDynamic))) {
        return; // Retorna si hay errores en las validaciones
    }

    const hostnameChecadores = process.env.CHECADORES_HOSTNAME;

    const checadores = hostnameChecadores.split(',');

    for (const checador of checadores) {
        try {
            // Envía un mensaje al usuario indicando que se está obteniendo el estado del checador.
            await flowDynamic(formatMessage({
                header: `Obteniendo estado del checador ${checador}`,
                body: "Por favor, espera un momento...",
                type: 'info'
            }));
            // Consume la API para obtener el estado del checador.
            const data = await getChecadorStatusService(checador);

            // Muestra el estado del checador al usuario.
            await flowDynamic(formatMessage({
                header: `Checador ${checador}: Estado Actual`,
                body: `El checador está conectado.\n` +
                    `Encendido el: ${data.fechaEncendido}\n` +
                    `Tiempo de funcionamiento: ${data.tiempoEncendido}`,
            }));
        } catch (error) {
            // Maneja los errores al obtener el estado del checador.
            await flowDynamic(formatMessage({
                header: `Error al obtener el estado del checador ${checador}`,
                body: "Por favor, revisa el checador manualmente.",
                type: 'error'
            }));
            console.error(`Error al obtener los datos del checador ${checador}:`, error); // Registra el error con el nombre del checador
        }
    }
};