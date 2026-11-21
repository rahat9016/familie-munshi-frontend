"use client";

import { mockCategoriesList } from "@/src/components/admin/Categories/data/mockCategoryHierarchy";
import { mockBranchesList } from "@/src/components/admin/Branches/data/mockBranchData";
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { IStyleProperty, IStylePropertyState } from "./stylePropertyTypes";

const STORAGE_KEY = "styleProperties";

const generateCode = () => `ART-${nanoid(6).toUpperCase()}`;

const defaultCategory = mockCategoriesList[0];
const defaultBranch = mockBranchesList[0];

const getDefaultItems = (): Record<string, IStyleProperty> => {
  const seeds: IStyleProperty[] = [
    {
      code: generateCode(),
      styleType: "Apparel",
      sizeChartTemplate: "Standard Apparel",
      deliveryMonth: "January",
      collectionType: "Main Collection",
      categoryId: defaultCategory?.id ?? "",
      categoryName: defaultCategory?.name ?? "",
      seasonId: "0000-dummy",
      departmentId: "women",
      supplierId: "Square",
      assignedBranchId: defaultBranch?.id ?? "",
      assignedBranchName: defaultBranch?.name ?? "",
      carryOver: false,
      autoProtoSr: true,
      autoSmsSr: false,
      autoFfpSr: false,
      createdAt: new Date().toISOString(),
    },
    {
      code: generateCode(),
      styleType: "Multiple",
      sizeChartTemplate: "Kids",
      deliveryMonth: "March",
      collectionType: "NOOS",
      categoryId: defaultCategory?.id ?? "",
      categoryName: defaultCategory?.name ?? "",
      seasonId: "0000-dummy",
      departmentId: "men",
      supplierId: "Epyllion Group",
      assignedBranchId: defaultBranch?.id ?? "",
      assignedBranchName: defaultBranch?.name ?? "",
      carryOver: true,
      autoProtoSr: true,
      autoSmsSr: true,
      autoFfpSr: false,
      createdAt: new Date().toISOString(),
    },
  ];

  return Object.fromEntries(seeds.map((item) => [item.code, item]));
};

const getInitialState = (): IStylePropertyState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { items: JSON.parse(saved) };
      } catch {
        // ignore corrupted data
      }
    }
  }
  return { items: getDefaultItems() };
};

const persistItems = (items: Record<string, IStyleProperty>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

const stylePropertySlice = createSlice({
  name: "styleProperty",
  initialState: getInitialState(),
  reducers: {
    createProperty: {
      reducer: (state, action: PayloadAction<IStyleProperty>) => {
        state.items[action.payload.code] = action.payload;
        persistItems(state.items);
      },
      prepare: (
        payload: Omit<IStyleProperty, "code" | "createdAt">
      ) => ({
        payload: {
          ...payload,
          code: generateCode(),
          createdAt: new Date().toISOString(),
        },
      }),
    },
  },
});

export const { createProperty } = stylePropertySlice.actions;
export default stylePropertySlice.reducer;
