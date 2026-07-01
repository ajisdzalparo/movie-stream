export function Roadmap() {
  const phases = [
    {
      phase: "Current",
      title: "Validation",
      description: "Landing page and market research",
      status: "active" as const,
    },
    {
      phase: "Phase 1",
      title: "Test Case Generator",
      description: "Core AI generation from user stories",
      status: "upcoming" as const,
    },
    {
      phase: "Phase 2",
      title: "Acceptance Criteria Generator",
      description: "Auto-generate AC from requirements",
      status: "upcoming" as const,
    },
    {
      phase: "Phase 3",
      title: "Playwright Generator",
      description: "Generate automation scripts directly",
      status: "upcoming" as const,
    },
    {
      phase: "Phase 4",
      title: "URL Scanner",
      description: "Scan pages and suggest test scenarios",
      status: "upcoming" as const,
    },
    {
      phase: "Phase 5",
      title: "Figma Integration",
      description: "Generate tests from design files",
      status: "upcoming" as const,
    },
  ]

  return (
    <section className="bg-surface-base py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-surface-strong">
            What&apos;s Next
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-tertiary md:text-4xl">
            Product Roadmap
          </h2>
          <p className="mt-4 text-lg text-text-inverse">
            We&apos;re building QA Copilot step by step. Here&apos;s our plan.
          </p>
        </div>

        <div className="relative mt-14">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-linear-to-b from-surface-strong via-border-default/30 to-transparent md:left-1/2" />

          <div className="space-y-8">
            {phases.map((p, i) => (
              <div
                key={p.phase}
                className={`relative flex items-start gap-6 md:gap-12 ${
                  i % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse md:text-right"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                  <div
                    className={`h-3 w-3 rounded-full border-2 ${
                      p.status === "active"
                        ? "border-surface-strong bg-surface-strong shadow-lg shadow-surface-strong/40"
                        : "border-border-default/40 bg-surface-card"
                    }`}
                  />
                </div>

                {/* Content */}
                <div
                  className={`ml-10 md:ml-0 md:w-[calc(50%-32px)] ${
                    i % 2 === 0
                      ? "md:pr-8"
                      : "md:pl-8 md:ml-auto"
                  }`}
                >
                  <div
                    className={`rounded-md border p-4 transition-all duration-fast ${
                      p.status === "active"
                        ? "border-surface-strong/40 bg-surface-strong/10"
                        : "border-border-default/20 bg-surface-card hover:border-border-default/40"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${
                        p.status === "active"
                          ? "text-surface-strong"
                          : "text-text-inverse/60"
                      }`}
                    >
                      {p.phase}
                    </span>
                    <h3 className="mt-1 text-base font-semibold text-text-tertiary">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-inverse">
                      {p.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
