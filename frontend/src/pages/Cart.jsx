import React, { useEffect, useState, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "../styles/cart.css";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import BillComponent from "../components/BillComponent";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [checkoutMode, setCheckoutMode] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const billRef = useRef(null);

  // Load cart
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    const storedProducts =
      JSON.parse(localStorage.getItem("cartProducts")) || [];

    setCart(storedCart);
    setProducts(storedProducts);
  }, []);

  // ⭐ CALCULATE CART ITEMS FOR NAVBAR
  const updateNavbarCart = (updatedCart) => {
    const totalItems = Object.values(updatedCart).reduce((a, b) => a + b, 0);
    localStorage.setItem(
      "cartItems",
      JSON.stringify(new Array(totalItems).fill(0))
    );
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Calculate total
  const calculateTotal = () => {
    return products.reduce((total, item) => {
      const qty = cart[item._id] || 1;
      return total + item.price * qty;
    }, 0);
  };

  // Update quantity
  const updateQty = (id, delta) => {
    setCart((prev) => {
      const newQty = Math.max(1, (prev[id] || 1) + delta);
      const updated = { ...prev, [id]: newQty };
      localStorage.setItem("cart", JSON.stringify(updated));

      // ⭐ ADDED — NAVBAR UPDATE
      updateNavbarCart(updated);

      return updated;
    });
  };

  // Remove item
  const removeItem = (id) => {
    const updatedCart = { ...cart };
    delete updatedCart[id];

    const updatedProducts = products.filter((p) => p._id !== id);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("cartProducts", JSON.stringify(updatedProducts));

    setCart(updatedCart);
    setProducts(updatedProducts);

    // ⭐ ADDED — NAVBAR UPDATE
    updateNavbarCart(updatedCart);
  };

  // SUBMIT ORDER
  const submitOrder = async () => {
    try {
      const orderData = {
        customer_name: fullName,
        phone: phone,
        address: address,
        payment_method: paymentMethod,
        items: products.map((p) => {
          const qty = cart[p._id];
          return {
            product_id: p._id,
            product_name: p.product_name,
            quantity: qty,
            price: p.price,
            subtotal: p.price * qty,
          };
        }),
        total: calculateTotal(),
      };

      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        for (let p of products) {
          await fetch("http://localhost:5000/api/products/update-stock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: p._id,
              quantity: cart[p._id],
            }),
          });
        }

        // ⭐ CLEAR CART AFTER ORDER
        localStorage.removeItem("cart");
        localStorage.removeItem("cartProducts");

        // ⭐ NAVBAR COUNT = 0
        updateNavbarCart({});

        setOrderPlaced(true);
      } else {
        alert("Order failed!");
      }
    } catch (error) {
      console.log("Order Error:", error);
      alert("Server Error");
    }
  };

  // -----------------------------------------------------
  //   AFTER ORDER PLACED → SUCCESS + BILL
  // -----------------------------------------------------
  if (orderPlaced) {
    return (
      <div className="cart-wrapper">
        <div className="cart-container" style={{ textAlign: "center" }}>
          <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
            <BillComponent
              ref={billRef}
              fullName={fullName}
              phone={phone}
              address={address}
              paymentMethod={paymentMethod}
              products={products}
              cart={cart}
              total={calculateTotal()}
            />
          </div>

          <img
            src="/img/right-mark-symbol-png-2.png"
            alt="success"
            style={{
              width: "120px", // ⭐ Change size here
              height: "120px", // ⭐ Change size here
              objectFit: "contain", // ⭐ Image clean rahega
            }}
          />
          <h2>Your Order has been Placed!</h2>

          <button
            className="confirm-btn"
            style={{ backgroundColor: "purple", marginTop: 20 }}
            onClick={() => {
              const el = billRef.current;
              if (!el) return alert("Bill not ready");

              const w = window.open("", "_blank");
              w.document.write(`
                <html>
                  <head><title>Invoice</title></head>
                  <body>${el.outerHTML}</body>
                </html>
              `);
              w.document.close();
              setTimeout(() => w.print(), 300);
            }}
          >
            Generate Bill
          </button>

          <button
            className="buy-btn"
            style={{ marginTop: 20 }}
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // CART PAGE
  // -----------------------------------------------------
  if (!checkoutMode) {
    return (
      <div className="cart-wrapper">
        <div className="cart-container">
          <BackButton
            onClick={() => {
              const src = localStorage.getItem("cartSource");
              if (src === "dog") navigate("/dog");
              else if (src === "cat") navigate("/cat");
              else navigate(-1);
            }}
          />

          <h2 className="cart-title">Your Shopping Cart</h2>

          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th>Subtotal (₹)</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item) => {
                const qty = cart[item._id] || 1;
                return (
                  <tr key={item._id}>
                    <td>{item.product_name}</td>
                    <td>₹{item.price}</td>

                    <td>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item._id, -1)}
                      >
                        <FaMinus />
                      </button>

                      <span className="qty-display">{qty}</span>

                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item._id, +1)}
                      >
                        <FaPlus />
                      </button>
                    </td>

                    <td>₹{item.price * qty}</td>

                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h3 className="cart-total">Total: ₹{calculateTotal()}</h3>

          <button
            className="buy-btn"
            onClick={() => {
              if (calculateTotal() === 0) return alert("Your cart is empty!");
              setCheckoutMode(true);
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // CHECKOUT PAGE
  // -----------------------------------------------------
  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        <BackButton onClick={() => setCheckoutMode(false)} />

        <h2 className="cart-title">Checkout</h2>

        <label className="checkout-label">Full Name</label>
        <input
          className="checkout-input"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label className="checkout-label">Phone Number</label>
        <input
          className="checkout-input"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="checkout-label">Address</label>
        <textarea
          className="checkout-input"
          rows="4"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>

        <label className="checkout-label">Payment Method</label>
        <select
          className="checkout-input"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option>Cash on Delivery</option>
          <option>Online Payment</option>
        </select>

        <h3 className="cart-total">Total: ₹{calculateTotal()}</h3>

        <button
          className="confirm-btn"
          onClick={() => {
            if (!fullName || !phone || !address)
              return alert("Please fill all fields!");

            setShowConfirmPopup(true);
          }}
        >
          Confirm Order
        </button>

        {showConfirmPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p>🛒 Do you want to confirm the order?</p>

              <div className="popup-buttons">
                <button
                  className="yes-btn"
                  onClick={() => {
                    setShowConfirmPopup(false);
                    submitOrder();
                  }}
                >
                  Yes
                </button>

                <button
                  className="no-btn"
                  onClick={() => setShowConfirmPopup(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
