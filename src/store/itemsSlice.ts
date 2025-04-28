import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "../types/Item";
interface ItemsState {
  items: Record<string, Item>;
  highlightedIds: Set<string>;
}

const initialState: ItemsState = {
  items: {},
  highlightedIds: new Set(),
};

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    updateItem: (
      state,
      action: PayloadAction<{ id: string; price: number; currency: string }>
    ) => {
      const { id, price, currency } = action.payload;
      const item = state.items[id];
      if (item) {
        state.items[id] = {
          ...item,
          price,
          currency,
          lastUpdate: new Date().toISOString(),
        };
        state.highlightedIds.add(id);
      }
    },
    addItem: (
      state,
      action: PayloadAction<{ item: Item; price: number; currency: string }>
    ) => {
      const { item, price, currency } = action.payload;
      state.items[item.id] = {
        ...item,
        price,
        currency,
        lastUpdate: new Date().toISOString(),
      };
      state.highlightedIds.add(item.id);
    },
    clearHighlight: (state, action: PayloadAction<string>) => {
      state.highlightedIds.delete(action.payload);
    },
  },
});

export const { updateItem, addItem, clearHighlight } = itemsSlice.actions;
export default itemsSlice.reducer;
