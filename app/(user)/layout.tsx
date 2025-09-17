import LeftSidebar from "@/components/LeftSidebar";

interface UserSectionLayoutProps {
  children: React.ReactNode;
}

export default function UserSectionLayout({ children }: UserSectionLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 bg-white border-b md:border-r md:border-b-0">
        <LeftSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-2  overflow-auto">{children}</div>
    </div>
  );
}
