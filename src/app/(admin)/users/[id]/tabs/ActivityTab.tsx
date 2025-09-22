import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  ClockIcon, 
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  KeyIcon,
  UserIcon,
  CogIcon,
  DocumentIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ActivityTabProps {
  userId: string;
}

interface Activity {
  id: string;
  action: string;
  type: 'login' | 'logout' | 'password_change' | 'profile_update' | 'settings_change' | 'document_access' | 'error';
  timestamp: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

const activityIcons = {
  login: ArrowRightOnRectangleIcon,
  logout: ArrowLeftOnRectangleIcon,
  password_change: KeyIcon,
  profile_update: UserIcon,
  settings_change: CogIcon,
  document_access: DocumentIcon,
  error: ExclamationTriangleIcon,
};

const activityColors = {
  login: 'text-green-600 bg-green-100',
  logout: 'text-gray-600 bg-gray-100',
  password_change: 'text-yellow-600 bg-yellow-100',
  profile_update: 'text-blue-600 bg-blue-100',
  settings_change: 'text-purple-600 bg-purple-100',
  document_access: 'text-indigo-600 bg-indigo-100',
  error: 'text-red-600 bg-red-100',
};

export default function ActivityTab({ userId }: ActivityTabProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate fetching activity data
    const mockActivities: Activity[] = [
      {
        id: '1',
        action: 'User logged in',
        type: 'login',
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome/120.0.0.0'
      },
      {
        id: '2',
        action: 'Password changed',
        type: 'password_change',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        details: 'Password was successfully changed'
      },
      {
        id: '3',
        action: 'Profile information updated',
        type: 'profile_update',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        details: 'Updated phone number and address'
      },
      {
        id: '4',
        action: 'User logged out',
        type: 'logout',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: '5',
        action: 'Failed login attempt',
        type: 'error',
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        details: 'Invalid password entered',
        ipAddress: '192.168.1.2'
      },
    ];

    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, [userId]);

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 h-20 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Filter buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filter === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Activities
        </button>
        {Object.keys(activityIcons).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === type
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
          </button>
        ))}
      </div>

      {/* Activity list */}
      <div className="flow-root">
        <ul className="-mb-8">
          {filteredActivities.map((activity, activityIdx) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];
            
            return (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== filteredActivities.length - 1 ? (
                    <span
                      className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white ${colorClass}`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div>
                        <div className="text-sm text-gray-900 font-medium">
                          {activity.action}
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {format(new Date(activity.timestamp), 'PPpp')}
                        </p>
                      </div>
                      {activity.details && (
                        <div className="mt-2 text-sm text-gray-700">
                          {activity.details}
                        </div>
                      )}
                      {(activity.ipAddress || activity.userAgent) && (
                        <div className="mt-2 text-xs text-gray-500">
                          {activity.ipAddress && <span>IP: {activity.ipAddress}</span>}
                          {activity.ipAddress && activity.userAgent && <span> • </span>}
                          {activity.userAgent && <span>Browser: {activity.userAgent}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No activities match the selected filter.
          </p>
        </div>
      )}
    </div>
  );
}