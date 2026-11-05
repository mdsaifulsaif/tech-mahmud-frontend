// import React from 'react';
// import Header from "@/components/layout/Header";
// import SidebarCategories from "@/components/shared/SidebarCategories";
// import MiniCart from '@/components/shared/MiniCart';
// import FloatingCartButton from '@/components/shared/FloatingCartButton';

// export default function ShopLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     return (
//         <div className="min-h-screen">
//             {/* Header - পুরো width জুড়ে top-এ, একবারই */}
//             <Header />

//             <div className="flex">
//                 {/* Static Sidebar (Desktop) */}
//                 <div
//                     className="hidden md:block w-[200px] lg:w-[200px] flex-shrink-0 sticky overflow-y-auto border-r border-gray-100 bg-white custom-scrollbar z-30"
//                     style={{
//                         top: "var(--header-height, 74px)",
//                         height: "calc(100vh - var(--header-height, 74px))",
//                     }}
//                 >
//                     <SidebarCategories />
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex-1 min-w-0">
//                     {children}
//                 </div>
//             </div>

//             <MiniCart />
//             <FloatingCartButton />
//         </div>
//     );
// }



import React from 'react';
import Header from "@/components/layout/Header";
import SidebarCategories from "@/components/shared/SidebarCategories";
import MiniCart from '@/components/shared/MiniCart';
import FloatingCartButton from '@/components/shared/FloatingCartButton';
import WhatsAppLiveChat from '@/components/chat/WhatsAppLiveChat';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            {/* Header - পুরো width জুড়ে top-এ, একবারই */}
            <Header />

            <div className="flex items-start bg-white min-h-screen container">
                {/* Static Sidebar */}
                <aside
                    className="hidden md:block w-[200px] lg:w-[200px] flex-shrink-0 sticky overflow-y-auto border-r border-gray-100 bg-white custom-scrollbar z-30"
                    style={{
                        top: "var(--header-height, 74px)",
                        height: "calc(100vh - var(--header-height, 74px))",
                    }}
                >
                    <SidebarCategories />
                </aside>

                {/* Right Side - Page Content */}
                <div className="flex-1 min-w-0  px-3">
                    {children}
                </div>
            </div>

            <MiniCart />
            <FloatingCartButton />
            <WhatsAppLiveChat />
        </div>
    );
}