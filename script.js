// ============================================================
//  PORTFOLIO SCRIPT – Interactions & Animations
// ============================================================

/* ===== NAVBAR: scroll effect + active link ===== */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  // Sticky glass nav
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link highlight
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const isOpen = navMenu.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Animate hamburger to X
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ===== SCROLL REVEAL ===== */
const revealElements = document.querySelectorAll(
  '.section-header, .about-grid, .skill-category, .project-card, .timeline-item, .cert-card, .achievements-box, .contact-wrapper, .stat-card, .interest-tag'
);

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = Array.from(entry.target.parentElement.children);
      const index = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => observer.observe(el));

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    formNote.textContent = 'Please fill in all required fields.';
    formNote.style.color = '#f87171';
    return;
  }

  // Simulate sending
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  setTimeout(() => {
    formNote.textContent = '✅ Message sent! I\'ll get back to you soon.';
    formNote.style.color = '#34d399';
    contactForm.reset();
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    setTimeout(() => { formNote.textContent = ''; }, 5000);
  }, 1500);
});

/* ===== CURSOR GLOW (desktop only) ===== */
if (window.matchMedia('(hover: hover)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
}

/* ===== TYPING EFFECT for hero greeting ===== */
const greetings = ['Hello, I\'m', 'नमस्ते, I\'m', 'Hi there, I\'m'];
let greetIdx = 0;
const greetingEl = document.querySelector('.hero-greeting');

if (greetingEl) {
  setInterval(() => {
    greetIdx = (greetIdx + 1) % greetings.length;
    greetingEl.style.opacity = '0';
    setTimeout(() => {
      greetingEl.textContent = greetings[greetIdx];
      greetingEl.style.opacity = '1';
      greetingEl.style.transition = 'opacity 0.5s';
    }, 300);
  }, 3500);
}

/* ===== SMOOTH page load animation ===== */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';
  });
});

/* ============================================================
   AI CHATBOT
   ============================================================ */
(function () {
  const toggle     = document.getElementById('chatbotToggle');
  const panel      = document.getElementById('chatbotPanel');
  const closeBtn   = document.getElementById('chatbotClose');
  const input      = document.getElementById('chatbotInput');
  const sendBtn    = document.getElementById('chatbotSend');
  const messages   = document.getElementById('chatbotMessages');
  const suggestBox = document.getElementById('chatbotSuggestions');
  const openIcon   = toggle.querySelector('.open-icon');
  const closeIcon  = toggle.querySelector('.close-icon');

  // Conversation history (for multi-turn memory)
  let history = [];
  let isOpen  = false;
  let isBusy  = false;

  // ── Open / Close ──
  function openChat() {
    isOpen = true;
    panel.classList.add('open');
    openIcon.style.display = 'none';
    closeIcon.style.display = 'flex';
    input.focus();
  }
  function closeChat() {
    isOpen = false;
    panel.classList.remove('open');
    openIcon.style.display = 'flex';
    closeIcon.style.display = 'none';
  }

  toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  // ── Render a message bubble ──
  function appendMessage(role, text) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('chat-msg', role);
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble');
    bubble.textContent = text;
    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
    return wrapper;
  }

  // ── Typing indicator ──
  function showTyping() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('chat-msg', 'bot');
    wrapper.id = 'typingIndicator';
    wrapper.innerHTML = `
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>`;
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  }
  function hideTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  // ── Send message ──
  async function sendMessage(text) {
    if (!text.trim() || isBusy) return;
    isBusy = true;
    sendBtn.disabled = true;

    // Hide suggestions after first message
    if (suggestBox) suggestBox.style.display = 'none';

    // Add user bubble
    appendMessage('user', text);
    input.value = '';

    // Add to history
    history.push({ role: 'user', content: text });

    // Show typing
    showTyping();

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      hideTyping();

      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't get a response right now.";

      // Add bot bubble
      appendMessage('bot', reply);
      history.push({ role: 'assistant', content: reply });

    } catch (err) {
      hideTyping();
      appendMessage('bot', '⚠️ Something went wrong. Please try again later.');
      console.error('Chatbot error:', err);
    }

    isBusy = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // ── Event listeners ──
  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  // ── Quick suggestion buttons ──
  document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.textContent));
  });

})();

