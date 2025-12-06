const express = require('express')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const { authenticate, requireRole } = require('../middleware/auth')
const User = require('../models/User')

const router = express.Router()

router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 })
  res.json(users)
})

router.post(
  '/',
  authenticate,
  requireRole('admin'),
  body('nombre').isString().notEmpty(),
  body('correo').isEmail(),
  body('password').isLength({ min: 6 }),
  body('rol').isIn(['admin', 'operador']),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { nombre, correo, password, rol } = req.body
    const exists = await User.findOne({ correo })
    if (exists) return res.status(409).json({ error: 'Correo ya registrado' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ nombre, correo, password: hash, rol })
    res.status(201).json({ id: user._id })
  }
)

router.put(
  '/:id',
  authenticate,
  requireRole('admin'),
  body('nombre').optional().isString(),
  body('correo').optional().isEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('rol').optional().isIn(['admin', 'operador']),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const data = { ...req.body }
    if (data.password) data.password = await bcrypt.hash(data.password, 10)
    await User.findByIdAndUpdate(req.params.id, data)
    res.json({ ok: true })
  }
)

router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

module.exports = router
