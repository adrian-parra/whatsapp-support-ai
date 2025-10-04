/**
 * Envía un mensaje a través de la API de WhatsApp.
 * @param {object} params - Objeto que contiene el mensaje a enviar.
 * @param {string} params.message - El mensaje a enviar.
 * @param {string} params.number - El numero de destino.
 * @returns {Promise<object>} - La respuesta de la API o un error.
 */
export const sendMessage = async ({ message ,number, path = '' }) => {
  try {
    const response = await fetch(`${process.env.URL_API_WHATSAPP_BOT_LOCAL}messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        number: number,
        message: message,
        urlMedia: path
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || `Error HTTP: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-lanzar el error para que lo maneje la capa superior
  }
};