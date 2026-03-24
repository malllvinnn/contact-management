import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401 || error.response?.status === 404) return false;
                }

                return failureCount < 2;
            }
        }
    }
});