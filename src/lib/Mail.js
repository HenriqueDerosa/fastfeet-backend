import { resolve } from 'path'
import nodemailer from 'nodemailer'
import handlebars from 'express-handlebars'
import nodemailerhbs from 'nodemailer-express-handlebars'
import config from '../config/mail'

class Mail {
  constructor() {
    const { host, port, secure, auth } = config

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    })

    this.setupTemplates()
  }

  setupTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails')

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: handlebars.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    )
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...config.default,
      ...message,
    })
  }
}

export default new Mail()
