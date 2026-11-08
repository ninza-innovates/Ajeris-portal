'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  KeyIcon, 
  ShieldCheckIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  EnvelopeIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';
import { format } from 'date-fns';
import { UsersService } from '@/lib/api/services/users.service';
import type { UserDetail } from './types';
import UserDetailsSkeleton from './loading';
import OverviewTab from './tabs/OverviewTab';
import ActivityTab from './tabs/ActivityTab';
import SecurityTab from './tabs/SecurityTab';
import PermissionsTab from './tabs/PermissionsTab';
import NotesTab from './tabs/NotesTab';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function statusIs(status: string, expected: 'active' | 'suspended' | 'locked') {
  return status.toLowerCase() === expected;
}

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchUser(params.id as string);
    }
  }, [params.id]);

  const fetchUser = async (id: string) => {
    try {
      setLoading(true);
      const response = await UsersService.getUser(id);
      if (response.data) {
        // Map the API response to UserDetail type
        const userDetail: UserDetail = {
          ...response.data,
          type: 'Healthcare', // Default value, should come from API
          typeLabel: 'Healthcare Provider',
          accountLocked: response.data.status === 'Locked',
          isLocked: response.data.status === 'Locked',
          lastLogin: response.data.lastActive,
          failedLoginAttempts: response.data.failedAttempts,
        };
        setUser(userDetail);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError('User not found');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = () => {
    router.push(`/users/${params.id}/edit`);
  };

  const handleResetPassword = () => {
    // TODO: Implement password reset functionality
    console.log('Reset password for user:', user?.id);
  };

  const handleToggle2FA = () => {
    // TODO: Implement 2FA toggle functionality
    console.log('Toggle 2FA for user:', user?.id);
  };

  const handleToggleStatus = () => {
    // TODO: Implement status toggle functionality
    console.log('Toggle status for user:', user?.id);
  };

  const handleSendEmail = () => {
    // TODO: Implement send email functionality
    console.log('Send email to user:', user?.email);
  };

  if (loading) {
    return <UserDetailsSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {error || 'User not found'}
              </h3>
              <button
                onClick={() => router.push('/users')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Users
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { name: 'Overview', icon: UserCircleIcon },
    { name: 'Activity', icon: null },
    { name: 'Security', icon: ShieldCheckIcon },
    { name: 'Permissions', icon: null },
    { name: 'Notes', icon: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push('/users')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </button>
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {user.name}
                      </h1>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="mt-1">
                        <span
                          className={classNames(
                            statusIs(user.status, 'active')
                              ? 'bg-green-100 text-green-800'
                              : statusIs(user.status, 'suspended')
                              ? 'bg-red-100 text-red-800'
                              : statusIs(user.status, 'locked')
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800',
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                          )}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleEditUser}
                    className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit User
                  </button>
                  <button
                    onClick={handleResetPassword}
                    className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Reset Password
                  </button>
                  <button
                    onClick={handleToggle2FA}
                    className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ShieldCheckIcon className="h-4 w-4 mr-2" />
                    Toggle 2FA
                  </button>
                  <button
                    onClick={handleToggleStatus}
                    className={classNames(
                      statusIs(user.status, 'active')
                        ? 'text-red-700 hover:bg-red-50'
                        : 'text-green-700 hover:bg-green-50',
                      'inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    )}
                  >
                    {statusIs(user.status, 'active') ? (
                      <>
                        <PauseCircleIcon className="h-4 w-4 mr-2" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <PlayCircleIcon className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white shadow rounded-lg">
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="border-b border-gray-200">
                <div className="px-4 sm:px-6">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab, index) => (
                      <Tab
                        key={tab.name}
                        className={({ selected }) =>
                          classNames(
                            selected
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none'
                          )
                        }
                      >
                        <div className="flex items-center">
                          {tab.icon && <tab.icon className="h-5 w-5 mr-2" />}
                          {tab.name}
                        </div>
                      </Tab>
                    ))}
                  </nav>
                </div>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel className="p-4 sm:p-6">
                  <OverviewTab user={user} />
                </Tab.Panel>
                <Tab.Panel className="p-4 sm:p-6">
                  <ActivityTab userId={user.id} />
                </Tab.Panel>
                <Tab.Panel className="p-4 sm:p-6">
                  <SecurityTab user={user} />
                </Tab.Panel>
                <Tab.Panel className="p-4 sm:p-6">
                  <PermissionsTab user={user} />
                </Tab.Panel>
                <Tab.Panel className="p-4 sm:p-6">
                  <NotesTab userId={user.id} />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
}