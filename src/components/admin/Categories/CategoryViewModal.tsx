"use client";

import DetailRow from "@/src/components/shared/DetailRow/DetailRow";
import StatusBadge from "@/src/components/shared/Status/Status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import ClassificationIcon, {
  hasClassificationIcon,
} from "@/src/components/shared/ClassificationIcon/ClassificationIcon";
import { StatusType } from "@/src/types/common/common";
import {
  ClassificationIconType,
  getParentLevelLabel,
  PRODUCT_CLASSIFICATION_LEVEL_LABEL,
} from "@/src/types/productClassification";
import { CategoryViewModalProps } from "./types";

export default function CategoryViewModal({
  item,
  onClose,
}: CategoryViewModalProps) {
  const levelLabel = item ? PRODUCT_CLASSIFICATION_LEVEL_LABEL[item.level] : "";
  const parentLabel = item ? getParentLevelLabel(item.level) : null;
  const hasIcon = hasClassificationIcon(item);

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
            {hasIcon && (
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-light">
                <ClassificationIcon
                  source={item}
                  name={item?.name}
                  className="text-primary"
                />
              </span>
            )}
            <span>{item?.name}</span>
          </DialogTitle>
        </DialogHeader>

        {item && (
          <dl className="mt-2">
            <DetailRow label="Name">{item.name}</DetailRow>
            <DetailRow label="Description">
              <span className="whitespace-pre-line">
                {item.description || "—"}
              </span>
            </DetailRow>
            <DetailRow label="Code">
              <span className="font-mono text-xs">{item.code}</span>
            </DetailRow>
            <DetailRow label="Level">{levelLabel || item.level}</DetailRow>
            {parentLabel && (
              <DetailRow label={parentLabel}>
                {item.parentName || "—"}
              </DetailRow>
            )}
            <DetailRow label="Icon">
              {hasIcon ? (
                <span className="inline-flex items-center gap-2">
                  <ClassificationIcon
                    source={item}
                    name={item.name}
                    size={16}
                    className="text-primary"
                  />
                  <span className="text-xs text-secondary-gary">
                    {item.iconType === ClassificationIconType.FILE
                      ? "Uploaded file"
                      : item.icon}
                  </span>
                </span>
              ) : (
                "—"
              )}
            </DetailRow>
            <DetailRow label="Position">{item.position ?? "—"}</DetailRow>
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
