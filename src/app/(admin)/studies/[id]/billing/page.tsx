'use client'

import { useParams, useRouter } from 'next/navigation'
import { getStudyDetailsById } from '@/lib/mock-data/study-details'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  ArrowLeft,
  DollarSign,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  MoreVertical,
  TrendingUp,
  CreditCard,
  Receipt,
  Shield,
  XCircle,
  RefreshCw,
  Send,
  Eye
} from 'lucide-react'

// Mock billing data types
interface BillingData {
  totalCharges: number
  amountPaid: number
  balance: number
  insuranceCoverage: number
  patientResponsibility: number
  insurance: {
    provider: string
    policyNumber: string
    groupNumber: string
    coveragePercentage: number
    status: 'Active' | 'Pending' | 'Denied' | 'Expired'
    preAuthRequired: boolean
    preAuthNumber?: string
  }
  charges: {
    id: string
    date: string
    description: string
    code: string
    amount: number
    status: 'Paid' | 'Pending' | 'Denied' | 'Processing'
  }[]
  payments: {
    id: string
    date: string
    amount: number
    method: string
    reference: string
    status: 'Completed' | 'Processing' | 'Failed'
    payer: string
  }[]
}

// Mock billing data generator
function generateBillingData(studyId: string): BillingData {
  const baseAmount = 1500
  const randomMultiplier = Math.random() * 2 + 0.5
  const totalCharges = Math.round(baseAmount * randomMultiplier)
  const insuranceCoverage = Math.round(totalCharges * 0.8)
  const patientResponsibility = totalCharges - insuranceCoverage
  const amountPaid = Math.random() > 0.5 ? insuranceCoverage : 0
  
  return {
    totalCharges,
    amountPaid,
    balance: totalCharges - amountPaid,
    insuranceCoverage,
    patientResponsibility,
    insurance: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BC' + Math.random().toString().slice(2, 10),
      groupNumber: 'GRP-' + Math.random().toString().slice(2, 8),
      coveragePercentage: 80,
      status: Math.random() > 0.8 ? 'Pending' : 'Active',
      preAuthRequired: Math.random() > 0.7,
      preAuthNumber: 'PA-' + Math.random().toString().slice(2, 10)
    },
    charges: [
      {
        id: 'chg-001',
        date: 'Dec 20, 2024',
        description: 'CT Chest with Contrast - Technical Component',
        code: '71260-TC',
        amount: Math.round(totalCharges * 0.6),
        status: amountPaid > 0 ? 'Paid' : 'Pending'
      },
      {
        id: 'chg-002',
        date: 'Dec 20, 2024',
        description: 'CT Chest with Contrast - Professional Component',
        code: '71260-PC',
        amount: Math.round(totalCharges * 0.4),
        status: amountPaid > 0 ? 'Paid' : 'Pending'
      }
    ],
    payments: amountPaid > 0 ? [
      {
        id: 'pay-001',
        date: 'Dec 22, 2024',
        amount: insuranceCoverage,
        method: 'Insurance',
        reference: 'EOB-' + Math.random().toString().slice(2, 10),
        status: 'Completed',
        payer: 'Blue Cross Blue Shield'
      }
    ] : []
  }
}

export default function StudyBillingPage() {
  const params = useParams()
  const router = useRouter()
  const studyId = params.id as string
  const study = getStudyDetailsById(studyId)
  
  // Generate mock billing data
  const billingData = generateBillingData(studyId)
  
  const getBillingStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Paid': 'success',
      'Submitted': 'info',
      'Pending': 'warning',
      'Failed': 'destructive',
      'Not Started': 'secondary',
      'Processing': 'info',
      'Denied': 'destructive',
      'Completed': 'success'
    }
    
    const icons: Record<string, JSX.Element> = {
      'Paid': <CheckCircle className="h-3 w-3 mr-1" />,
      'Completed': <CheckCircle className="h-3 w-3 mr-1" />,
      'Pending': <Clock className="h-3 w-3 mr-1" />,
      'Processing': <Clock className="h-3 w-3 mr-1" />,
      'Failed': <XCircle className="h-3 w-3 mr-1" />,
      'Denied': <XCircle className="h-3 w-3 mr-1" />,
      'Submitted': <Send className="h-3 w-3 mr-1" />
    }
    
    return (
      <Badge variant={variants[status] || 'secondary'} className="flex items-center">
        {icons[status]}
        {status}
      </Badge>
    )
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  
  if (!study) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Study Not Found</AlertTitle>
          <AlertDescription>
            The requested study could not be found. Please check the study ID and try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Billing Details
            </h1>
            <p className="text-muted-foreground">
              Study: {study.accession} • {study.patientName.last}, {study.patientName.first}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Statement
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Billing Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resubmit Claim
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                Send to Collections
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View EOB
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Billing Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Charges</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(billingData.totalCharges)}</div>
            <p className="text-xs text-muted-foreground">
              Study performed on {study.studyDate}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(billingData.amountPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              {billingData.payments.length} payment(s) received
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(billingData.balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Due upon receipt
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getBillingStatusBadge(study.billingStatus)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated today
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Insurance Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Insurance Information
          </CardTitle>
          <CardDescription>
            Primary insurance coverage details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider:</span>
                <span className="font-medium">{billingData.insurance.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Policy Number:</span>
                <span className="font-mono">{billingData.insurance.policyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Group Number:</span>
                <span className="font-mono">{billingData.insurance.groupNumber}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coverage:</span>
                <span className="font-medium">{billingData.insurance.coveragePercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                {getBillingStatusBadge(billingData.insurance.status)}
              </div>
              {billingData.insurance.preAuthRequired && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pre-Auth:</span>
                  <span className="font-mono">{billingData.insurance.preAuthNumber}</span>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Insurance Coverage</span>
              <span className="font-medium">{formatCurrency(billingData.insuranceCoverage)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Patient Responsibility</span>
              <span className="font-medium">{formatCurrency(billingData.patientResponsibility)}</span>
            </div>
            <Progress 
              value={(billingData.insuranceCoverage / billingData.totalCharges) * 100} 
              className="h-2 mt-2"
            />
            <p className="text-xs text-muted-foreground text-right">
              {Math.round((billingData.insuranceCoverage / billingData.totalCharges) * 100)}% covered by insurance
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Charges Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Charges Breakdown
          </CardTitle>
          <CardDescription>
            Detailed breakdown of all charges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {billingData.charges.map((charge) => (
              <div key={charge.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{charge.description}</p>
                  <p className="text-sm text-muted-foreground">
                    CPT: {charge.code} • Date: {charge.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{formatCurrency(charge.amount)}</span>
                  {getBillingStatusBadge(charge.status)}
                </div>
              </div>
            ))}
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-medium text-lg">
              <span>Total Charges</span>
              <span>{formatCurrency(billingData.totalCharges)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>
            Record of all payments received
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billingData.payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-muted-foreground">No payments received yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Claim is pending processing with insurance
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {billingData.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{payment.payer}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.method} • Ref: {payment.reference}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payment.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-green-600">
                      {formatCurrency(payment.amount)}
                    </span>
                    {getBillingStatusBadge(payment.status)}
                  </div>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Payments</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(billingData.amountPaid)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining Balance</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(billingData.balance)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Alert for Outstanding Balance */}
      {billingData.balance > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Outstanding Balance</AlertTitle>
          <AlertDescription>
            There is an outstanding balance of {formatCurrency(billingData.balance)} on this study. 
            {billingData.insurance.status === 'Pending' && 
              ' The insurance claim is currently being processed.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}