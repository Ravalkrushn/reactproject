// src/pages/Index.jsx
import React, { useState, useRef, useEffect } from "react";
import "../styles/index.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // ----------------------
  // AUTH USER LOAD
  // ----------------------
  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsLoggedIn(true);
      } catch (err) {
        console.warn("Invalid authUser in localStorage", err);
        localStorage.removeItem("authUser");
      }
    }
  }, []);

  // ----------------------
  // LOGIN / LOGOUT SYNC
  // ----------------------
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "authUser") {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      }
    };
    const onDocClick = () => setShowDropdown(false);

    window.addEventListener("storage", onStorage);
    document.addEventListener("click", onDocClick);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("click", onDocClick);
    };
  }, []);

  // ----------------------
  // CART COUNT AUTO UPDATE
  // ----------------------
  useEffect(() => {
    const updateCart = () => {
      const items = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartCount(items.length);
    };

    updateCart(); // page load par chalega

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const toggleCategory = (e) => {
    e.preventDefault();
    setShowCategory((prev) => !prev);
  };

  const toggleAccount = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem("authUser");
    setUser(null);
    setIsLoggedIn(false);
    setShowDropdown(false);
    window.location.href = "/";
  };

  return (
    <nav className="navbar" id="top-navbar">
      <div className="nav-left">
        <img src="/img/logo.jpg" alt="Petkart Logo" className="logo" />
        <span className="brand">Petkart</span>
      </div>

      <ul className="nav-links">
        <li>
          <a href="#" className="hover-effect">
            Home
          </a>
        </li>
        <li>
          <a href="#photos" className="hover-effect">
            Photos
          </a>
        </li>
        <li>
          <a href="#services" className="hover-effect">
            Services
          </a>
        </li>

        <li className="dropdown">
          <a href="#" className="hover-effect" onClick={toggleCategory}>
            Category
          </a>
          {showCategory && (
            <ul className="dropdown-menu">
              <li>
                <a href="/dog" className="hover-effect">
                  Dog
                </a>
              </li>
              <li>
                <a href="/cat" className="hover-effect">
                  Cat
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover-effect"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("🐦 Birds section coming soon...");
                  }}
                >
                  Birds
                </a>
              </li>
            </ul>
          )}
        </li>

        <li>
          <a href="#about" className="hover-effect">
            About Us
          </a>
        </li>

        <li>
          <input type="text" className="search-bar" placeholder="Search..." />
        </li>
      </ul>

      <div className="nav-right">
        <div className="cart">
          <Link to="/cart">
            <img src="/img/cart.jpg" alt="Cart" className="cart-icon" />
            <span className="cart-count">{cartCount}</span>
          </Link>
        </div>

        <div className="vertical-line"></div>
        <div className="account" onClick={toggleAccount}>
          <img src="/img/user.png" alt="User" className="user-icon" />
          {showDropdown && (
            <div
              className="account-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              {!isLoggedIn ? (
                <>
                  <Link to="/signin">
                    <button>Login</button>
                  </Link>
                  <Link to="/signup">
                    <button>Signup</button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile">
                    <button>Profile</button>
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* =========================
   HERO
   ========================= */
function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>
          Everything <br /> Your Pet Needs
        </h1>
        <p>
          We bring you a wide collection of safe, high-quality, and trusted pet
          products—all in one place. From healthy food that keeps them strong to
          fun toys that keep tails wagging, we’ve got it all. Our grooming
          essentials make care easy, while comfy accessories give your pets the
          comfort they deserve. Every product is carefully chosen to ensure
          health, happiness, and endless love for your furry companions. Shop
          with confidence and give your pet the best—because they deserve
          nothing less.
        </p>
      </div>
      <div className="hero-image">
        <img src="/img/photo7.jpg" alt="Dog with Toys" />
      </div>
    </section>
  );
}

/* =========================
   SERVICES: Infinite scrolling carousel (right -> left)
   ========================= */
