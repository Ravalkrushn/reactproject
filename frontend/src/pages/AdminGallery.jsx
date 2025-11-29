import React, { useEffect, useState } from "react";
import "../styles/AdminGallery.css";
import "../styles/print.css";
import api from "../services/api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminGallery() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    suppliers: 0,
    customers: 0,
    pending: 0,
    reports: 0,
  });

  const [supplierTab, setSupplierTab] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  const [customerTab, setCustomerTab] = useState(false);
  const [customers, setCustomers] = useState([]);

  const [productTab, setProductTab] = useState(false);
  const [productRequests, setProductRequests] = useState([]);
  // REPORTS (frontend)
  const [reportType, setReportType] = useState("users"); // "users" | "suppliers" | "orders"
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [reportsTab, setReportsTab] = useState(false); // ⭐ NEW TAB

  // ======================== LOAD DASHBOARD STATS ========================
  useEffect(() => {
    async function loadStats() {
      setLoading(true);

      let suppliers = 0;
      let customers = 0;
      let pending = 0;
      let reports = 0;

      try {
        const supRes = await api.get("/admin/total-suppliers");
        suppliers = supRes.data?.count ?? 0;
      } catch {}

      try {
        const cusRes = await api.get("/admin/total-customers");
        customers = cusRes.data?.count ?? 0;
      } catch {}

      try {
        const pendRes = await api.get("/admin/pending-requests");
        pending = pendRes.data?.count ?? 0;
      } catch {}

      try {
        const repRes = await api.get("/admin/reports-count");
        reports = repRes.data?.count ?? 0;
      } catch {}

      setStats({ suppliers, customers, pending, reports });
      setLoading(false);
    }

    loadStats();
  }, []);

  // ======================== SUPPLIER FETCH ========================
  async function loadSuppliers() {
    try {
      const res = await api.get("/admin/all-suppliers");
      setSuppliers(res.data.suppliers || []);
    } catch (err) {
      console.log(err.message);
    }
  }

  async function deleteSupplier(id) {
    if (!window.confirm("Do you want to delete this supplier?")) return;

    try {
      await api.delete(`/admin/delete-supplier/${id}`);
      setSuppliers((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.log(err.message);
    }
  }

  // ======================== CUSTOMER FETCH ========================
  async function loadCustomers() {
    try {
      const res = await api.get("/admin/all-customers");
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.log(err.message);
    }
  }

  async function deleteCustomer(id) {
    if (!window.confirm("Do you want to delete this customer?")) return;

    try {
      await api.delete(`/admin/delete-customer/${id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.log(err.message);
    }
  }

  // ======================== PRODUCT REQUEST FETCH ========================
  async function loadProductRequests() {
    try {
      const res = await api.get("/product_requests/admin/all");
      setProductRequests(res.data.requests || []);
    } catch (err) {
      console.log(err.message);
    }
  }

  async function updateProductStatus(id, newStatus) {
    try {
      await api.put(`/product_requests/admin/update-status/${id}`, {
        status: newStatus,
      });

      setProductRequests((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.log(err.message);
    }
  }
  // ======================== LOAD REPORT (DYNAMIC) ========================
  async function loadReport() {
    try {
      let apiUrl = "/admin/report-users";
      if (reportType === "suppliers") apiUrl = "/admin/report-suppliers";
      if (reportType === "orders") apiUrl = "/admin/report-orders";

      const res = await api.get(apiUrl);
      if (!res.data.success) {
        setReportData([]);
        return;
      }

      let data = res.data.data || [];

      // If date filter present apply it
      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        // include whole day for 'to'
        to.setHours(23, 59, 59, 999);

        data = data.filter((item) => {
          // some models may use createdAt or created_at
          const created = new Date(
            item.createdAt || item.created_at || item.date || null
          );
          if (!created || isNaN(created)) return false;
          return created >= from && created <= to;
        });
      }

      setReportData(data);
    } catch (err) {
      console.error("Load report error:", err.message);
      setReportData([]);
    }
  }

  // ========= LOGOUT =========
  function handleLogout() {
    if (window.confirm("Do you want to logout?")) {
      localStorage.clear();
      window.location.href = "/signin";
    }
  }

  // ========= SIDEBAR =========
  return (
    <div className="pk-admin-shell">
      <header className="pk-topbar">
        <button
          className="pk-menu-btn"
          onClick={() => setSidebarOpen((p) => !p)}
        >
          <svg width="22" height="16" viewBox="0 0 24 16" fill="none">
            <rect width="24" height="2" rx="1" fill="#fff" />
            <rect y="7" width="24" height="2" rx="1" fill="#fff" />
            <rect y="14" width="24" height="2" rx="1" fill="#fff" />
          </svg>
        </button>

        <div className="pk-topbar-brand">
          <img src="/img/logo.jpg" className="pk-logo" />
          <span className="pk-title">PetKart</span>
        </div>
      </header>

      <aside className={`pk-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="pk-side-head">
          <h2>Admin Menu</h2>
        </div>

        <nav className="pk-side-nav">
          <button
            className={`pk-side-item ${
              !supplierTab && !customerTab && !productTab && !reportsTab
                ? "active"
                : ""
            }`}
            onClick={() => {
              setSupplierTab(false);
              setCustomerTab(false);
              setProductTab(false);
              setReportsTab(false);
              // load data immediately
              setTimeout(() => loadReport(), 0);
            }}
          >
            🏠 Dashboard
          </button>

          <button
            className={`pk-side-item ${supplierTab ? "active" : ""}`}
            onClick={() => {
              setSupplierTab(true);
              setCustomerTab(false);
              setProductTab(false);
              setReportsTab(false);
              loadSuppliers();
            }}
          >
            🤝 Supplier Management
          </button>

          <button
            className={`pk-side-item ${customerTab ? "active" : ""}`}
            onClick={() => {
              setCustomerTab(true);
              setSupplierTab(false);
              setProductTab(false);
              setReportsTab(false);
              loadCustomers();
            }}
          >
            👥 Customer Management
          </button>

          <button
            className={`pk-side-item ${productTab ? "active" : ""}`}
            onClick={() => {
              setProductTab(true);
              setSupplierTab(false);
              setCustomerTab(false);
              setReportsTab(false);
              loadProductRequests();
            }}
          >
            📦 Product Requests
          </button>

          <button
            className={`pk-side-item ${reportsTab ? "active" : ""}`}
            onClick={() => {
              setReportsTab(true);
              setSupplierTab(false);
              setCustomerTab(false);
              setProductTab(false);
            }}
          >
            📊 Reports
          </button>

          <div className="pk-side-spacer" />

          <button className="pk-side-item logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className={`pk-main ${sidebarOpen ? "with-sidebar" : "full"}`}>
        {/* ======================== DASHBOARD ======================== */}
        {!supplierTab && !customerTab && !productTab && !reportsTab ? (
          <>
            <section className="pk-header">
              <h1>Welcome, Admin</h1>
            </section>

            <section className="pk-cards">
              <div className="pk-card">
                <div className="pk-card-title">Total Suppliers</div>
                <div className="pk-card-value">
                  {loading ? "..." : stats.suppliers}
                </div>
              </div>

              <div className="pk-card">
                <div className="pk-card-title">Total Customers</div>
                <div className="pk-card-value">
                  {loading ? "..." : stats.customers}
                </div>
              </div>

              <div className="pk-card">
                <div className="pk-card-title">Pending Requests</div>
                <div className="pk-card-value">
                  {loading ? "..." : stats.pending}
                </div>
              </div>

              <div className="pk-card">
                <div className="pk-card-title">Reports</div>
                <div className="pk-card-value">
                  {loading ? "..." : stats.reports}
                </div>
              </div>
            </section>
          </>
        ) : null}

        {/* ======================== SUPPLIER MANAGEMENT ======================== */}
        {supplierTab ? (
          <>
            <h1>Supplier Management</h1>

            <div className="supplier-table-container">
              <table className="supplier-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {suppliers.map((sup, index) => (
                    <tr key={sup._id}>
                      <td>{index + 1}</td>
                      <td>{sup.username}</td>
                      <td>{sup.email}</td>
                      <td>{sup.mobile}</td>
                      <td>{sup.address}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => deleteSupplier(sup._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {suppliers.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No suppliers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {/* ======================== CUSTOMER MANAGEMENT ======================== */}
        {customerTab ? (
          <>
            <h1>Customer Management</h1>

            <div className="supplier-table-container">
              <table className="supplier-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((cus, index) => (
                    <tr key={cus._id}>
                      <td>{index + 1}</td>
                      <td>{cus.username}</td>
                      <td>{cus.email}</td>
                      <td>{cus.mobile}</td>
                      <td>{cus.address}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => deleteCustomer(cus._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {customers.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No customers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {/* ======================== PRODUCT REQUESTS ======================== */}
        {productTab ? (
          <>
            <h1>Product Requests</h1>

            <div className="supplier-table-container">
              <table className="supplier-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {productRequests.map((req, index) => (
                    <tr key={req._id}>
                      <td>{index + 1}</td>
                      <td>{req.product_name}</td>
                      <td>{req.category}</td>
                      <td>{req.price}</td>
                      <td>{req.quantity}</td>
                      <td>{req.status}</td>

                      <td>
                        <span
                          style={{
                            color: "green",
                            cursor: "pointer",
                            marginRight: 8,
                          }}
                          onClick={() =>
                            updateProductStatus(req._id, "approved")
                          }
                        >
                          Accept
                        </span>
                        |
                        <span
                          style={{
                            color: "red",
                            cursor: "pointer",
                            marginLeft: 8,
                          }}
                          onClick={() =>
                            updateProductStatus(req._id, "rejected")
                          }
                        >
                          Reject
                        </span>
                      </td>
                    </tr>
                  ))}

                  {productRequests.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No product requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
        {/* ======================== REPORTS TAB ======================== */}
        {reportsTab ? (
          <>
            <h1>📊 Reports</h1>

            <div
              style={{
                height: "80vh",
                overflowY: "scroll",
                padding: "15px",
                background: "#f8f8f8",
                borderRadius: "10px",
              }}
            >
              {/* Supplier Reports */}
              <div
                style={{
                  background: "white",
                  padding: "18px",
                  borderRadius: "10px",
                  marginBottom: "25px",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h2 className="supplier-report-title"> Supplier Report</h2>

                <p>
                  Total Suppliers: <b>{stats.suppliers}</b>
                </p>
              </div>

              {/* Customer Reports */}
              <div
                style={{
                  background: "white",
                  padding: "18px",
                  borderRadius: "10px",
                  marginBottom: "25px",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h2 className="supplier-report-title1">👥 Customer Report</h2>
                <p>
                  Total Customers: <b>{stats.customers}</b>
                </p>
              </div>

              {/* Category Wise Sales - Pie Chart */}
              <div
                style={{
                  background: "white",
                  padding: "18px",
                  borderRadius: "10px",
                  marginBottom: "125px",
                  boxShadow: "0 3px 100px rgba(0,0,0,0.1)",
                  height: "400px", // ⭐ FIXED HEIGHT FOR SMALL CHART
                }}
              >
                <h2 className="supplier-report-title2">
                  📦 Category Wise Sales
                </h2>

                {/* ======== Chart Data ======== */}
                <Pie
                  data={{
                    labels: [
                      "Dog Food",
                      "Dog Toy",
                      "Dog Grooming",
                      "Dog Clothing",
                      "Cat Food",
                      "Cat Toy",
                      "Cat Grooming",
                      "Cat Clothing",
                    ],
                    datasets: [
                      {
                        data: [
                          productRequests.filter(
                            (x) => x.category === "Dog Food"
                          ).length,
                          productRequests.filter(
                            (x) => x.category === "Dog Toy"
                          ).length,
                          productRequests.filter(
                            (x) => x.category === "Dog Grooming"
                          ).length,
                          productRequests.filter(
                            (x) => x.category === "Dog Clothing"
                          ).length,
                          productRequests.filter(
                            (x) => x.category === "Cat Food"
                          ).length,
                          productRequests.filter(
                            (x) => x.category === "Cat Toy"
                          ).length,
                          productRequests.filter(
                            (x) => x.category === "Cat Grooming"
                          ).length,
                          productRequests.filter(
                            (x) => x.category === "Cat Clothing"
                          ).length,
                        ],
                        backgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#8BC34A",
                          "#FF9800",
                          "#9C27B0",
                          "#03A9F4",
                          "#E91E63",
                        ],
                      },
                    ],
                  }}
                  width={250}
                  height={250}
                  options={{
                    maintainAspectRatio: false,
                  }}
                />
              </div>
              {/* ===== DYNAMIC FILTER + TABLE (paste inside reportsTab area under chart) ===== */}
              <div
                id="print-area"
                style={{
                  height: "auto",
                  padding: "15px",
                  background: "white",
                }}
              >
                <h2 className="supplier-report-title2">Reports</h2>

                {/* FILTER ROW */}
                <div
                  id="report-print-area"
                  style={{
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <label>
                    <b>Report:</b>
                  </label>

                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="users">Users</option>
                    <option value="suppliers">Suppliers</option>
                    <option value="orders">Orders</option>
                  </select>

                  <label>
                    <b>From:</b>
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <label>
                    <b>To:</b>
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <button
                    onClick={loadReport}
                    style={{
                      background: "#00b894",
                      color: "white",
                      padding: "8px 15px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Filter
                  </button>

                  <button
                    onClick={() => window.print()}
                    style={{
                      background: "#0984e3",
                      color: "white",
                      padding: "8px 15px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Print Report
                  </button>
                </div>

                {/* TABLE */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          background: "#2d3436",
                          color: "white",
                          textAlign: "left",
                          height: "45px",
                        }}
                      >
                        <th style={{ padding: "10px" }}>ID</th>
                        <th style={{ padding: "10px" }}>Name</th>
                        <th style={{ padding: "10px" }}>Email</th>
                        <th style={{ padding: "10px" }}>Mobile</th>
                        <th style={{ padding: "10px" }}>Address</th>
                        <th style={{ padding: "10px" }}>Created At</th>
                      </tr>
                    </thead>

                    <tbody>
                      {reportData.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            style={{ padding: "15px", textAlign: "center" }}
                          >
                            No records found.
                          </td>
                        </tr>
                      ) : (
                        reportData.map((item, index) => {
                          // ======== DYNAMIC COLUMN HANDLING BASED ON REPORT TYPE ========

                          let name = "—",
                            email = "—",
                            mobile = "—",
                            address = "—",
                            created = null;

                          /* ================= USERS / SUPPLIERS =================== */
                          if (
                            reportType === "users" ||
                            reportType === "suppliers"
                          ) {
                            name = item.username || item.name || "—";
                            email = item.email || "—";
                            mobile = item.mobile || "—";
                            address = item.address || "—";
                            created = item.createdAt;
                          }

                          /* ================= ORDERS =================== */
                          if (reportType === "orders") {
                            name = item.buyerName || item.customerName || "—";
                            email = item.buyerEmail || item.email || "—";
                            mobile = item.phone || "—";
                            address =
                              item.shippingAddress || item.address || "—";
                            created = item.date || item.createdAt;
                          }

                          return (
                            <tr key={item._id || index}>
                              <td style={{ padding: "10px" }}>{index + 1}</td>
                              <td style={{ padding: "10px" }}>{name}</td>
                              <td style={{ padding: "10px" }}>{email}</td>
                              <td style={{ padding: "10px" }}>{mobile}</td>
                              <td style={{ padding: "10px" }}>{address}</td>
                              <td style={{ padding: "10px" }}>
                                {created
                                  ? new Date(created).toLocaleDateString()
                                  : "—"}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
