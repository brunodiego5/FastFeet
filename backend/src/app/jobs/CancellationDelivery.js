import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationDelivery {
  get key() {
    return 'CancellationDelivery';
  }

  async handle({ data }) {
    const { delivary } = data;

    await Mail.sendMail({
      to: `${delivary.delivaryman.name} <${delivary.delivaryman.email}>`,
      subject: 'Entrega cancelada',
      template: 'cancellation',
      context: {
        delivaryman: delivary.delivaryman.name,
        recipient: delivary.recipient.name,
        product: delivary.product,
        date: format(
          parseISO(delivary.canceled_at),
          "'dia ' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationDelivery();
