import { formatMessage } from '../../../../utils/messages.util.js';
import { obtenerInfoDispositivoService } from '../../../../../services/gestionEquipoApi.service.js';
import { restartDevice } from '../../../../../services/gestionEquipoApi.service.js';

export const obtenerInformacionEquipoController = async (flowDynamic , ip) => {
    try {
        // Envía un mensaje al usuario indicando que se está obteniendo la información del equipo.
        await flowDynamic(formatMessage({
            header: 'Obteniendo información del equipo',
            body: 'Por favor, espera un momento...',
            type: 'info'
        }));
        // Consume la API para obtener la información del equipo.
        const infoDispositivo = await obtenerInfoDispositivoService(ip);

        console.log(infoDispositivo);
        // Envía un mensaje al usuario con la información del equipo obtenida.
        await flowDynamic(formatMessage({
            header: `Información de ${global.equipoSeleccionado}`,
            body: `*Sistema Operativo:* ${infoDispositivo[0].OS || 'No disponible'}\n` +
                  `*Memoria RAM:* ${infoDispositivo[0].RAM || 'No disponible'}\n` +
                  `*Procesador:* ${infoDispositivo[0].CPU || 'No disponible'}\n` +
                  `*Espacio en Disco:* ${infoDispositivo[0].Disk || 'No disponible'}\n` +
                  `*Usuario Actual:* ${infoDispositivo[0].userName || 'No disponible'}\n`+
                  `*Nombre:* ${infoDispositivo[0].name || 'No disponible'}`,
            type: 'info'
        }));
     
    } catch (error) {
        await flowDynamic(formatMessage({
            header: '❌ Error',
            body: 'No se pudo obtener la información del equipo. '+ error.message,
            type: 'error'
        }));
    }
};

export const reiniciarEquipoController = async (flowDynamic , ip) => {
    try {
        // Envía un mensaje al usuario indicando que se está reiniciando el equipo.
        await flowDynamic(formatMessage({
            header: 'Reiniciando equipo',
            body: 'Por favor, espera un momento...',
            type: 'info'
        }));
        // Consume la API para reiniciar el equipo.
        const message = await restartDevice(ip);
        // Envía un mensaje al usuario indicando que el equipo se ha reiniciado.
        await flowDynamic(formatMessage({
            header: 'Equipo Reiniciado',
            body: message,
            type: 'success'
        }));
    } catch (error) {
        await flowDynamic(formatMessage({
            header: '❌ Error',
            body: 'No se pudo reiniciar el equipo. '+ error.message,
            type: 'error'
        }));
    }
};