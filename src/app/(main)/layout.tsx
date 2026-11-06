


import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MiniCart from "@/components/shared/MiniCart";
import FloatingCartButton from "@/components/shared/FloatingCartButton";
import ComplainModal from "@/components/modals/ComplainModal";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <main className="pt-2">
                {children}
            </main>
            <MiniCart />
            <FloatingCartButton />
            <ComplainModal />
            <Footer />
        </>
    );
}
