import { writable } from "svelte/store";
import type { Wata } from "../../routes/data/type";

export const watas = writable<Wata[]>([]);

export const addWata = (addItem: Wata) => {
  watas.update((values) => [addItem, ...values]);
};

export const updateWata = (updateItem: Wata) => {
  watas.update((values) =>
    values.map((item) => (item.id === updateItem.id ? updateItem : item))
  );
};

export const deleteWata = (id: number) => {
  watas.update((values) => values.filter((item) => item.id !== id));
};
