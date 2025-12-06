import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuthStore } from '../store/auth.ts'
import Swal from 'sweetalert2'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, UserIcon } from '@heroicons/react/24/outline'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(false)
  const emailValid = /.+@.+\..+/.test(correo)
  const passValid = password.length >= 6
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { correo, password })
      login({ ...res.data, remember })
      const rol = res.data.usuario.rol
      navigate(rol === 'admin' ? '/' : '/salidas', { replace: true })
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Credenciales inválidas' })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E6BD6] to-[#0E4AA8] p-6">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-white/95">
        <div className="px-6 pt-6">
          <div className="text-primary-700 font-bold">Control de Inventario</div>
          <div className="mt-1 text-sm text-gray-500">Accede con tus credenciales</div>
        </div>
        <div className="grid place-items-center pt-4">
          <div className="w-16 h-16 rounded-full bg-primary-600/10 grid place-items-center">
            <UserIcon className="w-8 text-primary-700" />
          </div>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium">Correo</label>
            <div className="relative">
              <EnvelopeIcon className="w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" className="pl-10 w-full" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            </div>
            {!emailValid && correo && <div className="text-xs text-red-600">Correo inválido</div>}
          </div>
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
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Recuérdame</label>
            <a className="text-sm text-primary-700" href="/register">Crear cuenta</a>
          </div>
          <button disabled={loading || !emailValid || !passValid} className="w-full bg-primary-600 hover:bg-primary-700 transition text-white rounded-lg py-2">{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
      </div>
    </div>
  )
}
