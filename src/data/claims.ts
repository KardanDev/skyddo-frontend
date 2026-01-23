// Mock Claims Data
import { type Claim, type ClaimStatus, CLAIM_STATUSES } from '@/types/claim'
import { faker } from '@faker-js/faker'
import { mockPolicies } from './policies'

// Set seed for consistent data
faker.seed(10005)

const claimStatuses: ClaimStatus[] = Object.keys(
  CLAIM_STATUSES
) as ClaimStatus[]

function generateClaimNumber(id: number): string {
  const year = new Date().getFullYear()
  const paddedId = String(id).padStart(5, '0')
  return `CLM-${year}-${paddedId}`
}

export const mockClaims: Claim[] = Array.from({ length: 50 }, (_, i) => {
  const policy = faker.helpers.arrayElement(
    mockPolicies.filter((p) => p.status === 'active' || p.status === 'expired')
  )

  const claimAmount = faker.number.int({
    min: 5000,
    max: policy.sum_insured * 0.8,
  })

  const status = faker.helpers.arrayElement(claimStatuses)
  const approvedAmount =
    status === 'approved'
      ? claimAmount
      : status === 'partially_approved'
        ? faker.number.int({ min: claimAmount * 0.5, max: claimAmount * 0.9 })
        : null

  const submittedDate = faker.date.between({
    from: new Date(policy.start_date),
    to: new Date(),
  })

  const processedDate =
    status !== 'submitted' && status !== 'under_review'
      ? faker.date.between({ from: submittedDate, to: new Date() })
      : null

  const incidentDate = faker.date.between({
    from: new Date(policy.start_date),
    to: submittedDate,
  })

  return {
    id: i + 1,
    policy_id: policy.id,
    claim_number: generateClaimNumber(i + 1),
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    claim_amount: claimAmount,
    approved_amount: approvedAmount,
    status: status,
    incident_date: incidentDate.toISOString().split('T')[0],
    submitted_date: submittedDate.toISOString().split('T')[0],
    processed_date: processedDate?.toISOString().split('T')[0] || null,
    created_at: submittedDate.toISOString(),
    updated_at: faker.date.recent({ days: 15 }).toISOString(),
    policy: {
      id: policy.id,
      policy_number: policy.policy_number,
      insurance_type: policy.insurance_type,
      client: policy.client,
    },
    documents_count: faker.number.int({ min: 1, max: 5 }),
  }
})
