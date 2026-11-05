// "use client";

// import React, { useState, useEffect } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, FreeMode } from "swiper/modules";
// import ProductCard from "../shared/ProductCard";
// import ProductModal from "../shared/ProductModal";
// import "swiper/css";

// // Skeleton Loader
// const SkeletonLoader = () => (
//   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
//     {Array.from({ length: 6 }).map((_, index) => (
//       <div key={index} className="bg-white rounded-xl md:rounded-2xl border border-gray-100 animate-pulse">
//         <div className="aspect-square bg-gray-200 rounded-t-xl md:rounded-t-2xl" />
//         <div className="p-2 md:p-4 space-y-2">
//           <div className="h-4 bg-gray-200 rounded w-3/4" />
//           <div className="h-3 bg-gray-200 rounded w-1/2" />
//           <div className="flex justify-between items-center pt-2">
//             <div className="h-4 bg-gray-200 rounded w-1/3" />
//             <div className="h-4 bg-gray-200 rounded w-1/4" />
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// interface ComboProductsProps {
//   initialProducts?: any[];
// }

// const ComboProducts: React.FC<ComboProductsProps> = ({ initialProducts = [] }) => {
//   const [isMounted, setIsMounted] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const handleQuickView = (product: any) => {
//     setSelectedProduct(product);
//   };

//   const closeModal = () => {
//     setSelectedProduct(null);
//   };

//   if (!isMounted) {
//     return (
//       <section className="py-8 md:py-12 bg-[var(--color-background)]">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-6 md:mb-8">
//             <span className="inline-block mb-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
//               🔥 COMBO DEALS
//             </span>
//             <h2 className="text-xl md:text-3xl font-bold text-[var(--color-text-primary)]">
//               Combo Offers
//             </h2>
//             <p className="text-sm text-[var(--color-text-muted)] mt-1">
//               Save more with our special combo deals
//             </p>
//           </div>
//           <SkeletonLoader />
//         </div>
//       </section>
//     );
//   }

//   if (!initialProducts || initialProducts.length === 0) {
//     return null;
//   }

//   return (
//     <section className="py-8 md:py-12 bg-[var(--color-background)]">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-6 md:mb-8">
//           <span className="inline-block mb-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
//             🔥 COMBO DEALS
//           </span>
//           <h2 className="text-xl md:text-3xl font-bold text-[var(--color-text-primary)]">
//             Combo Offers
//           </h2>
//           <p className="text-sm text-[var(--color-text-muted)] mt-1">
//             Save more with our special combo deals
//           </p>
//         </div>

//         {/* Combo Products Slider */}
//         <div className="-mx-2 md:-mx-4">
//           <Swiper
//             modules={[Autoplay, FreeMode]}
//             spaceBetween={12}
//             slidesPerView={2}
//             breakpoints={{
//               480: { slidesPerView: 2, spaceBetween: 12 },
//               640: { slidesPerView: 3, spaceBetween: 16 },
//               768: { slidesPerView: 4, spaceBetween: 16 },
//               1024: { slidesPerView: 5, spaceBetween: 20 },
//               1280: { slidesPerView: 6, spaceBetween: 24 },
//             }}
//             loop={true}
//             autoplay={{
//               delay: 3000,
//               disableOnInteraction: false,
//               pauseOnMouseEnter: true,
//               waitForTransition: true,
//             }}
//             speed={800}
//             freeMode={true}
//             grabCursor={true}
//             className="combo-products-swiper"
//           >
//             {initialProducts.map((product: any) => (
//               <SwiperSlide key={product._id}>
//                 <div className="relative">
                  
//                   <ProductCard
//                     product={product}
//                     onQuickView={() => handleQuickView(product)}
//                   />
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>

//       {/* Quick View Modal */}
//       {selectedProduct && (
//         <ProductModal product={selectedProduct} onClose={closeModal} />
//       )}
//     </section>
//   );
// };

// export default ComboProducts;


"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import ProductCard from "../shared/ProductCard";
import ProductModal from "../shared/ProductModal";
import "swiper/css";
import SectionHeader from "../shared/SectionHeader";
import { BiLeaf } from "react-icons/bi";

// Skeleton Loader
const SkeletonLoader = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-white rounded-xl md:rounded-2xl border border-gray-100 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-t-xl md:rounded-t-2xl" />
        <div className="p-2 md:p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

interface ComboProductsProps {
  initialProducts?: any[];
}

const ComboProducts: React.FC<ComboProductsProps> = ({ initialProducts = [] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const displayProducts = React.useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) return [];
    if (initialProducts.length <= 6) {
      return [...initialProducts, ...initialProducts];
    }
    return initialProducts;
  }, [initialProducts]);

  const handleSeeAll = () => {
    router.push("/search?type=combo");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  if (!isMounted) {
    return (
      <section className="py-6 sm:py-8 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Combo Products"
            icon={<BiLeaf size={18} />}
            actionLabel="See all"
            onAction={handleSeeAll}
          />
          <div className="mt-2">
            <SkeletonLoader />
          </div>
        </div>
      </section>
    );
  }

  if (!initialProducts || initialProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Combo Products"
          icon={<BiLeaf size={18} />}
          actionLabel="See all"
          onAction={handleSeeAll}
        />

        {/* Combo Products Slider - Mobile 3 items */}
        <div className="-mx-2 mt-2 md:-mx-4">
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={8}
            slidesPerView={3}
            centeredSlides={false}
            breakpoints={{
              320: { 
                slidesPerView: 3, 
                spaceBetween: 6,
                centeredSlides: false,
              },
              360: { 
                slidesPerView: 3, 
                spaceBetween: 8,
                centeredSlides: false,
              },
              480: { 
                slidesPerView: 3, 
                spaceBetween: 10,
                centeredSlides: false,
              },
              640: { 
                slidesPerView: 4, 
                spaceBetween: 14,
                centeredSlides: false,
              },
              768: { 
                slidesPerView: 4, 
                spaceBetween: 16,
                centeredSlides: false,
              },
              1024: { 
                slidesPerView: 5, 
                spaceBetween: 20,
                centeredSlides: false,
              },
              1280: { 
                slidesPerView: 6, 
                spaceBetween: 24,
                centeredSlides: false,
              },
            }}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              waitForTransition: true,
            }}
            speed={800}
            freeMode={true}
            grabCursor={true}
            slideToClickedSlide={false}
            className="combo-products-swiper"
          >
            {displayProducts.map((product: any, idx: number) => (
              <SwiperSlide key={`${product._id}-${idx}`}>
                <div className="px-0.5">
                  <ProductCard
                    product={product}
                    onQuickView={() => handleQuickView(product)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

     
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </section>
  );
};

export default ComboProducts;