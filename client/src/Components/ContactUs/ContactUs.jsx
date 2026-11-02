import React, { useState } from "react";
import "./ContactUs.css";
import { WhatsappNumber } from "../../assets/assets.js";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  message: "",
};

export default function ContactUs() {
  const [form, setForm] = useState(emptyForm);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setSent(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // The server has no contact route yet, so enquiries go through WhatsApp
  const handleSubmit = (e) => {
    e.preventDefault();

    const enquiry = [
      "Hello, I have an enquiry.",
      `Name: ${form.firstName.trim()} ${form.lastName.trim()}`,
      `Email: ${form.email.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `City: ${form.city.trim()}`,
      `Message: ${form.message.trim()}`,
    ].join("\n");

    window.open(
      `https://wa.me/${WhatsappNumber.replace("+", "")}?text=${encodeURIComponent(enquiry)}`,
      "_blank"
    );
    setSent(true);
  };

  return (
    <div className="ct-page">
      <h1 className="ct-title">
        Let's <em>Connect!</em>
      </h1>

      <form className="ct-card" onSubmit={handleSubmit}>
        <div className="ct-row">
          <div className="ct-field">
            <label htmlFor="ct-first-name">First Name*</label>
            <input
              id="ct-first-name"
              type="text"
              name="firstName"
              placeholder="First Name"
              autoComplete="given-name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="ct-field">
            <label htmlFor="ct-last-name">Last Name*</label>
            <input
              id="ct-last-name"
              type="text"
              name="lastName"
              placeholder="Last Name"
              autoComplete="family-name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="ct-field">
          <label htmlFor="ct-email">Email*</label>
          <input
            id="ct-email"
            type="email"
            name="email"
            placeholder="Enter your email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="ct-field">
          <label htmlFor="ct-phone">Phone Number*</label>
          <input
            id="ct-phone"
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            autoComplete="tel"
            pattern="[+]?[0-9 \-]{10,15}"
            title="Enter a phone number with at least 10 digits"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="ct-field">
          <label htmlFor="ct-city">City*</label>
          <input
            id="ct-city"
            type="text"
            name="city"
            placeholder="Enter your city"
            autoComplete="address-level2"
            value={form.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="ct-field">
          <label htmlFor="ct-message">Your Message*</label>
          <textarea
            id="ct-message"
            name="message"
            placeholder="Write here..."
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="ct-submit">Send on WhatsApp</button>

        <p className="ct-note" role="status">
          {sent
            ? "WhatsApp is open with your details. Press send there to reach our team."
            : "We'll open WhatsApp with your details filled in, ready to send."}
        </p>
      </form>

      <div className="ct-details">
        <div>
          <h2>Visit our showroom</h2>
          <p>
            Sequence Surfaces LLP
            <br />
            No 269/1 Mysore Road, Kasturiba Nagar
            <br />
            Bangalore - 560026
          </p>
          <a href="https://maps.app.goo.gl/uoXK3vrvdthMMRck7" target="_blank" rel="noreferrer">
            View on map
          </a>
        </div>

        <div>
          <h2>Talk to us</h2>
          <p>
            <a href="tel:+919164001231">+91 9164001231</a>
            <br />
            <a href="tel:+916363865515">+91 6363865515</a>
            <br />
            <a href="mailto:experience@sequencesurface.com">experience@sequencesurface.com</a>
          </p>
        </div>

        <div>
          <h2>Opening hours</h2>
          <p>Mon - Fri, 11 AM to 7 PM</p>
        </div>
      </div>
    </div>
  );
}
