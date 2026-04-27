<<<<<<< HEAD
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
=======
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="empty"
      className={cn(
<<<<<<< HEAD
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12",
        className
=======
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
=======
function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="empty-header"
      className={cn(
<<<<<<< HEAD
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
=======
        'flex max-w-sm flex-col items-center gap-2 text-center',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
<<<<<<< HEAD
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
=======
  'flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
<<<<<<< HEAD
      variant: "default",
    },
  }
=======
      variant: 'default',
    },
  },
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
)

function EmptyMedia({
  className,
<<<<<<< HEAD
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
=======
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

<<<<<<< HEAD
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
=======
function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-title"
      className={cn('text-lg font-medium tracking-tight', className)}
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      {...props}
    />
  )
}

<<<<<<< HEAD
function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
=======
function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="empty-description"
      className={cn(
<<<<<<< HEAD
        "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
        className
=======
        'text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
=======
function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="empty-content"
      className={cn(
<<<<<<< HEAD
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
        className
=======
        'flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
