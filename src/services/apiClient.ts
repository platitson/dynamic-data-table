import { Item } from "../types/Item";

export async function fetchItemsByIds(ids: string[]): Promise<Item[]> {
  const params = ids.map((id) => `id=${id}`).join("&");
  const res = await fetch(`http://localhost:3000/items?${params}`);
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}
