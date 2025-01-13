import { addKeyword } from '@builderbot/bot'
import { statusChecadoresController } from './controllers/checador.controller.js';
import { formatMessage } from '../utils/messages.util.js';
import { sendMessage } from '../../services/whatsappApi.service.js';

/**
 * Flujo para obtener el estado de los checadores.
 * @param {object} ctx - Contexto del flujo.
 * @param {{ flowDynamic: Function }} options - Opciones del flujo, incluyendo la función para mostrar mensajes al usuario.
 * @returns {Promise<void>} - Resuelve si se obtienen los estados de todos los checadores, o rechaza si hay un error.
 */
export const statusChecadoresFlow = addKeyword('checadores')
.addAction(async (ctx, { flowDynamic }) => {
  try {
    await statusChecadoresController(flowDynamic);

    await sendMessage({message:"Prueba 11000",number:"5216683972780"})

  } catch (error) {
    // Maneja errores que puedan ocurrir durante la ejecución del flujo.
    await flowDynamic(formatMessage({
      header: 'Error en el flujo de checadores',
      body: `Ocurrió un error: ${error.message}`,
      type: 'error'
    }));
    // console.error('Error en el flujo de checadores:', error);
  }
});




