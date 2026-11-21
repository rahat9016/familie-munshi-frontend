// ─── RBAC/ABAC Configuration ──────────────────────────────────────
// Resources are a fixed config list (routes/modules). Each resource
// declares WHICH built-in actions actually apply to it (e.g. reports has
// no CREATE/DELETE). Actions are otherwise dynamic — managed in the
// `actions` table — and any custom (non-built-in) action applies to all
// resources. Action keys are UPPERCASE.

export type Action = string;

// Default action keys seeded into the `actions` table on first run.
// Kept here as the seed source + delete-protection list.
export const BUILT_IN_ACTIONS = [
  "CREATE",
  "READ",
  "UPDATE",
  "DELETE",
  "EXPORT",
] as const;

const CRUD = ["CREATE", "READ", "UPDATE", "DELETE"];
const CRUDE = ["CREATE", "READ", "UPDATE", "DELETE", "EXPORT"];

export interface ResourceDef {
  key: string;
  label: string;
  route: string;
  /** Built-in actions that apply to this resource. */
  actions: readonly string[];
}

// Resources = protected routes/modules. `actions` = the built-in actions
// that make sense for each one.
export const RESOURCES: ResourceDef[] = [
  { key: "orders", label: "Orders", route: "/admin/orders", actions: CRUDE },
  { key: "products", label: "Products", route: "/admin/products", actions: CRUDE },
  { key: "customers", label: "Customers", route: "/admin/users", actions: ["READ", "UPDATE", "EXPORT"] },
  { key: "payments", label: "Payments", route: "/admin/finance", actions: ["READ", "EXPORT"] },
  { key: "branches", label: "Branches", route: "/admin/branches", actions: CRUD },
  { key: "users", label: "Users", route: "/admin/rbac/users", actions: CRUD },
  { key: "roles", label: "Roles", route: "/admin/rbac/roles", actions: CRUD },
  { key: "actions", label: "Actions", route: "/admin/rbac/actions", actions: CRUD },
  { key: "permissions", label: "Permissions", route: "/admin/rbac/permissions", actions: CRUD },
  { key: "reports", label: "Reports", route: "/admin/dashboard", actions: ["READ", "EXPORT"] },
];

export const RESOURCE_KEYS = RESOURCES.map((r) => r.key);
export type Resource = (typeof RESOURCE_KEYS)[number];

export const RESOURCE_ROUTES: Record<string, string> = RESOURCES.reduce(
  (acc, r) => ({ ...acc, [r.key]: r.route }),
  {} as Record<string, string>,
);

const RESOURCE_BY_KEY = new Map(RESOURCES.map((r) => [r.key, r]));

/**
 * Action keys applicable to a resource, given the dynamic action catalog:
 * the resource's built-in subset + every custom (non-built-in) action key.
 */
export function applicableActions(
  resourceKey: string,
  allActionKeys: string[],
): string[] {
  const def = RESOURCE_BY_KEY.get(resourceKey);
  const builtIn = new Set(BUILT_IN_ACTIONS as readonly string[]);
  const allowedBuiltIn = new Set(def?.actions ?? []);
  return allActionKeys.filter((k) =>
    builtIn.has(k) ? allowedBuiltIn.has(k) : true,
  );
}

// O(1) lookup map shape returned by /api/auth/permissions.
export type PermissionMap = Record<string, Record<string, boolean>>;

/** Per-resource baseline with every given action key false. */
export function emptyActions(actionKeys: string[]): Record<string, boolean> {
  return actionKeys.reduce(
    (acc, a) => ({ ...acc, [a]: false }),
    {} as Record<string, boolean>,
  );
}

/** Per-resource map with every given action key true (super admin). */
export function allActions(actionKeys: string[]): Record<string, boolean> {
  return actionKeys.reduce(
    (acc, a) => ({ ...acc, [a]: true }),
    {} as Record<string, boolean>,
  );
}

/** Keep only action keys that exist in the allowed (dynamic) set. */
export function sanitizeActions(
  actions: string[],
  allowedKeys: string[],
): string[] {
  const set = new Set(allowedKeys);
  return actions.filter((a) => set.has(a));
}
