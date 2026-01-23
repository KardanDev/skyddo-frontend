// Clients Context Provider
import React from 'react'
import { type Client } from '@/types/client'

type ClientsDialogType = 'create' | 'edit' | 'delete' | 'view'

interface ClientsContextType {
  open: ClientsDialogType | null
  setOpen: (type: ClientsDialogType | null) => void
  currentRow: Client | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Client | null>>
}

const ClientsContext = React.createContext<ClientsContextType | null>(null)

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState<ClientsDialogType | null>(null)
  const [currentRow, setCurrentRow] = React.useState<Client | null>(null)

  return (
    <ClientsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients() {
  const context = React.useContext(ClientsContext)
  if (!context) {
    throw new Error('useClients must be used within ClientsProvider')
  }
  return context
}
