import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BillingService, GenerateInvoiceRequest, UpdateSubscriptionRequest } from '../services'
import { queryKeys } from '../query-client'
import { toast } from '@/components/ui/use-toast'

export function useBillingOverview(params?: { startDate?: Date; endDate?: Date }) {
  return useQuery({
    queryKey: ['billing', 'overview', params],
    queryFn: () => BillingService.getOverview(params),
  })
}

export function useInvoices(filters?: { organizationId?: string; status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['billing', 'invoices', filters],
    queryFn: () => BillingService.getInvoices(filters),
  })
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['billing', 'invoice', id],
    queryFn: () => BillingService.getInvoice(id),
    enabled: !!id,
  })
}

export function useGenerateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GenerateInvoiceRequest) => BillingService.generateInvoice(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'invoices'] })
      toast({
        title: 'Invoice generated',
        description: `Invoice #${response.data?.invoiceNumber} has been created.`,
      })
    },
  })
}

export function useMarkInvoicePaid(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (paymentData: { paymentMethod: string; transactionId: string; amount: number }) => 
      BillingService.markAsPaid(id, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'invoices'] })
      queryClient.invalidateQueries({ queryKey: ['billing', 'invoice', id] })
      toast({
        title: 'Invoice marked as paid',
        description: 'Payment has been recorded.',
      })
    },
  })
}

export function useSubscriptions(organizationId?: string) {
  return useQuery({
    queryKey: ['billing', 'subscriptions', organizationId],
    queryFn: () => BillingService.getSubscriptions(organizationId),
  })
}

export function useUpdateSubscription(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateSubscriptionRequest) => BillingService.updateSubscription(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'subscriptions'] })
      toast({
        title: 'Subscription updated',
        description: 'Subscription has been updated successfully.',
      })
    },
  })
}

export function useUsageReport(params: { organizationId: string; startDate: Date; endDate: Date }) {
  return useQuery({
    queryKey: ['billing', 'usage', params],
    queryFn: () => BillingService.getUsageReport(params),
    enabled: !!params.organizationId && !!params.startDate && !!params.endDate,
  })
}

export function useExportInvoices() {
  return useMutation({
    mutationFn: (params: { format: 'csv' | 'pdf'; filters?: any }) => 
      BillingService.exportInvoices(params.filters, params.format),
    onSuccess: (response) => {
      // Handle file download
      if (response.data) {
        const blob = new Blob([response.data], { 
          type: response.headers?.['content-type'] || 'application/octet-stream' 
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoices-export-${new Date().toISOString().split('T')[0]}.${response.format || 'csv'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast({
          title: 'Export successful',
          description: 'Invoices have been exported.',
        })
      }
    },
  })
}