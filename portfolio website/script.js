document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const form = document.querySelector("#contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      setTimeout(function () {
        alert(
          "Thank you! If your mail client opened, your message was prepared. Otherwise please email directly to sakitsharma1@gmail.com",
        );
      }, 200);
    });
  }
});

const menuBtn = document.getElementById("menuBtn");
document.addEventListener("DOMContentLoaded", () => {
  /* =========================
CURRENT YEAR
========================== */

  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* =========================
SMOOTH SCROLL
========================== */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  /* =========================
CONTACT FORM
========================== */

  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", () => {
      setTimeout(() => {
        alert(
          "Thank you! If your mail client opened, your message was prepared. Otherwise please email directly to [sakitsharma1@gmail.com](mailto:sakitsharma1@gmail.com).",
        );
      }, 200);
    });
  }

  /* =========================
MOBILE MENU
========================== */

  const menuBtn = document.getElementById("menuBtn");
  const mainMenu = document.getElementById("mainMenu");

  if (!menuBtn || !mainMenu) {
    return;
  }

  menuBtn.addEventListener("click", () => {
    const isOpen = mainMenu.classList.toggle("menu-open");

    menuBtn.setAttribute("aria-expanded", String(isOpen));

    menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

    menuBtn.textContent = isOpen ? "✕" : "☰";
  });

  /* =========================
CLOSE MENU AFTER CLICK
========================== */

  const menuLinks = mainMenu.querySelectorAll("a");

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainMenu.classList.remove("menu-open");

      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open menu");

      menuBtn.textContent = "☰";
    });
  });
});
