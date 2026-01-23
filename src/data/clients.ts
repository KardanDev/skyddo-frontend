// Mock Clients Data
import { type Client } from '@/types/client'
import { faker } from '@faker-js/faker'

// Set seed for consistent data
faker.seed(10001)

export const mockClients: Client[] = Array.from({ length: 100 }, (_, i) => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const name = `${firstName} ${lastName}`
  const hasCompany = faker.datatype.boolean({ probability: 0.3 })

  return {
    id: i + 1,
    name: hasCompany ? faker.company.name() : name,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: faker.phone.number({ style: 'international' }),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`,
    id_number: faker.helpers.arrayElement([
      faker.string.alphanumeric(10).toUpperCase(),
      null,
    ]),
    company_name: hasCompany ? faker.company.name() : null,
    zoho_contact_id: faker.helpers.arrayElement([
      faker.string.alphanumeric(15),
      null,
    ]),
    created_at: faker.date.past({ years: 2 }).toISOString(),
    updated_at: faker.date.recent({ days: 30 }).toISOString(),
    quotes_count: faker.number.int({ min: 0, max: 10 }),
    policies_count: faker.number.int({ min: 0, max: 5 }),
    claims_count: faker.number.int({ min: 0, max: 3 }),
    invoices_count: faker.number.int({ min: 0, max: 8 }),
  }
})
