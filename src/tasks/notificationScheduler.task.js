import cron from 'node-cron';
import { notificationController } from './controller/notifcationScheduler.controller.js';


cron.schedule('10 0 * * 1-5', async () => { // Se ejecuta a las 11 PM (23:00) todos los días.
  try {
    await notificationController()
    console.log('Mensaje de notificación enviado correctamente a las 11 PM.');
  } catch (error) {
    console.error('Error al enviar la notificación:', error);
  }
});

console.log('Scheduler iniciado.  Las notificaciones se enviarán a las 12:10 PM.');