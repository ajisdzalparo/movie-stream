"use client"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePostHog } from "posthog-js/react"

export function InterviewCta() {
  const posthog = usePostHog()

  return (
    <section id="interview" className="bg-surface-base py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="rounded-lg border border-border-default/20 bg-linear-to-b from-surface-card to-surface-base p-10 md:p-16">
          <span className="text-sm font-medium uppercase tracking-wider text-surface-strong">
            Shape The Product
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-tertiary md:text-4xl">
            Help shape QA Copilot
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-text-inverse">
            We&apos;re looking for QA Engineers willing to join a short product
            research interview. Your insights will directly influence what we
            build.
          </p>
          <div className="mt-8">
            <a
              href="mailto:hello@qacopilot.com?subject=QA Copilot Interview Request"
              onClick={() => posthog?.capture("interview_request", { location: "cta" })}
              className={cn(
                buttonVariants({ variant: "primary", size: "default" })
              )}
            >
              Book Interview
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
