const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('theme-toggle');
const backToTopButton = document.getElementById('back-to-top');
const chatToggle = document.getElementById('chat-toggle');
const chatPopup = document.getElementById('chat-popup');
const closeChatButton = document.getElementById('close-chat');
const patientForm = document.getElementById('patient-form');
const volunteerForm = document.getElementById('volunteer-form');
const contactForm = document.getElementById('contact-form');
const patientSummary = document.getElementById('patient-summary');
const volunteerSummary = document.getElementById('volunteer-summary');
const faqForm = document.getElementById('faq-form');
const popupFaqForm = document.getElementById('popup-faq-form');
const faqInput = document.getElementById('faq-input');
const popupFaqInput = document.getElementById('popup-faq-input');
const chatWindow = document.getElementById('chat-window');
const popupChatWindow = document.getElementById('popup-chat-window');
const yearLabel = document.getElementById('year');
const loadingOverlay = document.getElementById('loading-overlay');
const successModal = document.getElementById('success-modal');
const requestIdLabel = document.getElementById('request-id');
const successMessage = document.getElementById('success-message');
const modalCopyBtn = document.getElementById('modal-copy');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCloseX = document.getElementById('close-success');

if (yearLabel) {
  yearLabel.textContent = new Date().getFullYear();
}

const faqAnswers = {
  emergency: 'You can request urgent support through our Patient Support form or call our hotline for immediate guidance.',
  free: 'Yes, we offer free wellness guidance and referral support for eligible patients and families.',
  volunteer: 'You can register as a volunteer by filling out our volunteer form and sharing your availability and skills.',
  clinic: 'Our outreach clinics rotate by community; we will share the latest schedule after your request is reviewed.',
  medicine: 'We can help coordinate medicine access and essential supplies for qualifying patients.',
  default: 'I can help with urgent support, volunteering, clinic updates, and wellness guidance. Try one of the quick questions above.'
};

function addMessage(text, type, target) {
  const message = document.createElement('div');
  message.className = `message ${type}`;
  const wrap = document.createElement('div');
  wrap.className = 'msg-wrap';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  wrap.appendChild(bubble);
  message.appendChild(wrap);
  target.appendChild(message);
  target.scrollTop = target.scrollHeight;
}

function getFaqReply(question) {
  const text = question.toLowerCase();
  if (text.includes('urgent') || text.includes('emergency')) return faqAnswers.emergency;
  if (text.includes('free') || text.includes('consult')) return faqAnswers.free;
  if (text.includes('volunteer') || text.includes('help')) return faqAnswers.volunteer;
  if (text.includes('clinic') || text.includes('outreach')) return faqAnswers.clinic;
  if (text.includes('medicine') || text.includes('drug') || text.includes('supply')) return faqAnswers.medicine;
  return faqAnswers.default;
}

function handleFaqSubmit(event, inputEl, target) {
  event.preventDefault();
  const question = inputEl.value.trim();
  if (!question) return;
  addMessage(question, 'user', target);
  inputEl.value = '';
  addMessage('...', 'typing', target);
  const answer = getFaqReply(question);
  setTimeout(() => {
    const typing = target.querySelector('.message.typing');
    if (typing) typing.remove();
    addMessage(answer, 'bot', target);
  }, 700);
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // NEW: tapping a nav link on mobile now closes the menu instead of
  // leaving it open over the section you just jumped to.
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (themeToggle) {
  const savedTheme = localStorage.getItem('ngo-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('ngo-theme', isDark ? 'dark' : 'light');
  });
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

// Count-up stats when visible (powers both the hero stats and the
// new "Our Impact" section automatically, since both use .stat-animate)
const statItems = document.querySelectorAll('.stat-animate');
if (statItems.length && 'IntersectionObserver' in window) {
  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.animated) return;
      el.dataset.animated = 'true';
      const target = Number(el.getAttribute('data-target')) || 0;
      const display = el.querySelector('.stat-value');
      const duration = 1600;
      const startTime = Date.now();
      (function tick() {
        const now = Date.now();
        const progress = Math.min(1, (now - startTime) / duration);
        const value = Math.floor(progress * target);
        display.textContent = value >= 1000 ? (Math.floor(value / 100) / 10) + 'k' : value;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          display.textContent = target >= 1000 ? (Math.floor(target / 100) / 10) + 'k' : target;
          el.classList.add('animate');
        }
      })();
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  statItems.forEach(si => statObserver.observe(si));
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 520) {
    backToTopButton?.classList.add('show');
  } else {
    backToTopButton?.classList.remove('show');
  }
});

backToTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function openChatPopup() {
  chatPopup?.classList.add('open');
  chatToggle?.setAttribute('aria-expanded', 'true');
  // NEW: send focus into the chat input so keyboard/screen-reader users
  // land straight in the conversation instead of on the page behind it
  popupFaqInput?.focus();
}

function closeChatPopup() {
  chatPopup?.classList.remove('open');
  chatToggle?.setAttribute('aria-expanded', 'false');
}

