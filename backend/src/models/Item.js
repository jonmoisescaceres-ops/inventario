const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    categoria: { type: String, default: '' },
    unidad: { type: String, default: '' },
    stock_actual: { type: Number, default: 0 },
    stock_minimo: { type: Number, default: 0 },
    fecha_creacion: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Item', ItemSchema)
