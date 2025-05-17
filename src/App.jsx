import { useEffect, useState } from "react";
import throttle from "lodash/throttle";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://dummyjson.com/products?limit=${page * 10}`
      );
      const data = await res.json();
      setProducts(data);
      setPage(page + 1);
    } catch (error) {
      console.error("Error fetching data ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = throttle(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 500 >
        document.documentElement.offsetHeight &&
      !loading &&
      products.limit < products.total
    ) {
      fetchProducts();
    }
  }, 500);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const { products: allProducts } = products;

  return (
    <div>
      {allProducts?.length > 0 && (
        <div className="products">
          {allProducts.map((product) => (
            <div
              className="product-single"
              key={product.id}
            >
              <img
                src={product.thumbnail}
                alt={product.title}
              />
              <span>{product.title}</span>
            </div>
          ))}
        </div>
      )}
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default App;
