'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  FileText,
  Download,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'

export default function BillingPage() {
  const stats = [
    {
      title: 'Monthly Revenue',
      value: '$125,430',
      change: '+15.3%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Outstanding Balance',
      value: '$48,250',
      subtitle: '12 overdue invoices',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Collected This Month',
      value: '$98,750',
      change: '+8.2%',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Average Days to Pay',
      value: '23 days',
      change: '-5 days',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  const recentInvoices = [
    {
      id: 'INV-2024-001',
      organization: 'City Medical Center',
      amount: 15750,
      studyCount: 315,
      dueDate: '2024-01-25',
      status: 'Paid',
      paidDate: '2024-01-20'
    },
    {
      id: 'INV-2024-002',
      organization: 'County Hospital',
      amount: 8500,
      studyCount: 170,
      dueDate: '2024-01-30',
      status: 'Pending',
    },
    {
      id: 'INV-2024-003',
      organization: 'Cancer Institute',
      amount: 12300,
      studyCount: 246,
      dueDate: '2024-01-15',
      status: 'Overdue',
    },
    {
      id: 'INV-2024-004',
      organization: 'Neurology Center',
      amount: 6750,
      studyCount: 135,
      dueDate: '2024-02-05',
      status: 'Draft',
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Paid': 'success',
      'Pending': 'warning',
      'Overdue': 'destructive',
      'Draft': 'secondary'
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Payments</h1>
          <p className="text-muted-foreground">
            Manage invoices and track payments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn(stat.bgColor, 'p-2 rounded-md')}>
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              )}
              {stat.change && (
                <p className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span> from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenue Overview</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 days
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Revenue chart visualization would go here</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Invoice ID</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Organization</th>
                  <th className="p-3 text-right text-xs font-medium text-gray-700 uppercase">Amount</th>
                  <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">Studies</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Due Date</th>
                  <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="p-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-sm">{invoice.id}</td>
                    <td className="p-3">{invoice.organization}</td>
                    <td className="p-3 text-right font-medium">${invoice.amount.toLocaleString()}</td>
                    <td className="p-3 text-center">{invoice.studyCount}</td>
                    <td className="p-3 text-sm">{invoice.dueDate}</td>
                    <td className="p-3 text-center">{getStatusBadge(invoice.status)}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}