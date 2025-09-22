import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { ApiResponse } from '../types'

export type NotificationType = 'info' | 'warning' | 'error' | 'success'
export type NotificationChannel = 'email' | 'sms' | 'in_app' | 'slack'
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'read'

export interface Notification {
  id: string
  type: NotificationType
  channel: NotificationChannel
  recipient: string
  subject: string
  message: string
  status: NotificationStatus
  metadata?: Record<string, any>
  createdAt: string
  sentAt?: string
  readAt?: string
  error?: string
}

export interface NotificationTemplate {
  id: string
  name: string
  description?: string
  channel: NotificationChannel
  subject: string
  body: string
  variables: string[] // e.g., ['patientName', 'studyType']
  category: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationStats {
  total: number
  sent: number
  failed: number
  pending: number
  read: number
  byChannel: Record<NotificationChannel, number>
  byType: Record<NotificationType, number>
}

export interface SendNotificationParams {
  templateId?: string
  channel: NotificationChannel
  recipients: string[]
  subject?: string
  message?: string
  variables?: Record<string, any>
  metadata?: Record<string, any>
}

export interface NotificationHistory {
  id: string
  templateId?: string
  templateName?: string
  channel: NotificationChannel
  recipient: string
  subject: string
  status: NotificationStatus
  sentAt: string
  deliveredAt?: string
  openedAt?: string
  clickedAt?: string
  error?: string
}

export interface CredentialingExpiryNotification {
  id: string
  radiologistId: string
  radiologistName: string
  credentialType: string
  expiryDate: string
  daysUntilExpiry: number
  notificationSent: boolean
  sentAt?: string
  acknowledged: boolean
  acknowledgedAt?: string
  acknowledgedBy?: string
}

export class NotificationsService {
  static async getNotifications(params?: {
    type?: NotificationType
    channel?: NotificationChannel
    status?: NotificationStatus
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<Notification[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Notifications endpoint not yet implemented - GET /api/admin/notifications')
  }

  static async getNotificationStats(): Promise<ApiResponse<NotificationStats>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Notification stats endpoint not yet implemented - GET /api/admin/notifications/stats')
  }

  static async markAsRead(id: string): Promise<ApiResponse<void>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Mark notification as read endpoint not yet implemented - POST /api/admin/notifications/{id}/read')
  }

  static async markAllAsRead(): Promise<ApiResponse<void>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Mark all notifications as read endpoint not yet implemented - POST /api/admin/notifications/read-all')
  }

  static async deleteNotification(id: string): Promise<ApiResponse<void>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Delete notification endpoint not yet implemented - DELETE /api/admin/notifications/{id}')
  }

  static async getTemplates(channel?: NotificationChannel): Promise<ApiResponse<NotificationTemplate[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Notification templates endpoint not yet implemented - GET /api/admin/notifications/templates')
  }

  static async getTemplate(id: string): Promise<ApiResponse<NotificationTemplate>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Get notification template endpoint not yet implemented - GET /api/admin/notifications/templates/{id}')
  }

  static async updateTemplate(
    id: string,
    template: Partial<NotificationTemplate>
  ): Promise<ApiResponse<NotificationTemplate>> {
    return apiClient.put<NotificationTemplate>(API_ENDPOINTS.NOTIFICATIONS.UPDATE_TEMPLATE(id), template)
  }

  static async createTemplate(template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<NotificationTemplate>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Create notification template endpoint not yet implemented - POST /api/admin/notifications/templates')
  }

  static async deleteTemplate(id: string): Promise<ApiResponse<void>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Delete notification template endpoint not yet implemented - DELETE /api/admin/notifications/templates/{id}')
  }

  static async sendNotification(params: SendNotificationParams): Promise<ApiResponse<{
    sent: number
    failed: number
    errors?: Array<{ recipient: string; error: string }>
  }>> {
    return apiClient.post<{
      sent: number
      failed: number
      errors?: Array<{ recipient: string; error: string }>
    }>(API_ENDPOINTS.NOTIFICATIONS.SEND, params)
  }

  static async getHistory(params?: {
    channel?: NotificationChannel
    templateId?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<NotificationHistory[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Notification history endpoint not yet implemented - GET /api/admin/notifications/history')
  }

  static async getCredentialingExpiryNotifications(params?: {
    daysAhead?: number
    acknowledged?: boolean
  }): Promise<ApiResponse<CredentialingExpiryNotification[]>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Credentialing expiry notifications endpoint not yet implemented - GET /api/admin/notifications/credentialing-expiry')
  }

  static async acknowledgeCredentialingExpiry(
    id: string,
    acknowledgedBy: string
  ): Promise<ApiResponse<void>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Acknowledge credentialing expiry endpoint not yet implemented - POST /api/admin/notifications/credentialing-expiry/{id}/acknowledge')
  }

  static async testNotification(
    channel: NotificationChannel,
    recipient: string
  ): Promise<ApiResponse<{
    success: boolean
    message: string
  }>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Test notification endpoint not yet implemented - POST /api/admin/notifications/test')
  }

  static async getUnsubscribed(): Promise<ApiResponse<Array<{
    email: string
    channel: NotificationChannel
    reason?: string
    unsubscribedAt: string
  }>>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Get unsubscribed list endpoint not yet implemented - GET /api/admin/notifications/unsubscribed')
  }

  static async resubscribe(email: string, channel: NotificationChannel): Promise<ApiResponse<void>> {
    // Endpoint not yet implemented - waiting for backend
    throw new Error('Resubscribe endpoint not yet implemented - POST /api/admin/notifications/resubscribe')
  }
}