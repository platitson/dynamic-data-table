import React, { useMemo, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { formatPrice } from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";
import { Item } from "../types/Item";
import { ISO3_TO_ISO2 } from "../utils/countryCodes";

type SortColumn = keyof Item | "price" | "lastUpdate";
type SortDirection = "asc" | "desc";

export const Table: React.FC = () => {
  const items = useAppSelector((state) => state.items.items);
  const highlightedIds = useAppSelector((state) => state.items.highlightedIds);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortColumn>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filteredAndSortedItems = useMemo(() => {
    const arr = Object.values(items);

    const filtered = arr.filter((item) => {
      const text = [
        item.name,
        item.type,
        item.cuisineCountry,
        item.isVegetarian ? "Vegetarian" : "",
        item.isVegan ? "Vegan" : "",
        item.isAlcoholic ? "Alcoholic" : "",
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(filter.toLowerCase());
    });

    const sorted = [...filtered].sort((a, b) => {
      const aValue = (a as any)[sortBy] ?? "";
      const bValue = (b as any)[sortBy] ?? "";

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return sorted;
  }, [items, filter, sortBy, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Type to search..."
        className="border p-2 mb-4 w-full"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-t border-b bg-slate-800">
            {[
              "Name",
              "Type",
              "Cuisine",
              "Tags",
              "Price",
              "Created At",
              "Last Update",
            ].map((header, idx) => (
              <th
                key={idx}
                className="p-2 cursor-pointer"
                onClick={() => handleSort(headerToSortColumn(header))}
              >
                {header}
                {sortBy === headerToSortColumn(header)
                  ? sortDirection === "asc"
                    ? " ⭡"
                    : " ⭣"
                  : " ⮃"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedItems.map((item) => (
            <tr key={item.id} className="border-b hover:bg-slate-600">
              <td className="p-2">{item.name}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-full text-white ${
                    item.type === "food" ? "bg-teal-400" : "bg-cyan-400"
                  }`}
                >
                  {item.type}
                </span>
              </td>
              <td className="p-2">{countryFlag(item.cuisineCountry)}</td>
              <td className="p-2">
                {item.isVegetarian && <Tag text="Vegetarian" />}
                {item.isVegan && <Tag text="Vegan" />}
                {item.isAlcoholic && <Tag text="Alcoholic" />}
              </td>
              <td className="p-2">
                {item.price !== undefined && item.currency
                  ? formatPrice(item.price, item.currency)
                  : "-"}
              </td>
              <td className="p-2">{formatDate(item.createdAt, "created")}</td>
              <td className="p-2">
                <span
                  className={
                    highlightedIds.has(item.id)
                      ? "text-green-500 animate-pulse"
                      : ""
                  }
                >
                  {item.lastUpdate
                    ? formatDate(item.lastUpdate, "updated")
                    : "-"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const headerToSortColumn = (header: string): SortColumn => {
  switch (header) {
    case "Name":
      return "name";
    case "Type":
      return "type";
    case "Cuisine":
      return "cuisineCountry";
    case "Tags":
      return "id"; // no sort by tags
    case "Price":
      return "price";
    case "Created At":
      return "createdAt";
    case "Last Update":
      return "lastUpdate";
    default:
      return "name";
  }
};

const countryFlag = (countryCode: string) => {
  if (!countryCode) return "🏳";
  const iso2 = ISO3_TO_ISO2[countryCode.toUpperCase()] || "";
  if (!iso2) return countryCode;
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
};

const Tag: React.FC<{ text: string }> = ({ text }) => (
  <span
    className={`${
      text === "Alcoholic" ? "bg-rose-800" : "bg-lime-700"
    } "text-white rounded-full px-2 py-0.5 mr-1 text-xs mr-1"`}
  >
    {text}
  </span>
);
