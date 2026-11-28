import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { IGenericErrorResponse } from "../types/common/common";
import { getApiErrorMessage } from "../utils/apiError";
import { axiosInstance } from "../helpers/axios/axiosInstance";

export interface PutArg {
  url: string;
  data: Record<string, unknown> | FormData;
  config?: AxiosRequestConfig;
}

export const usePut = <T>(
  onSuccess?: (data: T) => void,
  invalidateQueriesKeys?: Array<string[]>
) => {
  const queryClient = useQueryClient();

  return useMutation<T, IGenericErrorResponse, PutArg>({
    // Interceptor unwraps the envelope → `.data` is the payload.
    mutationFn: ({ url, data, config }) =>
      axiosInstance.put(url, data, config).then((res) => res.data as T),

    onSuccess: (data) => {
      invalidateQueriesKeys?.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );
      onSuccess?.(data);
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update."));
    },
  });
};
