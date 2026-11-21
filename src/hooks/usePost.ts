import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { IGenericErrorResponse } from "../types/common/common";
import { axiosInstance } from "../helpers/axios/axiosInstance";

export interface PostArg {
  endpoint?: string;
  data?: FormData | Record<string, unknown>;
  config?: AxiosRequestConfig;
}

export const usePost = <T>(
  defaultEndpoint?: string,
  onSuccess?: (data: T) => void,
  invalidateQueriesKeys?: Array<string[]>
) => {
  const queryClient = useQueryClient();

  return useMutation<
    T,
    IGenericErrorResponse,
    PostArg | FormData | Record<string, unknown>
  >({
    mutationFn: (arg) => {
      let endpoint: string | undefined = defaultEndpoint;
      let data: FormData | Record<string, unknown> = arg as
        | FormData
        | Record<string, unknown>;
      let config: AxiosRequestConfig = {};

      if (typeof arg === "object" && "data" in arg) {
        const postArg = arg as PostArg;
        endpoint = postArg.endpoint ?? defaultEndpoint;
        data = postArg.data ?? {};
        config = postArg.config ?? {};
      }

      if (!endpoint) {
        throw new Error(
          "defaultEndpoint is required if endpoint is not provided"
        );
      }

      // Interceptor unwraps the envelope → `.data` is the payload.
      return axiosInstance
        .post(endpoint, data, config)
        .then((response) => response.data as T);
    },

    onSuccess: (data) => {
      invalidateQueriesKeys?.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );

      onSuccess?.(data);
    },

    onError: (error) => {
      console.error("POST error", error);
    },
  });
};
