import OrderDetailsPage from './OrderDetailsClient';

export const metadata = {
  title: 'Order Details | MyStore',
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

export default function Page() {
  return <OrderDetailsPage />;
}
