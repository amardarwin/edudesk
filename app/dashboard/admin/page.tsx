export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Overview of the main metrics and management tools.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-400/20">
            Administrator Mode
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards for admin quick stats */}
        <div className="overflow-hidden rounded-xl bg-gray-50 dark:bg-zinc-800/50 shadow-sm border border-gray-100 dark:border-zinc-700/50 p-6">
          <dt className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Users</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">1,429</dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-gray-50 dark:bg-zinc-800/50 shadow-sm border border-gray-100 dark:border-zinc-700/50 p-6">
          <dt className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Sessions</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">342</dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-gray-50 dark:bg-zinc-800/50 shadow-sm border border-gray-100 dark:border-zinc-700/50 p-6">
          <dt className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">System Status</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-green-600 dark:text-green-400">Healthy</dd>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700/50 p-6">
         <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Quick Actions</h2>
         <div className="space-y-4">
           {/* Actions list placeholder */}
           <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:shadow-md cursor-pointer transition-all">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Manage Users</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Add, remove, or modify user accounts and roles.</p>
           </div>
           <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:shadow-md cursor-pointer transition-all">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">System Logs</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Review activity, access logs, and error records.</p>
           </div>
         </div>
      </div>
    </div>
  );
}
