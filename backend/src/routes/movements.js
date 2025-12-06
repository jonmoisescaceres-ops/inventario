const express = require('express')
const { authenticate } = require('../middleware/auth')
const Movement = require('../models/Movement')

const router = express.Router()

router.get('/', authenticate, async (req, res) => {
  const { tipo, desde, hasta, usuario, insumo_id } = req.query
  const q = {}
  if (tipo) q.tipo = tipo
  if (insumo_id) q.insumo_id = insumo_id
  if (desde || hasta) {
    q.fecha = {}
    if (desde) q.fecha.$gte = new Date(desde)
    if (hasta) q.fecha.$lte = new Date(hasta)
  }
  if (req.user.rol === 'operador') {
    q.usuario = req.user.nombre
    q.tipo = 'salida'
  } else if (usuario) {
    q.usuario = usuario
  }
  const moves = await Movement.find(q).sort({ fecha: -1 })
  res.json(moves)
})

module.exports = router
