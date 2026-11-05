export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string | null;
  icon?: string;
  image?: string;
  banner?: string;
  status: string;
  order: number;
  isFeatured: boolean;
  showInHome: boolean;
  showInMenu: boolean;
  metaTitle?: string;
  metaDescription?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  productCount: number;
}

interface HomeCategoryProps {
  initialCategories?: Category[];
}