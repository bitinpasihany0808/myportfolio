/* ═══════════════════════════════════════
   JESSEPH MARIÑO — PREMIUM PORTFOLIO
   script.js
═══════════════════════════════════════ */

'use strict';

/* ─── 2. SCROLL PROGRESS BAR ─── */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ─── 3. NAVBAR SCROLL & ACTIVE NAV ─── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Scrolled style
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else                     navbar.classList.remove('scrolled');

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }, { passive: true });
})();

/* ─── 4. HAMBURGER MENU ─── */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

/* ─── 5. PARTICLE CANVAS BACKGROUND ─── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 60;
  const particles = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = rand(0, canvas.width);
      this.y  = rand(0, canvas.height);
      this.r  = rand(0.5, 2.5);
      this.vx = rand(-0.3, 0.3);
      this.vy = rand(-0.5, -0.1);
      this.a  = rand(0.1, 0.5);
      this.da = rand(0.002, 0.005) * (Math.random() > 0.5 ? 1 : -1);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.a += this.da;
      if (this.a <= 0.05 || this.a >= 0.6) this.da *= -1;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Draw lines between close particles
  function drawLines() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ─── 6. TYPING ANIMATION ─── */
(function initTyping() {
  const el    = document.getElementById('typingText');
  if (!el) return;

  const roles = [
    'Full Stack Developer',
    'PHP Developer',
    'UI/UX Designer',
    'IT Professional',
    'Node.js Developer',
    'Problem Solver',
  ];

  let roleIdx = 0, charIdx = 0, deleting = false;
  const TYPING_SPEED  = 80;
  const DELETING_SPEED = 45;
  const PAUSE_END     = 1800;
  const PAUSE_START   = 400;

  function type() {
    const current = roles[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, PAUSE_END);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        setTimeout(type, PAUSE_START);
        return;
      }
    }
    setTimeout(type, deleting ? DELETING_SPEED : TYPING_SPEED);
  }
  setTimeout(type, 800);
})();

/* ─── 7. SCROLL REVEAL ANIMATIONS ─── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = [...entry.target.parentElement.children]
          .filter(el => el.classList.contains('reveal-up') || el.classList.contains('reveal-left') || el.classList.contains('reveal-right'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 60}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();

/* ─── 8. STAT COUNTER ANIMATION ─── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let current  = 0;
      const step   = Math.ceil(target / 40);
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 35);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ─── 9. SKILL BAR ANIMATION ─── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill[data-width]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      setTimeout(() => {
        bar.style.width = bar.dataset.width + '%';
      }, 300);
      observer.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ─── 10. SKILLS TAB FILTER ─── */
(function initSkillTabs() {
  const tabs  = document.querySelectorAll('.skill-tab');
  const cards = document.querySelectorAll('.skill-card[data-category]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.tab;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          // Re-trigger bar animation for visible cards
          const bar = card.querySelector('.skill-fill');
          if (bar) {
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 100);
          }
        }
      });
    });
  });
})();

