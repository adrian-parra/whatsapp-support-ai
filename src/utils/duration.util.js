/**
 * Parsea una cadena de duración y verifica si excede los 5 días
 * @param {string} duration - Cadena de duración (ej: "3 días, 3 horas y 19 minutos")
 * @returns {{exceedsFiveDays: boolean, duration: string, recentlyRebooted: boolean, rebootMessage: string}} - Objeto con el resultado de la validación
 */
export const validateUptimeDuration = (duration) => {
    const daysMatch = duration.match(/(\d+)\s*días?/);
    const hoursMatch = duration.match(/(\d+)\s*horas?/);
    const minutesMatch = duration.match(/(\d+)\s*minutos?/);

    const days = daysMatch ? parseInt(daysMatch[1]) : 0;
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

    const totalHours = (days * 24) + hours + (minutes / 60);
    const recentlyRebooted = totalHours <= 1;
    
    return {
        exceedsFiveDays: days > 5,
        recentlyRebooted,
        rebootMessage: recentlyRebooted ? '\n⚠️ *ATENCIÓN:* El checador se ha reiniciado recientemente. Si usted no realizó este reinicio, favor de verificar el equipo.' : '',
        duration
    };
};
