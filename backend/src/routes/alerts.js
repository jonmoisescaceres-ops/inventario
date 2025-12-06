const express = require('express')
const { authenticate, requireRole } = require('../middleware/auth')
const Item = require('../models/Item')
const { sendAlertEmail } = require('../utils/mailer')

const router = express.Router()

router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  const items = await Item.find({ $expr: { $lte: ['$stock_actual', '$stock_minimo'] } }).sort({ stock_actual: 1 })
  res.json(items)
})

router.post('/notify/:id', authenticate, requireRole('admin'), async (req, res) => {
  const item = await Item.findById(req.params.id)
  if (!item) return res.status(404).json({ error: 'Insumo no encontrado' })
  await sendAlertEmail(item)
  res.json({ ok: true })
})

module.exports = router
