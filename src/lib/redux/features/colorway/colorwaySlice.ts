"use client";

import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import {
  IGalleryImage,
  normalizeGalleryImages,
} from "@/src/utils/galleryImage";
import { deleteImage } from "@/src/utils/imageStore";
import { IColorway, IColorwayState } from "./colorwayTypes";

const STORAGE_KEY = "colorways";

const generateCode = () => `CLR-${nanoid(6).toUpperCase()}`;

const getDefaultItems = (): Record<string, IColorway> => {
  const seeds: Omit<
    IColorway,
    "code" | "createdAt" | "articleIds" | "images"
  >[] = [
    {
      name: "yellow",
      colorway: "1015",
      spec: "1015",
      description: "",
      standard: "Pantone",
      pantone: "PANTONE® 11-0616 TCX Pastel Yellow",
      colorHex: "#f3e5ab",
      active: true,
      inTheme: true,
      sustLabelOff: false,
      planSms: true,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
    {
      name: "light blue",
      colorway: "5027",
      spec: "5027",
      description: "",
      standard: "Pantone",
      pantone: "PANTONE® 14-4211 TCX Niagara Mist",
      colorHex: "#9dafb9",
      active: false,
      inTheme: true,
      sustLabelOff: false,
      planSms: false,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
    {
      name: "blue",
      colorway: "5525",
      spec: "5525",
      description: "",
      standard: "Pantone",
      pantone: "PANTONE® 19-4035 TCX Dark Blue",
      colorHex: "#2b4f6b",
      active: true,
      inTheme: true,
      sustLabelOff: false,
      planSms: false,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
    {
      name: "navy",
      colorway: "5978",
      spec: "5978",
      description: "",
      standard: "Pantone",
      pantone: "PANTONE® 19-4020 TCX Dark Sapphire",
      colorHex: "#1c2536",
      active: false,
      inTheme: true,
      sustLabelOff: false,
      planSms: false,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
    {
      name: "beige",
      colorway: "8148",
      spec: "8148",
      description: "",
      standard: "Pantone",
      pantone: "PANTONE® 15-1305 TCX Feather Grey",
      colorHex: "#a79c93",
      active: true,
      inTheme: true,
      sustLabelOff: false,
      planSms: false,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
    {
      name: "dark brown",
      colorway: "8941",
      spec: "8941",
      description: "",
      standard: "Pantone",
      pantone: "PANTONE® 19-1314 TCX Seal",
      colorHex: "#483c32",
      active: true,
      inTheme: true,
      sustLabelOff: false,
      planSms: true,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
  ];

  return Object.fromEntries(
    seeds.map((seed) => {
      const item: IColorway = {
        ...seed,
        code: generateCode(),
        createdAt: new Date().toISOString(),
        articleIds: [],
        images: [],
      };
      return [item.code, item];
    })
  );
};

const getInitialState = (): IColorwayState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: Record<string, IColorway> = JSON.parse(saved);
        Object.values(parsed).forEach((item) => {
          if (!item.articleIds) item.articleIds = [];
          item.images = normalizeGalleryImages(item.images, item.image);
        });
        return { items: parsed };
      } catch {
        // ignore corrupted data
      }
    }
  }
  return { items: getDefaultItems() };
};

const persistItems = (items: Record<string, IColorway>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

export type ColorwayFlag =
  | "active"
  | "inTheme"
  | "sustLabelOff"
  | "planSms"
  | "plan3dSms"
  | "actualSms";

export type ColorwayTextField =
  | "name"
  | "colorHex"
  | "colorway"
  | "spec"
  | "description"
  | "standard"
  | "pantone"
  | "startDate"
  | "endDate"
  | "clearanceDate";

const colorwaySlice = createSlice({
  name: "colorway",
  initialState: getInitialState(),
  reducers: {
    createColorway: {
      reducer: (state, action: PayloadAction<IColorway>) => {
        state.items[action.payload.code] = action.payload;
        persistItems(state.items);
      },
      prepare: (
        payload: Omit<
          IColorway,
          "code" | "createdAt" | "articleIds" | "images"
        >
      ) => ({
        payload: {
          ...payload,
          code: generateCode(),
          createdAt: new Date().toISOString(),
          articleIds: [],
          images: [],
        },
      }),
    },
    mapColorwayToArticle: (
      state,
      action: PayloadAction<{ code: string; articleId: string }>
    ) => {
      const item = state.items[action.payload.code];
      if (item && !item.articleIds.includes(action.payload.articleId)) {
        item.articleIds.push(action.payload.articleId);
        persistItems(state.items);
      }
    },
    unmapColorwayFromArticle: (
      state,
      action: PayloadAction<{ code: string; articleId: string }>
    ) => {
      const item = state.items[action.payload.code];
      if (item) {
        item.articleIds = item.articleIds.filter((id) => id !== action.payload.articleId);
        persistItems(state.items);
      }
    },
    setColorwayFlag: (
      state,
      action: PayloadAction<{ code: string; field: ColorwayFlag; value: boolean }>
    ) => {
      const item = state.items[action.payload.code];
      if (item) {
        item[action.payload.field] = action.payload.value;
        persistItems(state.items);
      }
    },
    /** Replaces the thumbnail — what the list table's image cell does. */
    setColorwayImage: (
      state,
      action: PayloadAction<{ code: string; image: IGalleryImage }>
    ) => {
      const item = state.items[action.payload.code];
      if (!item) return;
      const [replaced, ...rest] = item.images;
      if (replaced?.id) deleteImage(replaced.id);
      item.images = [action.payload.image, ...rest];
      item.image = action.payload.image.thumbnail;
      persistItems(state.items);
    },
    /** Appends dropped/selected images; the first one stays the thumbnail. */
    addColorwayImages: (
      state,
      action: PayloadAction<{ code: string; images: IGalleryImage[] }>
    ) => {
      const item = state.items[action.payload.code];
      if (!item || action.payload.images.length === 0) return;
      item.images = [...item.images, ...action.payload.images];
      item.image = item.images[0].thumbnail;
      persistItems(state.items);
    },
    removeColorwayImage: (
      state,
      action: PayloadAction<{ code: string; index: number }>
    ) => {
      const item = state.items[action.payload.code];
      if (!item) return;
      const removed = item.images[action.payload.index];
      if (removed?.id) deleteImage(removed.id);
      item.images = item.images.filter((_, i) => i !== action.payload.index);
      item.image = item.images[0]?.thumbnail ?? "";
      persistItems(state.items);
    },
    setPrimaryColorwayImage: (
      state,
      action: PayloadAction<{ code: string; index: number }>
    ) => {
      const item = state.items[action.payload.code];
      const picked = item?.images[action.payload.index];
      if (!item || !picked) return;
      item.images = [
        picked,
        ...item.images.filter((_, i) => i !== action.payload.index),
      ];
      item.image = picked.thumbnail;
      persistItems(state.items);
    },
    setColorwayField: (
      state,
      action: PayloadAction<{ code: string; field: ColorwayTextField; value: string }>
    ) => {
      const item = state.items[action.payload.code];
      if (item) {
        item[action.payload.field] = action.payload.value;
        persistItems(state.items);
      }
    },
  },
});

export const {
  createColorway,
  setColorwayFlag,
  setColorwayImage,
  addColorwayImages,
  removeColorwayImage,
  setPrimaryColorwayImage,
  setColorwayField,
  mapColorwayToArticle,
  unmapColorwayFromArticle,
} = colorwaySlice.actions;
export default colorwaySlice.reducer;
