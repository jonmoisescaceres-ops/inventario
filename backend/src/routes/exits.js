const express = require('express')
const { body, validationResult } = require('express-validator')
const { authenticate, requireRole } = require('../middleware/auth')
const Item = require('../models/Item')
const Movement = require('../models/Movement')
const { sendAlertEmail } = require('../utils/mailer')

const router = express.Router()

router.post(
  '/',
  authenticate,
  requireRole(['admin', 'operador']),
  body('insumo_id').isString().notEmpty(),
  body('cantidad').isInt({ min: 1 }),
  body('area').optional().isString(),
  body('comentario').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { insumo_id, cantidad, area, comentario } = req.body
    const item = await Item.findById(insumo_id)
    if (!item) return res.status(404).json({ error: 'Insumo no encontrado' })
    if (cantidad > item.stock_actual) return res.status(400).json({ error: 'Stock insuficiente' })
    item.stock_actual -= cantidad
    await item.save()
    const mov = await Movement.create({ insumo_id, tipo: 'salida', cantidad, usuario: req.user.nombre, area: area || '', comentario: comentario || '' })
    if (item.stock_actual <= item.stock_minimo) await sendAlertEmail(item)
    res.status(201).json({ ok: true, movimiento_id: mov._id })
  }
)

module.exports = router
