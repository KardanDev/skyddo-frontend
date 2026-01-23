// Claims Context Provider
import React from 'react'
import { type Claim } from '@/types/claim'

type ClaimsDialogType = 'create' | 'edit' | 'delete' | 'view' | 'update_status'

interface ClaimsContextType {
  open: ClaimsDialogType | null
  setOpen: (type: ClaimsDialogType | null) => void
  currentRow: Claim | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Claim | null>>
}

const ClaimsContext = React.createContext<ClaimsContextType | null>(null)

export function ClaimsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState<ClaimsDialogType | null>(null)
  const [currentRow, setCurrentRow] = React.useState<Claim | null>(null)

  return (
    <ClaimsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </ClaimsContext.Provider>
  )
}

export function useClaims() {
  const context = React.useContext(ClaimsContext)
  if (!context) {
    throw new Error('useClaims must be used within ClaimsProvider')
  }
  return context
}
