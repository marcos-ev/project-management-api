import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type ToastVariant = 'success' | 'error'

interface ToastItem {
  id: string
  variant: ToastVariant
  message: string
}

interface ToastContextValue {
  showSuccess: (message: string) => void
  showError: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const AUTO_DISMISS_MS = 4000

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, variant, message }])
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    },
    [dismiss],
  )

  const showSuccess = useCallback((message: string) => push('success', message), [push])
  const showError = useCallback((message: string) => push('error', message), [push])

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm shadow-md ${VARIANT_STYLES[toast.variant]}`}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Fechar notificação"
              className="text-current opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider')
  }
  return context
}
