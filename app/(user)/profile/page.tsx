// /app/profile/page.tsx
import Profile from "./ProfileClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "MyStore";

export const metadata = {
  title: `Profile | ${siteName}`,
  description: 'View and edit your profile details including name, email, phone, and profile image.',
  openGraph: {
    title: `Profile | ${siteName}`,
    description: 'Manage your profile information and settings.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Profile | ${siteName}`,
    description: 'Manage your profile information and settings.',
  },
};

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    const currentUrl = "/profile";
    redirect(`/login?redirect=${encodeURIComponent(currentUrl)}`);
  }

  return <Profile />;
}
