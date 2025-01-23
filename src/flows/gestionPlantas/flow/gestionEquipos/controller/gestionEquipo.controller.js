import { formatMessage, getProgressIcon } from '../../../../utils/messages.util.js';
import { obtenerInfoDispositivoService } from '../../../../../services/gestionEquipoApi.service.js';
import { restartDevice } from '../../../../../services/gestionEquipoApi.service.js';
import { obtenerStatusCpuAndMemoryService } from '../../../../../services/gestionEquipoApi.service.js';

export const obtenerInformacionEquipoController = async (flowDynamic, ip) => {
    // Primer bloque try-catch para obtener información básica del dispositivo
    try {
        await flowDynamic(formatMessage({
            header: 'Obteniendo información del equipo',
            body: 'Por favor, espera un momento...',
            type: 'info'
        }));

        const infoDispositivo = await obtenerInfoDispositivoService(ip);
        console.log('Información del equipo obtenida:', infoDispositivo);

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
            body: 'No se pudo obtener la información básica del equipo. ' + error.message,
            type: 'error'
        }));
    }

    // Segundo bloque try-catch para obtener estado del CPU y memoria
    try {
        let statusEquipo = await obtenerStatusCpuAndMemoryService(ip);
        console.log('Estado del equipo:', statusEquipo);

        if (statusEquipo.cpuUsage > 70 || statusEquipo.memoryUsage > 70) {
            await flowDynamic(formatMessage({
                header: `Estado del equipo (${ip})`,
                body: `*CPU:* ${statusEquipo.cpuName || 'No disponible'} ${statusEquipo.cpuSpeed || ''} MHz ${statusEquipo.cpuCores || ''} núcleos / ${statusEquipo.cpuThreads || ''} threads, uso: *${statusEquipo.cpuUsagePercentage || 'No disponible'}*\n` +
                      `*RAM:* ${statusEquipo.memoryCapacity || 'No disponible'} bytes, velocidad: ${statusEquipo.memorySpeed || 'No disponible'} MHz, uso: *${statusEquipo.memoryUsagePercentage || 'No disponible'}* (${statusEquipo.availableMemoryGB || 'No disponible'}/${statusEquipo.totalMemoryGB || 'No disponible'})`,
                type: 'warning'
            }));
        } else {
            await flowDynamic(formatMessage({
                header: `Estado del equipo (${ip})`,
                body: `*CPU:* ${statusEquipo.cpuName || 'No disponible'} ${statusEquipo.cpuSpeed || ''} MHz ${statusEquipo.cpuCores || ''} núcleos / ${statusEquipo.cpuThreads || ''} threads, uso: *${statusEquipo.cpuUsagePercentage || 'No disponible'}*\n` +
                      `*RAM:* ${statusEquipo.memoryCapacity || 'No disponible'} bytes, velocidad: ${statusEquipo.memorySpeed || 'No disponible'} MHz, uso: *${statusEquipo.memoryUsagePercentage || 'No disponible'}* (${statusEquipo.availableMemoryGB || 'No disponible'}/${statusEquipo.totalMemoryGB || 'No disponible'})`,
                type: 'info'
            }));
        }

        // Monitoreo continuo del estado
        try {
            const totalMonitoreos = 10;
            for (let i = 0; i < totalMonitoreos; i++) {
                statusEquipo = await obtenerStatusCpuAndMemoryService(ip);
                console.log('Actualización de estado:', statusEquipo);
                
                const progressIcon = getProgressIcon(i, totalMonitoreos);
                
                if (statusEquipo.cpuUsage > 70 || statusEquipo.memoryUsage > 70) {
                    await flowDynamic(formatMessage({
                        header: `${progressIcon}`,
                        body: `*CPU:* ${statusEquipo.cpuName || 'No disponible'} ${statusEquipo.cpuSpeed || ''} MHz ${statusEquipo.cpuCores || ''} núcleos / ${statusEquipo.cpuThreads || ''} threads, uso: *${statusEquipo.cpuUsagePercentage || 'No disponible'}*\n` +
                              `*RAM:* ${statusEquipo.memoryCapacity || 'No disponible'} bytes, velocidad: ${statusEquipo.memorySpeed || 'No disponible'} MHz, uso: *${statusEquipo.memoryUsagePercentage || 'No disponible'}* (${statusEquipo.availableMemoryGB || 'No disponible'}/${statusEquipo.totalMemoryGB || 'No disponible'})`,
                        type: 'warning'
                    }));
                } else {
                    await flowDynamic(formatMessage({
                        header: `${progressIcon}`,
                        body: `*CPU:* ${statusEquipo.cpuName || 'No disponible'} ${statusEquipo.cpuSpeed || ''} MHz ${statusEquipo.cpuCores || ''} núcleos / ${statusEquipo.cpuThreads || ''} threads, uso: *${statusEquipo.cpuUsagePercentage || 'No disponible'}*\n` +
                              `*RAM:* ${statusEquipo.memoryCapacity || 'No disponible'} bytes, velocidad: ${statusEquipo.memorySpeed || 'No disponible'} MHz, uso: *${statusEquipo.memoryUsagePercentage || 'No disponible'}* (${statusEquipo.availableMemoryGB || 'No disponible'}/${statusEquipo.totalMemoryGB || 'No disponible'})`,
                        type: 'info'
                    }));
                }
            }
        } catch (monitorError) {
            await flowDynamic(formatMessage({
                header: '⚠️ Advertencia',
                body: 'Se interrumpió el monitoreo continuo del equipo. ' + monitorError.message,
                type: 'warning'
            }));
        }
    } catch (error) {
        await flowDynamic(formatMessage({
            header: '❌ Error',
            body: 'No se pudo obtener el estado actual del equipo. ' + error.message,
            type: 'error'
        }));
    }
};

export const reiniciarEquipoController = async (flowDynamic, ip) => {
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
            body: 'No se pudo reiniciar el equipo. ' + error.message,
            type: 'error'
        }));
    }
};