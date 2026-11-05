// API theke asha product-ke ProductCard component-er expected shape-e convert kore
// Eta DailyEssentials.tsx, PopularProducts.tsx — jekhanei API product -> <ProductCard /> pass korba, shekhane use korba

// import { Product as ApiProduct } from "@/components/shared/ProductModal"; // tomar actual path diyo

// export const mapProductForCard = (p: ApiProduct) => {
//     const currentPrice = p.salePrice && p.salePrice > 0 ? p.salePrice : p.regularPrice;
//     const oldPrice = p.salePrice && p.salePrice > 0 ? p.regularPrice : undefined;

//     return {
//         id: p._id,                 // ProductCard.Product.id ekhon number|string accept kore
//         name: p.name,
//         image: p.thumbnail,
//         price: currentPrice,
//         mrp: oldPrice,
//         originalPrice: oldPrice,
//         discount: p.discountPercent || undefined,
//         rating: p.rating || 0,
//         reviews: p.numReviews || 0,
//         categoryName: p.categoryID?.name,
//     };
// };