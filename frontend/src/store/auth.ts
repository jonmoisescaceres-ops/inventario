import { create } from 'zustand'

type Usuario = { id: string; nombre: string; correo: string; rol: 'admin' | 'operador' }
type AuthState = {
  token: string | null
  usuario: Usuario | null
  login: (payload: { token: string; usuario: Usuario; remember?: boolean }) => void
  logout: () => void
}

function getInitial() {
  try {
    const token = localStorage.getItem('token')
    const usuario = localStorage.getItem('usuario')
    return { token, usuario: usuario ? JSON.parse(usuario) as Usuario : null }
  } catch {
    return { token: null, usuario: null }
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitial(),
  login: ({ token, usuario, remember }) => {
    if (remember) {
      try {
        localStorage.setItem('token', token)
        localStorage.setItem('usuario', JSON.stringify(usuario))
      } catch (e) {
        console.error('Persist error', e)
      }
    }
    set({ token, usuario })
  },
  logout: () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    } catch (e) {
      console.error('Persist error', e)
    }
    set({ token: null, usuario: null })
  },
}))
