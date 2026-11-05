


// // "use client";
// // import { usePathname } from "next/navigation";
// // import TopNavbar from "@/components/layout/Header/TopNavber";
// // // import SidebarCategories from "@/components/shared/SidebarCategories";
// // import SidebarCategories from "@/components/shared/SidebarCategories";
// // import { useState } from "react";
// // import Footer from "./Footer";

// // export default function LayoutShell({ children }: { children: React.ReactNode }) {
// //   const [desktopOpen, setDesktopOpen] = useState(true);
// //   const [mobileOpen, setMobileOpen] = useState(false);

// //   const pathname = usePathname();
// //   const isHome = pathname === "/";

// //   return (
// //     <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
// //       <TopNavbar
// //         onToggleDesktop={() => setDesktopOpen(!desktopOpen)}
// //         onToggleMobile={() => setMobileOpen(!mobileOpen)}
// //       />
// //       <div className="flex flex-1 overflow-hidden relative">

// //         {/* SidebarCategories সবসময় render হবে
// //             — desktop: home এ desktopOpen=false পাঠাই তাই hidden
// //             — mobile: সব route এ drawer কাজ করে */}
// //         <SidebarCategories
// //           desktopOpen={isHome ? false : desktopOpen}
// //           mobileOpen={mobileOpen}
// //           onMobileClose={() => setMobileOpen(false)}
// //         />

// //         {/* Overlay — mobile এ সব route এ */}
// //         {mobileOpen && (
// //           <div
// //             className="fixed inset-0 bg-black/40 z-30 md:hidden"
// //             onClick={() => setMobileOpen(false)}
// //           />
// //         )}

// //         <main className="flex-1 overflow-y-auto p-3 md:p-2">{children}</main>


// //       </div>
// //     </div>
// //   );
// // }




// "use client";
// import { usePathname } from "next/navigation";
// import TopNavbar from "@/components/layout/Header/TopNavber";
// import SidebarCategories from "@/components/shared/SidebarCategories";
// import { useState } from "react";

// export default function LayoutShell({ children }: { children: React.ReactNode }) {
//   const [desktopOpen, setDesktopOpen] = useState(true);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const pathname = usePathname();
//   const isHome = pathname === "/";

//   return (
//     // h-screen ব্যবহার করুন, 90vh নয়।
//     <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      
//       {/* Navbar কন্টেইনার */}
//       <div className="flex-shrink-0">
//         <TopNavbar
//           onToggleDesktop={() => setDesktopOpen(!desktopOpen)}
//           onToggleMobile={() => setMobileOpen(!mobileOpen)}
//         />
//       </div>
      
//       {/* 
//          Main Container: 
//          h-[calc(100vh-হেডারের_উচ্চতা)] এভাবে দেওয়ার দরকার নেই।
//          উপরে flex-col এবং flex-1 ব্যবহার করলে এটি অটোমেটিক 
//          হেডারের নিচের বাকি পুরো জায়গাটা দখল করে নেবে। 
//       */}
//       <div className="flex flex-1 overflow-hidden relative">
//         <SidebarCategories
//           desktopOpen={isHome ? false : desktopOpen}
//           mobileOpen={mobileOpen}
//           onMobileClose={() => setMobileOpen(false)}
//         />

//         <main className="flex-1 h-full overflow-y-auto p-3">
//           {children}
//         </main>
//       </div>

//       {mobileOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-30 md:hidden"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}
//     </div>
//   );
// }
