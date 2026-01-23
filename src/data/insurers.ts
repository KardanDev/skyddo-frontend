// Mock Insurers Data
import { type Insurer } from '@/types/insurer'
import { faker } from '@faker-js/faker'

// Set seed for consistent data
faker.seed(10002)

export const mockInsurers: Insurer[] = Array.from({ length: 20 }, (_, i) => {
  const companyName = `${faker.company.name()} Insurance`

  return {
    id: i + 1,
    name: companyName,
    email: faker.internet
      .email({
        provider: faker.company.name().toLowerCase().replace(/\s/g, ''),
      })
      .toLowerCase(),
    phone: faker.phone.number({ style: 'international' }),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`,
    contact_person: faker.person.fullName(),
    is_active: faker.helpers.arrayElement([true, true, true, false]), // 75% active
    created_at: faker.date.past({ years: 3 }).toISOString(),
    updated_at: faker.date.recent({ days: 60 }).toISOString(),
    quotes_count: faker.number.int({ min: 5, max: 50 }),
    policies_count: faker.number.int({ min: 3, max: 30 }),
  }
})
