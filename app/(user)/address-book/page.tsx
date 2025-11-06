import AddressBookPage from "./AddressClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
export const metadata = {
  title: 'Address Book | MyStore',
  description: 'View the details of your order including products, pricing, and shipping information.',
  openGraph: {
    title: 'Order Details | MyStore',
    description: 'Check the status and details of your order.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order Details | MyStore',
    description: 'Check the status and details of your order.',
  },
};

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
  
    if (!token) {
      const currentUrl = "/address-book";
      redirect(`/login?redirect=${encodeURIComponent(currentUrl)}`);
    }
  return <AddressBookPage />;
}
