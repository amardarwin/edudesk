import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950 font-sans min-h-screen">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center py-20 px-6 sm:px-16 text-center">
        
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 pb-2">
          AmaЯEduDesk Science
        </h1>
        
        <p className="max-w-2xl text-xl leading-8 text-zinc-600 dark:text-zinc-400 mb-10">
          Your modern learning portal. Log in to explore interactive lessons, track your progress, and excel in science.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row w-full max-w-md justify-center">
          <Link
            href="/login"
            className="flex h-14 w-full items-center justify-center font-semibold rounded-xl bg-blue-600 px-8 text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 active:scale-95"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="flex h-14 w-full items-center justify-center font-semibold rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-8 text-zinc-900 dark:text-zinc-100 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95"
          >
            Create account
          </Link>
        </div>
      </main>
    </div>
  );
}
