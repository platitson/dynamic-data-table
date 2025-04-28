import dayjs from "dayjs";

export function formatDate(
  dateStr: string,
  type: "created" | "updated"
): string {
  const date = dayjs(dateStr);
  const now = dayjs();

  if (date.isSame(now, "day")) {
    return type === "created" ? date.format("HH:mm") : date.format("HH:mm:ss");
  }

  if (date.isSame(now, "year")) {
    return date.format("D. M.");
  }

  return date.format("D. M. YYYY");
}
