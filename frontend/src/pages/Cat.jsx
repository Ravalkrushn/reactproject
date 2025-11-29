import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";
import "../styles/dog.css";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import BackButton from "../components/BackButton";
import FooterNavbar from "../components/FooterNavbar";
import { useNavigate } from "react-router-dom";
import Comments from "../components/Comments";

function Cat() {
  useEffect(() => {
    localStorage.setItem("cartSource", "cat");
  }, []);

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const productSectionRef = useRef(null);
  const [cart, setCart] = useState({});
  const [message, setMessage] = useState(null);

  const categories = [
    {
      key: "Cat Food",
      label: "Cat Food",
      img: "/img/catfood1.webp",
    },
    {
      key: "Toys & Accessories",
      label: "Toys & Accessories",
      img: "/img/cattoy1.webp",
    },
    {
      key: "Grooming Products",
      label: "Grooming Products",
      img: "/img/catgrooming.webp",
    },
    {
      key: "Clothing & Collars",
      label: "Clothing & Collars",
      img: "/img/catclothing.webp",
    },
  ];

  // CATEGORY MAPPING
  const categoryMap = {
    "Cat Food": "Cat Food",
    "Toys & Accessories": "Cat Toy",
    "Grooming Products": "Cat Grooming",
    "Clothing & Collars": "Cat Clothing",
  };

  // PAGE LOAD PAR DATA MAT LAO
  useEffect(() => {
    setProducts([]);
  }, []);

  function getImageUrl(imagePath) {
    if (!imagePath) return "/img/placeholder.png";
    const base = process.env.REACT_APP_API_URL || "http://localhost:5000";
    return `${base}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  }

  async function fetchProducts({ category, scrollToProducts = false } = {}) {
    try {
      setLoading(true);

      const params = {
        status: "approved",
      };

      if (category) {
        params.category = category;
      }

      const res = await api.get("/products", { params });

      if (res.data && res.data.success) {
        const withQty = res.data.products.map((p) => ({
          ...p,
          cartQty: 1,
        }));
        setProducts(withQty);
      } else {
        setProducts([]);
      }

      setLoading(false);

      if (scrollToProducts && productSectionRef.current) {
        productSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
      setLoading(false);
      setMessage("Unable to load products. Try again later.");
      setTimeout(() => setMessage(null), 4000);
    }
  }

  function handleShopHere() {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleCategoryClick(cat) {
    setActiveCategory(cat.label);

    const backendCategory = categoryMap[cat.label];

    fetchProducts({
      category: backendCategory,
      scrollToProducts: true,
    });
  }

  function changeCardQty(productId, delta) {
    setProducts((prev) =>
      prev.map((p) => {
        if (p._id !== productId) return p;
        const newQty = Math.max(1, (p.cartQty || 1) + delta);
        return { ...p, cartQty: newQty };
      })
    );
  }

  function handleAddToCart(product) {
    localStorage.setItem("cartSource", "cat");

    const qtyToAdd = product.cartQty || 1;

    // 1) LOAD
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    const storedProducts =
      JSON.parse(localStorage.getItem("cartProducts")) || [];

    // 2) CART QUANTITY UPDATE
    const existingQty = storedCart[product._id] || 0;
    storedCart[product._id] = existingQty + qtyToAdd;

    // 3) ADD PRODUCT
    const already = storedProducts.find((p) => p._id === product._id);
    if (!already) {
      storedProducts.push(product);
    }

    // 4) SAVE TO LOCALSTORAGE
    localStorage.setItem("cart", JSON.stringify(storedCart));
    localStorage.setItem("cartProducts", JSON.stringify(storedProducts));

    setCart(storedCart);
    // ⭐ NAVBAR CART COUNT FIX
    const flatItems = Object.values(storedCart).reduce(
      (total, qty) => total + qty,
      0
    );
    localStorage.setItem(
      "cartItems",
      JSON.stringify(new Array(flatItems).fill(0))
    );

    // ⭐ FIRE EVENT FOR INDEX NAVBAR
    window.dispatchEvent(new Event("cartUpdated"));

    // 5) MESSAGE
    setMessage(`${qtyToAdd} × ${product.product_name} added to cart`);
    setTimeout(() => setMessage(null), 2500);

    // 6) UI STOCK UPDATE (CORRECT)
    // 6) UI STOCK UPDATE (CORRECT)
    setProducts((prev) =>
      prev.map((p) =>
        p._id === product._id
          ? { ...p, stock: Math.max(0, p.stock - qtyToAdd) }
          : p
      )
    );

    // ⭐⭐⭐ VERY IMPORTANT — NAVBAR CART UPDATE EVENT
    window.dispatchEvent(new Event("cartUpdated"));
  }

  return (
    <>
      <BackButton />

      <div
        className="global-cart-counter"
        onClick={() => {
          localStorage.setItem("cartSource", "cat");
          navigate("/cart");
        }}
        style={{ cursor: "pointer" }}
      >
        <FaShoppingCart className="gcc-icon" />
        <span className="gcc-badge">
          {Object.values(cart).reduce((a, b) => a + b, 0)}
        </span>
      </div>

      <div className="dog-page">
        {/* HERO SECTION */}
        <section
          className="dog-hero"
          style={{
            background:
              'linear-gradient(rgba(8,8,8,0.45), rgba(8,8,8,0.45)), url("/img/allcat.jpg") center/cover no-repeat',
          }}
        >
          <div className="hero-inner">
            <h1>All Things for Your Cat</h1>
            <p>
              Find everything your cat needs — food, toys, grooming, and more.
            </p>
            <button className="shop-btn" onClick={handleShopHere}>
              Shop Here
            </button>
          </div>
        </section>

        {/* CATEGORY SECTION */}
        <section className="dog-products" ref={productSectionRef}>
          <div className="container1">
            <h2 className="section-title1">Shop by Category</h2>

            <div className="category-row">
              {categories.map((cat) => (
                <div
                  key={cat.key}
                  className="category-card"
                  onClick={() => handleCategoryClick(cat)}
                >
                  <img src={cat.img} alt={cat.label} className="cat-img" />
                  <h3>{cat.label}</h3>
                </div>
              ))}
            </div>

            {/* PRODUCTS SECTION */}
            <div className="products-wrap">
              <h2 className="products-title">
                {activeCategory || "Featured Cat Products"}
              </h2>

              {message && (
                <div className="toast enhanced-toast">
                  <FaShoppingCart className="toast-cart-icon" />
                  <span>{message}</span>
                </div>
              )}

              {loading ? (
                <div className="loader">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="no-products">No products available</div>
              ) : (
                <div className="product-grid">
                  {products.map((item) => (
                    <article key={item._id} className="product-card fade-in">
                      <div className="product-image-wrapper">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.product_name}
                        />
                      </div>

                      <div className="product-body">
                        <h3 className="product-title">{item.product_name}</h3>
                        <p className="product-desc">{item.description}</p>

                        <div className="product-meta">
                          <div className="price">₹{item.price}</div>

                          {/* ⭐ CORRECT STOCK DISPLAY */}
                          <div className="stock">Stock: {item.stock}</div>
                        </div>

                        <div className="cart-row">
                          <button
                            className="qty-btn"
                            onClick={() => changeCardQty(item._id, -1)}
                          >
                            <FaMinus />
                          </button>

                          <div className="cart-qty">{item.cartQty || 1}</div>

                          <button
                            className="qty-btn"
                            onClick={() => changeCardQty(item._id, +1)}
                          >
                            <FaPlus />
                          </button>

                          <button
                            className="add-btn"
                            onClick={() => handleAddToCart(item)}
                          >
                            <FaShoppingCart style={{ marginRight: 8 }} />
                            Add to Cart
                          </button>
                        </div>
                        {/* COMMENT SECTION */}
                        <Comments
                          productId={item._id}
                          productName={item.product_name}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <FooterNavbar />
    </>
  );
}

export default Cat;
