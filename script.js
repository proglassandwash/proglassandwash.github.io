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
/* ==========================================
   JS — SECTION PREMIUM pg-*
   Multi-sliders + Modal dynamique
   À coller en bas de script.js
   ========================================== */

(function() {
  'use strict';

  // === CONFIG IMAGES (à adapter si noms différents) ===
  const PG_IMAGES = {
    ext: {
      before: 'images/pg-ext-before.jpg',
      after: 'images/pg-ext-after.jpg',
      title: 'Extérieur — Avant / Après'
    },
    int: {
      before: 'images/pg-int-before.jpg',
      after: 'images/pg-int-after.jpg',
      title: 'Intérieur — Avant / Après'
    }
  };

  // === ÉLÉMENTS DOM ===
  const pgThumbs = document.querySelectorAll('[data-pg-slider]');
  const pgModal = document.getElementById('pgModal');
  const pgModalSlider = document.getElementById('pgModalSlider');
  const pgModalClip = document.getElementById('pgModalClip');
  const pgModalHandle = document.getElementById('pgModalHandle');
  const pgModalBefore = document.getElementById('pgModalBefore');
  const pgModalAfter = document.getElementById('pgModalAfter');
  const pgModalTitle = document.getElementById('pgModalTitle');
  const pgModalCloseButtons = document.querySelectorAll('[data-pg-modal-close]');

  if (!pgModal || pgThumbs.length === 0) return;

  // === VARIABLES ===
  let pgModalDragging = false;
  let pgActiveThumb = null;

  // === UTILITAIRES ===
  function pgClamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function pgGetPercent(e, container) {
    const rect = container.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    return pgClamp((x - rect.left) / rect.width * 100, 0, 100);
  }

  // ==========================================
  // THUMBNAILS (petits sliders)
  // ==========================================
  pgThumbs.forEach(function(thumb) {
    const clip = thumb.querySelector('[data-pg-clip]');
    const handle = thumb.querySelector('[data-pg-handle]');
    let isDragging = false;
    let startX = 0;

    function updateThumb(percent) {
      clip.style.width = percent + '%';
      handle.style.left = percent + '%';
    }

    function onStart(e) {
      isDragging = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      e.preventDefault();
    }

    function onMove(e) {
      if (!isDragging) return;
      const percent = pgGetPercent(e, thumb.querySelector('.pg-ba-thumb-inner'));
      updateThumb(percent);
    }

    function onEnd(e) {
      if (!isDragging) return;
      const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const moved = Math.abs(endX - startX);
      isDragging = false;

      // Si quasi pas de mouvement = clic → ouvrir modal
      if (moved < 10) {
        pgActiveThumb = thumb;
        pgOpenModal(thumb.dataset.pgSlider);
      }
    }

    // Events
    thumb.addEventListener('mousedown', onStart);
    thumb.addEventListener('touchstart', onStart, { passive: false });
    thumb.addEventListener('mousemove', onMove);
    thumb.addEventListener('touchmove', onMove, { passive: true });
    thumb.addEventListener('mouseup', onEnd);
    thumb.addEventListener('touchend', onEnd);
    thumb.addEventListener('mouseleave', function() { isDragging = false; });

    // Clavier
    thumb.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pgActiveThumb = thumb;
        pgOpenModal(thumb.dataset.pgSlider);
      }
    });

    // Init à 50%
    updateThumb(50);
  });

  // ==========================================
  // MODAL
  // ==========================================
  function pgOpenModal(sliderId) {
    const data = PG_IMAGES[sliderId];
    if (!data) return;

    // Charger les images
    pgModalBefore.src = data.before;
    pgModalAfter.src = data.after;
    pgModalTitle.textContent = data.title;

    // Reset slider à 50%
    pgUpdateModalSlider(50);

    // Ouvrir
    pgModal.classList.add('pg-open');
    document.body.style.overflow = 'hidden';

    // Focus bouton fermer
    setTimeout(function() {
      const closeBtn = pgModal.querySelector('.pg-modal-close');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }

  function pgCloseModal() {
    pgModal.classList.remove('pg-open');
    document.body.style.overflow = '';

    // Rendre le focus au thumb
    if (pgActiveThumb) {
      pgActiveThumb.focus();
      pgActiveThumb = null;
    }
  }

  // Boutons fermer
  pgModalCloseButtons.forEach(function(btn) {
    btn.addEventListener('click', pgCloseModal);
  });

  // ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && pgModal.classList.contains('pg-open')) {
      pgCloseModal();
    }
  });

  // ==========================================
  // SLIDER MODAL
  // ==========================================
  function pgUpdateModalSlider(percent) {
    pgModalClip.style.width = percent + '%';
    pgModalHandle.style.left = percent + '%';
  }

  function pgModalStart(e) {
    pgModalDragging = true;
    const percent = pgGetPercent(e, pgModalSlider);
    pgUpdateModalSlider(percent);
    e.preventDefault();
  }

  function pgModalMove(e) {
    if (!pgModalDragging) return;
    const percent = pgGetPercent(e, pgModalSlider);
    pgUpdateModalSlider(percent);
  }

  function pgModalEnd() {
    pgModalDragging = false;
  }

  pgModalSlider.addEventListener('mousedown', pgModalStart);
  pgModalSlider.addEventListener('touchstart', pgModalStart, { passive: false });
  document.addEventListener('mousemove', pgModalMove);
  document.addEventListener('touchmove', pgModalMove, { passive: true });
  document.addEventListener('mouseup', pgModalEnd);
  document.addEventListener('touchend', pgModalEnd);

})();
/* ==========================================
   SLIDER GALERIE PREMIUM - VANILLA JS
   ========================================== */

