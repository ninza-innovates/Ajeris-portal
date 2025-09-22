import { format } from 'date-fns';
import type { UserDetail } from '../types';
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  DevicePhoneMobileIcon,
  FingerPrintIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface SecurityTabProps {
  user: UserDetail;
}

interface SecurityMetric {
  label: string;
  value: string | number;
  status: 'good' | 'warning' | 'danger' | 'neutral';
  icon: any;
  description?: string;
}

export default function SecurityTab({ user }: SecurityTabProps) {
  // Mock security data - in real app, this would come from the user object or a separate API call
  const securityMetrics: SecurityMetric[] = [
    {
      label: 'Two-Factor Authentication',
      value: user.twoFactorEnabled ? 'Enabled' : 'Disabled',
      status: user.twoFactorEnabled ? 'good' : 'warning',
      icon: ShieldCheckIcon,
      description: user.twoFactorEnabled 
        ? 'User has enabled 2FA for additional security'
        : 'Recommend enabling 2FA for better account security'
    },
    {
      label: 'Password Strength',
      value: 'Strong',
      status: 'good',
      icon: KeyIcon,
      description: 'Password meets all security requirements'
    },
    {
      label: 'Password Last Changed',
      value: user.passwordLastChanged 
        ? format(new Date(user.passwordLastChanged), 'PP')
        : '90 days ago',
      status: 'neutral',
      icon: ClockIcon,
      description: 'Regular password changes are recommended'
    },
    {
      label: 'Failed Login Attempts',
      value: user.failedLoginAttempts || 0,
      status: user.failedLoginAttempts && user.failedLoginAttempts > 5 ? 'danger' : 'good',
      icon: ExclamationTriangleIcon,
      description: 'Number of failed login attempts in the last 30 days'
    },
    {
      label: 'Account Lockout Status',
      value: user.isLocked ? 'Locked' : 'Active',
      status: user.isLocked ? 'danger' : 'good',
      icon: user.isLocked ? XCircleIcon : CheckCircleIcon,
      description: user.isLocked 
        ? 'Account is currently locked due to security reasons'
        : 'Account is active and accessible'
    },
    {
      label: 'Trusted Devices',
      value: '3 devices',
      status: 'neutral',
      icon: DevicePhoneMobileIcon,
      description: 'Number of devices authorized to access this account'
    },
    {
      label: 'Biometric Authentication',
      value: 'Not configured',
      status: 'neutral',
      icon: FingerPrintIcon,
      description: 'Biometric login is not set up for this account'
    }
  ];

  const getStatusColor = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'danger':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusBadge = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'danger':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Recent security events
  const securityEvents = [
    {
      id: '1',
      event: 'Password changed successfully',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'success'
    },
    {
      id: '2',
      event: 'New device login from Chrome on Windows',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      type: 'info'
    },
    {
      id: '3',
      event: 'Failed login attempt from unknown IP',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      type: 'warning'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Overview</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {securityMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(metric.status)}`}>
                    {metric.status === 'good' ? 'Secure' : metric.status === 'warning' ? 'Warning' : metric.status === 'danger' ? 'Risk' : 'Info'}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-gray-900">{metric.label}</h4>
                <p className="text-lg font-semibold text-gray-900 mt-1">{metric.value}</p>
                {metric.description && (
                  <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Security Events */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Security Events</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {securityEvents.map((event) => (
              <li key={event.id} className="px-4 py-4">
                <div className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                    event.type === 'success' ? 'bg-green-400' :
                    event.type === 'warning' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{event.event}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(event.timestamp), 'PPpp')}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Security Recommendations</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          {!user.twoFactorEnabled && (
            <li>• Enable two-factor authentication for enhanced security</li>
          )}
          <li>• Review and remove any unrecognized trusted devices</li>
          <li>• Consider setting up biometric authentication if available</li>
          <li>• Regularly review account activity for any suspicious behavior</li>
        </ul>
      </div>
    </div>
  );
}