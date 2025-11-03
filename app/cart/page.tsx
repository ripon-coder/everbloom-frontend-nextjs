import Cart from "@/components/Cart";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
export const metadata = {
  title: `Cart - ${siteName}`,
};


export default function CheckoutPage() {
  return <Cart />;
}
