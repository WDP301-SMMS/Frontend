import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine Tailwind classes with conditional logic and conflict resolution.
 * @param  {...any} inputs - Class names, conditionals, arrays, etc.
 * @returns {string} - Final merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}
