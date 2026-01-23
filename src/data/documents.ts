// Mock Documents Data
import { type Document, type DocumentableType } from '@/types/document'
import { faker } from '@faker-js/faker'
import { mockClaims } from './claims'
import { mockClients } from './clients'
import { mockInvoices } from './invoices'
import { mockPolicies } from './policies'
import { mockQuotes } from './quotes'

// Set seed for consistent data
faker.seed(10007)

const documentableTypes: DocumentableType[] = [
  'App\\Models\\Client',
  'App\\Models\\Quote',
  'App\\Models\\Policy',
  'App\\Models\\Claim',
  'App\\Models\\Invoice',
]

const fileTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const mockDocuments: Document[] = Array.from({ length: 80 }, (_, i) => {
  const documentableType = faker.helpers.arrayElement(documentableTypes)

  let documentableId: number
  let fileName: string

  switch (documentableType) {
    case 'App\\Models\\Client':
      documentableId = faker.helpers.arrayElement(mockClients).id
      fileName = faker.helpers.arrayElement([
        'ID_Document.pdf',
        'Address_Proof.pdf',
        'Company_Registration.pdf',
      ])
      break
    case 'App\\Models\\Quote':
      documentableId = faker.helpers.arrayElement(mockQuotes).id
      fileName = faker.helpers.arrayElement([
        'Quote_Document.pdf',
        'Vehicle_Details.pdf',
        'Property_Valuation.pdf',
      ])
      break
    case 'App\\Models\\Policy':
      documentableId = faker.helpers.arrayElement(mockPolicies).id
      fileName = faker.helpers.arrayElement([
        'Policy_Document.pdf',
        'Terms_and_Conditions.pdf',
        'Payment_Receipt.pdf',
      ])
      break
    case 'App\\Models\\Claim':
      documentableId = faker.helpers.arrayElement(mockClaims).id
      fileName = faker.helpers.arrayElement([
        'Claim_Form.pdf',
        'Incident_Report.pdf',
        'Police_Report.pdf',
        'Medical_Report.pdf',
        'Photo_Evidence.jpg',
      ])
      break
    case 'App\\Models\\Invoice':
      documentableId = faker.helpers.arrayElement(mockInvoices).id
      fileName = faker.helpers.arrayElement([
        'Invoice.pdf',
        'Payment_Receipt.pdf',
        'Tax_Invoice.pdf',
      ])
      break
    default:
      documentableId = 1
      fileName = 'Document.pdf'
  }

  const fileType =
    fileName.endsWith('.jpg') || fileName.endsWith('.png')
      ? 'image/jpeg'
      : faker.helpers.arrayElement(fileTypes)

  const fileSize = faker.number.int({ min: 50000, max: 5000000 }) // 50KB to 5MB

  return {
    id: i + 1,
    documentable_type: documentableType,
    documentable_id: documentableId,
    file_name: fileName,
    file_path: `/storage/documents/${faker.string.alphanumeric(20)}/${fileName}`,
    file_type: fileType,
    file_size: fileSize,
    uploaded_by: faker.helpers.arrayElement([1, 2, 3, null]),
    created_at: faker.date.past({ years: 1 }).toISOString(),
    updated_at: faker.date.recent({ days: 30 }).toISOString(),
    uploader: faker.helpers.arrayElement([
      { id: 1, name: 'John Admin' },
      { id: 2, name: 'Jane Manager' },
      { id: 3, name: 'Bob Agent' },
      null,
    ]),
  }
})
