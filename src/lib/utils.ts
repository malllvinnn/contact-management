import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function errorHookResponse(error: Error) {
  if (axios.isAxiosError(error)) {

    const responseData = error.response?.data;
    let errorMessage = responseData?.message || "Terjadi kesalahan pada server";

    if (responseData?.errors && responseData.errors.length > 0) {
      errorMessage = "Data tidak valid, silakan periksa kembali isian Anda.";
    }

    toast.error(errorMessage);
  } else if (error instanceof Error) {

    toast.error(error.message);
  } else {

    toast.error("Terjadi kesalahan yang tidak diketahui");
  }
}
