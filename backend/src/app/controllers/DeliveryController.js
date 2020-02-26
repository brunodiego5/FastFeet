import { getHours } from 'date-fns';

import Delivery from '../models/Delivery';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({ where: { end_date: null } });

    return res.json(deliveries);
  }

  async update(req, res) {
    const now = new Date();

    /*
     * Check now is between 8 and 18
     */
    if (!(getHours(now) >= 8 && getHours(now) <= 18)) {
      return res
        .status(400)
        .json({ error: 'withdrawals are only allowed between 8 am and 6 pm' });
    }

    /*
     * check quantity of withdrawals 5 per day
     */
    const amount = await Delivery.findAndCountAll({
      where: { user_id: req.userId, start_date: now },
    });

    if (amount > 5) {
      return res
        .status(400)
        .json({ error: 'Only 5 withdrawals per day are allowed' });
    }

    const { deliveryId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    /*
     * Check delivery exists
     */
    if (!delivery) {
      return res.status(404).json({ error: 'This order does not exists' });
    }

    delivery.start_date = now;

    delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryController();
