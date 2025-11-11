import CheckoutForm from "@/components/Checkout/CheckoutForm";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
export const metadata = {
  title: `Checkout - ${siteName}`,
};


export default function CheckoutPage() {
  return <CheckoutForm />;
}
