// Glasses, shoes, shirt, pants, hat, lipstick.
import { useEffect } from "react";
import CategoryItems from "../components/CategoryItems";
import { useProductStore } from "../store/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
const category = [
  { href: "/bags", name: "Bags", imageUrl: "/tuixach.png" },
  { href: "/shirt", name: "Shirt", imageUrl: "/áo.jpg" },
  { href: "/pants", name: "Pants", imageUrl: "/quần.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/giày.jpg" },
  { href: "/hat", name: "Hat", imageUrl: "/nón.jpg" },
  { href: "/lipstick", name: "Lipstick", imageUrl: "/son.jpg" },
];
const HomePage = () => {
  const { fetchFeaturedProducts, products, loading } = useProductStore();
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-y-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-3xl sm:text-6xl font-bold text-pink-300 mb-4 ">
          Explore Our Categoies
        </h1>
        <p className="text-center text-xl mb-12 text-pink-200">
          Discover the latest trends in eco-friendly fashion
        </p>
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {category.map((cate) => (
            <CategoryItems cate={cate} key={cate.name} />
          ))}
        </div>

        {!loading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}

      </div>
    </div>
  );
};

export default HomePage;
