import type { Data } from "@/types/ui-types";

export default function buildItemsTree(
  items: Data []
): any[] {
  if (!items) return [];

  const itemMap = new Map();
  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] });
  });
  const rootItems: any[] = [];
  items.forEach((item) => {
    if (item.parent) {
      const parent = itemMap.get(item.parent['id']);
      parent.children.push(itemMap.get(item.id));
    } else {
      rootItems.push(itemMap.get(item.id));
    }
  });
  return rootItems;
}