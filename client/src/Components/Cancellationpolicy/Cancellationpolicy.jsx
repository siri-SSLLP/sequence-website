import { useState } from "react";
import "./Cancellationpolicy.css";

const sections = [
  {
    id: "overview",
    number: "01",
    title: "Overview",
    content: `At Sequence Surface, we are committed to ensuring a smooth and transparent purchasing experience. This Cancellation Policy outlines the terms under which orders may be cancelled, modified, or returned. By placing an order with us, you agree to the terms described below.`,
  },
  {
    id: "order-cancellation",
    number: "02",
    title: "Order Cancellation",
    subsections: [
      {
        heading: "Before Dispatch",
        text: "Orders may be cancelled without any penalty within 24 hours of placement, provided the order has not yet been dispatched from our warehouse. To initiate a cancellation, please contact our support team at the earliest.",
      },
      {
        heading: "After Dispatch",
        text: "Once an order has been dispatched, cancellations are not accepted. In such cases, you may initiate a return after delivery, subject to our Return Policy terms. Shipping charges incurred will not be refunded.",
      },
      {
        heading: "Custom & Special Orders",
        text: "Orders for customised products, special cuts, or bulk quantities are non-cancellable once production or processing has begun. Please review all specifications carefully before confirming such orders.",
      },
    ],
  },
  {
    id: "returns",
    number: "03",
    title: "Returns & Exchanges",
    subsections: [
      {
        heading: "Eligibility",
        text: "Returns are accepted only for products that are defective, damaged in transit, or significantly different from what was described at the time of purchase. Products must be reported within 48 hours of delivery.",
      },
      {
        heading: "Condition of Return",
        text: "Items must be returned in their original packaging, unused, and in the same condition as received. We reserve the right to reject returns that do not meet these conditions.",
      },
      {
        heading: "Non-Returnable Items",
        text: "Sample books, catalogue folders, cut pieces, clearance items, and any product that has been installed or modified are not eligible for return or exchange.",
      },
    ],
  },
  {
    id: "refunds",
    number: "04",
    title: "Refund Policy",
    content: `Once a return is approved and the product is received and inspected at our warehouse, refunds will be processed within 7–10 business days to the original payment method. Shipping charges and handling fees are non-refundable unless the return is due to an error on our part. For credit note or exchange requests, processing may take up to 5 business days.`,
  },
  {
    id: "how-to-cancel",
    number: "05",
    title: "How to Cancel or Return",
    steps: [
      "Contact us via phone, WhatsApp, or email with your Order ID and reason for cancellation or return.",
      "Our team will verify eligibility and provide a Return Authorisation Number (RAN).",
      "Securely pack the item(s) along with the RAN and dispatch to our warehouse address.",
      "Upon receipt and inspection, we will process your refund or exchange within the stipulated timeframe.",
    ],
  },
  {
    id: "contact",
    number: "06",
    title: "Contact & Support",
    content: `For any cancellation or return queries, please reach out to our team:`,
    contact: [
      { label: "Phone", value: "+91 91640 01231 / +91 63638 65515" },
      { label: "WhatsApp", value: "+91 86607 99143" },
      { label: "Hours", value: "Mon – Fri, 11 AM to 7 PM" },
      {
        label: "Address",
        value:
          "No 269/1 Mysore Road, Kasturiba Nagar, Bangalore – 560026",
      },
    ],
  },
];

export default function CancellationPolicy() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="cp-page">
      {/* Hero banner */}
      <div className="cp-hero">
        <div className="cp-hero-inner">
          <span className="cp-hero-tag">Legal &amp; Policies</span>
          <h1 className="cp-hero-title">Cancellation Policy</h1>
          <p className="cp-hero-sub">
            Effective Date: April 1, 2026 &nbsp;|&nbsp; Last Updated: April
            2026
          </p>
        </div>
        <div className="cp-hero-rule" />
      </div>

      <div className="cp-body">
        {/* Sidebar nav */}
        <aside className="cp-sidebar">
          <p className="cp-sidebar-label">Contents</p>
          <nav className="cp-nav">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`cp-nav-item ${
                  activeSection === s.id ? "cp-nav-item--active" : ""
                }`}
                onClick={() => setActiveSection(s.id)}
              >
                <span className="cp-nav-num">{s.number}</span>
                <span className="cp-nav-title">{s.title}</span>
              </a>
            ))}
          </nav>

          <div className="cp-sidebar-cta">
            <p>Have a question?</p>
            <a href="/contact-us" className="cp-sidebar-btn"> Contact Us </a>
            {/* <Link to={"https://sequencesurface.com/contact"} className="cp-sidebar-btn"> Contact Us </Link> */}
            {/* <Link to={'/contact-us'}>Contact Us</Link> */}
          </div>
        </aside>

        {/* Main content */}
        <main className="cp-main">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="cp-section"
              onMouseEnter={() => setActiveSection(s.id)}
            >
              <div className="cp-section-header">
                <span className="cp-section-num">{s.number}</span>
                <h2 className="cp-section-title">{s.title}</h2>
              </div>

              {s.content && <p className="cp-text">{s.content}</p>}

              {s.subsections && (
                <div className="cp-subsections">
                  {s.subsections.map((sub) => (
                    <div key={sub.heading} className="cp-subsection">
                      <h3 className="cp-subsection-heading">{sub.heading}</h3>
                      <p className="cp-text">{sub.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {s.steps && (
                <ol className="cp-steps">
                  {s.steps.map((step, i) => (
                    <li key={i} className="cp-step">
                      <span className="cp-step-num">{i + 1}</span>
                      <span className="cp-step-text">{step}</span>
                    </li>
                  ))}
                </ol>
              )}

              {s.contact && (
                <div className="cp-contact-grid">
                  {s.contact.map((c) => (
                    <div key={c.label} className="cp-contact-item">
                      <span className="cp-contact-label">{c.label}</span>
                      <span className="cp-contact-value">{c.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          <div className="cp-footer-note">
            <p>
              Sequence Surface reserves the right to amend this policy at any
              time without prior notice. Continued use of our services
              constitutes acceptance of the updated policy.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}