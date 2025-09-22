export default function UserDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse"></div>
                    <div>
                      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="bg-white shadow rounded-lg">
            <div className="border-b border-gray-200">
              <div className="px-4 sm:px-6">
                <nav className="-mb-px flex space-x-8">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="py-4 px-1">
                      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}