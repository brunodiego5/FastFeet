import { isWithinRange } from 'date-fns';

import Delivery from '../models/Delivery';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({ where: { end_date: null } });

    return res.json(deliveries);
  }

  async update(req, res) {
    const now = new Date();

    if (
      isWithinRange(
        new Date(2014, 0, 3),
        new Date(2014, 0, 1),
        new Date(2014, 0, 7)
      )
    ) {
      return res
        .status(400)
        .json({ error: 'Only withdrawal per day is allowed' });
    }

    const amount = await Delivery.findAndCountAll({
      where: { user_id: req.userId, start_date: now },
    });

    if (amount > 5) {
      return res
        .status(400)
        .json({ error: 'Only withdrawal per day is allowed' });
    }

    const { deliveryId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(404).json({ error: 'This order does not exists' });
    }

    const { id, recipient_id, user_id, product, start_date } = delivery.update({
      start_date: new Date(),
    });

    return res.json({ id, recipient_id, user_id, product, start_date });
  }
}

export default new DeliveryController();
