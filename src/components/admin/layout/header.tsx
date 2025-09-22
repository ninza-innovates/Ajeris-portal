'use client'

import { Bell, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()
  
  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push('/login')
  }
  
  const handleNotificationClick = (notification: string) => {
    toast({
      title: "Notification Clicked",
      description: notification,
    })
  }

  return (
    <header className="h-16 border-b bg-white px-6">
      <div className="flex h-full items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>
                <div className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs"
                    onClick={(e) => {
                      e.preventDefault()
                      toast({
                        title: "Notifications Marked as Read",
                        description: "All notifications have been marked as read.",
                      })
                    }}
                  >
                    Mark all as read
                  </Button>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem 
                  className="flex flex-col items-start p-3 cursor-pointer"
                  onClick={() => {
                    handleNotificationClick("Navigating to new STAT study")
                    router.push('/studies')
                  }}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New Study Assigned</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        STAT study from City Medical Center requires immediate attention
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">5 minutes ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex flex-col items-start p-3 cursor-pointer"
                  onClick={() => {
                    handleNotificationClick("Navigating to County Hospital")
                    router.push('/organizations/CHI-001')
                  }}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">HL7 Connection Test Failed</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        County Hospital HL7 interface connection test failed
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex flex-col items-start p-3 cursor-pointer"
                  onClick={() => {
                    handleNotificationClick("Viewing onboarding progress")
                    router.push('/onboarding')
                  }}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Organization Onboarding Complete</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Neurology Center has completed onboarding and is now live
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="justify-center text-sm"
                onClick={() => router.push('/notifications')}
              >
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open('https://docs.ajeris.com/help', '_blank')}>
                Help
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}