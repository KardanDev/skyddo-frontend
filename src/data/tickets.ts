// Mock Tickets Data (Frontend Only)
import {
  type Ticket,
  type TicketPriority,
  type TicketStatus,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from '@/types/ticket'
import { faker } from '@faker-js/faker'
import { mockClients } from './clients'

// Set seed for consistent data
faker.seed(10008)

const ticketPriorities: TicketPriority[] = Object.keys(
  TICKET_PRIORITIES
) as TicketPriority[]
const ticketStatuses: TicketStatus[] = Object.keys(
  TICKET_STATUSES
) as TicketStatus[]

function generateTicketNumber(id: number): string {
  const year = new Date().getFullYear()
  const paddedId = String(id).padStart(5, '0')
  return `TKT-${year}-${paddedId}`
}

const ticketSubjects = [
  'Policy renewal inquiry',
  'Claim status update needed',
  'Payment not reflected',
  'Need policy document copy',
  'Coverage clarification required',
  'Premium calculation question',
  'Beneficiary change request',
  'Policy cancellation inquiry',
  'Coverage extension request',
  'Claim rejection appeal',
  'Missing invoice',
  'Technical issue with portal',
  'Update contact information',
  'Policy endorsement needed',
  'Complaint about service',
]

const mockUsers = [
  { id: 1, name: 'John Admin' },
  { id: 2, name: 'Jane Manager' },
  { id: 3, name: 'Bob Agent' },
]

export const mockTickets: Ticket[] = Array.from({ length: 60 }, (_, i) => {
  // 70% have a client, 30% are general inquiries
  const hasClient = faker.datatype.boolean({ probability: 0.7 })
  const client = hasClient ? faker.helpers.arrayElement(mockClients) : null

  const priority = faker.helpers.arrayElement(ticketPriorities)
  const status = faker.helpers.arrayElement(ticketStatuses)

  // 80% of tickets are assigned
  const isAssigned = faker.datatype.boolean({ probability: 0.8 })
  const assignee = isAssigned ? faker.helpers.arrayElement(mockUsers) : null

  const creator = faker.helpers.arrayElement(mockUsers)

  return {
    id: i + 1,
    ticket_number: generateTicketNumber(i + 1),
    client_id: client?.id || null,
    subject: faker.helpers.arrayElement(ticketSubjects),
    description: faker.lorem.paragraph({ min: 2, max: 5 }),
    priority: priority,
    status: status,
    assigned_to: assignee?.id || null,
    created_by: creator.id,
    created_at: faker.date.past({ years: 0.5 }).toISOString(),
    updated_at: faker.date.recent({ days: 10 }).toISOString(),
    client: client
      ? {
          id: client.id,
          name: client.name,
          email: client.email,
        }
      : null,
    assignee: assignee || null,
    creator: creator,
    responses_count: faker.number.int({ min: 0, max: 8 }),
  }
})