/* ─── 11. BACK TO TOP ─── */
(function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('visible');
    else                      btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─── 12. CONTACT FORM ─── */
(function initContactForm() {
  const form   = document.getElementById('contactForm');
  const toast  = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const submitText = document.getElementById('submitText');
  if (!form) return;

  form.addEventListener('submit', () => {
    submitText.textContent = 'Sending...';
    form.querySelectorAll('.form-input').forEach(input => input.disabled = true);
  });
})();

/* ─── 13. PREVIEW MODAL FOR CERTIFICATES AND PROJECTS ─── */
(function initPreviewModal() {
  const modal = document.getElementById('previewModal');
  const modalImg = document.getElementById('previewModalImg');
  const modalFallback = document.getElementById('previewModalFallback');
  const modalTitle = document.getElementById('previewModalTitle');
  const modalSubtitle = document.getElementById('previewModalSubtitle');
  const closeBtn = document.getElementById('previewModalClose');
  if (!modal || !modalImg || !modalFallback || !modalTitle || !modalSubtitle || !closeBtn) return;

  function openModal({ imageSrc, imageAlt, fallbackHtml, title, subtitle }) {
    if (imageSrc) {
      modalImg.src = imageSrc;
      modalImg.alt = imageAlt || title;
      modalImg.style.display = '';
      modalFallback.style.display = 'none';
    } else {
      modalImg.src = '';
      modalImg.alt = '';
      modalImg.style.display = 'none';
      modalFallback.innerHTML = fallbackHtml || '<span>No preview image available.</span>';
      modalFallback.style.display = 'flex';
    }

    modalTitle.textContent = title;
    modalSubtitle.textContent = subtitle;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  const certCards = document.querySelectorAll('.cert-card:not(.cert-placeholder)');
  certCards.forEach(card => {
    const certImage = card.querySelector('.cert-img');
    if (!certImage) return;

    card.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      openModal({
        imageSrc: certImage.src,
        imageAlt: certImage.alt || card.querySelector('.cert-content h4')?.textContent || 'Certificate preview',
        fallbackHtml: '',
        title: card.querySelector('.cert-content h4')?.textContent || 'Certificate Preview',
        subtitle: card.querySelector('.cert-issuer')?.textContent || '',
      });
    });
  });

  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const firstImage = card.querySelector('.project-gallery img');
    const projectTitle = card.querySelector('.project-title')?.textContent || 'Project Preview';
    const projectDescription = card.querySelector('.project-desc')?.textContent.trim() || '';
    const tagList = Array.from(card.querySelectorAll('.project-tags .ptag')).map(tag => tag.textContent.trim()).filter(Boolean).join(' · ');
    const subtitle = tagList || projectDescription;
    const projectVisual = card.querySelector('.project-visual');
    const fallbackHtml = projectVisual ? projectVisual.innerHTML : '';

    card.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      openModal({
        imageSrc: firstImage?.src || '',
        imageAlt: firstImage?.alt || projectTitle,
        fallbackHtml,
        title: projectTitle,
        subtitle,
      });
    });
  });

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.classList.contains('preview-modal-backdrop')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });
})();

/* ─── 14. DOWNLOAD CV ─── */
(function initDownload() {
  const btn = document.getElementById('downloadBtn');
  if (!btn) return;
  
  // Show a confirmation toast when CV is downloaded
  btn.addEventListener('click', () => {
    setTimeout(() => {
      showToast('✅ CV downloading...');
    }, 300);
  });
})();

/* ─── 14. MOUSE GLOW EFFECT ─── */
(function initMouseGlow() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(2);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(2);
    hero.style.setProperty('--mouse-x', x + '%');
    hero.style.setProperty('--mouse-y', y + '%');
  });
})();

/* ─── 15. SMOOTH SCROLL FOR NAV ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ─── 16. HERO ENTRANCE ANIMATION ─── */
(function initHeroEntrance() {
  const items = document.querySelectorAll('.hero-greeting, .hero-name, .hero-role, .hero-bio, .hero-actions, .hero-socials, .hero-avatar');
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    el.style.transitionDelay = `${i * 120 + 200}ms`;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
})();

/* ─── 17. PROJECT CARD TILT EFFECT ─── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy * -6).toFixed(2);
      const rotY = ((x - cx) / cx * 6).toFixed(2);
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    });
  });
})();

/* ─── 18. SECTION BG PARALLAX ─── */
(function initParallax() {
  const blobs = document.querySelectorAll('.blob');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    blobs.forEach((blob, i) => {
      const speed = (i + 1) * 0.08;
      blob.style.transform = `translateY(${y * speed}px)`;
    });
  }, { passive: true });
})();

console.log('%c🚀 Jesseph Mariño Portfolio', 'color:#00d4ff;font-size:18px;font-weight:bold;');
console.log('%cBuilt with HTML · CSS · JavaScript', 'color:#8b5cf6;font-size:12px;');
