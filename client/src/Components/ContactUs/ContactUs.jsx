import React, { useState, useEffect, useRef } from "react";
import './ContactUs.css'


const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.556 4.122 1.528 5.855L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.015-1.38l-.36-.213-3.735.975.998-3.645-.235-.374A9.818 9.818 0 1112 21.818z"/>
  </svg>
);

const contactItems = [
  { icon: "📍", label: "Address", value: "Bangalore, India" },
  { icon: "📞", label: "Phone", value: "+91 9164001231\n+91 6363865515" },
  { icon: <WhatsappIcon />, label: "WhatsApp", value: "+91 8660799143", green: true },
  { icon: "📧", label: "Email", value: "experience@sequencesurface.com" },
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const cursorRef = useRef(null);

  // Cursor follower
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    const move = (e) => {
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1800);
  };

  const expandCursor = () => cursorRef.current?.classList.add("expanded");
  const shrinkCursor = () => cursorRef.current?.classList.remove("expanded");

  return (
    <>
    <div className="cu-parent-div">
      <div ref={cursorRef} className="cu-cursor" />

      <div className="cu-root">
        <div className="cu-deco cu-deco-circle" />
        <div className="cu-deco cu-deco-circle2" />

        <div className="cu-inner">
          {/* HEADER */}
          <div className="cu-header">
            <div>
              <p className="cu-eyebrow">Sequence Surface</p>
              <h1 className="cu-title">Let's<br /><em>Connect</em></h1>
            </div>
            <div className="cu-header-rule" />
          </div>

          {/* MAIN GRID */}
          <div className="cu-grid">
            {/* INFO SIDE */}
            <div className="cu-info">
              <p className="cu-tagline">
                Whether it's about our products, pricing, or a simple hello — our team is ready and waiting.
              </p>

              <p className="cu-details-label">Reach us at</p>

              {contactItems.map((item, i) => (
                <div
                  key={i}
                  className="cu-contact-item"
                  onMouseEnter={expandCursor}
                  onMouseLeave={shrinkCursor}
                >
                  <div className="cu-icon-wrap" style={item.green ? { color: "#22c55e" } : {}}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="cu-item-label">{item.label}</p>
                    <p className="cu-item-value" style={{ whiteSpace: "pre-line" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FORM SIDE */}
            <div
              className="cu-form-wrap"
              onMouseEnter={expandCursor}
              onMouseLeave={shrinkCursor}
            >
              {submitted ? (
                <div className="cu-success">
                  <div className="cu-success-icon">✓</div>
                  <h3>Message Sent</h3>
                  <p>We'll get back to you shortly.</p>
                </div>
              ) : (
                <>
                  <h2 className="cu-form-title">Send a Message</h2>
                  <p className="cu-form-sub">We typically respond within 24 hours.</p>

                  <form onSubmit={handleSubmit}>
                    <div className="cu-row">
                      <div className="cu-field">
                        <label>Your Name</label>
                        <input name="name" value={form.name} onChange={handleChange} required placeholder="Jane Smith" />
                        <div className="cu-field-underline" />
                      </div>
                      <div className="cu-field">
                        <label>Email Address</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="jane@email.com" />
                        <div className="cu-field-underline" />
                      </div>
                    </div>

                    <div className="cu-field">
                      <label>Subject</label>
                      <input name="subject" value={form.subject} onChange={handleChange} placeholder="Product inquiry, pricing..." />
                      <div className="cu-field-underline" />
                    </div>

                    <div className="cu-field">
                      <label>Your Message</label>
                      <textarea name="message" rows="5" value={form.message} onChange={handleChange} required placeholder="Tell us what's on your mind..." />
                      <div className="cu-field-underline" />
                    </div>

                    <button className="cu-btn" type="submit" disabled={loading}>
                      {loading
                        ? <div className="cu-loading-ring" />
                        : <span>Send Message</span>
                      }
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* MAP */}
          <div className="cu-map-section">
            <p className="cu-map-label">Find us in Bangalore</p>
            <div className="cu-map-frame">
              <iframe
                title="Sequence Surface Location"
                src="https://maps.google.com/maps?q=12.9716,77.5946&output=embedhttps://maps.google.com/maps?q=Bangalore&t=&z=13&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}