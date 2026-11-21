import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { IGenericErrorResponse } from "../types/common/common";
import { axiosInstance } from "../helpers/axios/axiosInstance";

type PatchArg =
  | {
      url: string;
      data: Record<string, unknown> | FormData;
      config?: AxiosRequestConfig;
    }
  | FormData
  | Record<string, unknown>;

export const usePatch = <T>(
  onSuccess?: (data: T) => void,
  invalidateQueriesKeys?: Array<string[]>,
  defaultEndpoint?: string
) => {
  const queryClient = useQueryClient();

  const isPatchObject = (
    a: PatchArg
  ): a is {
    url: string;
    data: Record<string, unknown> | FormData;
    config?: AxiosRequestConfig;
  } => typeof a === "object" && a !== null && "url" in a;

  return useMutation<T, IGenericErrorResponse, PatchArg>({
    mutationFn: (arg) => {
      if (isPatchObject(arg)) {
        const { url, data, config } = arg;
        if (!url) throw new Error("Patch endpoint is required");
        return axiosInstance
          .patch(url, data, config)
          .then((response) => response.data as T);
      }

      const url = defaultEndpoint;
      if (!url) throw new Error("Patch endpoint is required");
      return axiosInstance
        .patch(url, arg as Record<string, unknown> | FormData)
        .then((response) => response.data as T);
    },

    onSuccess: (data) => {
      invalidateQueriesKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      onSuccess?.(data);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to update.");
      throw error;
    },
  });
};
