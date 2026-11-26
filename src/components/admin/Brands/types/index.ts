import { IBrand } from "@/src/types/brand";
import { ErrorType } from "@/src/types/common/common";
import { BrandFormType } from "../Schema";

export interface BrandFormProps {
  onSubmit: (data: BrandFormType) => void;
  onCancel: () => void;
  isEditMode?: boolean;
  /** Create only: auto-increment value (highest position + 1). */
  suggestedPosition?: number;
  isPositionLoading?: boolean;
  error?: ErrorType | null;
  isPending?: boolean;
}

export interface BrandFormModalProps extends BrandFormProps {
  isOpen: boolean;
}

export interface BrandViewModalProps {
  /** Brand to load via GET /brands/{id}; undefined = closed. */
  brandId?: string;
  onClose: () => void;
}

/** Form modal state: open + optional row (row = edit, none = create). */
export interface BrandFormState {
  open: boolean;
  item?: IBrand;
}
