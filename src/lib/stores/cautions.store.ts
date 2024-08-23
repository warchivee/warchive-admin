import type { Caution } from "@prisma/client";
import { writable } from "svelte/store";

export const cautions = writable<Caution[]>([]);

export const addCaution = (addItem: Caution) => {
  cautions.update((values) => [addItem, ...values]);
};

export const updateCaution = (updateItem: Caution) => {
  cautions.update((values) =>
    values.map((item) => (item.id === updateItem.id ? updateItem : item))
  );
};

export const deleteCaution = (id: number) => {
  cautions.update((values) => values.filter((item) => item.id !== id));
};
