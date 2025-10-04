import cron from 'node-cron';
import { sendNotificationChecadores,sendNotificationTracker } from './controller/notifcationScheduler.controller.js';


cron.schedule('30 0 * * *', async () => { 
  try {
    await sendNotificationChecadores()
  } catch (error) {
    console.error('Error al enviar la notificación:', error);
  }
});

console.log('Scheduler iniciado.  Las notificaciones se enviarán a las 12:30 PM.');

cron.schedule('0 1 * * *', async () => { 
  try {
    await sendNotificationChecadores()
  } catch (error) {
    console.error('Error al enviar la notificación:', error);
  }
});

const asignaciones = [
  { phone: '5216683972780', tracker: 'TC-26' },
  { phone: '5216684804006', tracker: 'TC-26' },
  { phone: '5216988898532', tracker: 'TC-26' },
  { phone: '5216683952072', tracker: 'TC-26' },
  { phone: '5216981102279', tracker: 'TC-26' }
]


/* 4:00 PM */
cron.schedule('0 16 * * *', async () => {
  try {
    await sendNotificationTracker(asignaciones,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVlmWueUsfk-7eDhFEOyKZAUkQVLj2fpWqSw&s')
  } catch (err) {
    console.error('Error 16:00 ?', err)
  }
})

/* 4:20 PM */
cron.schedule('20 16 * * *', async () => {
  try {
    await sendNotificationTracker(asignaciones,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVlmWueUsfk-7eDhFEOyKZAUkQVLj2fpWqSw&s')
  } catch (err) {
    console.error('Error 16:20 ?', err)
  }
})

console.log('Scheduler iniciado. Las notificaciones se enviarán a la 1:00 AM.');