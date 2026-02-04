import { useEffect, useState } from "react";

export default function Navbar({ view, setView, user, onLoginClick, onLogout }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <h1>Pune Mess Menu</h1>

        <div className="nav">
          <button
            className={`nav-btn ${view === "student" ? "active" : ""}`}
            onClick={() => setView("student")}
          >
            Student
          </button>

          <button
            className={`nav-btn ${view === "mess" ? "active" : ""}`}
            onClick={() => setView("mess")}
          >
            Mess Owner
          </button>

          {!user ? (
            <>
              <button className="nav-btn" onClick={onLoginClick}>
                Login
              </button>
              <button
                className="nav-btn"
                onClick={() => onLoginClick("signup")}
              >
                Signup
              </button>
            </>
          ) : (
            <button className="nav-btn" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