(function() {
  'use strict';

  // Configuration
  const images = [
    { src: "images/lavage.jpg", alt: "Lavage professionnel - Vue 1" },
    { src: "images/lavage2.jpg", alt: "Lavage professionnel - Vue 2" },
    { src: "images/lavage3.jpg", alt: "Lavage professionnel - Vue 3" },
    { src: "images/lavage4.jpg", alt: "Lavage professionnel - Vue 4" },
    { src: "images/lavage5.jpg", alt: "Lavage professionnel - Vue 5" },
    { src: "images/lavage6.jpg", alt: "Lavage professionnel - Vue 6" }
  ];

  let currentIndex = 0;

  // Elements DOM
  const img = document.getElementById('luxSliderImg');
  const btnPrev = document.querySelector('.lux-nav-prev');
  const btnNext = document.querySelector('.lux-nav-next');
  const currentSpan = document.querySelector('.lux-current');
  const totalSpan = document.querySelector('.lux-total');

  // Vérification existence des éléments
  if (!img || !btnPrev || !btnNext) {
    console.error('Slider Premium: Éléments DOM manquants');
    return;
  }

  // Init
  totalSpan.textContent = images.length;
  img.classList.add('active');

  // Fonction changement d'image
  function changeImage(direction) {
    // Calcul nouvel index
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % images.length;
    } else {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    // Animation sortie
    img.classList.remove('active', 'lux-slide-in');
    
    // Changement image après fade out
    setTimeout(() => {
      img.src = images[currentIndex].src;
      img.alt = images[currentIndex].alt;
      currentSpan.textContent = currentIndex + 1;
      
      // Animation entrée
      img.classList.add('active', 'lux-slide-in');
    }, 150);
  }

  // Event listeners boutons
  btnNext.addEventListener('click', () => changeImage('next'));
  btnPrev.addEventListener('click', () => changeImage('prev'));

  // Navigation clavier
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      changeImage('next');
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      changeImage('prev');
      e.preventDefault();
    }
  });

  // Préchargement des images (performance)
  images.forEach((item, index) => {
    if (index > 0) { // Skip première image (déjà chargée)
      const preloadImg = new Image();
      preloadImg.src = item.src;
    }
  });

  // Support touch/swipe mobile (optionnel)
  let touchStartX = 0;
  let touchEndX = 0;

  img.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  img.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        changeImage('next'); // Swipe left
      } else {
        changeImage('prev'); // Swipe right
      }
    }
  }

})();
/* ==========================================
   SECTION CARROSSERIE - JAVASCRIPT
   À AJOUTER À LA FIN DE script.js
   ========================================== */

