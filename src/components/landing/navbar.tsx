"use client"

import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { usePostHog } from "posthog-js/react"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#solution" },
  { label: "Join Waitlist", href: "#waitlist" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const posthog = usePostHog()

  const handleJoinClick = () => {
    posthog?.capture("join_waitlist_click", { location: "navbar" })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-default/30 bg-surface-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-text-tertiary">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-strong">
            <span className="text-sm font-bold text-surface-base">QA</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            QA Copilot
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              variant="navigation"
              className="text-text-tertiary/80 hover:text-surface-strong text-sm"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#waitlist"
            onClick={handleJoinClick}
            className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
          >
            Join Waitlist
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-text-tertiary transition-transform duration-instant ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-text-tertiary transition-opacity duration-instant ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-text-tertiary transition-transform duration-instant ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border-default/30 bg-surface-base px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                variant="navigation"
                className="text-text-tertiary/80 hover:text-surface-strong text-base"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#waitlist"
              onClick={() => {
                setMobileOpen(false)
                handleJoinClick()
              }}
              className={cn(
                buttonVariants({ variant: "primary", size: "default" })
              )}
            >
              Join Waitlist
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
