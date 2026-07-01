"use client"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePostHog } from "posthog-js/react"
import { useEffect } from "react"

export function Hero() {
  const posthog = usePostHog()

  useEffect(() => {
    posthog?.capture("landing_page_view")
  }, [posthog])

  return (
    <section className="relative overflow-hidden bg-surface-base pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-surface-strong/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex self-center lg:self-start">
              <span className="rounded-full border border-surface-strong/30 bg-surface-strong/10 px-4 py-1.5 text-xs font-medium text-surface-strong">
                AI-Powered QA Assistant
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-tertiary md:text-5xl lg:text-6xl">
              Generate Test Cases{" "}
              <span className="text-surface-strong">in Seconds,</span>
              <br />
              Not Hours
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-text-inverse self-center lg:self-start">
              AI Copilot for QA Engineers. Generate positive test cases, negative
              scenarios, edge cases, and acceptance criteria directly from user
              stories.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 self-center lg:self-start">
              <a
                href="#waitlist"
                onClick={() => posthog?.capture("join_waitlist_click", { location: "hero" })}
                className={cn(
                  buttonVariants({ variant: "primary", size: "default" })
                )}
              >
                Join Waitlist
              </a>
              <a
                href="#interview"
                onClick={() => posthog?.capture("interview_request", { location: "hero" })}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "default" })
                )}
              >
                Request Early Access
              </a>
            </div>
          </div>

          {/* Right: Static Dashboard Mockup */}
          <div className="rounded-lg border border-border-default/30 bg-surface-card p-1 shadow-2xl shadow-surface-strong/5">
            <div className="rounded-md bg-surface-base">
              {/* Mockup Top Bar */}
              <div className="flex items-center gap-2 border-b border-border-default/20 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs text-text-inverse/60">
                  QA Copilot Dashboard
                </span>
              </div>

              <div className="grid md:grid-cols-2 divide-x divide-border-default/20">
                {/* Left Panel: User Story Input */}
                <div className="p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-inverse/60">
                    User Story Input
                  </p>
                  <div className="rounded-md border border-border-default/20 bg-surface-muted/50 p-3">
                    <p className="text-sm text-text-tertiary/90 font-mono">
                      As a user,
                      <br />I can login using email and password,
                      <br />
                      so that I can access my dashboard.
                    </p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <div className="rounded-sm bg-surface-strong px-3 py-1.5 text-xs font-medium text-surface-base">
                      Generate →
                    </div>
                  </div>
                </div>

                {/* Right Panel: Generated Results */}
                <div className="p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-inverse/60">
                    Generated Results
                  </p>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Positive Cases",
                        color: "text-green-400",
                        items: ["Login with valid credentials"],
                      },
                      {
                        label: "Negative Cases",
                        color: "text-red-400",
                        items: [
                          "Empty email",
                          "Empty password",
                          "Invalid password",
                        ],
                      },
                      {
                        label: "Edge Cases",
                        color: "text-yellow-400",
                        items: ["Max length email", "Special characters"],
                      },
                      {
                        label: "Acceptance Criteria",
                        color: "text-blue-400",
                        items: [
                          "User redirected to dashboard",
                          "Error displayed on invalid credentials",
                        ],
                      },
                    ].map((group) => (
                      <div key={group.label}>
                        <p
                          className={`text-xs font-semibold ${group.color} mb-1`}
                        >
                          {group.label}
                        </p>
                        <ul className="space-y-0.5">
                          {group.items.map((item) => (
                            <li
                              key={item}
                              className="text-xs text-text-tertiary/70"
                            >
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
