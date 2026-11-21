import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productClassificationService } from "../services/productClassification.service";
import { IGenericErrorResponse } from "../types/common/common";
import {
  ICreateProductClassificationBody,
  IProductClassification,
  IProductClassificationMeta,
  IProductClassificationQuery,
  IUpdateProductClassificationBody,
  ProductClassificationLevel,
} from "../types/ecommerce/productClassification";
import { useGet } from "./useGet";

/** Root key — invalidating it refreshes every list and by-level option set. */
export const PRODUCT_CLASSIFICATIONS_QUERY_KEY = "product-classifications";

export const productClassificationByLevelKey = (
  level: ProductClassificationLevel | null
) => [PRODUCT_CLASSIFICATIONS_QUERY_KEY, "by-level", level ?? "none"];

/**
 * GET /product-classifications?level=<LEVEL>&search=&page=&size=
 * Same endpoint for every hierarchy level — only `level` changes.
 */
export const useProductClassifications = ({
  level,
  search,
  page = 1,
  size = 20,
}: IProductClassificationQuery) => {
  const query = useGet<IProductClassification[]>(
    "/product-classifications",
    [PRODUCT_CLASSIFICATIONS_QUERY_KEY, level],
    {
      level,
      search: search?.trim(),
      page,
      size: size > 0 ? size : undefined,
    }
  );

  const meta = query.data?.meta as unknown as
    | IProductClassificationMeta
    | undefined;

  return {
    ...query,
    items: query.data?.data ?? [],
    meta,
    totalRecords: meta?.totalRecords ?? 0,
  };
};

/** GET /product-classifications/by-level/{level} — options for parent select. */
export const useProductClassificationsByLevel = (
  level: ProductClassificationLevel | null,
  enabled = true
) =>
  useQuery<IProductClassification[], IGenericErrorResponse>({
    queryKey: productClassificationByLevelKey(level),
    queryFn: () =>
      productClassificationService.getByLevel(
        level as ProductClassificationLevel
      ),
    enabled: enabled && !!level,
    retry: false,
  });

/** Refetch every classification list and by-level option set. */
export const useInvalidateProductClassifications = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: [PRODUCT_CLASSIFICATIONS_QUERY_KEY],
    });
};

/** POST /product-classifications — refetches lists + parent options on success. */
export const useCreateProductClassification = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof productClassificationService.create>>,
    IGenericErrorResponse,
    ICreateProductClassificationBody
  >({
    mutationFn: productClassificationService.create,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_CLASSIFICATIONS_QUERY_KEY],
      }),
  });
};

/** PATCH /product-classifications/{id} — refetches lists + parent options. */
export const useUpdateProductClassification = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof productClassificationService.update>>,
    IGenericErrorResponse,
    { id: string; body: IUpdateProductClassificationBody }
  >({
    mutationFn: productClassificationService.update,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_CLASSIFICATIONS_QUERY_KEY],
      }),
  });
};

/** DELETE /product-classifications/{id} — refetches lists + parent options. */
export const useDeleteProductClassification = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof productClassificationService.remove>>,
    IGenericErrorResponse,
    string
  >({
    mutationFn: productClassificationService.remove,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_CLASSIFICATIONS_QUERY_KEY],
      }),
  });
};
