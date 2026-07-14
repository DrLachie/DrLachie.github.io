// Main JavaScript for Lachlan Whitehead's Portfolio Site

// ====================
// State Management
// ====================
let siteData = null;

// ====================
// Initialize on DOM Load
// ====================
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    initializeNavigation();
    initializeScrollEffects();
    setCurrentYear();
    detectActivePage();
});

// ====================
// Detect Active Page
// ====================
function detectActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ====================
// Content Loading
// ====================
async function loadContent() {
    try {
        const response = await fetch('data/content.json');
        if (!response.ok) throw new Error('Failed to load content');

        siteData = await response.json();

        populateHero();
        populateAbout();
        populateModules();
        populateContact();
    } catch (error) {
        console.error('Error loading content:', error);
        showError('Failed to load content. Please refresh the page.');
    }
}

// ====================
// Hero Section
// ====================
function populateHero() {
    if (!siteData?.hero) return;

    const heroName = document.getElementById('heroName');
    if (!heroName) return; // Not on home page

    const { name, title, tagline, subtitle, image } = siteData.hero;

    document.getElementById('heroName').textContent = name;
    document.getElementById('heroTitle').textContent = title;
    document.getElementById('heroTagline').textContent = tagline;
    document.getElementById('heroSubtitle').textContent = subtitle;

    // Load hero image if provided
    const heroImageContainer = document.getElementById('heroImage');
    if (image && imageExists(image)) {
        const img = document.createElement('img');
        img.src = image;
        img.alt = name;
        heroImageContainer.innerHTML = '';
        heroImageContainer.appendChild(img);
    }
}

// ====================
// About Section
// ====================
function populateAbout() {
    if (!siteData?.about) return;

    const aboutContent = document.getElementById('aboutContent');
    if (!aboutContent) return; // Not on home page

    const { paragraphs } = siteData.about;

    aboutContent.innerHTML = paragraphs
        .map(p => `<p>${p}</p>`)
        .join('');
}

// ====================
// Modules System
// ====================
function populateModules() {
    if (!siteData?.modules) return;

    // Populate research modules
    const researchContainer = document.getElementById('researchModulesContainer');
    if (researchContainer && siteData.modules.research) {
        researchContainer.innerHTML = '';
        const enabledResearch = siteData.modules.research.filter(m => m.enabled);
        enabledResearch.forEach((module, index) => {
            const moduleElement = createModule(module);
            if (moduleElement) {
                moduleElement.style.animationDelay = `${index * 0.1}s`;
                researchContainer.appendChild(moduleElement);
            }
        });
    }

    // Populate creative modules
    const creativeContainer = document.getElementById('creativeModulesContainer');
    if (creativeContainer && siteData.modules.creative) {
        creativeContainer.innerHTML = '';
        const enabledCreative = siteData.modules.creative.filter(m => m.enabled);
        enabledCreative.forEach((module, index) => {
            const moduleElement = createModule(module);
            if (moduleElement) {
                moduleElement.style.animationDelay = `${index * 0.1}s`;
                creativeContainer.appendChild(moduleElement);
            }
        });
    }

    // Populate visual abstracts page
    const visualAbstractsContainer = document.getElementById('visualAbstractsContainer');
    if (visualAbstractsContainer && siteData.modules.creative) {
        const animationsModule = siteData.modules.creative.find(m => m.id === 'animations' && m.enabled);
        if (animationsModule) {
            const moduleElement = createModule(animationsModule);
            if (moduleElement) visualAbstractsContainer.appendChild(moduleElement);
        }
    }

    // Populate photography page
    const photographyContainer = document.getElementById('photographyContainer');
    if (photographyContainer && siteData.modules.creative) {
        const photographyModule = siteData.modules.creative.find(m => m.id === 'gallery-photography' && m.enabled);
        if (photographyModule) {
            const moduleElement = createModule(photographyModule);
            if (moduleElement) photographyContainer.appendChild(moduleElement);
        }
    }
}

