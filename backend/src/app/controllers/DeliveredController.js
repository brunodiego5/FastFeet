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
    const { deliveryId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    /*
     * Check delivery exists
     */
    if (!delivery) {
      return res.status(404).json({ error: 'This delivery does not exists' });
    }

    const {
      id,
      recipient_id,
      user_id,
      product,
      end_date,
      signature,
    } = delivery.update({
      ...req.body,
      end_date: new Date(),
    });

    return res.json({
      id,
      recipient_id,
      user_id,
      product,
      end_date,
      signature,
    });
  }
}

export default new DeliveredController();
