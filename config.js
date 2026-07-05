/**
 * ============================================================
 *  LOGIC PILOT — SITE CONFIGURATION
 * ============================================================
 *  This is the ONLY file you should ever need to edit to update
 *  links, contact details, and downloadable assets across the
 *  entire website. Every button, icon, nav item, and footer
 *  link on every page reads from this object at load time.
 *
 *  HOW TO USE
 *  1. Fill in the values below.
 *  2. Leave anything you don't have yet as an empty string "".
 *     The site will automatically HIDE or DISABLE any button
 *     that points to an empty value instead of showing a
 *     broken/dead link — so it's always safe to leave things
 *     blank until they're ready.
 *  3. Save this file and reload the site. No other file needs
 *     to change.
 * ============================================================
 */

window.LOGIC_PILOT_CONFIG = {

  // ---------------------------------------------------------
  // COMPANY
  // ---------------------------------------------------------
  company: {
    name: "Logic Pilot",
    tagline: "Data & analytics for growing businesses",
    websiteUrl: "", // e.g. "https://logicpilot.io" — leave blank until domain is live
    foundedYear: 2026,
    address: "Noida, Uttar Pradesh, India, 201301",
    googleMapsUrl: "", // paste a Google Maps share link when available
  },

  // ---------------------------------------------------------
  // SOCIAL & CODE
  // ---------------------------------------------------------
  social: {
    githubRepo: "", // e.g. "https://github.com/logicpilot-tech/norah-co-analytics-dashboard"
    githubProfile: "https://github.com/logicpilot-tech",
    linkedinCompany: "https://www.linkedin.com/company/logic-pilot",
    linkedinPersonal: "", // optional
    instagram: "https://www.instagram.com/logic_pilot?igsh=aWdvZzIwMDV5dnBs",
  },

  // ---------------------------------------------------------
  // DIRECT CONTACT
  // ---------------------------------------------------------
  contact: {
    email: "logicpilot.contact@gmail.com",
    phone: "+91 8630398305",       // used for the tel: link
    whatsapp: "+91 8630398305",    // same as phone, confirmed
  },

  // ---------------------------------------------------------
  // FORMS
  // ---------------------------------------------------------
  forms: {
    // Paste your Web3Forms Access Key here (get one free at
    // https://web3forms.com — no signup required, it emails you
    // a key). Until this is filled in, the contact form will show
    // a friendly error instead of silently failing.
    web3formsAccessKey: "3acf7ab8-507a-40c7-a957-a26bf6962353",
  },

  // ---------------------------------------------------------
  // BOOKING
  // ---------------------------------------------------------
  booking: {
    calendlyUrl: "", // e.g. "https://calendly.com/logicpilot/discovery-call"
    // If calendlyUrl is empty, every "Book a discovery call" button
    // automatically falls back to a pre-filled mailto: link instead
    // of pointing nowhere.
  },

  // ---------------------------------------------------------
  // DOWNLOADABLE ASSETS (future)
  // ---------------------------------------------------------
  assets: {
    portfolioPdf: "",        // e.g. "/assets/logic-pilot-portfolio.pdf"
    companyProfilePdf: "",   // e.g. "/assets/logic-pilot-company-profile.pdf"
    capabilityDeck: "",      // e.g. "/assets/logic-pilot-capability-deck.pdf"
    resume: "",              // e.g. "/assets/founder-resume.pdf"
  },

  // ---------------------------------------------------------
  // PROJECTS / CASE STUDIES
  // Add one entry per case study. The template on the homepage
  // and case-study page reads this list automatically.
  // ---------------------------------------------------------
  projects: [
    {
      id: "norah-co",
      name: "Norah & Co — Full-Funnel Analytics Dashboard",
      summary: "Excel + Power BI dashboard and Python pipeline for a modeled D2C skincare brand, built to catch rising acquisition costs and retention gaps before they hurt revenue.",
      caseStudyUrl: "case-study-norah-co.html",
      sourceCodeUrl: "", // paste GitHub repo URL for this project
      tags: ["Analytics Dashboard", "Excel", "Power BI", "Python"],
    },
  ],

  // ---------------------------------------------------------
  // LEGAL / FOOTER
  // ---------------------------------------------------------
  legal: {
    copyrightName: "Logic Pilot",
  },
};
