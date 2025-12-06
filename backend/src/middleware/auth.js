const jwt = require('jsonwebtoken')
const config = require('../config')

function authenticate(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'No autorizado' })
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

function requireRole(roleOrRoles) {
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles]
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'Permiso denegado' })
    }
    next()
  }
}

module.exports = { authenticate, requireRole }
