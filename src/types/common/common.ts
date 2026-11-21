import { ColumnDef } from "@/src/components/ui/data-table";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface Session {
  user: User;
}

export interface IMeta {
  limit: number;
  page: number;
  total: number;
}

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any[];
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};

export type ResponseSuccessType = {
  data: unknown;
  meta?: IMeta;
};
export type ErrorType = IGenericErrorResponse | null | undefined;

export enum StatusType {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  IN_PROGRESS = "IN_PROGRESS",
  VERIFIED = "VERIFIED",
  UNVERIFIED = "UNVERIFIED",
}

export const STATUS_OPTIONS: ISelectOption[] = [
  { label: "Active", value: StatusType.ACTIVE },
  { label: "Inactive", value: StatusType.INACTIVE },
];

export enum BookingType {
  ONSITE = "onsite",
  TELE = "tele",
}
export interface ITableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  showSearch?: boolean;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: ((page: string | number) => void) | undefined;
  search: string;
  handleSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsModalOpen?: (open: boolean) => void;
  showCreateButton?: boolean;
  createTitle?: string;
  routeURL?: string;
  isShowStatus?: boolean;
  /** Extra controls in the table toolbar (filters etc.). */
  rightComponents?: React.ReactNode;
}
export interface ISelectOption {
  label: string;
  value: string | number;
}

/** `meta` of every paginated list endpoint. */
export interface IListMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalRecords: number;
}
