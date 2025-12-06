const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const config = require('../config')

const router = express.Router()

router.post(
  '/login',
  body('correo').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { correo, password } = req.body
    const user = await User.findOne({ correo })
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' })
    const token = jwt.sign({ id: user._id, rol: user.rol, nombre: user.nombre, correo: user.correo }, config.jwtSecret, { expiresIn: '12h' })
    return res.json({ token, usuario: { id: user._id, rol: user.rol, nombre: user.nombre, correo: user.correo } })
  }
)

router.post(
  '/register',
  body('nombre').isString().notEmpty(),
  body('correo').isEmail(),
  body('password').isLength({ min: 6 }),
  body('rol').isIn(['admin', 'operador']),
  body('codigo').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { nombre, correo, password, rol, codigo } = req.body
    const exists = await User.findOne({ correo })
    if (exists) return res.status(409).json({ error: 'Correo ya registrado' })

    if (rol === 'admin') {
      const anyAdmin = await User.findOne({ rol: 'admin' })
      if (anyAdmin) {
        // Si ya existe un admin, se requiere el código de invitación
        if (!config.adminInviteCode) {
          return res.status(403).json({ error: 'Registro de administradores deshabilitado (no hay código configurado)' })
        }
        if (!codigo || codigo !== config.adminInviteCode) {
          return res.status(403).json({ error: 'Código de administrador inválido' })
        }
      }
    } else {
      if (!config.allowPublicRegistration) return res.status(403).json({ error: 'Registro deshabilitado' })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ nombre, correo, password: hash, rol })
    res.status(201).json({ id: user._id })
  }
)

module.exports = router
