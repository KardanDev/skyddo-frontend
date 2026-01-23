// Insurers Context Provider
import React from 'react'
import { type Insurer } from '@/types/insurer'

type InsurersDialogType = 'create' | 'edit' | 'delete' | 'view'

interface InsurersContextType {
  open: InsurersDialogType | null
  setOpen: (type: InsurersDialogType | null) => void
  currentRow: Insurer | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Insurer | null>>
}

const InsurersContext = React.createContext<InsurersContextType | null>(null)

export function InsurersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState<InsurersDialogType | null>(null)
  const [currentRow, setCurrentRow] = React.useState<Insurer | null>(null)

  return (
    <InsurersContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </InsurersContext.Provider>
  )
}

export function useInsurers() {
  const context = React.useContext(InsurersContext)
  if (!context) {
    throw new Error('useInsurers must be used within InsurersProvider')
  }
  return context
}
