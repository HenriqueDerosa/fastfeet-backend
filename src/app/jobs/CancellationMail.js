import Mail from '../../lib/Mail'

class CancellationMail {
  get key() {
    return 'CancellationMail'
  }

  async handle({ data }) {
    const { order } = data

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: `Entrega cancelada #${order.id}`,
      template: 'cancel-order',
      context: {
        name: order.deliveryman.name,
        orderId: order.id,
      },
    })
  }
}

export default new CancellationMail()
