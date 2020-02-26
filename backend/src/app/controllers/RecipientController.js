import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async show(req, res) {
    const { recipientId } = req.params;

    const recipient = await Recipient.findByPk(recipientId);

    if (!recipient) {
      return res.status(400).json({ error: 'This recipient does not exists ' });
    }

    return res.json(recipient);
  }

  async index(req, res) {
    const recipients = await Recipient.findAll();

    return res.json(recipients);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      document: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipientExists = await Recipient.findOne({
      where: { document: req.body.document },
    });

    if (recipientExists) {
      return res.status(400).json({
        error: `Recipient already exists. document: ${req.body.document}`,
      });
    }

    const { id, name, document } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      document,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      document: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { document: newDocument } = req.body;

    const recipient = await Recipient.findByPk(req.id);

    if (!recipient) {
      return res.status(404).json({ error: 'This recipient does not exists' });
    }

    if (newDocument && newDocument !== recipient.document) {
      const recipientExists = await Recipient.findOne({
        where: { newDocument },
      });

      if (recipientExists) {
        return res.status(400).json({ error: 'Recipient already exists.' });
      }
    }

    const {
      id,
      name,
      document,
      street,
      number,
      complement,
      state,
      city,
      zip,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      document,
      street,
      number,
      complement,
      state,
      city,
      zip,
    });
  }

  async delete(req, res) {
    const { recipientId } = req.params;

    const recipient = await Recipient.findByPk(recipientId);

    if (!recipient) {
      return res.status(404).json({ error: 'This recipient does not exists' });
    }

    const { name } = recipient;
    await recipient.destroy();

    return res.json({ message: `Recipient ${name} was deleted` });
  }
}

export default new RecipientController();
