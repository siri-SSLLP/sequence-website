// import { useState, useRef, useEffect } from 'react';
// import './SigninSignup.css';

// // ── Country list (flag emoji + name + dial code) ──
// const COUNTRIES = [
//     { code: 'IN', name: 'India',                dial: '+91',  flag: '🇮🇳' },
//     { code: 'US', name: 'United States',         dial: '+1',   flag: '🇺🇸' },
//     { code: 'GB', name: 'United Kingdom',        dial: '+44',  flag: '🇬🇧' },
//     { code: 'AU', name: 'Australia',             dial: '+61',  flag: '🇦🇺' },
//     { code: 'CA', name: 'Canada ',                dial: '+1',   flag: '🇨🇦' },
//     { code: 'AE', name: 'UAE',                   dial: '+971', flag: '🇦🇪' },
//     { code: 'SA', name: 'Saudi Arabia',          dial: '+966', flag: '🇸🇦' },
//     { code: 'SG', name: 'Singapore',             dial: '+65',  flag: '🇸🇬' },
//     { code: 'MY', name: 'Malaysia',              dial: '+60',  flag: '🇲🇾' },
//     { code: 'NZ', name: 'New Zealand',           dial: '+64',  flag: '🇳🇿' },
//     { code: 'ZA', name: 'South Africa',          dial: '+27',  flag: '🇿🇦' },
//     { code: 'NG', name: 'Nigeria',               dial: '+234', flag: '🇳🇬' },
//     { code: 'KE', name: 'Kenya',                 dial: '+254', flag: '🇰🇪' },
//     { code: 'GH', name: 'Ghana',                 dial: '+233', flag: '🇬🇭' },
//     { code: 'PK', name: 'Pakistan',              dial: '+92',  flag: '🇵🇰' },
//     { code: 'BD', name: 'Bangladesh',            dial: '+880', flag: '🇧🇩' },
//     { code: 'LK', name: 'Sri Lanka',             dial: '+94',  flag: '🇱🇰' },
//     { code: 'NP', name: 'Nepal',                 dial: '+977', flag: '🇳🇵' },
//     { code: 'PH', name: 'Philippines',           dial: '+63',  flag: '🇵🇭' },
//     { code: 'ID', name: 'Indonesia',             dial: '+62',  flag: '🇮🇩' },
//     { code: 'TH', name: 'Thailand',              dial: '+66',  flag: '🇹🇭' },
//     { code: 'VN', name: 'Vietnam',               dial: '+84',  flag: '🇻🇳' },
//     { code: 'CN', name: 'China',                 dial: '+86',  flag: '🇨🇳' },
//     { code: 'JP', name: 'Japan',                 dial: '+81',  flag: '🇯🇵' },
//     { code: 'KR', name: 'South Korea',           dial: '+82',  flag: '🇰🇷' },
//     { code: 'DE', name: 'Germany',               dial: '+49',  flag: '🇩🇪' },
//     { code: 'FR', name: 'France',                dial: '+33',  flag: '🇫🇷' },
//     { code: 'IT', name: 'Italy',                 dial: '+39',  flag: '🇮🇹' },
//     { code: 'ES', name: 'Spain',                 dial: '+34',  flag: '🇪🇸' },
//     { code: 'NL', name: 'Netherlands',           dial: '+31',  flag: '🇳🇱' },
//     { code: 'SE', name: 'Sweden',                dial: '+46',  flag: '🇸🇪' },
//     { code: 'NO', name: 'Norway',                dial: '+47',  flag: '🇳🇴' },
//     { code: 'CH', name: 'Switzerland',           dial: '+41',  flag: '🇨🇭' },
//     { code: 'BE', name: 'Belgium',               dial: '+32',  flag: '🇧🇪' },
//     { code: 'PT', name: 'Portugal',              dial: '+351', flag: '🇵🇹' },
//     { code: 'PL', name: 'Poland',                dial: '+48',  flag: '🇵🇱' },
//     { code: 'RU', name: 'Russia',                dial: '+7',   flag: '🇷🇺' },
//     { code: 'BR', name: 'Brazil',                dial: '+55',  flag: '🇧🇷' },
//     { code: 'MX', name: 'Mexico',                dial: '+52',  flag: '🇲🇽' },
//     { code: 'AR', name: 'Argentina',             dial: '+54',  flag: '🇦🇷' },
//     { code: 'CL', name: 'Chile',                 dial: '+56',  flag: '🇨🇱' },
//     { code: 'CO', name: 'Colombia',              dial: '+57',  flag: '🇨🇴' },
//     { code: 'EG', name: 'Egypt',                 dial: '+20',  flag: '🇪🇬' },
//     { code: 'QA', name: 'Qatar',                 dial: '+974', flag: '🇶🇦' },
//     { code: 'KW', name: 'Kuwait',                dial: '+965', flag: '🇰🇼' },
//     { code: 'BH', name: 'Bahrain',               dial: '+973', flag: '🇧🇭' },
//     { code: 'OM', name: 'Oman',                  dial: '+968', flag: '🇴🇲' },
//     { code: 'JO', name: 'Jordan',                dial: '+962', flag: '🇯🇴' },
//     { code: 'TR', name: 'Turkey',                dial: '+90',  flag: '🇹🇷' },
//     { code: 'IL', name: 'Israel',                dial: '+972', flag: '🇮🇱' },
// ];

