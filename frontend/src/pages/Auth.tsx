import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuthStore } from '../store/auth'
import Swal from 'sweetalert2'
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

type Rol = 'admin' | 'operador'
type Tab = 'login' | 'register'


const InputField = ({ icon: Icon, type, placeholder, value, onChange, showPasswordToggle, onTogglePassword, required = true, valid = true, errorMsg }: any) => (
  <div className="space-y-1">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={type}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {showPasswordToggle && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button type="button" onClick={onTogglePassword} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            {type === 'text' ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
      )}
    </div>
    {!valid && value && <p className="text-xs text-red-500 ml-1">{errorMsg}</p>}
  </div>
)

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
  const emailValidReg = /.+@.+\..+/.test(correoR)
  const passValidReg = passwordR.length >= 6
  const matchReg = passwordR === confirmR

  async function onLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!emailValidLogin || !passValidLogin) return
    setLoadingLogin(true)
    try {
      const res = await api.post('/auth/login', { correo, password })
      loginStore({ ...res.data }) // Recuerda que ya se guarda siempre
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


  // ... rest of component


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Control de Inventario
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {activeTab === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea una nueva cuenta'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">

          {/* Tabs */}
          <div className="flex border-b border-gray-100 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 pb-4 text-sm font-medium text-center transition-colors relative ${activeTab === 'login' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Iniciar Sesión
              {activeTab === 'login' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 pb-4 text-sm font-medium text-center transition-colors relative ${activeTab === 'register' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Crear Cuenta
              {activeTab === 'register' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />}
            </button>
          </div>

          {activeTab === 'login' ? (
            <form className="space-y-6" onSubmit={onLogin}>
              <InputField
                icon={EnvelopeIcon}
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e: any) => setCorreo(e.target.value)}
                valid={emailValidLogin}
                errorMsg="Ingresa un correo válido"
              />

              <InputField
                icon={LockClosedIcon}
                type={showLogin ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                showPasswordToggle={true}
                onTogglePassword={() => setShowLogin(!showLogin)}
                valid={passValidLogin}
                errorMsg="Mínimo 6 caracteres"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Recordarme
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loadingLogin || !emailValidLogin || !passValidLogin}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingLogin ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={onRegister}>
              <InputField
                icon={UserIcon}
                type="text"
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e: any) => setNombre(e.target.value)}
                required={true}
              />

              <InputField
                icon={EnvelopeIcon}
                type="email"
                placeholder="Correo electrónico"
                value={correoR}
                onChange={(e: any) => setCorreoR(e.target.value)}
                valid={emailValidReg}
                errorMsg="Ingresa un correo válido"
              />

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  icon={LockClosedIcon}
                  type={showReg ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={passwordR}
                  onChange={(e: any) => setPasswordR(e.target.value)}
                  showPasswordToggle={true}
                  onTogglePassword={() => setShowReg(!showReg)}
                  valid={passValidReg}
                  errorMsg="Mínimo 6"
                />
                <InputField
                  icon={LockClosedIcon}
                  type={showReg ? 'text' : 'password'}
                  placeholder="Confirmar"
                  value={confirmR}
                  onChange={(e: any) => setConfirmR(e.target.value)}
                  valid={matchReg}
                  errorMsg="No coincide"
                />
              </div>

              {/* Selector de Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de cuenta</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${rol === 'operador' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="rol" className="sr-only" checked={rol === 'operador'} onChange={() => setRol('operador')} />
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Operador</span>
                  </label>
                  <label className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${rol === 'admin' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="rol" className="sr-only" checked={rol === 'admin'} onChange={() => setRol('admin')} />
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Admin</span>
                  </label>
                </div>
              </div>

              {rol === 'admin' && (
                <div className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-gray-700">Código de Administrador</label>
                    <div className="relative group">
                      <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded p-2 hidden group-hover:block z-10">
                        Configure ADMIN_INVITE_CODE en el .env del backend
                      </div>
                    </div>
                  </div>
                  <InputField
                    icon={ShieldCheckIcon}
                    type="text"
                    placeholder="Código de invitación"
                    value={codigo}
                    onChange={(e: any) => setCodigo(e.target.value)}
                    required={true}
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loadingReg || !emailValidReg || !passValidReg || !matchReg || (rol === 'admin' && !codigo)}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingReg ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          &copy; 2025 Inventario- Jonas. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
