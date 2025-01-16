

import { addKeyword } from '@builderbot/bot';
import { formatMessage } from '../../../utils/messages.util.js';

const equipos = {
    '192.168.1.10': 'Servidor de Archivos',
    '192.168.1.15': 'Servidor de Impresión',
    'srv-pc': 'Servidor de Impresión',
    'srv-arch': 'Servidor de Archivos',
};

export const gestionequipoFlow = addKeyword(['equipo', 'computadora'])
    .addAnswer('🖥️ *MENÚ DE GESTIÓN DE EQUIPOS* \n' +
        '1️⃣ Ingresar IP o Hostname manualmente\n' +
        '2️⃣ Seleccionar equipo de la lista\n' +
        '3️⃣ Volver al menú principal\n',
        { capture: true },
        async (ctx, { flowDynamic, fallBack }) => {
            const option = ctx.body.trim();
            
            if (!['1', '2', '3'].includes(option)) {
                return fallBack('❌ Por favor, seleccione una opción válida (1, 2 o 3)');
            }

            switch (option) {
                case '1':
                    await flowDynamic('Ingrese la IP o Hostname del equipo: ', { capture: true });
                    break;
                case '2':
                    await flowDynamic('Seleccione un equipo de la lista:\n' +
                        Object.keys(equipos).map((ip, index) => `${index + 1}. ${ip} - ${equipos[ip]}`).join('\n')
                    );
                    break;
                case '3':
                    await flowDynamic('👋 *Volviendo al menú principal...*');
                    return;
            }
        }
    )
    .addAnswer(
        'Ingrese el valor:',
        { capture: true },
        async (ctx, { flowDynamic }) => {
            const option = ctx.body.trim();
            
            if (option === '1') {
                const searchValue = ctx.body.trim();
                try {
                    // Aquí puedes agregar la lógica para buscar el equipo
                    // Por ejemplo, hacer una consulta a una base de datos o API
                    await flowDynamic([
                        `🔍 Buscando equipo por ${searchValue}`,
                        // Aquí mostrarías la información del equipo encontrado
                        `*Información del equipo:*\n` +
                        `- IP: ${searchValue}\n` +
                        `- Estado: 🟢 Activo\n` +
                        `- Último registro: ${new Date().toLocaleString()}`
                    ]);

                    await flowDynamic('🤔 *¿Qué deseas hacer con este equipo?*\n' +
                        '1️⃣ Apagar equipo\n' +
                        '2️⃣ Ver información del equipo\n' +
                        '3️⃣ Volver al menú principal\n');
                } catch (error) {
                    await flowDynamic(formatMessage({
                        header: 'Error en la búsqueda',
                        body: `No se pudo encontrar información del equipo: ${error.message}`,
                        type: 'error'
                    }));
                }
            } else if (option === '2') {
                console.log("loal "+ctx.body.trim());
                console.log("loal "+equipos['2']);

                const equipo = equipos[ctx.body.trim()];
                if (equipo) {
                    await flowDynamic([
                        `*Información del equipo:*\n` +
                        `- IP: ${ctx.body.trim()}\n` +
                        `- Estado: 🟢 Activo\n` +
                        `- Último registro: ${new Date().toLocaleString()}`
                    ]);
                } else {
                    await flowDynamic('❌ *No existe ese equipo en la lista*');
                }
            }
        }
    );

