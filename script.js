// ── INTERSECTION OBSERVER ANIMATION LAUNCHER ──
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        // Trigger numerical increments if element contains counter
        const countEl = entry.target.querySelector(".counter, [data-target]");
        if (countEl && !countEl.classList.contains("counted")) {
          animateNumbers(countEl);
        }
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
  initSwiper();
});

// ── NAVBAR ON-SCROLL OVERLAY BOX-SHADOWS ──
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 20) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// ── MOBILE MENU TOGGLE DRAWER ──
function toggleDrawer() {
  const drawer = document.getElementById("mobileDrawer");
  drawer.classList.toggle("open");
}
document.getElementById("menuToggle")?.addEventListener("click", toggleDrawer);

// ── DIGITAL INCREMENT STATS COUNTERS ──
function animateNumbers(el) {
  const target = parseInt(el.getAttribute("data-target") || "0", 10);
  const suffix = el.getAttribute("data-suffix") || "";
  let current = 0;
  const duration = 1500; // ms
  const stepTime = Math.max(Math.floor(duration / (target / 100)), 15);
  
  el.classList.add("counted");
  const timer = setInterval(() => {
    current += Math.ceil(target / 40);
    if (current >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      el.textContent = current.toLocaleString() + suffix;
    }
  }, stepTime);
}

// ── SWIPER SLIDER ENGINE CALLS ──
function initSwiper() {
  if (typeof Swiper !== 'undefined') {
    new Swiper('.test-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '#testNext', prevEl: '#testPrev' },
      breakpoints: {
        768: { slidesPerView: 2 }
      }
    });
  }
}

// ── INTERACTIVE MULTI-STEP VALIDATION LOGIC ──
let currentStep = 1;

function updateStepUI(step) {
  document.querySelectorAll(".reg-panel").forEach(p => p.classList.remove("active"));
  document.getElementById(`reg-panel-${step}`).classList.add("active");

  // Highlight step tab targets
  for (let i = 1; i <= 3; i++) {
    const indicator = document.getElementById(`si-${i}`);
    const line = document.getElementById(`sl-${i}`);
    if (indicator) {
      if (i <= step) indicator.classList.add("active");
      else indicator.classList.remove("active");
    }
    if (line) {
      if (i < step) line.classList.add("active");
      else line.classList.remove("active");
    }
  }
}

function showFieldError(inputId, message) {
  const field = document.getElementById(inputId);
  if (field) {
    field.style.borderColor = "#EF4444";
    const group = field.closest(".rf-group") || field.parentElement;
    const errorDiv = group.querySelector(".field-error");
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.add("show");
    }
  }
}

function clearErrors() {
  document.querySelectorAll(".rf-input").forEach(i => i.style.borderColor = "#E2E8F0");
  document.querySelectorAll(".field-error").forEach(e => e.classList.remove("show"));
}

function regNext(step) {
  clearErrors();
  let isValid = true;

  if (step === 1) {
    const name = document.getElementById("rf-name").value.trim();
    const email = document.getElementById("rf-email").value.trim();
    const phone = document.getElementById("rf-phone").value.trim();

    if (!name) { showFieldError("rf-name", "Please enter your full name."); isValid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldError("rf-email", "Please enter a valid email address."); isValid = false; }
    if (!phone) { showFieldError("rf-phone", "Please enter your phone number."); isValid = false; }

    if (!isValid) return;
    currentStep = 2;
    updateStepUI(2);

  } else if (step === 2) {
    const country = document.getElementById("rf-country").value;
    const exp = document.getElementById("rf-exp").value;

    if (!country) { showFieldError("rf-country", "Please select your country."); isValid = false; }
    if (!exp) { showFieldError("rf-exp", "Please specify experience parameters."); isValid = false; }

    if (!isValid) return;

    // Fill Review confirmation panel rows dynamically
    document.getElementById("ws-name").textContent = document.getElementById("rf-name").value;
    document.getElementById("ws-email").textContent = document.getElementById("rf-email").value;
    document.getElementById("ws-phone").textContent = document.getElementById("rf-phone").value;
    document.getElementById("ws-country").textContent = country;

    currentStep = 3;
    updateStepUI(3);
  }
}

function regBack(step) {
  clearErrors();
  currentStep = step - 1;
  updateStepUI(currentStep);
}

// ── GOOGLE FORMS DATA INJECTION PIPELINE ──
const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSeX6xjupR7wwQpiaAPdgEXWIAsiMQtFH5iF8l1GxtOMSNuefQ/formResponse';
const FORM_FIELDS = {
  name: 'entry.300734751',
  email: 'entry.1640519720',
  phone: 'entry.1062874924',
  country: 'entry.438630277',
  exp: 'entry.1078655696'
};

async function submitRegistration() {
  const submitBtn = document.getElementById("btn-submit");
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Processing Security Handshake..."; }

  const formData = new FormData();
  formData.append(FORM_FIELDS.name, document.getElementById("rf-name").value.trim());
  formData.append(FORM_FIELDS.email, document.getElementById("rf-email").value.trim());
  formData.append(FORM_FIELDS.phone, document.getElementById("rf-phone").value.trim());
  formData.append(FORM_FIELDS.country, document.getElementById("rf-country").value);
  formData.append(FORM_FIELDS.exp, document.getElementById("rf-exp").value);

  try {
    // Execute opaque post pipeline avoiding cross-origin rejections
    await fetch(GOOGLE_FORM_ACTION, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    // Reveal final celebration state panel
    document.getElementById("reg-steps").style.display = "none";
    document.querySelectorAll(".reg-panel").forEach(p => p.classList.remove("active"));
    const successPanel = document.getElementById("reg-success");
    successPanel.style.display = "block";
    document.getElementById("success-name").textContent = document.getElementById("rf-name").value.trim();

    // Trigger visual confetti fall down layout animation
    triggerConfettiDrop();
  } catch (error) {
    console.error("Form error:", error);
    alert("Connection validation timed out. Please retry registration.");
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Complete Secure Reservation"; }
  }
}

// ── VIRTUAL CELEBRATION EFFECTS GENERATOR ──
function triggerConfettiDrop() {
  const colors = ['#2563EB', '#60A5FA', '#22C55E', '#F59E0B', '#EF4444'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 8px; height: 8px; border-radius: 2px;
      top: -10px; left: ${Math.floor(Math.random() * 100)}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      transform: translateY(0) rotate(0deg);
      transition: transform 3s ease-out, opacity 3s;
    `;
    document.body.appendChild(el);

    // Prompt browser execution layout thread update
    setTimeout(() => {
      el.style.transform = `translateY(100vh) rotate(${Math.floor(Math.random() * 360)}deg)`;
      el.style.opacity = '0';
    }, 50);

    setTimeout(() => el.remove(), 3000);
  }
}