function createModule(module) {
    const wrapper = document.createElement('div');
    wrapper.className = `module module-${module.type}`;
    wrapper.id = module.id;

    let content = '';

    switch (module.type) {
        case 'publications':
            content = createPublicationsModule(module);
            break;
        case 'gallery':
            content = createGalleryModule(module);
            break;
        case 'text':
            content = createTextModule(module);
            break;
        default:
            console.warn(`Unknown module type: ${module.type}`);
            return null;
    }

    wrapper.innerHTML = `
        <div class="module-inner">
            <div class="container">
                ${content}
            </div>
        </div>
    `;

    // Add click handlers for gallery items with links
    const galleryItems = wrapper.querySelectorAll('.gallery-item.has-link');
    galleryItems.forEach(item => {
        const url = item.getAttribute('data-url');
        if (url) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                window.open(url, '_blank');
            });
        }
    });

    // Add click handlers for plain gallery items to open the lightbox
    const expandableItems = wrapper.querySelectorAll('.gallery-item.expandable');
    expandableItems.forEach(item => {
        item.addEventListener('click', () => {
            openLightbox(item.getAttribute('data-full'), item.getAttribute('data-caption'));
        });
    });

    return wrapper;
}

// ====================
// Publications Module
// ====================
function createPublicationsModule(module) {
    const { heading, description, stats, featured, viewAllLink } = module;

    const statsHTML = stats ? `
        <div class="publications-stats">
            <div class="stat-item">
                <span class="stat-number">${stats.total}</span>
                <span class="stat-label">Publications</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${stats.citations}</span>
                <span class="stat-label">Citations</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${stats.hIndex}</span>
                <span class="stat-label">h-index</span>
            </div>
        </div>
        <p style="text-align: center; color: var(--color-text-lighter); font-size: 0.875rem; margin-bottom: 2rem;">
            As of ${stats.asOf}
        </p>
    ` : '';

    const publicationsHTML = featured
        .map(pub => `
            <div class="publication-item">
                <div class="publication-year">${pub.year}</div>
                <div class="publication-title">${pub.title}</div>
                <div class="publication-authors">${pub.authors}</div>
                <div class="publication-journal">${pub.journal}</div>
            </div>
        `)
        .join('');

    const viewAllHTML = viewAllLink ? `
        <div style="text-align: center; margin-top: 2rem;">
            <a href="${viewAllLink}" class="view-all-link" target="_blank" rel="noopener noreferrer">
                View All Publications →
            </a>
        </div>
    ` : '';

    return `
        <div class="module-header">
            <h2 class="module-heading">${heading}</h2>
            ${description ? `<p class="module-description">${description}</p>` : ''}
        </div>
        ${statsHTML}
        <div class="publications-list">
            ${publicationsHTML}
        </div>
        ${viewAllHTML}
    `;
}

