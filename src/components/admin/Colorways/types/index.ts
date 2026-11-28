import { ErrorType } from "@/src/types/common/common";
import { ColorwayFormType } from "../Schema";

export interface ColorwayFormProps {
  onSubmit: (data: ColorwayFormType) => void;
  onCancel: () => void;
  error?: ErrorType | null;
  isPending?: boolean;
}

export interface ColorwayFormModalProps extends ColorwayFormProps {
  isOpen: boolean;
}
