import * as Yup from "yup";

export const userRoleSchema = Yup.object({
  roleId: Yup.string().required("Select a role"),
});

export type UserRoleFormType = Yup.InferType<typeof userRoleSchema>;
