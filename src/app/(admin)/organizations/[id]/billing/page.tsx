'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Receipt,
  MoreVertical
} from 'lucide-react'
import { mockOrganizations } from '@/lib/mock-data/organizations'
import type { Organization } from '@/types/organization'

// Mock billing data
const mockInvoices = [
  {
    id: 'INV-2024-001',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    amount: 45750.00,
    status: 'Paid',
    paidDate: '2024-02-10',
    studyCount: 215,
    paymentMethod: 'ACH Transfer'
  },
  {
    id: 'INV-2023-012',
    date: '2023-12-15',
    dueDate: '2024-01-15',
    amount: 38900.00,
    status: 'Paid',
    paidDate: '2024-01-12',
    studyCount: 189,
    paymentMethod: 'Wire Transfer'
  },
  {
    id: 'INV-2023-011',
    date: '2023-11-15',
    dueDate: '2023-12-15',
    amount: 42300.00,
    status: 'Overdue',
    paidDate: null,
    studyCount: 201,
    paymentMethod: null
  },
  {
    id: 'INV-2023-010',
    date: '2023-10-15',
    dueDate: '2023-11-15',
    amount: 41200.00,
    status: 'Paid',
    paidDate: '2023-11-10',
    studyCount: 198,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'INV-2023-009',
    date: '2023-09-15',
    dueDate: '2023-10-15',
    amount: 39800.00,
    status: 'Paid',
    paidDate: '2023-10-08',
    studyCount: 192,
    paymentMethod: 'ACH Transfer'
  }
]

const mockTransactions = [
  {
    id: 'TRX-001',
    date: '2024-02-10',
    type: 'Payment',
    description: 'Payment for INV-2024-001',
    amount: 45750.00,
    balance: 0
  },
  {
    id: 'TRX-002',
    date: '2024-01-15',
    type: 'Invoice',
    description: 'Monthly billing - 215 studies',
    amount: -45750.00,
    balance: 45750.00
  },
  {
    id: 'TRX-003',
    date: '2024-01-12',
    type: 'Payment',
    description: 'Payment for INV-2023-012',
    amount: 38900.00,
    balance: 0
  },
  {
    id: 'TRX-004',
    date: '2023-12-15',
    type: 'Invoice',
    description: 'Monthly billing - 189 studies',
    amount: -38900.00,
    balance: 38900.00
  }
]

export default function OrganizationBillingPage() {
  const params = useParams()
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPeriod, setFilterPeriod] = useState('all')

  useEffect(() => {
    const id = params.id as string
    const found = mockOrganizations.find(org => org.id === id)
    if (found) {
      setOrganization(found)
    }
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading billing information...</p>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Organization Not Found</h1>
          <p className="mt-2 text-muted-foreground">The requested organization could not be found.</p>
          <Button className="mt-4" onClick={() => router.push('/organizations')}>
            Go to Organizations
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const totalRevenue = mockInvoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0)
  
  const outstandingAmount = mockInvoices
    .filter(inv => inv.status === 'Overdue' || inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/organizations/${params.id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Billing History</h1>
            <p className="text-muted-foreground">{organization.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            Generate Statement
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Billing Data
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span>+12.5% from last year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${outstandingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">1 overdue invoice</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Invoice</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(mockInvoices.reduce((sum, inv) => sum + inv.amount, 0) / mockInvoices.length).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Per billing cycle</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Performance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80%</div>
            <p className="text-xs text-muted-foreground">On-time payment rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by invoice number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Invoice List */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                Showing {filteredInvoices.length} invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{invoice.id}</h4>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Amount:</span> ${invoice.amount.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Studies:</span> {invoice.studyCount}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            {invoice.paidDate ? (
                              <span className="text-green-600">
                                Paid: {new Date(invoice.paidDate).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-orange-600">Unpaid</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All billing transactions for this organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            transaction.type === 'Payment' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {transaction.type === 'Payment' ? (
                              <DollarSign className="h-4 w-4 text-green-600" />
                            ) : (
                              <FileText className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Balance: ${transaction.balance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage payment methods for this organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">ACH Transfer</p>
                        <p className="text-sm text-muted-foreground">Account ending in ****4567</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Primary</Badge>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Wire Transfer</p>
                        <p className="text-sm text-muted-foreground">Manual processing required</p>
                      </div>
                    </div>
                    <Badge variant="outline">Secondary</Badge>
                  </div>
                </div>
              </div>
              <Button className="mt-4" variant="outline">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Analytics</CardTitle>
              <CardDescription>Financial trends and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Monthly Revenue Trend</h4>
                  <div className="text-center py-12 border rounded-lg">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Revenue trend chart would be displayed here</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Payment Performance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">On-time payments</span>
                      <span className="font-bold text-green-600">80%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Late payments</span>
                      <span className="font-bold text-yellow-600">15%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Overdue payments</span>
                      <span className="font-bold text-red-600">5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}