// Showroom and warehouse details used by the Visit Store page.
// Edit this file to change the address, hours or phone numbers shown there.

export const storeDetails = {
  showroom: {
    name: "Sequence Surfaces Showroom",
    addressLines: ["Sequence Surfaces LLP", "No 269/1 Mysore Road, Kasturiba Nagar", "Bangalore - 560026"],
    mapLink: "https://maps.app.goo.gl/uoXK3vrvdthMMRck7",
    // Coordinates of the "Sequence Surfaces | Laminate Experience Center" Google Maps listing
    mapEmbed: "https://maps.google.com/maps?q=12.9565778,77.5495068&z=16&output=embed",
    // Add nearby landmarks or parking notes here, e.g. "Opposite XYZ Bank". Left empty until confirmed.
    landmarks: [],
  },
  warehouse: {
    name: "Sequence Surfaces Warehouse",
    addressLines: ["Sequence Surfaces LLP", "46/1, 1st Main Road, Kamakshipalya", "Bangalore - 560079"],
    mapLink: "https://maps.app.goo.gl/noSpS8DtiZXgM16KA",
    // Coordinates of the "Sequence Surfaces LLP" warehouse Google Maps listing
    mapEmbed: "https://maps.google.com/maps?q=12.9884674,77.5301561&z=16&output=embed",
    // Add nearby landmarks or loading/parking notes here. Left empty until confirmed.
    landmarks: [],
    // Warehouse timings, e.g. "Mon - Sat, 9 AM to 6 PM". Shown on the page only when filled in.
    hoursLabel: "",
  },
  phones: ["+91 9164001231", "+91 6363865515"],
  email: "experience@sequencesurface.com",
  // Times are in India Standard Time. Days: 0 = Sunday ... 6 = Saturday.
  hours: {
    label: "Mon - Fri, 11 AM to 7 PM",
    openDays: [1, 2, 3, 4, 5],
    openHour: 11,
    closeHour: 19,
  },
  timeSlots: ["11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"],
  visitPurposes: ["My home", "Office / commercial space", "Architect / interior designer", "Dealer / trade enquiry"],
  // Photos for the "Why visit us" cards. Swap in real showroom photos when you have them.
  highlights: [
    {
      title: "See every finish",
      text: "Touch and compare matte, gloss, textured and woodgrain laminates in full-size sheets.",
      // Dark Walnut laminate from the Sequence product catalogue
      image: "https://imagesm.plexussquare.in/SEQUENCE/Images/12-03-2025/1741786221943.jpg",
      imageAlt: "Close-up of a walnut woodgrain laminate sheet",
    },
    {
      title: "Expert guidance",
      text: "Our team helps you match shades and finishes to your space, furniture and lighting.",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=75&auto=format&fit=crop",
      imageAlt: "Designer sketching an interior plan at a desk",
    },
    {
      title: "Take samples home",
      text: "Pick swatches of your shortlisted designs to try against your walls and fittings.",
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=75&auto=format&fit=crop",
      imageAlt: "Kitchen with grey cabinets, white counter and brass fittings",
    },
  ],
};
