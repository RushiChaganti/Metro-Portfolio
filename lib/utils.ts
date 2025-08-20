// utils.ts or any shared file

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names intelligently with Tailwind support.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the correct image path with the base path prefix when needed
 * @param path The image path relative to the public directory
 * @returns The complete path including base path when in production
 */
export const getImagePath = (path: string) => {
  const basePath = process.env.NODE_ENV === 'production' ? '/Metro-Portfolio' : '';
  return `${basePath}${path}`;
};