chatToggle?.addEventListener('click', () => {
  if (chatPopup?.classList.contains('open')) {
    closeChatPopup();
  } else {
    openChatPopup();
  }
});

closeChatButton?.addEventListener('click', closeChatPopup);

// NEW: Escape closes the chat popup, and clicking outside it closes it too
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeChatPopup();
    closeSuccessModal();
  }
});

document.addEventListener('click', (event) => {
  if (!chatPopup?.classList.contains('open')) return;
  const clickedInsidePopup = chatPopup.contains(event.target);
  const clickedToggle = chatToggle?.contains(event.target);
  if (!clickedInsidePopup && !clickedToggle) {
    closeChatPopup();
  }
});

if (faqForm) {
  faqForm.addEventListener('submit', (event) => handleFaqSubmit(event, faqInput, chatWindow));
}

if (popupFaqForm) {
  popupFaqForm.addEventListener('submit', (event) => handleFaqSubmit(event, popupFaqInput, popupChatWindow));
}

document.querySelectorAll('.quick-questions button, .popup-questions button').forEach((button) => {
  button.addEventListener('click', () => {
    const question = button.getAttribute('data-question');
    const target = button.closest('.faq-card') ? chatWindow : popupChatWindow;
    const input = button.closest('.faq-card') ? faqInput : popupFaqInput;
    if (question) {
      addMessage(question, 'user', target);
      addMessage('...', 'typing', target);
      setTimeout(() => {
        const typing = target.querySelector('.message.typing');
        if (typing) typing.remove();
        addMessage(getFaqReply(question), 'bot', target);
      }, 500);
      if (input) input.value = '';
    }
  });
});

function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = '#e76262';
    } else {
      field.style.borderColor = '';
    }
  });

  const emailField = form.querySelector('input[type="email"]');
  if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
    isValid = false;
    emailField.style.borderColor = '#e76262';
  }

  return isValid;
}

function showSummary(form, summaryBox, title) {
  const data = new FormData(form);
  const name = data.get(form.id === 'patient-form' ? 'patient-name' : 'volunteer-name');
  const need = data.get(form.id === 'patient-form' ? 'patient-need' : 'volunteer-role');
  const message = data.get(form.id === 'patient-form' ? 'patient-message' : 'volunteer-message');
  summaryBox.innerHTML = `<strong>${title}</strong><br>We received your request from <strong>${name}</strong> for <strong>${need}</strong>.<br><em>${message}</em><br><br>Our care team will contact you soon with next steps.`;
  summaryBox.classList.add('show');
}

function generateRequestId(prefix = 'HS') {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${ts}-${rand}`;
}

function openSuccessModal(id, messageText) {
  if (!successModal) return;
  requestIdLabel.textContent = id;
  successMessage.textContent = messageText || 'We have received your request.';
  successModal.classList.add('open');
  successModal.setAttribute('aria-hidden', 'false');
  // NEW: send focus to the modal's close button for keyboard/screen-reader users
  modalCloseBtn?.focus();
}

function closeSuccessModal() {
  if (!successModal) return;
  successModal.classList.remove('open');
  successModal.setAttribute('aria-hidden', 'true');
}

// NEW: clicking the dark backdrop (outside the white card) also closes the modal
successModal?.addEventListener('click', (event) => {
  if (event.target === successModal) {
    closeSuccessModal();
  }
});

if (modalCopyBtn) {
  modalCopyBtn.addEventListener('click', () => {
    const id = requestIdLabel?.textContent || '';
    navigator.clipboard?.writeText(id).then(() => {
      modalCopyBtn.textContent = 'Copied';
      setTimeout(() => modalCopyBtn.textContent = 'Copy ID', 1400);
    }).catch(() => {});
  });
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeSuccessModal);
if (modalCloseX) modalCloseX.addEventListener('click', closeSuccessModal);

patientForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateForm(patientForm)) {
    patientSummary.innerHTML = 'Please complete all required fields before submitting your request.';
    patientSummary.classList.add('show');
    return;
  }
  showSummary(patientForm, patientSummary, 'Patient support request confirmed');
  const id = generateRequestId('PS');
  openSuccessModal(id, 'Your patient support request has been submitted.');
  patientForm.reset();
});

volunteerForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateForm(volunteerForm)) {
    volunteerSummary.innerHTML = 'Please complete all required fields before registering.';
    volunteerSummary.classList.add('show');
    return;
  }
  showSummary(volunteerForm, volunteerSummary, 'Volunteer registration confirmed');
  const id = generateRequestId('VR');
  openSuccessModal(id, 'Thank you for registering as a volunteer.');
  volunteerForm.reset();
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateForm(contactForm)) {
    alert('Please complete all contact details before sending your message.');
    return;
  }
  const id = generateRequestId('CT');
  openSuccessModal(id, 'Thank you for reaching out. Our team will respond shortly.');
  contactForm.reset();
});

// DOM ready and loader handling
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (loadingOverlay) loadingOverlay.style.display = 'none';
  }, 650);
});