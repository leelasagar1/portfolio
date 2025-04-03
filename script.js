// --- Mobile Menu Toggle --- 
const menuButton = document.querySelector('nav button[aria-label="Open Menu"]');
const mobileMenu = document.querySelector('nav .mobile-menu'); // Use class selector

if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = menuButton.querySelector('svg'); // Target SVG
        if (icon) {
            // Swap SVGs (Heroicons: bars-3 / x-mark)
            const barsIconPath = "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5";
            const xMarkIconPath = "M6 18 18 6M6 6l12 12";
            const currentPath = icon.querySelector('path').getAttribute('d');
            icon.querySelector('path').setAttribute('d', currentPath === barsIconPath ? xMarkIconPath : barsIconPath);
        }
    });
    // Close menu when a link is clicked
     mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
             mobileMenu.classList.add('hidden');
             const icon = menuButton.querySelector('svg');
             if (icon) icon.querySelector('path').setAttribute('d', "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"); // Reset to bars icon
        });
    });
} else {
    console.error("Mobile menu button or menu itself not found.");
}

// --- Set current year in footer ---
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// --- Floating Particles Animation ---
const particleCanvas = document.getElementById('constellation-canvas'); // Keep same canvas ID
const particleHeader = document.querySelector('header');
let particleCtx;
let particles = [];
let particleHeaderWidth = particleHeader.offsetWidth;
let particleHeaderHeight = particleHeader.offsetHeight;

// Particle properties
const particleCount = 50; // Adjust density
const minSpeed = 0.1;
const maxSpeed = 0.5;
const minSize = 1;
const maxSize = 4;
const particleColor = '#22d3ee'; // Use primary color (cyan-400 from config)

function hexToRgbP(hex) { // Renamed to avoid conflict if previous function exists
  let r = 0, g = 0, b = 0;
  if (hex.length == 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  else if (hex.length == 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return { r, g, b };
}
const particleRgb = hexToRgbP(particleColor);

function setupParticleCanvas() {
    if (!particleCanvas || !particleHeader) return;
    particleCtx = particleCanvas.getContext('2d');
    particleHeaderWidth = particleHeader.offsetWidth;
    particleHeaderHeight = particleHeader.offsetHeight;
    particleCanvas.width = particleHeaderWidth;
    particleCanvas.height = particleHeaderHeight;

    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(true)); // Create initial particles
    }
}

function createParticle(initial = false) {
    const size = minSize + Math.random() * (maxSize - minSize);
    return {
        x: Math.random() * particleCanvas.width,
        y: initial ? Math.random() * particleCanvas.height : particleCanvas.height + size, // Start at bottom if not initial
        vy: -(minSpeed + Math.random() * (maxSpeed - minSpeed)), // Negative vy to move up
        size: size,
        opacity: Math.random() * 0.5 + 0.1 // Opacity range 0.1 - 0.6
    };
}

function drawParticles() {
    if (!particleCtx || !particles) return;

    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update position
        p.y += p.vy;

        // Remove particle if it goes off screen top, create a new one at the bottom
        if (p.y < -p.size) {
            particles.splice(i, 1); // Remove particle
            particles.push(createParticle()); // Add a new one at the bottom
            continue; // Skip drawing this frame
        }

        // Draw the particle
        particleCtx.beginPath();
        particleCtx.fillStyle = `rgba(${particleRgb.r}, ${particleRgb.g}, ${particleRgb.b}, ${p.opacity})`;
        particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        particleCtx.fill();
    }
    
    // Ensure particle count stays consistent
    while(particles.length < particleCount){
         particles.push(createParticle());
    }

    requestAnimationFrame(drawParticles);
}

// Initialize and run
if (particleCanvas && particleHeader) {
    setupParticleCanvas();
    drawParticles();

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setupParticleCanvas, 300);
    });
} else {
    console.error("Particle canvas or header not found.");
}

console.log("Portfolio scripts loaded."); 
console.log("Portfolio scripts loaded."); 