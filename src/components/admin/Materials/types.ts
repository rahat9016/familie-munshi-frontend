import { IGalleryImage } from "@/src/utils/galleryImage";

export type IMaterialImage = IGalleryImage;

export interface IMaterialDocument {
  id: string;
  name: string;
  /** MIME type reported by the browser, e.g. "application/pdf". */
  type: string;
  /** Size in bytes at upload time. */
  size: number;
  addedAt: string;
  addedBy: string;
}

export interface IMaterial {
  id: string;
  /** Auto-generated on create from Material Type, e.g. "ADD-ONS-0001". Read-only. */
  code: string;
  /** Leaf material name — the row's identity. */
  material: string;
  /** Primary thumbnail — always `images[0]`, kept flat for the list table. */
  image: string;
  /** Every image attached to the material; the detail page manages the set. */
  images: IMaterialImage[];
  materialDescription: string;
  defaultSupplierRefCode: string;
  textComposition: string;
  materialClass: string;
  materialSubClass: string;
  materialType: string;
  structure: string;
  productSuppliers: string;
  weight: string;
  yarnCount: string;
  yarnCountUnit: string;
  okForColorSpecification: boolean;
  materialStatus: string;
  isActive: boolean;
  isSustainable: boolean;
  createdAt: string;
  createdBy: string;

  // ---- Detail page only (not shown as table columns) ----
  composition: string;
  releaseSeason: string;
  sizeUnitOfMeasure: string;
  sizes: string;
  consumptionUnit: string;
  totalWidth: string;
  usableWidth: string;
  widthUnit: string;
  weightUnit: string;
  defaultSize: string;
  defaultColor: string;
  libraries: string;
  materialSecurityGroups: string;
  /** Stamped by every edit — the detail page's "Modified" row. */
  modifiedAt: string;
  modifiedBy: string;
  owner: string;
  specialComment: string;
  destForDevelopment1: string;
  destForDevelopment2: string;
  destForDevelopment3: string;
  defaultSupplier: string;
  defaultAgent: string;
  defaultSupplierQuote: string;
  defaultLeadtimeSamples: string;
  defaultLeadtimeBulk: string;
  sampleMinimums: string;
  garmentProd: string;
  minimumQtyPerColor: string;
  minimumQtyPerOrder: string;
  consumptionPrice: string;
  subDivision: string;
  hasSeasonAvailability: boolean;
  dataSheets: string;
  recentConversations: string;
  packagingRecyclingCode: string;
  materialInterfaceTrigger: boolean;
  construction: string;
  design: string;
  spinningType: string;
  dyeingMethod: string;
  dyeingStuff: string;
  materialInformationStatus: string;
  trademark: string;
  sustainableComposition: string;
  percentOrganic: string;
  percentOthers: string;
  percentRecycled: string;
  documents: IMaterialDocument[];

  actions?: string;
}

/** Fields captured by the create/edit modal — the rest are edited inline. */
export type MaterialFormValues = Pick<
  IMaterial,
  | "material"
  | "materialType"
  | "materialClass"
  | "materialSubClass"
  | "materialDescription"
  | "isSustainable"
>;

type KeysOfType<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

/** System-owned fields — rendered read-only everywhere. */
type MaterialReadOnlyField =
  | "id"
  | "code"
  | "createdAt"
  | "createdBy"
  | "modifiedAt"
  | "modifiedBy"
  | "actions";

/** Every editable text field, inline in the table and on the detail page. */
export type MaterialTextField = Exclude<
  Extract<KeysOfType<IMaterial, string>, string>,
  MaterialReadOnlyField
>;

/** Every editable checkbox field. */
export type MaterialFlag = Extract<KeysOfType<IMaterial, boolean>, string>;

export interface IMaterialClass {
  id: string;
  materialType: string;
  name: string;
  createdAt: string;
  actions?: string;
}

export type MaterialClassFormValues = Omit<
  IMaterialClass,
  "id" | "createdAt" | "actions"
>;

export interface IMaterialSubClass {
  id: string;
  /** Parent Material Class id — a sub class can never exist without one. */
  classId: string;
  name: string;
  createdAt: string;
  actions?: string;
}

export type MaterialSubClassFormValues = Omit<
  IMaterialSubClass,
  "id" | "createdAt" | "actions"
>;

/** Sub class flattened with its parent class' type/name for table display. */
export interface IMaterialSubClassRow extends IMaterialSubClass {
  materialType: string;
  className: string;
}
