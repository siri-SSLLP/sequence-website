import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaRegClock, FaEnvelope, FaWarehouse } from "react-icons/fa";
import "./VisitStore.css";
import { storeDetails } from "../../assets/storeDetails.js";
import { WhatsappNumber } from "../../assets/assets.js";
import { ProductContext } from "../../Context/Context";

const { showroom, warehouse, phones, email, hours, timeSlots, visitPurposes, highlights } = storeDetails;

// Current day and hour in India, whatever the visitor's own timezone is
const getIndiaNow = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return { day: days.indexOf(get("weekday")), hour: Number(get("hour")) + Number(get("minute")) / 60 };
};

const formatHour = (h) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;

const getOpenStatus = () => {
  const { day, hour } = getIndiaNow();
  const openToday = hours.openDays.includes(day);
  if (openToday && hour >= hours.openHour && hour < hours.closeHour) {
    return { open: true, text: `Open now · closes at ${formatHour(hours.closeHour)}` };
  }
  if (openToday && hour < hours.openHour) {
    return { open: false, text: `Closed now · opens today at ${formatHour(hours.openHour)}` };
  }
  // Find the next open day
  for (let i = 1; i <= 7; i++) {
    const next = (day + i) % 7;
    if (hours.openDays.includes(next)) {
      const name = i === 1 ? "tomorrow" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][next];
      return { open: false, text: `Closed now · opens ${name} at ${formatHour(hours.openHour)}` };
    }
  }
  return { open: false, text: "Closed now" };
};

// yyyy-mm-dd for a date input, in local time
const toInputDate = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const emptyForm = { name: "", phone: "", date: "", slot: "", purpose: visitPurposes[0], notes: "", withFavourites: true };

