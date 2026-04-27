<<<<<<< HEAD
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
=======
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

function ItemGroup({ className, ...props }: React.ComponentProps<'div'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      role="list"
      data-slot="item-group"
<<<<<<< HEAD
      className={cn("group/item-group flex flex-col", className)}
=======
      className={cn('group/item-group flex flex-col', className)}
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
<<<<<<< HEAD
      className={cn("my-0", className)}
=======
      className={cn('my-0', className)}
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      {...props}
    />
  )
}

const itemVariants = cva(
<<<<<<< HEAD
  "group/item [a]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 [a]:transition-colors flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-colors duration-100 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border",
        muted: "bg-muted/50",
      },
      size: {
        default: "gap-4 p-4 ",
        sm: "gap-2.5 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
=======
  'group/item flex items-center border border-transparent text-sm rounded-md transition-colors [a&]:hover:bg-accent/50 [a&]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border-border',
        muted: 'bg-muted/50',
      },
      size: {
        default: 'p-4 gap-4 ',
        sm: 'py-3 px-4 gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
)

function Item({
  className,
<<<<<<< HEAD
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div"
=======
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
<<<<<<< HEAD
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted size-8 rounded-sm border [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
=======
  'flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none group-has-[[data-slot=item-description]]/item:translate-y-0.5',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "size-8 border rounded-sm bg-muted [&_svg:not([class*='size-'])]:size-4",
        image:
          'size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
)

function ItemMedia({
  className,
<<<<<<< HEAD
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
=======
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof itemMediaVariants>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

<<<<<<< HEAD
function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
=======
function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="item-content"
      className={cn(
<<<<<<< HEAD
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        className
=======
        'flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
=======
function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="item-title"
      className={cn(
<<<<<<< HEAD
        "flex w-fit items-center gap-2 text-sm font-medium leading-snug",
        className
=======
        'flex w-fit items-center gap-2 text-sm leading-snug font-medium',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
=======
function ItemDescription({ className, ...props }: React.ComponentProps<'p'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <p
      data-slot="item-description"
      className={cn(
<<<<<<< HEAD
        "text-muted-foreground line-clamp-2 text-balance text-sm font-normal leading-normal",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
=======
        'text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance',
        '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
=======
function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-actions"
      className={cn('flex items-center gap-2', className)}
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      {...props}
    />
  )
}

<<<<<<< HEAD
function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
=======
function ItemHeader({ className, ...props }: React.ComponentProps<'div'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="item-header"
      className={cn(
<<<<<<< HEAD
        "flex basis-full items-center justify-between gap-2",
        className
=======
        'flex basis-full items-center justify-between gap-2',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
=======
function ItemFooter({ className, ...props }: React.ComponentProps<'div'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="item-footer"
      className={cn(
<<<<<<< HEAD
        "flex basis-full items-center justify-between gap-2",
        className
=======
        'flex basis-full items-center justify-between gap-2',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
