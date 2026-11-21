---
name: frontend-feature-structure
description: Required folder layout and code conventions for any frontend feature/component work in familie-munshi-frontend (new admin pages, CRUD screens, forms, tables, modals, auth screens). Use whenever creating or refactoring a feature folder under src/components, adding a form, schema, table, columns or view modal. Reference implementations - src/components/auth/Login, src/components/admin/Branches and src/components/admin/Categories.
---

# Frontend feature structure

Every feature lives in its own PascalCase folder under `src/components/<area>/<Feature>/`
(`<area>` = `admin`, `auth`, `shared`, ...). Always follow this layout. Only create the
files a feature needs, but never put a piece in a different place than shown.

```
<Feature>/                       e.g. Branches/
├── <Feature>.tsx                ← page container (like Login.tsx / Branches.tsx)
├── Form/
│   ├── <Entity>Form.tsx         ← like LoginForm.tsx: useFormContext, props from types
│   └── <Entity><Field>Field.tsx ← custom field components (e.g. BranchLogoField.tsx)
├── Schema/index.ts              ← <entity>Schema + <Entity>FormType (Yup.InferType)
├── types/index.ts               ← <Entity>FormProps, <Entity>FormModalProps, <Entity>ViewModalProps, <Entity>FormState
├── <Entity>FormModal.tsx        ← create/update Dialog wrapping <Entity>Form (no Dialog markup in container)
├── <Entity>ViewModal.tsx        ← read-only detail dialog
├── <Feature>Table.tsx           ← thin DataTable wrapper
├── TableColumns/<Entity>Columns.tsx ← Get<Entity>Columns(actions): ColumnDef<T>[]
├── utils/<entity>FormData.ts    ← query keys, toFormValues, payload/FormData builders, constants
└── <SubFeature>/                ← nested feature, same layout recursively (e.g. ActivateAdmin/)
```

Route file in `src/app/...` stays a one-liner that renders the container:

```tsx
import Branches from "@/src/components/admin/Branches/Branches";

export default function page() {
  return <Branches />;
}
```

## Responsibilities per file

### `<Feature>.tsx` — container
- `"use client";`, `export default function <Feature>Page()`.
- Owns all state, data hooks (`useGet`, `usePost`, `usePatch`, `useDelete`, `usePagination`,
  `useSearchDebounce`), permissions (`useAppSelector(selectHasPermission(PERMISSION.X))`),
  `useForm<FormType>({ resolver: yupResolver(schema), defaultValues })`.
- Wraps `<Entity>FormModal` in `<FormProvider {...methods}>` and passes `isOpen`, `onSubmit`,
  `onCancel`, `error`, `isPending` etc. as props. No field markup and no Dialog markup here.
- Form defaults come from `toFormValues(item?)` imported from `./utils/<entity>FormData`
  (never defined inside the container).

### `<Entity>FormModal.tsx` — create/update dialog
- Props `<Entity>FormModalProps extends <Entity>FormProps { isOpen: boolean }`.
- Renders `Dialog` → title ("Create"/"Update" <Entity>) → `<Entity>Form {...props}`.
- Blocks closing while `isPending`. Must render inside the container's `FormProvider`.

### `Form/<Entity>Form.tsx` — presentational form
- `const methods = useFormContext<<Entity>FormType>();` — never call `useForm` here.
- Props typed with `<Entity>FormProps` imported from `../types`. Destructure with defaults
  (`isPending = false`).
- `<form onSubmit={methods.handleSubmit(onSubmit)}>`; use shared controls:
  `ControlledInputField`, `ControlledSwitchField`, `InputLabel`, `ErrorMessage`,
  `SubmitButton`, `Button` from `@/src/components/...`.
- No API calls, no toasts, no router — exception: options from a paginated API endpoint use
  `ControlledPaginatedSelectField` (server `search`, loads next page on scroll via
  `useInfiniteGet`); pass `endpoint`, `queryKey`, `params`, and a module-level `getOption`.
- Optional sections gated by a switch use `ControlledToggleField` (e.g. `assignBranch`) and
  the dependent field is required via `.when("<toggle>", { is: true, then: required })`.

### `Schema/index.ts`
```ts
import * as Yup from "yup";

export const <entity>Schema = Yup.object({ ... });

export type <Entity>FormType = Yup.InferType<typeof <entity>Schema>;
```
Form type always derives from the schema — never hand-write it.

### `types/index.ts`
- Component prop interfaces (`<Entity>FormProps`, `<Entity>ViewModalProps`) and local UI
  state (`<Entity>FormState { open: boolean; item?: IEntity }`).
- `error?: ErrorType | null` from `@/src/types/common/common`.
- Domain/API types (`IEntity`, payloads, list meta, helpers like `isBranchActive`) go in
  `src/types/<entity>/`, not here.

### `<Feature>Table.tsx`
Generic `<T,>` wrapper around `DataTable`, typed `ITableProps<T>`; only sets title/icon and
forwards props.

### `TableColumns/<Entity>Columns.tsx`
`export const Get<Entity>Columns = (actions: <Entity>RowActions = {}): ColumnDef<IEntity>[]`.
Optional action callbacks; omitted callback = action hidden (permission driven).
Row actions: render the shared `RowActionsMenu`
(`@/src/components/shared/RowActionsMenu/RowActionsMenu`) in an Action column with
`align: "right"`. Pass `actions=[{ key, label, icon, onSelect, hidden, variant }]` —
`hidden: !callback` for permission gating, `variant: "danger"` for delete. Never hand-roll
DropdownMenu markup in a columns file. Active/inactive status is NOT a menu action — it is
edited via `ControlledToggleField` (name `isActive`) in the form.

### `<Entity>ViewModal.tsx`
Own `useGet` on `/<entities>/{id}` with `{ enabled: !!id }`; open state = `!!id`.
If the API has no GET-by-id, take the row (`item?: IEntity`) instead; open state = `!!item`.
While loading show `Skeleton` placeholders (header + detail rows), not a spinner.

### `utils/<entity>FormData.ts`
`<ENTITIES>_QUERY_KEY`, request configs, `toFormValues(item?)` (entity → form defaults),
payload/FormData builders. Pure functions only.

## Rules
- Imports: absolute `@/src/...` for shared code, relative (`./Form/...`, `../Schema`,
  `../types`) inside the feature.
- Default export for components; named exports for schema, types, columns, utils.
- Folder names `Form`, `Schema`, `TableColumns` are PascalCase; `types`, `utils`, `data` lowercase.
- Mock data, if any, in `data/mock<Entity>Data.ts`.
- When touching an older feature that doesn't follow this layout, migrate it to this layout
  as part of the change (tell the user).
