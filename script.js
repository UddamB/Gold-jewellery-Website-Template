const revealTargets = [
  ...document.querySelectorAll(
    ".hero-copy, .hero-visual, .section-heading, .property-card, .portrait-panel, .story-copy, .services-grid article, .contact-copy, .contact-card, .page-hero-copy, .page-hero-panel, .listing-tile"
  ),
];

revealTargets.forEach((element) => {
  element.setAttribute("data-reveal", "");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealTargets.forEach((element) => revealObserver.observe(element));

const metricCounters = document.querySelectorAll("[data-count]");
const metricObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 1200;
      const start = performance.now();

      const updateCounter = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        element.textContent = Math.floor(progress * target);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
      metricObserver.unobserve(element);
    });
  },
  { threshold: 0.65 }
);

metricCounters.forEach((counter) => metricObserver.observe(counter));

const contactForm = document.querySelector(".contact-card");
const filterButtons = document.querySelectorAll("[data-filter]");
const listingTiles = document.querySelectorAll(".listing-tile");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");

  if (!button) {
    return;
  }

  const originalLabel = button.textContent;
  button.textContent = "Request Sent";
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = originalLabel;
    button.disabled = false;
    contactForm.reset();
  }, 2200);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((chip) => chip.classList.remove("is-active"));
    button.classList.add("is-active");

    listingTiles.forEach((tile) => {
      const matches = filter === "all" || tile.dataset.category === filter;
      tile.classList.toggle("is-hidden", !matches);
    });
  });
});
