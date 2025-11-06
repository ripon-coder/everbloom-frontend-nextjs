import LeftSidebar from "@/components/LeftSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
interface UserSectionLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: `Profile - ${siteName}`,
};

export default async function UserSectionLayout({
  children,
}: UserSectionLayoutProps) {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect(`/login`);
  }

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
