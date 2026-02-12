/**
 * GALERIE PREMIUM 2025 - PRO GLASS & WASH
 * Gestion des dossiers clients avec lightbox + vidéo
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ========== DOM ELEMENTS ==========
  const filterBtns = document.querySelectorAll('.pg-filter-btn');
  const dossierCards = document.querySelectorAll('.pg-dossier-card');
  const countEl = document.getElementById('pg-count');
  const pluralEl = document.getElementById('pg-plural');
  const emptyState = document.querySelector('.pg-empty-state');
  
  // Modal
  const modal = document.getElementById('pg-modal');
  const modalBackdrop = modal.querySelector('.pg-modal-backdrop');
  const modalClose = modal.querySelector('.pg-modal-close');
  const modalTitle = document.getElementById('pg-modal-title');
  const modalSubtitle = document.getElementById('pg-modal-subtitle');
  const modalPrestations = document.getElementById('pg-modal-prestations');
  const mainPhoto = document.getElementById('pg-main-photo');
  const photoCounter = document.getElementById('pg-photo-counter');
  const thumbnailsContainer = document.getElementById('pg-thumbnails');
  const photoPrevBtn = modal.querySelector('.pg-photo-prev');
  const photoNextBtn = modal.querySelector('.pg-photo-next');
  
  // Review elements
  const reviewText = document.getElementById('pg-review-text');
  const reviewStars = document.getElementById('pg-review-stars');
  const authorInitial = document.getElementById('pg-author-initial');
  const authorName = document.getElementById('pg-author-name');
  const authorDate = document.getElementById('pg-author-date');
  const reviewLink = document.getElementById('pg-review-link');
  
  // Lightbox
  const lightbox = document.getElementById('pg-lightbox');
  const lightboxImg = document.getElementById('pg-lightbox-img');
  const lightboxCounter = document.getElementById('pg-lightbox-counter');
  const lightboxClose = lightbox.querySelector('.pg-lightbox-close');
  const lightboxPrev = lightbox.querySelector('.pg-lightbox-prev');
  const lightboxNext = lightbox.querySelector('.pg-lightbox-next');
  const lightboxBackdrop = lightbox.querySelector('.pg-lightbox-backdrop');
  
  // State
  let currentDossierData = null;
  let currentPhotoIndex = 0;
  let visibleCards = [];
  
  // ========== FILTRES ==========
  function updateVisibleCards() {
    visibleCards = Array.from(dossierCards).filter(
      card => card.style.display !== 'none'
    );
    
    const count = visibleCards.length;
    if (countEl) countEl.textContent = count;
    if (pluralEl) pluralEl.style.display = count > 1 ? 'inline' : 'none';
    
    if (emptyState) {
      emptyState.style.display = count === 0 ? 'block' : 'none';
    }
  }
  
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.getAttribute('data-filter');
    
    dossierCards.forEach((card, index) => {
      const categories = card.getAttribute('data-category') || '';
      const categoryList = categories.split(' ');
      const shouldShow = filter === 'all' || categoryList.includes(filter);
      
      if (shouldShow) {
        card.style.display = 'block';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 50);
      } else {
        card.style.display = 'none';
      }
    });
    
    updateVisibleCards();
  });
});
  
  updateVisibleCards();
  
  // ========== OPEN MODAL ==========
  dossierCards.forEach(card => {
    card.addEventListener('click', () => {
      const dataScript = card.querySelector('.pg-dossier-data');
      if (!dataScript) return;
      
      try {
        currentDossierData = JSON.parse(dataScript.textContent);
        currentPhotoIndex = 0;
        openModal();
      } catch (e) {
        console.error('Erreur parsing dossier data:', e);
      }
    });
    
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
  
  function openModal() {
    if (!currentDossierData) return;
    
    const data = currentDossierData;
    
    modalTitle.textContent = data.title || '';
    modalSubtitle.textContent = data.subtitle || '';
    
    modalPrestations.innerHTML = '';
    if (data.prestations && data.prestations.length) {
      data.prestations.forEach(p => {
        const tag = document.createElement('span');
        tag.className = 'pg-tag';
        tag.textContent = p;
        modalPrestations.appendChild(tag);
      });
    }
    
    if (data.photos && data.photos.length) {
      updateMainPhoto();
      renderThumbnails();
    }
    
    const reviewSection = document.querySelector('.pg-modal-review');
if (data.review) {
  reviewSection.style.display = 'block';
  const r = data.review;
  reviewText.textContent = r.text || '';
  reviewStars.textContent = '★'.repeat(r.rating || 5) + '☆'.repeat(5 - (r.rating || 5));
  authorInitial.textContent = (r.author || 'A').charAt(0).toUpperCase();
  authorName.textContent = r.author || '';
  authorDate.textContent = r.date || '';
  reviewLink.href = r.link || '#';
} else {
  reviewSection.style.display = 'none';
}
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }
  
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Pause vidéo si elle existe
    const wrapper = mainPhoto.parentElement;
    const videoEl = wrapper.querySelector('.pg-main-video');
    if (videoEl) {
      videoEl.pause();
      videoEl.style.display = 'none';
    }
    
    currentDossierData = null;
  }
  
  // ========== PHOTO/VIDEO NAVIGATION ==========
  function updateMainPhoto() {
    if (!currentDossierData || !currentDossierData.photos) return;
    
    const photos = currentDossierData.photos;
    const photo = photos[currentPhotoIndex];
    const isVideo = photo.type === 'video';
    
    const wrapper = mainPhoto.parentElement;
    let videoEl = wrapper.querySelector('.pg-main-video');
    
    if (isVideo) {
      mainPhoto.style.display = 'none';
      
      if (!videoEl) {
        videoEl = document.createElement('video');
        videoEl.className = 'pg-main-video pg-main-photo';
        videoEl.setAttribute('controls', '');
        videoEl.setAttribute('playsinline', '');
        wrapper.insertBefore(videoEl, mainPhoto);
      }
      
      videoEl.src = photo.src;
      videoEl.poster = photo.poster || '';
      videoEl.style.display = 'block';
    } else {
      if (videoEl) {
        videoEl.pause();
        videoEl.style.display = 'none';
      }
      mainPhoto.src = photo.src;
      mainPhoto.alt = photo.alt || '';
      mainPhoto.style.display = 'block';
    }
    
    photoCounter.textContent = `${currentPhotoIndex + 1} / ${photos.length}`;
    
    const thumbs = thumbnailsContainer.querySelectorAll('.pg-thumb');
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === currentPhotoIndex);
    });
  }
  
  function renderThumbnails() {
    thumbnailsContainer.innerHTML = '';
    
    if (!currentDossierData || !currentDossierData.photos) return;
    
    currentDossierData.photos.forEach((photo, index) => {
      const thumb = document.createElement('button');
      thumb.className = 'pg-thumb' + (index === 0 ? ' active' : '');
      thumb.setAttribute('aria-label', `${photo.type === 'video' ? 'Vidéo' : 'Photo'} ${index + 1}`);
      
      const thumbSrc = photo.type === 'video' ? photo.poster : photo.src;
      thumb.innerHTML = `
        <img src="${thumbSrc}" alt="${photo.alt || ''}" loading="lazy">
        ${photo.type === 'video' ? '<span class="pg-thumb-play">▶</span>' : ''}
      `;
      
      thumb.addEventListener('click', () => {
        currentPhotoIndex = index;
        updateMainPhoto();
      });
      
      thumbnailsContainer.appendChild(thumb);
    });
  }
  
  function nextPhoto() {
    if (!currentDossierData || !currentDossierData.photos) return;
    currentPhotoIndex = (currentPhotoIndex + 1) % currentDossierData.photos.length;
    updateMainPhoto();
  }
  
  function prevPhoto() {
    if (!currentDossierData || !currentDossierData.photos) return;
    currentPhotoIndex = (currentPhotoIndex - 1 + currentDossierData.photos.length) % currentDossierData.photos.length;
    updateMainPhoto();
  }
  
  photoNextBtn?.addEventListener('click', nextPhoto);
  photoPrevBtn?.addEventListener('click', prevPhoto);
  
  // ========== LIGHTBOX ==========
  mainPhoto?.addEventListener('click', openLightbox);
  
  function openLightbox() {
    if (!currentDossierData || !currentDossierData.photos) return;
    
    const photo = currentDossierData.photos[currentPhotoIndex];
    
    // Ne pas ouvrir lightbox pour les vidéos
    if (photo.type === 'video') return;
    
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt || '';
    lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${currentDossierData.photos.length}`;
    
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  
  function lightboxNextPhoto() {
    if (!currentDossierData || !currentDossierData.photos) return;
    
    // Trouver la prochaine image (pas vidéo)
    let nextIndex = currentPhotoIndex;
    do {
      nextIndex = (nextIndex + 1) % currentDossierData.photos.length;
    } while (currentDossierData.photos[nextIndex].type === 'video' && nextIndex !== currentPhotoIndex);
    
    if (currentDossierData.photos[nextIndex].type !== 'video') {
      currentPhotoIndex = nextIndex;
      const photo = currentDossierData.photos[currentPhotoIndex];
      lightboxImg.src = photo.src;
      lightboxImg.alt = photo.alt || '';
      lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${currentDossierData.photos.length}`;
      updateMainPhoto();
    }
  }
  
  function lightboxPrevPhoto() {
    if (!currentDossierData || !currentDossierData.photos) return;
    
    // Trouver l'image précédente (pas vidéo)
    let prevIndex = currentPhotoIndex;
    do {
      prevIndex = (prevIndex - 1 + currentDossierData.photos.length) % currentDossierData.photos.length;
    } while (currentDossierData.photos[prevIndex].type === 'video' && prevIndex !== currentPhotoIndex);
    
    if (currentDossierData.photos[prevIndex].type !== 'video') {
      currentPhotoIndex = prevIndex;
      const photo = currentDossierData.photos[currentPhotoIndex];
      lightboxImg.src = photo.src;
      lightboxImg.alt = photo.alt || '';
      lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${currentDossierData.photos.length}`;
      updateMainPhoto();
    }
  }
  
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);
  lightboxNext?.addEventListener('click', lightboxNextPhoto);
  lightboxPrev?.addEventListener('click', lightboxPrevPhoto);
  
  // ========== MODAL CLOSE EVENTS ==========
  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  
  // ========== KEYBOARD NAVIGATION ==========
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lightboxNextPhoto();
      if (e.key === 'ArrowLeft') lightboxPrevPhoto();
      return;
    }
    
    if (modal.classList.contains('active')) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    }
  });
  
  // ========== SWIPE MOBILE ==========
  let touchStartX = 0;
  let touchEndX = 0;
  
  function handleSwipe(element, onNext, onPrev) {
    element.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    element.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) onNext();
        else onPrev();
      }
    }, { passive: true });
  }
  
  const modalGallery = modal.querySelector('.pg-modal-gallery');
  if (modalGallery) {
    handleSwipe(modalGallery, nextPhoto, prevPhoto);
  }
  
  handleSwipe(lightbox, lightboxNextPhoto, lightboxPrevPhoto);
  
  // ========== SMOOTH CARD TRANSITIONS ==========
  dossierCards.forEach(card => {
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });
  
});