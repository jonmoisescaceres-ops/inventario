const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const bcrypt = require('bcryptjs')
const config = require('./config')
const User = require('./models/User')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const itemRoutes = require('./routes/items')
const entryRoutes = require('./routes/entries')
const exitRoutes = require('./routes/exits')
const alertRoutes = require('./routes/alerts')
const movementRoutes = require('./routes/movements')
const dashboardRoutes = require('./routes/dashboard')

async function start() {
  let uri = config.mongoUri
  if (!process.env.MONGODB_URI) {
    const { MongoMemoryServer } = require('mongodb-memory-server')
    const mem = await MongoMemoryServer.create()
    uri = mem.getUri()
    console.log('⚠️  Usando MongoDB en memoria (no se encontró MONGODB_URI)')
  }

  try {
    await mongoose.connect(uri)
    console.log('✅ Conectado a MongoDB exitosamente')
    console.log('📍 URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')) // Oculta credenciales si las hay
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message)
    process.exit(1)
  }

  if (config.adminSeed.email && config.adminSeed.password) {
    const exists = await User.findOne({ correo: config.adminSeed.email })
    if (!exists) {
      const hash = await bcrypt.hash(config.adminSeed.password, 10)
      await User.create({ nombre: config.adminSeed.nombre, correo: config.adminSeed.email, password: hash, rol: 'admin' })
    }
  }
  if (!config.adminSeed.email) {
    const anyAdmin = await User.findOne({ rol: 'admin' })
    if (!anyAdmin) {
      const hash = await bcrypt.hash('admin123', 10)
      await User.create({ nombre: 'Admin', correo: 'admin@example.com', password: hash, rol: 'admin' })
    }
  }

  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(morgan('dev'))

  app.get('/health', (req, res) => res.json({ ok: true }))

  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/items', itemRoutes)
  app.use('/api/entries', entryRoutes)
  app.use('/api/exits', exitRoutes)
  app.use('/api/alerts', alertRoutes)
  app.use('/api/movements', movementRoutes)
  app.use('/api/dashboard', dashboardRoutes)

  app.use((err, req, res, next) => {
    console.error('❌ Error en el servidor:', err)
    res.status(500).json({ error: 'Error del servidor' })
  })

  app.listen(config.port, () => {
    console.log(`🚀 Servidor corriendo en puerto ${config.port}`)
  })
}

start()
