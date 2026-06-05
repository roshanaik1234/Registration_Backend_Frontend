import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Singout = () => {
  const nevigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', gender: '', conNumber: '', password: '', confirmPassword: ''
  })
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const pwMatch = form.confirmPassword && form.password === form.confirmPassword
  const pwMismatch = form.confirmPassword && form.password !== form.confirmPassword

  const strengthScore = (p) => {
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }
  const score = strengthScore(form.password)
  const strengthColors = ['', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71']
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pwMismatch || !form.password) return

    try {
      fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      .then(res => res.json())
      .then(data => {
            setLoading(true)
        if (data.success) {
          setSubmitted(true)
      
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1600)
          alert('Registration successful! You can now sign in.')
        }else{
          alert('Registration failed: ' + (data.message || 'Unknown error'))
            
              setTimeout(() => { setLoading(false); setSubmitted(true) }, 1600)
        }
      })
    } catch (err) {
      console.error('Signup error:', err)
    }

    console.log('Form submitted:', form)
    
  }

  if (submitted) return (
    <div style={styles.page}>
      <style>{css}</style>
      <div style={styles.successBox}>
        <div style={styles.successIcon}>✓</div>
        <h2 style={styles.successTitle}>Account Created!</h2>
        <p style={styles.successSub}>Welcome, {form.name.split(' ')[0] || 'there'}. You're all set.</p>
        <button style={styles.successBtn} onClick={()=>{nevigate("/")}}>Go to Sign In →</button>
      </div>
    </div>
  )

  return (
    <div style={styles.page} className="su-page">
      <style>{css}</style>

      <div style={styles.card} className="su-card">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>✦</span>
          </div>
          <h1 style={styles.title}>Sign Up</h1>
          <p style={styles.subtitle}>Create your free account today</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Name */}
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Full Name</label>
            <input
              type="text" id="name" name="name" required
              value={form.name} onChange={set('name')}
              placeholder="Jane Smith"
              style={styles.input}
              className="su-input"
            />
          </div>

          {/* Email */}
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email" id="email" name="email" required
              value={form.email} onChange={set('email')}
              placeholder="you@example.com"
              style={styles.input}
              className="su-input"
            />
          </div>

          {/* Gender */}
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="Gender" style={styles.label}>Gender</label>
            <select
              id="Gender" name="Gender" required
              value={form.gender} onChange={set('gender')}
              style={{ ...styles.input, cursor: 'pointer' }}
              className="su-input"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not">Prefer not to say</option>
            </select>
          </div>

          {/* Contact Number */}
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="contactNum" style={styles.label}>Contact Number</label>
            <input
              type="tel" id="contactNum" name="contactNum" required
              value={form.contactNum} onChange={set('contactNum')}
              placeholder="+1 (555) 000-0000"
              style={styles.input}
              className="su-input"
            />
          </div>

          {/* Password */}
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <input
                type={showPw ? 'text' : 'password'} id="password" name="password" required
                value={form.password} onChange={set('password')}
                placeholder="Min. 8 characters"
                style={{ ...styles.input, paddingRight: '52px' }}
                className="su-input"
              />
              <button type="button" style={styles.toggle} onClick={() => setShowPw(!showPw)}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            {form.password && (
              <div style={styles.strengthWrap}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ ...styles.strengthBar, background: i <= score ? strengthColors[score] : '#e8e3d8' }} />
                ))}
                <span style={{ ...styles.strengthLabel, color: strengthColors[score] }}>
                  {strengthLabels[score]}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrap}>
              <input
                type={showCpw ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" required
                value={form.confirmPassword} onChange={set('confirmPassword')}
                placeholder="Repeat your password"
                style={{
                  ...styles.input,
                  paddingRight: '52px',
                  borderColor: pwMatch ? '#2ecc71' : pwMismatch ? '#e74c3c' : '#ddd'
                }}
                className="su-input"
              />
              <button type="button" style={styles.toggle} onClick={() => setShowCpw(!showCpw)}>
                {showCpw ? 'Hide' : 'Show'}
              </button>
            </div>
            {pwMatch && <p style={{ ...styles.hint, color: '#2ecc71' }}>✓ Passwords match</p>}
            {pwMismatch && <p style={{ ...styles.hint, color: '#e74c3c' }}>✗ Passwords don't match</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={styles.submitBtn}
            className="su-submit"
          >
            {loading
              ? <span style={styles.spinner} />
              : 'Sign Up'}
          </button>

          <p style={styles.loginLink}>
            Already have an account?{' '}
            <span style={styles.loginLinkSpan} onClick={()=>{nevigate("/")}}>Sign in</span>
          </p>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  card: {
    background: '#ffffff',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '460px',
    padding: '2.5rem 2.5rem 2rem',
    boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logo: {
    width: '52px',
    height: '52px',
    background: '#1a1a2e',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    fontSize: '22px',
    color: '#e8c97a',
  },
  logoIcon: { lineHeight: 1 },
  title: {
    fontSize: '1.85rem',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: '0 0 0.3rem',
  },
  subtitle: {
    fontSize: '14px',
    color: '#aaa',
    margin: 0,
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0' },
  formGroup: { marginBottom: '1.2rem' },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    color: '#555',
    marginBottom: '6px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #e8e3d8',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1a1a2e',
    background: '#fafaf8',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.25s, background 0.25s',
    fontFamily: 'inherit',
  },
  inputWrap: { position: 'relative' },
  toggle: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '12px',
    color: '#aaa',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 500,
    padding: 0,
  },
  strengthWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '7px',
  },
  strengthBar: {
    flex: 1,
    height: '3px',
    borderRadius: '2px',
    transition: 'background 0.3s',
  },
  strengthLabel: {
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    marginLeft: '4px',
    minWidth: '28px',
    textTransform: 'uppercase',
  },
  hint: { margin: '5px 0 0', fontSize: '12px', fontWeight: 500 },
  submitBtn: {
    marginTop: '0.5rem',
    width: '100%',
    padding: '14px',
    background: '#1a1a2e',
    border: 'none',
    borderRadius: '10px',
    color: '#e8c97a',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    transition: 'background 0.25s',
  },
  spinner: {
    width: '16px', height: '16px',
    border: '2px solid #e8c97a',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
  loginLink: { textAlign: 'center', fontSize: '13px', color: '#aaa', margin: '1rem 0 0' },
  loginLinkSpan: { color: '#1a1a2e', fontWeight: 600, cursor: 'pointer' },
  successBox: {
    background: '#fff',
    borderRadius: '24px',
    padding: '3.5rem 2.5rem',
    textAlign: 'center',
    maxWidth: '380px',
    width: '100%',
  },
  successIcon: {
    width: '68px', height: '68px',
    borderRadius: '50%',
    background: '#1a1a2e',
    color: '#e8c97a',
    fontSize: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 1.5rem',
  },
  successTitle: { fontSize: '2rem', fontWeight: 700, color: '#1a1a2e', margin: '0 0 0.5rem' },
  successSub: { fontSize: '14px', color: '#999', margin: '0 0 2rem' },
  successBtn: {
    background: '#1a1a2e', color: '#e8c97a', border: 'none',
    padding: '12px 28px', borderRadius: '10px',
    fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .su-page { animation: fadeUp 0.5s ease both; }
  .su-card { animation: fadeUp 0.5s ease both; }
  .su-input:focus { border-color: #1a1a2e !important; background: #fff !important; }
  .su-input::placeholder { color: #ccc; }
  .su-submit:hover { background: #2d2d4e !important; }
  .form-group { animation: fadeUp 0.4s ease both; }
  .form-group:nth-child(1) { animation-delay: 0.05s; }
  .form-group:nth-child(2) { animation-delay: 0.1s; }
  .form-group:nth-child(3) { animation-delay: 0.15s; }
  .form-group:nth-child(4) { animation-delay: 0.2s; }
  .form-group:nth-child(5) { animation-delay: 0.25s; }
  .form-group:nth-child(6) { animation-delay: 0.3s; }
`

export default Singout