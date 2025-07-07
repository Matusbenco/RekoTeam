document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // ===== UNIVERZÁLNA FUNKCIA PRE INICIALIZÁCIU SLIDERA (s nekonečným cyklom) =====
    // =================================================================
    const initializeSlider = (sectionId, isGallery) => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const sliderContainer = section.querySelector('.slider-container');
        const sliderTrack = section.querySelector('.slider-container > div');
        const prevBtn = section.querySelector('.slide-button[id*="-left"]');
        const nextBtn = section.querySelector('.slide-button[id*="-right"]');
        
        if (!sliderContainer || !sliderTrack || !prevBtn || !nextBtn) return;

        let currentIndex = 0;

        const updateSlider = () => {
            const items = isGallery ? sliderTrack.querySelectorAll('.gallery-item:not([style*="display: none"])') : sliderTrack.children;
            if (items.length === 0) return;

            const firstItem = items[0];
            const style = window.getComputedStyle(sliderTrack);
            const gap = parseFloat(style.gap) || 0;
            const slideWidth = firstItem.offsetWidth + gap;

            sliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        };

        const getItemsThatFit = () => {
            const firstItem = sliderTrack.querySelector('.service-card, .gallery-item');
            if (!firstItem) return 1;
            const itemWidth = firstItem.offsetWidth;
            const style = window.getComputedStyle(sliderTrack);
            const gap = parseFloat(style.gap) || 0;
            return Math.max(1, Math.floor(sliderContainer.clientWidth / (itemWidth + gap)));
        };

        nextBtn.addEventListener('click', () => {
            const items = isGallery ? sliderTrack.querySelectorAll('.gallery-item:not([style*="display: none"])') : sliderTrack.children;
            const itemsThatFit = getItemsThatFit();
            
            if (currentIndex >= items.length - itemsThatFit) {
                currentIndex = 0; // Z konca na začiatok
            } else {
                currentIndex++;
            }
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            const items = isGallery ? sliderTrack.querySelectorAll('.gallery-item:not([style*="display: none"])') : sliderTrack.children;
            const itemsThatFit = getItemsThatFit();

            if (currentIndex === 0) {
                currentIndex = items.length - itemsThatFit; // Zo začiatku na koniec
                // Musíme ošetriť prípad, ak je menej položiek, ako sa zmestí na obrazovku
                if (currentIndex < 0) currentIndex = 0;
            } else {
                currentIndex--;
            }
            updateSlider();
        });

        // Počiatočná a responzívna inicializácia
        setTimeout(() => updateSlider(), 100);
        window.addEventListener('resize', () => {
            currentIndex = 0;
            updateSlider();
        });
    };

    // =================================================================
    // ===== INICIALIZÁCIA JEDNOTLIVÝCH SLIDEROV =====
    // =================================================================

    // Inicializácia slidera pre služby
    initializeSlider('sluzby', false);
    
    // Inicializácia slidera pre galériu (projekty)
    initializeSlider('projekty', true);


    // =================================================================
    // ===== ZVYŠNÁ LOGIKA (MENU, FORMULÁR, FILTRE) =====
    // =================================================================
    
    // Elementy pre ostatné funkcie
    const navLinks = document.querySelectorAll('.navigation a[href^="#"]');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navigation = document.querySelector('.navigation');
    const header = document.querySelector('.header');
    const modalOverlay = document.getElementById('contact-modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const openModalBtns = [
        document.getElementById('open-modal-btn-hero'),
        document.querySelector('.cta-button-secondary')
    ];
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-button');

    // Mobilné Menu (Hamburger)
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            navigation.classList.toggle('active');
            hamburgerMenu.classList.toggle('open');
        });
    }

    // Plynulé rolovanie (Smooth Scroll) & Zatváranie menu
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (navigation.classList.contains('active')) {
                navigation.classList.remove('active');
                hamburgerMenu.classList.remove('open');
            }
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    // Logika filtrovania pre galériu
    if (filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    // Namiesto display:none, ktoré odstraňuje prvok z DOMu pre výpočty, použijeme radšej viditeľnosť
                    item.style.display = (filter === 'all' || filter === category) ? 'flex' : 'none';
                });
                // Po filtrovaní prepočítame slider galérie
                initializeSlider('projekty', true);
            });
        });
    }

    // Logika pre Modálne Okno
    const openModal = () => { if(modalOverlay) modalOverlay.classList.add('visible'); }
    const closeModal = () => { if(modalOverlay) modalOverlay.classList.remove('visible'); }
    openModalBtns.forEach(btn => { if (btn) btn.addEventListener('click', openModal); });
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
});