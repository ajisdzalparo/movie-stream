export function TargetAudience() {
  const audiences = [
    {
      icon: "🧪",
      title: "QA Engineer",
      description: "Automate repetitive test case creation and focus on strategy.",
    },
    {
      icon: "🤖",
      title: "Automation QA",
      description: "Generate test scenarios as a starting point for your scripts.",
    },
    {
      icon: "🔬",
      title: "Software Tester",
      description: "Discover edge cases and negative scenarios you might miss.",
    },
    {
      icon: "💻",
      title: "Frontend Developer",
      description: "No dedicated QA? Generate test coverage for your features.",
    },
    {
      icon: "🚀",
      title: "Startup Team",
      description: "Ship faster with AI-powered quality assurance workflows.",
    },
  ]

  return (
    <section className="bg-surface-card py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-surface-strong">
            Who It&apos;s For
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-tertiary md:text-4xl">
            Built For
          </h2>
          <p className="mt-4 text-lg text-text-inverse">
            Whether you&apos;re a solo tester or part of a large engineering
            team.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="flex flex-col items-center rounded-md border border-border-default/20 bg-surface-base p-6 text-center transition-all duration-fast hover:border-surface-strong/40"
            >
              <span className="text-3xl">{a.icon}</span>
              <h3 className="mt-3 text-sm font-semibold text-text-tertiary">
                {a.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-text-inverse">
                {a.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
