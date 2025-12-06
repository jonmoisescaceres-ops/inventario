import { useState } from 'react'
import { api } from '../api/client'
import Swal from 'sweetalert2'
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

type Rol = 'admin' | 'operador'

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [rol, setRol] = useState<Rol>('operador')
  const [codigo, setCodigo] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const emailValid = /.+@.+\..+/.test(correo)
  const passValid = password.length >= 6
  const match = password === confirm

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!emailValid || !passValid || !match) return
    setLoading(true)
    try {
      await api.post('/auth/register', { nombre, correo, password, rol, codigo: rol === 'admin' ? codigo : undefined })
      Swal.fire({ icon: 'success', title: 'Cuenta creada', text: 'Ahora inicia sesión' })
      setNombre(''); setCorreo(''); setPassword(''); setConfirm(''); setCodigo(''); setRol('operador')
    } catch (err) {
      type HttpError = { response?: { data?: { error?: string } } }
      const msg = (err as HttpError)?.response?.data?.error || 'No se pudo registrar'
      Swal.fire({ icon: 'error', title: 'Error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E6BD6] to-[#0E4AA8] p-6">
      <div className="w-full max-w-xl rounded-2xl shadow-xl bg-white/95">
        <div className="px-6 pt-6">
          <div className="text-primary-700 font-bold">Control de Inventario</div>
          <div className="mt-1 text-sm text-gray-500">Crear cuenta</div>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nombre</label>
              <div className="relative">
                <UserIcon className="w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="pl-10 w-full" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Correo</label>
              <div className="relative">
                <EnvelopeIcon className="w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" className="pl-10 w-full" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              </div>
              {!emailValid && correo && <div className="text-xs text-red-600">Correo inválido</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Contraseña</label>
              <div className="relative">
                <LockClosedIcon className="w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={show ? 'text' : 'password'} className="pl-10 pr-10 w-full" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" onClick={() => setShow((s) => !s)}>
                  {show ? <EyeSlashIcon className="w-5" /> : <EyeIcon className="w-5" />}
                </button>
              </div>
              {!passValid && password && <div className="text-xs text-red-600">Mínimo 6 caracteres</div>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Confirmar contraseña</label>
              <input type={show ? 'text' : 'password'} className="w-full" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              {!match && confirm && <div className="text-xs text-red-600">No coincide</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium">Rol</label>
              <select value={rol} onChange={(e) => setRol(e.target.value as Rol)} className="w-full">
                <option value="operador">Operador</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {rol === 'admin' && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Código de administrador</label>
                <div className="relative">
                  <ShieldCheckIcon className="w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="pl-10 w-full" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
                </div>
              </div>
            )}
          </div>

          <button disabled={loading || !emailValid || !passValid || !match || (rol === 'admin' && !codigo)} className="w-full bg-primary-600 hover:bg-primary-700 transition text-white rounded-lg py-2">
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
          <div className="text-sm text-center">
            ¿Ya tienes cuenta? <a href="/login" className="text-primary-700">Inicia sesión</a>
          </div>
        </form>
      </div>
    </div>
  )
}
