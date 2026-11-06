export interface ICategoryTreeItem {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  parentCategory?: string | null | any;
  children?: ICategoryTreeItem[];
  [key: string]: any;
}

export function buildCategoryTree(categories: any[]): ICategoryTreeItem[] {
  if (!Array.isArray(categories) || categories.length === 0) return [];

  // Check if categories are already structured as a tree
  const hasExistingTree = categories.some(
    (c) => Array.isArray(c.children) && c.children.length > 0
  );
  if (hasExistingTree) {
    // If it's already a tree, ensure only roots are at top level
    return categories.filter(
      (c) => !c.parentCategory || c.parentCategory === "" || c.parentCategory === null
    );
  }

  const map = new Map<string, ICategoryTreeItem>();
  const roots: ICategoryTreeItem[] = [];

  categories.forEach((cat) => {
    map.set(String(cat._id), { ...cat, children: [] });
  });

  categories.forEach((cat) => {
    const node = map.get(String(cat._id))!;
    const parentId =
      cat.parentCategory && typeof cat.parentCategory === "object"
        ? cat.parentCategory._id
        : cat.parentCategory;

    if (parentId && map.has(String(parentId))) {
      map.get(String(parentId))!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}
