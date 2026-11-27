import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { AuthService, LoginRequest } from '../services'
import { queryKeys } from '../query-client'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from '@/components/ui/use-toast'

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser, setToken } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: (response, credentials) => {
      if (response.success && response.data) {
        const email = credentials.email
        const account = response.data.user ?? {
          id: '1',
          email,
          name: email.split('@')[0] || email,
          role: 'ADMIN' as const,
        }

        // Store auth data. The login API often omits the account.
        setUser(account)
        setToken(response.data.token, response.data.refreshToken)
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
        
        // Redirect to dashboard
        router.push('/dashboard')
        
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${account.name}`,
        })
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      })
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { logout: clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // Clear auth state
      clearAuth()
      
      // Clear all queries
      queryClient.clear()
      
      // Redirect to login
      router.push('/login')
    },
  })
}

export function useCurrentUser() {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      // If we have a user in store, return it
      if (user) {
        return { success: true, data: user }
      }
      
      // Otherwise verify with API
      return AuthService.verify()
    },
    enabled: !!useAuthStore.getState().token,
    staleTime: Infinity, // User data doesn't change often
  })
}

export function usePermissions() {
  return useQuery({
    queryKey: queryKeys.auth.permissions(),
    queryFn: () => AuthService.getPermissions(),
    enabled: !!useAuthStore.getState().token,
    staleTime: Infinity,
  })
}