import { useEffect, useRef } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { addItem, updateItem, clearHighlight } from "../store/itemsSlice";
import { fetchItemsByIds } from "../services/apiClient";

export function useWebSocket() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.items.items);
  const missingIdsRef = useRef<Set<string>>(new Set());
  const lastFetchRef = useRef<number>(0);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = async (event) => {
      const updates: [string, number, string][] = JSON.parse(event.data);
      const now = Date.now();

      updates.forEach(([id, price, currency]) => {
        if (items[id]) {
          dispatch(updateItem({ id, price, currency }));
          setTimeout(() => dispatch(clearHighlight(id)), 2000);
        } else {
          missingIdsRef.current.add(id);
        }
      });

      if (missingIdsRef.current.size > 0 && now - lastFetchRef.current > 5000) {
        const ids = Array.from(missingIdsRef.current);
        missingIdsRef.current.clear();
        lastFetchRef.current = now;

        try {
          const newItems = await fetchItemsByIds(ids);
          newItems.forEach((item) => {
            const match = updates.find(([updId]) => updId === item.id);
            if (match) {
              const [, price, currency] = match;
              dispatch(addItem({ item, price, currency }));
              setTimeout(() => dispatch(clearHighlight(item.id)), 2000);
            }
          });
        } catch (err) {
          console.error("Failed to fetch missing items:", err);
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [dispatch, items]);
}
