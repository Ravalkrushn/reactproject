import React, { forwardRef } from "react";

const BillComponent = forwardRef(
  (
    { fullName, phone, address, paymentMethod, products = [], cart = {}, total = 0 },
    ref
  ) => {
    return (
      <div
        ref={ref}
        id="printable-bill"
        style={{
          padding: "30px",
          maxWidth: "780px",
          margin: "0 auto",
          background: "#fff",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Arial, sans-serif",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        {/* --- WATERMARK LOGO BACKGROUND --- */}
        <img
          src="img/logo.jpg"
          alt="watermark"
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            opacity: 0.08,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* --- INVOICE CONTENT ABOVE WATERMARK --- */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Heading */}
          <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
            Invoice / Bill
          </h1>
          <hr />

          {/* Customer Info */}
          <div style={{ marginBottom: "20px", fontSize: "16px" }}>
            <p><strong>Name:</strong> {fullName}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Payment:</strong> {paymentMethod}</p>
          </div>

          {/* Product Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>#</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>Product</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ccc", textAlign: "right" }}>
                  Price
                </th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ccc", textAlign: "right" }}>
                  Qty
                </th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ccc", textAlign: "right" }}>
                  Subtotal
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, i) => {
                const qty = cart[p._id] || 1;
                return (
                  <tr key={p._id}>
                    <td style={{ padding: "8px" }}>{i + 1}</td>
                    <td style={{ padding: "8px" }}>{p.product_name}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>₹{p.price}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>{qty}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>₹{p.price * qty}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Total */}
          <h2 style={{ textAlign: "right", marginTop: "20px" }}>
            Total: <strong>₹{total}</strong>
          </h2>

          <hr style={{ marginTop: "20px" }} />

          {/* FOOTER WITH CREDIT */}
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
              fontSize: "14px",
              opacity: 0.9,
            }}
          >
            Thank you for shopping with <strong>PetKart 🐶</strong>
            <br />
            
          </p>

          {/* BACK BUTTON */}
          <div style={{ textAlign: "center", marginTop: "25px" }}>
     
          </div>
        </div>
      </div>
    );
  }
);

export default BillComponent;
