/**
 * Logic Pilot — site behavior
 * Reads window.LOGIC_PILOT_CONFIG and wires it into every
 * data-cfg-* element. No link, phone number, or email is
 * ever hardcoded in the HTML — it all resolves from here.
 */
(function () {
  const CFG = window.LOGIC_PILOT_CONFIG || {};

  function getPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }

  function digitsOnly(str) {
    return (str || "").replace(/[^\d]/g, "");
  }

  function disableButton(el, label) {
    el.classList.add("is-disabled");
    el.setAttribute("aria-disabled", "true");
    el.removeAttribute("href");
    el.title = label || "Coming soon";
    const badge = el.querySelector("[data-cfg-badge]");
    if (badge) badge.textContent = "Coming soon";
  }

  function hideElement(el) {
    el.classList.add("cfg-hidden");
    el.setAttribute("aria-hidden", "true");
  }

  function applyHrefBindings() {
    document.querySelectorAll("[data-cfg-href]").forEach((el) => {
      const path = el.getAttribute("data-cfg-href");
      const optional = el.getAttribute("data-cfg-optional"); // "hide" | "disable" (default)
      let value = getPath(CFG, path);

      // Special-cased link types that need transformation
      const kind = el.getAttribute("data-cfg-kind");
      if (kind === "mailto" && value) value = `mailto:${value}`;
      if (kind === "tel" && value) value = `tel:${digitsOnly(value) ? "+" + digitsOnly(value) : ""}`;
      if (kind === "whatsapp" && value) value = `https://wa.me/${digitsOnly(value)}`;
      if (kind === "booking") {
        const calendly = getPath(CFG, "booking.calendlyUrl");
        if (calendly) {
          value = calendly;
        } else {
          const email = getPath(CFG, "contact.email");
          value = email
            ? `mailto:${email}?subject=${encodeURIComponent("Discovery call request — Logic Pilot")}&body=${encodeURIComponent("Hi Logic Pilot,\n\nI'd like to book a discovery call. Here's a bit about what I need help with:\n\n")}`
            : "";
        }
      }

      if (!value) {
        if (optional === "hide") {
          hideElement(el);
        } else {
          disableButton(el);
        }
        return;
      }
      el.setAttribute("href", value);
    });
  }

  function applyTextBindings() {
    document.querySelectorAll("[data-cfg-text]").forEach((el) => {
      const path = el.getAttribute("data-cfg-text");
      const value = getPath(CFG, path);
      if (value) el.textContent = value;
      else if (el.getAttribute("data-cfg-optional") === "hide") hideElement(el);
    });
  }

  function applyProjectCards() {
    const projects = CFG.projects || [];
    document.querySelectorAll("[data-cfg-project-card]").forEach((template) => {
      const container = template.parentElement;
      template.remove();
      projects.forEach((p) => {
        const node = template.cloneNode(true);
        node.classList.remove("cfg-hidden");
        node.querySelector("[data-p-name]").textContent = p.name;
        node.querySelector("[data-p-summary]").textContent = p.summary;
        const tagsEl = node.querySelector("[data-p-tags]");
        tagsEl.innerHTML = "";
        p.tags.forEach((t) => {
          const span = document.createElement("span");
          span.className = "tag";
          span.textContent = t;
          tagsEl.appendChild(span);
        });
        const caseLink = node.querySelector("[data-p-case]");
        if (p.caseStudyUrl) caseLink.setAttribute("href", p.caseStudyUrl);
        else disableButton(caseLink);
        const sourceLink = node.querySelector("[data-p-source]");
        if (p.sourceCodeUrl) sourceLink.setAttribute("href", p.sourceCodeUrl);
        else disableButton(sourceLink);
        container.appendChild(node);
      });
    });
  }

  function setYear() {
    document.querySelectorAll("[data-cfg-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  function mobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".nav-links");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  function revealOnScroll() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || items.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));
  }

  function isValidEmail(value) {
    // Simple, permissive email shape check — good enough for front-end
    // validation; Web3Forms + the receiving mail server do the real check.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function initContactForm() {
    // Wires the contact form to Web3Forms (https://web3forms.com) so
    // submissions land in the inbox configured on the Web3Forms dashboard
    // for the access key below, without any custom backend/server.
    const form = document.getElementById("contact-form");
    if (!form) return;

    const statusEl = document.getElementById("form-status");
    const submitBtn = document.getElementById("contact-submit");
    const submitLabel = submitBtn ? submitBtn.textContent : "Send message";
    const accessKey = getPath(CFG, "forms.web3formsAccessKey");

    let isSubmitting = false; // guards against double submission (e.g. double-click)

    function setStatus(message, type) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = "form-status" + (type ? " form-status-" + type : "");
    }

    function setLoading(loading) {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      submitBtn.classList.toggle("is-disabled", loading);
      submitBtn.textContent = loading ? "Sending..." : submitLabel;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (isSubmitting) return; // already in flight — ignore extra clicks/enters

      const nameEl = form.elements.name;
      const emailEl = form.elements.email;
      const messageEl = form.elements.message;
      const honeypot = form.elements.botcheck;

      const name = (nameEl.value || "").trim();
      const email = (emailEl.value || "").trim();
      const message = (messageEl.value || "").trim();

      // Required-field validation
      if (!name || !email || !message) {
        setStatus("Please fill in your name, email, and message.", "error");
        return;
      }

      // Email format validation
      if (!isValidEmail(email)) {
        setStatus("Please enter a valid email address.", "error");
        emailEl.focus();
        return;
      }

      // Bots that auto-fill every field will fill the hidden honeypot too —
      // quietly pretend to succeed without sending anything.
      if (honeypot && honeypot.value) {
        setStatus("Thanks — your message has been sent. I'll reply within one business day.", "success");
        form.reset();
        return;
      }

      if (!accessKey) {
        // Site owner hasn't pasted a Web3Forms access key into config.js yet.
        setStatus("This form isn't fully set up yet — please email us directly instead.", "error");
        return;
      }

      isSubmitting = true;
      setLoading(true);
      setStatus("", "");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          name: name,
          email: email,
          message: message,
          subject: `New enquiry from ${name} — Logic Pilot website`,
          from_name: "Logic Pilot Website",
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result && result.success) {
            setStatus("Thanks — your message has been sent. I'll reply within one business day.", "success");
            form.reset();
          } else {
            setStatus("Something went wrong sending your message. Please try again or email us directly.", "error");
          }
        })
        .catch(() => {
          setStatus("Network error — please check your connection and try again.", "error");
        })
        .finally(() => {
          isSubmitting = false;
          setLoading(false);
        });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyProjectCards();
    applyHrefBindings();
    applyTextBindings();
    setYear();
    mobileNav();
    revealOnScroll();
    initContactForm();
  });
})();
