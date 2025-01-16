import { getChecadorStatusService } from '../../flows/gestionPlantas/flow/statusChecadores/services/checador.service.js';
import { sendMessage } from '../../services/whatsappApi.service.js';
import { formatMessage } from '../../flows/utils/messages.util.js';
import { getProccessInfo } from '../../services/gestionEquipoApi.service.js';

export const notificationController = async ()=>{
    const hostnameChecadores = process.env.CHECADORES_HOSTNAME;

    const checadores = hostnameChecadores.split(',');

    const tecnicosSupport = process.env.TECHNICIAN_PHONE_SUPPORTS;

    


    for (const checador of checadores) {
        try {
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

            for (const tecnico of tecnicosSupport.split(',')) {
                // Envía un mensaje al usuario indicando que se está obteniendo el estado del checador.
                    await sendMessage({message:formatMessage({
                        header: `Checador ${checador}: Estado Actual`,
                        body: `El checador está *en línea*.\n` +
                            `${messageIsOpenOrCloseAppChacadas}\n` +
                            `Tiempo de funcionamiento: *${data.tiempoEncendido}*` + 
                            `${warningMessage}`,
                        type:'notification',
                    }),number:tecnico});
               
                
            }

        } catch (error) {
            // Maneja los errores al obtener el estado del checador.
            for (const tecnico of tecnicosSupport.split(',')) {
                    await sendMessage({message:formatMessage({
                        header: `Error al obtener el estado del checador ${checador}`,
                        body: `Por favor, revisa el checador manualmente.`,
                        type:'notification',
                    }),number:tecnico});
               
                
            }
            console.error(`Error al obtener los datos del checador ${checador}:`, error); // Registra el error con el nombre del checador
        }
    }

}