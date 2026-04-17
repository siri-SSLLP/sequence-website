import { useState, useRef, useEffect } from 'react';
import './SigninSignup.css';
import axios from 'axios';
// ── Eye icons ──
const EyeOpen = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);
const EyeClosed = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);

// ── Reusable password input ──
function PasswordInput({ name, placeholder, value, onChange }) {
    const [show, setShow] = useState(false);
    return (
        <div className="auth-password-wrap">
            <input
                type={show ? 'text' : 'password'}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                autoComplete={name === 'password' ? 'current-password' : 'new-password'}
            />
            <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShow(s => !s)}
                tabIndex={-1}
                aria-label={show ? 'Hide password' : 'Show password'}
            >
                {show ? <EyeClosed /> : <EyeOpen />}
            </button>
        </div>
    );
}

// ── Main component ──
function SignInSignUp({ onClose }) {
    const [mode, setMode] = useState('signin');
    const [form, setForm] = useState({ name: '', password: '', confirm: '' });
    const [identifier, setIdentifier] = useState('');
    const [error, setError] = useState('');

    // detect if user is typing phone or email
    const identifierType = /^\d/.test(identifier) ? 'phone' : identifier ? 'email' : null;

    const handleIdentifierChange = (e) => {
        let val = e.target.value;
        if (/^\d/.test(val)) val = val.replace(/\D/g, '').slice(0, 15);
        setIdentifier(val);
        setError('');
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const validate = () => {
        if (mode === 'signup' && !form.name.trim()) return 'Please enter your full name.';
        if (!identifier.trim()) return 'Please enter your email or phone number.';
        if (identifierType === 'phone') {
            if (identifier.length < 6) return 'Enter a valid phone number.';
        } else {
            if (!/\S+@\S+\.\S+/.test(identifier)) return 'Enter a valid email address.';
        }
        if (!form.password) return 'Please enter your password.';
        if (form.password.length < 6) return 'Password must be at least 6 characters.';
        if (mode === 'signup' && form.password !== form.confirm) return 'Passwords do not match.';
        return null;
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     const err = validate();
    //     if (err) return setError(err);
    //     const payload = {
    //         name: form.name,
    //         password: form.password,
    //         ...(identifierType === 'phone'
    //             ? { phone: identifier }
    //             : { email: identifier }),
    //     };
    //     console.log(mode, payload);
    //     // TODO: call your auth API here
    // };


  

const handleSubmit = async (e) => {
  e.preventDefault();
  const err = validate();
  if (err) return setError(err);

  try {
    const url =
      mode === "signin"
        ? "https://testingserver-73um.onrender.com/api/users/login"
        : "https://testingserver-73um.onrender.com/api/users/register";

    const payload = {
      name: form.name,
      password: form.password,
      ...(identifierType === "phone"
        ? { phone: identifier }
        : { email: identifier }),
    };

    const res = await axios.post(url, payload);
    window.dispatchEvent(new Event("storage"));
    // ✅ SAVE TOKEN
    localStorage.setItem("token", res.data.token);
    window.location.reload();
    console.log("Auth success:", res.data);

    onClose(); // close modal
  } catch (err) {
    console.log(err);
    setError("Authentication failed");
  }
};



    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const resetAndSwitch = (newMode) => {
        setMode(newMode);
        setError('');
        setIdentifier('');
        setForm({ name: '', password: '', confirm: '' });
    };

    return (
        <div className="auth-overlay" onClick={handleOverlayClick}>
            <div className="auth-modal">
                <button className="auth-close-btn" onClick={onClose}>✕</button>

                <div className="auth-logo">
                    <img src="https://sequencesurface.com/images/logo.png" alt="Sequence Surface" />
                </div>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
                        onClick={() => resetAndSwitch('signin')}
                    >
                        Sign In
                    </button>
                    <button
                        className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                        onClick={() => resetAndSwitch('signup')}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <div className="auth-form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {/* Combined Email / Phone field */}
                    <div className="auth-form-group">
                        <label>Email or Phone Number</label>
                        <div className="auth-identifier-wrap">
                            <input
                                type="text"
                                placeholder="Email address or phone number"
                                value={identifier}
                                onChange={handleIdentifierChange}
                                inputMode={identifierType === 'phone' ? 'numeric' : 'email'}
                                autoComplete="username"
                            />
                            {identifierType && (
                                <span className={`auth-type-badge ${identifierType}`}>
                                    {identifierType === 'phone' ? '📱' : '✉'}
                                </span>
                            )}
                        </div>
                        <p className="auth-hint">
                            {identifierType === 'phone'
                                ? 'Phone number detected'
                                : identifierType === 'email'
                                ? 'Looks like an email — great!'
                                : 'Start with a digit for phone, or type your email'}
                        </p>
                    </div>

                    {/* Password */}
                    <div className="auth-form-group">
                        <label>Password</label>
                        <PasswordInput
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    {mode === 'signup' && (
                        <div className="auth-form-group">
                            <label>Confirm Password</label>
                            <PasswordInput
                                name="confirm"
                                placeholder="••••••••"
                                value={form.confirm}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {mode === 'signin' && (
                        <div className="auth-forgot">
                            <a href="/forgot-password">Forgot password?</a>
                        </div>
                    )}

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="auth-submit-btn">
                        {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-divider"><span>or continue with</span></div>

                <button className="auth-google-btn">
                    <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    Sign in with Google
                </button>

                <div className="auth-switch">
                    {mode === 'signin' ? (
                        <>Don't have an account?{' '}<button onClick={() => resetAndSwitch('signup')}>Sign Up</button></>
                    ) : (
                        <>Already have an account?{' '}<button onClick={() => resetAndSwitch('signin')}>Sign In</button></>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SignInSignUp;