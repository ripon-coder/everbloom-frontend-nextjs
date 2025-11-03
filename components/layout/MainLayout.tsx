import React from 'react';
import { Header, Footer, Sidebar } from '@/components/layout';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showSidebar = false
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;