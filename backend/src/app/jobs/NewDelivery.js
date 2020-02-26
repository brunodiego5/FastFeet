import Mail from '../../lib/Mail';

class NewDelivery {
  get key() {
    return 'NewDelivery';
  }

  async handle({ data }) {
    const { delivary } = data;

    await Mail.sendMail({
      to: `${delivary.delivaryman.name} <${delivary.delivaryman.email}>`,
      subject: 'Nova entrega para retirada',
      template: 'new',
      context: {
        delivaryman: delivary.delivaryman.name,
        recipient: delivary.recipient.name,
        product: delivary.product,
      },
    });
  }
}

export default new NewDelivery();
