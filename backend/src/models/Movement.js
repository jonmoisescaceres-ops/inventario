const mongoose = require('mongoose')

const MovementSchema = new mongoose.Schema(
  {
    insumo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    tipo: { type: String, enum: ['entrada', 'salida'], required: true },
    cantidad: { type: Number, required: true },
    usuario: { type: String, required: true },
    area: { type: String, default: '' },
    comentario: { type: String, default: '' },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Movement', MovementSchema)
