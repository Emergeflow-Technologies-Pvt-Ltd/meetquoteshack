import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getStatusColors = (status: string) => {
  const colors = {
    VERIFIED: "bg-green-100 text-green-800 border-green-300",
    REJECTED: "bg-red-100 text-red-800 border-red-300",
    PROCESSING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    PROGRESSING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    APPROVED: "bg-green-100 text-green-800 border-green-300",
    UPLOADED: "bg-blue-100 text-blue-800 border-blue-300",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    default: "bg-gray-100 text-gray-800 border-gray-300",
  };
  return colors[status as keyof typeof colors] || colors.default;
};

export const convertEnumValueToLabel = (value: string) => {
  return value.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
};
