document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');
  const signinBtn = document.getElementById('signin-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const heroSignin = document.getElementById('hero-signin');
  const modal = document.getElementById('signin-modal');
  const modalClose = document.getElementById('modal-close');
  const signinForm = document.getElementById('signin-form');
  const marketingView = document.getElementById('marketing-view');
  const dashboardView = document.getElementById('dashboard-view');
  const documentForm = document.getElementById('document-form');
  const successMessage = document.getElementById('success-message');
  const submitAnotherBtn = document.getElementById('submit-another');
  const contactForm = document.getElementById('contact-form');

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const sections = document.querySelectorAll('#marketing-view .section');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    if (dashboardView.style.display !== 'none') return;
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (id && scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  signinBtn.addEventListener('click', openModal);
  if (heroSignin) heroSignin.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  function showDashboard() {
    marketingView.style.display = 'none';
    dashboardView.style.display = 'block';
    signinBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-flex';
    nav.style.display = 'none';
    menuToggle.style.display = 'none';
    closeModal();
    window.scrollTo(0, 0);
  }

  function showMarketing() {
    marketingView.style.display = 'block';
    dashboardView.style.display = 'none';
    signinBtn.style.display = 'inline-flex';
    logoutBtn.style.display = 'none';
    nav.style.display = '';
    menuToggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    documentForm.reset();
    documentForm.style.display = 'block';
    successMessage.style.display = 'none';
    document.querySelectorAll('.file-name').forEach(el => {
      el.textContent = 'No file chosen';
      el.classList.remove('has-file');
    });
    window.scrollTo(0, 0);
  }

  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showDashboard();
    signinForm.reset();
  });

  logoutBtn.addEventListener('click', showMarketing);

  const fileInputs = [
    { input: 'invoice', name: 'invoice-name' },
    { input: 'purchase-order', name: 'purchase-order-name' },
    { input: 'proof-of-delivery', name: 'proof-of-delivery-name' },
    { input: 'id-document', name: 'id-document-name' },
    { input: 'bank-statement', name: 'bank-statement-name' },
    { input: 'cipc-document', name: 'cipc-document-name' }
  ];

  fileInputs.forEach(({ input, name }) => {
    const fileInput = document.getElementById(input);
    const nameSpan = document.getElementById(name);
    if (!fileInput || !nameSpan) return;
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        nameSpan.textContent = fileInput.files[0].name;
        nameSpan.classList.add('has-file');
      } else {
        nameSpan.textContent = 'No file chosen';
        nameSpan.classList.remove('has-file');
      }
    });
  });

  documentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    documentForm.style.display = 'none';
    successMessage.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  submitAnotherBtn.addEventListener('click', () => {
    documentForm.reset();
    documentForm.style.display = 'block';
    successMessage.style.display = 'none';
    document.querySelectorAll('.file-name').forEach(el => {
      el.textContent = 'No file chosen';
      el.classList.remove('has-file');
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your message has been received. We will get back to you soon.');
      contactForm.reset();
    });
  }
});
