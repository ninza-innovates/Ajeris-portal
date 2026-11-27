import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthService } from '@/lib/api/services/auth.service'
import { readRefreshedSession } from '@/lib/api/refresh-session'
import { toast } from '@/components/ui/use-toast'

interface AdminUser {
  id: string
  email: string
  name: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER'
  avatar?: string
}

interface AuthState {
  user: AdminUser | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: AdminUser) => void
  setToken: (token: string, refreshToken?: string) => void
  checkAuth: () => boolean
  refreshAccessToken: () => Promise<boolean>
}

let refreshInFlight: Promise<boolean> | null = null

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await AuthService.login({ email, password })
          
          if (response.success && response.data) {
            // The client maps access_token onto token. Some payloads still use access_token.
            const accessToken = response.data.token || (response.data as { access_token?: string }).access_token
            if (!accessToken) {
              throw new Error('Login failed')
            }
            const signedIn = response.data.user
            const name = signedIn?.name || email.split('@')[0] || email
            
            set({
              user: {
                id: signedIn?.id || '1',
                email: signedIn?.email || email,
                name,
                role: signedIn?.role ?? 'ADMIN',
                avatar: signedIn?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
              },
              token: accessToken,
              refreshToken: response.data.refreshToken || null,
              isAuthenticated: true
            })
            
            toast({
              title: 'Welcome back!',
              description: `Logged in as ${name}`,
            })
          } else {
            throw new Error(response.error?.message || 'Login failed')
          }
        } catch (error: any) {
          // Re-throw the error so the login page can handle it
          throw error
        }
      },

      logout: async () => {
        try {
          // Call logout API endpoint
          const token = get().token
          if (token) {
            await AuthService.logout()
          }
        } catch (error) {
          // Log error but don't prevent logout
          console.error('Logout API error:', error)
        } finally {
          // Always clear local state
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false
          })
        }
      },

      setUser: (user: AdminUser) => {
        set({ user })
      },

      setToken: (token: string, refreshToken?: string) => {
        set({ 
          token, 
          refreshToken: refreshToken || get().refreshToken,
          isAuthenticated: true 
        })
      },

      checkAuth: () => {
        const state = get()
        return state.isAuthenticated && !!state.token
      },

      refreshAccessToken: () => {
        if (refreshInFlight) return refreshInFlight

        refreshInFlight = (async () => {
          const currentRefreshToken = get().refreshToken
          if (!currentRefreshToken) return false

          const response = await AuthService.refreshToken(currentRefreshToken)
          // Logout clears the refresh token. Do not write a new session after that.
          if (get().refreshToken !== currentRefreshToken) return false

          const session = readRefreshedSession(response.success ? response.data : null)
          if (!session) return false

          set({
            token: session.token,
            refreshToken: session.refreshToken ?? currentRefreshToken,
            isAuthenticated: true,
          })
          return true
        })().finally(() => {
          refreshInFlight = null
        })

        return refreshInFlight
      },
    }),
    {
      name: 'ajeris-admin-auth',
    }
  )
)