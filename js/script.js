// ========== MOBILE MENU ==========
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== CEK RADIUS ==========
const checkRadiusBtn = document.getElementById('checkRadiusBtn');
if (checkRadiusBtn) {
    checkRadiusBtn.addEventListener('click', () => {
        let distance = prompt('Masukkan perkiraan jarak dari stand (dalam KM):');
        if (distance === null) return;
        distance = parseFloat(distance);
        if (isNaN(distance)) {
            alert('Masukkan angka yang valid!');
            return;
        }
        if (distance <= 4) {
            alert('✅ Masih masuk radius antar (3-4 KM)! Lanjutkan order via WhatsApp ya!');
        } else {
            alert('❌ Maaf, jarak Anda di luar radius antar (maksimal 4 KM). Anda bisa ambil langsung di stand atau order via online lewat "Gehu Pedas".');
        }
    });
}

// ========== TESTIMONIAL SLIDER ==========
const track = document.getElementById('testiTrack');
const slides = document.querySelectorAll('.testi-card');
const prevBtn = document.getElementById('prevTesti');
const nextBtn = document.getElementById('nextTesti');
const dotsContainer = document.getElementById('testiDots');

let currentIndex = 0;
let slideInterval;

function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
}

if (slides.length > 0 && dotsContainer) {
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
            resetInterval();
        });
        dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
    nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    function resetInterval() {
        clearInterval(slideInterval);
        startAutoSlide();
    }
    startAutoSlide();
}

// ========== NAVBAR SHADOW ==========
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    }
});

// ========== SCROLL REVEAL ==========
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-row, .gallery-card, .testi-card, .location-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

window.addEventListener('load', () => {
    document.querySelectorAll('.feature-row, .gallery-card, .testi-card, .location-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
});

console.log('🍢 CILOK SAM TEJO - Website Modern Siap!');