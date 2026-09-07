"use client";

import { useEffect, useState } from "react";
import { IMaterial, MaterialFormValues } from "../types";

const STORAGE_KEY = "materials";

const generateId = () =>
  `MAT-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

const SEED_DATE = "2024-01-01T00:00:00.000Z";

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

/** Everything the table shows but the create modal does not ask for. */
const blankDetails = {
  image: "",
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
};

const getDefaultMaterials = (): IMaterial[] => {
  const seeds: Omit<IMaterial, "id" | "code">[] = [
    {
      ...blankDetails,
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
      ...blankDetails,
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
      ...blankDetails,
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
      ...blankDetails,
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
      ...blankDetails,
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
  ...blankDetails,
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
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
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
      ...blankDetails,
      ...values,
      code: generateMaterialCode(materials, values.materialType),
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setMaterials((prev) => [...prev, item]);
    return item;
  };

  /** Patch used by both the edit modal and every inline cell edit. */
  const updateMaterial = (id: string, patch: Partial<IMaterial>) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  /** Code the next material of this type would receive — for the create modal preview. */
  const getNextCode = (materialType: string) =>
    materialType ? generateMaterialCode(materials, materialType) : "";

  return {
    materials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getNextCode,
  };
}
