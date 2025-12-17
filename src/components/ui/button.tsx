import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary/90 backdrop-blur-md text-primary-foreground border border-white/20 hover:bg-primary hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]",
        destructive:
          "bg-destructive/90 backdrop-blur-md text-white border border-white/20 hover:bg-destructive hover:shadow-xl hover:shadow-destructive/30 active:scale-[0.98]",
        outline:
          "border border-white/10 bg-background/40 backdrop-blur-md hover:bg-white/10 hover:border-white/20 active:scale-[0.98]",
        secondary:
          "bg-secondary/60 backdrop-blur-md text-secondary-foreground border border-white/10 hover:bg-secondary/80 hover:border-white/20 active:scale-[0.98]",
        ghost:
          "border-transparent hover:bg-white/10 active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-4 has-[>svg]:px-3 text-xs",
        lg: "h-12 px-8 has-[>svg]:px-6 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
