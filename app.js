/**
 * Muskan Gurjar — Portfolio Website Interactions
 * Senior Frontend & Accessibility Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scrolled Styling
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu with Backdrop & Body Scroll Lock
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  function openMobileMenu() {
    if (!mobileToggle || !navLinks) return;
    mobileToggle.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('menu-open');

    const icon = mobileToggle.querySelector('svg');
    if (icon) {
      icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`;
    }
  }

  function closeMobileMenu() {
    if (!mobileToggle || !navLinks) return;
    mobileToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('menu-open');

    const icon = mobileToggle.querySelector('svg');
    if (icon) {
      icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />`;
    }
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when tapping any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close when tapping backdrop
    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => {
        closeMobileMenu();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMobileMenu();
        mobileToggle.focus();
      }
    });
  }

  // 3. Active Link Scrollspy with Section Mapping & Bottom-of-Page Detection
  const navItems = document.querySelectorAll('.nav-link');
  const sectionIds = ['home', 'about', 'skills', 'projects', 'education', 'learning', 'contact'];
  
  // Section alias map: maps sections without direct nav link to parent nav link
  const navAliasMap = {
    'learning': 'education'
  };

  function setActiveNavLink(targetId) {
    const activeId = navAliasMap[targetId] || targetId;
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === `#${activeId}`) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });
  }

  // IntersectionObserver for reliable section detection
  const sectionElements = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sectionElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          setActiveNavLink(id);
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sectionElements.forEach(section => observer.observe(section));
  }

  // Window scroll fallback for bottom of page
  window.addEventListener('scroll', () => {
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
    if (isAtBottom) {
      setActiveNavLink('contact');
    }
  }, { passive: true });

  // 4. Toast Notification Utility
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMessage');
  let toastTimer;

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3600);
  }

  // 5. Copy Email to Clipboard Helper
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = copyEmailBtn.getAttribute('data-email') || 'muskangurjer@gmail.com';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = email;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        showToast('Email copied to clipboard: ' + email);
      } catch (err) {
        showToast('Direct email: ' + email);
      }
    });
  }

  // 6. Transparent & Functional Contact Form (Pre-populated Direct Email Client Dispatch)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const subjectInput = document.getElementById('userSubject');
      const messageInput = document.getElementById('userMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        return;
      }

      const recipient = 'muskangurjer@gmail.com';
      const emailBody = `Hi Muskan,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`;
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

      if (formStatus) {
        formStatus.textContent = `Opening your default email client to send message to ${recipient}...`;
        formStatus.className = 'form-status-msg info';
      }
      showToast('Opening email client for: ' + recipient);

      // Open mailto link
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);
    });
  }

  // 7. Dynamic Footer Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
