"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { normalizeGalleryImages } from "@/src/utils/galleryImage";
import { deleteImage } from "@/src/utils/imageStore";
import {
  IMaterial,
  IMaterialDocument,
  IMaterialImage,
  MaterialFormValues,
} from "../types";

const STORAGE_KEY = "materials";

const generateId = () =>
  `MAT-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

const SEED_DATE = "2024-01-01T00:00:00.000Z";

/** Stamped on every edit until a real auth session provides the user. */
const EDITOR_NAME = "System";

/** e.g. "Add-Ons" -> "ADD-ONS" */
const codePrefix = (materialType: string) =>
  materialType.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Next sequential code for a type, e.g. "ADD-ONS-0001", based on the
 *  highest existing suffix so deleting rows never reuses a number. */
const generateMaterialCode = (
  existing: Pick<IMaterial, "code" | "materialType">[],
  materialType: string
) => {
  const prefix = codePrefix(materialType);
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  const maxNumber = existing.reduce((max, item) => {
    const match = pattern.exec(item.code);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `${prefix}-${String(maxNumber + 1).padStart(4, "0")}`;
};

/** Everything the table shows but the create modal does not ask for.
 *  A factory, not a constant, so every row gets its own `documents` array. */
const createBlankDetails = () => ({
  image: "",
  images: [] as IMaterialImage[],
  defaultSupplierRefCode: "",
  textComposition: "",
  structure: "",
  productSuppliers: "",
  weight: "",
  yarnCount: "",
  yarnCountUnit: "",
  okForColorSpecification: false,
  materialStatus: "Draft",
  isActive: true,
  createdBy: "System",
  // Detail page fields — blank until edited on the material detail page.
  composition: "",
  releaseSeason: "",
  sizeUnitOfMeasure: "",
  sizes: "",
  consumptionUnit: "",
  totalWidth: "",
  usableWidth: "",
  widthUnit: "",
  weightUnit: "",
  defaultSize: "",
  defaultColor: "",
  libraries: "",
  materialSecurityGroups: "",
  modifiedAt: "",
  modifiedBy: "",
  owner: "",
  specialComment: "",
  destForDevelopment1: "",
  destForDevelopment2: "",
  destForDevelopment3: "",
  defaultSupplier: "",
  defaultAgent: "",
  defaultSupplierQuote: "",
  defaultLeadtimeSamples: "",
  defaultLeadtimeBulk: "",
  sampleMinimums: "",
  garmentProd: "",
  minimumQtyPerColor: "",
  minimumQtyPerOrder: "",
  consumptionPrice: "",
  subDivision: "",
  hasSeasonAvailability: false,
  dataSheets: "",
  recentConversations: "",
  packagingRecyclingCode: "",
  materialInterfaceTrigger: false,
  construction: "",
  design: "",
  spinningType: "",
  dyeingMethod: "",
  dyeingStuff: "",
  materialInformationStatus: "",
  trademark: "",
  sustainableComposition: "",
  percentOrganic: "",
  percentOthers: "",
  percentRecycled: "",
  documents: [] as IMaterialDocument[],
});

const getDefaultMaterials = (): IMaterial[] => {
  const seeds: Omit<IMaterial, "id" | "code">[] = [
    {
      ...createBlankDetails(),
      material: "100% Cotton Poplin 120gsm",
      materialType: "Fabric",
      materialClass: "Woven",
      materialSubClass: "Cotton Woven",
      materialDescription: "Lightweight cotton poplin for shirting",
      defaultSupplierRefCode: "SUP-POP-120",
      textComposition: "100% Cotton",
      structure: "Poplin 1/1",
      productSuppliers: "Nishat Mills",
      weight: "120",
      yarnCount: "40",
      yarnCountUnit: "Ne",
      okForColorSpecification: true,
      materialStatus: "Approved",
      isSustainable: true,
      createdAt: SEED_DATE,
    },
    {
      ...createBlankDetails(),
      material: "Cotton Jersey 180gsm",
      materialType: "Fabric",
      materialClass: "Knit",
      materialSubClass: "Jersey",
      materialDescription: "Single jersey knit for t-shirts",
      defaultSupplierRefCode: "SUP-JSY-180",
      textComposition: "95% Cotton 5% Elastane",
      structure: "Single Jersey",
      productSuppliers: "Interloop",
      weight: "180",
      yarnCount: "30",
      yarnCountUnit: "Ne",
      materialStatus: "In Development",
      isSustainable: false,
      createdAt: SEED_DATE,
    },
    {
      ...createBlankDetails(),
      material: "25mm Woven Elastic",
      materialType: "Trims",
      materialClass: "Elastic",
      materialSubClass: "Woven Elastic",
      materialDescription: "Waistband elastic",
      textComposition: "70% Polyester 30% Rubber",
      structure: "Woven",
      productSuppliers: "Elastex",
      weight: "25",
      materialStatus: "Approved",
      isSustainable: false,
      createdAt: SEED_DATE,
    },
    {
      ...createBlankDetails(),
      material: "Brand Woven Main Label",
      materialType: "Labeling",
      materialClass: "Main Label",
      materialSubClass: "Woven Main Label",
      materialDescription: "Center back neck main label",
      textComposition: "100% Polyester",
      productSuppliers: "Label Pro",
      materialStatus: "Approved",
      isSustainable: false,
      createdAt: SEED_DATE,
    },
    {
      ...createBlankDetails(),
      material: "30s Combed Cotton Yarn",
      materialType: "Yarn",
      materialClass: "Cotton Yarn",
      materialSubClass: "Combed Cotton",
      materialDescription: "Ring-spun combed cotton yarn",
      textComposition: "100% Cotton",
      productSuppliers: "Spin Tex",
      yarnCount: "30",
      yarnCountUnit: "Ne",
      okForColorSpecification: true,
      materialStatus: "Approved",
      isSustainable: true,
      createdAt: SEED_DATE,
    },
  ];

  const withCodes: IMaterial[] = [];
  seeds.forEach((seed) => {
    const code = generateMaterialCode(withCodes, seed.materialType);
    withCodes.push({ ...seed, code, id: generateId() });
  });
  return withCodes;
};

/** Rows saved before a column existed come back without it — backfill so the
 *  inline inputs stay controlled. */
const normalize = (item: Partial<IMaterial>): IMaterial => ({
  ...createBlankDetails(),
  code: "",
  material: "",
  materialType: "",
  materialClass: "",
  materialSubClass: "",
  materialDescription: "",
  isSustainable: false,
  createdAt: SEED_DATE,
  ...item,
  id: item.id ?? generateId(),
  documents: Array.isArray(item.documents) ? item.documents : [],
  images: normalizeGalleryImages(item.images, item.image),
});

/** Rows saved before `code` existed come back with code "" — assign them one
 *  in place so every row keeps a stable, unique code going forward. */
const backfillCodes = (items: IMaterial[]): IMaterial[] => {
  const withCodes: IMaterial[] = [];
  items.forEach((item) => {
    if (item.code) {
      withCodes.push(item);
    } else {
      withCodes.push({
        ...item,
        code: generateMaterialCode(withCodes, item.materialType),
      });
    }
  });
  return withCodes;
};

const loadMaterials = (): IMaterial[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Partial<IMaterial>[];
      if (Array.isArray(parsed)) return backfillCodes(parsed.map(normalize));
    } catch {
      // ignore corrupted data
    }
  }
  return getDefaultMaterials();
};

const persistMaterials = (items: IMaterial[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota exceeded — retry without the (largest) image payloads so the rest
    // of the edit is not silently lost.
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          items.map((item) => ({ ...item, image: "", images: [] }))
        )
      );
      toast.error("Storage is full — material images were not saved.");
    } catch {
      toast.error("Storage is full — the latest changes were not saved.");
    }
  }
};

export function useMaterials() {
  // Seeded identically on server and first client render to avoid a
  // hydration mismatch; the real localStorage value is loaded right
  // after mount (client-only).
  const [materials, setMaterials] = useState<IMaterial[]>(getDefaultMaterials);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMaterials(loadMaterials());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) persistMaterials(materials);
  }, [materials, hydrated]);

  const addMaterial = (values: MaterialFormValues) => {
    const item: IMaterial = {
      ...createBlankDetails(),
      ...values,
      code: generateMaterialCode(materials, values.materialType),
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setMaterials((prev) => [...prev, item]);
    return item;
  };

  /** Every mutation funnels through here so the modified audit fields are
   *  always stamped, whatever changed. */
  const patchMaterial = (
    id: string,
    updater: (material: IMaterial) => Partial<IMaterial>
  ) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              ...updater(m),
              modifiedAt: new Date().toISOString(),
              modifiedBy: EDITOR_NAME,
            }
          : m
      )
    );
  };

  /** Patch used by the edit modal, every inline cell edit and the detail page. */
  const updateMaterial = (id: string, patch: Partial<IMaterial>) =>
    patchMaterial(id, () => patch);

  /** Single material for the detail page — `undefined` while unknown. */
  const getMaterial = (id: string) => materials.find((m) => m.id === id);

  /** Append dropped/selected images; the first one becomes the thumbnail. */
  const addImages = (id: string, images: IMaterialImage[]) => {
    if (images.length === 0) return;
    patchMaterial(id, (m) => {
      const next = [...m.images, ...images];
      return { images: next, image: next[0].thumbnail };
    });
  };

  /** Replace the thumbnail — what the list table's image cell does. */
  const replacePrimaryImage = (id: string, image: IMaterialImage) =>
    patchMaterial(id, (m) => {
      const [replaced, ...rest] = m.images;
      if (replaced?.id) deleteImage(replaced.id);
      return { images: [image, ...rest], image: image.thumbnail };
    });

  const removeImage = (id: string, index: number) =>
    patchMaterial(id, (m) => {
      const removed = m.images[index];
      if (removed?.id) deleteImage(removed.id);
      const next = m.images.filter((_, i) => i !== index);
      return { images: next, image: next[0]?.thumbnail ?? "" };
    });

  /** Promote an image to the thumbnail slot. */
  const setPrimaryImage = (id: string, index: number) =>
    patchMaterial(id, (m) => {
      const picked = m.images[index];
      if (!picked) return {};
      const next = [picked, ...m.images.filter((_, i) => i !== index)];
      return { images: next, image: picked.thumbnail };
    });

  const addDocument = (
    id: string,
    file: Pick<IMaterialDocument, "name" | "type" | "size">
  ) =>
    patchMaterial(id, (m) => ({
      documents: [
        ...m.documents,
        {
          ...file,
          id: generateId(),
          addedAt: new Date().toISOString(),
          addedBy: EDITOR_NAME,
        },
      ],
    }));

  const deleteDocument = (id: string, documentId: string) =>
    patchMaterial(id, (m) => ({
      documents: m.documents.filter((d) => d.id !== documentId),
    }));

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  /** Code the next material of this type would receive — for the create modal preview. */
  const getNextCode = (materialType: string) =>
    materialType ? generateMaterialCode(materials, materialType) : "";

  return {
    materials,
    hydrated,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterial,
    addImages,
    replacePrimaryImage,
    removeImage,
    setPrimaryImage,
    addDocument,
    deleteDocument,
    getNextCode,
  };
}
