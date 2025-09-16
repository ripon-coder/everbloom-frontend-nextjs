import Image from "next/image";
import Product from "@/components/Product";
import Categories from "@/components/Categories";
import FlashSale from "@/components/FlashSale";
export default function Home() {
  return (
    <>
      <FlashSale></FlashSale>
      <Categories></Categories>
      <Product></Product>
    </>
  );
}
