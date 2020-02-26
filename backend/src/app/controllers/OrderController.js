import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Queue from '../../lib/Queue';
import Notification from '../schemas/Notification';

import CancellationDelivery from '../jobs/CancellationDelivery';

class OrderController {
  async show(req, res) {
    const { orderId } = req.params;

    const order = await Delivery.findByPk(orderId);

    if (!order) {
      res.status(400).json({ error: 'Order not found.' });
    }

    return res.json(order);
  }

  async index(req, res) {
    const orders = await Delivery.findAll();

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      user_id: Yup.number().required(),
      admin_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      id,
      recipient_id,
      user_id,
      admin_id,
      product,
    } = await Delivery.create(req.body);

    await Queue.add(CancellationDelivery.key, {
      id,
      recipient_id,
      user_id,
      admin_id,
      product,
    });

    await Notification.create({
      content: `Nova entrega disponivel para retirada. Produto: ${product} Destinatario: ${recipient_id}`,
      user: user_id,
    });

    return res.json({ id, recipient_id, user_id, admin_id, product });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      user_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { orderId } = req.params;

    const order = await Delivery.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: 'This order does not exists' });
    }

    const { id, recipient_id, user_id, product } = order.update(req.body);

    return res.json({ id, recipient_id, user_id, product });
  }

  async destroy(req, res) {
    const { orderId } = req.params;

    const order = await Delivery.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: 'This order does not exists' });
    }

    const { id } = order;
    await order.destroy();

    return res.json({ message: `Order ${id} was deleted` });
  }
}

export default new OrderController();
