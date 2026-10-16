import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva } from "class-variance-authority";
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-[0.625rem] font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-2.5!",
  {
    variants: {
      variant: {
        default:
          "bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary",
      
        secondary:
          "bg-teal-700 dark:bg-secondary/50 text-secondary-foreground border border-teal-200",
      
        success:
          "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/15 dark:text-emerald-300",
      
        warning:
          "border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/15 dark:text-amber-300",
      
        info:
          "border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/15 dark:text-sky-300",
      
        destructive:
          "border border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/20",
      
        archived:
          "border border-border bg-muted/10 text-muted/80 dark:bg-muted/40",
      
        outline:
          "border border-border bg-muted/10 text-foreground",
      
        ghost:
          "bg-transparent text-muted-foreground",
      
        link:
          "bg-transparent text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps({
      className: cn(badgeVariants({ variant }), className),
    }, props),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants }
