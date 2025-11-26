// Configuration object
const defaultConfig = {
    clinic_name: "RAIS Atención Integral en Salud",
    hero_title_es: "Atención Integral en Salud",
    hero_title_en: "Integrated Health Care",
    hero_subtitle_es: "Somos tu servicio de salud integral humano y resolutivo",
    hero_subtitle_en: "We are your comprehensive, compassionate, and efficient health care service.",
};

// Current language
let currentLanguage = 'es';

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const pages = document.querySelectorAll('.page');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            pages.forEach(page => page.classList.remove('active'));
            const targetElement = document.getElementById(targetPage + '-page');
            if (targetElement) {
                targetElement.classList.add('active');
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
            }
            navMenu.classList.remove('active');
        });
    });

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Language switching
function switchLanguage(lang) {
    currentLanguage = lang;
    const elements = document.querySelectorAll('[data-es][data-en]');
    elements.forEach(element => {
        const text = element.getAttribute('data-' + lang);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else if (element.tagName === 'OPTION') {
                element.textContent = text;
            } else {
                element.innerHTML = text;
            }
        }
    });
    updateHeroContent();
}

// Update hero content from config
function updateHeroContent() {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroTitle && heroSubtitle) {
        const titleKey = `hero_title_${currentLanguage}`;
        const subtitleKey = `hero_subtitle_${currentLanguage}`;
        heroTitle.textContent = window.elementSdk?.config?.[titleKey] || defaultConfig[titleKey];
        heroSubtitle.textContent = window.elementSdk?.config?.[subtitleKey] || defaultConfig[subtitleKey];
    }
}

// Carrusel del hero
function startHeroBackgroundCarousel() {
    const backgrounds = document.querySelectorAll('.hero-bg');
    let currentIndex = 0;
    function showNext() {
        backgrounds.forEach((bg, index) => {
            bg.classList.toggle('active', index === currentIndex);
        });
        currentIndex = (currentIndex + 1) % backgrounds.length;
    }
    if (backgrounds.length > 0) {
        backgrounds[0].classList.add('active');
    }
    setInterval(showNext, 6000);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    startHeroBackgroundCarousel();
    if (window.elementSdk) {
        window.elementSdk.init({
            defaultConfig,
            onConfigChange: (config) => {
                updateHeroContent();
            },
            mapToCapabilities: (config) => ({
                recolorables: [
                    { get: () => config.primary_color || '#bfc52c', set: (value) => { if (window.elementSdk) window.elementSdk.setConfig({ primary_color: value }); } },
                    { get: () => config.secondary_color || '#06919d', set: (value) => { if (window.elementSdk) window.elementSdk.setConfig({ secondary_color: value }); } },
                ],
                fontEditable: { get: () => 'Poppins', set: () => {} },
            }),
            mapToEditPanelValues: (config) => new Map(),
        });
    }
});