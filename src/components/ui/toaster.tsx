'use client'

import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            bg-white rounded-lg shadow-lg p-4 min-w-[300px] max-w-[420px]
            border ${toast.variant === 'destructive' ? 'border-red-600' : 'border-gray-200'}
          `}
        >
          {toast.title && (
            <div className="font-semibold text-sm mb-1">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm text-gray-600">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  )
}