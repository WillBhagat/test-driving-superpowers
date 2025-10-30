import MessageForm from '@/components/MessageForm';

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900 dark:from-black dark:via-zinc-900 dark:to-black dark:text-zinc-100">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-24 sm:px-12">
        <div className="max-w-2xl mx-auto w-full">
          <span className="w-fit rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm tracking-wide text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            Message Recording
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Share Your Message
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Record your name and a message to be stored in our database. Your message must be at least 5 words long.
          </p>
        </div>

        <MessageForm />
      </main>
    </div>
  );
}
