import ControlledIconSelectField from "@/src/components/shared/FromController/ControlledIconSelectField";
import { FileUploadController } from "@/src/components/shared/FromController/FileUploadController";
import InputLabel from "@/src/components/shared/InputLabel";
import { cn } from "@/src/lib/utils";
import { ClassificationIconType } from "@/src/types/productClassification";
import { ImageUp, Shapes } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CategoryFormType } from "../Schema";
import { ICON_ACCEPT } from "../utils/categoryFormData";

const SOURCES = [
  { value: ClassificationIconType.LUCIDE, label: "Lucide icon", Icon: Shapes },
  { value: ClassificationIconType.FILE, label: "Upload file", Icon: ImageUp },
];

/** Icon source toggle + the matching input (lucide picker or file upload). */
export default function CategoryIconField() {
  const { control } = useFormContext<CategoryFormType>();
  const source = useWatch({ control, name: "iconSource" });

  return (
    <div>
      <InputLabel label="Icon" />
      <Controller
        control={control}
        name="iconSource"
        render={({ field }) => (
          <div
            role="radiogroup"
            aria-label="Icon source"
            className="mb-3 inline-flex rounded-lg border border-light-dark bg-light p-1"
          >
            {SOURCES.map(({ value, label, Icon }) => {
              const selected = field.value === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => field.onChange(value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm cursor-pointer transition-colors",
                    selected
                      ? "bg-white text-primary shadow-sm"
                      : "text-secondary-gary hover:text-secondary"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              );
            })}
          </div>
        )}
      />

      {source === ClassificationIconType.FILE ? (
        <FileUploadController
          name="iconFile"
          label="Upload icon (SVG, PNG, WEBP, JPG · max 512 KB)"
          accept={ICON_ACCEPT}
          className="w-32 h-32"
          imgClassName="p-4"
        />
      ) : (
        <ControlledIconSelectField
          name="icon"
          placeholder="Select icon (optional)"
        />
      )}
    </div>
  );
}
