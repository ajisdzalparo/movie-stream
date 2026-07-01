"use client"

import { buttonVariants } from "@/components/ui/button"
import { useState } from "react"
import { submitWaitlist } from "@/app/actions/waitlist"
import { usePostHog } from "posthog-js/react"

const roleOptions = [
  "QA Engineer",
  "Automation QA",
  "Software Tester",
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Engineering Manager",
  "Other",
]

const workflowOptions = [
  "Manual",
  "ChatGPT",
  "Jira",
  "TestRail",
  "Other",
]

const problemOptions = [
  "Writing Test Cases",
  "Finding Edge Cases",
  "Writing Automation Scripts",
  "Bug Reporting",
  "Documentation",
]

export function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const posthog = usePostHog()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    const formData = new FormData(e.currentTarget)

    try {
      const result = await submitWaitlist(formData)
      if (result.success) {
        setStatus("success")
        posthog?.capture("waitlist_signup", {
          role: formData.get("role"),
          workflow: formData.get("workflow"),
          biggest_problem: formData.get("biggest_problem"),
        })
      } else {
        setErrorMsg(result.error || "Something went wrong")
        setStatus("error")
      }
    } catch {
      setErrorMsg("Network error. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <section id="waitlist" className="bg-surface-card py-20 md:py-28">
        <div className="mx-auto max-w-xl px-6 text-center">
          <div className="rounded-lg border border-surface-strong/30 bg-surface-strong/10 p-10">
            <span className="text-5xl">🎉</span>
            <h2 className="mt-4 text-2xl font-bold text-text-tertiary">
              You&apos;re on the list!
            </h2>
            <p className="mt-2 text-text-inverse">
              Thank you for joining the QA Copilot waitlist. We&apos;ll be in
              touch soon.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="waitlist" className="bg-surface-card py-20 md:py-28">
      <div className="mx-auto max-w-xl px-6">
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-surface-strong">
            Get Early Access
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-tertiary md:text-4xl">
            Join the Waitlist
          </h2>
          <p className="mt-4 text-lg text-text-inverse">
            Be the first to try QA Copilot when we launch. Help us shape the
            product.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="waitlist-name"
              className="mb-1.5 block text-sm font-medium text-text-tertiary"
            >
              Name <span className="text-surface-strong">*</span>
            </label>
            <input
              id="waitlist-name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="w-full rounded-sm border border-border-default/30 bg-surface-base px-4 py-3 text-sm text-text-tertiary placeholder:text-text-inverse/40 outline-none transition-colors duration-instant focus:border-surface-strong"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="waitlist-email"
              className="mb-1.5 block text-sm font-medium text-text-tertiary"
            >
              Email <span className="text-surface-strong">*</span>
            </label>
            <input
              id="waitlist-email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              className="w-full rounded-sm border border-border-default/30 bg-surface-base px-4 py-3 text-sm text-text-tertiary placeholder:text-text-inverse/40 outline-none transition-colors duration-instant focus:border-surface-strong"
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="waitlist-role"
              className="mb-1.5 block text-sm font-medium text-text-tertiary"
            >
              Role <span className="text-surface-strong">*</span>
            </label>
            <select
              id="waitlist-role"
              name="role"
              required
              className="w-full rounded-sm border border-border-default/30 bg-surface-base px-4 py-3 text-sm text-text-tertiary outline-none transition-colors duration-instant focus:border-surface-strong"
            >
              <option value="">Select your role</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Company */}
          <div>
            <label
              htmlFor="waitlist-company"
              className="mb-1.5 block text-sm font-medium text-text-tertiary"
            >
              Company
            </label>
            <input
              id="waitlist-company"
              name="company"
              type="text"
              placeholder="Your company (optional)"
              className="w-full rounded-sm border border-border-default/30 bg-surface-base px-4 py-3 text-sm text-text-tertiary placeholder:text-text-inverse/40 outline-none transition-colors duration-instant focus:border-surface-strong"
            />
          </div>

          {/* Question 1: Workflow */}
          <div>
            <label
              htmlFor="waitlist-workflow"
              className="mb-1.5 block text-sm font-medium text-text-tertiary"
            >
              How do you currently create test cases?
            </label>
            <select
              id="waitlist-workflow"
              name="workflow"
              className="w-full rounded-sm border border-border-default/30 bg-surface-base px-4 py-3 text-sm text-text-tertiary outline-none transition-colors duration-instant focus:border-surface-strong"
            >
              <option value="">Select an option</option>
              {workflowOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Question 2: Biggest Problem */}
          <div>
            <label
              htmlFor="waitlist-problem"
              className="mb-1.5 block text-sm font-medium text-text-tertiary"
            >
              What is the most time-consuming part of your QA workflow?
            </label>
            <select
              id="waitlist-problem"
              name="biggest_problem"
              className="w-full rounded-sm border border-border-default/30 bg-surface-base px-4 py-3 text-sm text-text-tertiary outline-none transition-colors duration-instant focus:border-surface-strong"
            >
              <option value="">Select an option</option>
              {problemOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {status === "error" && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className={buttonVariants({ variant: "primary", size: "default", className: "w-full" })}
          >
            {status === "loading" ? "Joining..." : "Join Waitlist"}
          </button>
        </form>
      </div>
    </section>
  )
}