// // ── Eye icons ──
// const EyeOpen = () => (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
//         <circle cx="12" cy="12" r="3"/>
//     </svg>
// );
// const EyeClosed = () => (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
//         <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
//         <line x1="1" y1="1" x2="23" y2="23"/>
//     </svg>
// );
// const ChevronDown = () => (
//     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//         <polyline points="6 9 12 15 18 9"/>
//     </svg>
// );

// // ── Reusable password input ──
// function PasswordInput({ name, placeholder, value, onChange }) {
//     const [show, setShow] = useState(false);
//     return (
//         <div className="auth-password-wrap">
//             <input
//                 type={show ? 'text' : 'password'}
//                 name={name}
//                 placeholder={placeholder}
//                 value={value}
//                 onChange={onChange}
//                 autoComplete={name === 'password' ? 'current-password' : 'new-password'}
//             />
//             <button type="button" className="auth-eye-btn" onClick={() => setShow(s => !s)} tabIndex={-1} aria-label={show ? 'Hide password' : 'Show password'}>
//                 {show ? <EyeClosed /> : <EyeOpen />}
//             </button>
//         </div>
//     );
// }

// // ── Country picker dropdown ──
// function CountryPicker({ selected, onChange }) {
//     const [open, setOpen] = useState(false);
//     const [search, setSearch] = useState('');
//     const ref = useRef(null);
//     const searchRef = useRef(null);

//     const filtered = COUNTRIES.filter(c =>
//         c.name.toLowerCase().includes(search.toLowerCase()) ||
//         c.dial.includes(search)
//     );

//     useEffect(() => {
//         const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//         document.addEventListener('mousedown', handler);
//         return () => document.removeEventListener('mousedown', handler);
//     }, []);

//     useEffect(() => {
//         if (open && searchRef.current) searchRef.current.focus();
//     }, [open]);

//     return (
//         <div className="auth-country-picker" ref={ref}>
//             <button type="button" className="auth-country-trigger" onClick={() => setOpen(o => !o)}>
//                 <span className="auth-flag">{selected.flag}</span>
//                 <span className="auth-dial">{selected.dial}</span>
//                 <span className={`auth-chevron ${open ? 'open' : ''}`}><ChevronDown /></span>
//             </button>

//             {open && (
//                 <div className="auth-country-dropdown">
//                     <div className="auth-country-search-wrap">
//                         <input
//                             ref={searchRef}
//                             type="text"
//                             className="auth-country-search"
//                             placeholder="Search country or code..."
//                             value={search}
//                             onChange={e => setSearch(e.target.value)}
//                         />
//                     </div>
//                     <ul className="auth-country-list">
//                         {filtered.length === 0 && (
//                             <li className="auth-country-empty">No results</li>
//                         )}
//                         {filtered.map(c => (
//                             <li
//                                 key={c.code}
//                                 className={`auth-country-item ${selected.code === c.code ? 'active' : ''}`}
//                                 onClick={() => { onChange(c); setOpen(false); setSearch(''); }}
//                             >
//                                 <span className="auth-flag">{c.flag}</span>
//                                 <span className="auth-country-name">{c.name}</span>
//                                 <span className="auth-country-dial">{c.dial}</span>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// }

// // ── Main component ──
// function SignInSignUp({ onClose }) {
//     const [mode, setMode] = useState('signin');
//     const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // India default
//     const [form, setForm] = useState({ name: '', phone: '', password: '', confirm: '' });
//     const [loginWith, setLoginWith] = useState('email'); // tracks field type
//     const [identifier, setIdentifier] = useState('');    // the combined field value
//     const [error, setError] = useState('');

//     // detect if user is typing phone or email
//     const identifierType = /^\d/.test(identifier) ? 'phone' : identifier ? 'email' : null;

//     const handleIdentifierChange = (e) => {
//         let val = e.target.value;
//         if (/^\d/.test(val)) val = val.replace(/\D/g, '').slice(0, 15);
//         setIdentifier(val);
//         setError('');
//     };

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//         setError('');
//     };

