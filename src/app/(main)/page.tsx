import { Hero, HomeCategory, NewCollection, TrendingNow } from "@/components/home";
import Faq from "@/components/home/Faq";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HappyCustomers from "@/components/home/Happycustomers";
import TrustedBrands from "@/components/home/Trustedbrands";
import { serverFetch } from "@/services/api";

export default async function Home() {
  const [
    bannersData,
    categoriesData,
    homeCategoriesData,
    brandsData,
    featuredData,
    newCollectionData,
    reviewsData,
  ] = await Promise.all([
    serverFetch<any>("/banners", { tags: ["banners"] }),
    serverFetch<any>("/categories?status=active&isDeleted=false&limit=20", {
      tags: ["categories"],
    }),
    serverFetch<any>("/categories?showInHome=true&status=active&isDeleted=false&limit=6", {
      tags: ["categories"],
    }),
    serverFetch<any>("/brands?status=active&isDeleted=false&limit=30", {
      tags: ["brands"],
    }),
    serverFetch<any>("/products/featured?limit=12", { tags: ["products"] }),
    serverFetch<any>("/products/new-collection?limit=12", { tags: ["products"] }),
    serverFetch<any>("/reviews/featured?limit=10", { tags: ["reviews"] }),
  ]);

  return (
    <>
      <Hero initialBanners={bannersData?.data || []} />
      <HomeCategory initialCategories={categoriesData?.data} />
      <NewCollection initialProducts={newCollectionData?.data} />
      <TrendingNow
        initialBanners={bannersData?.data || []}
        initialHomeCategories={homeCategoriesData?.data || []}
        allCategories={categoriesData?.data || []}
      />
      <FeaturedProducts initialProducts={featuredData?.data} />

      {/* <TrustedBrands initialBrands={brandsData?.data} /> */}
      {/* <HappyCustomers initialReviews={reviewsData?.data} /> */}
      {/* <Faq /> */}
    </>
  );
}
