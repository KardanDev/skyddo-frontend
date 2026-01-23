// Mock Invoices Data
import { type Invoice, INVOICE_STATUSES } from '@/types/invoice'
import { faker } from '@faker-js/faker'
import { mockClaims } from './claims'
import { mockPolicies } from './policies'

// Set seed for consistent data
faker.seed(10006)

function generateInvoiceNumber(id: number): string {
  const year = new Date().getFullYear()
  const paddedId = String(id).padStart(5, '0')
  return `INV-${year}-${paddedId}`
}

export const mockInvoices: Invoice[] = Array.from({ length: 100 }, (_, i) => {
  // 70% policy-related, 30% claim-related
  const isPolicyInvoice = faker.datatype.boolean({ probability: 0.7 })

  let policy = null
  let claim = null

  if (isPolicyInvoice) {
    policy = faker.helpers.arrayElement(mockPolicies)
  } else {
    claim = faker.helpers.arrayElement(mockClaims)
    policy = mockPolicies.find((p) => p.id === claim.policy_id) || null
  }

  const amount = isPolicyInvoice
    ? policy!.premium
    : faker.number.int({ min: 5000, max: 50000 })

  const taxRate = 0.16 // 16% tax
  const taxAmount = amount * taxRate
  const totalAmount = amount + taxAmount

  const createdDate = faker.date.past({ years: 1 })
  const dueDate = new Date(createdDate)
  dueDate.setDate(dueDate.getDate() + 30)

  const now = new Date()
  let status: InvoiceStatus

  if (faker.datatype.boolean({ probability: 0.1 })) {
    status = 'cancelled'
  } else if (faker.datatype.boolean({ probability: 0.6 })) {
    status = 'paid'
  } else if (dueDate < now) {
    status = 'overdue'
  } else if (faker.datatype.boolean({ probability: 0.3 })) {
    status = 'sent'
  } else {
    status = 'draft'
  }

  const paidDate =
    status === 'paid'
      ? faker.date.between({ from: createdDate, to: dueDate })
      : null

  return {
    id: i + 1,
    policy_id: policy?.id || null,
    claim_id: claim?.id || null,
    invoice_number: generateInvoiceNumber(i + 1),
    description: isPolicyInvoice
      ? `Premium payment for ${policy!.insurance_type} insurance`
      : `Claim settlement for ${claim!.claim_number}`,
    amount: amount,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    status: status,
    due_date: dueDate.toISOString().split('T')[0],
    paid_date: paidDate?.toISOString().split('T')[0] || null,
    created_at: createdDate.toISOString(),
    updated_at: faker.date.recent({ days: 20 }).toISOString(),
    policy: policy
      ? {
          id: policy.id,
          policy_number: policy.policy_number,
          client: policy.client,
        }
      : null,
    claim: claim
      ? {
          id: claim.id,
          claim_number: claim.claim_number,
        }
      : null,
  }
})
