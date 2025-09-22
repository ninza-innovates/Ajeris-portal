import { format } from 'date-fns';
import type { UserDetail } from '../types';
import { 
  CalendarIcon, 
  ClockIcon, 
  BuildingOfficeIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface OverviewTabProps {
  user: UserDetail;
}

export default function OverviewTab({ user }: OverviewTabProps) {
  const infoSections = [
    {
      title: 'Basic Information',
      items: [
        { 
          label: 'Full Name', 
          value: user.name,
          icon: null
        },
        { 
          label: 'Email Address', 
          value: user.email,
          icon: EnvelopeIcon
        },
        { 
          label: 'Phone Number', 
          value: user.phone || 'Not provided',
          icon: PhoneIcon
        },
        { 
          label: 'User ID', 
          value: user.id,
          icon: null
        },
      ]
    },
    {
      title: 'Organization Details',
      items: [
        { 
          label: 'Organization', 
          value: user.organization || 'Not assigned',
          icon: BuildingOfficeIcon
        },
        { 
          label: 'Department', 
          value: user.department || 'Not assigned',
          icon: null
        },
        { 
          label: 'Role', 
          value: user.role,
          icon: BriefcaseIcon
        },
        { 
          label: 'Manager', 
          value: user.manager || 'None',
          icon: null
        },
      ]
    },
    {
      title: 'Location & Time',
      items: [
        { 
          label: 'Location', 
          value: user.location || 'Not specified',
          icon: MapPinIcon
        },
        { 
          label: 'Timezone', 
          value: user.timezone || 'UTC',
          icon: GlobeAltIcon
        },
        { 
          label: 'Language', 
          value: user.language || 'English',
          icon: null
        },
      ]
    },
    {
      title: 'Account Details',
      items: [
        { 
          label: 'Created Date', 
          value: user.createdAt ? format(new Date(user.createdAt), 'PPP') : 'Unknown',
          icon: CalendarIcon
        },
        { 
          label: 'Last Login', 
          value: user.lastLogin || user.lastActive ? format(new Date(user.lastLogin || user.lastActive || ''), 'PPpp') : 'Never',
          icon: ClockIcon
        },
        { 
          label: 'Email Verified', 
          value: user.emailVerified ? 'Yes' : 'No',
          icon: null
        },
        { 
          label: 'Account Type', 
          value: user.accountType || 'Standard',
          icon: null
        },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {infoSections.map((section) => (
        <div key={section.title}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">{section.title}</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            {section.items.map((item) => (
              <div key={item.label} className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  {item.icon && <item.icon className="h-4 w-4 mr-2 text-gray-400" />}
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      {/* Additional Info Card */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Notes</h4>
        <p className="text-sm text-gray-600">
          {user.bio || 'No additional information available for this user.'}
        </p>
      </div>
    </div>
  );
}