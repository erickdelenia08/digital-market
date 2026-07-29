import BlogSection from "@/components/home/blog-section";
import Categories from "@/components/home/categories";
import FeaturedProducts from "@/components/home/featured-products";
import Hero from "@/components/home/hero";
import ValuePropositions from "@/components/home/value-proposition";
import WhyChooseUs from "@/components/home/why-choose-us";
import { getCategories } from "../actions/product-actions";

export default async function HomePage() {
  const categoriesRes = await getCategories();
  const categoriesData = categoriesRes.success ? categoriesRes.data : [];
  return (
    <>
      <Hero />
      <ValuePropositions />
      <FeaturedProducts />
      <WhyChooseUs />
      <Categories categories={categoriesData} />
      <BlogSection />
    </>
  );
}
