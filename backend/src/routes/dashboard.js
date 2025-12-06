const express = require('express')
const { authenticate, requireRole } = require('../middleware/auth')
const Item = require('../models/Item')
const Movement = require('../models/Movement')

const router = express.Router()

router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  const totalInsumos = await Item.countDocuments()
  const bajos = await Item.countDocuments({ $expr: { $lte: ['$stock_actual', '$stock_minimo'] } })
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const manana = new Date(hoy)
  manana.setDate(manana.getDate() + 1)
  const entradasHoy = await Movement.countDocuments({ tipo: 'entrada', fecha: { $gte: hoy, $lt: manana } })
  const salidasHoy = await Movement.countDocuments({ tipo: 'salida', fecha: { $gte: hoy, $lt: manana } })

  const inicioAno = new Date(new Date().getFullYear(), 0, 1)
  const consumoMensual = await Movement.aggregate([
    { $match: { tipo: 'salida', fecha: { $gte: inicioAno } } },
    {
      $group: {
        _id: { mes: { $month: '$fecha' } },
        total: { $sum: '$cantidad' },
      },
    },
    { $sort: { '_id.mes': 1 } },
  ])

  const alertas = await Item.find({ $expr: { $lte: ['$stock_actual', '$stock_minimo'] } }).sort({ stock_actual: 1 }).limit(10)

  res.json({ totalInsumos, bajos, entradasHoy, salidasHoy, consumoMensual, alertas })
})

module.exports = router
