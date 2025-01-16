/**
 * Obtiene el estado del checador dado su IP.
 * @param {string} ip - La dirección IP del checador.
 * @returns {Promise<object>} - Un objeto con el estado del checador.
 * @throws {Error} - Si hay un error durante la solicitud o si la respuesta no es exitosa.
 */
export const getChecadorStatusService = async (ip) => {
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