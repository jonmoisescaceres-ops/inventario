const express = require('express')
const { body, validationResult } = require('express-validator')
const { authenticate, requireRole } = require('../middleware/auth')
const Item = require('../models/Item')

const router = express.Router()

router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  const items = await Item.find().sort({ nombre: 1 })
  res.json(items)
})

router.get('/options', authenticate, async (req, res) => {
  const items = await Item.find({}, { nombre: 1 }).sort({ nombre: 1 })
  res.json(items)
})

router.post(
  '/',
  authenticate,
  requireRole('admin'),
  body('nombre').isString().notEmpty(),
  body('categoria').optional().isString(),
  body('unidad').optional().isString(),
  body('stock_actual').isInt({ min: 0 }),
  body('stock_minimo').isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const item = await Item.create(req.body)
    res.status(201).json(item)
  }
)

router.put(
  '/:id',
  authenticate,
  requireRole('admin'),
  body('nombre').optional().isString(),
  body('categoria').optional().isString(),
  body('unidad').optional().isString(),
  body('stock_actual').optional().isInt({ min: 0 }),
  body('stock_minimo').optional().isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(item)
  }
)

router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  await Item.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

module.exports = router
