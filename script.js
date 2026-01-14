console.log("SCRIPT.JS CHARGÉ ✅");

/* =========================
   LOADER
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const siteContent = document.getElementById("site-content");

    setTimeout(() => {
        loader.style.opacity = "0";

        setTimeout(() => {
            loader.style.display = "none";
            siteContent.classList.remove("hidden");
            siteContent.style.opacity = "0";
            fadeIn(siteContent);
        }, 500);

    }, 3000);
});

/* =========================
   FADE IN
========================= */
function fadeIn(element) {
    let opacity = 0;
    const timer = setInterval(() => {
        if (opacity >= 1) clearInterval(timer);
        element.style.opacity = opacity;
        opacity += 0.1;
    }, 50);
}

/* =========================
   BOUTONS HERO
========================= */
document.addEventListener("DOMContentLoaded", () => {

    // Bouton réservation → WhatsApp
    const btnReservation = document.getElementById("btn-reservation");
    if (btnReservation) {
        btnReservation.addEventListener("click", () => {
            window.open("https://wa.me/33670378324", "_blank");
        });
    }

    const btnDevis = document.getElementById("btn-devis");
    if (btnDevis) {
        btnDevis.addEventListener("click", () => {
            window.open("https://wa.me/33670378324", "_blank");
        });
    }
});
/* =========================
   NAVIGATION SMOOTH SCROLL
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            const href = link.getAttribute("href");

            // On ne bloque QUE les ancres internes
            if (href.startsWith("#")) {
                e.preventDefault();
                const targetSection = document.querySelector(href);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
            // sinon (galerie.html, index.html, etc) → navigation normale
        });
    });
});

/* =========================
   ANIMATIONS AU SCROLL
========================= */
function animateOnScroll() {
    const elements = document.querySelectorAll(
        ".service-card, .detailed-card, .feature, .info-block"
    );

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "0.6s ease";
        observer.observe(el);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(animateOnScroll, 3500);
});

/* =========================
   NAVBAR SCROLL
========================= */
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 100) {
        navbar.style.background = "hsla(0, 0%, 4%, 0.90)";
        navbar.style.backdropFilter = "blur(10px)";
    } else {
        navbar.style.background = "transparent";
        navbar.style.backdropFilter = "none";
    }
});
const galleryItems = document.querySelectorAll(".galerie-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const lightboxVideo = document.querySelector(".lightbox-video");
const closeBtn = document.querySelector(".lightbox-close");

galleryItems.forEach(item => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    const video = item.querySelector("video");

    lightbox.style.display = "flex";

    if (img) {
      lightboxVideo.src = video.querySelector("source").src;
      lightboxImg.style.display = "block";
      lightboxVideo.style.display = "none";
    }

    if (video) {
      lightboxVideo.src = video.src;
      lightboxVideo.style.display = "block";
      lightboxImg.style.display = "none";
    }
  });
});
