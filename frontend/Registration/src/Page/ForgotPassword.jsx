import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [resent, setResent] = useState(false)

  const strengthScore = (p) => {
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }
  const score = strengthScore(password)
  const sColors = ["", "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71"]
  const sLabels = ["", "Weak", "Fair", "Good", "Strong"]

  const pwMatch = confirm && password === confirm
  const pwMismatch = confirm && password !== confirm
  const otpFilled = otp.every(d => d !== "")

  const go = (nextStep) => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(nextStep) }, 1400)
  }

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
  }

  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      document.getElementById(`otp-${i - 1}`)?.focus()
  }

  const handleResend = () => {
    setResent(true)
    setOtp(["", "", "", "", "", ""])
    setTimeout(() => setResent(false), 3000)
  }

  const handleReset = () => {
    if (!pwMatch) return
    // setLoading(true)
    // setTimeout(() => { setLoading(false); setDone(true) }, 1500)
      try {
        fetch('http://localhost:3000/password-reset', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            { email,newPassword: password })
        })
       .then(res => res.json())
        .then(data => {
          if (data.success) {
            setDone(true)
            setLoading(true)
            setTimeout(() => { setLoading(false); setDone(true) }, 1600)
            alert('Password reset successful! You can now sign in with your new password.')
          }else{
            alert('Password reset failed: ' + (data.message || 'Unknown error'))
          }
        })
       .catch(err => {
         console.error('Error:', err)
       })
      } 
      catch (err) {
        console.error('Error:', err)
      }
  }

  if (done) return (
    <div style={S.page}>
      <style>{css}</style>
      <div style={S.card} className="fp-card">
        <div style={S.successIcon}>✓</div>
        <h2 style={S.successTitle}>Password Reset!</h2>
        <p style={S.successSub}>Your password has been updated successfully.</p>
        <button style={S.btn} className="fp-btn" onClick={()=>navigate('/')}>Back to Sign In →</button>
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      <style>{css}</style>
      <div style={S.card} className="fp-card">

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={S.logo}>✦</div>
          <h1 style={S.title}>
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify Email"}
            {step === 3 && "Reset Password"}
          </h1>
          <p style={S.subtitle}>
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && `We sent a 6-digit code to ${email}`}
            {step === 3 && "Choose a strong new password"}
          </p>
        </div>

        {/* Step indicators */}
        <div style={S.steps}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                ...S.stepDot,
                background: step >= n ? "#1a1a2e" : "#e8e3d8",
                color: step >= n ? "#e8c97a" : "#bbb",
                transform: step === n ? "scale(1.15)" : "scale(1)",
              }}>{step > n ? "✓" : n}</div>
              {n < 3 && <div style={{ width: "36px", height: "2px", background: step > n ? "#1a1a2e" : "#e8e3d8", borderRadius: "2px", transition: "background 0.4s" }} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Email ── */}
        {step === 1 && (
          <div className="fp-step">
            <div style={S.fg}>
              <label style={S.lbl}>Email Address</label>
              <input
                className="fp-inp"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={S.inp}
                onKeyDown={e => e.key === "Enter" && email.includes("@") && go(2)}
              />
            </div>
            <button
              className="fp-btn"
              style={{ ...S.btn, background: email.includes("@") ? "#1a1a2e" : "#ccc", cursor: email.includes("@") ? "pointer" : "default" }}
              onClick={() => email.includes("@") && go(2)}
              disabled={loading}
            >
              {loading
                ? <span style={S.spinner} />
                : "Send Reset Code"}
            </button>
            <p style={S.back} onClick={()=>{navigate("/")}}>Remembered it? <span className="fp-link">Sign in</span></p>
          </div>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === 2 && (
          <div className="fp-step">
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "0.5rem 0 1.5rem" }}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  className="fp-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                  style={{
                    ...S.otpBox,
                    borderColor: d ? "#1a1a2e" : "#e8e3d8",
                    background: d ? "#f0f0f8" : "#fafaf8",
                  }}
                />
              ))}
            </div>
            {resent && <p style={{ textAlign: "center", fontSize: "12px", color: "#2ecc71", marginBottom: "1rem" }}>✓ Code resent to {email}</p>}
            <button
              className="fp-btn"
              style={{ ...S.btn, background: otpFilled ? "#1a1a2e" : "#ccc", cursor: otpFilled ? "pointer" : "default" }}
              onClick={() => otpFilled && go(3)}
              disabled={loading}
            >
              {loading ? <span style={S.spinner} /> : "Verify Code"}
            </button>
            <p style={S.back}>
              Didn't receive it?{" "}
              <span className="fp-link" onClick={handleResend}>Resend code</span>
            </p>
          </div>
        )}

        {/* ── STEP 3: New Password ── */}
        {step === 3 && (
          <div className="fp-step">
            <div style={S.fg}>
              <label style={S.lbl}>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="fp-inp"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...S.inp, paddingRight: "52px" }}
                />
                <button style={S.tog} onClick={() => setShowPw(!showPw)}>{showPw ? "HIDE" : "SHOW"}</button>
              </div>
              {password && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center", marginTop: "7px" }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i <= score ? sColors[score] : "#e8e3d8", transition: "background 0.3s" }} />
                  ))}
                  <span style={{ fontSize: "10px", fontWeight: 600, color: sColors[score], marginLeft: "5px", fontFamily: "'DM Sans',sans-serif", textTransform: "uppercase", minWidth: "30px" }}>
                    {sLabels[score]}
                  </span>
                </div>
              )}
            </div>

            <div style={S.fg}>
              <label style={S.lbl}>Confirm New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="fp-inp"
                  type={showCpw ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  style={{ ...S.inp, paddingRight: "52px", borderColor: pwMatch ? "#2ecc71" : pwMismatch ? "#e74c3c" : "#e8e3d8" }}
                />
                <button style={S.tog} onClick={() => setShowCpw(!showCpw)}>{showCpw ? "HIDE" : "SHOW"}</button>
              </div>
              {pwMatch && <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#2ecc71", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>✓ Passwords match</p>}
              {pwMismatch && <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#e74c3c", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>✗ Passwords don't match</p>}
            </div>

            <button
              className="fp-btn"
              style={{ ...S.btn, background: pwMatch ? "#1a1a2e" : "#ccc", cursor: pwMatch ? "pointer" : "default" }}
              onClick={handleReset}
              disabled={loading || !pwMatch}
            >
              {loading ? <span style={S.spinner} /> : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const S = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg,#0f0f23 0%,#1a1a2e 55%,#16213e 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", fontFamily: "'DM Sans','Segoe UI',sans-serif" },
  card: { background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "420px", padding: "2.5rem 2.25rem 2rem", boxShadow: "0 32px 80px rgba(0,0,0,0.35)" },
  logo: { width: "50px", height: "50px", background: "#1a1a2e", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.85rem", fontSize: "20px", color: "#e8c97a" },
  title: { fontSize: "1.7rem", fontWeight: 700, color: "#1a1a2e", margin: "0 0 0.3rem", textAlign: "center" },
  subtitle: { fontSize: "13px", color: "#aaa", margin: 0, textAlign: "center", lineHeight: 1.5 },
  steps: { display: "flex", alignItems: "center", justifyContent: "center", gap: "0", marginBottom: "1.75rem" },
  stepDot: { width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, transition: "all 0.35s", flexShrink: 0 },
  fg: { marginBottom: "1.2rem" },
  lbl: { display: "block", fontSize: "11px", fontWeight: 600, color: "#666", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" },
  inp: { width: "100%", padding: "12px 14px", border: "1.5px solid #e8e3d8", borderRadius: "10px", fontSize: "14px", color: "#1a1a2e", background: "#fafaf8", boxSizing: "border-box", outline: "none", transition: "border-color 0.25s,background 0.25s", fontFamily: "inherit" },
  otpBox: { width: "44px", height: "52px", textAlign: "center", fontSize: "20px", fontWeight: 700, border: "1.5px solid #e8e3d8", borderRadius: "10px", outline: "none", transition: "all 0.25s", fontFamily: "inherit", color: "#1a1a2e" },
  btn: { width: "100%", padding: "14px", background: "#1a1a2e", border: "none", borderRadius: "10px", color: "#e8c97a", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em", transition: "background 0.25s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "0.25rem" },
  tog: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: "11px", color: "#aaa", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, padding: 0, letterSpacing: "0.05em" },
  spinner: { width: "15px", height: "15px", border: "2px solid #e8c97a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" },
  back: { textAlign: "center", fontSize: "13px", color: "#aaa", marginTop: "1rem", marginBottom: 0 },
  successIcon: { width: "68px", height: "68px", borderRadius: "50%", background: "#1a1a2e", color: "#e8c97a", fontSize: "28px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" },
  successTitle: { fontSize: "1.9rem", fontWeight: 700, color: "#1a1a2e", textAlign: "center", margin: "0 0 0.4rem" },
  successSub: { fontSize: "14px", color: "#aaa", textAlign: "center", margin: "0 0 2rem" },
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  .fp-card { animation: fadeUp 0.45s ease both; }
  .fp-step { animation: fadeUp 0.35s ease both; }
  .fp-inp:focus { border-color: #1a1a2e !important; background: #fff !important; }
  .fp-inp::placeholder { color: #ccc; }
  .fp-otp:focus { border-color: #1a1a2e !important; background: #f0f0f8 !important; box-shadow: 0 0 0 3px rgba(26,26,46,0.08); }
  .fp-btn:hover { filter: brightness(1.08); }
  .fp-link { color: #1a1a2e; font-weight: 600; cursor: pointer; text-decoration: underline; }
`

export default ForgotPassword