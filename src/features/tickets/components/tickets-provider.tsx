// Tickets Context Provider
import React from 'react'
import { type Ticket } from '@/types/ticket'

type TicketsDialogType =
  | 'create'
  | 'edit'
  | 'delete'
  | 'view'
  | 'assign'
  | 'add_response'

interface TicketsContextType {
  open: TicketsDialogType | null
  setOpen: (type: TicketsDialogType | null) => void
  currentRow: Ticket | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Ticket | null>>
}

const TicketsContext = React.createContext<TicketsContextType | null>(null)

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState<TicketsDialogType | null>(null)
  const [currentRow, setCurrentRow] = React.useState<Ticket | null>(null)

  return (
    <TicketsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </TicketsContext.Provider>
  )
}

export function useTickets() {
  const context = React.useContext(TicketsContext)
  if (!context) {
    throw new Error('useTickets must be used within TicketsProvider')
  }
  return context
}
