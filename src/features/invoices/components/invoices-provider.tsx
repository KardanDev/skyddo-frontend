// Invoices Context Provider
import React from 'react'
import { type Invoice } from '@/types/invoice'

type InvoicesDialogType = 'create' | 'edit' | 'delete' | 'view' | 'mark_paid'

interface InvoicesContextType {
  open: InvoicesDialogType | null
  setOpen: (type: InvoicesDialogType | null) => void
  currentRow: Invoice | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Invoice | null>>
}

const InvoicesContext = React.createContext<InvoicesContextType | null>(null)

export function InvoicesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState<InvoicesDialogType | null>(null)
  const [currentRow, setCurrentRow] = React.useState<Invoice | null>(null)

  return (
    <InvoicesContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  )
}

export function useInvoices() {
  const context = React.useContext(InvoicesContext)
  if (!context) {
    throw new Error('useInvoices must be used within InvoicesProvider')
  }
  return context
}
