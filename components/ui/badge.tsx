import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border-0 px-2 py-1 text-xs font-normal w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-[#F7F6F3] text-[#37352F] [a&]:hover:bg-[#ECECEA]",
        secondary:
          "bg-[#F7F6F3] text-[#37352F] [a&]:hover:bg-[#ECECEA]",
        destructive:
          "bg-[#FBE4E4] text-[#991B1B] [a&]:hover:bg-[#FCD5D5]",
        outline:
          "border border-[#E3E2E0] text-[#37352F] [a&]:hover:bg-[#F7F6F3]",
        green:
          "bg-[#DBEDDB] text-[#2d6a3e] [a&]:hover:bg-[#C6E6C6]",
        blue:
          "bg-[#D3E5EF] text-[#1e5a7d] [a&]:hover:bg-[#BDD9E9]",
        yellow:
          "bg-[#FBF3DB] text-[#7d6a2d] [a&]:hover:bg-[#F8ECBC]",
        orange:
          "bg-[#FDEBD0] text-[#8b5a1f] [a&]:hover:bg-[#FBE0B3]",
        purple:
          "bg-[#E8DEEE] text-[#6d3a7f] [a&]:hover:bg-[#DFC9EA]",
        red:
          "bg-[#FBE4E4] text-[#991B1B] [a&]:hover:bg-[#FCD5D5]",
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
