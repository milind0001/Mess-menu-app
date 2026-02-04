import { useEffect, useState } from "react";
import socket from "./services/socket";
import { fetchMesses } from "./services/api";
import { getMe, logout } from "./services/auth";

import Navbar from "./components/Navbar";
import StudentView from "./pages/StudentView";
import MessOwnerView from "./pages/MessOwnerView";
import AuthModal from "./components/AuthModal";

function App() {
  const [messes, setMesses] = useState([]);
  const [view, setView] = useState("student");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =========================
     AUTH CHECK ON APP LOAD
  ========================== */
  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await getMe();
        setUser(authRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          // ✅ Not logged in → normal
          setUser(null);
        } else {
          console.error("Auth check failed:", err);
        }
      }

      try {
        const messRes = await fetchMesses();
        setMesses(messRes.data.messes || []);
      } catch (err) {
        console.error("Failed to fetch messes:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  /* =========================
     SOCKET.IO LISTENERS
  ========================== */
  useEffect(() => {
    socket.on("newMenuAdded", (newMess) => {
      setMesses((prev) =>
        prev.some((m) => m._id === newMess._id)
          ? prev
          : [newMess, ...prev]
      );
    });

    socket.on("menuDeleted", ({ id }) => {
      setMesses((prev) => prev.filter((m) => m._id !== id));
    });

    return () => {
      socket.off("newMenuAdded");
      socket.off("menuDeleted");
    };
  }, []);

  /* =========================
     LOGOUT
  ========================== */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setView("student");
    }
  };

  /* =========================
     LOADING STATE
  ========================== */
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#fff" }}>
        Loading…
      </div>
    );
  }

  /* =========================
     RENDER
  ========================== */
  return (
    <>
      <Navbar
        view={view}
        setView={setView}
        user={user}
        onLoginClick={(mode = "login") => {
          setAuthMode(mode);
          setShowLogin(true);
        }}
        onLogout={handleLogout}
      />

      {view === "student" ? (
        <StudentView messes={messes} user={user} />
      ) : (
        <MessOwnerView user={user} />
      )}

      {showLogin && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowLogin(false)}
          onSuccess={setUser}
        />
      )}
    </>
  );
}

export default App;
