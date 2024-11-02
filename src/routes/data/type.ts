import { type Wata as PrismaWata } from "@prisma/client";

export type Keyword = {
  id: number;
  name: string;
};

export type Genre = Keyword & {
  category: Keyword;
};

export type Platform = Keyword & {
  url?: string | null;
  domain?: string | null;
};

export type Wata = PrismaWata & {
  thumbnailCard?: ThumbnailCropArea | null;
  thumbnailBook?: ThumbnailCropArea | null;
  genre?: Genre;
  keywords: Keyword[];
  cautions: Keyword[];
  platforms: Platform[];
  adder?: {
    id: number;
    nickname: string;
  };
  updater?: {
    id: number;
    nickname: string;
  };
  updatedAt?: Date;
  createdAt?: Date;
};

export type ThumbnailCropArea = {
  w: number;
  h: number;
  x: number;
  y: number;
};
