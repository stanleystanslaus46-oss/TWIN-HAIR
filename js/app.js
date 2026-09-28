/**
 * TWINHAIR & BEAUTY SALON — DAR ES SALAAM
 * Master Application & Interaction Script
 * Technology: Vanilla JavaScript (ES6+), GSAP & ScrollTrigger
 */

"use strict";

/* ==========================================================================
   01. CENTRALIZED BUSINESS CONFIGURATION
   ========================================================================== */
const CONFIG = {
  salonName: "TwinHair & Beauty Salon",
  tagline: "Your Hair. Your Style. Your Confidence.",
  handle: "@twinhair.beautysalon",
  tiktokUrl: "https://www.tiktok.com/@twinhair.beautysalon",
  whatsappHotline: "255650125378", // Country code +255 for Tanzania
  phoneNumbers: ["0650125378", "0768273770"],
  locations: [
    {
      id: "sinza",
      name: "Sinza Madukani",
      area: "Sinza, Dar es Salaam",
      phone: "0650125378",
      phoneHref: "tel:+255650125378",
      address: "Sinza Madukani, Kinondoni, Dar es Salaam",
      hours: "Mon – Sat: 08:30 – 20:00 · Sun: 10:00 – 18:00",
      mapsQuery: "Sinza Madukani Dar es Salaam"
    },
    {
      id: "lufungila",
      name: "Lufungila",
      area: "Lufungila, Dar es Salaam",
      phone: "0768273770",
      phoneHref: "tel:+255768273770",
      address: "Lufungila, Near Mwenge / Sinza Junction, Dar es Salaam",
      hours: "Mon – Sat: 08:30 – 20:00 · Sun: 10:00 – 18:00",
      mapsQuery: "Lufungila Dar es Salaam"
    }
  ]
};

/* ==========================================================================
   02. DATA-DRIVEN SERVICES
   ========================================================================== */
const SERVICES = [
  {
    id: "knotless-goddess-braids",
    name: "Knotless Goddess Braids",
    category: "braids",
    categoryLabel: "Braids",
    description: "Tension-free root parting with organic curled tendrils. Ultra-lightweight and protective for weeks.",
    duration: "3.5 – 4.5 hrs",
    priceStarting: "From TZS 60,000",
    image: "assets/images/service-braids.jpg",
    alt: "Knotless Goddess Braids by TwinHair Salon"
  },
  {
    id: "butterfly-passion-twists",
    name: "Butterfly & Passion Twists",
    category: "twists",
    categoryLabel: "Twists & Locs",
    description: "Bohemian texture crafted with premium water-wave fiber. Soft volume, romantic movement, and easy daily wear.",
    duration: "3.0 – 4.0 hrs",
    priceStarting: "From TZS 55,000",
    image: "assets/images/service-locs.jpg",
    alt: "Butterfly and Passion Twists styling"
  },
  {
    id: "precision-stitch-cornrows",
    name: "Precision Stitch Cornrows",
    category: "cornrows",
    categoryLabel: "Cornrows",
    description: "Razor-sharp geometric partings and feed-in stitch work with gentle tension control for scalp preservation.",
    duration: "2.0 – 3.0 hrs",
    priceStarting: "From TZS 45,000",
    image: "assets/images/gallery-cornrows.jpg",
    alt: "Precision Stitch Cornrows in Dar es Salaam"
  },
  {
    id: "loc-retwist-scalp-detox",
    name: "Loc Retwist & Scalp Detox",
    category: "twists",
    categoryLabel: "Twists & Locs",
    description: "Steam clarifying wash, botanical apple cider vinegar cleanse, palm-roll retwist, and nourishing hair oil sealant.",
    duration: "2.0 – 2.5 hrs",
    priceStarting: "From TZS 50,000",
    image: "assets/images/service-locs.jpg",
    alt: "Loc Retwist and Scalp Detox"
  },
  {
    id: "silk-press-treatment",
    name: "Hydration Silk Press & Trim",
    category: "natural",
    categoryLabel: "Natural Hair",
    description: "Intense moisture steam infusion, botanical heat shield, silky glass press, and healthy split-end dusting.",
    duration: "2.0 – 2.5 hrs",
    priceStarting: "From TZS 50,000",
    image: "assets/images/transformation-after.jpg",
    alt: "Silk Press and hair treatment"
  },
  {
    id: "defined-curls-hydration",
    name: "Defined Curls Moisture Bath",
    category: "natural",
    categoryLabel: "Natural Hair",
    description: "Restorative deep hydration for Type 3 & 4 curls. Shingling curl definition with natural moisture barrier sealing.",
    duration: "1.5 – 2.0 hrs",
    priceStarting: "From TZS 40,000",
    image: "assets/images/gallery-curls.jpg",
    alt: "Natural hair curl definition and deep moisture"
  }
];

