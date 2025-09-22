// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.staging.ajeris.com',
  API_VERSION: '/api',
  ADMIN_PREFIX: '/admin',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    VERIFY: '/auth/verify',
    PERMISSIONS: '/auth/permissions',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VALIDATE_RESET_TOKEN: '/auth/validate-reset-token',
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ACTIVITY: '/dashboard/activity',
    TRENDS: '/analytics/trends',
  },
  
  // Users
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    RESET_PASSWORD: (id: string) => `/users/${id}/reset-password`,
    TOGGLE_2FA: (id: string) => `/users/${id}/toggle-2fa`,
    SUSPEND: (id: string) => `/users/${id}/suspend`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
    ACTIVITY: (id: string) => `/users/${id}/activity`,
    LOGIN_HISTORY: (id: string) => `/users/${id}/login-history`,
  },
  
  // Admin Members
  MEMBERS: {
    LIST: '/members',
    DETAIL: (id: string) => `/members/${id}`,
    INVITE: '/members/invite',
    UPDATE: (id: string) => `/members/${id}`,
    SUSPEND: (id: string) => `/members/${id}/suspend`,
    ACTIVATE: (id: string) => `/members/${id}/activate`,
    DELETE: (id: string) => `/members/${id}`,
    RESEND_INVITATION: (id: string) => `/members/invitations/${id}/resend`,
    CANCEL_INVITATION: (id: string) => `/members/invitations/${id}`,
  },
  
  // Radiologists
  RADIOLOGISTS: {
    LIST: '/radiologists',
    DETAIL: (id: string) => `/radiologists/${id}`,
    UPDATE: (id: string) => `/radiologists/${id}`,
    CREDENTIALS: (id: string) => `/radiologists/${id}/credentials`,
    PERFORMANCE: (id: string) => `/radiologists/${id}/performance`,
    STUDIES: (id: string) => `/radiologists/${id}/studies`,
    TOGGLE_AVAILABILITY: (id: string) => `/radiologists/${id}/toggle-availability`,
    ASSIGN_STUDY: (id: string) => `/radiologists/${id}/assign-study`,
    ORGANIZATIONS: (id: string) => `/radiologists/${id}/organizations`,
  },
  
  // Organizations
  ORGANIZATIONS: {
    LIST: '/organizations',
    DETAIL: (id: string) => `/organizations/${id}`,
    CREATE: '/organizations',
    UPDATE: (id: string) => `/organizations/${id}`,
    DELETE: (id: string) => `/organizations/${id}`,
    USERS: (id: string) => `/organizations/${id}/users`,
    INVITE_USER: (id: string) => `/organizations/${id}/users/invite`,
    BILLING: (id: string) => `/organizations/${id}/billing`,
    TEST_HL7: (id: string) => `/organizations/${id}/test-hl7`,
    SETTINGS: (id: string) => `/organizations/${id}/settings`,
    RADIOLOGISTS: (orgId: string) => `/organizations/${orgId}/radiologists`,
    ASSIGN_RADIOLOGISTS: (orgId: string) => `/organizations/${orgId}/radiologists`,
    RADIOLOGIST_DETAIL: (orgId: string, radId: string) => `/organizations/${orgId}/radiologists/${radId}`,
    UPDATE_RADIOLOGIST: (orgId: string, radId: string) => `/organizations/${orgId}/radiologists/${radId}`,
    REMOVE_RADIOLOGIST: (orgId: string, radId: string) => `/organizations/${orgId}/radiologists/${radId}`,
    RENEW_CREDENTIALING: (orgId: string, radId: string) => `/organizations/${orgId}/radiologists/${radId}/renew-credentialing`,
  },
  
  // Studies
  STUDIES: {
    LIST: '/studies',
    DETAIL: (id: string) => `/studies/${id}`,
    UPDATE: (id: string) => `/studies/${id}`,
    REASSIGN: (id: string) => `/studies/${id}/reassign`,
    ESCALATE: (id: string) => `/studies/${id}/escalate`,
    RESET_WORKFLOW: (id: string) => `/studies/${id}/reset-workflow`,
    FLAG_COMPLIANCE: (id: string) => `/studies/${id}/flag-compliance`,
    OVERRIDE_BILLING: (id: string) => `/studies/${id}/override-billing`,
    DELETE: (id: string) => `/studies/${id}`,
    AUDIT: (id: string) => `/studies/${id}/audit`,
    FILES: (id: string) => `/studies/${id}/files`,
    VALIDATE_FILE: (id: string, fileId: string) => `/studies/${id}/files/${fileId}/validate`,
    MARK_CRITICAL: (id: string) => `/studies/${id}/mark-critical`,
    ADD_NOTE: (id: string) => `/studies/${id}/notes`,
    EXPORT: '/studies/export',
  },
  
  // Billing
  BILLING: {
    OVERVIEW: '/billing/overview',
    INVOICES: '/billing/invoices',
    INVOICE_DETAIL: (id: string) => `/billing/invoices/${id}`,
    UPDATE_INVOICE: (id: string) => `/billing/invoices/${id}`,
    MARK_PAID: (id: string) => `/billing/invoices/${id}/mark-paid`,
    SEND_REMINDER: (id: string) => `/billing/invoices/${id}/send-reminder`,
    TRANSACTIONS: '/billing/transactions',
    REPORTS: '/billing/reports',
  },
  
  // Compliance
  COMPLIANCE: {
    OVERVIEW: '/compliance/overview',
    FLAGS: '/compliance/flags',
    AUDIT_LOGS: '/compliance/audit-logs',
    DATA_ACCESS_LOGS: '/compliance/data-access-logs',
    LOGIN_HISTORY: '/compliance/login-history',
    EXPORT_AUDIT: '/compliance/export-audit',
    HIPAA_REPORT: '/compliance/hipaa-report',
    CREDENTIALING_AUDIT: '/compliance/credentialing-audit',
  },
  
  // System
  SYSTEM: {
    SETTINGS: '/system/settings',
    UPDATE_SETTINGS: '/system/settings',
    INTEGRATIONS: '/system/integrations',
    TEST_INTEGRATION: '/system/integrations/test',
    LOGS: '/system/logs',
    HEALTH: '/system/health',
    CLEAR_CACHE: '/system/cache/clear',
    BACKUPS: '/system/backups',
    MAINTENANCE_MODE: '/system/maintenance-mode',
  },
  
  // Onboarding
  ONBOARDING: {
    LIST: '/onboarding',
    STATUS: (orgId: string) => `/onboarding/${orgId}/status`,
    UPDATE_STATUS: (orgId: string) => `/onboarding/${orgId}/status`,
    CHECKLIST: (orgId: string) => `/onboarding/${orgId}/checklist`,
    TASKS: '/onboarding/tasks',
    RADIOLOGIST_REQUIREMENTS: (orgId: string) => `/onboarding/${orgId}/radiologist-requirements`,
    COMPLETE_CREDENTIALING: (orgId: string) => `/onboarding/${orgId}/complete-credentialing`,
  },
  
  // Reports
  REPORTS: {
    TYPES: '/reports/types',
    GENERATE: '/reports/generate',
    SCHEDULED: '/reports/scheduled',
    SCHEDULE: '/reports/schedule',
    CREDENTIALING: '/reports/credentialing',
  },
  
  // Notifications
  NOTIFICATIONS: {
    TEMPLATES: '/notifications/templates',
    UPDATE_TEMPLATE: (id: string) => `/notifications/templates/${id}`,
    SEND: '/notifications/send',
    HISTORY: '/notifications/history',
    CREDENTIALING_EXPIRY: '/notifications/credentialing-expiry',
  },
  
  // Credentialing
  CREDENTIALING: {
    STATS: '/credentialing/stats',
    MODIOHEALTH_SYNC: '/credentialing/modiohealth/sync',
    EXPIRING: '/credentialing/expiring',
  },
} as const

// Helper function to build full URL
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.ADMIN_PREFIX}${endpoint}`
}

// API Error Codes
export const API_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
} as const

// Rate Limit Headers
export const RATE_LIMIT_HEADERS = {
  LIMIT: 'X-RateLimit-Limit',
  REMAINING: 'X-RateLimit-Remaining',
  RESET: 'X-RateLimit-Reset',
} as const