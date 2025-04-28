export interface Item {
  id: string;
  name: string;
  description: string;
  type: "food" | "drink";
  cuisineCountry: string;
  createdAt: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isAlcoholic?: boolean;
  price?: number;
  currency?: string;
  lastUpdate?: string;
}
