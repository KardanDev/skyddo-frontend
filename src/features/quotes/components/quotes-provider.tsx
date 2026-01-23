// Quotes Context Provider
import React from 'react'
import { type Quote } from '@/types/quote'

type QuotesDialogType = 'create' | 'edit' | 'delete' | 'view' | 'convert'

interface QuotesContextType {
  open: QuotesDialogType | null
  setOpen: (type: QuotesDialogType | null) => void
  currentRow: Quote | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Quote | null>>
}

const QuotesContext = React.createContext<QuotesContextType | null>(null)

export function QuotesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState<QuotesDialogType | null>(null)
  const [currentRow, setCurrentRow] = React.useState<Quote | null>(null)

  return (
    <QuotesContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </QuotesContext.Provider>
  )
}

export function useQuotes() {
  const context = React.useContext(QuotesContext)
  if (!context) {
    throw new Error('useQuotes must be used within QuotesProvider')
  }
  return context
}
