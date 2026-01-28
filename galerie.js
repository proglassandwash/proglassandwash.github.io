document.addEventListener('DOMContentLoaded', () => {
    
    // SÉLECTION DOM
    const filterBtns = document.querySelectorAll('.pg-filter-btn');
    const galleryItems = document.querySelectorAll('.pg-gallery-item');
    
    // Lightbox DOM
    const lightbox = document.getElementById('pg-lightbox');
    const lightboxImg = document.getElementById('pg-lightbox-img');
    const lightboxVideo = document.getElementById('pg-lightbox-video');
    const lightboxTitle = document.getElementById('pg-caption-title');
    const counter = document.getElementById('pg-counter');
    const closeBtn = document.querySelector('.pg-close-btn');
    const nextBtn = document.querySelector('.pg-next');
    const prevBtn = document.querySelector('.pg-prev');
    const backdrop = document.querySelector('.pg-lightbox-backdrop');

    let currentIndex = 0;
    let visibleItems = []; // Stocke les éléments actuellement filtrés

    // --- 1. GESTION DES FILTRES ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Active
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemCat = item.getAttribute('data-category'); // 'photo' ou 'video'
                
                // Si filtre "all" ou si la catégorie correspond
                if (filter === 'all' || itemCat === filter) {
                    item.style.display = 'block';
                    // Animation reset
                    item.style.opacity = '0';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.display = 'none';
                }
            });

            // Mise à jour de la liste utilisée par la Lightbox
            updateVisibleItems();
        });
    });

    function updateVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    }
    // Init au chargement
    updateVisibleItems();


    // --- 2. OUVERTURE LIGHTBOX ---
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Trouver l'index dans la liste filtrée
            const index = visibleItems.indexOf(item);
            if (index !== -1) {
                currentIndex = index;
                openLightbox(index);
            }
        });
    });

    function openLightbox(index) {
        if (visibleItems.length === 0) return;
        
        const item = visibleItems[index];
        const type = item.getAttribute('data-type'); // 'image' ou 'video'
        const src = item.getAttribute('data-src');
        const title = item.querySelector('.pg-item-title').textContent;

        // Reset display
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();

        if (type === 'video') {
            lightboxVideo.src = src;
            lightboxVideo.style.display = 'block';
            lightboxVideo.play(); // Autoplay doux
        } else {
            lightboxImg.src = src;
            lightboxImg.style.display = 'block';
        }

        // Textes
        lightboxTitle.textContent = title;
        counter.textContent = `${index + 1} / ${visibleItems.length}`;

        // Afficher Lightbox
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop scroll site
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lightboxVideo.pause();
        setTimeout(() => {
            lightboxImg.src = '';
            lightboxVideo.src = '';
        }, 300);
    }

    // --- 3. NAVIGATION (NEXT / PREV) ---
    function showNext() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        openLightbox(currentIndex);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox(currentIndex);
    }

    // Listeners Navigation
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);

    // Clavier
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // --- 4. SWIPE MOBILE ---
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        if (touchStartX - touchEndX > 50) showNext(); // Swipe Gauche -> Next
        if (touchEndX - touchStartX > 50) showPrev(); // Swipe Droit -> Prev
    }
});