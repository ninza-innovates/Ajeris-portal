import { useState } from 'react';
import type { UserDetail } from '../types';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  DocumentTextIcon,
  CogIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

interface PermissionsTabProps {
  user: UserDetail;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  granted: boolean;
  icon: any;
}

interface PermissionCategory {
  name: string;
  icon: any;
  permissions: Permission[];
}

export default function PermissionsTab({ user }: PermissionsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Define permissions based on user role
  const getPermissionsForRole = (role: string): PermissionCategory[] => {
    const basePermissions: PermissionCategory[] = [
      {
        name: 'User Management',
        icon: UsersIcon,
        permissions: [
          {
            id: 'user.view',
            name: 'View Users',
            description: 'Can view user profiles and lists',
            category: 'User Management',
            granted: true,
            icon: UsersIcon
          },
          {
            id: 'user.create',
            name: 'Create Users',
            description: 'Can create new user accounts',
            category: 'User Management',
            granted: role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'admin' || role === 'super_admin',
            icon: UsersIcon
          },
          {
            id: 'user.edit',
            name: 'Edit Users',
            description: 'Can modify user information',
            category: 'User Management',
            granted: role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'admin' || role === 'super_admin',
            icon: UsersIcon
          },
          {
            id: 'user.delete',
            name: 'Delete Users',
            description: 'Can remove user accounts',
            category: 'User Management',
            granted: role === 'SUPER_ADMIN' || role === 'super_admin',
            icon: UsersIcon
          }
        ]
      },
      {
        name: 'Content Management',
        icon: DocumentTextIcon,
        permissions: [
          {
            id: 'content.view',
            name: 'View Content',
            description: 'Can view all content',
            category: 'Content Management',
            granted: true,
            icon: DocumentTextIcon
          },
          {
            id: 'content.create',
            name: 'Create Content',
            description: 'Can create new content',
            category: 'Content Management',
            granted: role !== 'viewer' && role !== 'VIEWER',
            icon: DocumentTextIcon
          },
          {
            id: 'content.edit',
            name: 'Edit Content',
            description: 'Can modify existing content',
            category: 'Content Management',
            granted: role !== 'viewer' && role !== 'VIEWER',
            icon: DocumentTextIcon
          },
          {
            id: 'content.publish',
            name: 'Publish Content',
            description: 'Can publish content to production',
            category: 'Content Management',
            granted: role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'admin' || role === 'super_admin' || role === 'editor',
            icon: DocumentTextIcon
          }
        ]
      },
      {
        name: 'System Settings',
        icon: CogIcon,
        permissions: [
          {
            id: 'settings.view',
            name: 'View Settings',
            description: 'Can view system settings',
            category: 'System Settings',
            granted: role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'admin' || role === 'super_admin',
            icon: CogIcon
          },
          {
            id: 'settings.edit',
            name: 'Edit Settings',
            description: 'Can modify system settings',
            category: 'System Settings',
            granted: role === 'SUPER_ADMIN' || role === 'super_admin',
            icon: CogIcon
          },
          {
            id: 'settings.security',
            name: 'Security Settings',
            description: 'Can manage security configurations',
            category: 'System Settings',
            granted: role === 'SUPER_ADMIN' || role === 'super_admin',
            icon: ShieldCheckIcon
          }
        ]
      },
      {
        name: 'Analytics & Reports',
        icon: ChartBarIcon,
        permissions: [
          {
            id: 'analytics.view',
            name: 'View Analytics',
            description: 'Can view analytics dashboards',
            category: 'Analytics & Reports',
            granted: true,
            icon: ChartBarIcon
          },
          {
            id: 'analytics.export',
            name: 'Export Reports',
            description: 'Can export analytics data',
            category: 'Analytics & Reports',
            granted: role !== 'viewer' && role !== 'VIEWER',
            icon: ChartBarIcon
          },
          {
            id: 'analytics.admin',
            name: 'Admin Analytics',
            description: 'Can view sensitive analytics data',
            category: 'Analytics & Reports',
            granted: role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'admin' || role === 'super_admin',
            icon: ChartBarIcon
          }
        ]
      },
      {
        name: 'API Access',
        icon: CubeIcon,
        permissions: [
          {
            id: 'api.read',
            name: 'API Read Access',
            description: 'Can read data via API',
            category: 'API Access',
            granted: true,
            icon: CubeIcon
          },
          {
            id: 'api.write',
            name: 'API Write Access',
            description: 'Can create/update data via API',
            category: 'API Access',
            granted: role !== 'viewer' && role !== 'VIEWER',
            icon: CubeIcon
          },
          {
            id: 'api.admin',
            name: 'API Admin Access',
            description: 'Full API access including destructive operations',
            category: 'API Access',
            granted: role === 'SUPER_ADMIN' || role === 'super_admin',
            icon: CubeIcon
          }
        ]
      }
    ];

    return basePermissions;
  };

  const permissionCategories = getPermissionsForRole(user.role);

  // Filter permissions based on search term
  const filteredCategories = permissionCategories.map(category => ({
    ...category,
    permissions: category.permissions.filter(permission =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.permissions.length > 0);

  const totalPermissions = permissionCategories.reduce(
    (acc, cat) => acc + cat.permissions.length,
    0
  );

  const grantedPermissions = permissionCategories.reduce(
    (acc, cat) => acc + cat.permissions.filter(p => p.granted).length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Permissions Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Role: {user.role}</h3>
            <p className="text-sm text-gray-500">
              {grantedPermissions} of {totalPermissions} permissions granted
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round((grantedPermissions / totalPermissions) * 100)}%
            </div>
            <p className="text-xs text-gray-500">Access Level</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${(grantedPermissions / totalPermissions) * 100}%` }}
          />
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Permissions List */}
      <div className="space-y-6">
        {filteredCategories.map((category) => (
          <div key={category.name} className="bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <category.icon className="h-5 w-5 text-gray-500 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                <span className="ml-2 text-xs text-gray-500">
                  ({category.permissions.filter(p => p.granted).length}/{category.permissions.length})
                </span>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {category.permissions.map((permission) => (
                <li key={permission.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        {permission.granted ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {permission.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {permission.granted ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <LockOpenIcon className="h-3 w-3 mr-1" />
                          Granted
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <LockClosedIcon className="h-3 w-3 mr-1" />
                          Denied
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No permissions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No permissions match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}