import * as Yup from "yup";

export const rolePermissionsSchema = Yup.object({
  permissionCodes: Yup.array(Yup.string().required())
    .required()
    .min(1, "Select at least one permission")
    .max(100, "You can assign at most 100 permissions at once"),
});

export type RolePermissionsFormType = Yup.InferType<
  typeof rolePermissionsSchema
>;
