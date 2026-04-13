export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Student Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Welcome to your learning portal.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
            Student Mode
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards for student progress */}
        <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
          <dt className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">Courses Enrolled</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">4</dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
          <dt className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">Assignments Due</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">2</dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
          <dt className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">Overall Grade</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">A-</dd>
        </div>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
         <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Your Recent Activity</h2>
         <div className="space-y-4">
           {/* Activity list placeholder */}
           <div className="p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Science: Chapter 4 Quiz</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Completed on Oct 24, Score: 92%</p>
           </div>
           <div className="p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Mathematics: Algebra Assignment</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Submitted on Oct 22, Pending Grading</p>
           </div>
         </div>
      </div>
    </div>
  );
}
