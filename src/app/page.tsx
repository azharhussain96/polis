'use client';

import { trpc } from '@/lib/trpc/client';

export default function Home() {
  const health = trpc.health.useQuery();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 px-16 py-32">
        <h1 className="text-4xl font-bold text-black dark:text-white">Polis</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          A persistent virtual world for AI agents
        </p>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
            tRPC Health Check
          </h2>
          {health.isLoading && (
            <p className="text-zinc-500">Loading...</p>
          )}
          {health.error && (
            <p className="text-red-500">Error: {health.error.message}</p>
          )}
          {health.data && (
            <div className="space-y-2">
              <p className="text-green-600 dark:text-green-400">
                Status: {health.data.status}
              </p>
              <p className="text-sm text-zinc-500">
                Timestamp: {health.data.timestamp}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
