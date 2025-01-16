import cron from 'node-cron';
import { notificationController } from './controller/notifcationScheduler.controller.js';


cron.schedule('30 0 * * 1-5', async () => { 
  try {
    await notificationController()
  } catch (error) {
    console.error('Error al enviar la notificación:', error);
  }
});

console.log('Scheduler iniciado.  Las notificaciones se enviarán a las 12:30 PM.');

cron.schedule('0 1 * * 1-5', async () => { 
  try {
    await notificationController()
  } catch (error) {
    console.error('Error al enviar la notificación:', error);
  }
});

console.log('Scheduler iniciado. Las notificaciones se enviarán a la 1:00 AM.');