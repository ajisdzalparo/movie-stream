import * as React from "react"
import NextLink from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const linkVariants = cva(
  "transition-colors duration-instant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface-strong rounded-sm",
  {
    variants: {
      variant: {
        inline:
          "inline text-surface-strong underline underline-offset-4 hover:text-surface-strong/80",
        standalone:
          "inline-flex items-center gap-1 text-text-primary font-medium hover:text-surface-strong hover:underline underline-offset-4",
        navigation:
          "inline-flex items-center gap-1 text-text-primary hover:text-surface-strong",
      },
    },
    defaultVariants: {
      variant: "inline",
    },
  }
)

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string
  external?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, href, external, children, ...props }, ref) => {
    const isExternal =
      external || (typeof href === "string" && href.startsWith("http"))

    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          className={cn(linkVariants({ variant }), className)}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      )
    }

    return (
      <NextLink
        ref={ref}
        href={href}
        className={cn(linkVariants({ variant }), className)}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
)
Link.displayName = "Link"

export { Link, linkVariants }