export default function VisitStore() {
  const { products = [], favourites = {} } = useContext(ProductContext) || {};
  const [form, setForm] = useState(emptyForm);
  const [dateError, setDateError] = useState("");
  const [sent, setSent] = useState(false);

  const status = useMemo(() => getOpenStatus(), []);
  const today = toInputDate(new Date());
  const favouriteNames = products.filter((p) => favourites[p.productId]).map((p) => p.productName);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSent(false);
    if (name === "date") {
      const day = new Date(`${value}T00:00`).getDay();
      setDateError(value && !hours.openDays.includes(day) ? `The showroom is open ${hours.label}. Please pick another day.` : "");
    }
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // The server has no booking route yet, so visit requests go through WhatsApp
  const handleSubmit = (e) => {
    e.preventDefault();
    if (dateError) return;

    const prettyDate = new Date(`${form.date}T00:00`).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const lines = [
      "Hello, I would like to book a showroom visit.",
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Date: ${prettyDate}`,
      `Time: ${form.slot}`,
      `Visiting for: ${form.purpose}`,
    ];
    if (form.withFavourites && favouriteNames.length > 0) {
      lines.push(`Products I'd like to see: ${favouriteNames.join(", ")}`);
    }
    if (form.notes.trim()) lines.push(`Notes: ${form.notes.trim()}`);

    window.open(
      `https://wa.me/${WhatsappNumber.replace("+", "")}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank"
    );
    setSent(true);
  };

  return (
    <div className="vs-page">
      {/* ─── Hero ─── */}
      <header className="vs-hero">
        <p className="vs-eyebrow">Visit our showroom</p>
        <h1 className="vs-title">
          See it. Touch it. <em>Choose it.</em>
        </h1>
        <p className="vs-lead">
          Explore our full laminate collection in person at our Bangalore showroom, and get help picking the right finish
          for your space.
        </p>
        <span className={`vs-status ${status.open ? "is-open" : "is-closed"}`} role="status">
          <span className="vs-status-dot" aria-hidden="true" />
          {status.text}
        </span>
        <div className="vs-hero-actions">
          <a className="vs-btn vs-btn-primary" href={showroom.mapLink} target="_blank" rel="noreferrer">
            <FaMapMarkerAlt /> Get directions
          </a>
          <a className="vs-btn vs-btn-outline" href="#vs-book">
            Book a visit
          </a>
        </div>
      </header>

      {/* ─── Details + map ─── */}
      <section className="vs-info">
        <div className="vs-info-card">
          <div className="vs-info-item">
            <FaMapMarkerAlt className="vs-icon" />
            <div>
              <h2>Address</h2>
              <p>
                {showroom.addressLines.map((line) => (
                  <React.Fragment key={line}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
              {showroom.landmarks.length > 0 && (
                <ul className="vs-landmarks">
                  {showroom.landmarks.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
              <a href={showroom.mapLink} target="_blank" rel="noreferrer">
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="vs-info-item">
            <FaRegClock className="vs-icon" />
            <div>
              <h2>Opening hours</h2>
              <p>{hours.label}</p>
              <p className="vs-muted">Closed on Saturday and Sunday</p>
            </div>
          </div>

          <div className="vs-info-item">
            <FaPhoneAlt className="vs-icon" />
            <div>
              <h2>Call us</h2>
              <p>
                {phones.map((p) => (
                  <React.Fragment key={p}>
                    <a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>

          <div className="vs-info-item">
            <FaEnvelope className="vs-icon" />
            <div>
              <h2>Email</h2>
              <p>
                <a href={`mailto:${email}`}>{email}</a>
              </p>
            </div>
          </div>
        </div>

        <div className="vs-map">
          <iframe
            title="Sequence Surfaces showroom location"
            src={showroom.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>

      {/* ─── Why visit ─── */}
      <section className="vs-highlights">
        <h2 className="vs-section-title">Why visit us</h2>
        <div className="vs-highlight-grid">
          {highlights.map((h, i) => (
            <div className="vs-highlight" key={h.title}>
              <span className="vs-highlight-num">0{i + 1}</span>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Booking form ─── */}
      <section className="vs-book" id="vs-book">
        <h2 className="vs-section-title">Book your visit</h2>
        <p className="vs-section-sub">Tell us when you're coming and we'll have your shortlisted designs ready.</p>

        <form className="vs-form" onSubmit={handleSubmit}>
          <div className="vs-row">
            <div className="vs-field">
              <label htmlFor="vs-name">Full Name*</label>
              <input id="vs-name" name="name" type="text" placeholder="Your name" autoComplete="name"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="vs-field">
              <label htmlFor="vs-phone">Phone Number*</label>
              <input id="vs-phone" name="phone" type="tel" placeholder="Your phone number" autoComplete="tel"
                pattern="[+]?[0-9 \-]{10,15}" title="Enter a phone number with at least 10 digits"
                value={form.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="vs-row">
            <div className="vs-field">
              <label htmlFor="vs-date">Preferred Date*</label>
              <input id="vs-date" name="date" type="date" min={today}
                value={form.date} onChange={handleChange} required aria-describedby="vs-date-error" />
              {dateError && <span className="vs-error" id="vs-date-error">{dateError}</span>}
            </div>
            <div className="vs-field">
              <label htmlFor="vs-slot">Preferred Time*</label>
              <select id="vs-slot" name="slot" value={form.slot} onChange={handleChange} required>
                <option value="" disabled>Select a time</option>
                {timeSlots.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <fieldset className="vs-field vs-purpose">
            <legend>I'm visiting for*</legend>
            <div className="vs-chips">
              {visitPurposes.map((p) => (
                <label key={p} className={`vs-chip ${form.purpose === p ? "active" : ""}`}>
                  <input type="radio" name="purpose" value={p} checked={form.purpose === p} onChange={handleChange} />
                  {p}
                </label>
              ))}
            </div>
          </fieldset>

          {favouriteNames.length > 0 ? (
            <label className="vs-check">
              <input type="checkbox" name="withFavourites" checked={form.withFavourites} onChange={handleChange} />
              <span>
                Ask the team to keep my {favouriteNames.length} favourite{favouriteNames.length > 1 ? "s" : ""} ready
                <small>{favouriteNames.slice(0, 4).join(", ")}{favouriteNames.length > 4 ? " and more" : ""}</small>
              </span>
            </label>
          ) : (
            <p className="vs-tip">
              Tip: tap the ♥ on products in <Link to="/products">Our Collections</Link> and we'll keep them ready for your visit.
            </p>
          )}

          <div className="vs-field">
            <label htmlFor="vs-notes">Anything else? (optional)</label>
            <textarea id="vs-notes" name="notes" rows="3" placeholder="E.g. kitchen shutters in a warm wood finish"
              value={form.notes} onChange={handleChange} />
          </div>

          <button type="submit" className="vs-submit">Request visit on WhatsApp</button>
          <p className="vs-note" role="status">
            {sent
              ? "WhatsApp is open with your visit details. Press send there and our team will confirm."
              : "We'll open WhatsApp with your visit details filled in, ready to send."}
          </p>
        </form>
      </section>

      {/* ─── Warehouse ─── */}
      <section className="vs-warehouse">
        <FaWarehouse className="vs-icon" />
        <div>
          <h2>Our warehouse</h2>
          <p>{warehouse.addressLines.slice(1).join(", ")}</p>
          <a href={warehouse.mapLink} target="_blank" rel="noreferrer">View warehouse on map</a>
        </div>
      </section>
    </div>
  );
}
