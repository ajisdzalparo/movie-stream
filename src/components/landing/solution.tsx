export function Solution() {
  const steps = [
    {
      step: "01",
      title: "Paste User Story",
      description:
        "Paste your user story or feature requirement into QA Copilot.",
      icon: "📋",
    },
    {
      step: "02",
      title: "Generate",
      description:
        "AI instantly generates test cases, edge cases, and acceptance criteria.",
      icon: "⚡",
    },
    {
      step: "03",
      title: "Review",
      description:
        "Review and refine the generated output to match your standards.",
      icon: "👁️",
    },
    {
      step: "04",
      title: "Export",
      description:
        "Copy to clipboard or export directly to your project management tool.",
      icon: "📤",
    },
  ]

  return (
    <section id="solution" className="bg-surface-card py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-surface-strong">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-tertiary md:text-4xl">
            Meet QA Copilot
          </h2>
          <p className="mt-4 text-lg text-text-inverse">
            From user story to comprehensive test coverage in four simple steps.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.step} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-10 left-[calc(50%+32px)] hidden h-px w-[calc(100%-64px)] bg-linear-to-r from-surface-strong/40 to-surface-strong/10 lg:block" />
              )}

              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border-default/30 bg-surface-base text-2xl">
                {step.icon}
              </div>

              <span className="mt-4 text-xs font-bold uppercase tracking-widest text-surface-strong">
                Step {step.step}
              </span>

              <h3 className="mt-2 text-lg font-semibold text-text-tertiary">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-text-inverse">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
