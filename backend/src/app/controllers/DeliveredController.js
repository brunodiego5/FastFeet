import * as Yup from 'yup';

import Delivery from '../models/Delivery';

class DeliveredController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: {
        end_date: {
          $ne: null,
        },
      },
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { deliveryId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(404).json({ error: 'This order does not exists' });
    }

    const { id, recipient_id, user_id, product, end_date } = delivery.update(
      req.body
    );

    return res.json({ id, recipient_id, user_id, product, end_date });
  }
}

export default new DeliveredController();
