// Mock Quotes Data
import { type Quote, type QuoteStatus, INSURANCE_TYPES } from '@/types/quote'
import { faker } from '@faker-js/faker'
import { mockClients } from './clients'
import { mockInsurers } from './insurers'

// Set seed for consistent data
faker.seed(10003)

const quoteStatuses: QuoteStatus[] = [
  'pending',
  'sent',
  'approved',
  'rejected',
  'expired',
]

export const mockQuotes: Quote[] = Array.from({ length: 200 }, (_, i) => {
  const client = faker.helpers.arrayElement(mockClients)
  const insurer = faker.helpers.arrayElement([
    ...mockInsurers.filter((ins) => ins.is_active),
    null,
  ])
  const insuranceType = faker.helpers.arrayElement(INSURANCE_TYPES)
  const sumInsured = faker.number.int({ min: 10000, max: 5000000 })
  const premium = faker.helpers.arrayElement([
    faker.number.int({ min: sumInsured * 0.02, max: sumInsured * 0.08 }),
    null,
  ])

  return {
    id: i + 1,
    client_id: client.id,
    insurer_id: insurer?.id || null,
    insurance_type: insuranceType,
    description: faker.helpers.maybe(
      () => faker.lorem.sentence({ min: 5, max: 15 }),
      { probability: 0.7 }
    ),
    sum_insured: sumInsured,
    premium: premium,
    status: faker.helpers.arrayElement(quoteStatuses),
    zoho_id: faker.helpers.arrayElement([faker.string.alphanumeric(15), null]),
    created_at: faker.date.past({ years: 1 }).toISOString(),
    updated_at: faker.date.recent({ days: 30 }).toISOString(),
    client: {
      id: client.id,
      name: client.name,
      email: client.email,
    },
    insurer: insurer
      ? {
          id: insurer.id,
          name: insurer.name,
        }
      : null,
  }
})
