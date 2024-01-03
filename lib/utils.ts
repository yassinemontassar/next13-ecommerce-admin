import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat('en-TN', {
  style: 'currency',
  currency: 'TND',
});

export const formatTND = (value: number) => {
  const formattedValue = formatter.format(value);
  const numericValue = formattedValue.replace(/[^\d.,]/g, '').trim();
  return `${numericValue} TND`;
};