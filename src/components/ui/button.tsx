import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border font-sans text-sm font-medium whitespace-nowrap transition-all duration-instant outline-none select-none disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface-strong [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 gap-2",
  {
    variants: {
      variant: {
        primary:
          "bg-surface-strong text-text-primary border-transparent hover:opacity-90",
        secondary:
          "bg-surface-raised text-text-primary border-border-default hover:bg-surface-base hover:text-white",
        ghost:
          "bg-transparent text-text-primary border-transparent hover:bg-surface-raised hover:border-border-default",
      },
      size: {
        default: "px-6 py-4 rounded-sm",
        sm: "px-4 py-2 min-h-9 rounded-xs",
        icon: "size-11 rounded-sm px-0 py-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
