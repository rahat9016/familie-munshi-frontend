import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../helpers/axios/axiosInstance";
import { IGenericErrorResponse, IListMeta } from "../types/common/common";

interface IPage<T> {
  data: T[];
  meta?: IListMeta;
}

/**
 * Infinite version of useGet for paginated list endpoints
 * (`?page=&size=` + `meta.currentPage/lastPage`). Empty params are dropped.
 */
export const useInfiniteGet = <T>(
  endpoint: string,
  queryKey: string[],
  params?: Record<string, unknown>,
  options?: { enabled?: boolean; size?: number }
) => {
  const size = Math.min(options?.size ?? 20, 100);
  const filtered = Object.fromEntries(
    Object.entries(params ?? {}).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null
    )
  );

  const query = useInfiniteQuery<
    IPage<T>,
    IGenericErrorResponse,
    { pages: IPage<T>[] },
    unknown[],
    number
  >({
    queryKey: [...queryKey, "infinite", filtered, size],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      (await axiosInstance.get(endpoint, {
        params: { ...filtered, page: pageParam, size },
      })) as unknown as IPage<T>,
    getNextPageParam: (last) =>
      last.meta && last.meta.currentPage < last.meta.lastPage
        ? last.meta.currentPage + 1
        : undefined,
    enabled: options?.enabled ?? true,
    retry: false,
  });

  const items = query.data?.pages.flatMap((p) => p.data ?? []) ?? [];
  const totalRecords = query.data?.pages[0]?.meta?.totalRecords ?? 0;

  return { ...query, items, totalRecords };
};
