"use client";

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
import { ReactNode } from "react";
import { CategoryViewModalProps } from "./types";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-3 border-b last:border-b-0">
      <dt className="text-sm text-secondary-gary">{label}</dt>
      <dd className="col-span-2 text-sm text-secondary font-medium wrap-break-word">
        {children}
      </dd>
    </div>
  );
}

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
            <Row label="Name">{item.name}</Row>
            <Row label="Code">
              <span className="font-mono text-xs">{item.code}</span>
            </Row>
            <Row label="Level">{levelLabel || item.level}</Row>
            {parentLevel && (
              <Row label={PRODUCT_CLASSIFICATION_LEVEL_LABEL[parentLevel]}>
                {item.parentName || "—"}
              </Row>
            )}
            <Row label="Icon">
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
            </Row>
            <Row label="Status">
              <StatusBadge
                status={item.active ? StatusType.ACTIVE : StatusType.INACTIVE}
                className="px-2 py-1"
              />
            </Row>
            <Row label="ID">
              <span className="font-mono text-xs">{item.id}</span>
            </Row>
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}
