// --- 0. SETUP PLUGINS ---
gsap.registerPlugin(ScrollTrigger);

// --- 1. LENIS SMOOTH SCROLL ---
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    smooth: true,
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- 2. SPOTLIGHT MOUSE TRACKING ---
const allSpotlightGrids = document.querySelectorAll(".spotlight-grid");
allSpotlightGrids.forEach(grid => {
    const cards = grid.querySelectorAll(".spotlight-card");
    grid.addEventListener("mousemove", (e) => {
        cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });
});

// --- 3. SCROLL ENTRANCE ANIMATION ---
gsap.utils.toArray(".spotlight-grid").forEach(grid => {
    const cards = grid.querySelectorAll(".spotlight-card");
    gsap.from(cards, {
        scrollTrigger: {
            trigger: grid,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out"
    });
});

// --- 4. HERO ANIMATION ---
window.addEventListener("load", () => {
    const tl = gsap.timeline();
    tl.to(".hero-title .line-mask span", {
        y: 0, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.2
    })
    .to(".hero-subtitle", {
        opacity: 1, y: 0, duration: 1, ease: "power2.out"
    }, "-=0.8");
});

// --- 5. MENU ANIMATION ---
let isMenuOpen = false;
const menuOverlay = document.querySelector('.menu-overlay');
const menuBtn = document.querySelector('.menu-btn');
const menuTexts = document.querySelectorAll('.menu-link-text');

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        menuOverlay.classList.add('active');
        menuBtn.textContent = "Close";
        gsap.to(menuTexts, { y: 0, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.4 });
    } else {
        menuOverlay.classList.remove('active');
        menuBtn.textContent = "Menu";
        gsap.to(menuTexts, { y: "100%", duration: 0.5, ease: "power2.in" });
    }
}
function navTo(id) {
    toggleMenu();
    setTimeout(() => { lenis.scrollTo(id); }, 600);
}

// --- 6. MAGNETIC BUTTON ---
const magneticBtn = document.querySelector('.magnetic-btn');
if(magneticBtn) {
    magneticBtn.addEventListener('mousemove', (e) => {
        const rect = magneticBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(magneticBtn, { x: x / 5, y: y / 5, duration: 0.3, ease: "power2.out" });
    });
    magneticBtn.addEventListener('mouseleave', () => {
        gsap.to(magneticBtn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    });
}

// --- 7. PARTICLE BACKGROUND SYSTEM ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1; // Random size between 1 and 3
        this.speedY = Math.random() * 0.5 + 0.2; // Float speed
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.y -= this.speedY; // Move Up
        if (this.y < 0) {
            this.y = height;
            this.x = Math.random() * width;
        }
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 50; i++) { // Create 50 particles
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();