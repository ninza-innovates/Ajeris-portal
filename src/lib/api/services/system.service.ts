import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { ApiResponse } from '../types'

export interface SystemSettings {
  general: {
    platformName: string
    supportEmail: string
    timezone: string
    dateFormat: string
    timeFormat: string
    language: string
    maintenanceMode: boolean
    maintenanceMessage?: string
  }
  security: {
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireLowercase: boolean
      requireNumbers: boolean
      requireSpecialChars: boolean
      expirationDays: number
      preventReuse: number
    }
    sessionTimeout: number // minutes
    maxLoginAttempts: number
    lockoutDuration: number // minutes
    enforceIPWhitelist: boolean
    ipWhitelist: string[]
    require2FA: boolean
    allowedAuthMethods: string[]
  }
  notifications: {
    emailEnabled: boolean
    smsEnabled: boolean
    slackEnabled: boolean
    defaultEmailFrom: string
    emailProvider: string
    alertEmail: string
    criticalFindingsNotification: boolean
    tatWarningThreshold: number // minutes
  }
  storage: {
    provider: 'local' | 'aws' | 'azure' | 'gcp'
    maxFileSize: number // MB
    allowedFileTypes: string[]
    retentionDays: number
    autoArchive: boolean
    compressionEnabled: boolean
  }
  compliance: {
    auditRetentionDays: number
    phiEncryption: boolean
    dataResidency: string
    gdprEnabled: boolean
    hipaaEnabled: boolean
    autoLogout: boolean
    autoLogoutMinutes: number
  }
  integrations: {
    hl7Enabled: boolean
    pacsEnabled: boolean
    modioHealthEnabled: boolean
    slackWebhook?: string
    teamsWebhook?: string
    customWebhooks: Array<{
      name: string
      url: string
      events: string[]
      active: boolean
    }>
  }
}

export interface IntegrationConfig {
  id: string
  name: string
  type: 'hl7' | 'pacs' | 'modiohealth' | 'slack' | 'teams' | 'webhook'
  enabled: boolean
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  config: Record<string, any>
  credentials?: {
    encrypted: boolean
    lastUpdated: string
  }
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  services: {
    database: ServiceHealth
    redis: ServiceHealth
    storage: ServiceHealth
    email: ServiceHealth
    hl7?: ServiceHealth
    pacs?: ServiceHealth
  }
  system: {
    uptime: number // seconds
    cpu: number // percentage
    memory: number // percentage
    disk: number // percentage
  }
  errors?: Array<{
    service: string
    message: string
    timestamp: string
  }>
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime?: number // ms
  lastCheck?: string
  details?: Record<string, any>
}

export interface SystemLog {
  id: string
  level: 'info' | 'warning' | 'error' | 'critical'
  category: string
  message: string
  details?: Record<string, any>
  timestamp: string
  source: string
  userId?: string
  requestId?: string
}

export interface BackupInfo {
  id: string
  type: 'manual' | 'scheduled'
  status: 'pending' | 'running' | 'completed' | 'failed'
  size: number // bytes
  duration?: number // seconds
  createdAt: string
  completedAt?: string
  expiresAt?: string
  downloadUrl?: string
  error?: string
}

export class SystemService {
  static async getSettings(): Promise<ApiResponse<SystemSettings>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('System settings endpoint not yet implemented - GET /api/admin/system/settings')
  }

  static async updateSettings(settings: Partial<SystemSettings>): Promise<ApiResponse<SystemSettings>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Update system settings endpoint not yet implemented - PUT /api/admin/system/settings')
  }

  static async getIntegrations(): Promise<ApiResponse<IntegrationConfig[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Integrations endpoint not yet implemented - GET /api/admin/system/integrations')
  }

  static async updateIntegration(
    id: string,
    config: Partial<IntegrationConfig>
  ): Promise<ApiResponse<IntegrationConfig>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Update integration endpoint not yet implemented - PUT /api/admin/system/integrations/{id}')
  }

  static async testIntegration(id: string): Promise<ApiResponse<{
    success: boolean
    message: string
    details?: Record<string, any>
  }>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Test integration endpoint not yet implemented - POST /api/admin/system/integrations/{id}/test')
  }

  static async syncIntegration(id: string): Promise<ApiResponse<{
    success: boolean
    recordsProcessed: number
    errors: number
    details?: Record<string, any>
  }>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Sync integration endpoint not yet implemented - POST /api/admin/system/integrations/{id}/sync')
  }

  static async getLogs(params?: {
    level?: string
    category?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<SystemLog[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('System logs endpoint not yet implemented - GET /api/admin/system/logs')
  }

  static async getHealth(): Promise<ApiResponse<SystemHealth>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('System health endpoint not yet implemented - GET /api/admin/system/health')
  }

  static async clearCache(type?: 'all' | 'redis' | 'cdn'): Promise<ApiResponse<{
    success: boolean
    itemsCleared: number
  }>> {
    return apiClient.post('/system/cache/clear', { type })
  }

  static async getBackups(): Promise<ApiResponse<BackupInfo[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Backups endpoint not yet implemented - GET /api/admin/system/backups')
  }

  static async createBackup(type: 'full' | 'partial'): Promise<ApiResponse<BackupInfo>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Create backup endpoint not yet implemented - POST /api/admin/system/backups')
  }

  static async restoreBackup(id: string): Promise<ApiResponse<{
    success: boolean
    message: string
  }>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Restore backup endpoint not yet implemented - POST /api/admin/system/backups/{id}/restore')
  }

  static async downloadBackup(id: string): Promise<void> {
    return apiClient.download(`/system/backups/${id}/download`, `backup_${id}.tar.gz`)
  }

  static async deleteBackup(id: string): Promise<ApiResponse<void>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Delete backup endpoint not yet implemented - DELETE /api/admin/system/backups/{id}')
  }

  static async toggleMaintenanceMode(
    enabled: boolean,
    message?: string
  ): Promise<ApiResponse<{
    enabled: boolean
    message?: string
  }>> {
    return apiClient.post('/system/maintenance-mode', { enabled, message })
  }

  static async runDiagnostics(): Promise<ApiResponse<{
    status: 'passed' | 'failed'
    checks: Array<{
      name: string
      status: 'passed' | 'failed'
      message?: string
      duration: number
    }>
  }>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Diagnostics endpoint not yet implemented - POST /api/admin/system/diagnostics')
  }
}