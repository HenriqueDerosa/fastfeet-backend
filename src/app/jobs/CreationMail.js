import Mail from '../../lib/Mail'

class CreationMail {
  get key() {
    return 'CreationMail'
  }

  async handle({ data }) {
    const { order } = data
    console.log(order)

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: `Pedido de entrega #${order.id}`,
      template: 'create-order',
      context: {
        name: order.deliveryman.name,
        orderId: order.id,
        productName: order.product,
        recipientName: order.recipient.name,
        recipientFullAddress: `${order.recipient.address}. ${order.recipient.address2}. ${order.recipient.number}. ${order.recipient.zipcode}. ${order.recipient.city}. ${order.recipient.state} `,
      },
    })
  }
}

export default new CreationMail()