// ====================
// Gallery Module
// ====================
function createGalleryModule(module) {
    const { heading, description, layout, images, note } = module;

    if (!images || images.length === 0) {
        return `
            <div class="module-header">
                <h2 class="module-heading">${heading}</h2>
                ${description ? `<p class="module-description">${description}</p>` : ''}
            </div>
            <div class="empty-state">
                <div class="empty-state-icon">📷</div>
                <p class="empty-state-text">Gallery coming soon...</p>
            </div>
        `;
    }

    const imagesHTML = images
        .map(img => {
            const hasLink = img.sourceUrl || img.externalUrl;
            const linkUrl = img.sourceUrl || img.externalUrl;
            const linkText = img.linkText || 'View Publication';
            const caption = img.caption || '';

            return `
                <div class="gallery-item ${hasLink ? 'has-link' : 'expandable'}" ${hasLink ? `data-url="${linkUrl}"` : `data-full="${img.src}" data-caption="${caption.replace(/"/g, '&quot;')}"`}>
                    <img src="${img.src}" alt="${img.alt}" loading="lazy">
                    ${hasLink ? `<div class="link-overlay"><span class="link-icon">→</span><span class="link-text">${linkText}</span></div>` : `<span class="expand-icon">⤢</span>`}
                    ${caption ? `<div class="gallery-caption">${caption}</div>` : ''}
                </div>
            `;
        })
        .join('');

    const noteHTML = note ? `<p class="module-note">${note}</p>` : '';

    return `
        <div class="module-header">
            <h2 class="module-heading">${heading}</h2>
            ${description ? `<p class="module-description">${description}</p>` : ''}
        </div>
        <div class="gallery-grid layout-${layout || 'grid'}">
            ${imagesHTML}
        </div>
        ${noteHTML}
    `;
}

// ====================
// Lightbox
// ====================
function ensureLightbox() {
    if (document.getElementById('lightboxOverlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.id = 'lightboxOverlay';
    overlay.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <img id="lightboxImage" src="" alt="">
            <div class="lightbox-caption" id="lightboxCaption"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

function openLightbox(src, caption) {
    ensureLightbox();
    const overlay = document.getElementById('lightboxOverlay');
    const image = document.getElementById('lightboxImage');
    const captionEl = document.getElementById('lightboxCaption');

    image.src = src;
    image.alt = caption || '';
    captionEl.textContent = caption || '';
    overlay.classList.add('active');
}

function closeLightbox() {
    const overlay = document.getElementById('lightboxOverlay');
    if (overlay) overlay.classList.remove('active');
}

// ====================
// Text Module
// ====================
function createTextModule(module) {
    const { heading, content } = module;

    const contentHTML = Array.isArray(content)
        ? content.map(p => `<p>${p}</p>`).join('')
        : `<p>${content}</p>`;

    return `
        <div class="module-header">
            <h2 class="module-heading">${heading}</h2>
        </div>
        <div class="text-content">
            ${contentHTML}
        </div>
    `;
}

// ====================
// Contact Section
// ====================
function populateContact() {
    if (!siteData?.contact) return;

    const contactHeading = document.getElementById('contactHeading');
    const contactEmail = document.getElementById('contactEmail');
    const contactLinks = document.getElementById('contactLinks');

    // Only populate if elements exist (on home page)
    if (!contactHeading || !contactEmail || !contactLinks) return;

    const { heading, email, links } = siteData.contact;

    if (heading) {
        contactHeading.textContent = heading;
    }

    if (email) {
        contactEmail.href = `mailto:${email}`;
        contactEmail.textContent = email;
    }

    if (links && links.length > 0) {
        contactLinks.innerHTML = links
            .map(link => `
                <a href="${link.url}" class="contact-link" target="_blank" rel="noopener noreferrer">
                    ${link.label}
                </a>
            `)
            .join('');
    }
}

// ====================
// Navigation
// ====================
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close menu on link click (for mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle?.classList.remove('active');
        });
    });
}

// ====================
// Scroll Effects
// ====================
function initializeScrollEffects() {
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Hide/show navigation on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;

        // Fade in modules on scroll
        observeModules();
    });

    // Initial check for modules in view
    observeModules();
}

function observeModules() {
    const modules = document.querySelectorAll('.module');

    modules.forEach(module => {
        const rect = module.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;

        if (isVisible) {
            module.style.opacity = '1';
            module.style.transform = 'translateY(0)';
        }
    });
}

// ====================
// Utility Functions
// ====================
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function imageExists(src) {
    // Simple check - in production, you might want to actually verify the image loads
    return src && src.length > 0;
}

function showError(message) {
    const container = document.getElementById('modulesContainer');
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p class="empty-state-text">${message}</p>
            </div>
        `;
    }
}

// ====================
// Export for potential module usage
// ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadContent,
        populateHero,
        populateAbout,
        populateModules,
        populateContact
    };
}
