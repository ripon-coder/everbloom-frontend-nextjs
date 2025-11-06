import OrderPage from "./OrderClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My-Orders | MyStore",
  description:
    "View the details of your order including products, pricing, and shipping information.",
  openGraph: {
    title: "Order | MyStore",
    description: "Check the status and details of your order.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Details | MyStore",
    description: "Check the status and details of your order.",
  },
};

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    const currentUrl = "/my-orders";
    redirect(`/login?redirect=${encodeURIComponent(currentUrl)}`);
  }
  return <OrderPage />;
}
