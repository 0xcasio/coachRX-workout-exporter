import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center border px-3 py-1 text-xs font-medium rounded-full w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive transition-all overflow-hidden backdrop-blur-md",
  {
    variants: {
      variant: {
        default:
          "border-white/20 bg-primary/30 text-primary [a&]:hover:bg-primary/40",
        secondary:
          "border-white/10 bg-secondary/30 text-secondary-foreground [a&]:hover:bg-secondary/50",
        destructive:
          "border-white/20 bg-destructive/30 text-destructive [a&]:hover:bg-destructive/40",
        outline:
          "border-white/10 text-foreground bg-background/40 [a&]:hover:bg-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
