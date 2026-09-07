export interface IMaterial {
  id: string;
  /** Auto-generated on create from Material Type, e.g. "ADD-ONS-0001". Read-only. */
  code: string;
  /** Leaf material name — the row's identity. */
  material: string;
  image: string;
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

/** Inline editable text columns. */
export type MaterialTextField =
  | "material"
  | "materialDescription"
  | "defaultSupplierRefCode"
  | "textComposition"
  | "materialClass"
  | "materialSubClass"
  | "materialType"
  | "structure"
  | "productSuppliers"
  | "weight"
  | "yarnCount"
  | "yarnCountUnit"
  | "materialStatus";

/** Inline editable checkbox columns. */
export type MaterialFlag =
  | "okForColorSpecification"
  | "isActive"
  | "isSustainable";

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
