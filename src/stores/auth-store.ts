import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthService } from '@/lib/api/services/auth.service'
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
}

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
            // Backend returns access_token, not token
            const accessToken = response.data.token || (response.data as any).access_token
            const tokenType = (response.data as any).token_type || 'Bearer'
            
            // For admin login, user data might be minimal or need to be fetched separately
            const userData = response.data.user || {
              id: '1',
              email: email,
              name: email.split('@')[0], // Use email prefix as name if not provided
              role: 'ADMIN' as const,
              avatar: null
            }
            
            set({
              user: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}`
              },
              token: accessToken,
              refreshToken: response.data.refreshToken || null,
              isAuthenticated: true
            })
            
            toast({
              title: 'Welcome back!',
              description: `Logged in as ${userData.name}`,
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
      }
    }),
    {
      name: 'ajeris-admin-auth',
    }
  )
)