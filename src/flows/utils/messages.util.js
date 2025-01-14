/**
 * Genera un mensaje formateado.
 * @param {{ header: string; body: string; footer?: string; type: 'success' | 'error' | 'info' | 'notification'}} options - Objeto con los datos del mensaje.
 * @param {string} options.header - Encabezado del mensaje.
 * @param {string} options.body - Cuerpo del mensaje.
 * @param {string} [options.footer] - Pie de página del mensaje.
 * @param {'success' | 'error' | 'info' | 'notification'} options.type - Tipo de mensaje ('success', 'error' o 'info').
 * @returns {string} - Mensaje formateado.
 */
export const formatMessage = ({ header, body, footer = ' ', type = 'success' }) => {
  const prefix = type === 'success' ? '✅' : (type === 'error' ? '❌' : (type === 'info' ? 'ℹ️' : '🔔'));
  const emphasis = type === 'success' ? '*' : '*';
  const defaultFooter = type === 'success' ? '👍 😃' : (type === 'error' ? '⚠️ 🙁' : (type === 'info' ? '🤔' : ''));
  const formattedHeader = `${prefix} ${emphasis}${header}${emphasis}`;
  const formattedFooter = footer || defaultFooter;

  return `${formattedHeader}
  
${body}
${formattedFooter}`;
};