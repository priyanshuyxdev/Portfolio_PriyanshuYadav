// ──────────────────────────────────────────
// 0. COPY TO CLIPBOARD + TOAST
// ──────────────────────────────────────────
const toast = document.getElementById('copyToast');
let toastTimer = null;

function copyText(event, text, message) {
  event.preventDefault();
  event.stopPropagation();
  navigator.clipboard.writeText(text).then(() => {
    toast.textContent = '✓  ' + message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }).catch(() => {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    toast.textContent = '✓  ' + message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  });
}

// ──────────────────────────────────────────
// 1. LOADER
// ──────────────────────────────────────────
function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader || loader.classList.contains('hidden')) return;
  loader.classList.add('hidden');
  document.body.style.overflow = 'auto';
  initReveal();
}

// Fire after DOM is ready (doesn't wait for fonts/images)
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden';
  setTimeout(hideLoader, 1600);
});

// Hard fallback — always hide by 3s no matter what
setTimeout(hideLoader, 3000);

// ──────────────────────────────────────────
// 2. CUSTOM CURSOR
// ──────────────────────────────────────────
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function animateCursor() {
  // Dot follows instantly
  dotX += (mouseX - dotX) * 0.92;
  dotY += (mouseY - dotY) * 0.92;
  // Ring lags slightly
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;

  dot.style.left = dotX + 'px';
  dot.style.top = dotY + 'px';
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';

  requestAnimationFrame(animateCursor);
})();

// Hover effect on interactive elements
const hoverTargets = 'a, button, .project-card, .cert-card, .skill-tag-card, input, textarea, .social-btn, .nav-link, .btn';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});
document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  dot.style.opacity = '0';
  ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  dot.style.opacity = '1';
  ring.style.opacity = '1';
});

// ──────────────────────────────────────────
// 3. NAVBAR SCROLL EFFECT
// ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
const scrollProgressBar = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNavLink();

  // Scroll progress bar
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgressBar.style.width = pct + '%';
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('.nav-link').forEach(l => l.style.color = '');
      link.style.color = 'var(--accent-cyan)';
    }
  });
}

// ──────────────────────────────────────────
// 4. MOBILE HAMBURGER
// ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.children[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  hamburger.children[1].style.opacity = isOpen ? '0' : '1';
  hamburger.children[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.children[0].style.transform = '';
    hamburger.children[1].style.opacity = '1';
    hamburger.children[2].style.transform = '';
  });
});

// ──────────────────────────────────────────
// 5. TYPED TEXT ANIMATION
// ──────────────────────────────────────────
const phrases = [
  'Data Analyst',
  'Power BI Developer',
  'SQL Enthusiast',
  'Dashboard Storyteller',
  'Python Data Wrangler',
];

let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typed = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    charIdx--;
    typed.textContent = current.substring(0, charIdx);
  } else {
    charIdx++;
    typed.textContent = current.substring(0, charIdx);
  }

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIdx === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(type, delay);
}
type();

// ──────────────────────────────────────────
// 6. PARTICLE CANVAS
// ──────────────────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 60;
const particles = [];

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x = Math.random() * canvas.width;
    this.y = init ? Math.random() * canvas.height : canvas.height + 10;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -Math.random() * 0.4 - 0.1;
    this.radius = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    const colors = ['79,142,247', '34,211,238', '167,139,250'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

// Draw subtle connecting lines
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(79,142,247,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ──────────────────────────────────────────
// 7. SCROLL REVEAL
// ──────────────────────────────────────────
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  // Skill bar observer
  const skillBars = document.querySelectorAll('.skill-item');
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-bar-fill');
        const pct = entry.target.dataset.pct + '%';
        fill.style.width = pct;
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(el => skillObs.observe(el));

  // ── Skill tag card stagger reveal ──────────────────────
  const skillGroups = document.querySelectorAll('.skills-group');
  const cardGroupObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.skill-tag-card');
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.animationDelay = '0ms';
            card.classList.add('card-visible');
          }, i * 70);
        });
        cardGroupObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  skillGroups.forEach(g => cardGroupObs.observe(g));

  // CGPA bar
  const cgpaFills = document.querySelectorAll('.cgpa-fill');
  const cgpaObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.width || '70%';
        cgpaObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  cgpaFills.forEach(el => cgpaObs.observe(el));
}

// ──────────────────────────────────────────
// 8. SMOOTH PARALLAX (hero grid)
// ──────────────────────────────────────────
const heroGrid = document.querySelector('.hero-grid');
window.addEventListener('scroll', () => {
  if (!heroGrid) return;
  const scrollY = window.scrollY;
  heroGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
});

// ──────────────────────────────────────────
// 9. CONTACT FORM
// ──────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const note = document.getElementById('formNote');
  const span = btn.querySelector('span');

  btn.disabled = true;
  span.textContent = 'Sending…';

  // Simulate async send (replace with actual backend/EmailJS if desired)
  setTimeout(() => {
    btn.disabled = false;
    span.textContent = 'Send Message';
    note.textContent = "✅ Message sent! I'll get back to you soon.";
    note.style.color = 'var(--accent-cyan)';
    document.getElementById('contactForm').reset();
    setTimeout(() => { note.textContent = ''; }, 5000);
  }, 1800);
}

// ──────────────────────────────────────────
// 10. COUNTER ANIMATION (hero stats)
// ──────────────────────────────────────────
function animateCounter(el, target, prefix = '', suffix = '') {
  let current = 0;
  const step = target / 60;
  const tick = () => {
    current += step;
    if (current >= target) {
      el.textContent = prefix + target.toLocaleString() + suffix;
      return;
    }
    el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    requestAnimationFrame(tick);
  };
  tick();
}

// Trigger counters when hero stats come into view
const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const stats = statsEl.querySelectorAll('.stat-num');
      // [3+, $233K+, 3900+]
      const data = [
        { el: stats[0], val: 3, prefix: '', suffix: '+' },
        { el: stats[1], val: 233, prefix: '$', suffix: 'K+' },
        { el: stats[2], val: 3900, prefix: '', suffix: '+' },
      ];
      data.forEach(({ el, val, prefix, suffix }) => animateCounter(el, val, prefix, suffix));
      statsObs.unobserve(statsEl);
    }
  }, { threshold: 0.5 });
  statsObs.observe(statsEl);
}

// ──────────────────────────────────────────
// 11. CARD TILT EFFECT (hover 3D subtle)
// ──────────────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -5;
    const rotY = ((x - cx) / cx) * 5;
    card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'border-color 0.35s ease, box-shadow 0.35s ease';
  });
});

// ──────────────────────────────────────────
// 12. BACK TO TOP
// ──────────────────────────────────────────
document.getElementById('backToTop').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
