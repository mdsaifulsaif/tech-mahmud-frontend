import {
  Hero,
  HomeCategory,
  NewCollection,
  PromotionalBanners,
  PromotionalTwoBanners,
  BottomPromoSection,
  TrendingNow,
} from "@/components/home";
import Faq from "@/components/home/Faq";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HappyCustomers from "@/components/home/Happycustomers";
import TrustedBrands from "@/components/home/Trustedbrands";
import { serverFetch } from "@/services/api";

export default async function Home() {
  const [
    bannersData,
    categoriesData,
    trendingCategoriesData,
    brandsData,
    featuredData,
    newCollectionData,
    reviewsData,
  ] = await Promise.all([
    serverFetch<any>("/banners", { tags: ["banners"] }),
    serverFetch<any>("/categories?status=active&isDeleted=false&limit=20", {
      tags: ["categories"],
    }),
    serverFetch<any>("/categories?isTrending=true&status=active&isDeleted=false&limit=15", {
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
      <FeaturedProducts initialProducts={featuredData?.data} />
      <PromotionalBanners initialBanners={bannersData?.data || []} />
      <NewCollection initialProducts={newCollectionData?.data} />
      <BottomPromoSection initialBanners={bannersData?.data || []} />
      <TrendingNow
        initialBanners={bannersData?.data || []}
        initialTrendingCategories={trendingCategoriesData?.data || []}
        allCategories={categoriesData?.data || []}
      />
      <PromotionalTwoBanners initialBanners={bannersData?.data || []} />



      {/* <TrustedBrands initialBrands={brandsData?.data} /> */}
      {/* <HappyCustomers initialReviews={reviewsData?.data} /> */}
      {/* <Faq /> */}
    </>
  );
}
