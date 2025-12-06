const nodemailer = require('nodemailer')
const config = require('../config')

function createTransport() {
  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass || !config.smtp.port) return null
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  })
}

async function sendAlertEmail(item) {
  if (!config.alertsEmailEnable) return
  const transport = createTransport()
  if (!transport) return
  const to = config.adminSeed.email
  if (!to) return
  const subject = `Alerta de bajo stock: ${item.nombre}`
  const text = `El insumo "${item.nombre}" tiene stock actual de ${item.stock_actual} por debajo del mínimo ${item.stock_minimo}.`
  await transport.sendMail({ from: config.smtp.user, to, subject, text })
}

module.exports = { sendAlertEmail }
