import { mockCategoriesList } from "@/src/components/admin/Categories/data/mockCategoryHierarchy";
import { mockBranchesList } from "@/src/components/admin/Branches/data/mockBranchData";
import { ControlledCheckField } from "@/src/components/shared/FromController/ControlledCheckField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { monthOptions } from "../Schema/articleSchema";
import {
  propertyCollectionTypeOptions,
  propertySizeChartTemplateOptions,
  propertyStyleTypeOptions,
  propertySupplierOptions,
  StylePropertyFormValues,
} from "../Schema/stylePropertySchema";

const categoryOptions = mockCategoriesList.map((c) => ({
  label: c.name,
  value: c.id,
}));

const branchOptions = mockBranchesList.map((b) => ({
  label: b.name ?? b.id,
  value: b.id,
}));

export default function StylePropertyForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: StylePropertyFormValues) => void;
  onCancel: () => void;
}) {
  const { handleSubmit } = useFormContext<StylePropertyFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 mt-2">
      <div>
        <InputLabel label="Style Type" required className="text-sm font-semibold text-secondary-dark" />
        <ControlledSelectField
          name="styleType"
          options={propertyStyleTypeOptions}
          placeholder="Select style type"
          className="bg-white shadow-none"
        />
      </div>

      <div>
        <InputLabel label="Size Chart Template" className="text-sm font-semibold text-secondary-dark" />
        <ControlledSelectField
          name="sizeChartTemplate"
          options={propertySizeChartTemplateOptions}
          placeholder="Select size chart template"
          className="bg-white shadow-none"
        />
      </div>

      <div>
        <InputLabel label="Delivery Month" required className="text-sm font-semibold text-secondary-dark" />
        <ControlledSelectField
          name="deliveryMonth"
          options={monthOptions}
          placeholder="Select delivery month"
          className="bg-white shadow-none"
        />
      </div>

      <div>
        <InputLabel label="Collection Type" required className="text-sm font-semibold text-secondary-dark" />
        <ControlledSelectField
          name="collectionType"
          options={propertyCollectionTypeOptions}
          placeholder="Select collection type"
          className="bg-white shadow-none"
        />
      </div>

      <div>
        <InputLabel label="Category" required className="text-sm font-semibold text-secondary-dark" />
        <ControlledSelectField
          name="categoryId"
          options={categoryOptions}
          placeholder="Select category"
          className="bg-white shadow-none"
        />
      </div>

      <div>
        <InputLabel label="Supplier" className="text-sm font-semibold text-secondary-dark" />
        <ControlledSelectField
          name="supplierId"
          options={propertySupplierOptions}
          placeholder="Select supplier"
          className="bg-white shadow-none"
        />
      </div>

      <div>
        <InputLabel label="Assigned Branch" className="text-sm font-semibold text-secondary-dark" />
        <ControlledSelectField
          name="assignedBranchId"
          options={branchOptions}
          placeholder="Select branch"
          className="bg-white shadow-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <ControlledCheckField name="carryOver" label="Carry Over" />
        <ControlledCheckField name="autoProtoSr" label="Auto Proto SR" />
        <ControlledCheckField name="autoSmsSr" label="Auto SMS SR" />
        <ControlledCheckField name="autoFfpSr" label="Auto FFP SR" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Cancel
        </Button>
        <SubmitButton label="Save" />
      </div>
    </form>
  );
}
