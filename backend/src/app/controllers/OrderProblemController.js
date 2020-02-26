import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

import Queue from '../../lib/Queue';
import Notification from '../schemas/Notification';

import CancellationDelivery from '../jobs/CancellationDelivery';

class OrderProblemController {
  async index(req, res) {
    const orderProblems = await DeliveryProblem.findAll();

    return res.json(orderProblems);
  }

  async destroy(req, res) {
    const { deliveryId } = req.params;

    /**
     * find delivery
     */
    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'This delivery does not exists' });
    }

    delivery.canceled_at = new Date();

    await delivery.save();

    await Queue.add(CancellationDelivery.key, delivery);

    await Notification.create({
      content: `Entrega Cancela. Produto: ${delivery.product} Destinatario: ${delivery.recipient_id}`,
      user: delivery.user_id,
    });

    return res.json(delivery);
  }
}

export default new OrderProblemController();
