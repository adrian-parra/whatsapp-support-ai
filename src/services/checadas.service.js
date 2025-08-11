import sql from 'mssql';

/**
 * Configuración de la base de datos SQL Server
 */
const dbConfig = {
    server: '172.30.184.76',
    database: 'Checadas_Sinaloa',
    user: 'lanpoint',
    password: 'syslanpoint',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

/**
 * Servicio para manejar las consultas de checadas
 */
export class ChecadasService {
    /**
     * Obtiene las checadas de un empleado en un rango de fechas
     * @param {string} employeeId - ID del empleado
     * @param {string} startDate - Fecha de inicio (YYYY-MM-DD)
     * @param {string} endDate - Fecha de fin (YYYY-MM-DD)
     * @returns {Promise<Array>} Array con las checadas del empleado
     */
    static async getChecadasByEmployee(employeeId, startDate, endDate) {
        let pool;
        try {
            // Crear conexión a la base de datos
            pool = await sql.connect(dbConfig);
            
            // Preparar la consulta SQL
            const query = `
                SELECT *, 
                    CONCAT( 
                        CASE DATEPART(WEEKDAY, Date) 
                            WHEN 1 THEN 'Domingo' 
                            WHEN 2 THEN 'Lunes' 
                            WHEN 3 THEN 'Martes' 
                            WHEN 4 THEN 'Miércoles' 
                            WHEN 5 THEN 'Jueves' 
                            WHEN 6 THEN 'Viernes' 
                            WHEN 7 THEN 'Sábado' 
                        END, 
                        ', ', 
                        DAY(Date), ' de ', 
                        CASE MONTH(Date) 
                            WHEN 1 THEN 'enero' 
                            WHEN 2 THEN 'febrero' 
                            WHEN 3 THEN 'marzo' 
                            WHEN 4 THEN 'abril' 
                            WHEN 5 THEN 'mayo' 
                            WHEN 6 THEN 'junio' 
                            WHEN 7 THEN 'julio' 
                            WHEN 8 THEN 'agosto' 
                            WHEN 9 THEN 'septiembre' 
                            WHEN 10 THEN 'octubre' 
                            WHEN 11 THEN 'noviembre' 
                            WHEN 12 THEN 'diciembre' 
                        END, 
                        ' del ', YEAR(Date), 
                        ' a las ', 
                        FORMAT(Date, 'HH:mm:ss') 
                    ) AS FechaHoraLegible 
                FROM TBL_ChecadasSinaloa 
                WHERE EmployeeID = @employeeId 
                AND Date >= @startDate 
                AND Date < @endDate
                ORDER BY Date ASC`;
            
            // Ejecutar la consulta con parámetros
            const request = pool.request();
            request.input('employeeId', sql.VarChar, employeeId);
            request.input('startDate', sql.DateTime, `${startDate} 00:00:00`);
            request.input('endDate', sql.DateTime, `${endDate} 23:59:59`);
            
            const result = await request.query(query);
            
            return result.recordset;
            
        } catch (error) {
            console.error('Error al consultar checadas:', error);
            throw new Error('Error al consultar la base de datos de checadas');
        } finally {
            // Cerrar la conexión
            if (pool) {
                await pool.close();
            }
        }
    }
    
    /**
     * Formatea las checadas para mostrar en WhatsApp
     * @param {Array} checadas - Array de checadas
     * @param {string} employeeId - ID del empleado
     * @param {string} startDate - Fecha de inicio
     * @param {string} endDate - Fecha de fin
     * @returns {string} Mensaje formateado para WhatsApp
     */
    static formatChecadasMessage(checadas, employeeId, startDate, endDate) {
        if (!checadas || checadas.length === 0) {
            return `📋 *Consulta de Checadas*\n\n` +
                   `👤 Empleado: ${employeeId}\n` +
                   `📅 Período: ${startDate} al ${endDate}\n\n` +
                   `❌ No se encontraron registros de checadas para este período.`;
        }
        
        let message = `📋 *Consulta de Checadas*\n\n`;
        message += `👤 Empleado: ${employeeId}\n`;
        message += `📅 Período: ${startDate} al ${endDate}\n`;
        message += `📊 Total de registros: ${checadas.length}\n\n`;
        message += `⏰ *Detalle de Checadas:*\n\n`;
        
        checadas.forEach((checada, index) => {
            message += `${index + 1}. ${checada.FechaHoraLegible}\n`;
        });
        
        return message;
    }
}