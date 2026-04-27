<<<<<<< HEAD
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
=======
import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
<<<<<<< HEAD
      className={cn("size-4 animate-spin", className)}
=======
      className={cn('size-4 animate-spin', className)}
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)
      {...props}
    />
  )
}

export { Spinner }
