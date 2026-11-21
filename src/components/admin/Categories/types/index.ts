import { ISelectOption } from "@/src/types/common/common";
import { ErrorType } from "@/src/types/common/common";
import {
  IProductClassification,
  ProductClassificationLevel,
} from "@/src/types/productClassification";
import { CategoryFormType } from "../Schema";

export interface CategoriesProps {
  level: ProductClassificationLevel;
}

export interface CategoryFormProps {
  onSubmit: (data: CategoryFormType) => void;
  onCancel: () => void;
  /** e.g. "Parent Category" */
  levelLabel: string;
  /** Label of the level above; null = GROUP (no parent field). */
  parentLabel: string | null;
  parentOptions: ISelectOption[];
  isParentsLoading?: boolean;
  isEditMode?: boolean;
  error?: ErrorType | null;
  isPending?: boolean;
}

export interface CategoryFormModalProps extends CategoryFormProps {
  isOpen: boolean;
}

export interface CategoryViewModalProps {
  /** Row to show; undefined = closed. */
  item?: IProductClassification;
  onClose: () => void;
}

/** Form modal state: open + optional row (row = edit, none = create). */
export interface CategoryFormState {
  open: boolean;
  item?: IProductClassification;
}
