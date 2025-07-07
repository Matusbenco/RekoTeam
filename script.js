document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // ===== ZÁKLADNÁ LOGIKA (MENU, FORMULÁR) =====
    // =================================================================
    
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

    // =================================================================
    // ===== JEDNODUCHÁ LOGIKA PRE SLIDER SLUŽIEB (BEZ CYKLENIA) =====
    // =================================================================
    const servicesSection = document.getElementById('sluzby');
    if (servicesSection) {
        const sliderTrack = servicesSection.querySelector('.services-grid');
        const prevBtn = servicesSection.querySelector('#services-slide-left');
        const nextBtn = servicesSection.querySelector('#services-slide-right');
        
        let currentIndex = 0;

        const updateServicesSlider = () => {
            const items = sliderTrack.children;
            if (items.length === 0) return;

            const itemWidth = items[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(sliderTrack).gap);
            const slideWidth = itemWidth + gap;

            sliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            prevBtn.disabled = currentIndex === 0;
            const itemsThatFit = Math.floor(sliderTrack.parentElement.clientWidth / slideWidth);
            nextBtn.disabled = currentIndex >= items.length - itemsThatFit;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateServicesSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateServicesSlider();
        });

        window.addEventListener('resize', () => {
            currentIndex = 0;
            updateServicesSlider();
        });
        setTimeout(updateServicesSlider, 150); // Mierne oneskorenie pre istotu
    }


    // =================================================================
    // ===== UPRAVENÁ LOGIKA PRE SLIDER GALÉRIE (S CYKLENÍM) =====
    // =================================================================
    const gallerySection = document.getElementById('projekty');
    if (gallerySection) {
        const sliderTrack = gallerySection.querySelector('.gallery-grid');
        const prevBtn = gallerySection.querySelector('#gallery-slide-left');
        const nextBtn = gallerySection.querySelector('#gallery-slide-right');
        const filterButtons = gallerySection.querySelectorAll('.filter-button');
        
        let galleryCurrentIndex = 0;

        const getVisibleItems = () => Array.from(sliderTrack.children).filter(item => item.style.display !== 'none');

        const updateGallerySlider = () => {
            const visibleItems = getVisibleItems();
            if (visibleItems.length === 0) return;

            const itemWidth = visibleItems[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(sliderTrack).gap);
            const slideWidth = itemWidth + gap;

            sliderTrack.style.transform = `translateX(-${galleryCurrentIndex * slideWidth}px)`;
        };

        const getItemsThatFitGallery = () => {
            const visibleItems = getVisibleItems();
            if (visibleItems.length === 0) return 1;
            const itemWidth = visibleItems[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(sliderTrack).gap);
            return Math.max(1, Math.floor(sliderTrack.parentElement.clientWidth / (itemWidth + gap)));
        };
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                Array.from(sliderTrack.children).forEach(item => {
                    const category = item.getAttribute('data-category');
                    item.style.display = (filter === 'all' || item.getAttribute('data-category') === filter) ? 'flex' : 'none';
                });
                
                galleryCurrentIndex = 0;
                updateGallerySlider();
            });
        });

        nextBtn.addEventListener('click', () => {
            const visibleItems = getVisibleItems();
            const itemsThatFit = getItemsThatFitGallery();
            
            // Ak sme na poslednej stránke, preskočíme na začiatok
            if (galleryCurrentIndex >= visibleItems.length - itemsThatFit) {
                galleryCurrentIndex = 0;
            } else {
                galleryCurrentIndex++;
            }
            updateGallerySlider();
        });

        prevBtn.addEventListener('click', () => {
            const visibleItems = getVisibleItems();
            const itemsThatFit = getItemsThatFitGallery();

            // Ak sme na začiatku, preskočíme na koniec
            if (galleryCurrentIndex === 0) {
                galleryCurrentIndex = visibleItems.length - itemsThatFit;
                if(galleryCurrentIndex < 0) galleryCurrentIndex = 0; // Ošetrenie pre prípad menšieho počtu položiek
            } else {
                galleryCurrentIndex--;
            }
            updateGallerySlider();
        });

        window.addEventListener('resize', () => {
            galleryCurrentIndex = 0;
            updateGallerySlider();
        });
        setTimeout(updateGallerySlider, 150);
    }
});