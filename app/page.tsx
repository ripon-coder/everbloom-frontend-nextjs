import Image from "next/image";
import Product from "@/components/Product";
import Categories from "@/components/Categories";
export default function Home() {
  return (
    <>
      <Categories></Categories>
      <Product></Product>
    </>
  );
}
