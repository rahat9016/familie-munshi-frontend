import { axiosInstance } from "../helpers/axios/axiosInstance";
import {
  ICreateProductClassificationBody,
  IProductClassification,
  IUpdateProductClassificationBody,
  ProductClassificationLevel,
} from "../types/ecommerce/productClassification";

// The axios response interceptor unwraps `{ success, message, data, meta }`
// into `{ data, meta, message }`.
interface IUnwrapped<T> {
  data: T;
  message?: string;
}

export const productClassificationService = {
  /** GET /product-classifications/by-level/{level} — flat list for selects. */
  getByLevel: async (
    level: ProductClassificationLevel
  ): Promise<IProductClassification[]> => {
    const res = (await axiosInstance.get(
      `/product-classifications/by-level/${level}`
    )) as unknown as IUnwrapped<IProductClassification[]>;
    return Array.isArray(res.data) ? res.data : [];
  },

  /** POST /product-classifications */
  create: async (
    body: ICreateProductClassificationBody
  ): Promise<IUnwrapped<IProductClassification>> => {
    return (await axiosInstance.post(
      "/product-classifications",
      body
    )) as unknown as IUnwrapped<IProductClassification>;
  },

  /** PATCH /product-classifications/{id} — partial update. */
  update: async ({
    id,
    body,
  }: {
    id: string;
    body: IUpdateProductClassificationBody;
  }): Promise<IUnwrapped<IProductClassification>> => {
    return (await axiosInstance.patch(
      `/product-classifications/${id}`,
      body
    )) as unknown as IUnwrapped<IProductClassification>;
  },

  /** DELETE /product-classifications/{id} — soft delete (active → false). */
  remove: async (id: string): Promise<IUnwrapped<null>> => {
    return (await axiosInstance.delete(
      `/product-classifications/${id}`
    )) as unknown as IUnwrapped<null>;
  },
};
