// API Endpoint Constants

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // User
  USER: '/user',

  // Users (Team Members)
  USERS: '/users',
  USER_DETAIL: (id: number) => `/users/${id}`,

  // Clients
  CLIENTS: '/clients',
  CLIENT: (id: number) => `/clients/${id}`,
  CLIENT_QUOTES: (id: number) => `/clients/${id}/quotes`,
  CLIENT_POLICIES: (id: number) => `/clients/${id}/policies`,
  CLIENT_CLAIMS: (id: number) => `/clients/${id}/claims`,
  CLIENT_INVOICES: (id: number) => `/clients/${id}/invoices`,

  // Insurers
  INSURERS: '/insurers',
  INSURER: (id: number) => `/insurers/${id}`,
  INSURERS_ACTIVE: '/insurers-active',
  INSURER_INSURANCE_TYPES: (id: number) => `/insurers/${id}/insurance-types`,
  INSURER_TOGGLE_ACTIVE: (id: number) => `/insurers/${id}/toggle-active`,

  // Pricing Rules
  PRICING_RULES: '/pricing-rules',
  PRICING_RULE: (id: number) => `/pricing-rules/${id}`,
  PRICING_RULE_TOGGLE_ACTIVE: (id: number) =>
    `/pricing-rules/${id}/toggle-active`,
  PRICING_RULE_DUPLICATE: (id: number) => `/pricing-rules/${id}/duplicate`,

  // Quotes
  QUOTES: '/quotes',
  QUOTE: (id: number) => `/quotes/${id}`,
  QUOTE_SEND_TO_INSURER: (id: number) => `/quotes/${id}/send-to-insurer`,
  QUOTE_APPROVE: (id: number) => `/quotes/${id}/approve`,
  QUOTE_CONVERT_TO_POLICY: (id: number) => `/quotes/${id}/convert-to-policy`,

  // Policies
  POLICIES: '/policies',
  POLICY: (id: number) => `/policies/${id}`,
  POLICIES_EXPIRING: '/policies-expiring',
  POLICY_RENEW: (id: number) => `/policies/${id}/renew`,

  // Claims
  CLAIMS: '/claims',
  CLAIM: (id: number) => `/claims/${id}`,
  CLAIM_STATUS: (id: number) => `/claims/${id}/status`,
  CLAIM_FORWARD: (id: number) => `/claims/${id}/forward`,

  // Invoices
  INVOICES: '/invoices',
  INVOICE: (id: number) => `/invoices/${id}`,
  INVOICES_OVERDUE: '/invoices-overdue',
  INVOICE_SEND: (id: number) => `/invoices/${id}/send`,
  INVOICE_PAYMENT: (id: number) => `/invoices/${id}/payment`,

  // Documents
  DOCUMENTS: '/documents',
  DOCUMENT: (id: number) => `/documents/${id}`,
  DOCUMENT_DOWNLOAD: (id: number) => `/documents/${id}/download`,

  // Invitations (Members)
  INVITATIONS: '/invitations',
  INVITATION: (id: number) => `/invitations/${id}`,
  INVITATION_VERIFY: (token: string) => `/invitations/verify/${token}`,

  // Profile
  PROFILE: '/profile',
  PROFILE_PHOTO: '/profile/photo',
  PROFILE_PASSWORD: '/profile/password',

  // Company Settings
  COMPANY_SETTINGS: '/company-settings',
  COMPANY_SETTINGS_LOGO: '/company-settings/logo',

  // Dashboard
  DASHBOARD: {
    INDEX: '/dashboard',
    STATS: '/dashboard/stats',
  },

  // Health Check
  HEALTH: '/health',
} as const
