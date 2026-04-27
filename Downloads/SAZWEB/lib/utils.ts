<<<<<<< HEAD
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
=======
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
>>>>>>> 733e160 (Initial commit - Mobile Santiago Portal)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
