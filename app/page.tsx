import Image from "next/image";
import { ProductDetails } from "@/components/features/products";
import { CategoryFilter } from "@/components/features/shopping";
import { FlashSale } from "@/components/features/shopping";
export default function Home() {
  return (
    <>
      <FlashSale></FlashSale>
      <Categories></Categories>
      <Product></Product>
    </>
  );
}
