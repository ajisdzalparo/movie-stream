export function ExampleOutput() {
  return (
    <section className="bg-surface-base py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-surface-strong">
            See It In Action
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-tertiary md:text-4xl">
            Example Output
          </h2>
          <p className="mt-4 text-lg text-text-inverse">
            Here&apos;s what QA Copilot generates from a simple user story.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          {/* Input */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 rounded-md border border-border-default/20 bg-surface-card p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-surface-strong">
                Input — User Story
              </p>
              <div className="mt-4 rounded-md border border-border-default/20 bg-surface-base p-4">
                <p className="font-mono text-sm leading-relaxed text-text-tertiary">
                  As a user,
                  <br />I can login using email and password.
                </p>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-6 lg:col-span-3">
            {/* Positive Cases */}
            <div className="rounded-md border border-green-500/20 bg-surface-card p-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <p className="text-sm font-semibold text-green-400">
                  Positive Cases
                </p>
              </div>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2 text-sm text-text-tertiary/80">
                  <span className="mt-1 text-green-400">✓</span>
                  Login with valid credentials
                </li>
              </ul>
            </div>

            {/* Negative Cases */}
            <div className="rounded-md border border-red-500/20 bg-surface-card p-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <p className="text-sm font-semibold text-red-400">
                  Negative Cases
                </p>
              </div>
              <ul className="mt-3 space-y-2">
                {["Empty Email", "Empty Password", "Invalid Password"].map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-text-tertiary/80"
                    >
                      <span className="mt-1 text-red-400">✗</span>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Edge Cases */}
            <div className="rounded-md border border-yellow-500/20 bg-surface-card p-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-400" />
                <p className="text-sm font-semibold text-yellow-400">
                  Edge Cases
                </p>
              </div>
              <ul className="mt-3 space-y-2">
                {["Maximum Length Email", "Special Characters"].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-text-tertiary/80"
                  >
                    <span className="mt-1 text-yellow-400">⚠</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Acceptance Criteria */}
            <div className="rounded-md border border-blue-500/20 bg-surface-card p-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <p className="text-sm font-semibold text-blue-400">
                  Acceptance Criteria
                </p>
              </div>
              <ul className="mt-3 space-y-2">
                {[
                  "User redirected to dashboard",
                  "Error displayed when credentials are invalid",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-text-tertiary/80"
                  >
                    <span className="mt-1 text-blue-400">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
