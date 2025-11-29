import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./comments.css";
import { useNavigate } from "react-router-dom";

function Comments({ productId, productName }) {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Logged-in user
  const user = JSON.parse(localStorage.getItem("authUser"));
  const isLoggedIn = !!user;
  const userName = localStorage.getItem("username") || "";
  const userId = localStorage.getItem("userId") || null;

  // Avatar letter
  const getInitial = (name) => {
    if (!name) return "G";
    return name.trim().charAt(0).toUpperCase();
  };

  // For collapsible comment sections
  const [expandedComments, setExpandedComments] = useState({});

  const toggleComment = (id) => {
    setExpandedComments((prev) => ({
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  async function fetchComments() {
    try {
      setLoading(true);
      const res = await api.get(`/comments/${productId}`);
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (err) {
      console.log("Comments Load Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addComment(e) {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please login first to comment!");
      return navigate("/signin");
    }

    if (!text.trim()) return;

    try {
      const payload = {
        productId,
        productName,
        userId,
        userName,
        text,
      };

      const res = await api.post("/comments/add", payload);

      if (res.data.success) {
        setComments((prev) => [res.data.comment, ...prev]);
        setText("");
      }
    } catch (err) {
      console.log("Add Comment Error:", err);
    }
  }

  return (
    <div className="comment-box">
      <h4 className="comment-title">Comments</h4>

      {/* ADD COMMENT BOX */}
      <form className="comment-form" onSubmit={addComment}>
        <div className="avatar">{getInitial(userName)}</div>

        <input
          type="text"
          value={text}
          placeholder={
            isLoggedIn ? `Comment as ${userName}` : "Please login to comment"
          }
          className="comment-input"
          disabled={!isLoggedIn}
          onChange={(e) => setText(e.target.value)}
        />

        <button className="send-btn" type="submit">
          Send
        </button>
      </form>

      {/* COMMENT LIST */}
      {loading ? (
        <div className="loading-comments">Loading...</div>
      ) : comments.length === 0 ? (
        <div className="no-comments">No comments yet</div>
      ) : (
        <div className="comments-list">
          {comments.map((c) => (
            <div key={c._id} className="comment-item">
              <div className="avatar">{getInitial(c.userName)}</div>

              <div className="comment-content">
                <div className="comment-header">
                  <span className="user-name">{c.userName}</span>
                  <span className="date">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>

                  {/* SHOW COMMENT ONLY WHEN CLICKED */}
                  <button
                    className="dropdown-btn"
                    onClick={() => toggleComment(c._id)}
                  >
                    ⋮
                  </button>
                </div>

                {/* COLLAPSIBLE COMMENT BODY */}
                {expandedComments[c._id] && (
                  <div className="comment-body">
                    <div className="comment-text">{c.text}</div>

                    
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Comments;
