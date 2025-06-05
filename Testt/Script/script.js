const carousel = document.getElementById('carousel');
const cards = document.querySelectorAll('.card');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const carouselContainer = document.querySelector('.carousel-container');
const totalCards = cards.length;

let radius = 180;
let currentAngle = 0;
let autoRotateInterval = null;
const autoRotateDelay = 800;

function positionCards(animate = false) {
    cards.forEach((card, i) => {
        const angle = (i / totalCards) * 360 + currentAngle;
        const x = radius * Math.cos(angle * Math.PI / 180);
        const z = radius * Math.sin(angle * Math.PI / 180);
        if (animate) {
            gsap.to(card, {
                x: x,
                z: z,
                rotationY: -angle,
                transformOrigin: 'center center',
                duration: 0.8,
                ease: 'power2.inOut'
            });
        } else {
            gsap.set(card, {
                x: x,
                z: z,
                rotationY: -angle,
                transformOrigin: 'center center'
            });
        }
    });
}

// Animación de entrada
cards.forEach((card, i) => {
    gsap.from(card, {
        opacity: 0,
        scale: 0.5,
        y: 100,
        rotationX: 45,
        delay: i * 0.1,
        duration: 1,
        ease: 'power3.out'
    });
});
setTimeout(() => positionCards(false), 1500);

function updateCarousel(direction) {
    if (direction === 'next') {
        currentAngle -= 360 / totalCards;
    } else if (direction === 'prev') {
        currentAngle += 360 / totalCards;
    }
    positionCards(true);
}

function pauseAutoRotation(restart = false) {
    clearInterval(autoRotateInterval);
    if (restart) setTimeout(startAutoRotation, 3000);
}

function startAutoRotation() {
    clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(() => {
        updateCarousel('next');
    }, autoRotateDelay);
}

nextBtn.addEventListener('click', () => {
    pauseAutoRotation(true);
    updateCarousel('next');
});
prevBtn.addEventListener('click', () => {
    pauseAutoRotation(true);
    updateCarousel('prev');
});

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            scale: 1.1,
            z: '+=50',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            scale: 1,
            z: '-=50',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

function adjustRadius() {
    const newRadius = window.innerWidth <= 768 ? 300 : 400;
    if (newRadius !== radius) {
        radius = newRadius;
        positionCards(true);
    }
}
window.addEventListener('resize', adjustRadius);

startAutoRotation();

// Bloqueo de menú contextual y teclas de inspección
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') e.preventDefault();
    if (e.ctrlKey && e.shiftKey && e.key === 'I') e.preventDefault();
    if (e.ctrlKey && e.key === 'u') e.preventDefault();
});
