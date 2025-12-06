const dotenv = require('dotenv')
dotenv.config()

const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/inventario',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  allowPublicRegistration: process.env.ALLOW_PUBLIC_REGISTRATION !== 'false',
  adminInviteCode: process.env.ADMIN_INVITE_CODE || '',
  alertsEmailEnable: process.env.ALERTS_EMAIL_ENABLE === 'true',
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 0),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  adminSeed: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    nombre: process.env.ADMIN_NAME || 'Admin',
  },
}

module.exports = config