/* ==========================================================================
   03. INITIALIZATION CONTROLLER
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initThemeManager();
  renderServices(SERVICES);
  initHeaderScroll();
  initMobileMenu();
  initServiceFilters();
  initBeforeAfterSlider();
  initBookingForm();
  initMobileStickyBar();
  initCustomCursor();
  initDateConstraints();

  // Initialize GSAP Animations if available
  if (typeof gsap !== "undefined") {
    initGsapAnimations();
  }
});

/* ==========================================================================
   04. RENDER SERVICES
   ========================================================================== */
function renderServices(items) {
  const container = document.getElementById("services-grid-container");
  const selectDropdown = document.getElementById("booking-service");
  if (!container) return;

  // Render cards
  container.innerHTML = items.map(item => `
    <article class="service-card" data-category="${item.category}">
      <div class="service-card-media" data-cursor="VIEW">
        <img src="${item.image}" alt="${item.alt}" loading="lazy" width="400" height="300" />
        <span class="service-category-tag">${item.categoryLabel}</span>
      </div>
      <div class="service-card-body">
        <div class="service-header">
          <h3 class="service-name">${item.name}</h3>
          <p class="service-desc">${item.description}</p>
        </div>
        <div class="service-meta-row">
          <div class="service-price-block">
            <span class="price-sub">${item.duration}</span>
            <span class="price-val">${item.priceStarting}</span>
          </div>
          <button type="button" class="book-style-btn" data-service-id="${item.id}" data-service-name="${item.name}">
            <span>Book Look</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </button>
        </div>
      </div>
    </article>
  `).join("");

  // Attach quick-book click handlers
  container.querySelectorAll(".book-style-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const serviceName = btn.getAttribute("data-service-name");
      selectServiceAndScroll(serviceName);
    });
  });

  // Populate booking form select if empty
  if (selectDropdown && selectDropdown.options.length <= 1) {
    selectDropdown.innerHTML = `<option value="">Select a hair or beauty service...</option>` +
      SERVICES.map(s => `<option value="${s.name}">${s.name} (${s.priceStarting})</option>`).join("") +
      `<option value="Custom Hair Consultation">Custom Hair Consultation</option>` +
      `<option value="Wig Installation & Styling">Wig Installation & Styling</option>` +
      `<option value="Pedicure & Nail Art">Pedicure & Nail Art</option>`;
  }
}

function selectServiceAndScroll(serviceName) {
  const select = document.getElementById("booking-service");
  const bookingSection = document.getElementById("booking");
  if (select && serviceName) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value.includes(serviceName) || select.options[i].text.includes(serviceName)) {
        select.selectedIndex = i;
        break;
      }
    }
  }
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: "smooth" });
    const nameInput = document.getElementById("booking-name");
    if (nameInput) setTimeout(() => nameInput.focus(), 600);
  }
}

/* ==========================================================================
   05. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   06. MOBILE FULL-SCREEN NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const closeBtn = document.getElementById("mobile-menu-close");
  const menu = document.getElementById("mobile-menu");
  const menuLinks = document.querySelectorAll(".mobile-nav-link, .mobile-menu-cta");

  if (!toggleBtn || !menu) return;

  const openMenu = () => {
    menu.classList.add("active");
    menu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menu.classList.remove("active");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  toggleBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  menuLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Close on ESC key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("active")) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   07. SERVICE CATEGORY FILTERS
   ========================================================================== */
function initServiceFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-filter");
      const cards = document.querySelectorAll(".service-card");

      cards.forEach(card => {
        const cardCat = card.getAttribute("data-category");
        if (category === "all" || cardCat === category) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   08. INTERACTIVE BEFORE / AFTER SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const box = document.getElementById("comparison-box");
  const handle = document.getElementById("comparison-handle");

  if (!box || !handle) return;

  let isDragging = false;
  let currentPercentage = 50;

  const updateSplit = (clientX) => {
    const rect = box.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    currentPercentage = Math.round((offsetX / rect.width) * 100);
    box.style.setProperty("--split-pos", `${currentPercentage}%`);
    handle.setAttribute("aria-valuenow", currentPercentage.toString());
  };

  // Initial set
  box.style.setProperty("--split-pos", "50%");

  // Mouse & Touch events
  const onPointerDown = (e) => {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateSplit(clientX);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateSplit(clientX);
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  box.addEventListener("mousedown", onPointerDown);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);

  box.addEventListener("touchstart", onPointerDown, { passive: true });
  window.addEventListener("touchmove", onPointerMove, { passive: true });
  window.addEventListener("touchend", onPointerUp);

  // Keyboard accessibility
  handle.setAttribute("tabindex", "0");
  handle.setAttribute("role", "slider");
  handle.setAttribute("aria-label", "Comparison position between before and after");
  handle.setAttribute("aria-valuenow", "50");

  handle.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      currentPercentage = Math.max(0, currentPercentage - 5);
      box.style.setProperty("--split-pos", `${currentPercentage}%`);
      handle.setAttribute("aria-valuenow", currentPercentage.toString());
    } else if (e.key === "ArrowRight") {
      currentPercentage = Math.min(100, currentPercentage + 5);
      box.style.setProperty("--split-pos", `${currentPercentage}%`);
      handle.setAttribute("aria-valuenow", currentPercentage.toString());
    }
  });
}

/* ==========================================================================
   09. DATE INPUT CONSTRAINTS
   ========================================================================== */
function initDateConstraints() {
  const dateInput = document.getElementById("booking-date");
  if (!dateInput) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${year}-${month}-${day}`;
}

/* ==========================================================================
   10. BOOKING FORM & WHATSAPP GENERATOR
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById("appointment-form");
  const feedback = document.getElementById("booking-feedback");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Reset error states
    form.querySelectorAll(".form-group").forEach(g => g.classList.remove("has-error"));

    const nameInput = document.getElementById("booking-name");
    const phoneInput = document.getElementById("booking-phone");
    const locationSelect = document.getElementById("booking-location");
    const serviceSelect = document.getElementById("booking-service");
    const dateInput = document.getElementById("booking-date");
    const timeSelect = document.getElementById("booking-time");
    const noteInput = document.getElementById("booking-notes");

    let hasError = false;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.closest(".form-group").classList.add("has-error");
      hasError = true;
    }

    const phoneClean = phoneInput.value.replace(/[^0-9+]/g, "");
    if (!phoneClean || phoneClean.length < 8) {
      phoneInput.closest(".form-group").classList.add("has-error");
      hasError = true;
    }

    if (!locationSelect.value) {
      locationSelect.closest(".form-group").classList.add("has-error");
      hasError = true;
    }

    if (!serviceSelect.value) {
      serviceSelect.closest(".form-group").classList.add("has-error");
      hasError = true;
    }

    if (!dateInput.value) {
      dateInput.closest(".form-group").classList.add("has-error");
      hasError = true;
    }

    if (!timeSelect.value) {
      timeSelect.closest(".form-group").classList.add("has-error");
      hasError = true;
    }

    if (hasError) {
      const firstError = form.querySelector(".form-group.has-error input, .form-group.has-error select");
      if (firstError) firstError.focus();
      return;
    }

    // Format human-readable WhatsApp message
    const message = [
      "Hello TwinHair & Beauty Salon,",
      "",
      "I would like to book an appointment.",
      "",
      `Name: ${nameInput.value.trim()}`,
      `Phone: ${phoneInput.value.trim()}`,
      `Location: ${locationSelect.value}`,
      `Service: ${serviceSelect.value}`,
      `Preferred Date: ${dateInput.value}`,
      `Preferred Time: ${timeSelect.value}`,
      noteInput.value.trim() ? `Additional Note: ${noteInput.value.trim()}` : null,
      "",
      "Thank you."
    ].filter(Boolean).join("\n");

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappHotline}?text=${encodedMessage}`;

    // Provide inline feedback
    const submitBtn = form.querySelector(".booking-submit-btn");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Opening WhatsApp...</span>`;
    submitBtn.disabled = true;

    if (feedback) {
      feedback.innerHTML = `
        <strong>Reservation details prepared!</strong> Opening WhatsApp now to connect directly with the TwinHair booking desk. You can also call us directly at <a href="tel:+255650125378" style="text-decoration:underline; font-weight:600;">0650125378</a> or <a href="tel:+255768273770" style="text-decoration:underline; font-weight:600;">0768273770</a>.
      `;
      feedback.classList.add("active");
    }

    // Open WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 450);
  });
}

/* ==========================================================================
   11. MOBILE STICKY ACTION BAR GOVERNANCE
   ========================================================================== */
function initMobileStickyBar() {
  const stickyBar = document.getElementById("mobile-sticky-action");
  const bookingSection = document.getElementById("booking");

  if (!stickyBar || !bookingSection) return;

  // Hide sticky bar when the user is inside the booking section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stickyBar.classList.add("hidden");
      } else {
        stickyBar.classList.remove("hidden");
      }
    });
  }, { threshold: 0.15 });

  observer.observe(bookingSection);
}

/* ==========================================================================
   12. CUSTOM CURSOR (DESKTOP ONLY)
   ========================================================================== */
function initCustomCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cursor = document.getElementById("custom-cursor");
  const label = document.getElementById("custom-cursor-label");
  if (!cursor || !label) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  const renderCursor = () => {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    label.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Hover detection
  document.querySelectorAll("[data-cursor]").forEach(el => {
    el.addEventListener("mouseenter", () => {
      const text = el.getAttribute("data-cursor");
      cursor.style.width = "64px";
      cursor.style.height = "64px";
      cursor.style.opacity = "0.9";
      cursor.style.backgroundColor = "var(--color-accent)";
      label.textContent = text;
      label.style.opacity = "1";
    });

    el.addEventListener("mouseleave", () => {
      cursor.style.width = "20px";
      cursor.style.height = "20px";
      cursor.style.opacity = "0.35";
      label.style.opacity = "0";
      label.textContent = "";
    });
  });
}

/* ==========================================================================
   13. GSAP ENTRANCE & SCROLL ANIMATIONS
   ========================================================================== */
function initGsapAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero entrance sequence
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  heroTl
    .from(".site-header", {
      y: -25,
      opacity: 0,
      duration: 0.8
    })
    .from(".hero-tag", {
      opacity: 0,
      y: 15,
      duration: 0.6
    }, "-=0.4")
    .from(".hero-heading", {
      opacity: 0,
      y: 35,
      duration: 1.0
    }, "-=0.3")
    .from(".hero-description", {
      opacity: 0,
      y: 20,
      duration: 0.8
    }, "-=0.5")
    .from(".hero-cta-group", {
      opacity: 0,
      y: 20,
      duration: 0.7
    }, "-=0.5")
    .from(".hero-image-frame", {
      scale: 0.96,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.9")
    .from(".hero-floating-badge", {
      opacity: 0,
      x: -20,
      duration: 0.8
    }, "-=0.5");

  // Scroll reveals for section headings
  if (typeof ScrollTrigger !== "undefined") {
    document.querySelectorAll(".reveal-on-scroll").forEach(elem => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: "top 85%",
          once: true
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }
}

/* ==========================================================================
   14. THEME MANAGER (DARK / LIGHT EDITORIAL VARIANT)
   ========================================================================== */
function initThemeManager() {
  const desktopBtn = document.getElementById("theme-toggle-desktop");
  const mobileBtn = document.getElementById("theme-toggle-mobile");
  const buttons = [desktopBtn, mobileBtn].filter(Boolean);

  if (!buttons.length) return;

  const getSystemPreference = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const getActiveTheme = () => {
    const explicit = document.documentElement.getAttribute("data-theme");
    if (explicit === "dark" || explicit === "light") return explicit;
    const stored = localStorage.getItem("twinhair-theme");
    if (stored === "dark" || stored === "light") return stored;
    return getSystemPreference();
  };

  const updateToggleUI = (theme) => {
    const isDark = theme === "dark";
    buttons.forEach(btn => {
      const label = btn.querySelector(".theme-toggle-label");
      if (label) {
        label.textContent = isDark ? "Day" : "Night";
      }
      btn.setAttribute("aria-label", isDark ? "Switch to daylight editorial theme" : "Switch to midnight editorial theme");
      btn.setAttribute("title", isDark ? "Switch to day mode" : "Switch to night mode");
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");
    });
  };

  const applyTheme = (theme, persist = false) => {
    document.documentElement.setAttribute("data-theme", theme);
    if (persist) {
      try {
        localStorage.setItem("twinhair-theme", theme);
      } catch (e) {}
    }
    updateToggleUI(theme);
  };

  // Initial UI sync
  const currentTheme = getActiveTheme();
  applyTheme(currentTheme, false);

  // Toggle click handler
  const handleToggle = () => {
    const active = getActiveTheme();
    const nextTheme = active === "dark" ? "light" : "dark";
    applyTheme(nextTheme, true);
  };

  buttons.forEach(btn => {
    btn.addEventListener("click", handleToggle);
  });

  // System color scheme change listener
  try {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      // Only adapt automatically if user hasn't explicitly saved a choice
      if (!localStorage.getItem("twinhair-theme")) {
        applyTheme(e.matches ? "dark" : "light", false);
      }
    });
  } catch (e) {}
}

