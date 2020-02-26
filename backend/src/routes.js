import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddlewares from './app/middlewares/auth';
import checkIsAdmin from './app/middlewares/checkAdmin';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import RecipientController from './app/controllers/RecipientController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveredController from './app/controllers/DeliveredController';
import OrderProblemController from './app/controllers/OrderProblemController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import NotificationController from './app/controllers/NotificationController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddlewares);
/* todas as rotas abaixo passaram pelo middlewares authMiddlewares */

routes.get('/users', checkIsAdmin, UserController.index);
routes.post('/users', checkIsAdmin, UserController.store);
routes.put('/users', checkIsAdmin, UserController.update);

routes.post(
  '/files',
  upload.single('file'),
  checkIsAdmin,
  FileController.store
);

routes.get('/recipients/:recipientId', checkIsAdmin, RecipientController.show);
routes.get('/recipients', checkIsAdmin, RecipientController.index);
routes.post('/recipients', checkIsAdmin, RecipientController.store);
routes.put(
  '/recipients/:recipientId',
  checkIsAdmin,
  RecipientController.update
);
routes.delete(
  '/recipients/:recipientId',
  checkIsAdmin,
  RecipientController.delete
);

routes.get('/deliveries/:orderId', checkIsAdmin, OrderController.show);
routes.get('/deliveries', checkIsAdmin, OrderController.index);
routes.post('/deliveries', checkIsAdmin, OrderController.store);
routes.put('/deliveries/:orderId', checkIsAdmin, OrderController.update);
routes.delete('/deliveries/:orderId', checkIsAdmin, OrderController.delete);

routes.get('/deliveryman/:deliveryId/deliveries', DeliveryController.index);
routes.put('/deliveryman/:deliveryId/deliveries', DeliveryController.update);

routes.get('/deliveryman/:deliveryId/delivered', DeliveredController.index);
routes.put('/deliveryman/:deliveryId/delivered', DeliveredController.update);

routes.get('/delivery-problems', checkIsAdmin, OrderProblemController.index);

routes.get('/delivery/:deliveryId/problems', DeliveryProblemController.index);
routes.put('/delivery/:deliveryId/problems', DeliveryProblemController.update);

routes.delete(
  '/problem/:deliveryId/cancel-delivery',
  checkIsAdmin,
  OrderProblemController.destroy
);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

export default routes;
