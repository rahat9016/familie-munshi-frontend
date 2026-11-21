# familie-munshi-frontend

## Frontend feature structure (MANDATORY)

All frontend work must follow the feature folder layout below. Before creating or
refactoring anything under `src/components`, load the `frontend-feature-structure`
skill (`.claude/skills/frontend-feature-structure/SKILL.md`) and follow it exactly.
Reference implementations: `src/components/auth/Login`, `src/components/admin/Branches`.

```
<Feature>/
├── <Feature>.tsx                ← page container: useForm + yupResolver, FormProvider, data hooks, permissions
├── Form/
│   ├── <Entity>Form.tsx         ← useFormContext only, props from ../types
│   └── <Entity><Field>Field.tsx
├── Schema/index.ts              ← <entity>Schema + <Entity>FormType (Yup.InferType)
├── types/index.ts               ← <Entity>FormProps, <Entity>ViewModalProps, <Entity>FormState
├── <Entity>ViewModal.tsx
├── <Feature>Table.tsx
├── TableColumns/<Entity>Columns.tsx
└── utils/<entity>FormData.ts
```

- Route `page.tsx` in `src/app` only renders the container.
- Domain/API types live in `src/types/<entity>/`, not in the feature's `types/`.
- When touching an older feature that doesn't match, migrate it to this layout.
