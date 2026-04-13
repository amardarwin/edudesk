export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-10 rounded-2xl shadow-xl shadow-zinc-200 dark:shadow-none border border-gray-100 dark:border-zinc-800">
        {children}
      </div>
    </div>
  );
}
