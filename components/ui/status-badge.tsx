import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { CandidateStatus } from "@/shared/types";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        active:
          "border-transparent bg-green-100 text-green-800 [a&]:hover:bg-green-200",
        in_date:
          "border-transparent bg-purple-100 text-purple-800 [a&]:hover:bg-purple-200",
        found_match:
          "border-transparent bg-emerald-100 text-emerald-800 [a&]:hover:bg-emerald-200",
        on_hold:
          "border-transparent bg-gray-200 text-gray-700 [a&]:hover:bg-gray-300",
      } satisfies Record<CandidateStatus, string>,
    },
    defaultVariants: {
      variant: "active",
    },
  }
);

function StatusBadge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof statusBadgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { StatusBadge, statusBadgeVariants };
