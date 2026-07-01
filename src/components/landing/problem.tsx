export function Problem() {
  const painPoints = [
    {
      icon: "📝",
      title: "Positive test cases",
      description: "Writing the same login, signup, CRUD scenarios over and over.",
    },
    {
      icon: "❌",
      title: "Negative test cases",
      description: "Manually thinking through every invalid input and error state.",
    },
    {
      icon: "🔍",
      title: "Edge cases",
      description: "Spending hours brainstorming boundary conditions and race scenarios.",
    },
    {
      icon: "✅",
      title: "Acceptance criteria",
      description: "Translating vague user stories into testable requirements.",
    },
  ]

  return (
    <section id="features" className="bg-surface-base py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-surface-strong">
            The Problem
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-tertiary md:text-4xl">
            Writing Test Cases Is Repetitive
          </h2>
          <p className="mt-4 text-lg text-text-inverse">
            QA Engineers spend hours creating the same types of test artifacts.
            Most of this work is repetitive and manual.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="group rounded-md border border-border-default/20 bg-surface-card p-6 transition-all duration-fast hover:border-surface-strong/40 hover:bg-surface-muted"
            >
              <span className="text-2xl">{point.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-text-tertiary">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-inverse">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
