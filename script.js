const PHONE_LINK = "tel:0509011040";
const WHATSAPP_BASE = "https://wa.me/972509011040";
const WHATSAPP_DEFAULT_MESSAGE = "שלום סייונוב הובלות, אשמח לקבל הצעת מחיר להובלה";

const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-nav]");
const navLinks = siteNav ? [...siteNav.querySelectorAll('a[href^="#"]')] : [];
const stickyCta = document.querySelector("[data-sticky-cta]");
const backToTopButton = document.querySelector("[data-back-to-top]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function toggleMenu(forceState) {
  if (!menuToggle || !siteNav) {
    return;
  }

  const shouldOpen = typeof forceState === "boolean" ? forceState : menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(shouldOpen));
  siteNav.classList.toggle("is-open", shouldOpen);
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    toggleMenu();
  });
}

document.addEventListener("click", (event) => {
  if (!siteNav || !menuToggle) {
    return;
  }

  const clickedInsideMenu = siteNav.contains(event.target) || menuToggle.contains(event.target);
  if (!clickedInsideMenu) {
    toggleMenu(false);
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    toggleMenu(false);
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });
  });
});

document.querySelectorAll("[data-accordion-group]").forEach((group) => {
  group.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      const panelId = trigger.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      if (!panel) {
        return;
      }

      trigger.setAttribute("aria-expanded", String(!isExpanded));
      panel.hidden = isExpanded;
    });
  });
});

function updateFloatingActions() {
  const scrollY = window.scrollY;

  if (stickyCta) {
    stickyCta.classList.toggle("is-visible", scrollY > 260 && window.innerWidth < 768);
  }

  if (backToTopButton) {
    backToTopButton.classList.toggle("is-visible", scrollY > 520);
  }
}

window.addEventListener("scroll", updateFloatingActions, { passive: true });
window.addEventListener("resize", updateFloatingActions);
updateFloatingActions();

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth"
    });
  });
}

const sectionTargets = ["services", "pricing", "process", "faq", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (sectionTargets.length && navLinks.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const activeId = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === activeId);
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0.01
    }
  );

  sectionTargets.forEach((section) => observer.observe(section));
}

document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
  if (!link.getAttribute("href")) {
    link.setAttribute("href", PHONE_LINK);
  }
});

document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
  if (!link.getAttribute("href")) {
    link.setAttribute("href", `${WHATSAPP_BASE}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`);
  }
});
