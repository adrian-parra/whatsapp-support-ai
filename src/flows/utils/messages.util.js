/**
 * Genera un mensaje formateado.
 * @param {{ header: string; body: string; footer?: string; type: 'success' | 'error' }} options - Objeto con los datos del mensaje.
 * @param {string} options.header - Encabezado del mensaje.
 * @param {string} options.body - Cuerpo del mensaje.
 * @param {string} [options.footer] - Pie de página del mensaje.
 * @param {'success' | 'error'} options.type - Tipo de mensaje ('success' o 'error').
 * @returns {string} - Mensaje formateado.
 */
export const formatMessage = ({ header, body, footer = '', type = 'success' }) => {
  const prefix = type === 'success' ? '✅' : '❌';
  const emphasis = type === 'success' ? '*' : '*';
  const defaultFooter = type === 'success' ? '👍 😃' : '⚠️ 🙁';
  const formattedHeader = `${prefix} ${emphasis}${header}${emphasis}`;
  const formattedFooter = footer || defaultFooter;

  return `${formattedHeader}

${body}

${formattedFooter}`;
};