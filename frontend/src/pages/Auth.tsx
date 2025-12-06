import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuthStore } from '../store/auth.ts'
import Swal from 'sweetalert2'
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

type Rol = 'admin' | 'operador'
type Tab = 'login' | 'register'

export default function Auth() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>('login')

  // Login state
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loadingLogin, setLoadingLogin] = useState(false)
  const emailValidLogin = /.+@.+\..+/.test(correo)
  const passValidLogin = password.length >= 6

  // Register state
  const [nombre, setNombre] = useState('')
  const [correoR, setCorreoR] = useState('')
  const [passwordR, setPasswordR] = useState('')
  const [confirmR, setConfirmR] = useState('')
  const [rol, setRol] = useState<Rol>('operador')
  const [codigo, setCodigo] = useState('')
  const [showReg, setShowReg] = useState(false)
  const [loadingReg, setLoadingReg] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const emailValidReg = /.+@.+\..+/.test(correoR)
  const passValidReg = passwordR.length >= 6
  const matchReg = passwordR === confirmR

  async function onLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!emailValidLogin || !passValidLogin) return
    setLoadingLogin(true)
    try {
      const res = await api.post('/auth/login', { correo, password })
      loginStore({ ...res.data, remember })
      const r = res.data.usuario.rol
      navigate(r === 'admin' ? '/' : '/salidas', { replace: true })
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Credenciales inválidas' })
    } finally {
      setLoadingLogin(false)
    }
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!emailValidReg || !passValidReg || !matchReg || (rol === 'admin' && !codigo)) return
    setLoadingReg(true)
    try {
      await api.post('/auth/register', { nombre, correo: correoR, password: passwordR, rol, codigo: rol === 'admin' ? codigo : undefined })
      Swal.fire({ icon: 'success', title: 'Cuenta creada', text: 'Ahora inicia sesión' })
      setNombre(''); setCorreoR(''); setPasswordR(''); setConfirmR(''); setCodigo(''); setRol('operador')
      setActiveTab('login')
    } catch (err) {
      type HttpError = { response?: { data?: { error?: string } } }
      const msg = (err as HttpError)?.response?.data?.error || 'No se pudo registrar'
      Swal.fire({ icon: 'error', title: 'Error', text: msg })
    } finally {
      setLoadingReg(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#5FA5D9] p-6 font-sans">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl shadow-xl" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
          {/* Tab Header */}
          <div className="flex border-b border-white/20">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-6 text-center text-lg font-light tracking-widest uppercase transition-all ${
                activeTab === 'login'
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-6 text-center text-lg font-light tracking-widest uppercase transition-all ${
                activeTab === 'register'
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* Tab Content */}
          <div className="relative overflow-hidden">
            {/* Login Form */}
            <div
              className={`transition-all duration-300 ${
                activeTab === 'login'
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 absolute inset-0 translate-x-full pointer-events-none'
              }`}
            >
              <div className="grid place-items-center pt-8">
                <div className="w-20 h-20 rounded-full bg-primary-600/20 grid place-items-center relative">
                  <div className="absolute inset-0 rounded-full bg-blue-900/20"></div>
                  <UserIcon className="w-10 text-white z-10" />
                </div>
              </div>
              <form onSubmit={onLogin} className="px-12 py-8 space-y-6">
                <div className="space-y-2">
                  <div className="relative">
                    <UserIcon className="w-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                    <input
                      type="email"
                      className="pl-10 w-full h-10 rounded bg-white border-none placeholder-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-400"
                      placeholder="Email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                    />
                  </div>
                  {!emailValidLogin && correo && <div className="text-xs text-white/80">Correo inválido</div>}
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <LockClosedIcon className="w-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                    <input
                      type={showLogin ? 'text' : 'password'}
                      className="pl-10 pr-10 w-full h-10 rounded bg-white border-none placeholder-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-400"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-500"
                      onClick={() => setShowLogin(!showLogin)}
                    >
                      {showLogin ? <EyeSlashIcon className="w-5" /> : <EyeIcon className="w-5" />}
                    </button>
                  </div>
                  {!passValidLogin && password && <div className="text-xs text-white/80">Mínimo 6 caracteres</div>}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white/20"
                  />
                  <label className="text-sm text-white">Remember me</label>
                </div>
                <button
                  disabled={loadingLogin || !emailValidLogin || !passValidLogin}
                  className="w-full bg-[#2C75B8] hover:bg-[#24619a] transition text-white rounded-full py-3 font-semibold tracking-wide shadow-lg uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingLogin ? 'LOGGING IN...' : 'LOGIN'}
                </button>
                <div className="text-center pt-2">
                  <a href="#" className="text-xs text-white/70 hover:text-white transition">
                    Forgot Username / Password?
                  </a>
                </div>
              </form>
            </div>

            {/* Register Form */}
            <div
              className={`transition-all duration-300 ${
                activeTab === 'register'
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 absolute inset-0 -translate-x-full pointer-events-none'
              }`}
            >
              <form onSubmit={onRegister} className="px-12 py-8 space-y-5">
                <div className="space-y-1">
                  <div className="relative">
                    <UserIcon className="w-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                    <input
                      className="pl-10 w-full h-10 rounded bg-white border-none placeholder-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-400"
                      placeholder="Username"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="relative">
                    <EnvelopeIcon className="w-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                    <input
                      type="email"
                      className="pl-10 w-full h-10 rounded bg-white border-none placeholder-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-400"
                      placeholder="E-mail"
                      value={correoR}
                      onChange={(e) => setCorreoR(e.target.value)}
                      required
                    />
                  </div>
                  {!emailValidReg && correoR && <div className="text-xs text-white/80">Correo inválido</div>}
                </div>
                <div className="space-y-1">
                  <div className="relative">
                    <LockClosedIcon className="w-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                    <input
                      type={showReg ? 'text' : 'password'}
                      className="pl-10 pr-10 w-full h-10 rounded bg-white border-none placeholder-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-400"
                      placeholder="Password"
                      value={passwordR}
                      onChange={(e) => setPasswordR(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-500"
                      onClick={() => setShowReg(!showReg)}
                    >
                      {showReg ? <EyeSlashIcon className="w-5" /> : <EyeIcon className="w-5" />}
                    </button>
                  </div>
                  {!passValidReg && passwordR && <div className="text-xs text-white/80">Mínimo 6 caracteres</div>}
                </div>
                <div className="space-y-1">
                  <div className="relative">
                    <LockClosedIcon className="w-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                    <input
                      type={showReg ? 'text' : 'password'}
                      className="pl-10 w-full h-10 rounded bg-white border-none placeholder-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-400"
                      placeholder="Confirm Password"
                      value={confirmR}
                      onChange={(e) => setConfirmR(e.target.value)}
                      required
                    />
                  </div>
                  {!matchReg && confirmR && <div className="text-xs text-white/80">No coincide</div>}
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex gap-6 justify-center">
                    <label className="inline-flex items-center gap-2 text-sm text-white">
                      <input
                        type="radio"
                        name="rol"
                        checked={rol === 'operador'}
                        onChange={() => setRol('operador')}
                        className="text-blue-600 focus:ring-blue-500 bg-white/20 border-white/50"
                      />
                      Operador
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-white">
                      <input
                        type="radio"
                        name="rol"
                        checked={rol === 'admin'}
                        onChange={() => setRol('admin')}
                        className="text-blue-600 focus:ring-blue-500 bg-white/20 border-white/50"
                      />
                      Admin
                    </label>
                  </div>
                </div>

                {rol === 'admin' && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-xs text-white/90">Admin Code</label>
                      <div className="relative">
                        <button
                          type="button"
                          className="text-white/70 hover:text-white transition"
                          onMouseEnter={() => setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                        >
                          <InformationCircleIcon className="w-4 h-4" />
                        </button>
                        {showTooltip && (
                          <div className="absolute left-6 top-0 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-10">
                            <div className="font-semibold mb-1">¿Dónde obtener el Admin Code?</div>
                            <div className="text-white/80">
                              El código se configura en el archivo <code className="bg-white/10 px-1 rounded">.env</code> del backend usando la variable{' '}
                              <code className="bg-white/10 px-1 rounded">ADMIN_INVITE_CODE</code>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <ShieldCheckIcon className="w-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                      <input
                        className="pl-10 w-full h-10 rounded bg-white border-none placeholder-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-400"
                        placeholder="Admin Code"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  disabled={loadingReg || !emailValidReg || !passValidReg || !matchReg || (rol === 'admin' && !codigo)}
                  className="w-full bg-[#2C75B8] hover:bg-[#24619a] transition text-white rounded-full py-3 font-semibold tracking-wide shadow-lg uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingReg ? 'CREATING...' : 'CREATE ACCOUNT'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
