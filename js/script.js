// Comportamientos de ScrollSpy, Navbar y Botón Ir Arriba
const sections = document.querySelectorAll('div[id]');
const navItems = document.querySelectorAll('.navbar-nav .nav-link');
const navbar = document.getElementById('navbar');
const upButton = document.getElementById('up');
const navbarCollapse = document.getElementById('navbarSupportedContent');
const toggler = document.getElementById('navbar-toggler');

// Cierra el menú en móvil al hacer clic en un enlace
navItems.forEach(link => {
    link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
            toggler.click();
        }
    });
});

// Función ScrollSpy para actualizar el recuadro blanco de navegación
function scrollSpy() {
    let scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Lógica del Indicador de Desplazamiento
const scrollIndicator = document.getElementById('scroll-indicator');
let indicatorDismissed = false;

setTimeout(() => {
    if (window.scrollY < 50 && !indicatorDismissed && scrollIndicator) {
        scrollIndicator.classList.add('visible');
    }
}, 2000);

// Eventos al hacer scroll
window.addEventListener('scroll', () => {
    scrollSpy();
    
    // Ocultar indicador si el usuario se desplaza hacia abajo
    if (window.scrollY > 50 && scrollIndicator) {
        scrollIndicator.classList.remove('visible');
        indicatorDismissed = true;
    }
    
    // Cambiar estilo de navbar al hacer scroll hacia abajo
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Mostrar/ocultar botón de subir
    if (window.scrollY > 400) {
        upButton.classList.add('show');
    } else {
        upButton.classList.remove('show');
    }
});

// Inicializador de carrusel Coverflow 3D cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.coverflow-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.coverflow-dots');
    
    if (slides.length === 0) return;
    
    let activeIndex = 0;
    
    // Generación dinámica de puntos (dots)
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('coverflow-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            activeIndex = idx;
            updateSlides();
        });
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.coverflow-dot');
    
    // Renderización del estado 3D de las tarjetas
    function updateSlides() {
        slides.forEach((slide, idx) => {
            const offset = idx - activeIndex;
            
            if (offset === 0) {
                slide.style.transform = 'translateX(0) scale(1) rotateY(0deg) translateZ(0)';
                slide.style.zIndex = '10';
                slide.style.opacity = '1';
                slide.style.pointerEvents = 'auto';
            } else if (offset === 1) {
                slide.style.transform = 'translateX(130px) scale(0.85) rotateY(-35deg) translateZ(-100px)';
                slide.style.zIndex = '5';
                slide.style.opacity = '0.75';
                slide.style.pointerEvents = 'auto';
            } else if (offset === -1) {
                slide.style.transform = 'translateX(-130px) scale(0.85) rotateY(35deg) translateZ(-100px)';
                slide.style.zIndex = '5';
                slide.style.opacity = '0.75';
                slide.style.pointerEvents = 'auto';
            } else if (offset > 1) {
                slide.style.transform = 'translateX(260px) scale(0.7) rotateY(-35deg) translateZ(-200px)';
                slide.style.zIndex = '1';
                slide.style.opacity = '0';
                slide.style.pointerEvents = 'none';
            } else if (offset < -1) {
                slide.style.transform = 'translateX(-260px) scale(0.7) rotateY(35deg) translateZ(-200px)';
                slide.style.zIndex = '1';
                slide.style.opacity = '0';
                slide.style.pointerEvents = 'none';
            }
        });
        
        // Actualizar estados activos de los puntos
        dots.forEach((dot, idx) => {
            if (idx === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Centrar tarjeta al hacer clic directo
    slides.forEach((slide, idx) => {
        slide.addEventListener('click', () => {
            if (idx !== activeIndex) {
                activeIndex = idx;
                updateSlides();
            }
        });
    });
    
    // Controles de flecha previa
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            activeIndex = (activeIndex - 1 + slides.length) % slides.length;
            updateSlides();
        });
    }
    
    // Controles de flecha siguiente
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            activeIndex = (activeIndex + 1) % slides.length;
            updateSlides();
        });
    }
    
    // Soporte para gestos táctiles (Swipe), arrastre de mouse (Touchpad drag) y scroll de rueda (Touchpad swipe)
    let startX = 0;
    let isDragging = false;
    let wheelAccumulator = 0;
    let wheelCooldown = false;
    const coverflowContainer = document.querySelector('.coverflow-container');
    
    if (coverflowContainer) {
        // 1. Gesto Táctil (Móvil)
        coverflowContainer.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        coverflowContainer.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].screenX;
            handleSwipeOrDrag(startX - endX);
        }, { passive: true });

        // 2. Arrastre de Mouse / Touchpad (Laptops)
        coverflowContainer.addEventListener('mousedown', (e) => {
            startX = e.screenX;
            isDragging = true;
            coverflowContainer.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const currentX = e.screenX;
            const diffX = startX - currentX;
            if (Math.abs(diffX) > 80) {
                handleSwipeOrDrag(diffX);
                isDragging = false;
                coverflowContainer.style.cursor = 'grab';
            }
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                coverflowContainer.style.cursor = 'grab';
            }
        });
        
        coverflowContainer.style.cursor = 'grab';

        // 3. Desplazamiento horizontal por trackpad (Wheel event)
        coverflowContainer.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                
                if (wheelCooldown) return;
                
                wheelAccumulator += e.deltaX;
                
                if (Math.abs(wheelAccumulator) > 50) {
                    if (wheelAccumulator > 0) {
                        activeIndex = (activeIndex + 1) % slides.length;
                    } else {
                        activeIndex = (activeIndex - 1 + slides.length) % slides.length;
                    }
                    updateSlides();
                    
                    wheelAccumulator = 0;
                    wheelCooldown = true;
                    setTimeout(() => { wheelCooldown = false; }, 400);
                }
            }
        }, { passive: false });
    }
    
    function handleSwipeOrDrag(diffX) {
        const threshold = 50;
        if (diffX > threshold) {
            activeIndex = (activeIndex + 1) % slides.length;
            updateSlides();
        } else if (diffX < -threshold) {
            activeIndex = (activeIndex - 1 + slides.length) % slides.length;
            updateSlides();
        }
    }
    
    // Renderización inicial
    updateSlides();
});