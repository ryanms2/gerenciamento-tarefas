import { MenuMobile } from "./_components/menu_for_mobile";
import { Sidebar } from "./_components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex h-screen">
       {/* Sidebar for desktop */}
       <Sidebar className="hidden md:flex w-64" />
        {/* Hamburger menu for mobile */}
        <MenuMobile />
      
      {children}
    </div>
    
  );
}