
/**
 * Obtiene el uptime del equipo por su IP.
 * @param {string} ip - La dirección IP del equipo.
 * @returns {Promise<object>} - Un objeto con el uptime del equipo.
 * @throws {Error} - Si hay un error durante la solicitud o si la respuesta no es exitosa.
 */
export const getUptimeDevice = async (ip) => {
    try {
        // Crea un nuevo objeto FormData para enviar datos al servidor.
        const formData = new FormData();
        formData.append("ip", ip);

        // Realiza una solicitud POST a la API para obtener el estado del checador.
        const response = await fetch(`${process.env.URL_API_FRONT}cmd/UptimeDeviceWmi`, {
            method: "POST",
            body: formData
        });

        // Verifica si la solicitud fue exitosa (código de estado 2xx).
        if (!response.ok) {
            // Si la solicitud no fue exitosa, lanza un error con información detallada.
            const errorData = await response.json();
            const errorMessage = errorData.message || `Error de red: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        // Si la solicitud fue exitosa, devuelve los datos en formato JSON.
        return await response.json();
    } catch (error) {
        // Si ocurre un error durante la solicitud, lanza un error con el mensaje de error.
        // Incluye el mensaje de error original para facilitar el diagnóstico.
        const errorMessage = error.message ? `Error al obtener el estado del checador: ${error.message}` : 'Error al obtener el estado del checador';
        throw new Error(errorMessage);
    }
};

/**
 * Obtiene la lista de procesos abiertos en el equipo con la IP especificada.
 * @param {string} ip - La dirección IP del equipo.
 * @returns {Promise<object[]>} - Un arreglo de objetos con los procesos abiertos.
 * @throws {Error} - Si hay un error durante la solicitud o si la respuesta no es exitosa.
 */
export const getProccessInfo = async (ip) => {
    try {
        // Crea un nuevo objeto FormData para enviar datos al servidor.
        const formData = new FormData();
        formData.append("ip", ip);

        // Realiza una solicitud POST a la API para obtener el estado del checador.
        const response = await fetch(`${process.env.URL_API_FRONT}Cmd/GetProccessInfo`, {
            method: "POST",
            body: formData
        });

        // Verifica si la solicitud fue exitosa (código de estado 2xx).
        if (!response.ok) {
            // Si la solicitud no fue exitosa, lanza un error con información detallada.
            const errorData = await response.json();
            const errorMessage = errorData.message || `Error de red: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        // Si la solicitud fue exitosa, devuelve los datos en formato JSON.
        return await response.json();
    } catch (error) {
        // Si ocurre un error durante la solicitud, lanza un error con el mensaje de error.
        // Incluye el mensaje de error original para facilitar el diagnóstico.
        const errorMessage = error.message ? `Error al obtener el estado del checador: ${error.message}` : 'Error al obtener el estado del checador';
        throw new Error(errorMessage);
    }
};


/**
 * Obtiene información detallada de un dispositivo usando WMI
 * @param {string} ip - IP o hostname del dispositivo
 * @returns {Promise<Object>} - Información del dispositivo
 * @throws {Error} - Si hay un error en la petición
 */
export const obtenerInfoDispositivoService = async (ip) => {
    try {
        const formData = new FormData();
        formData.append("ip", ip);  

        const response = await fetch(`${process.env.URL_API_FRONT}cmd/ObtenerInfoDeviceWmi`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener información del dispositivo:', error);
        throw new Error('No se pudo obtener la información del dispositivo. Por favor, verifique que esté disponible.');
    }
};



/**
 * Reinicia un dispositivo remoto
 * @param {string} ip - IP o hostname del dispositivo a reiniciar
 * @returns {Promise<string>} - Mensaje de confirmación de la operación
 * @throws {Error} - Si hay un error en la petición
 */
export const restartDevice = async (ip) => {
    try {
        const formData = new FormData();
        formData.append("ip", ip);  
        const response = await fetch(`${process.env.URL_API_FRONT}cmd/RestartDeviceWmi`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al reiniciar el dispositivo:', error);
        throw new Error('No se pudo reiniciar el dispositivo. Por favor, verifique que esté disponible.');
    }
};