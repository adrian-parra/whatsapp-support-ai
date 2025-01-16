import { formatMessage } from "../../../../utils/messages.util.js";
/**
 * Valida si las variables de entorno necesarias para la gestión de checadores están definidas.
 * @param {Function} flowDynamic - Función para mostrar mensajes al usuario.
 * @returns {Promise<boolean>} - True si las variables están definidas, false en caso contrario.
 * @description Esta función verifica si las variables de entorno CHECADORES_HOSTNAME y URL_API_FRONT están definidas en el archivo .env. 
 * Si alguna no lo está, muestra un mensaje de error al usuario a través de la función flowDynamic y retorna false. De lo contrario, retorna true.
 */
export const variableEntornoStatusChecadoresValidation = async (flowDynamic) => {
    const errors = [];
    const hostnameChecadores = process.env.CHECADORES_HOSTNAME;
    const pathUrlApiFront = process.env.URL_API_FRONT;
    
    /**
     * Valida si la variable de entorno CHECADORES_HOSTNAME está definida.
     */
    if (!hostnameChecadores) {
        errors.push({
            header: "La variable de entorno CHECADORES_HOSTNAME no está definida.",
            body: "Revisa el archivo .env",
            type:'error'
        });
    }
    
    /**
     * Valida si la variable de entorno URL_API_FRONT está definida.
     */
    if (!pathUrlApiFront) {
        errors.push({
            header: "La variable de entorno URL_API_FRONT no está definida.",
            body: "Revisa el archivo .env",
            type:'error'
        });
    }
    
    /**
     * Si hay errores, muestra los mensajes de error al usuario y retorna false.
     */
    if (errors.length > 0) {
        for (const error of errors) {
            await flowDynamic(formatMessage(error));
        }
        return false;
    }
    
    /**
     * Si no hay errores, retorna true.
     */
    return true;
}