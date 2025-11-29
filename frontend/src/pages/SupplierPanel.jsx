import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/SupplierPanel.css";

function SupplierPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    product_name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });

  const fileRef = useRef(null);
  const pollingRef = useRef(null);

  /* ========= LOAD USER FROM LOCALSTORAGE ========= */
  useEffect(() => {
    const stored = localStorage.getItem("authUser");

    if (!stored) {
      navigate("/signin");
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      if (parsed.role !== "supplier") {
        navigate("/signin");
        return;
      }

      setUser(parsed);
    } catch {
      localStorage.removeItem("authUser");
      navigate("/signin");
    }
  }, [navigate]);

  /* ========= FETCH SUPPLIER REQUESTS ========= */
  const fetchRequests = async (supplierId) => {
    if (!supplierId) return;

    try {
      const res = await api.get(`/product_requests/${supplierId}`);

      if (res.data && res.data.success) {
        setRequests(res.data.requests || []);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Fetch requests error:", err);
    }
  };

  /* ========= POLLING TO REFRESH REQUESTS ========= */
  useEffect(() => {
    if (!user) return;

    fetchRequests(user.id);

    pollingRef.current = setInterval(() => {
      fetchRequests(user.id);
    }, 8000);

    return () => clearInterval(pollingRef.current);
  }, [user]);

  /* ========= LOGOUT ========= */
  const handleLogout = () => {
    if (window.confirm("Do you want to logout?")) {
      localStorage.clear();
      navigate("/signin");
    }
  };

  /* ========= FORM INPUT HANDLER ========= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  /* ========= SEND PRODUCT REQUEST ========= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (
      !form.product_name ||
      !form.category ||
      !form.price ||
      !form.quantity ||
      !fileRef.current?.files?.[0]
    ) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    const fd = new FormData();
    fd.append("supplierId", user.id);
    fd.append("product_name", form.product_name);
    fd.append("category", form.category);
    fd.append("price", form.price);
    fd.append("quantity", form.quantity);
    fd.append("description", form.description);
    fd.append("image", fileRef.current.files[0]);

    try {
      setLoading(true);

      const res = await api.post("/product_requests", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        setForm({
          product_name: "",
          category: "",
          price: "",
          quantity: "",
          description: "",
        });

        if (fileRef.current) fileRef.current.value = "";

        fetchRequests(user.id);
      } else {
        alert(res.data?.message || "Request failed.");
      }
    } catch (err) {
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================= */
  /* =========================== UI JSX =========================== */
  /* ============================================================= */

  return (
    <div className="supplier-panel">
      {/* ======================= NAVBAR ======================= */}
      <nav className="supplier-navbar">
        <div className="supplier-logo-section">
          <img
            src="/img/logo.jpg"
            alt="PetKart Logo"
            className="supplier-logo"
          />
          <h2 className="supplier-brand">PetKart</h2>
        </div>

        <ul className="supplier-nav-links">
          {/* Supplier Home */}
          <li>
            <button onClick={() => navigate("/supplier")}>Home</button>
          </li>

          {/* Scroll to Request Product */}
          <li>
            <a href="#request-product">Request Product</a>
          </li>

          {/* Supplier Profile Page */}
          <li>
            <button onClick={() => navigate("/supplier/profile")}>
              Profile
            </button>
          </li>

          {/* Scroll to My Orders */}
          <li>
            <a href="#my-orders">My Orders</a>
          </li>

          {/* Scroll to Messages */}
          <li>
            <a href="#messages">Messages</a>
          </li>

          {/* Logout */}
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* ======================= HERO SECTION ======================= */}
      <div className="supplier-hero">
        <img
          src="/img/supplierph.avif"
          alt="Supplier"
          className="supplier-hero-img"
        />
        <h2 className="supplier-welcome">
          Welcome, <br />
          <strong>{user?.username || "Supplier"}</strong>
          <br />
          Your journey to success starts here!
        </h2>
      </div>

      {/* ======================= OVERVIEW ======================= */}
      <div className="supplier-overview-container">
        <div className="supplier-overview-card">
          <h3 className="overview-title">📌 Quick Overview</h3>
          <p className="overview-text">
            As a supplier on <b>PetKart</b>, you can request new products and
            track their status here.
          </p>
        </div>
      </div>

      {/* ======================= REQUEST PRODUCT ======================= */}
      <section id="request-product" className="supplier-section">
        <h3 className="section-title">🛒 Request Product</h3>

        <div className="form-card">
          <h4>Request New Product</h4>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              type="text"
              name="product_name"
              placeholder="Product Name"
              required
              value={form.product_name}
              onChange={handleChange}
            />

            <select
              name="category"
              required
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option>Dog Food</option>
              <option>Dog Toy</option>
              <option>Dog Grooming</option>
              <option>Dog Clothing</option>
              <option>Cat Food</option>
              <option>Cat Toy</option>
              <option>Cat Grooming</option>
              <option>Cat Clothing</option>
              <option>Birds Food</option>
              <option>Birds Toy</option>
            </select>

            <input
              type="number"
              name="price"
              placeholder="Price (₹)"
              required
              value={form.price}
              onChange={handleChange}
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              required
              value={form.quantity}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              rows="3"
              value={form.description}
              onChange={handleChange}
            />

            <input type="file" ref={fileRef} accept="image/*" />

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Request"}
            </button>
          </form>
        </div>

        {showSuccess && (
          <div className="modal">
            <div className="modal-content">
              <div className="success-icon">✔</div>
              <h3>Your request has been submitted successfully!</h3>
            </div>
          </div>
        )}
      </section>

      {/* ======================= MY ORDERS ======================= */}
      <section id="my-orders">
        <h3 className="section-title">📦 My Orders</h3>

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Status</th>
                <th>Image</th>
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 20 }}>
                    No product requests found.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r._id}>
                    <td>{r.product_name}</td>
                    <td>{r.category}</td>
                    <td>{r.quantity}</td>
                    <td>₹{Number(r.price).toFixed(2)}</td>

                    <td
                      style={{
                        color:
                          r.status?.toLowerCase() === "pending"
                            ? "#ff9800"
                            : r.status?.toLowerCase() === "approved"
                            ? "green"
                            : "red",
                        fontWeight: 700,
                      }}
                    >
                      {r.status
                        ? r.status.charAt(0).toUpperCase() + r.status.slice(1)
                        : "Pending"}
                    </td>

                    <td>
                      {r.image ? (
                        <img
                          src={`http://localhost:5000${r.image}`}
                          alt={r.product_name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================= MESSAGES SECTION ======================= */}
      <section id="messages">
        <h3 className="section-title">💬 Messages</h3>
        <p style={{ textAlign: "center", paddingBottom: 40, opacity: 0.5 }}>
          Messages feature coming soon...
        </p>
      </section>
    </div>
  );
}

export default SupplierPanel;
