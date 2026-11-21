"use client";

import DetailRow from "@/src/components/shared/DetailRow/DetailRow";
import StatusBadge from "@/src/components/shared/Status/Status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { getClassificationIcon } from "@/src/constants/ecommerce/classificationIcons";
import { StatusType } from "@/src/types/common/common";
import {
  PRODUCT_CLASSIFICATION_LEVEL_LABEL,
  PRODUCT_CLASSIFICATION_PARENT_LEVEL,
} from "@/src/types/productClassification";
import { CategoryViewModalProps } from "./types";

export default function CategoryViewModal({
  item,
  onClose,
}: CategoryViewModalProps) {
  const levelLabel = item ? PRODUCT_CLASSIFICATION_LEVEL_LABEL[item.level] : "";
  const parentLevel = item
    ? PRODUCT_CLASSIFICATION_PARENT_LEVEL[item.level]
    : null;
  const icon = getClassificationIcon(item?.icon);

  return (
    <Dialog
      open={!!item}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold flex items-center gap-3">
            {icon && (
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-light">
                <icon.Icon className="size-5 text-primary" />
              </span>
            )}
            <span>{item?.name}</span>
          </DialogTitle>
        </DialogHeader>

        {item && (
          <dl className="mt-2">
            <DetailRow label="Name">{item.name}</DetailRow>
            <DetailRow label="Code">
              <span className="font-mono text-xs">{item.code}</span>
            </DetailRow>
            <DetailRow label="Level">{levelLabel || item.level}</DetailRow>
            {parentLevel && (
              <DetailRow
                label={PRODUCT_CLASSIFICATION_LEVEL_LABEL[parentLevel]}
              >
                {item.parentName || "—"}
              </DetailRow>
            )}
            <DetailRow label="Icon">
              {icon ? (
                <span className="inline-flex items-center gap-2">
                  <icon.Icon className="size-4 text-primary" />
                  {icon.label}
                  <span className="text-xs text-secondary-gary">
                    ({icon.value})
                  </span>
                </span>
              ) : (
                item.icon || "—"
              )}
            </DetailRow>
            <DetailRow label="Status">
              <StatusBadge
                status={item.active ? StatusType.ACTIVE : StatusType.INACTIVE}
                className="px-2 py-1"
              />
            </DetailRow>
            <DetailRow label="ID">
              <span className="font-mono text-xs">{item.id}</span>
            </DetailRow>
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}
