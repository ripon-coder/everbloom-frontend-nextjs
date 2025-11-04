import AddressBookPage from "./AddressClient";
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

export default function AddressBook() {
  return <AddressBookPage />;
}