function ServicesAndFaq() {
  const scrollRef = useRef();

  // no JS interval needed — CSS animation handles continuous scroll.
  // But to allow pausing on hover we can toggle a class — implemented in CSS.

  // Duplicate items to create seamless loop — we render the same cards twice.
  const cards = [
    {
      icon: "🦴",
      title: "Pet Food Supplies",
      desc: "Buy healthy and tasty food for your pets including dogs, cats, birds and more. Delivered at your doorstep.",
    },
    {
      icon: "🧸",
      title: "Pet Toys & Accessories",
      desc: "Get the best collection of toys, collars, leashes, and accessories for your lovely pets. Fun meets safety.",
    },
    {
      icon: "🛁",
      title: "Grooming Products",
      desc: "Shop shampoos, brushes, nail clippers, and other grooming essentials to keep your pets clean and happy.",
    },
    {
      icon: "🛏️",
      title: "Pet Beds & Accessories",
      desc: "Comfortable beds, blankets, and furniture for your beloved pets.",
    },
    {
      icon: "🎽",
      title: "Pet Clothing & Accessories",
      desc: "Stylish clothes and accessories to keep your pets happy and cozy.",
    },
  ];

  return (
    <>
      <section
        className="services-section infinite-scroll"
        aria-label="Services carousel"
        ref={scrollRef}
        // onMouseEnter / Leave handled by CSS via :hover
      >
        <div className="scroll-track">
          {/* render two copies for seamless loop */}
          {[...cards, ...cards].map((c, idx) => (
            <div className="card service-card" key={idx}>
              <div className="icon">{c.icon}</div>
              <h2>{c.title}</h2>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ + Video */}
      <div className="faq-video-section">
        <div className="faq-left">
          <h2>Frequently Asked Questions</h2>

          <Accordion
            items={[
              {
                q: "Why should I buy pet items online?",
                a: `Buying pet items online is very easy and saves time. You don't need to go to the market; 
                  just visit the website and order from home. Online stores give many options for food, 
                  toys, and grooming products. Many websites also offer discounts and home delivery. 
                  So, it's simple, quick, and more convenient.`,
              },
              {
                q: "Is it safe to buy pet food online?",
                a: `Yes, it is safe to buy pet food online if you use a trusted website. Good websites sell 
                  quality products from well-known brands. You should always check the expiry date and 
                  product reviews before buying. Online platforms also give return options if the item 
                  is damaged or wrong. So, buying online can be both safe and helpful.`,
              },
              {
                q: "What type of items can I buy for my pet online?",
                a: `You can buy many items like pet food, shampoo, toys, collars, beds, clothes, and grooming tools. 
                  Some websites also sell cages, water bottles, and health products. Whether your pet is a dog, 
                  cat, rabbit, or bird there are many options available. It's like a one-stop shop for all your pet needs.`,
              },
            ]}
          />
        </div>

        <div className="faq-right">
          <div className="video-container">
            <video width="680" controls>
              <source src="./img/v1.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================
   Accordion component (FAQ)
   - All answers hidden by default
   - Click toggles the answer (open/close)
   - Multiple items can be open simultaneously (per user's earlier phrasing)
   ========================= */
function Accordion({ items = [] }) {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleIndex = (i) => {
    setOpenIndexes((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i); // close
      return [...prev, i]; // open (allow multiple)
    });
  };

  return (
    <div className="accordion">
      {items.map((it, i) => (
        <div className="faq-box" key={i}>
          <button
            className={`faq-question ${openIndexes.includes(i) ? "open" : ""}`}
            onClick={() => toggleIndex(i)}
            aria-expanded={openIndexes.includes(i)}
            aria-controls={`faq-answer-${i}`}
          >
            {it.q}
            <span className="faq-icon">
              {openIndexes.includes(i) ? "−" : "+"}
            </span>
          </button>
          <div
            id={`faq-answer-${i}`}
            className={`faq-answer ${openIndexes.includes(i) ? "visible" : ""}`}
            role="region"
          >
            {it.a}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================
   Photos, Services, About (unchanged but tidy)
   ========================= */
function PhotosSection() {
  return (
    <section id="photos" className="photos-section">
      <h2 className="section-heading">Photos</h2>
      <div className="vertical-line1"></div>
      <div className="photos-grid">
        <img src="/img/photo1.jpg" alt="Pet 1" />
        <img src="/img/photo4.jpeg" alt="Pet 2" />
        <img src="/img/photo11.jpg" alt="Pet 3" />
        <img src="/img/photo6.jpg" alt="Pet 4" />
        <img src="/img/a3.jpg" alt="Pet 5" />
        <img src="/img/photo10.jpg" alt="Pet 6" />
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services">
      <h1 className="services-heading" id="OurServices">
        Our Services
      </h1>
      <hr className="services-line" />
      <p className="services-subtext">
        We provide premium quality pet products for all your furry, feathery,
        and scaly friends.
      </p>

      <div className="services-wrapper">
        <div className="card">
          <div className="icon">📦</div>
          <h4>Wide Product Range</h4>
          <p>
            From food to toys — everything your pet needs, all in one place.
          </p>
        </div>

        <div className="card">
          <div className="icon">🚚</div>
          <h4>Fast & Safe Delivery</h4>
          <p>Doorstep delivery that’s quick and safe for your pets.</p>
        </div>

        <div className="card">
          <div className="icon">🎁</div>
          <h4>Customized Pet Packs</h4>
          <p>Special bundles based on your pet’s breed and age.</p>
        </div>

        <div className="card">
          <div className="icon">💰</div>
          <h4>Discounts & Offers</h4>
          <p>Great deals and discounts on top pet brands.</p>
        </div>

        <div className="card">
          <div className="icon">🔄</div>
          <h4>Easy Return Policy</h4>
          <p>Hassle-free returns and exchanges for eligible products.</p>
        </div>

        <div className="card">
          <div className="icon">📞</div>
          <h4>Product Support</h4>
          <p>
            Need help? Our team is ready to assist via call, chat, or email.
          </p>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about-us-section" id="about">
      <div className="about-us-container">
        <h2>About Us</h2>
        <hr className="about-us-line" />
        <p className="about-us-text">
          Welcome to our online pet store! We are passionate about providing the
          best quality pet products for your beloved companions. From nutritious
          food to fun toys and essential accessories, we ensure your pets are
          happy and healthy. Our dedicated team works around the clock to
          deliver quality and convenience right to your doorstep. Trust us to
          bring joy to your furry friends!
        </p>
        <div className="about-us-images">
          <div className="circle-image small">
            <img src="/img/team_member2.jpg" alt="Pet 1" />
          </div>
          <div className="circle-image large">
            <img src="/img/user.png" alt="Pet 2" />
          </div>
          <div className="circle-image small">
            <img src="/img/team_member3.jpg" alt="Pet 3" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================
   Floating Scroll-to-top Button (round)
   - appears when user scrolls a bit (>= 50px)
   - smooth scroll to top-navbar on click
   ========================= */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const sc = window.scrollY || window.pageYOffset;
      setVisible(sc >= 50); // show after small scroll
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`scroll-top-btn ${visible ? "show" : ""}`}
      onClick={handleClick}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

/* =========================
   Index (page)
   ========================= */
function Index() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ServicesAndFaq />
      <PhotosSection />
      <ServicesSection />
      <AboutSection />
      <ScrollToTopButton />
    </>
  );
}

export default Index;
