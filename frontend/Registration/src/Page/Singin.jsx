import { useState } from "react";
import {useNavigate} from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleSubmit = () => {
  //   if (!email || !password) return;
  //   fetch("http://localhost:3000/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //   })
  //     .then(res => res.json())
  //     .then(data => {

  //         if (data.success) {
  //           alert("Login successful! Welcome back.")
  //               setLoading(true);
  //   setTimeout(() => setLoading(false), 1800);
  //   alert("Login successful! Welcome back.")
  //           // navigate("/dashboard") // Redirect to dashboard or home page
  //         } else {
  //           alert("Login failed: " + (data.message || "Invalid credentials"))
  //         }
  //     })
  //     .catch(err => {
  //       console.error("Login error:", err);
  //       alert("An error occurred during login. Please try again later.");
  //     });


  // };

  const handleSubmit = () => {
  if (!email || !password) return;
  setLoading(true); // ← set loading BEFORE the fetch

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(res => res.json())
    .then(data => {
      setLoading(false); // ← stop loading after response
      if (data.success) {
        sessionStorage.setItem("token",data.token)
        alert("Login successful! Welcome back.");
        navigate("/dashboard"); // ← uncomment this!
      } else {
        alert("Login failed: " + (data.message || "Invalid credentials"));
      }
    })
    .catch(err => {
      setLoading(false); // ← also stop loading on error
      console.error("Login error:", err);
      alert("An error occurred during login. Please try again later.");
    });
};

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#0d0d0d",
      color: "#f0ece4",
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "3rem",
        borderRight: "1px solid #1e1e1e",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,145,90,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "0.5rem",
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              background: "#b4915a",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              color: "#0d0d0d",
              fontStyle: "italic",
              fontWeight: "bold",
            }}>A</div>
            <span style={{ fontSize: "18px", letterSpacing: "0.12em", color: "#b4915a" }}>
              AETHER
            </span>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{
            fontSize: "13px",
            letterSpacing: "0.2em",
            color: "#5a5a5a",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}>Member Access</p>
          <h1 style={{
            fontSize: "clamp(2.5rem, 4vw, 4rem)",
            fontWeight: "400",
            lineHeight: "1.1",
            margin: "0 0 1.5rem",
            color: "#f0ece4",
          }}>
            Welcome<br />
            <em style={{ color: "#b4915a" }}>back.</em>
          </h1>
          <p style={{
            fontSize: "15px",
            color: "#5a5a5a",
            maxWidth: "300px",
            lineHeight: "1.7",
            margin: 0,
          }}>
            Continue your journey where you left off.
          </p>
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "2rem" }}>
          {["Privacy", "Terms", "Support"].map((link) => (
            <span key={link} style={{
              fontSize: "12px",
              letterSpacing: "0.1em",
              color: "#3a3a3a",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#b4915a"}
              onMouseLeave={e => e.target.style.color = "#3a3a3a"}
            >
              {link.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "3rem 3.5rem",
      }}>
        <p style={{
          fontSize: "21px",
          letterSpacing: "0.18em",
          color: "#696969",
          textTransform: "uppercase",
          marginBottom: "2.5rem",
        }}>Sign in to your account</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Email */}
          <div>
            <label style={{
              display: "block",
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "#6a6a6a",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: `1px solid ${email ? "#b4915a" : "#2a2a2a"}`,
                color: "#f0ece4",
                fontSize: "15px",
                padding: "10px",
                outline: "none",
                transition: "border-color 0.3s",
                boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderBottomColor = "#b4915a"}
              onBlur={e => e.target.style.borderBottomColor = email ? "#b4915a" : "#2a2a2a"}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: "block",
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "#6a6a6a",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${password ? "#b4915a" : "#2a2a2a"}`,
                  color: "#f0ece4",
                  fontSize: "15px",
                  padding: "10px 32px 10px 10px",
                  outline: "none",
                  transition: "border-color 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderBottomColor = "#b4915a"}
                onBlur={e => e.target.style.borderBottomColor = password ? "#b4915a" : "#2a2a2a"}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#4a4a4a",
                  cursor: "pointer",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  padding: "10px",
                }}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div style={{ textAlign: "right" }}>
            <span style={{
              fontSize: "12px",
              color: "#4a4a4a",
              cursor: "pointer",
              letterSpacing: "0.08em",
              transition: "color 0.2s",
            }}
                onClick={()=>navigate("/reset-password")}
              onMouseEnter={e => e.target.style.color = "#b4915a"}
              onMouseLeave={e => e.target.style.color = "#4a4a4a"}
            >Forgot password?</span>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            style={{
              marginTop: "0.5rem",
              background: email && password ? "#b4915a" : "#1e1e1e",
              border: "none",
              color: email && password ? "#0d0d0d" : "#3a3a3a",
              padding: "15px 32px",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: email && password ? "pointer" : "default",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
            onMouseEnter={e => { if (email && password) e.currentTarget.style.background = "#c9a670"; }}
            onMouseLeave={e => { if (email && password) e.currentTarget.style.background = "#b4915a"; }}
          >
            {loading ? (
              <>
                <span style={{
                  width: "14px",
                  height: "14px",
                  border: "2px solid #0d0d0d",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  display: "inline-block",
                }} />
                Signing in
              </>
            ) : "Continue"}
          </button>
        </div>

        <div style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #1e1e1e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "13px", color: "#4a4a4a" }}>New here?</span>
          <span style={{
            fontSize: "12px",
            letterSpacing: "0.12em",
            color: "#b4915a",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
          onClick={()=>navigate("/signup")}>Create an account →</span>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          input::placeholder { color: #2e2e2e; }
        `}</style>
      </div>
    </div>
  );
};

export default SignIn;