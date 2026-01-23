// Documents Context Provider
import React from 'react'
import { type Document } from '@/types/document'

type DocumentsDialogType = 'create' | 'delete' | 'view'

interface DocumentsContextType {
  open: DocumentsDialogType | null
  setOpen: (type: DocumentsDialogType | null) => void
  currentRow: Document | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Document | null>>
}

const DocumentsContext = React.createContext<DocumentsContextType | null>(null)

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState<DocumentsDialogType | null>(null)
  const [currentRow, setCurrentRow] = React.useState<Document | null>(null)

  return (
    <DocumentsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  )
}

export function useDocuments() {
  const context = React.useContext(DocumentsContext)
  if (!context) {
    throw new Error('useDocuments must be used within DocumentsProvider')
  }
  return context
}
