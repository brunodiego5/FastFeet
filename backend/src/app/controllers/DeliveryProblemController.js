import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  async index(req, res) {
    const { deliveryId } = req.params;

    /**
     * Check delivery exists
     */
    const deliveryExists = await Delivery.findByPk(deliveryId);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'This delivery does not exists' });
    }

    const deliveryProblems = await DeliveryProblem.findAll({
      where: { delivery_id: deliveryId },
    });

    return res.json(deliveryProblems);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { deliveryId } = req.params;

    /**
     * find delivery
     */
    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'This delivery does not exists' });
    }

    const { delivery_id, description } = await delivery.update(req.body);

    return res.json({ delivery_id, description });
  }
}

export default new DeliveryProblemController();
