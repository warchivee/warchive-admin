import type { Keyword } from "@prisma/client";
import { writable } from "svelte/store";

export const keywords = writable<Keyword[]>([]);

export const addKeyword = (addItem: Keyword) => {
  keywords.update((values) => [addItem, ...values]);
};

export const updateKeyword = (updateItem: Keyword) => {
  keywords.update((values) =>
    values.map((item) => (item.id === updateItem.id ? updateItem : item))
  );
};

export const deleteKeyword = (id: number) => {
  keywords.update((values) => values.filter((item) => item.id !== id));
};
