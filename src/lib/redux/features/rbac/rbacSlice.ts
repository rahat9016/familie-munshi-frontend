import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRbacState } from "./rbacTypes";

const initialState: IRbacState = {
  loaded: false,
  user: {
    id: "",
    isSuperAdmin: false,
    roleName: null,
    branchId: null,
    scope: null,
    roles: [],
  },
  permissions: {},
  permissionNames: [],
};

const rbacSlice = createSlice({
  name: "rbac",
  initialState,
  reducers: {
    // Hydrated from GET /permissions/me
    setRbacPermissions: (
      state,
      action: PayloadAction<Omit<IRbacState, "loaded">>
    ) => {
      state.user = action.payload.user;
      state.permissions = action.payload.permissions;
      state.permissionNames = action.payload.permissionNames;
      state.loaded = true;
    },
    clearRbacPermissions: () => initialState,
  },
});

export const { setRbacPermissions, clearRbacPermissions } = rbacSlice.actions;
export default rbacSlice.reducer;
