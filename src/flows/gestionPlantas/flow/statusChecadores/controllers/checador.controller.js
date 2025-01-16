import { variableEntornoStatusChecadoresValidation } from "../validations/checador.validation.js";
import { getChecadorStatusService } from "../services/checador.service.js";
import { formatMessage } from "../../../../utils/messages.util.js";
import { getProccessInfo } from "../../../../../services/gestionEquipoApi.service.js";
import { validateUptimeDuration } from "../../../../../utils/duration.util.js";

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

            //Consume la API para obtener la informacion de los procesos abiertos
            const dataProccess = await getProccessInfo(checador);

            console.log(dataProccess);

            let appChecadasIsOpen = false;

            dataProccess.forEach(element => {
                console.log(element)
                if (element.name == 'TIMECE Sinaloa.exe') {
                    appChecadasIsOpen = true;
                }
            });

            let messageIsOpenOrCloseAppChacadas = ''
            if(!appChecadasIsOpen){
                messageIsOpenOrCloseAppChacadas = 'App *TIMECE Sinaloa.exe* no esta abierta.'
            }else{
                messageIsOpenOrCloseAppChacadas = 'App *TIMECE Sinaloa.exe* esta abierta.'
            }

            const uptimeValidation = validateUptimeDuration(data.tiempoEncendido);
            const warningMessage = uptimeValidation.exceedsFiveDays 
                ? '\n⚠️ *ADVERTENCIA:* El checador lleva más de *5 días sin reiniciarse* por lo que se recomienda revisarlo.'
                : uptimeValidation.rebootMessage;

            // Muestra el estado del checador al usuario.
            await flowDynamic(formatMessage({
                header: `Checador ${checador}: Estado Actual`,
                body: `El checador está *en línea*.\n` +
                    `${messageIsOpenOrCloseAppChacadas}\n` +
                    `Ha estado funcionando por *${uptimeValidation.duration}*${warningMessage}`
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