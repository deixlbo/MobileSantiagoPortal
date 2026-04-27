<<<<<<< HEAD
"use client"

import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
=======
'use client'

import { useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
<<<<<<< HEAD
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
=======
        'flex flex-col gap-6',
        'has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
<<<<<<< HEAD
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
=======
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
<<<<<<< HEAD
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className
=======
        'mb-3 font-medium',
        'data-[variant=legend]:text-base',
        'data-[variant=label]:text-sm',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
=======
function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="field-group"
      className={cn(
<<<<<<< HEAD
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className
=======
        'group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
<<<<<<< HEAD
  "group/field data-[invalid=true]:text-destructive flex w-full gap-3",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px has-[>[data-slot=field-content]]:items-start",
        ],
        responsive: [
          "@md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto flex-col [&>*]:w-full [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
=======
  'group/field flex w-full gap-3 data-[invalid=true]:text-destructive',
  {
    variants: {
      orientation: {
        vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
        horizontal: [
          'flex-row items-center',
          '[&>[data-slot=field-label]]:flex-auto',
          'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        ],
        responsive: [
          'flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto',
          '@md/field-group:[&>[data-slot=field-label]]:flex-auto',
          '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
        ],
      },
    },
    defaultVariants: {
<<<<<<< HEAD
      orientation: "vertical",
    },
  }
=======
      orientation: 'vertical',
    },
  },
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
)

function Field({
  className,
<<<<<<< HEAD
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
=======
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

<<<<<<< HEAD
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
=======
function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="field-content"
      className={cn(
<<<<<<< HEAD
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        className
=======
        'group/field-content flex flex-1 flex-col gap-1.5 leading-snug',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
<<<<<<< HEAD
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>[data-slot=field]]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        className
=======
        'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4',
        'has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
=======
function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <div
      data-slot="field-label"
      className={cn(
<<<<<<< HEAD
        "flex w-fit items-center gap-2 text-sm font-medium leading-snug group-data-[disabled=true]/field:opacity-50",
        className
=======
        'flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

<<<<<<< HEAD
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
=======
function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <p
      data-slot="field-description"
      className={cn(
<<<<<<< HEAD
        "text-muted-foreground text-sm font-normal leading-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
=======
        'text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance',
        'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5',
        '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
<<<<<<< HEAD
}: React.ComponentProps<"div"> & {
=======
}: React.ComponentProps<'div'> & {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
<<<<<<< HEAD
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
=======
        'relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2',
        className,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
<<<<<<< HEAD
}: React.ComponentProps<"div"> & {
=======
}: React.ComponentProps<'div'> & {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors) {
      return null
    }

<<<<<<< HEAD
    if (errors?.length === 1 && errors[0]?.message) {
=======
    if (errors.length === 1 && errors[0]?.message) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      return errors[0].message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {errors.map(
          (error, index) =>
<<<<<<< HEAD
            error?.message && <li key={index}>{error.message}</li>
=======
            error?.message && <li key={index}>{error.message}</li>,
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
<<<<<<< HEAD
      className={cn("text-destructive text-sm font-normal", className)}
=======
      className={cn('text-destructive text-sm font-normal', className)}
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
