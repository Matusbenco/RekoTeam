document.addEventListener('DOMContentLoaded', () => {

    // ===== Elementy =====
    const sliderContainer = document.querySelector('.slider-container');
    const galleryGrid = document.querySelector('.gallery-grid');
    const slideLeftBtn = document.getElementById('slide-left');
    const slideRightBtn = document.getElementById('slide-right');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-button');
    const navLinks = document.querySelectorAll('.navigation a[href^="#"]');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navigation = document.querySelector('.navigation');
    const header = document.querySelector('.header');

    let currentIndex = 0;

    // ===== Mobilné Menu (Hamburger) =====
    hamburgerMenu.addEventListener('click', () => {
        // Prepne triedu 'active' na navigácii (zobrazí/skryje menu)
        navigation.classList.toggle('active');
        // Prepne triedu 'open' na hamburger ikone (pre animáciu na X)
        hamburgerMenu.classList.toggle('open');
    });

    // ===== Plynulé rolovanie (Smooth Scroll) s korekciou na hlavičku =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Pri kliknutí na odkaz na mobile zatvoríme menu
            if (navigation.classList.contains('active')) {
                navigation.classList.remove('active');
                hamburgerMenu.classList.remove('open');
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = header.offsetHeight; // Dynamicky zistíme výšku hlavičky
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ===== Slider a Filtre =====
    const getItemsPerPage = () => {
        if (window.innerWidth <= 768) return 1;
        return 3;
    };

    const updateSlider = () => {
        if (!sliderContainer || !galleryGrid || !slideLeftBtn || !slideRightBtn) return;

        const itemsPerPage = getItemsPerPage();
        const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
        const totalVisibleItems = visibleItems.length;
        
        const slideWidth = sliderContainer.clientWidth / itemsPerPage;
        galleryGrid.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        slideLeftBtn.disabled = currentIndex === 0;
        slideRightBtn.disabled = currentIndex >= totalVisibleItems - itemsPerPage;
    };

    if (slideRightBtn) {
        slideRightBtn.addEventListener('click', () => {
            const itemsPerPage = getItemsPerPage();
            const totalVisibleItems = document.querySelectorAll('.gallery-item:not(.hidden)').length;
            if (currentIndex < totalVisibleItems - itemsPerPage) {
                currentIndex++;
                updateSlider();
            }
        });
    }
    
    if (slideLeftBtn) {
        slideLeftBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
    }
    
    if (filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
    
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || filter === category) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
                
                currentIndex = 0;
                updateSlider();
            });
        });
    }
    
    // ===== Inicializácia a Responzivita =====
    updateSlider();
    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateSlider();
    });
});