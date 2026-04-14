import "./PrivacyPolicy.css";

const lastUpdated = "April 14, 2026";

const sections = [
  {
    id: 1,
    title: "Information We Collect",
    content: `We collect information you provide directly to us when you fill out contact forms, request samples, place orders, or communicate with our team. This may include your name, email address, phone number, shipping address, and any preferences or notes you share with us.

We also automatically collect certain technical information when you visit our website, such as your IP address, browser type, pages visited, and time spent on each page. This helps us understand how our site is used and improve your experience.`,
  },
  {
    id: 2,
    title: "How We Use Your Information",
    content: `The information we collect is used to process your orders and service requests, respond to your inquiries, send you updates about products or promotions (only if you've opted in), and improve our website and services.

We do not sell, rent, or trade your personal information to third parties for their marketing purposes. Your data is used solely to serve you better and operate our business effectively.`,
  },
  {
    id: 3,
    title: "Cookies & Tracking",
    content: `Our website uses cookies — small text files stored on your device — to remember your preferences, keep you logged in, and analyse site traffic. You can control cookie settings through your browser at any time.

We may also use third-party analytics tools (such as Google Analytics) that collect anonymised data about how visitors interact with our site. This data is aggregated and cannot be used to personally identify you.`,
  },
  {
    id: 4,
    title: "Data Sharing & Disclosure",
    content: `We may share your information with trusted service providers who assist us in operating our website, processing payments, or fulfilling orders — but only to the extent necessary and under strict confidentiality agreements.

We may also disclose your information if required by law, to protect our legal rights, or in the event of a business merger or acquisition. In all such cases, we take steps to ensure your data continues to be protected.`,
  },
  {
    id: 5,
    title: "Data Retention",
    content: `We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable law. When your data is no longer needed, we securely delete or anonymise it.

If you'd like us to delete your data before that time, you can contact us directly and we will process your request in accordance with applicable regulations.`,
  },
  {
    id: 6,
    title: "Your Rights",
    content: `You have the right to access the personal information we hold about you, request corrections to inaccurate data, ask us to delete your information, and opt out of marketing communications at any time.

To exercise any of these rights, please reach out to us using the contact details provided below. We aim to respond to all requests within 30 days.`,
  },
  {
    id: 7,
    title: "Data Security",
    content: `We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. This includes secure servers, encrypted connections (HTTPS), and restricted internal access to sensitive data.

While we take every reasonable precaution, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and keep your account credentials confidential.`,
  },
  {
    id: 8,
    title: "Third-Party Links",
    content: `Our website may contain links to third-party websites, including social media platforms and partner showrooms. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies independently.

This Privacy Policy applies solely to information collected through the Sequence Surface website and our direct communications with you.`,
  },
  {
    id: 9,
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we do, we will revise the "Last Updated" date at the top of this page.

We encourage you to review this policy periodically. Continued use of our website after any changes constitutes your acceptance of the updated policy.`,
  },
  {
    id: 10,
    title: "Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please don't hesitate to get in touch.

Email: privacy@sequencesurface.com
Phone: +91 80 1234 5678
Address: Sequence Surface Pvt. Ltd., Bangalore, Karnataka, India`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="pp-page">
      <div className="pp-container">

        {/* Hero */}
        <div className="pp-hero">
          <span className="pp-eyebrow">Legal</span>
          <h1 className="pp-heading">Privacy Policy</h1>
          <p className="pp-meta">Last updated: {lastUpdated}</p>
          <p className="pp-intro">
            At Sequence Surface, your privacy matters. This policy explains what information we
            collect, how we use it, and the choices you have. We keep things straightforward —
            no unnecessary jargon.
          </p>
        </div>

        {/* Divider */}
        <div className="pp-hero-divider" />

        {/* Sections */}
        <div className="pp-sections">
          {sections.map((section) => (
            <div key={section.id} className="pp-section">
              <div className="pp-section-header">
                <span className="pp-section-number">0{section.id}</span>
                <h2 className="pp-section-title">{section.title}</h2>
              </div>
              <div className="pp-section-body">
                {section.content.split("\n\n").map((para, i) => (
                  <p key={i} className="pp-para">{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="pp-footer-note">
          <p>
            This policy was last reviewed on <strong>{lastUpdated}</strong>. For the most
            current version, always refer to this page.
          </p>
        </div>

      </div>
    </div>
  );
}