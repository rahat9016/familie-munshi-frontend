"use client";

import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledIconSelectField from "@/src/components/shared/FromController/ControlledIconSelectField";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSearchableSelectField from "@/src/components/shared/FromController/ControlledSearchableSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  useCreateProductClassification,
  useInvalidateProductClassifications,
  useProductClassificationsByLevel,
  useUpdateProductClassification,
} from "@/src/hooks/useProductClassifications";
import { IGenericErrorResponse } from "@/src/types/common/common";
import {
  ICreateProductClassificationBody,
  IProductClassification,
  IUpdateProductClassificationBody,
  PRODUCT_CLASSIFICATION_LEVEL_LABEL,
  PRODUCT_CLASSIFICATION_PARENT_LEVEL,
  ProductClassificationLevel,
} from "@/src/types/ecommerce/productClassification";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  ClassificationFormValues,
  getClassificationSchema,
} from "./classificationSchema";

interface ClassificationFormModalProps {
  level: ProductClassificationLevel;
  isOpen: boolean;
  onClose: () => void;
  /** Row being edited. Omit for create. */
  item?: IProductClassification;
}

const toFormValues = (
  item?: IProductClassification
): ClassificationFormValues => ({
  name: item?.name ?? "",
  icon: item?.icon ?? "",
  parentId: item?.parentId ?? "",
});

const statusOf = (err: unknown) =>
  (err as IGenericErrorResponse | undefined)?.statusCode;

export default function ClassificationFormModal({
  level,
  isOpen,
  onClose,
  item,
}: ClassificationFormModalProps) {
  const isEdit = !!item;
  const parentLevel = PRODUCT_CLASSIFICATION_PARENT_LEVEL[level];
  const requiresParent = parentLevel !== null;
  const levelLabel = PRODUCT_CLASSIFICATION_LEVEL_LABEL[level];
  const parentLabel = parentLevel
    ? PRODUCT_CLASSIFICATION_LEVEL_LABEL[parentLevel]
    : "";

  const schema = useMemo(
    () => getClassificationSchema(requiresParent),
    [requiresParent]
  );

  const methods = useForm<ClassificationFormValues>({
    resolver: yupResolver(schema) as Resolver<ClassificationFormValues>,
    defaultValues: toFormValues(item),
  });

  // Parent options are fetched only while the modal is open.
  const {
    data: parents = [],
    isLoading: isParentsLoading,
    refetch: refetchParents,
  } = useProductClassificationsByLevel(parentLevel, isOpen && requiresParent);

  const parentOptions = useMemo(() => {
    const options = parents
      .filter((p) => p.id !== item?.id)
      .map((p) => ({ label: p.name, value: p.id }));
    // Keep the current parent selectable even if by-level no longer lists it.
    if (
      item?.parentId &&
      item.parentName &&
      !options.some((o) => o.value === item.parentId)
    ) {
      options.unshift({ label: item.parentName, value: item.parentId });
    }
    return options;
  }, [parents, item]);

  const createMutation = useCreateProductClassification();
  const updateMutation = useUpdateProductClassification();
  const invalidateAll = useInvalidateProductClassifications();
  const activeMutation = isEdit ? updateMutation : createMutation;
  const isPending = activeMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      methods.reset(toFormValues(item));
      createMutation.reset();
      updateMutation.reset();
      if (requiresParent) refetchParents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, level, item?.id]);

  const handleCreate = async (values: ClassificationFormValues) => {
    const body: ICreateProductClassificationBody = {
      name: values.name.trim(),
      level,
    };
    if (requiresParent && values.parentId) body.parentId = values.parentId;
    const icon = values.icon?.trim();
    if (icon) body.icon = icon;

    try {
      const res = await createMutation.mutateAsync(body);
      toast.success(res?.message || `${levelLabel} created successfully`);
      onClose();
    } catch (err) {
      // 404 → selected parent removed / inactive; reload options.
      if (statusOf(err) === 404) {
        methods.setValue("parentId", "");
        refetchParents();
      }
      // 400/404 message rendered in the modal via ErrorMessage.
    }
  };

  const handleUpdate = async (
    original: IProductClassification,
    values: ClassificationFormValues
  ) => {
    // Send only changed fields.
    const body: IUpdateProductClassificationBody = {};
    const name = values.name.trim();
    if (name !== original.name) body.name = name;
    if (
      requiresParent &&
      values.parentId &&
      values.parentId !== original.parentId
    ) {
      body.parentId = values.parentId;
    }
    const icon = values.icon?.trim() ?? "";
    if (icon !== (original.icon ?? "")) body.icon = icon; // "" clears it

    if (Object.keys(body).length === 0) {
      toast.info("No changes to save");
      onClose();
      return;
    }

    try {
      const res = await updateMutation.mutateAsync({ id: original.id, body });
      toast.success(res?.message || `${levelLabel} updated successfully`);
      onClose();
    } catch (err) {
      const status = statusOf(err);
      if (status === 404) {
        // Row or parent gone / inactive.
        toast.error(
          (err as IGenericErrorResponse)?.message ||
            "Classification or parent not found"
        );
        if (body.parentId) methods.setValue("parentId", original.parentId ?? "");
        invalidateAll();
      }
      // 400 / 409 message rendered in the modal via ErrorMessage.
    }
  };

  const onSubmit = (values: ClassificationFormValues) =>
    item ? handleUpdate(item, values) : handleCreate(values);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isEdit ? "Edit" : "Create"} {levelLabel}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full space-y-5 mt-2"
          >
            <div>
              <InputLabel label="Name" required />
              <ControlledInputField
                className="bg-light"
                name="name"
                placeholder={`Enter ${levelLabel.toLowerCase()} name`}
              />
            </div>

            {requiresParent && (
              <div>
                <InputLabel label={parentLabel} required />
                <ControlledSearchableSelectField
                  name="parentId"
                  options={parentOptions}
                  disabled={isParentsLoading}
                  placeholder={
                    isParentsLoading
                      ? "Loading..."
                      : `Select ${parentLabel.toLowerCase()}`
                  }
                  searchPlaceholder={`Search ${parentLabel.toLowerCase()}...`}
                  emptyMessage={`No ${parentLabel.toLowerCase()} found.`}
                />
              </div>
            )}

            <div>
              <InputLabel label="Icon" />
              <ControlledIconSelectField
                name="icon"
                placeholder="Select icon (optional)"
              />
            </div>

            <ErrorMessage error={activeMutation.error} />

            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
              >
                Cancel
              </Button>
              <SubmitButton
                isLoading={isPending}
                label={isEdit ? "Update" : "Create"}
              />
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
