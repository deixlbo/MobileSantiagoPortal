<<<<<<< HEAD
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
=======
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const buttonGroupVariants = cva(
  "flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2",
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  {
    variants: {
      orientation: {
        horizontal:
<<<<<<< HEAD
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
=======
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
)

function ButtonGroup({
  className,
  orientation,
  ...props
<<<<<<< HEAD
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
=======
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
<<<<<<< HEAD
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "div"
=======
}: React.ComponentProps<'div'> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : 'div'
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)

  return (
    <Comp
      className={cn(
<<<<<<< HEAD
        "bg-muted shadow-xs flex items-center gap-2 rounded-md border px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
=======
        "bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
<<<<<<< HEAD
  orientation = "vertical",
=======
  orientation = 'vertical',
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
<<<<<<< HEAD
        "bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto",
        className
=======
        'bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
