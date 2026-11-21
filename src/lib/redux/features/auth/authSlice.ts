import { logout } from "@/src/helpers/auth/session";
import { createSlice } from "@reduxjs/toolkit";
import { IInitialState } from "./authTypes";

const emptyUserInformation = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  phone: null,
  profilePicture: null,
  status: "",
  isVerified: false,
  role: "",
};

const initialState: IInitialState = {
  loading: false,
  userInformation: emptyUserInformation,
  isLoginModalOpen: false,
  data: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      logout();
      state.userInformation = initialState.userInformation;
      state.isLoginModalOpen = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserInformation: (state, action) => {
      state.userInformation = {
        ...initialState.userInformation,
        ...action.payload,
      };
    },
    setUserId: (state, action) => {
      state.userInformation.id = action.payload;
    },
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const {
  setLoading,
  setUserInformation,
  setData,
  logoutUser,
  setUserId,
  openLoginModal,
  closeLoginModal,
} = authSlice.actions;
export default authSlice.reducer;
