import { addKeyword } from '@builderbot/bot';
import { ChecadasService } from '../../services/checadas.service.js';

/**
 * Flow para consultar checadas de empleados
 * Comando: checadas
 * Solicita: ID de empleado, fecha inicio, fecha fin
 * Retorna: Lista de checadas formateada
 */
export const checadasFlow = addKeyword(['checadas', 'checada', 'asistencia'])
    .addAnswer(
        '📋 *Consulta de Checadas* 📋\n\n' +
        'Para consultar las checadas, necesito los siguientes datos:\n\n' +
        '👤 Por favor, ingresa el *ID del empleado*:',
        { capture: true },
        async (ctx, { state, fallBack }) => {
            const employeeId = ctx.body.trim();
            
            // Validar que el ID no esté vacío
            if (!employeeId) {
                return fallBack('❌ El ID del empleado no puede estar vacío. Por favor, ingresa un ID válido:');
            }
            
            // Validar que el ID sea numérico (opcional, dependiendo de tu sistema)
            if (!/^\d+$/.test(employeeId)) {
                return fallBack('❌ El ID del empleado debe contener solo números. Por favor, ingresa un ID válido:');
            }
            
            // Guardar el ID del empleado en el estado
            await state.update({ employeeId });
        }
    )
    .addAnswer(
        '📅 Ahora ingresa la *fecha de inicio* en formato YYYY-MM-DD\n' +
        '(Ejemplo: 2025-01-15):',
        { capture: true },
        async (ctx, { state, fallBack }) => {
            const startDate = ctx.body.trim();
            
            // Validar formato de fecha
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(startDate)) {
                return fallBack('❌ Formato de fecha incorrecto. Por favor, usa el formato YYYY-MM-DD (Ejemplo: 2025-01-15):');
            }
            
            // Validar que sea una fecha válida
            const date = new Date(startDate);
            if (isNaN(date.getTime())) {
                return fallBack('❌ Fecha inválida. Por favor, ingresa una fecha válida en formato YYYY-MM-DD:');
            }
            
            // Guardar la fecha de inicio en el estado
            await state.update({ startDate });
        }
    )
    .addAnswer(
        '📅 Por último, ingresa la *fecha de fin* en formato YYYY-MM-DD\n' +
        '(Ejemplo: 2025-01-15):',
        { capture: true },
        async (ctx, { state, fallBack, flowDynamic }) => {
            const endDate = ctx.body.trim();
            
            // Validar formato de fecha
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(endDate)) {
                return fallBack('❌ Formato de fecha incorrecto. Por favor, usa el formato YYYY-MM-DD (Ejemplo: 2025-01-15):');
            }
            
            // Validar que sea una fecha válida
            const date = new Date(endDate);
            if (isNaN(date.getTime())) {
                return fallBack('❌ Fecha inválida. Por favor, ingresa una fecha válida en formato YYYY-MM-DD:');
            }
            
            // Obtener datos del estado
            const { employeeId, startDate } = state.getMyState();
            
            // Validar que la fecha de fin no sea anterior a la fecha de inicio
            if (new Date(endDate) < new Date(startDate)) {
                return fallBack('❌ La fecha de fin no puede ser anterior a la fecha de inicio. Por favor, ingresa una fecha de fin válida:');
            }
            
            try {
                // Mostrar mensaje de procesamiento
                await flowDynamic('🔍 Consultando checadas... Por favor espera un momento.');

                
                
                // Consultar las checadas
                const checadas = await ChecadasService.getChecadasByEmployee(employeeId, startDate, endDate);
                
                // Formatear y enviar el resultado
                const message = ChecadasService.formatChecadasMessage(checadas, employeeId, startDate, endDate);
                await flowDynamic(message);
                
                // Limpiar el estado
                await state.clear();
                
            } catch (error) {
                console.error('Error en consulta de checadas:', error);
                await flowDynamic(
                    '❌ *Error en la consulta*\n\n' +
                    'Lo sentimos, ocurrió un error al consultar las checadas. ' +
                    'Por favor, verifica los datos e intenta nuevamente.\n\n' +
                    'Si el problema persiste, contacta al administrador del sistema.'
                );
                
                // Limpiar el estado en caso de error
                await state.clear();
            }
        }
    );

/**
 * Flow de ayuda para el comando checadas
 */
export const checadasHelpFlow = addKeyword(['ayuda checadas', 'help checadas'])
    .addAnswer(
        '📋 *Ayuda - Consulta de Checadas*\n\n' +
        '🔹 *Comando:* checadas, checada, asistencia\n\n' +
        '🔹 *Función:* Consulta las checadas de un empleado en un período específico\n\n' +
        '🔹 *Datos requeridos:*\n' +
        '   • ID del empleado (solo números)\n' +
        '   • Fecha de inicio (YYYY-MM-DD)\n' +
        '   • Fecha de fin (YYYY-MM-DD)\n\n' +
        '🔹 *Ejemplo de uso:*\n' +
        '   1. Escribe: checadas\n' +
        '   2. Ingresa: 256553\n' +
        '   3. Ingresa: 2025-01-09\n' +
        '   4. Ingresa: 2025-01-10\n\n' +
        '✅ El sistema mostrará todas las checadas del empleado en ese período con fecha y hora legible.'
    );