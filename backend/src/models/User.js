const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'operador'], required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)
