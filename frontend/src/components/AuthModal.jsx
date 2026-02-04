import { useState } from "react";
import { login, register } from "../services/auth";

export default function AuthModal({ mode = "login", onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = isLogin
        ? await login({ email, password })
        : await register({ name, email, password });

      onSuccess(res.data);
      onClose();
    } catch (err) {
      setError("Authentication failed");
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close" onClick={onClose}>
          &times;
        </span>

        <h3>{isLogin ? "Login" : "Signup"} as Mess Owner</h3>

        {error && <p className="message error">{error}</p>}

        <form onSubmit={submitHandler}>
          {!isLogin && (
            <div className="form-group">
              <label>Mess Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email (Gmail)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          {isLogin ? "New mess owner?" : "Already have an account?"}{" "}
          <span
            style={{ color: "#667eea", cursor: "pointer" }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
