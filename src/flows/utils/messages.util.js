/**
 * Genera un mensaje formateado.
 * @param {{ header: string; body: string; footer?: string; type: 'success' | 'error' | 'info' | 'notification' | 'warning'}} options - Objeto con los datos del mensaje.
 * @param {string} options.header - Encabezado del mensaje.
 * @param {string} options.body - Cuerpo del mensaje.
 * @param {string} [options.footer] - Pie de página del mensaje.
 * @param {'success' | 'error' | 'info' | 'notification' | 'warning'} options.type - Tipo de mensaje ('success', 'error', 'info', 'notification' o 'warning').
 * @returns {string} - Mensaje formateado.
 */
export const formatMessage = ({ header, body, footer = ' ', type = 'success' }) => {
  const prefix = type === 'success' ? '✅' : (type === 'error' ? '❌' : (type === 'info' ? 'ℹ️' : (type === 'warning' ? '⚠️' : '🔔')));
  const emphasis = type === 'success' ? '*' : '*';
  const defaultFooter = type === 'success' ? '👍 😃' : (type === 'error' ? '⚠️ 🙁' : (type === 'info' ? '🤔' : (type === 'warning' ? '⚠️' : '')));
  const formattedHeader = `${prefix} ${emphasis}${header}${emphasis}`;
  const formattedFooter = footer || defaultFooter;

  return `${formattedHeader}
  
${body}
${formattedFooter}`;
};

/**
 * 
⌛️⏳
 * Genera un ícono de progreso basado en el índice actual
 * @param {number} index - Índice actual (0-based)
 * @param {number} total - Total de pasos
 * @returns {string} - Ícono de progreso
 */
export const getProgressIcon = (index, total) => {
    const progressBars = '▰▱';
    const size = 10;
    const progress = Math.min(size, Math.ceil((index + 1) / total * size));
    const progressBar = progressBars[0].repeat(progress) + progressBars[1].repeat(size - progress);
    return `${progressBar} ${Math.round((index + 1) / total * 100)}%`;
};