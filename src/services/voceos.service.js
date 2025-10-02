import sql from 'mssql';

/**
 * Configuración de la base de datos SQL Server para voceos
 */
const dbConfig = {
    server: '172.30.73.8',
    database: 'lanpointCs',
    user: 'lanpoint',
    password: 'syslanpoint',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

/**
 * Servicio para manejar las consultas de voceos
 */
export class VoceosService {
    /**
     * Obtiene los voceos en un rango de fechas y departamento específico
     * @param {string} startDate - Fecha de inicio (YYYY-MM-DD)
     * @param {string} endDate - Fecha de fin (YYYY-MM-DD)
     * @param {string} departmentId - ID del departamento (opcional)
     * @returns {Promise<Array>} Array con los voceos encontrados
     */
    static async getVoceos(startDate, endDate, departmentId = null) {
        let pool;
        try {
            // Crear conexión a la base de datos
            pool = await sql.connect(dbConfig);
            
            // Preparar la consulta SQL base
            let query = `
                SELECT *,
                    CONCAT( 
                        CASE DATEPART(WEEKDAY, DateRegister) 
                            WHEN 1 THEN 'Domingo' 
                            WHEN 2 THEN 'Lunes' 
                            WHEN 3 THEN 'Martes' 
                            WHEN 4 THEN 'Miércoles' 
                            WHEN 5 THEN 'Jueves' 
                            WHEN 6 THEN 'Viernes' 
                            WHEN 7 THEN 'Sábado' 
                        END, 
                        ', ', 
                        DAY(DateRegister), ' de ', 
                        CASE MONTH(DateRegister) 
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
                        ' del ', YEAR(DateRegister), 
                        ' a las ', 
                        FORMAT(DateRegister, 'HH:mm:ss') 
                    ) AS FechaHoraLegible
                FROM [LanpointCs].[dbo].[TBL_LineID_DepartmentID] 
                WHERE [DateRegister] >= CAST(@startDate AS DATE) 
                AND [DateRegister] < DATEADD(DAY, 1, CAST(@endDate AS DATE))`;
            
            // Agregar filtro de departamento si se proporciona
            if (departmentId) {
                query += ` AND [DepartmentID] = @departmentId`;
            }
            
            query += ` ORDER BY [DateRegister] DESC`;
            
            // Ejecutar la consulta con parámetros
            const request = pool.request();
            request.input('startDate', sql.DateTime, `${startDate}`);
            request.input('endDate', sql.DateTime, `${endDate}`);
            
            if (departmentId) {
                request.input('departmentId', sql.VarChar, departmentId);
            }
            
            const result = await request.query(query);
            
            return result.recordset;
            
        } catch (error) {
            console.error('Error al consultar voceos:', error);
            throw new Error('Error al consultar la base de datos de voceos');
        } finally {
            // Cerrar la conexión
            if (pool) {
                await pool.close();
            }
        }
    }
    
    /**
     * Formatea los voceos para mostrar en WhatsApp
     * @param {Array} voceos - Array de voceos
     * @param {string} startDate - Fecha de inicio
     * @param {string} endDate - Fecha de fin
     * @param {string} departmentId - ID del departamento (opcional)
     * @returns {string} Mensaje formateado para WhatsApp
     */
    static formatVoceosMessage(voceos, startDate, endDate, departmentId = null) {
        if (!voceos || voceos.length === 0) {
            let message = `🎤 *Consulta de Voceos*\n\n`;
            message += `📅 Período: ${startDate} al ${endDate}\n`;
            if (departmentId) {
                message += `🏢 Departamento: ${departmentId}\n`;
            }
            message += `\n❌ No se encontraron registros de voceos para este período.`;
            return message;
        }
        
        let message = `🎤 *Consulta de Voceos*\n\n`;
        message += `📅 Período: ${startDate} al ${endDate}\n`;
        if (departmentId) {
            message += `🏢 Departamento: ${departmentId}\n`;
        }
        message += `📊 Total de registros: ${voceos.length}\n\n`;
        message += `📋 *Detalle de Voceos:*\n\n`;
        
        voceos.forEach((voceo, index) => {
            message += `${index + 1}. 📞 *LineID:* ${voceo.LineID}\n`;
            message += `   🏢 *Depto:* ${voceo.DepartmentID}\n`;
            message += `   🔧 *Problema:* ${voceo.ProblemID}\n`;
            message += `   📅 *Fecha:* ${voceo.FechaHoraLegible}\n`;
            message += `   📊 *Estado:* ${voceo.Status}\n`;
            if (voceo.DateVoice) {
                message += `   🎤 *Fecha Voceo:* ${new Date(voceo.DateVoice).toLocaleString('es-MX')}\n`;
            }
            if (voceo.Desktop) {
                message += `   💻 *Desktop:* ${voceo.Desktop}\n`;
            }
            if (voceo.Area) {
                message += `   📍 *Área:* ${voceo.Area}\n`;
            }
            message += `\n`;
        });
        
        return message;
    }
    
    /**
     * Obtiene estadísticas de voceos por departamento
     * @param {string} startDate - Fecha de inicio (YYYY-MM-DD)
     * @param {string} endDate - Fecha de fin (YYYY-MM-DD)
     * @returns {Promise<Array>} Array con estadísticas por departamento
     */
    static async getVoceosStats(startDate, endDate) {
        let pool;
        try {
            pool = await sql.connect(dbConfig);
            
            const query = `
                SELECT 
                    [DepartmentID],
                    COUNT(*) as TotalVoceos,
                    COUNT(CASE WHEN [Status] = 'Activo' THEN 1 END) as VoceosActivos,
                    COUNT(CASE WHEN [Status] = 'Inactivo' THEN 1 END) as VoceosInactivos
                FROM [LanpointCs].[dbo].[TBL_LineID_DepartmentID] 
                WHERE [DateRegister] >= @startDate 
                AND [DateRegister] < @endDate
                GROUP BY [DepartmentID]
                ORDER BY TotalVoceos DESC`;
            
            const request = pool.request();
            request.input('startDate', sql.DateTime, `${startDate} 00:00:00.000`);
            request.input('endDate', sql.DateTime, `${endDate} 23:59:59.999`);
            
            const result = await request.query(query);
            return result.recordset;
            
        } catch (error) {
            console.error('Error al consultar estadísticas de voceos:', error);
            throw new Error('Error al consultar estadísticas de voceos');
        } finally {
            if (pool) {
                await pool.close();
            }
        }
    }
    
    /**
     * Formatea las estadísticas de voceos para WhatsApp
     * @param {Array} stats - Array de estadísticas
     * @param {string} startDate - Fecha de inicio
     * @param {string} endDate - Fecha de fin
     * @returns {string} Mensaje formateado para WhatsApp
     */
    static formatStatsMessage(stats, startDate, endDate) {
        if (!stats || stats.length === 0) {
            return `📊 *Estadísticas de Voceos*\n\n` +
                   `📅 Período: ${startDate} al ${endDate}\n\n` +
                   `❌ No se encontraron datos para generar estadísticas.`;
        }
        
        let message = `📊 *Estadísticas de Voceos*\n\n`;
        message += `📅 Período: ${startDate} al ${endDate}\n\n`;
        
        const totalGeneral = stats.reduce((sum, stat) => sum + stat.TotalVoceos, 0);
        message += `📈 *Total General:* ${totalGeneral} voceos\n\n`;
        message += `🏢 *Por Departamento:*\n\n`;
        
        stats.forEach((stat, index) => {
            message += `${index + 1}. *Depto ${stat.DepartmentID}:* ${stat.TotalVoceos} voceos\n`;
            message += `   ✅ Activos: ${stat.VoceosActivos}\n`;
            message += `   ❌ Inactivos: ${stat.VoceosInactivos}\n\n`;
        });
        
        return message;
    }
}