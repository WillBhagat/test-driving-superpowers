const features = [
  {
    title: "Telemetry-first workflows",
    description:
      "Instrument every test drive with rich analytics so teams can translate vehicle telemetry into actionable insights.",
  },
  {
    title: "Progressive rollout",
    description:
      "Launch new driving modes gradually with safety guardrails that adapt to feedback in real time.",
  },
  {
    title: "Generative documentation",
    description:
      "Keep engineering playbooks synced with the latest experiments thanks to AI-authored summaries.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900 dark:from-black dark:via-zinc-900 dark:to-black dark:text-zinc-100">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-24 px-6 py-24 sm:px-12">
        <section className="flex max-w-3xl flex-col gap-8">
          <span className="w-fit rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm tracking-wide text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            Test Driving Superpowers
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Ship safer autonomous features with confident, data-backed test drives.
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            This Next.js starter gives your team the launchpad for telemetry dashboards, experiment oversight,
            and developer tooling so you can focus on unlocking the next breakthrough on the proving ground.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Next.js Docs
            </a>
            <code className="inline-flex items-center justify-center rounded-full border border-dashed border-zinc-300 bg-white px-6 py-3 text-sm font-mono text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              npm run dev
            </code>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="h-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h2 className="text-lg font-semibold tracking-tight">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-2xl font-semibold tracking-tight">Kickstart your first telemetry dashboard</h2>
          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Start by editing <span className="font-mono">src/app/page.tsx</span> and follow the prompts from <span className="font-mono">npm run dev</span>
            to preview changes instantly. Tailwind CSS is already configured, so crafting responsive UI blocks is a breeze.
          </p>
        </section>
      </main>
    </div>
  );
}
