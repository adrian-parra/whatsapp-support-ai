import { addKeyword } from '@builderbot/bot';
import { VoceosService } from '../../services/voceos.service.js';

/**
 * Flow para consultar voceos del sistema
 * Comando: voceos
 * Solicita: fecha inicio, fecha fin, departamento (opcional)
 * Retorna: Lista de voceos formateada
 */
export const voceosFlow = addKeyword(['voceos', 'voceo', 'llamadas'])
    .addAnswer(
        '🎤 *Consulta de Voceos* 🎤\n\n' +
        'Para consultar los voceos del sistema, necesito los siguientes datos:\n\n' +
        '📅 Por favor, ingresa la *fecha de inicio* en formato YYYY-MM-DD\n' +
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
            
            // Validar que la fecha no sea futura
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            if (date > today) {
                return fallBack('❌ La fecha de inicio no puede ser futura. Por favor, ingresa una fecha válida:');
            }
            
            // Guardar la fecha de inicio en el estado
            await state.update({ startDate });
        }
    )
    .addAnswer(
        '📅 Ahora ingresa la *fecha de fin* en formato YYYY-MM-DD\n' +
        '(Ejemplo: 2025-01-15):',
        { capture: true },
        async (ctx, { state, fallBack }) => {
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
            
            // Obtener fecha de inicio del estado
            const { startDate } = state.getMyState();
            
            // Validar que la fecha de fin no sea anterior a la fecha de inicio
            if (new Date(endDate) < new Date(startDate)) {
                return fallBack('❌ La fecha de fin no puede ser anterior a la fecha de inicio. Por favor, ingresa una fecha de fin válida:');
            }
            
            // Validar que el rango no sea mayor a 31 días
            const daysDiff = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
            if (daysDiff > 31) {
                return fallBack('❌ El rango de fechas no puede ser mayor a 31 días. Por favor, ingresa una fecha de fin más cercana:');
            }
            
            // Guardar la fecha de fin en el estado
            await state.update({ endDate });
        }
    )
    .addAnswer(
        '🏢 ¿Deseas filtrar por un departamento específico?\n\n' +
        '• Escribe el *ID del departamento* (Ejemplo: 003)\n' +
        '• O escribe *"todos"* para consultar todos los departamentos:',
        { capture: true },
        async (ctx, { state, fallBack, flowDynamic }) => {
            const input = ctx.body.trim().toLowerCase();
            let departmentId = null;
            
            // Si no es "todos", validar el ID del departamento
            if (input !== 'todos') {
                // Validar formato del departamento (3 dígitos)
                if (!/^\d{3}$/.test(input)) {
                    return fallBack('❌ El ID del departamento debe tener 3 dígitos (Ejemplo: 003) o escribe "todos" para consultar todos:');
                }
                departmentId = input;
            }
            
            // Obtener datos del estado
            const { startDate, endDate } = state.getMyState();
            
            try {
                // Mostrar mensaje de procesamiento
                await flowDynamic('🔍 Consultando voceos... Por favor espera un momento.');
                
                // Consultar los voceos
                const voceos = await VoceosService.getVoceos(startDate, endDate, departmentId);
                
                // Formatear y enviar el resultado
                const message = VoceosService.formatVoceosMessage(voceos, startDate, endDate, departmentId);
                await flowDynamic(message);
                
                // Si hay muchos resultados, ofrecer estadísticas
                if (voceos && voceos.length > 10) {
                    await flowDynamic(
                        '📊 *¿Deseas ver estadísticas resumidas?*\n\n' +
                        'Escribe *"stats"* para ver un resumen por departamento.'
                    );
                }
                
                // Limpiar el estado
                await state.clear();
                
            } catch (error) {
                console.error('Error en consulta de voceos:', error);
                await flowDynamic(
                    '❌ *Error en la consulta*\n\n' +
                    'Lo sentimos, ocurrió un error al consultar los voceos. ' +
                    'Por favor, verifica los datos e intenta nuevamente.\n\n' +
                    'Si el problema persiste, contacta al administrador del sistema.'
                );
                
                // Limpiar el estado en caso de error
                await state.clear();
            }
        }
    );

/**
 * Flow para consultar estadísticas de voceos
 */
export const voceosStatsFlow = addKeyword(['stats', 'estadisticas voceos', 'resumen voceos'])
    .addAnswer(
        '📊 *Estadísticas de Voceos* 📊\n\n' +
        'Para generar estadísticas, necesito el período de consulta:\n\n' +
        '📅 Por favor, ingresa la *fecha de inicio* en formato YYYY-MM-DD\n' +
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
        '📅 Ahora ingresa la *fecha de fin* en formato YYYY-MM-DD\n' +
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
            
            // Obtener fecha de inicio del estado
            const { startDate } = state.getMyState();
            
            // Validar que la fecha de fin no sea anterior a la fecha de inicio
            if (new Date(endDate) < new Date(startDate)) {
                return fallBack('❌ La fecha de fin no puede ser anterior a la fecha de inicio. Por favor, ingresa una fecha de fin válida:');
            }
            
            try {
                // Mostrar mensaje de procesamiento
                await flowDynamic('📊 Generando estadísticas... Por favor espera un momento.');
                
                // Consultar las estadísticas
                const stats = await VoceosService.getVoceosStats(startDate, endDate);
                
                // Formatear y enviar el resultado
                const message = VoceosService.formatStatsMessage(stats, startDate, endDate);
                await flowDynamic(message);
                
                // Limpiar el estado
                await state.clear();
                
            } catch (error) {
                console.error('Error en consulta de estadísticas:', error);
                await flowDynamic(
                    '❌ *Error en la consulta*\n\n' +
                    'Lo sentimos, ocurrió un error al generar las estadísticas. ' +
                    'Por favor, verifica los datos e intenta nuevamente.\n\n' +
                    'Si el problema persiste, contacta al administrador del sistema.'
                );
                
                // Limpiar el estado en caso de error
                await state.clear();
            }
        }
    );

/**
 * Flow de ayuda para el comando voceos
 */
export const voceosHelpFlow = addKeyword(['ayuda voceos', 'help voceos'])
    .addAnswer(
        '🎤 *Ayuda - Consulta de Voceos*\n\n' +
        '🔹 *Comandos disponibles:*\n' +
        '   • voceos, voceo, llamadas\n' +
        '   • stats, estadisticas voceos\n\n' +
        '🔹 *Función:* Consulta los voceos registrados en el sistema\n\n' +
        '🔹 *Datos requeridos:*\n' +
        '   • Fecha de inicio (YYYY-MM-DD)\n' +
        '   • Fecha de fin (YYYY-MM-DD)\n' +
        '   • Departamento (opcional, 3 dígitos o "todos")\n\n' +
        '🔹 *Limitaciones:*\n' +
        '   • Máximo 31 días de rango\n' +
        '   • Máximo 1000 registros por consulta\n\n' +
        '🔹 *Ejemplo de uso:*\n' +
        '   1. Escribe: voceos\n' +
        '   2. Ingresa: 2025-01-09\n' +
        '   3. Ingresa: 2025-01-10\n' +
        '   4. Ingresa: 003 (o "todos")\n\n' +
        '🔹 *Información mostrada:*\n' +
        '   • LineID, DepartmentID, ProblemID\n' +
        '   • Fecha y hora de registro\n' +
        '   • Estado, Desktop, Área\n\n' +
        '✅ Para estadísticas rápidas, usa el comando *"stats"*'
    );