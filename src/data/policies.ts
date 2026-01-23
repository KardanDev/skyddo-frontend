// Mock Policies Data
import { type Policy, POLICY_STATUSES } from '@/types/policy'
import { type InsuranceType, INSURANCE_TYPES } from '@/types/quote'
import { faker } from '@faker-js/faker'
import { mockClients } from './clients'
import { mockInsurers } from './insurers'
import { mockQuotes } from './quotes'

// Set seed for consistent data
faker.seed(10004)

function generatePolicyNumber(id: number): string {
  const year = new Date().getFullYear()
  const paddedId = String(id).padStart(6, '0')
  return `POL-${year}-${paddedId}`
}

export const mockPolicies: Policy[] = Array.from({ length: 150 }, (_, i) => {
  const client = faker.helpers.arrayElement(mockClients)
  const insurer = faker.helpers.arrayElement(
    mockInsurers.filter((ins) => ins.is_active)
  )
  const quote = faker.helpers.arrayElement([
    ...mockQuotes.filter((q) => q.client_id === client.id),
    null,
  ])

  const insuranceType: InsuranceType = quote
    ? (quote.insurance_type as InsuranceType)
    : faker.helpers.arrayElement(INSURANCE_TYPES)

  const sumInsured =
    quote?.sum_insured || faker.number.int({ min: 10000, max: 5000000 })
  const premium =
    quote?.premium ||
    faker.number.int({ min: sumInsured * 0.02, max: sumInsured * 0.08 })

  const startDate = faker.date.past({ years: 1 })
  const endDate = new Date(startDate)
  endDate.setFullYear(endDate.getFullYear() + 1)

  // Determine status based on dates
  const now = new Date()
  let status: PolicyStatus
  if (endDate < now) {
    status = 'expired'
  } else if (faker.datatype.boolean({ probability: 0.05 })) {
    status = 'cancelled'
  } else if (endDate.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) {
    status = 'pending_renewal'
  } else {
    status = 'active'
  }

  return {
    id: i + 1,
    client_id: client.id,
    insurer_id: insurer.id,
    quote_id: quote?.id || null,
    policy_number: generatePolicyNumber(i + 1),
    insurance_type: insuranceType,
    description: faker.helpers.maybe(
      () => faker.lorem.sentence({ min: 5, max: 15 }),
      { probability: 0.6 }
    ),
    sum_insured: sumInsured,
    premium: premium,
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    status: status,
    zoho_id: faker.helpers.arrayElement([faker.string.alphanumeric(15), null]),
    created_at: faker.date.past({ years: 1 }).toISOString(),
    updated_at: faker.date.recent({ days: 30 }).toISOString(),
    client: {
      id: client.id,
      name: client.name,
      email: client.email,
    },
    insurer: {
      id: insurer.id,
      name: insurer.name,
    },
    quote: quote
      ? {
          id: quote.id,
          insurance_type: quote.insurance_type,
        }
      : null,
    claims_count: faker.number.int({ min: 0, max: 3 }),
    invoices_count: faker.number.int({ min: 1, max: 5 }),
  }
})
