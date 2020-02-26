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

routes.get('/deliveries/:deliveryId', checkIsAdmin, OrderController.show);
routes.get('/deliveries', checkIsAdmin, OrderController.index);
routes.post('/deliveries', checkIsAdmin, OrderController.store);
routes.put('/deliveries/:deliveryId', checkIsAdmin, OrderController.update);
routes.delete('/deliveries/:deliveryId', checkIsAdmin, OrderController.delete);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

export default routes;
