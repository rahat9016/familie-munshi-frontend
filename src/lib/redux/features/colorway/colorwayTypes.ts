import { IGalleryImage } from "@/src/utils/galleryImage";

export interface IColorway {
  code: string;
  name: string;
  colorway: string;
  spec: string;
  description: string;
  standard: string;
  pantone: string;
  colorHex: string;
  /** Primary thumbnail — always `images[0]`, kept flat for the list table. */
  image?: string;
  /** Every image attached to the colorway; the detail page manages the set. */
  images: IGalleryImage[];
  active: boolean;
  inTheme: boolean;
  sustLabelOff: boolean;
  planSms: boolean;
  plan3dSms: boolean;
  actualSms: boolean;
  startDate: string;
  endDate: string;
  clearanceDate: string;
  createdAt: string;
  articleIds: string[];
}

export interface IColorwayState {
  items: Record<string, IColorway>;
}
