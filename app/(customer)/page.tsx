import BlogSection from "@/components/home/blog-section";
import Categories from "@/components/home/categories";
import FeaturedProducts from "@/components/home/featured-products";
import Hero from "@/components/home/hero";
// import Testimonials from "@/components/home/testimonials";
import ValuePropositions from "@/components/home/value-proposition";
import WhyChooseUs from "@/components/home/why-choose-us";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValuePropositions />
      <FeaturedProducts />
      <WhyChooseUs />
      <Categories />
      <BlogSection />
      {/* <Testimonials /> */}
    </>
  );
}
