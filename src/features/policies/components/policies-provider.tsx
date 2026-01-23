// Policies Context Provider
import React from 'react'
import { type Policy } from '@/types/policy'

type PoliciesDialogType = 'create' | 'edit' | 'delete' | 'view' | 'renew'

interface PoliciesContextType {
  open: PoliciesDialogType | null
  setOpen: (type: PoliciesDialogType | null) => void
  currentRow: Policy | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Policy | null>>
}

const PoliciesContext = React.createContext<PoliciesContextType | null>(null)

export function PoliciesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState<PoliciesDialogType | null>(null)
  const [currentRow, setCurrentRow] = React.useState<Policy | null>(null)

  return (
    <PoliciesContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </PoliciesContext.Provider>
  )
}

export function usePolicies() {
  const context = React.useContext(PoliciesContext)
  if (!context) {
    throw new Error('usePolicies must be used within PoliciesProvider')
  }
  return context
}
