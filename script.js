const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const navLinks = document.querySelector('[data-nav-links]');
const year = document.querySelector('[data-year]');
const revealItems = document.querySelectorAll('.reveal');

if (year) year.textContent = new Date().getFullYear();

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 12);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const collections = {
  editorial: {
    title: 'Brochures + Editorial Design',
    description: 'Publication layouts focused on hierarchy, pacing, typography, and clear visual communication.',
    items: [
      {
        type: 'image',
        src: 'assets/images/brochure_1.avif',
        alt: 'Brochure design spread one',
        caption: 'Brochure Design · 01'
      },
      {
        type: 'image',
        src: 'assets/images/brochure_2.avif',
        alt: 'Brochure design spread two',
        caption: 'Brochure Design · 02'
      }
    ]
  },
  game: {
    title: 'Character Design + Animation',
    description: 'Character exploration and animation created for collaborative work with Minerva Game Studio.',
    items: [
      {
        type: 'image',
        src: 'assets/images/game_character_design.avif',
        alt: 'Character design and concept artwork',
        caption: 'Character Design'
      },
      {
        type: 'image',
        src: 'assets/images/mummy_walk.gif',
        alt: 'Animated mummy walk cycle',
        caption: 'Mummy Walk Cycle'
      },
      {
        type: 'video',
        src: 'assets/images/game_animation_2.mp4',
        caption: 'Character Animation'
      }
    ]
  },
  environments: {
    title: '3D Environments',
    description: 'Environment modeling and worldbuilding across Rhinoceros 3D, Maya, and real-time graphics.',
    items: [
      {
        type: 'image',
        src: 'assets/images/rhino_env.avif',
        alt: '3D environment modeled in Rhinoceros 3D',
        caption: 'Rhinoceros 3D Environment'
      },
      {
        type: 'video',
        src: 'assets/images/environment_2.mp4',
        caption: 'Interactive Environment Walkthrough'
      }
    ]
  },
  compositing: {
    title: 'Image Compositing',
    description: 'Photoshop compositions exploring atmosphere, scale, color, and visual storytelling.',
    items: [
      {
        type: 'image',
        src: 'assets/images/nature_collage_1.avif',
        alt: 'Nature collage and image compositing study one',
        caption: 'Nature Collage · 01'
      },
      {
        type: 'image',
        src: 'assets/images/nature_collage_2.avif',
        alt: 'Nature collage and image compositing study two',
        caption: 'Nature Collage · 02'
      },
      {
        type: 'image',
        src: 'assets/images/nature_collage_3.avif',
        alt: 'Nature collage and image compositing study three',
        caption: 'Nature Collage · 03'
      }
    ]
  }
};

const galleryDialog = document.querySelector('[data-gallery-dialog]');
const galleryTitle = document.querySelector('[data-gallery-title]');
const galleryDescription = document.querySelector('[data-gallery-description]');
const galleryImage = document.querySelector('[data-gallery-image]');
const galleryVideo = document.querySelector('[data-gallery-video]');
const galleryCaption = document.querySelector('[data-gallery-caption]');
const galleryCounter = document.querySelector('[data-gallery-counter]');
const galleryThumbnails = document.querySelector('[data-gallery-thumbnails]');
const galleryClose = document.querySelector('[data-gallery-close]');
const galleryPrevious = document.querySelector('[data-gallery-previous]');
const galleryNext = document.querySelector('[data-gallery-next]');

let activeCollection = null;
let activeIndex = 0;

function resetMainMedia() {
  if (galleryVideo) {
    galleryVideo.pause();
    galleryVideo.removeAttribute('src');
    galleryVideo.load();
    galleryVideo.hidden = true;
  }

  if (galleryImage) {
    galleryImage.removeAttribute('src');
    galleryImage.removeAttribute('alt');
    galleryImage.hidden = true;
  }
}

function renderThumbnails() {
  if (!activeCollection || !galleryThumbnails) return;

  galleryThumbnails.replaceChildren();

  activeCollection.items.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'collection-thumbnail';
    button.setAttribute('aria-label', `View ${item.caption}`);
    button.classList.toggle('active', index === activeIndex);

    if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.src;
      video.muted = true;
      video.preload = 'metadata';
      video.setAttribute('aria-hidden', 'true');
      button.append(video);

      const play = document.createElement('span');
      play.className = 'thumbnail-play';
      play.textContent = '▶';
      play.setAttribute('aria-hidden', 'true');
      button.append(play);
    } else {
      const image = document.createElement('img');
      image.src = item.src;
      image.alt = '';
      image.loading = 'lazy';
      button.append(image);
    }

    button.addEventListener('click', () => {
      activeIndex = index;
      renderActiveItem();
    });

    galleryThumbnails.append(button);
  });
}

function renderActiveItem() {
  if (!activeCollection) return;

  const item = activeCollection.items[activeIndex];
  resetMainMedia();

  if (item.type === 'video') {
    galleryVideo.src = item.src;
    galleryVideo.hidden = false;
    galleryVideo.play().catch(() => {
      // Visitors can press play when their browser blocks autoplay.
    });
  } else {
    galleryImage.src = item.src;
    galleryImage.alt = item.alt || item.caption;
    galleryImage.hidden = false;
  }

  galleryCaption.textContent = item.caption;
  galleryCounter.textContent = `${activeIndex + 1} / ${activeCollection.items.length}`;
  renderThumbnails();
}

function openCollection(collectionId) {
  const collection = collections[collectionId];
  if (!collection || !galleryDialog) return;

  activeCollection = collection;
  activeIndex = 0;
  galleryTitle.textContent = collection.title;
  galleryDescription.textContent = collection.description;
  renderActiveItem();
  galleryDialog.showModal();
}

function closeCollection() {
  resetMainMedia();
  galleryDialog?.close();
  activeCollection = null;
}

function moveCollection(direction) {
  if (!activeCollection) return;
  const count = activeCollection.items.length;
  activeIndex = (activeIndex + direction + count) % count;
  renderActiveItem();
}

document.querySelectorAll('[data-gallery-open]').forEach((button) => {
  button.addEventListener('click', () => openCollection(button.dataset.galleryOpen));
});

galleryClose?.addEventListener('click', closeCollection);
galleryPrevious?.addEventListener('click', () => moveCollection(-1));
galleryNext?.addEventListener('click', () => moveCollection(1));

galleryDialog?.addEventListener('close', resetMainMedia);
galleryDialog?.addEventListener('click', (event) => {
  if (event.target === galleryDialog) closeCollection();
});

document.addEventListener('keydown', (event) => {
  if (!galleryDialog?.open) return;
  if (event.key === 'ArrowLeft') moveCollection(-1);
  if (event.key === 'ArrowRight') moveCollection(1);
});
