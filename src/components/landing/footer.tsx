export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border-default/20 bg-surface-base py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 text-text-tertiary">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-surface-strong">
              <span className="text-[10px] font-bold text-surface-base">QA</span>
            </div>
            <span className="text-sm font-semibold">QA Copilot</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-inverse">
            <a
              href="mailto:hello@qacopilot.com"
              className="transition-colors duration-instant hover:text-surface-strong"
            >
              hello@qacopilot.com
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-instant hover:text-surface-strong"
            >
              LinkedIn
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-text-inverse/60">
            © {currentYear} QA Copilot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
