import AddressBookPage from "@/components/AddressBook";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
export const metadata = {
  title: `Address Book - ${siteName}`,
};

export default function AddressBook() {
  return <AddressBookPage />;
}