(function() {
  'use strict';

  // Configuration
  const PHONE_NUMBER = '33670378324'; // Format international sans + ni espaces
  const EMAIL_ADDRESS = 'proglassandwash@gmail.com';

  // Elements DOM
  const form = document.getElementById('carContactForm');
  const btnEmail = document.getElementById('carBtnEmail');
  const btnWhatsApp = document.getElementById('carBtnWhatsApp');
  const photosInput = document.getElementById('carPhotos');
  const photosPreview = document.getElementById('carPhotosPreview');

  if (!form || !btnEmail || !btnWhatsApp) {
    console.warn('Section Carrosserie: Éléments DOM manquants');
    return;
  }

  /* ==========================================
     PREVIEW PHOTOS
     ========================================== */

  photosInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Max 5 photos
    photosPreview.innerHTML = ''; // Reset

    if (files.length === 0) return;

    files.forEach((file, index) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const div = document.createElement('div');
        div.className = 'car-photo-item';
        div.innerHTML = `
          <img src="${event.target.result}" alt="Photo ${index + 1}">
          <button type="button" class="car-photo-remove" data-index="${index}">×</button>
        `;
        photosPreview.appendChild(div);
      };
      reader.readAsDataURL(file);
    });
  });

  // Supprimer une photo
  photosPreview.addEventListener('click', (e) => {
    if (!e.target.classList.contains('car-photo-remove')) return;
    e.target.closest('.car-photo-item').remove();
  });

  /* ==========================================
     VALIDATION BASIQUE
     ========================================== */

  function validateForm() {
    const nom = document.getElementById('carNom').value.trim();
    const tel = document.getElementById('carTel').value.trim();
    const email = document.getElementById('carEmail').value.trim();
    const message = document.getElementById('carMessage').value.trim();

    if (!nom || !tel || !email || !message) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return false;
    }

    return { nom, tel, email, message };
  }

  /* ==========================================
     ENVOI PAR EMAIL (MAILTO)
     ========================================== */

  btnEmail.addEventListener('click', (e) => {
    e.preventDefault();

    const data = validateForm();
    if (!data) return;

    const subject = encodeURIComponent('Demande de devis Carrosserie');
    const body = encodeURIComponent(
      `Nom : ${data.nom}\n` +
      `Téléphone : ${data.tel}\n` +
      `Email : ${data.email}\n\n` +
      `Travaux souhaités :\n${data.message}\n\n` +
      `---\n` +
      `Note : Photos à joindre manuellement si nécessaire.`
    );

    const mailtoLink = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  });

  /* ==========================================
     ENVOI PAR WHATSAPP
     ========================================== */

  btnWhatsApp.addEventListener('click', (e) => {
    e.preventDefault();

    const data = validateForm();
    if (!data) return;

    const text = encodeURIComponent(
      `*Demande de devis Carrosserie*\n\n` +
      `Nom : ${data.nom}\n` +
      `Téléphone : ${data.tel}\n` +
      `Email : ${data.email}\n\n` +
      `Travaux souhaités :\n${data.message}\n\n` +
      `_Photos à envoyer séparément si besoin_`
    );

    const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${text}`;
    window.open(whatsappLink, '_blank');
  });

  /* ==========================================
     LIMITE 5 PHOTOS
     ========================================== */

  photosInput.addEventListener('change', (e) => {
    if (e.target.files.length > 5) {
      alert('Maximum 5 photos autorisées.');
      e.target.value = '';
      photosPreview.innerHTML = '';
    }
  });

})();
/* ==========================================
   SECTION PARE-BRISE - JAVASCRIPT
   À AJOUTER À LA FIN DE script.js
   ========================================== */

(function() {
  'use strict';

  // ========================================
  // CONFIGURATION - À PERSONNALISER
  // ========================================
  const PB_WHATSAPP_NUMBER = '33670378324'; // Format international sans + ni espaces
  const PB_EMAIL = 'proglassandwash@gmail.com';
  // ========================================

  // Elements DOM
  const cards = document.querySelectorAll('.pb-card .pb-card-btn');
  const formWrapper = document.getElementById('pbFormWrapper');
  const formTitle = document.getElementById('pbFormTitle');
  const serviceTypeInput = document.getElementById('pbServiceType');
  const btnWhatsApp = document.getElementById('pbBtnWhatsApp');
  const btnEmail = document.getElementById('pbBtnEmail');

  if (!formWrapper || !cards.length) {
    console.warn('Section Pare-brise: Éléments DOM manquants');
    return;
  }

  /* ==========================================
     OUVERTURE FORMULAIRE
     ========================================== */

  cards.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action; // 'devis' ou 'cession'
      
      // Mise à jour titre et type
      if (action === 'devis') {
        formTitle.textContent = 'Demande de devis pare-brise';
        serviceTypeInput.value = 'devis';
      } else {
        formTitle.textContent = 'Demande de prise en charge assurance';
        serviceTypeInput.value = 'cession';
      }

      // Affichage formulaire
      formWrapper.style.display = 'block';
      
      // Scroll vers formulaire
      setTimeout(() => {
        formWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  });

  /* ==========================================
     VALIDATION FORMULAIRE
     ========================================== */

  function validateForm() {
    const nom = document.getElementById('pbNom').value.trim();
    const tel = document.getElementById('pbTel').value.trim();

    if (!nom || !tel) {
      alert('Veuillez renseigner au minimum votre nom et téléphone.');
      return false;
    }

    return {
      nom,
      tel,
      email: document.getElementById('pbEmail').value.trim(),
      marque: document.getElementById('pbMarque').value.trim(),
      immat: document.getElementById('pbImmat').value.trim(),
      message: document.getElementById('pbMessage').value.trim(),
      serviceType: serviceTypeInput.value
    };
  }

  /* ==========================================
     ENVOI WHATSAPP
     ========================================== */

  btnWhatsApp.addEventListener('click', (e) => {
    e.preventDefault();

    const data = validateForm();
    if (!data) return;

    const serviceLabel = data.serviceType === 'devis' 
      ? 'Demande de devis' 
      : 'Demande de prise en charge assurance';

    let text = `*${serviceLabel} - Pare-brise*\n\n`;
    text += `Nom : ${data.nom}\n`;
    text += `Téléphone : ${data.tel}\n`;
    if (data.email) text += `Email : ${data.email}\n`;
    if (data.marque) text += `Véhicule : ${data.marque}\n`;
    if (data.immat) text += `Immatriculation : ${data.immat}\n`;
    if (data.message) text += `\nMessage :\n${data.message}`;

    const whatsappLink = `https://wa.me/${PB_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(whatsappLink, '_blank');
  });

  /* ==========================================
     ENVOI EMAIL
     ========================================== */

  btnEmail.addEventListener('click', (e) => {
    e.preventDefault();

    const data = validateForm();
    if (!data) return;

    const serviceLabel = data.serviceType === 'devis' 
      ? 'Demande de devis' 
      : 'Demande de prise en charge assurance';

    const subject = encodeURIComponent(`${serviceLabel} - Pare-brise`);
    
    let body = `Nom : ${data.nom}\n`;
    body += `Téléphone : ${data.tel}\n`;
    if (data.email) body += `Email : ${data.email}\n`;
    if (data.marque) body += `Véhicule : ${data.marque}\n`;
    if (data.immat) body += `Immatriculation : ${data.immat}\n`;
    body += `\nService : ${serviceLabel}\n`;
    if (data.message) body += `\nMessage :\n${data.message}`;

    const mailtoLink = `mailto:${PB_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  });

})();
