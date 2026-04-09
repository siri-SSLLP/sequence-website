import React, { useState } from "react";
import "./ContactUs.css";

const contactItems = [
  { icon: "📍", label: "Address", value: "Bangalore, India" },
  { icon: "📞", label: "Phone", value: "+91 9164001231" },
  { icon: "📧", label: "Email", value: "experience@sequencesurface.com" },
];

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent!");
  };

  return (
    <div className="contact-container">
      {/* HEADER */}
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you. Reach out for queries, pricing, or
          collaborations.
        </p>
      </div>

      {/* MAIN */}
      <div className="contact-grid">
        {/* LEFT SIDE */}
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>
            Our team is here to assist you with any product or service related
            queries.
          </p>

          {contactItems.map((item, i) => (
            <div className="contact-item" key={i}>
              <span className="icon">{item.icon}</span>
              <div>
                <h4>{item.label}</h4>
                <p>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="contact-form">
          <h2>Send a Message</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              onChange={handleChange}
              required
            />

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      {/* MAP */}
      <div className="map-section">
        <iframe
          title="map"
          src="https://maps.google.com/maps?q=12.9716,77.5946&output=embedhttps://maps.google.com/maps?q=Bangalore&t=&z=13&ie=UTF8&iwloc=&output=embed"
        />
      </div>
    </div>
  );
}