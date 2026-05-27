import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function printElementById(id: string) {
  if (typeof window === 'undefined') return

  const element = document.getElementById(id)
  if (!element) return

  const nodes: HTMLElement[] = []
  let current: HTMLElement | null = element

  while (current) {
    nodes.push(current)
    if (current.tagName === 'BODY') break
    current = current.parentElement
  }

  nodes.forEach((node) => node.classList.add('print-only'))

  const cleanup = () => {
    nodes.forEach((node) => node.classList.remove('print-only'))
    window.removeEventListener('afterprint', cleanup)
  }

  window.addEventListener('afterprint', cleanup)
  window.print()
}
