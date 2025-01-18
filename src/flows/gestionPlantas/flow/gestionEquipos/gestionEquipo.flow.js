import { addKeyword } from '@builderbot/bot';
import { formatMessage } from '../../../utils/messages.util.js';
import { obtenerInformacionEquipoController } from './controller/gestionEquipo.controller.js';
import { reiniciarEquipoController } from './controller/gestionEquipo.controller.js';

export const gestionequipoFlow = addKeyword(['equipo', 'computadora'])
    .addAnswer('🖥️ *GESTIÓN DE EQUIPOS*\n' +
        'Por favor, ingrese la IP o Hostname del equipo:',
        { capture: true },
        async (ctx, { flowDynamic, fallBack }) => {
            const equipoId = ctx.body.trim();
            
            if (!equipoId) {
                return fallBack('❌ Por favor, ingrese una IP o Hostname válido');
            }

            global.equipoSeleccionado = equipoId;

            await flowDynamic(formatMessage({
                header: '🔍 Equipo Seleccionado',
                body: `IP/Hostname: *${equipoId}*\n\n` +
                    'Seleccione una opción:\n' +
                    '1️⃣ Obtener información del equipo\n' +
                    '2️⃣ Reiniciar dispositivo'
            }));
        }
    )
    .addAnswer(
        ['Seleccione una opción (1 o 2):'],
        { capture: true },
        async (ctx, { flowDynamic, fallBack, endFlow }) => {
            const option = ctx.body.trim();
            
            if (!['1', '2'].includes(option)) {
                return fallBack('❌ Por favor, seleccione una opción válida (1 o 2)');
            }

            if (option === '1') {
                try {

                    await obtenerInformacionEquipoController(flowDynamic, global.equipoSeleccionado);
                    
                    
                    delete global.equipoSeleccionado;
                    return endFlow();
                } catch (error) {
                    await flowDynamic(formatMessage({
                        header: '❌ Error',
                        body: 'No se pudo obtener la información del equipo. '+ error.message,
                        type: 'error'
                    }));
                    delete global.equipoSeleccionado;
                    return endFlow();
                }
            } else {
                // Opción 2: Reiniciar
                global.solicitaReinicio = true;
                await flowDynamic(formatMessage({
                    header: '⚠️ Confirmación de Reinicio',
                    body: `¿Está seguro que desea reiniciar el dispositivo *${global.equipoSeleccionado}*?\n` +
                        'Responda *SI* para confirmar o cualquier otra cosa para cancelar',
                    type: 'warning'
                }));
            }
        }
    )
    .addAnswer(
        ['Confirme el reinicio:'],
        { capture: true },
        async (ctx, { flowDynamic, endFlow }) => {
            // Solo procesamos si estamos esperando confirmación de reinicio
            if (!global.solicitaReinicio) {
                delete global.equipoSeleccionado;
                return endFlow();
            }

            const confirmation = ctx.body.trim().toUpperCase();
            
            if (confirmation === 'SI') {
                await flowDynamic(formatMessage({
                    header: '🔄 Reinicio Iniciado',
                    body: `Se ha enviado la orden de reinicio al dispositivo *${global.equipoSeleccionado}*`,
                    type: 'info'
                }));

                await reiniciarEquipoController(flowDynamic, global.equipoSeleccionado);
            } else {
                await flowDynamic(formatMessage({
                    header: '❌ Reinicio Cancelado',
                    body: 'La operación de reinicio ha sido cancelada',
                    type: 'info'
                }));
            }
            
            // Limpiamos las variables globales
            delete global.equipoSeleccionado;
            delete global.solicitaReinicio;
            return endFlow();
        }
    );
