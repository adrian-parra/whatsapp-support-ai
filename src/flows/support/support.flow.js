import { addKeyword } from '@builderbot/bot'

export const supportFlow = addKeyword(['soporte', 'ayuda', 'help', 'it'])
    .addAnswer('🖥️ *SISTEMA DE SOPORTE TÉCNICO* 🛠️\n' +
        'Bienvenido al sistema de soporte. ¿En qué podemos ayudarte?\n\n' +
        '1️⃣ *Problemas con Hardware*\n' +
        '2️⃣ *Problemas con Software*\n' +
        '3️⃣ *Accesos y Credenciales*\n' +
        '4️⃣ *Solicitar Equipo Nuevo*\n' +
        '5️⃣ *Reportar Incidente*\n' +
        '6️⃣ *Estado de Ticket*\n' +
        '7️⃣ *FAQ/Ayuda Rápida*\n' +
        '8️⃣ *Volver al menú principal*\n')
    .addAnswer('Por favor, escribe el número de la opción que necesitas:', { capture: true },
        async (ctx, { fallBack, flowDynamic }) => {
            const option = ctx.body.trim()

            switch (option) {
                case '1':
                    await flowDynamic('🔧 *PROBLEMAS DE HARDWARE*\n\n' +
                        '1. Problemas con la laptop\n' +
                        '2. Problemas con monitor/periféricos\n' +
                        '3. Problemas de batería\n' +
                        '4. Problemas de red/conexión\n\n' +
                        'Para reportar un problema específico, escribe:\n' +
                        '"reportar hardware: [descripción del problema]"')
                    break
                case '2':
                    await flowDynamic('💻 *PROBLEMAS DE SOFTWARE*\n\n' +
                        '1. Problemas con Windows/macOS\n' +
                        '2. Problemas con aplicaciones corporativas\n' +
                        '3. Actualizaciones pendientes\n' +
                        '4. Antivirus/Seguridad\n\n' +
                        'Para reportar un problema específico, escribe:\n' +
                        '"reportar software: [descripción del problema]"')
                    break
                case '3':
                    await flowDynamic('🔑 *ACCESOS Y CREDENCIALES*\n\n' +
                        '• Para restablecer contraseña: "reset password"\n' +
                        '• Para acceso a VPN: "solicitar vpn"\n' +
                        '• Para acceso a sistemas: "acceso [nombre del sistema]"\n\n' +
                        '📞 Contacto directo soporte:\n' +
                        'Tel: +XX XXXX XXXX\n' +
                        'Email: soporte@tuempresa.com')
                    break
                case '4':
                    await flowDynamic('📋 *SOLICITUD DE EQUIPO NUEVO*\n\n' +
                        'Para iniciar una solicitud, necesitamos:\n' +
                        '1. Nombre completo\n' +
                        '2. Departamento\n' +
                        '3. Justificación\n' +
                        '4. Aprobación de supervisor\n\n' +
                        'Escribe "nueva solicitud" para comenzar el proceso')
                    break
                case '5':
                    await flowDynamic('🚨 *REPORTAR INCIDENTE*\n\n' +
                        'Por favor, proporciona:\n' +
                        '1. Tipo de incidente\n' +
                        '2. Descripción detallada\n' +
                        '3. Nivel de urgencia\n\n' +
                        'Formato: "incidente: [descripción]"\n\n' +
                        '⚠️ Para emergencias, llamar directamente al: +XX XXXX XXXX')
                    break
                case '6':
                    await flowDynamic('🔍 *CONSULTA DE TICKET*\n\n' +
                        'Para consultar el estado de tu ticket:\n' +
                        '1. Escribe "estado #[número de ticket]"\n' +
                        '2. Te informaremos:\n' +
                        '   - Estado actual\n' +
                        '   - Técnico asignado\n' +
                        '   - Tiempo estimado de resolución\n' +
                        '   - Últimas actualizaciones\n\n' +
                        'Ejemplo: estado #123456')
                    break
                case '7':
                    await flowDynamic('📚 *PREGUNTAS FRECUENTES*\n\n' +
                        '1. *Problemas comunes de red*\n' +
                        '   Escribe: "red ayuda"\n\n' +
                        '2. *Restablecer contraseña*\n' +
                        '   Escribe: "password reset"\n\n' +
                        '3. *Problemas de impresora*\n' +
                        '   Escribe: "impresora ayuda"\n\n' +
                        '4. *Acceso VPN*\n' +
                        '   Escribe: "vpn guía"\n\n' +
                        '5. *Software corporativo*\n' +
                        '   Escribe: "software lista"')
                    break
                case '8':
                    return fallBack()
                default:
                    await flowDynamic('❌ Opción no válida. Por favor, selecciona un número del 1 al 8.')
                    return fallBack()
            }
        })
