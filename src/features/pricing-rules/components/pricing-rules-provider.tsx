// Pricing Rules Context Provider
import React from 'react'
import type { PricingRule } from '@/types/pricing-rule'

type PricingRulesDialogType = 'create' | 'edit' | 'delete' | 'view' | 'duplicate'

interface PricingRulesContextType {
  open: PricingRulesDialogType | null
  setOpen: (type: PricingRulesDialogType | null) => void
  currentRow: PricingRule | null
  setCurrentRow: React.Dispatch<React.SetStateAction<PricingRule | null>>
}

const PricingRulesContext = React.createContext<PricingRulesContextType | null>(
  null
)

export function PricingRulesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState<PricingRulesDialogType | null>(null)
  const [currentRow, setCurrentRow] = React.useState<PricingRule | null>(null)

  return (
    <PricingRulesContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </PricingRulesContext.Provider>
  )
}

export function usePricingRules() {
  const context = React.useContext(PricingRulesContext)
  if (!context) {
    throw new Error(
      'usePricingRules must be used within PricingRulesProvider'
    )
  }
  return context
}
