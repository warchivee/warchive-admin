import type { Category, Genre, Platform } from "@prisma/client";
import { writable } from "svelte/store";

export const categories = writable<
  (Category & {
    genres: Genre[];
    platforms: Platform[];
  })[]
>([]);

//category
export const addCategory = (addItem: Category) => {
  categories.update((values) => [
    ...values,
    { ...addItem, genres: [], platforms: [] },
  ]);
};

export const updateCategory = (updateItem: Category) => {
  categories.update((values) =>
    values.map((item) =>
      item.id === updateItem.id ? { ...item, ...updateItem } : item
    )
  );
};

export const deleteCategory = (id: number) => {
  categories.update((values) => values.filter((item) => item.id !== id));
};

//genre
export const addGenre = (categoryId: number, addItem: Genre) => {
  categories.update((values) =>
    values.map((item) =>
      item.id === categoryId
        ? { ...item, genres: [...item.genres, addItem] }
        : item
    )
  );
};

export const updateGenre = (categoryId: number, updateItem: Genre) => {
  categories.update((values) =>
    values.map((item) =>
      item.id === categoryId
        ? {
            ...item,
            genres: item?.genres?.map((i) =>
              i.id === updateItem.id ? updateItem : i
            ),
          }
        : item
    )
  );
};

export const deleteGenre = (categoryId: number, id: number) => {
  categories.update((values) =>
    values.map((item) =>
      item.id === categoryId
        ? {
            ...item,
            genres: item?.genres?.filter((i) => i.id !== id),
          }
        : item
    )
  );
};

//platforms
export const addPlatform = (categoryId: number, addItem: Platform) => {
  categories.update((values) =>
    values.map((item) =>
      item.id === categoryId
        ? { ...item, platforms: [...item.platforms, addItem] }
        : item
    )
  );
};

export const updatePlatform = (categoryId: number, updateItem: Platform) => {
  categories.update((values) =>
    values.map((item) =>
      item.id === categoryId
        ? {
            ...item,
            platforms: item?.platforms?.map((i) =>
              i.id === updateItem.id ? updateItem : i
            ),
          }
        : item
    )
  );
};

export const deletePlatform = (categoryId: number, id: number) => {
  categories.update((values) =>
    values.map((item) =>
      item.id === categoryId
        ? {
            ...item,
            platforms: item?.platforms?.filter((i) => i.id !== id),
          }
        : item
    )
  );
};
