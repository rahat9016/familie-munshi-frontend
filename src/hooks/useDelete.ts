import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosInstance } from "../helpers/axios/axiosInstance";
import { IGenericErrorResponse } from "../types/common/common";

export const useDelete = <T>(
  onSuccess?: (data: T) => void,
  invalidateQueriesKeys?: Array<string[]>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { url: string }) => {
      return axiosInstance
        .delete(params.url)
        .then((response) => response.data as T);
    },
    onSuccess: (data) => {
      if (invalidateQueriesKeys) {
        invalidateQueriesKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: IGenericErrorResponse) => {
      toast.error(error.message || "Failed to delete.");
      throw error;
    },
  });
};