//     const validate = () => {
//         if (mode === 'signup' && !form.name.trim()) return 'Please enter your full name.';
//         if (!identifier.trim()) return 'Please enter your email or phone number.';
//         if (identifierType === 'phone') {
//             if (identifier.length < 6) return 'Enter a valid phone number.';
//         } else {
//             if (!/\S+@\S+\.\S+/.test(identifier)) return 'Enter a valid email address.';
//         }
//         if (!form.password) return 'Please enter your password.';
//         if (form.password.length < 6) return 'Password must be at least 6 characters.';
//         if (mode === 'signup' && form.password !== form.confirm) return 'Passwords do not match.';
//         return null;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const err = validate();
//         if (err) return setError(err);
//         const payload = {
//             name: form.name,
//             password: form.password,
//             ...(identifierType === 'phone'
//                 ? { phone: `${selectedCountry.dial}${identifier}` }
//                 : { email: identifier }),
//         };
//         console.log(mode, payload);
//         // TODO: call your auth API here
//     };

//     const handleOverlayClick = (e) => {
//         if (e.target === e.currentTarget) onClose();
//     };

//     const resetAndSwitch = (newMode) => {
//         setMode(newMode);
//         setError('');
//         setIdentifier('');
//         setForm({ name: '', phone: '', password: '', confirm: '' });
//     };

//     return (
//         <div className="auth-overlay" onClick={handleOverlayClick}>
//             <div className="auth-modal">
//                 <button className="auth-close-btn" onClick={onClose}>✕</button>

//                 <div className="auth-logo">
//                     <img src="https://sequencesurface.com/images/logo.png" alt="Sequence Surface" />
//                 </div>

//                 <div className="auth-tabs">
//                     <button className={`auth-tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => resetAndSwitch('signin')}>Sign In</button>
//                     <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => resetAndSwitch('signup')}>Sign Up</button>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                     {mode === 'signup' && (
//                         <div className="auth-form-group">
//                             <label>Full Name</label>
//                             <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
//                         </div>
//                     )}

//                     {/* Combined Email / Phone field */}
//                     <div className="auth-form-group">
//                         <label>Email or Phone Number</label>
//                         <div className={`auth-identifier-wrap ${identifierType === 'phone' ? 'is-phone' : ''}`}>
//                             {/* Country picker slides in when phone detected */}
//                             <div className={`auth-picker-slide ${identifierType === 'phone' ? 'visible' : ''}`}>
//                                 <CountryPicker selected={selectedCountry} onChange={setSelectedCountry} />
//                                 <span className="auth-field-divider" />
//                             </div>
//                             <input
//                                 type="text"
//                                 placeholder="Email address or phone number"
//                                 value={identifier}
//                                 onChange={handleIdentifierChange}
//                                 inputMode={identifierType === 'phone' ? 'numeric' : 'email'}
//                                 autoComplete="username"
//                             />
//                             {identifierType && (
//                                 <span className={`auth-type-badge ${identifierType}`}>
//                                     {identifierType === 'phone' ? '📱' : '✉'}
//                                 </span>
//                             )}
//                         </div>
//                         <p className="auth-hint">
//                             {identifierType === 'phone'
//                                 ? `Country code: ${selectedCountry.dial} (${selectedCountry.name})`
//                                 : identifierType === 'email'
//                                 ? 'Looks like an email — great!'
//                                 : 'Start with a digit for phone, or type your email'}
//                         </p>
//                     </div>

//                     {/* Password */}
//                     <div className="auth-form-group">
//                         <label>Password</label>
//                         <PasswordInput name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
//                     </div>

//                     {mode === 'signup' && (
//                         <div className="auth-form-group">
//                             <label>Confirm Password</label>
//                             <PasswordInput name="confirm" placeholder="••••••••" value={form.confirm} onChange={handleChange} />
//                         </div>
//                     )}

//                     {mode === 'signin' && (
//                         <div className="auth-forgot">
//                             <a href="/forgot-password">Forgot password?</a>
//                         </div>
//                     )}

//                     {error && <div className="auth-error">{error}</div>}

//                     <button type="submit" className="auth-submit-btn">
//                         {mode === 'signin' ? 'Sign In' : 'Create Account'}
//                     </button>
//                 </form>

//                 <div className="auth-divider"><span>or continue with</span></div>

//                 <button className="auth-google-btn">
//                     <svg width="18" height="18" viewBox="0 0 48 48">
//                         <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
//                         <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
//                         <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
//                         <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
//                     </svg>
//                     Sign in with Google
//                 </button>

//                 <div className="auth-switch">
//                     {mode === 'signin' ? (
//                         <>Don't have an account?{' '}<button onClick={() => resetAndSwitch('signup')}>Sign Up</button></>
//                     ) : (
//                         <>Already have an account?{' '}<button onClick={() => resetAndSwitch('signin')}>Sign In</button></>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SignInSignUp;




import { useState, useRef, useEffect } from 'react';
import './SigninSignup.css';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const err = validate();
        if (err) return setError(err);
        const payload = {
            name: form.name,
            password: form.password,
            ...(identifierType === 'phone'
                ? { phone: identifier }
                : { email: identifier }),
        };
        console.log(mode, payload);
        // TODO: call your auth API here
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