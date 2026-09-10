import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 flex flex-col items-center justify-center px-6 text-center transition-colors">
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 mb-3">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
        The stay or page you are looking for does not exist, or the link may have expired.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 px-6 py-2.5 text-sm font-semibold shadow-md transition-all"
      >
        Browse stays
      </Link>
    </div>
  );
}
