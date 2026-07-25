import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-black text-sm font-bold uppercase tracking-widest cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:-translate-y-0.5 hover:shadow-brutal-sm",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-brutal",
        destructive: "bg-destructive text-destructive-foreground shadow-brutal",
        outline:
          "bg-background text-foreground shadow-brutal",
        secondary: "bg-secondary text-secondary-foreground shadow-brutal",
        ghost: "border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-black shadow-none active:translate-x-0 active:translate-y-0 hover:translate-y-0 hover:shadow-none",
        link: "border-transparent text-primary underline-offset-4 hover:underline shadow-none active:translate-x-0 active:translate-y-0 hover:translate-y-0 hover:shadow-none",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
